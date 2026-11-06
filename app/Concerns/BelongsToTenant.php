<?php

namespace App\Concerns;

use App\Support\CurrentTenant;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use RuntimeException;

/**
 * Trait BelongsToTenant - isolasi data per tenant.
 *
 * Memasang global scope bernama "tenant" yang hanya memfilter saat context
 * tenant aktif, serta mengisi tenant_id otomatis ketika model dibuat.
 */
trait BelongsToTenant
{
    /**
     * Mendaftarkan global scope tenant dan hook pengisian tenant_id.
     */
    protected static function bootBelongsToTenant(): void
    {
        static::addGlobalScope('tenant', function (Builder $builder): void {
            $tenantId = app(CurrentTenant::class)->id();

            if ($tenantId === null) {
                return;
            }

            $builder->where($builder->getModel()->qualifyColumn('tenant_id'), $tenantId);
        });

        static::creating(function (Model $model): void {
            $tenantId = app(CurrentTenant::class)->id();

            if ($tenantId === null) {
                return;
            }

            $current = $model->getAttribute('tenant_id');

            if ($current === null) {
                $model->setAttribute('tenant_id', $tenantId);

                return;
            }

            if ((int) $current !== $tenantId) {
                throw new RuntimeException(sprintf(
                    'tenant_id %s tidak sesuai dengan context tenant aktif (%d).',
                    $current,
                    $tenantId,
                ));
            }
        });
    }
}
