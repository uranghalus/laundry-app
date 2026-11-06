<?php

namespace Tests\Feature;

use App\Models\Outlet;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_the_login_page()
    {
        $response = $this->get(route('dashboard'));
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_visit_the_dashboard()
    {
        $tenant = Tenant::create([
            'name' => 'Tenant Test',
            'business_type' => 'single',
            'status' => 'active',
        ]);

        $outlet = Outlet::create([
            'tenant_id' => $tenant->id,
            'name' => 'Outlet Test',
            'address' => 'Jl. Contoh No. 1',
            'whatsapp_number' => '081200000001',
        ]);

        $user = User::factory()->create([
            'tenant_id' => $tenant->id,
            'outlet_id' => $outlet->id,
        ]);
        $this->actingAs($user);

        $response = $this->get(route('dashboard'));
        $response->assertOk();
    }
}
