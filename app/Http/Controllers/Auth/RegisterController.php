<?php

namespace App\Http\Controllers\Auth;

use App\Enums\OtpPurpose;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use App\Services\Otp\OtpService;
use App\Support\PhoneNumber;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller untuk registrasi akun owner baru.
 *
 * Alur: daftar akun -> verifikasi OTP nomor HP -> onboarding tipe bisnis
 * dan setup outlet. Tenant dan outlet belum dibuat pada langkah ini.
 */
class RegisterController extends Controller
{
    /**
     * Tampilkan halaman registrasi akun.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register', [
            'passwordRules' => Password::defaults()->toPasswordRulesString(),
        ]);
    }

    /**
     * Buat akun owner tanpa tenant atau outlet, lalu terbitkan OTP nomor HP.
     */
    public function store(RegisterRequest $request, OtpService $otpService): RedirectResponse
    {
        $validated = $request->validated();
        $phone = $this->normalizePhone($validated['phone']);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'phone' => $phone,
            'role' => 'owner',
            'status' => 'active',
            'tenant_id' => null,
            'outlet_id' => null,
        ]);

        event(new Registered($user));

        Auth::login($user);

        $otpService->issue($phone, OtpPurpose::Register);

        return redirect()->route('onboarding.verify');
    }

    /**
     * Normalisasi nomor telepon ke format 628xxxxxxxxxx.
     *
     * Sumber kebenaran normalisasi berpindah ke App\Support\PhoneNumber agar
     * langkah outlet (dan modul lanjutan) menulis nomor dengan aturan sama.
     */
    private function normalizePhone(string $phone): string
    {
        return PhoneNumber::normalize($phone);
    }
}
