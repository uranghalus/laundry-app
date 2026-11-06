<?php

namespace App\Contracts;

/**
 * Kontrak pengiriman kode OTP ke nomor HP user.
 */
interface OtpSender
{
    /**
     * Mengirim kode OTP ke nomor HP tujuan.
     */
    public function send(string $phone, string $code): void;
}
