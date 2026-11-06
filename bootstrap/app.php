<?php

use App\Http\Middleware\EnsureOutletWritable;
use App\Http\Middleware\EnsurePhoneVerified;
use App\Http\Middleware\EnsureSubscriptionActive;
use App\Http\Middleware\EnsureTenantContext;
use App\Http\Middleware\EnsureTenantIsTrial;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'tenant.context' => EnsureTenantContext::class,
            'phone.verified' => EnsurePhoneVerified::class,
            'tenant.trial' => EnsureTenantIsTrial::class,
            'subscription.active' => EnsureSubscriptionActive::class,
            'outlet.writable' => EnsureOutletWritable::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );
    })->create();
