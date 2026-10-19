<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Model PriceListItem - Daftar harga layanan per tenant
 * Harga seragam per tenant di MVP (override per outlet di v2)
 */
class PriceListItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'service_type',
        'unit',
        'price',
        'estimated_duration_hours',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'estimated_duration_hours' => 'integer',
    ];

    /**
     * Relasi ke tenant
     */
    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }
}
