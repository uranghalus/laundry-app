<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware untuk memastikan tenant dalam status trial
 * Hanya tenant trial yang bisa akses halaman onboarding
 */
class EnsureTenantIsTrial
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || ! $user->tenant) {
            return redirect()->route('dashboard');
        }

        $tenant = $user->tenant;

        // Hanya tenant dengan status trial yang bisa akses onboarding
        if (! $tenant->isTrial()) {
            return redirect()->route('dashboard');
        }

        // Pastikan ada subscription trial aktif
        $subscription = $tenant->subscription()
            ->where('status', 'trial')
            ->first();

        if (! $subscription) {
            return redirect()->route('dashboard');
        }

        return $next($request);
    }
}
