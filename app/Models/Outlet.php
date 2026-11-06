<?php

namespace App\Models;

use App\Concerns\BelongsToTenant;
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
    use BelongsToTenant;
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'name',
        'address',
        'whatsapp_number',
        'operating_hours',
        'write_enabled',
    ];

    protected $casts = [
        'operating_hours' => 'array',
        'write_enabled' => 'boolean',
    ];

    /**
     * Cek apakah outlet menerima perubahan data operasional.
     */
    public function isWritable(): bool
    {
        return $this->write_enabled;
    }

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
