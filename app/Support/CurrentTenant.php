<?php

namespace App\Support;

use App\Models\Tenant;
use Closure;

/**
 * Pemegang context tenant aktif untuk satu lifecycle request/job.
 *
 * Dipakai global scope tenant dan pengisian otomatis tenant_id. Context null
 * berarti tidak ada tenant aktif, sehingga data lintas tenant tetap bisa
 * diakses oleh job, webhook, atau route publik dengan tenant_id eksplisit.
 */
class CurrentTenant
{
    /**
     * Tenant yang sedang aktif, null jika tidak ada context.
     */
    private ?Tenant $tenant = null;

    /**
     * Mengganti tenant aktif; kirim null untuk mengosongkan context.
     */
    public function set(?Tenant $tenant): void
    {
        $this->tenant = $tenant;
    }

    /**
     * Mengembalikan model tenant yang sedang aktif.
     */
    public function get(): ?Tenant
    {
        return $this->tenant;
    }

    /**
     * Mengembalikan id tenant aktif, null jika context kosong.
     */
    public function id(): ?int
    {
        return $this->tenant?->id;
    }

    /**
     * Mengosongkan context tenant.
     */
    public function forget(): void
    {
        $this->tenant = null;
    }

    /**
     * Menjalankan callback tanpa context tenant, lalu mengembalikan context
     * sebelumnya — termasuk saat callback melempar exception.
     */
    public function runWithout(Closure $callback): mixed
    {
        $previous = $this->tenant;
        $this->tenant = null;

        try {
            return $callback();
        } finally {
            $this->tenant = $previous;
        }
    }
}
