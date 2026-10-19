<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\Outlet;
use App\Models\SubscriptionPlan;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller untuk registrasi tenant baru
 * Alur: Register -> OTP WhatsApp -> Onboarding (pilih tipe bisnis + setup outlet) -> Pilih Plan
 */
class RegisterController extends Controller
{
    /**
     * Tampilkan halaman registrasi
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Proses registrasi tenant baru
     * Membuat tenant, outlet pertama, owner user, dan subscription trial
     */
    public function store(RegisterRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        return DB::transaction(function () use ($validated) {
            // 1. Buat tenant
            $tenant = Tenant::create([
                'name' => $validated['name'],
                'business_type' => $validated['business_type'],
                'status' => 'trial',
            ]);

            // 2. Buat outlet pertama
            $outlet = Outlet::create([
                'tenant_id' => $tenant->id,
                'name' => $validated['outlet_name'],
                'address' => $validated['outlet_address'],
                'whatsapp_number' => $this->normalizePhone($validated['outlet_whatsapp_number']),
                'operating_hours' => [
                    'open' => '08:00',
                    'close' => '21:00',
                ],
            ]);

            // 3. Buat user owner
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'phone' => $this->normalizePhone($validated['phone']),
                'role' => 'owner',
                'status' => 'active',
                'tenant_id' => $tenant->id,
                'outlet_id' => $outlet->id,
                'email_verified_at' => now(), // Skip email verification for now, use WhatsApp OTP
            ]);

            // 4. Buat subscription trial (14 hari)
            $basicPlan = SubscriptionPlan::where('name', 'Basic')->firstOrFail();
            $tenant->subscription()->create([
                'plan_id' => $basicPlan->id,
                'status' => 'trial',
                'start_date' => now(),
                'end_date' => now()->addDays(14),
            ]);

            // 5. Fire registered event
            event(new Registered($user));

            // 6. Login user
            Auth::login($user);

            // 7. Redirect ke halaman pemilihan plan (atau dashboard jika sudah ada plan)
            return redirect()->route('onboarding.plan');
        });
    }

    /**
     * Normalisasi nomor telepon ke format 628xxxxxxxxxx
     */
    private function normalizePhone(string $phone): string
    {
        $phone = preg_replace('/[^0-9]/', '', $phone);

        if (str_starts_with($phone, '0')) {
            $phone = '62'.substr($phone, 1);
        } elseif (str_starts_with($phone, '62')) {
            // Already in correct format
        } elseif (str_starts_with($phone, '8')) {
            $phone = '62'.$phone;
        }

        return $phone;
    }
}
