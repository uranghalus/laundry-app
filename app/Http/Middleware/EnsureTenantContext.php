<?php

namespace App\Http\Middleware;

use App\Support\CurrentTenant;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware untuk menetapkan context tenant dari user yang sedang login.
 *
 * User tanpa tenant diarahkan ke halaman onboarding. Guest dibiarkan lewat
 * karena middleware ini hanya dipasang pada grup route terautentikasi.
 */
class EnsureTenantContext
{
    /**
     * Dependency context tenant aktif.
     */
    public function __construct(private CurrentTenant $currentTenant) {}

    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return $next($request);
        }

        $tenant = $user->tenant;

        if (! $tenant) {
            return redirect('/onboarding');
        }

        $previous = $this->currentTenant->get();
        $this->currentTenant->set($tenant);

        try {
            return $next($request);
        } finally {
            $this->currentTenant->set($previous);
        }
    }
}
