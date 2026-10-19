<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Model Notification - Notifikasi ke pelanggan (WhatsApp/SMS)
 * Event: order_created, order_ready, order_completed
 */
class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'order_id',
        'channel',
        'event_type',
        'status',
        'sent_at',
    ];

    protected $casts = [
        'channel' => 'string',
        'event_type' => 'string',
        'status' => 'string',
        'sent_at' => 'datetime',
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
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Cek apakah notifikasi berhasil terkirim
     */
    public function isSent(): bool
    {
        return $this->status === 'sent';
    }

    /**
     * Cek apakah notifikasi gagal
     */
    public function isFailed(): bool
    {
        return $this->status === 'failed';
    }

    /**
     * Mark sebagai terkirim
     */
    public function markSent(): bool
    {
        $this->status = 'sent';
        $this->sent_at = now();

        return $this->save();
    }

    /**
     * Mark sebagai gagal
     */
    public function markFailed(): bool
    {
        $this->status = 'failed';

        return $this->save();
    }
}
