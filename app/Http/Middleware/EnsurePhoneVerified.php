<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware yang memastikan nomor HP user sudah terverifikasi.
 *
 * User yang belum memverifikasi nomor HP diarahkan ke halaman verifikasi OTP.
 * Guest dibiarkan lewat karena middleware ini dipasang pada grup route
 * terautentikasi.
 */
class EnsurePhoneVerified
{
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

        if (! $user->hasVerifiedPhone()) {
            return redirect()->route('onboarding.verify');
        }

        return $next($request);
    }
}
