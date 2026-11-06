<?php

namespace Tests\Feature\Tenancy;

use App\Models\SubscriptionPlan;
use App\Models\Tenant;
use App\Models\TenantSubscription;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

/**
 * Test middleware subscription.active dan prop can_write untuk mode read-only.
 */
class SubscriptionGateTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Subscription berstatus expired memblokir request mutasi.
     */
    public function test_expired_subscription_blocks_post_requests(): void
    {
        $user = $this->makeUser();
        $this->makeSubscription($user->tenant, 'expired', now()->subMonth(), now()->subDay());

        $this->registerWriteRoutes();

        $this->actingAs($user)
            ->post('/_tenancy/subscription-write')
            ->assertForbidden();
    }

    /**
     * Request baca tetap lolos meski subscription sudah expired.
     */
    public function test_expired_subscription_still_allows_get_requests(): void
    {
        $user = $this->makeUser();
        $this->makeSubscription($user->tenant, 'expired', now()->subMonth(), now()->subDay());

        $this->registerWriteRoutes();

        $this->actingAs($user)
            ->get('/_tenancy/subscription-write')
            ->assertOk();
    }

    /**
     * Tenant tanpa subscription sama sekali tidak boleh melakukan mutasi.
     */
    public function test_tenant_without_subscription_blocks_post_requests(): void
    {
        $user = $this->makeUser();

        $this->registerWriteRoutes();

        $this->actingAs($user)
            ->post('/_tenancy/subscription-write')
            ->assertForbidden();
    }

    /**
     * Subscription trial yang masih berjalan boleh melakukan mutasi.
     */
    public function test_active_trial_allows_post_requests(): void
    {
        $user = $this->makeUser();
        $this->makeSubscription($user->tenant, 'trial', now()->subDay(), now()->addDays(10));

        $this->registerWriteRoutes();

        $this->actingAs($user)
            ->post('/_tenancy/subscription-write')
            ->assertOk();
    }

    /**
     * Status active tetapi end_date sudah lewat tetap dianggap expired.
     */
    public function test_active_status_with_past_end_date_blocks_post_requests(): void
    {
        $user = $this->makeUser();
        $this->makeSubscription($user->tenant, 'active', now()->subMonth(), now()->subDay());

        $this->registerWriteRoutes();

        $this->actingAs($user)
            ->post('/_tenancy/subscription-write')
            ->assertForbidden();
    }

    /**
     * Shared prop can_write bernilai true saat subscription masih berjalan.
     */
    public function test_can_write_prop_is_true_for_active_subscription(): void
    {
        $user = $this->makeUser();
        $this->makeSubscription($user->tenant, 'trial', now()->subDay(), now()->addDays(10));

        $this->actingAs($user)
            ->get(route('dashboard'))
            ->assertInertia(fn (Assert $page) => $page->where('can_write', true));
    }

    /**
     * Shared prop can_write bernilai false saat subscription expired.
     */
    public function test_can_write_prop_is_false_for_expired_subscription(): void
    {
        $user = $this->makeUser();
        $this->makeSubscription($user->tenant, 'expired', now()->subMonth(), now()->subDay());

        $this->actingAs($user)
            ->get(route('dashboard'))
            ->assertInertia(fn (Assert $page) => $page->where('can_write', false));
    }

    /**
     * Shared prop can_write bernilai false saat tenant belum punya subscription.
     */
    public function test_can_write_prop_is_false_without_subscription(): void
    {
        $user = $this->makeUser();

        $this->actingAs($user)
            ->get(route('dashboard'))
            ->assertInertia(fn (Assert $page) => $page->where('can_write', false));
    }

    /**
     * Mendaftarkan route tulis dan baca yang memakai middleware subscription.
     */
    private function registerWriteRoutes(): void
    {
        Route::middleware(['auth', 'tenant.context', 'subscription.active'])
            ->post('/_tenancy/subscription-write', fn () => response()->json(['ok' => true]));

        Route::middleware(['auth', 'tenant.context', 'subscription.active'])
            ->get('/_tenancy/subscription-write', fn () => response('ok'));
    }

    /**
     * Membuat tenant beserta user yang login pada test.
     */
    private function makeUser(): User
    {
        $tenant = Tenant::create([
            'name' => 'Tenant Uji',
            'business_type' => 'single',
            'status' => 'active',
        ]);

        return User::factory()->create([
            'tenant_id' => $tenant->id,
            'role' => 'owner',
            'status' => 'active',
        ]);
    }

    /**
     * Membuat subscription untuk tenant dengan rentang tanggal tertentu.
     */
    private function makeSubscription(Tenant $tenant, string $status, mixed $start, mixed $end): TenantSubscription
    {
        $plan = SubscriptionPlan::create([
            'name' => 'Basic',
            'price_monthly' => 100000,
            'price_annual' => 1000000,
        ]);

        return TenantSubscription::create([
            'tenant_id' => $tenant->id,
            'plan_id' => $plan->id,
            'status' => $status,
            'start_date' => $start,
            'end_date' => $end,
        ]);
    }
}
