<?php

namespace App\Models;

use App\Enums\OtpPurpose;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * Model OtpCode - kode OTP sekali pakai untuk verifikasi nomor HP.
 * Kode disimpan dalam bentuk hash, bukan plaintext.
 *
 * @property int $id
 * @property string $phone
 * @property string $code_hash
 * @property OtpPurpose $purpose
 * @property Carbon $expires_at
 * @property int $attempts
 * @property Carbon|null $consumed_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class OtpCode extends Model
{
    protected $fillable = [
        'phone',
        'code_hash',
        'purpose',
        'expires_at',
        'attempts',
        'consumed_at',
    ];

    protected $casts = [
        'purpose' => OtpPurpose::class,
        'expires_at' => 'datetime',
        'consumed_at' => 'datetime',
        'attempts' => 'integer',
    ];

    /**
     * Cek apakah kode sudah melewati waktu berlaku.
     */
    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    /**
     * Cek apakah kode sudah pernah dipakai.
     */
    public function isConsumed(): bool
    {
        return $this->consumed_at !== null;
    }
}
