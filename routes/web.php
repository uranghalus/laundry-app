<?php

use App\Http\Controllers\Auth\BusinessTypeController;
use App\Http\Controllers\Auth\OnboardingController;
use App\Http\Controllers\Auth\OnboardingOutletController;
use App\Http\Controllers\Auth\OtpVerificationController;
use App\Http\Controllers\Auth\RegisterController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

// Guest routes
Route::middleware('guest')->group(function () {
    Route::get('/register', [RegisterController::class, 'create'])->name('register');
    Route::post('/register', [RegisterController::class, 'store'])->name('register.store');
});

// Authenticated routes yang belum memerlukan tenant (wizard onboarding)
Route::middleware('auth')->group(function () {
    Route::get('/onboarding/verify', [OtpVerificationController::class, 'show'])->name('onboarding.verify');
    Route::post('/onboarding/verify', [OtpVerificationController::class, 'verify'])->name('onboarding.verify.store');
    Route::post('/onboarding/verify/resend', [OtpVerificationController::class, 'resend'])->name('onboarding.verify.resend');

    // Index onboarding: mengarahkan user ke langkah wizard yang sedang berjalan.
    Route::get('/onboarding', [BusinessTypeController::class, 'index'])->name('onboarding.index');

    // Langkah tipe bisnis dan outlet pertama: butuh nomor HP yang sudah terverifikasi.
    Route::middleware('phone.verified')->group(function () {
        Route::get('/onboarding/business', [BusinessTypeController::class, 'show'])->name('onboarding.business');
        Route::post('/onboarding/business', [BusinessTypeController::class, 'store'])->name('onboarding.business.store');

        Route::get('/onboarding/outlet', [OnboardingOutletController::class, 'show'])->name('onboarding.outlet');
        Route::post('/onboarding/outlet', [OnboardingOutletController::class, 'store'])->name('onboarding.outlet.store');
    });
});

// Authenticated routes
Route::middleware(['auth', 'tenant.context'])->group(function () {
    // Onboarding routes (hanya untuk tenant trial)
    Route::middleware('tenant.trial')->group(function () {
        Route::get('/onboarding/plan', [OnboardingController::class, 'plan'])->name('onboarding.plan');
        Route::post('/onboarding/plan', [OnboardingController::class, 'selectPlan'])->name('onboarding.plan.select');
        Route::get('/onboarding/payment', [OnboardingController::class, 'payment'])->name('onboarding.payment');
        Route::post('/onboarding/payment', [OnboardingController::class, 'processPayment'])->name('onboarding.payment.process');
        Route::post('/onboarding/skip-payment', [OnboardingController::class, 'skipPayment'])->name('onboarding.skip-payment');
    });

    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
