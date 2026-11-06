<?php

namespace App\Services\Otp;

use App\Contracts\OtpSender;
use Illuminate\Support\Facades\Log;

/**
 * Driver OTP untuk pengembangan: menulis kode ke log aplikasi.
 * Nomor HP disamarkan sebagian, kode sengaja terlihat agar bisa dites manual.
 */
class LogOtpSender implements OtpSender
{
    /**
     * Menulis kode OTP ke log dengan nomor HP tersamarkan.
     */
    public function send(string $phone, string $code): void
    {
        Log::info('Kode OTP dikirim ke nomor tersamarkan.', [
            'phone' => $this->maskPhone($phone),
            'code' => $code,
        ]);
    }

    /**
     * Menyamarkan bagian tengah nomor HP agar nomor utuh tidak masuk log.
     */
    private function maskPhone(string $phone): string
    {
        $length = strlen($phone);

        if ($length <= 7) {
            return str_repeat('*', $length);
        }

        return substr($phone, 0, 4).str_repeat('*', $length - 7).substr($phone, -3);
    }
}
