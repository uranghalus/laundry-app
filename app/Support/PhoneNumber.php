<?php

namespace App\Support;

/**
 * Utilitas normalisasi nomor telepon Indonesia.
 *
 * Satu sumber kebenaran penulisan nomor ke format 628xxxxxxxxxx, dipakai
 * registrasi (nomor HP user) dan langkah outlet (nomor WhatsApp outlet).
 */
class PhoneNumber
{
    /**
     * Normalisasi nomor telepon ke format 628xxxxxxxxxx.
     *
     * Buang semua karakter non-digit, lalu tambahkan awalan 62 bila nomor
     * diawali 0 atau 8 (tanpa kode negara). Format lain dikembalikan apa
     * adanya: kepanjangan/kependekan nomor bukan urusan normalisasi, itu
     * urusan rule validasi pemanggil.
     */
    public static function normalize(string $phone): string
    {
        $phone = preg_replace('/[^0-9]/', '', $phone);

        if (str_starts_with($phone, '0')) {
            return '62'.substr($phone, 1);
        }

        return str_starts_with($phone, '8') ? '62'.$phone : $phone;
    }
}
