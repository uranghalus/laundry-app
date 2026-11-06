<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Membatasi request mutasi saat subscription tenant tidak aktif.
 *
 * Request baca (GET/HEAD/OPTIONS) selalu lolos agar data historis tetap bisa
 * diakses dalam mode read-only. Middleware ini dipasang setelah context tenant.
 */
class EnsureSubscriptionActive
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->isMethodSafe()) {
            return $next($request);
        }

        $tenant = $request->user()?->tenant;
        $subscription = $tenant?->subscription()->latest('id')->first();

        if (! $subscription || $subscription->isExpired()) {
            abort(403, 'Langganan tenant sudah tidak aktif. Perpanjang langganan untuk melakukan perubahan data.');
        }

        return $next($request);
    }
}
