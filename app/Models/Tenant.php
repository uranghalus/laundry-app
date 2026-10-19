<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Model Tenant - Representasi bisnis laundry (multi-tenant)
 * Setiap tenant memiliki outlet, user, subscription, dan data operasional terpisah
 */
class Tenant extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'business_type', // single, multi
        'status', // active, trial, suspended
    ];

    protected $casts = [
        'business_type' => 'string',
        'status' => 'string',
    ];

    /**
     * Relasi ke outlet
     */
    public function outlets(): HasMany
    {
        return $this->hasMany(Outlet::class);
    }

    /**
     * Relasi ke user (staff/owner)
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Relasi ke subscription
     */
    public function subscription(): HasMany
    {
        return $this->hasMany(TenantSubscription::class);
    }

    /**
     * Relasi ke customer
     */
    public function customers(): HasMany
    {
        return $this->hasMany(Customer::class);
    }

    /**
     * Relasi ke price list
     */
    public function priceListItems(): HasMany
    {
        return $this->hasMany(PriceListItem::class);
    }

    /**
     * Relasi ke order
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Cek apakah tenant dalam status trial
     */
    public function isTrial(): bool
    {
        return $this->status === 'trial';
    }

    /**
     * Cek apakah tenant aktif
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Cek apakah tenant multi-outlet
     */
    public function isMultiOutlet(): bool
    {
        return $this->business_type === 'multi';
    }
}
