<?php

namespace Tests\Unit;

use App\Models\Tenant;
use App\Support\CurrentTenant;
use RuntimeException;
use Tests\TestCase;

/**
 * Test untuk CurrentTenant — pemegang context tenant aktif per request/job.
 */
class CurrentTenantTest extends TestCase
{
    /**
     * Memastikan context kosong saat instance baru dibuat.
     */
    public function test_context_is_null_by_default(): void
    {
        $currentTenant = new CurrentTenant;

        $this->assertNull($currentTenant->id());
        $this->assertNull($currentTenant->get());
    }

    /**
     * Memastikan set() menyimpan tenant dan forget() mengosongkannya.
     */
    public function test_set_stores_tenant_and_forget_clears_it(): void
    {
        $currentTenant = new CurrentTenant;
        $tenant = $this->makeTenant(7);

        $currentTenant->set($tenant);

        $this->assertSame($tenant, $currentTenant->get());
        $this->assertSame(7, $currentTenant->id());

        $currentTenant->forget();

        $this->assertNull($currentTenant->get());
        $this->assertNull($currentTenant->id());
    }

    /**
     * Memastikan set(null) sama dengan mengosongkan context.
     */
    public function test_set_null_clears_the_context(): void
    {
        $currentTenant = new CurrentTenant;
        $currentTenant->set($this->makeTenant(3));

        $currentTenant->set(null);

        $this->assertNull($currentTenant->id());
    }

    /**
     * Memastikan runWithout mengembalikan hasil callback dan context kembali.
     */
    public function test_run_without_returns_callback_result_and_restores_context(): void
    {
        $currentTenant = new CurrentTenant;
        $tenant = $this->makeTenant(11);
        $currentTenant->set($tenant);

        $result = $currentTenant->runWithout(function () use ($currentTenant): string {
            $this->assertNull($currentTenant->id());

            return 'selesai';
        });

        $this->assertSame('selesai', $result);
        $this->assertSame($tenant, $currentTenant->get());
    }

    /**
     * Memastikan context tetap kembali walau callback melempar exception.
     */
    public function test_run_without_restores_context_when_callback_throws(): void
    {
        $currentTenant = new CurrentTenant;
        $tenant = $this->makeTenant(13);
        $currentTenant->set($tenant);

        try {
            $currentTenant->runWithout(function (): void {
                throw new RuntimeException('gagal di tengah proses');
            });

            $this->fail('Exception dari callback seharusnya diteruskan.');
        } catch (RuntimeException $exception) {
            $this->assertSame('gagal di tengah proses', $exception->getMessage());
        }

        $this->assertSame($tenant, $currentTenant->get());
    }

    /**
     * Memastikan container memberikan instance scoped yang sama dalam satu lifecycle.
     */
    public function test_container_resolves_the_same_scoped_instance(): void
    {
        $first = $this->app->make(CurrentTenant::class);
        $second = $this->app->make(CurrentTenant::class);
        $tenant = $this->makeTenant(17);

        $first->set($tenant);

        $this->assertSame($first, $second);
        $this->assertSame(17, $second->id());
    }

    /**
     * Membuat instance tenant di memori tanpa menyentuh database.
     */
    private function makeTenant(int $id): Tenant
    {
        $tenant = new Tenant(['name' => 'Tenant '.$id]);
        $tenant->id = $id;

        return $tenant;
    }
}
