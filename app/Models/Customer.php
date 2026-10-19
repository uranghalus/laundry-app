<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Model Customer - Pelanggan laundry
 * Setiap customer milik satu tenant
 */
class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'name',
        'phone',
        'address',
        'member_since',
        'deposit_balance',
    ];

    protected $casts = [
        'member_since' => 'date',
        'deposit_balance' => 'decimal:2',
    ];

    /**
     * Relasi ke tenant
     */
    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    /**
     * Relasi ke order
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }
}
