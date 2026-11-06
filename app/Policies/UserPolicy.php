<?php

namespace App\Policies;

use App\Models\User;

/**
 * Aturan otorisasi manajemen staff dalam satu tenant.
 *
 * Hanya owner yang boleh mengelola staff, dan hanya untuk staff pada tenant
 * yang sama.
 */
class UserPolicy
{
    /**
     * Menentukan apakah user boleh melihat daftar staff.
     */
    public function viewAny(User $user): bool
    {
        return $user->isOwner();
    }

    /**
     * Menentukan apakah user boleh menambah staff baru.
     */
    public function create(User $user): bool
    {
        return $user->isOwner() && $user->tenant_id !== null;
    }

    /**
     * Menentukan apakah user boleh mengubah data staff.
     */
    public function update(User $user, User $staff): bool
    {
        return $this->manageable($user, $staff);
    }

    /**
     * Menentukan apakah user boleh menghapus staff.
     */
    public function delete(User $user, User $staff): bool
    {
        return $this->manageable($user, $staff);
    }

    /**
     * Memastikan owner mengelola staff pada tenant yang sama.
     */
    private function manageable(User $user, User $staff): bool
    {
        return $user->isOwner()
            && $user->tenant_id !== null
            && $staff->tenant_id === $user->tenant_id;
    }
}
