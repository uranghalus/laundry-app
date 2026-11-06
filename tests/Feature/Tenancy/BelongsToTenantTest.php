<?php

namespace Tests\Feature\Tenancy;

use App\Concerns\BelongsToTenant;
use App\Models\AuditLog;
use App\Models\Customer;
use App\Models\Notification;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Outlet;
use App\Models\PriceListItem;
use App\Models\ProofOfCondition;
use App\Models\Tenant;
use App\Models\User;
use App\Support\CurrentTenant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use RuntimeException;
use Tests\TestCase;

/**
 * Test isolasi tenant lewat global scope dan pengisian tenant_id otomatis.
 */
class BelongsToTenantTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Query di context tenant A tidak boleh mengembalikan data tenant B.
     */
    public function test_query_only_returns_rows_of_the_current_tenant(): void
    {
        $tenantA = $this->makeTenant('Tenant A');
        $tenantB = $this->makeTenant('Tenant B');

        $this->makeOrder($tenantA, 'A');
        $this->makeOrder($tenantB, 'B');

        app(CurrentTenant::class)->set($tenantA);

        $this->assertSame(1, Order::count());
        $this->assertSame(1, Outlet::count());
        $this->assertSame(1, Customer::count());
        $this->assertSame([$tenantA->id], Order::query()->pluck('tenant_id')->all());
        $this->assertSame(2, Order::withoutGlobalScope('tenant')->count());
    }

    /**
     * Hook creating mengisi tenant_id dari context saat kolom masih kosong.
     */
    public function test_creating_fills_tenant_id_from_context(): void
    {
        $tenant = $this->makeTenant('Tenant A');
        $order = $this->makeOrder($tenant, 'A');

        app(CurrentTenant::class)->set($tenant);

        $item = OrderItem::create([
            'order_id' => $order->id,
            'description' => 'Cuci kemeja',
            'quantity_weight' => 2,
            'service_type' => 'cuci',
            'price' => 20000,
        ]);

        $customer = Customer::create([
            'name' => 'Pelanggan Baru',
            'phone' => '081200000001',
        ]);

        $this->assertSame($tenant->id, $item->tenant_id);
        $this->assertSame($tenant->id, $customer->tenant_id);
        $this->assertDatabaseHas('order_items', ['id' => $item->id, 'tenant_id' => $tenant->id]);
        $this->assertDatabaseHas('customers', ['id' => $customer->id, 'tenant_id' => $tenant->id]);
    }

    /**
     * tenant_id eksplisit yang berbeda dari context harus ditolak.
     */
    public function test_creating_with_a_different_tenant_id_throws(): void
    {
        $tenantA = $this->makeTenant('Tenant A');
        $tenantB = $this->makeTenant('Tenant B');
        $order = $this->makeOrder($tenantA, 'A');

        app(CurrentTenant::class)->set($tenantA);

        try {
            OrderItem::create([
                'tenant_id' => $tenantB->id,
                'order_id' => $order->id,
                'description' => 'Cuci kemeja',
                'quantity_weight' => 1,
                'service_type' => 'cuci',
                'price' => 10000,
            ]);

            $this->fail('OrderItem dengan tenant_id berbeda seharusnya ditolak.');
        } catch (RuntimeException $exception) {
            $this->assertStringContainsString('tenant_id', $exception->getMessage());
        }

        $this->assertSame(0, OrderItem::withoutGlobalScope('tenant')->count());
    }

    /**
     * Saat context null tidak ada filter tenant yang dipasang.
     */
    public function test_null_context_does_not_apply_any_filter(): void
    {
        $tenantA = $this->makeTenant('Tenant A');
        $tenantB = $this->makeTenant('Tenant B');

        $this->makeOrder($tenantA, 'A');
        $this->makeOrder($tenantB, 'B');

        app(CurrentTenant::class)->forget();

        $this->assertSame(2, Order::count());
        $this->assertSame(2, Outlet::count());
        $this->assertSame(2, Customer::count());
    }

    /**
     * tenant_id eksplisit yang sama dengan context tetap diterima.
     */
    public function test_explicit_matching_tenant_id_is_allowed(): void
    {
        $tenant = $this->makeTenant('Tenant A');
        $order = $this->makeOrder($tenant, 'A');

        app(CurrentTenant::class)->set($tenant);

        $item = OrderItem::create([
            'tenant_id' => $tenant->id,
            'order_id' => $order->id,
            'description' => 'Setrika',
            'quantity_weight' => 1,
            'service_type' => 'setrika',
            'price' => 8000,
        ]);

        $this->assertSame($tenant->id, $item->tenant_id);
    }

    /**
     * runWithout melepas filter sementara lalu memasangnya kembali.
     */
    public function test_run_without_temporarily_removes_the_filter(): void
    {
        $tenantA = $this->makeTenant('Tenant A');
        $tenantB = $this->makeTenant('Tenant B');

        $this->makeOrder($tenantA, 'A');
        $this->makeOrder($tenantB, 'B');

        $currentTenant = app(CurrentTenant::class);
        $currentTenant->set($tenantA);

        $countWithoutContext = $currentTenant->runWithout(fn (): int => Order::count());

        $this->assertSame(2, $countWithoutContext);
        $this->assertSame(1, Order::count());
    }

    /**
     * Memastikan trait terpasang pada seluruh model yang diwajibkan.
     */
    public function test_required_models_use_the_trait(): void
    {
        $models = [
            OrderItem::class,
            ProofOfCondition::class,
            Outlet::class,
            Customer::class,
            PriceListItem::class,
            Order::class,
            Notification::class,
            AuditLog::class,
        ];

        foreach ($models as $model) {
            $this->assertContains(
                BelongsToTenant::class,
                class_uses_recursive($model),
                $model.' belum memakai trait BelongsToTenant.',
            );
        }
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
     * Membuat order lengkap dengan outlet, customer, dan user pembuatnya.
     */
    private function makeOrder(Tenant $tenant, string $label): Order
    {
        $outlet = Outlet::create([
            'tenant_id' => $tenant->id,
            'name' => 'Outlet '.$label,
            'address' => 'Jl. Contoh No. '.$label,
            'whatsapp_number' => '08120000000'.$label,
        ]);

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
