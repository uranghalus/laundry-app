<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Model Payment - Pembayaran subscription
 * Gateway: Midtrans atau Xendit
 */
class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_subscription_id',
        'gateway',
        'amount',
        'status',
        'gateway_transaction_id',
        'paid_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'status' => 'string',
        'paid_at' => 'datetime',
    ];

    /**
     * Relasi ke tenant subscription
     */
    public function tenantSubscription(): BelongsTo
    {
        return $this->belongsTo(TenantSubscription::class);
    }

    /**
     * Cek apakah pembayaran berhasil
     */
    public function isSuccess(): bool
    {
        return $this->status === 'success';
    }

    /**
     * Cek apakah pembayaran pending
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Cek apakah pembayaran gagal
     */
    public function isFailed(): bool
    {
        return $this->status === 'failed';
    }

    /**
     * Mark sebagai success
     */
    public function markSuccess(string $gatewayTransactionId): bool
    {
        $this->status = 'success';
        $this->gateway_transaction_id = $gatewayTransactionId;
        $this->paid_at = now();

        return $this->save();
    }

    /**
     * Mark sebagai failed
     */
    public function markFailed(): bool
    {
        $this->status = 'failed';

        return $this->save();
    }
}
