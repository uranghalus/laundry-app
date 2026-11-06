<?php

namespace App\Enums;

/**
 * Tujuan penerbitan kode OTP, dipakai untuk memisahkan kode antar alur.
 */
enum OtpPurpose: string
{
    case Register = 'register';
    case OutletWa = 'outlet_wa';
}
