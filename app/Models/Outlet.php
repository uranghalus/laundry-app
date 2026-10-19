<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Model Outlet - Representasi gerai/cabang laundry
 * Setiap outlet milik satu tenant
 */
class Outlet extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'name',
        'address',
        'whatsapp_number',
        'operating_hours',
    ];

    protected $casts = [
        'operating_hours' => 'array',
    ];

    /**
     * Relasi ke tenant
     */
    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    /**
     * Relasi ke user yang ditugaskan ke outlet ini
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Relasi ke order
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }
}
