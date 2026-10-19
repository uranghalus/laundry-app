<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * Model TenantSubscription - Subscription aktif tenant
 * Menghubungkan tenant dengan plan, mengelola status billing
 */
class TenantSubscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'plan_id',
        'status', // active, expired, trial
        'start_date',
        'end_date',
        'payment_gateway_ref',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'status' => 'string',
    ];

    /**
     * Relasi ke tenant
     */
    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    /**
     * Relasi ke plan
     */
    public function plan(): BelongsTo
    {
        return $this->belongsTo(SubscriptionPlan::class);
    }

    /**
     * Relasi ke payments
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Cek apakah subscription aktif
     */
    public function isActive(): bool
    {
        return $this->status === 'active' && $this->end_date->isFuture();
    }

    /**
     * Cek apakah subscription expired
     */
    public function isExpired(): bool
    {
        return $this->status === 'expired' || $this->end_date->isPast();
    }

    /**
     * Cek apakah dalam masa trial
     */
    public function isTrial(): bool
    {
        return $this->status === 'trial';
    }

    /**
     * Cek apakah mendekati expired (H-3)
     */
    public function isExpiringSoon(): bool
    {
        return $this->end_date->diffInDays(Carbon::now()) <= 3 && $this->end_date->isFuture();
    }
}
