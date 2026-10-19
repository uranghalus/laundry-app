<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Model ProofOfCondition - Bukti kondisi pakaian (Digital Proof-of-Condition)
 * Fitur diferensiator MVP: foto + watermark + approval WhatsApp
 */
class ProofOfCondition extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'photo_url',
        'watermark_data',
        'customer_approval_status',
        'approved_at',
        'wa_message_ref',
    ];

    protected $casts = [
        'watermark_data' => 'array',
        'customer_approval_status' => 'string',
        'approved_at' => 'datetime',
    ];

    /**
     * Status approval yang valid
     */
    public const APPROVAL_STATUSES = ['pending', 'approved', 'timeout'];

    /**
     * Relasi ke order
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Cek apakah sudah di-approve customer
     */
    public function isApproved(): bool
    {
        return $this->customer_approval_status === 'approved';
    }

    /**
     * Cek apakah timeout
     */
    public function isTimeout(): bool
    {
        return $this->customer_approval_status === 'timeout';
    }

    /**
     * Cek apakah masih pending
     */
    public function isPending(): bool
    {
        return $this->customer_approval_status === 'pending';
    }

    /**
     * Approve oleh customer
     */
    public function approve(): bool
    {
        $this->customer_approval_status = 'approved';
        $this->approved_at = now();

        return $this->save();
    }

    /**
     * Mark sebagai timeout
     */
    public function markTimeout(): bool
    {
        $this->customer_approval_status = 'timeout';

        return $this->save();
    }
}
