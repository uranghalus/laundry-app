<?php

namespace App\Policies;

use App\Models\Outlet;
use App\Models\User;

/**
 * Aturan otorisasi operasi pada outlet.
 *
 * Isolasi tenant selalu dicek lebih dulu; owner tenant lain tetap ditolak.
 * Admin outlet dan kasir hanya boleh menyentuh outlet yang ditugaskan padanya.
 */
class OutletPolicy
{
    /**
     * Menentukan apakah user boleh melihat daftar seluruh outlet tenant.
     */
    public function viewAny(User $user): bool
    {
        return $user->isOwner();
    }

    /**
     * Menentukan apakah user boleh melihat detail outlet.
     */
    public function view(User $user, Outlet $outlet): bool
    {
        if (! $this->sameTenant($user, $outlet)) {
            return false;
        }

        return $user->isOwner()
            || (($user->isAdminOutlet() || $user->isKasir()) && $this->assignedTo($user, $outlet));
    }

    /**
     * Menentukan apakah user boleh membuat outlet baru.
     */
    public function create(User $user): bool
    {
        return $user->isOwner() && $user->tenant_id !== null;
    }

    /**
     * Menentukan apakah user boleh mengubah outlet.
     */
    public function update(User $user, Outlet $outlet): bool
    {
        if (! $this->sameTenant($user, $outlet)) {
            return false;
        }

        return $user->isOwner()
            || ($user->isAdminOutlet() && $this->assignedTo($user, $outlet));
    }

    /**
     * Menentukan apakah user boleh menghapus outlet.
     */
    public function delete(User $user, Outlet $outlet): bool
    {
        return $user->isOwner() && $this->sameTenant($user, $outlet);
    }

    /**
     * Memastikan outlet berada pada tenant user.
     */
    private function sameTenant(User $user, Outlet $outlet): bool
    {
        return $user->tenant_id !== null && $outlet->tenant_id === $user->tenant_id;
    }

    /**
     * Memastikan user ditugaskan ke outlet tersebut.
     */
    private function assignedTo(User $user, Outlet $outlet): bool
    {
        return $user->outlet_id !== null && $user->outlet_id === $outlet->id;
    }
}
