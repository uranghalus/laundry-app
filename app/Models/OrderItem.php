<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Model OrderItem - Item/detail dalam satu order
 */
class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'description',
        'quantity_weight',
        'service_type',
        'price',
    ];

    protected $casts = [
        'quantity_weight' => 'decimal:2',
        'price' => 'decimal:2',
    ];

    /**
     * Relasi ke order
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
