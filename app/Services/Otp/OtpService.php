<?php

namespace App\Services\Otp;

use App\Contracts\OtpSender;
use App\Enums\OtpPurpose;
use App\Models\OtpCode;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

/**
 * Penerbit dan pemverifikasi kode OTP sekali pakai.
 *
 * Kode disimpan sebagai hash, dibatasi masa berlaku, dan dikunci setelah
 * sejumlah percobaan gagal. Cooldown pengiriman ulang mencegah spam.
 */
class OtpService
{
    public function __construct(private OtpSender $sender) {}

    /**
     * Menerbitkan kode OTP baru untuk nomor HP dan purpose tertentu.
     *
     * @throws ValidationException bila masih dalam masa cooldown pengiriman ulang
     */
    public function issue(string $phone, OtpPurpose $purpose): void
    {
        $cooldown = (int) config('services.otp.resend_cooldown', 60);

        $latest = OtpCode::query()
            ->where('phone', $phone)
            ->where('purpose', $purpose->value)
            ->latest('id')
            ->first();

        if ($latest !== null && $latest->created_at !== null) {
            $elapsed = now()->getTimestamp() - $latest->created_at->getTimestamp();

            if ($elapsed < $cooldown) {
                $remaining = max(1, $cooldown - $elapsed);

                throw ValidationException::withMessages([
                    'phone' => "Tunggu {$remaining} detik lagi sebelum meminta kode OTP baru.",
                ]);
            }
        }

        $code = (string) random_int(100000, 999999);
        $ttl = (int) config('services.otp.code_ttl', 300);

        DB::transaction(function () use ($phone, $purpose, $code, $ttl): void {
            // Hanya kode terbaru yang berlaku; kode lama langsung dibatalkan.
            OtpCode::query()
                ->where('phone', $phone)
                ->where('purpose', $purpose->value)
                ->whereNull('consumed_at')
                ->update(['consumed_at' => now()]);

            OtpCode::create([
                'phone' => $phone,
                'code_hash' => Hash::make($code),
                'purpose' => $purpose,
                'expires_at' => now()->addSeconds($ttl),
                'attempts' => 0,
            ]);
        });

        $this->sender->send($phone, $code);
    }

    /**
     * Memverifikasi kode OTP terbaru untuk nomor HP dan purpose tertentu.
     */
    public function verify(string $phone, string $code, OtpPurpose $purpose): bool
    {
        $maxAttempts = (int) config('services.otp.max_attempts', 5);

        $otp = OtpCode::query()
            ->where('phone', $phone)
            ->where('purpose', $purpose->value)
            ->whereNull('consumed_at')
            ->latest('id')
            ->first();

        if ($otp === null) {
            return false;
        }

        if ($otp->attempts >= $maxAttempts || $otp->isExpired()) {
            return false;
        }

        if (! Hash::check($code, $otp->code_hash)) {
            $otp->increment('attempts');

            return false;
        }

        $otp->forceFill(['consumed_at' => now()])->save();

        return true;
    }
}
