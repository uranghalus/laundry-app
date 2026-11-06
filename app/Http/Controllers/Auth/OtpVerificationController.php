<?php

namespace App\Http\Controllers\Auth;

use App\Enums\OtpPurpose;
use App\Http\Controllers\Controller;
use App\Services\Otp\OtpService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller verifikasi OTP nomor HP setelah registrasi akun.
 *
 * Halaman ini hanya menangani verifikasi nomor HP. Setup bisnis dan outlet
 * dilakukan pada langkah onboarding berikutnya.
 */
class OtpVerificationController extends Controller
{
    /**
     * Tampilkan halaman verifikasi OTP.
     *
     * User yang nomornya sudah terverifikasi langsung diarahkan ke onboarding
     * bisnis.
     */
    public function show(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        if ($user->hasVerifiedPhone()) {
            return redirect('/onboarding/business');
        }

        return Inertia::render('onboarding/verify', [
            'phone' => $this->maskPhone((string) $user->phone),
        ]);
    }

    /**
     * Verifikasi kode OTP yang dimasukkan user.
     *
     * @throws ValidationException bila kode salah, kedaluwarsa, atau percobaan habis
     */
    public function verify(Request $request, OtpService $otpService): RedirectResponse
    {
        $validated = $request->validate([
            'code' => ['required', 'digits:6'],
        ], [
            'code.required' => 'Kode OTP wajib diisi.',
            'code.digits' => 'Kode OTP harus terdiri dari 6 digit angka.',
        ]);

        $user = $request->user();

        $verified = $otpService->verify(
            (string) $user->phone,
            (string) $validated['code'],
            OtpPurpose::Register,
        );

        if (! $verified) {
            throw ValidationException::withMessages([
                'code' => 'Kode OTP salah, sudah kedaluwarsa, atau percobaan sudah habis. Minta kode baru.',
            ]);
        }

        $user->forceFill(['phone_verified_at' => now()])->save();

        return redirect('/onboarding/business');
    }

    /**
     * Kirim ulang kode OTP ke nomor HP user.
     *
     * @throws ValidationException bila masih dalam masa cooldown pengiriman
     */
    public function resend(Request $request, OtpService $otpService): RedirectResponse
    {
        $user = $request->user();

        if ($user->hasVerifiedPhone()) {
            return redirect('/onboarding/business');
        }

        $otpService->issue((string) $user->phone, OtpPurpose::Register);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Kode OTP baru sudah dikirim ke nomor HP Anda.',
        ]);

        return back();
    }

    /**
     * Samarkan nomor HP agar tidak ditampilkan lengkap.
     *
     * Contoh: 6281234567890 menjadi 6281****7890.
     */
    private function maskPhone(string $phone): string
    {
        if (strlen($phone) <= 7) {
            return $phone;
        }

        return substr($phone, 0, 4).'****'.substr($phone, -4);
    }
}
