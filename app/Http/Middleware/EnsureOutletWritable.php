<?php

namespace App\Http\Middleware;

use App\Models\Outlet;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Membatasi request mutasi pada outlet yang sedang tidak menerima penulisan.
 *
 * Outlet diambil dari parameter route "outlet" (model binding atau id numerik).
 * Outlet yang tidak ditemukan atau bukan milik tenant user dianggap tidak ada
 * (404) agar keberadaan outlet tenant lain tidak bocor.
 */
class EnsureOutletWritable
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

        $outlet = $this->resolveOutlet($request);

        if (! $outlet || $outlet->tenant_id !== $request->user()?->tenant_id) {
            abort(404);
        }

        if (! $outlet->isWritable()) {
            abort(403, 'Outlet ini sedang ditutup untuk perubahan data.');
        }

        return $next($request);
    }

    /**
     * Mengambil outlet dari parameter route, mendukung model binding maupun id.
     */
    private function resolveOutlet(Request $request): ?Outlet
    {
        $value = $request->route('outlet');

        if ($value instanceof Outlet) {
            return $value;
        }

        if ($value === null || ! is_numeric($value)) {
            return null;
        }

        return Outlet::query()->find((int) $value);
    }
}
