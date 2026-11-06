<?php

namespace Tests\Feature\Tenancy;

use App\Http\Middleware\EnsureTenantContext;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Outlet;
use App\Models\SubscriptionPlan;
use App\Models\Tenant;
use App\Models\TenantSubscription;
use App\Models\User;
use App\Support\CurrentTenant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

/**
 * Test penetapan context tenant dari user yang login lewat middleware.
 */
class TenantContextTest extends TestCase
{
    use RefreshDatabase;

    /**
     * User login tanpa tenant harus diarahkan ke halaman onboarding.
     */
    public function test_user_without_tenant_is_redirected_to_onboarding(): void
    {
        $user = User::factory()->create(['tenant_id' => null]);

        $this->actingAs($user)
            ->get(route('dashboard'))
            ->assertRedirect('/onboarding');
    }

    /**
     * Guest harus dibiarkan lewat tanpa menyentuh context tenant.
     */
    public function test_guest_passes_through_the_middleware(): void
    {
        $request = Request::create('/dashboard', 'GET');
        $request->setUserResolver(fn () => null);

        $response = app(EnsureTenantContext::class)->handle($request, fn () => response('ok'));

        $this->assertSame(200, $response->getStatusCode());
        $this->assertSame('ok', $response->getContent());
        $this->assertNull(app(CurrentTenant::class)->id());
    }

    /**
     * Middleware mengisi context selama request dan mengembalikannya setelah selesai.
     */
    public function test_middleware_sets_tenant_context_during_request_and_restores_it(): void
    {
        $tenant = $this->makeTenant('Tenant A');
        $user = User::factory()->create(['tenant_id' => $tenant->id]);

        $request = Request::create('/dashboard', 'GET');
        $request->setUserResolver(fn () => $user);

        $seen = null;

        app(EnsureTenantContext::class)->handle($request, function () use (&$seen) {
            $seen = app(CurrentTenant::class)->id();

            return response('ok');
        });

        $this->assertSame($tenant->id, $seen);
        $this->assertNull(app(CurrentTenant::class)->id());
    }

    /**
     * User dengan tenant tetap bisa membuka dashboard.
     */
    public function test_authenticated_user_with_tenant_can_visit_the_dashboard(): void
    {
        $tenant = $this->makeTenant('Tenant A');
        $this->makeOutlet($tenant, 'Outlet A');

        $user = User::factory()->create(['tenant_id' => $tenant->id]);

        $this->actingAs($user)
            ->get(route('dashboard'))
            ->assertOk();
    }

    /**
     * Shared props Inertia memuat tenant aktif, role, outlet, dan subscription.
     */
    public function test_inertia_shared_props_expose_the_active_tenant(): void
    {
        $tenant = $this->makeTenant('Tenant A');
        $other = $this->makeTenant('Tenant B');
        $outlet = $this->makeOutlet($tenant, 'Outlet A');
        $this->makeOutlet($other, 'Outlet B');

        $plan = SubscriptionPlan::create([
            'name' => 'Basic',
            'price_monthly' => 149000,
            'price_annual' => 1490000,
        ]);

        $subscription = TenantSubscription::create([
            'tenant_id' => $tenant->id,
            'plan_id' => $plan->id,
            'status' => 'trial',
            'start_date' => now()->toDateString(),
            'end_date' => now()->addDays(14)->toDateString(),
        ]);

        $user = User::factory()->create([
            'tenant_id' => $tenant->id,
            'outlet_id' => $outlet->id,
            'role' => 'owner',
        ]);

        $this->actingAs($user)
            ->get(route('dashboard'))
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('tenant.id', $tenant->id)
                ->where('role', 'owner')
                ->has('outlets', 1)
                ->where('outlets.0.id', $outlet->id)
                ->where('subscription.id', $subscription->id)
            );
    }

    /**
     * Query di dalam route terautentikasi hanya mengembalikan data tenant aktif.
     */
    public function test_tenant_context_filters_queries_for_the_authenticated_user(): void
    {
        Route::middleware(['auth', 'tenant.context'])->get('/_tenancy/orders-count', function () {
            return response()->json(['count' => Order::count()]);
        });

        $tenantA = $this->makeTenant('Tenant A');
        $tenantB = $this->makeTenant('Tenant B');
        $userA = User::factory()->create(['tenant_id' => $tenantA->id]);

        $this->makeOrder($tenantA, 'A');
        $this->makeOrder($tenantB, 'B');

        $this->actingAs($userA)
            ->get('/_tenancy/orders-count')
            ->assertOk()
            ->assertJson(['count' => 1]);
    }

    /**
     * Membuat tenant aktif untuk kebutuhan test.
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
     * Membuat outlet milik tenant tertentu.
     */
    private function makeOutlet(Tenant $tenant, string $name): Outlet
    {
        return Outlet::create([
            'tenant_id' => $tenant->id,
            'name' => $name,
            'address' => 'Jl. Contoh No. 1',
            'whatsapp_number' => '081200000001',
        ]);
    }

    /**
     * Membuat order lengkap dengan outlet, customer, dan user pembuatnya.
     */
    private function makeOrder(Tenant $tenant, string $label): Order
    {
        $outlet = $this->makeOutlet($tenant, 'Outlet '.$label);

        $customer = Customer::create([
            'tenant_id' => $tenant->id,
            'name' => 'Customer '.$label,
            'phone' => '08120000'.$label,
        ]);

        $user = User::factory()->create([
            'tenant_id' => $tenant->id,
            'outlet_id' => $outlet->id,
        ]);

        return Order::create([
            'tenant_id' => $tenant->id,
            'outlet_id' => $outlet->id,
            'customer_id' => $customer->id,
            'created_by' => $user->id,
            'status' => 'diterima',
            'total_price' => 50000,
        ]);
    }
}
