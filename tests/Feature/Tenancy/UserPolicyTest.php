<?php

namespace Tests\Feature\Tenancy;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Gate;
use Tests\TestCase;

/**
 * Test aturan UserPolicy untuk manajemen staff dalam satu tenant.
 */
class UserPolicyTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Owner boleh mengelola staff pada tenant yang sama.
     */
    public function test_owner_can_manage_staff_of_own_tenant(): void
    {
        $tenant = $this->makeTenant('Tenant A');
        $owner = $this->makeUser($tenant, 'owner');
        $staff = $this->makeUser($tenant, 'kasir');

        $gate = Gate::forUser($owner);

        $this->assertTrue($gate->allows('viewAny', User::class));
        $this->assertTrue($gate->allows('create', User::class));
        $this->assertTrue($gate->allows('update', $staff));
        $this->assertTrue($gate->allows('delete', $staff));
    }

    /**
     * Admin outlet dan kasir tidak boleh mengelola staff.
     */
    public function test_non_owner_roles_cannot_manage_staff(): void
    {
        $tenant = $this->makeTenant('Tenant A');
        $staff = $this->makeUser($tenant, 'kasir');

        foreach (['admin_outlet', 'kasir'] as $role) {
            $user = $this->makeUser($tenant, $role);
            $gate = Gate::forUser($user);

            $this->assertFalse($gate->allows('viewAny', User::class), "Role {$role} tidak boleh viewAny.");
            $this->assertFalse($gate->allows('create', User::class), "Role {$role} tidak boleh create.");
            $this->assertFalse($gate->allows('update', $staff), "Role {$role} tidak boleh update.");
            $this->assertFalse($gate->allows('delete', $staff), "Role {$role} tidak boleh delete.");
        }
    }

    /**
     * Owner tenant lain tidak boleh mengubah atau menghapus staff tenant ini.
     */
    public function test_owner_cannot_manage_staff_of_another_tenant(): void
    {
        $tenantA = $this->makeTenant('Tenant A');
        $tenantB = $this->makeTenant('Tenant B');
        $ownerB = $this->makeUser($tenantB, 'owner');
        $staffA = $this->makeUser($tenantA, 'kasir');

        $gate = Gate::forUser($ownerB);

        $this->assertFalse($gate->allows('update', $staffA));
        $this->assertFalse($gate->allows('delete', $staffA));
    }

    /**
     * Owner tanpa tenant tidak boleh membuat staff baru.
     */
    public function test_owner_without_tenant_cannot_create_staff(): void
    {
        $owner = User::factory()->create([
            'tenant_id' => null,
            'role' => 'owner',
            'status' => 'active',
        ]);

        $this->assertFalse(Gate::forUser($owner)->allows('create', User::class));
    }

    /**
     * Membuat tenant baru untuk kebutuhan test.
     */
    private function makeTenant(string $name): Tenant
    {
        return Tenant::create([
            'name' => $name,
            'business_type' => 'multi',
            'status' => 'active',
        ]);
    }

    /**
     * Membuat user dengan role tertentu pada tenant.
     */
    private function makeUser(Tenant $tenant, string $role): User
    {
        return User::factory()->create([
            'tenant_id' => $tenant->id,
            'role' => $role,
            'status' => 'active',
        ]);
    }
}
