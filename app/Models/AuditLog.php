<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Model AuditLog - Log audit untuk aksi kritikal
 * Fondasi untuk fraud detection di v2
 * Mencatat: perubahan harga manual, void transaksi, hapus order, dll
 */
class AuditLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'user_id',
        'action_type',
        'entity_type',
        'entity_id',
        'before_value',
        'after_value',
    ];

    protected $casts = [
        'before_value' => 'array',
        'after_value' => 'array',
    ];

    /**
     * Relasi ke tenant
     */
    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    /**
     * Relasi ke user yang melakukan aksi
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Static method untuk mencatat audit log
     */
    public static function log(
        string $actionType,
        string $entityType,
        int $entityId,
        ?array $beforeValue = null,
        ?array $afterValue = null,
        ?int $userId = null,
        ?int $tenantId = null
    ): self {
        return self::create([
            'tenant_id' => $tenantId ?? auth()->user()?->tenant_id,
            'user_id' => $userId ?? auth()->id(),
            'action_type' => $actionType,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'before_value' => $beforeValue,
            'after_value' => $afterValue,
        ]);
    }
}
