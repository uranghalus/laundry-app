<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * Model Order - Pesanan laundry end-to-end
 * Status: diterima -> dicuci -> dikeringkan -> disetrika -> siap_diambil -> selesai
 */
class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'outlet_id',
        'customer_id',
        'created_by',
        'status',
        'is_high_risk',
        'total_price',
        'payment_status',
        'completed_at',
    ];

    protected $casts = [
        'is_high_risk' => 'boolean',
        'total_price' => 'decimal:2',
        'payment_status' => 'string',
        'completed_at' => 'datetime',
    ];

    /**
     * Status order yang valid
     */
    public const STATUSES = [
        'diterima',
        'dicuci',
        'dikeringkan',
        'disetrika',
        'siap_diambil',
        'selesai',
    ];

    /**
     * Relasi ke tenant
     */
    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    /**
     * Relasi ke outlet
     */
    public function outlet(): BelongsTo
    {
        return $this->belongsTo(Outlet::class);
    }

    /**
     * Relasi ke customer
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * Relasi ke user yang membuat order
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Relasi ke order items
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Relasi ke proof of condition
     */
    public function proofOfCondition(): HasMany
    {
        return $this->hasMany(ProofOfCondition::class);
    }

    /**
     * Relasi ke notifications
     */
    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    /**
     * Cek apakah order high risk
     */
    public function isHighRisk(): bool
    {
        return $this->is_high_risk;
    }

    /**
     * Cek apakah order sudah selesai
     */
    public function isCompleted(): bool
    {
        return $this->status === 'selesai';
    }

    /**
     * Cek apakah order bisa di-update status
     */
    public function canUpdateStatus(): bool
    {
        return ! $this->isCompleted();
    }

    /**
     * Get next status dalam alur
     */
    public function getNextStatus(): ?string
    {
        $currentIndex = array_search($this->status, self::STATUSES);
        if ($currentIndex === false || $currentIndex >= count(self::STATUSES) - 1) {
            return null;
        }

        return self::STATUSES[$currentIndex + 1];
    }

    /**
     * Update status ke tahap berikutnya
     */
    public function advanceStatus(): bool
    {
        $nextStatus = $this->getNextStatus();
        if ($nextStatus) {
            $this->status = $nextStatus;
            if ($nextStatus === 'selesai') {
                $this->completed_at = Carbon::now();
            }

            return $this->save();
        }

        return false;
    }

    /**
     * Cek apakah butuh approval PoC
     */
    public function needsProofOfConditionApproval(): bool
    {
        return $this->is_high_risk && $this->status === 'diterima';
    }
}
