<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Outlet;
use App\Models\User;
use App\Support\PhoneNumber;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller langkah outlet pertama pada wizard onboarding multi-tenant.
 *
 * User yang nomor HP-nya sudah terverifikasi membuat outlet pertama milik
 * tenant-nya; outlet itu otomatis ditautkan ke user. Langkah selesai hanya
 * jadi target redirect berupa string (/onboarding/selesai) karena baru
 * diimplementasikan di B7.
 */
class OnboardingOutletController extends Controller
{
    /**
     * Tampilkan halaman outlet pertama.
     *
     * User tanpa tenant dikembalikan ke langkah tipe bisnis (progres linear).
     * User yang sudah terikat outlet — atau tenant-nya yang sudah punya
     * outlet — dianggap selesai langkah ini dan diarahkan ke langkah selesai.
     */
    public function show(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        if ($user->tenant_id === null) {
            return redirect('/onboarding/business');
        }

        if ($this->hasFirstOutlet($user)) {
            return redirect('/onboarding/selesai');
        }

        return Inertia::render('onboarding/outlet');
    }

    /**
     * Buat outlet pertama milik tenant user dan tautkan ke user.
     *
     * Sumber kebenaran "sudah selesai" adalah users.outlet_id atau adanya
     * outlet pada tenant — bukan nama outlet, karena nama bisa berubah dan
     * double submit bisa lolos lewat nama yang sama. Nomor WhatsApp
     * dinormalisasi sebelum validasi begitu dia masuk ke request, dan baris
     * user dikunci selama transaksi agar submit beruntun/paralel tetap hanya
     * menghasilkan satu outlet.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->tenant_id === null) {
            return redirect('/onboarding/business');
        }

        // Normalisasi dulu, baru divalidasi — konsisten dengan
        // prepareForValidation() pada RegisterRequest.
        $request->merge([
            'whatsapp_number' => PhoneNumber::normalize(
                (string) $request->input('whatsapp_number'),
            ),
        ]);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'address' => ['required', 'string', 'max:500'],
            'whatsapp_number' => ['required', 'regex:/^62[0-9]{7,13}$/'],
        ], [
            'name.required' => 'Nama outlet wajib diisi.',
            'name.max' => 'Nama outlet maksimal 120 karakter.',
            'address.required' => 'Alamat outlet wajib diisi.',
            'address.max' => 'Alamat outlet maksimal 500 karakter.',
            'whatsapp_number.required' => 'Nomor WhatsApp outlet wajib diisi.',
            'whatsapp_number.regex' => 'Nomor WhatsApp tidak valid. Gunakan format 08xxxxxxxxxx atau 628xxxxxxxxxx.',
        ]);

        $userId = $user->id;

        DB::transaction(function () use ($userId, $validated): void {
            $user = User::query()->lockForUpdate()->find($userId);

            // User yang sudah terikat outlet, atau tenant-nya yang sudah
            // punya outlet, dianggap selesai langkah ini (double submit) —
            // tidak membuat apa pun.
            if (
                $user === null
                || $user->outlet_id !== null
                || (int) $user->tenant?->outlets()->count() > 0
            ) {
                return;
            }

            $outlet = Outlet::create([
                'tenant_id' => $user->tenant_id,
                'name' => $validated['name'],
                'address' => $validated['address'],
                'whatsapp_number' => $validated['whatsapp_number'],
            ]);

            $user->forceFill(['outlet_id' => $outlet->id])->save();
        });

        return redirect('/onboarding/selesai');
    }

    /**
     * Guard R2: cek apakah langkah outlet pertama sudah selesai.
     *
     * User sudah terikat outlet ATAU tenant miliknya sudah punya outlet —
     * kasus kedua menjaga co-owner agar tidak membuat outlet lagi.
     */
    private function hasFirstOutlet(User $user): bool
    {
        return $user->outlet_id !== null
            || (int) $user->tenant->outlets()->count() > 0;
    }
}
