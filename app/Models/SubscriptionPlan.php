<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Model SubscriptionPlan - Paket langganan (Basic, Pro)
 * Mendefinisikan fitur, batas, dan harga per tier
 */
class SubscriptionPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'price_monthly',
        'price_annual',
        'feature_flags',
        'max_outlets',
        'max_users',
        'max_photos_per_month',
    ];

    protected $casts = [
        'price_monthly' => 'decimal:2',
        'price_annual' => 'decimal:2',
        'feature_flags' => 'array',
        'max_outlets' => 'integer',
        'max_users' => 'integer',
        'max_photos_per_month' => 'integer',
    ];

    /**
     * Relasi ke tenant subscriptions
     */
    public function tenantSubscriptions(): HasMany
    {
        return $this->hasMany(TenantSubscription::class);
    }

    /**
     * Cek apakah plan ini Basic
     */
    public function isBasic(): bool
    {
        return $this->name === 'Basic';
    }

    /**
     * Cek apakah plan ini Pro
     */
    public function isPro(): bool
    {
        return $this->name === 'Pro';
    }
}
