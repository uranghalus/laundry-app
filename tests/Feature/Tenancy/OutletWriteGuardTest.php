<?php

namespace Tests\Feature\Tenancy;

use App\Models\Outlet;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

/**
 * Test middleware outlet.writable terhadap status write_enabled outlet.
 */
class OutletWriteGuardTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Outlet dengan write_enabled false menolak request mutasi.
     */
    public function test_outlet_with_write_disabled_blocks_post_requests(): void
    {
        $user = $this->makeUser();
        $outlet = $this->makeOutlet($user->tenant, false);

        $this->registerWriteRoute();

        $this->actingAs($user)
            ->post("/_tenancy/outlets/{$outlet->id}/write")
            ->assertForbidden();
    }

    /**
     * Outlet dengan write_enabled true menerima request mutasi.
     */
    public function test_outlet_with_write_enabled_allows_post_requests(): void
    {
        $user = $this->makeUser();
        $outlet = $this->makeOutlet($user->tenant, true);

        $this->registerWriteRoute();

        $this->actingAs($user)
            ->post("/_tenancy/outlets/{$outlet->id}/write")
            ->assertOk();
    }

    /**
     * Request baca tetap lolos meski outlet sedang tidak menerima penulisan.
     */
    public function test_read_requests_pass_even_when_outlet_is_not_writable(): void
    {
        $user = $this->makeUser();
        $outlet = $this->makeOutlet($user->tenant, false);

        $this->registerReadRoute();

        $this->actingAs($user)
            ->get("/_tenancy/outlets/{$outlet->id}/write")
            ->assertOk();
    }

    /**
     * Outlet milik tenant lain dianggap tidak ada saat diakses lewat id.
     */
    public function test_outlet_of_another_tenant_is_hidden_when_resolved_by_id(): void
    {
        $user = $this->makeUser();
        $foreignOutlet = $this->makeOutlet($this->makeTenant('Tenant Lain'), true);

        $this->registerWriteRoute();

        $this->actingAs($user)
            ->post("/_tenancy/outlets/{$foreignOutlet->id}/write")
            ->assertNotFound();
    }

    /**
     * Outlet milik tenant lain ditolak juga saat route memakai model binding.
     */
    public function test_outlet_of_another_tenant_is_hidden_with_route_model_binding(): void
    {
        $user = $this->makeUser();
        $foreignOutlet = $this->makeOutlet($this->makeTenant('Tenant Lain'), true);

        $this->registerBoundWriteRoute();

        $this->actingAs($user)
            ->post("/_tenancy/outlets-bound/{$foreignOutlet->id}/write")
            ->assertNotFound();
    }

    /**
     * Outlet yang tidak ada tetap menghasilkan 404.
     */
    public function test_missing_outlet_returns_not_found(): void
    {
        $user = $this->makeUser();

        $this->registerWriteRoute();

        $this->actingAs($user)
            ->post('/_tenancy/outlets/999999/write')
            ->assertNotFound();
    }

    /**
     * Mendaftarkan route mutasi dengan parameter outlet berupa id.
     */
    private function registerWriteRoute(): void
    {
        Route::middleware(['auth', 'tenant.context', 'outlet.writable'])
            ->post('/_tenancy/outlets/{outlet}/write', fn () => response()->json(['ok' => true]));
    }

    /**
     * Mendaftarkan route baca dengan parameter outlet berupa id.
     */
    private function registerReadRoute(): void
    {
        Route::middleware(['auth', 'tenant.context', 'outlet.writable'])
            ->get('/_tenancy/outlets/{outlet}/write', fn () => response('ok'));
    }

    /**
     * Mendaftarkan route mutasi yang memakai implicit route model binding.
     */
    private function registerBoundWriteRoute(): void
    {
        Route::middleware(['web', 'auth', 'tenant.context', 'outlet.writable'])
            ->post('/_tenancy/outlets-bound/{outlet}/write', fn (Outlet $outlet) => response()->json(['id' => $outlet->id]));
    }

    /**
     * Membuat tenant baru untuk kebutuhan test.
     */
    private function makeTenant(string $name): Tenant
    {
        return Tenant::create([
            'name' => $name,
            'business_type' => 'single',
            'status' => 'active',
        ]);
    }

    /**
     * Membuat user owner pada tenant yang diberikan.
     */
    private function makeUser(): User
    {
        $tenant = $this->makeTenant('Tenant Uji');

        return User::factory()->create([
            'tenant_id' => $tenant->id,
            'role' => 'owner',
            'status' => 'active',
        ]);
    }

    /**
     * Membuat outlet pada tenant dengan status write tertentu.
     */
    private function makeOutlet(Tenant $tenant, bool $writeEnabled): Outlet
    {
        return Outlet::create([
            'tenant_id' => $tenant->id,
            'name' => 'Outlet Uji',
            'address' => 'Jalan Uji No. 1',
            'whatsapp_number' => '628111111111',
            'write_enabled' => $writeEnabled,
        ]);
    }
}
