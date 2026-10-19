<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $phone
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property string $role
 * @property string $status
 * @property int|null $tenant_id
 * @property int|null $outlet_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'email', 'password', 'phone', 'role', 'status', 'tenant_id', 'outlet_id'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'role' => 'string',
            'status' => 'string',
        ];
    }

    /**
     * Relasi ke tenant
     */
    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    /**
     * Relasi ke outlet
     */
    public function outlet()
    {
        return $this->belongsTo(Outlet::class);
    }

    /**
     * Relasi ke order yang dibuat
     */
    public function createdOrders()
    {
        return $this->hasMany(Order::class, 'created_by');
    }

    /**
     * Cek apakah user adalah Owner
     */
    public function isOwner(): bool
    {
        return $this->role === 'owner';
    }

    /**
     * Cek apakah user adalah Admin Outlet
     */
    public function isAdminOutlet(): bool
    {
        return $this->role === 'admin_outlet';
    }

    /**
     * Cek apakah user adalah Kasir
     */
    public function isKasir(): bool
    {
        return $this->role === 'kasir';
    }

    /**
     * Cek apakah user aktif
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Cek apakah user bisa akses outlet tertentu
     */
    public function canAccessOutlet(int $outletId): bool
    {
        if ($this->isOwner()) {
            return $this->tenant->outlets()->where('id', $outletId)->exists();
        }

        return $this->outlet_id === $outletId;
    }

    /**
     * Cek apakah user bisa mengelola staff
     */
    public function canManageStaff(): bool
    {
        return $this->isOwner() || $this->isAdminOutlet();
    }

    /**
     * Cek apakah user bisa lihat laporan keuangan
     */
    public function canViewFinancialReports(): bool
    {
        return $this->isOwner() || $this->isAdminOutlet();
    }

    /**
     * Cek apakah user bisa mengubah harga
     */
    public function canChangePrices(): bool
    {
        return $this->isOwner();
    }
}
