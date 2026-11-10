<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller langkah tipe bisnis pada wizard onboarding multi-tenant.
 *
 * User yang nomor HP-nya sudah terverifikasi mengisi nama usaha dan tipe
 * bisnis (single/multi), lalu sistem membuat Tenant berstatus trial dan
 * menautkannya ke user sebagai owner. Langkah outlet menyusul pada B6.
 */
class BusinessTypeController extends Controller
{
    /**
     * Arahkan user ke langkah wizard yang sedang berjalan.
     *
     * Penanda sementara versi B5 agar /onboarding tidak lagi 404; isi finalnya
     * baru ditetapkan di B7 lewat redirectToStep().
     */
    public function index(Request $request): RedirectResponse
    {
        $user = $request->user();

        if (! $user->hasVerifiedPhone()) {
            return redirect()->route('onboarding.verify');
        }

        if ($user->tenant_id === null) {
            return redirect('/onboarding/business');
        }

        return redirect('/onboarding/outlet');
    }

    /**
     * Tampilkan halaman tipe bisnis.
     *
     * User yang sudah punya tenant dianggap selesai langkah ini dan langsung
     * diarahkan ke langkah outlet berikutnya.
     */
    public function show(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        if ($user->tenant_id !== null) {
            return redirect('/onboarding/outlet');
        }

        return Inertia::render('onboarding/business-type');
    }

    /**
     * Simpan data bisnis, buat tenant trial, dan tautkan ke user sebagai owner.
     *
     * Sumber kebenaran "sudah selesai" adalah users.tenant_id, bukan nama
     * tenant — membuat tenant per nama berisiko duplikat saat double submit
     * atau rename. Baris user dikunci selama transaksi agar submit paralel
     * tetap hanya menghasilkan satu tenant.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'business_name' => ['required', 'string', 'max:120'],
            'business_type' => ['required', 'in:single,multi'],
        ], [
            'business_name.required' => 'Nama usaha wajib diisi.',
            'business_name.max' => 'Nama usaha maksimal 120 karakter.',
            'business_type.required' => 'Tipe bisnis wajib dipilih.',
            'business_type.in' => 'Tipe bisnis tidak valid.',
        ]);

        $userId = $request->user()->id;

        DB::transaction(function () use ($userId, $validated): void {
            $user = User::query()->lockForUpdate()->find($userId);

            // User yang sudah punya tenant dianggap selesai langkah ini
            // (double submit), jadi tidak membuat tenant baru.
            if ($user === null || $user->tenant_id !== null) {
                return;
            }

            $tenant = Tenant::create([
                'name' => $validated['business_name'],
                'business_type' => $validated['business_type'],
                'status' => 'trial',
            ]);

            $user->forceFill([
                'tenant_id' => $tenant->id,
                'role' => 'owner',
            ])->save();
        });

        return redirect('/onboarding/outlet');
    }
}
