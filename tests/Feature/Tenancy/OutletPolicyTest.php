<?php

namespace Tests\Feature\Tenancy;

use App\Models\Outlet;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Gate;
use Tests\TestCase;

/**
 * Test aturan OutletPolicy, termasuk penemuan policy otomatis lewat Gate.
 */
class OutletPolicyTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Owner boleh melihat daftar, membuat, mengubah, dan menghapus outlet tenantnya.
     */
    public function test_owner_can_manage_outlets_of_own_tenant(): void
    {
        $tenant = $this->makeTenant('Tenant A');
        $outlet = $this->makeOutlet($tenant);
        $owner = $this->makeUser($tenant, 'owner');

        $gate = Gate::forUser($owner);

        $this->assertTrue($gate->allows('viewAny', Outlet::class));
        $this->assertTrue($gate->allows('create', Outlet::class));
        $this->assertTrue($gate->allows('view', $outlet));
        $this->assertTrue($gate->allows('update', $outlet));
        $this->assertTrue($gate->allows('delete', $outlet));
    }

    /**
     * Admin outlet hanya boleh melihat dan mengubah outlet yang ditugaskan padanya.
     */
    public function test_admin_outlet_can_only_view_and_update_assigned_outlet(): void
    {
        $tenant = $this->makeTenant('Tenant A');
        $assigned = $this->makeOutlet($tenant, 'Outlet Ditugaskan');
        $other = $this->makeOutlet($tenant, 'Outlet Lain');
        $admin = $this->makeUser($tenant, 'admin_outlet', $assigned);

        $gate = Gate::forUser($admin);

        $this->assertTrue($gate->allows('view', $assigned));
        $this->assertTrue($gate->allows('update', $assigned));
        $this->assertFalse($gate->allows('view', $other));
        $this->assertFalse($gate->allows('update', $other));
        $this->assertFalse($gate->allows('create', Outlet::class));
        $this->assertFalse($gate->allows('delete', $assigned));
        $this->assertFalse($gate->allows('viewAny', Outlet::class));
    }

    /**
     * Kasir hanya boleh melihat outlet tempat ia ditugaskan.
     */
    public function test_kasir_can_only_view_assigned_outlet(): void
    {
        $tenant = $this->makeTenant('Tenant A');
        $assigned = $this->makeOutlet($tenant, 'Outlet Kasir');
        $other = $this->makeOutlet($tenant, 'Outlet Lain');
        $kasir = $this->makeUser($tenant, 'kasir', $assigned);

        $gate = Gate::forUser($kasir);

        $this->assertTrue($gate->allows('view', $assigned));
        $this->assertFalse($gate->allows('view', $other));
        $this->assertFalse($gate->allows('update', $assigned));
        $this->assertFalse($gate->allows('create', Outlet::class));
        $this->assertFalse($gate->allows('delete', $assigned));
        $this->assertFalse($gate->allows('viewAny', Outlet::class));
    }

    /**
     * Role apa pun tetap ditolak saat menyentuh outlet tenant lain.
     */
    public function test_cross_tenant_access_is_denied_for_every_role(): void
    {
        $tenantA = $this->makeTenant('Tenant A');
        $tenantB = $this->makeTenant('Tenant B');
        $outletA = $this->makeOutlet($tenantA, 'Outlet A');

        $ownerB = $this->makeUser($tenantB, 'owner');
        $adminB = $this->makeUser($tenantB, 'admin_outlet', $this->makeOutlet($tenantB, 'Outlet B'));
        $kasirB = $this->makeUser($tenantB, 'kasir', $this->makeOutlet($tenantB, 'Outlet B2'));

        foreach ([$ownerB, $adminB, $kasirB] as $user) {
            $gate = Gate::forUser($user);

            $this->assertFalse($gate->allows('view', $outletA));
            $this->assertFalse($gate->allows('update', $outletA));
            $this->assertFalse($gate->allows('delete', $outletA));
        }
    }

    /**
     * User tanpa tenant tidak boleh membuat outlet baru.
     */
    public function test_owner_without_tenant_cannot_create_outlet(): void
    {
        $owner = User::factory()->create([
            'tenant_id' => null,
            'role' => 'owner',
            'status' => 'active',
        ]);

        $this->assertFalse(Gate::forUser($owner)->allows('create', Outlet::class));
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
     * Membuat outlet pada tenant yang diberikan.
     */
    private function makeOutlet(Tenant $tenant, string $name = 'Outlet Uji'): Outlet
    {
        return Outlet::create([
            'tenant_id' => $tenant->id,
            'name' => $name,
            'address' => 'Jalan Uji No. 1',
            'whatsapp_number' => '628111111111',
        ]);
    }

    /**
     * Membuat user dengan role dan outlet tugas tertentu.
     */
    private function makeUser(Tenant $tenant, string $role, ?Outlet $outlet = null): User
    {
        return User::factory()->create([
            'tenant_id' => $tenant->id,
            'outlet_id' => $outlet?->id,
            'role' => $role,
            'status' => 'active',
        ]);
    }
}
