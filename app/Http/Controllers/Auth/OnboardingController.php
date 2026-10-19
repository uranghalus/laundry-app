<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionPlan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller untuk onboarding setelah registrasi
 * Step 1: Pilih subscription plan (Basic/Pro)
 * Step 2: (Future) Setup tambahan untuk multi-outlet
 */
class OnboardingController extends Controller
{
    /**
     * Tampilkan halaman pemilihan plan
     * Hanya accessible untuk tenant yang status trial
     */
    public function plan(Request $request): Response
    {
        $user = $request->user();
        $tenant = $user->tenant;

        // Pastikan tenant dalam status trial
        if (! $tenant || ! $tenant->isTrial()) {
            return redirect()->route('dashboard');
        }

        // Ambil subscription trial yang aktif
        $subscription = $tenant->subscription()
            ->where('status', 'trial')
            ->first();

        if (! $subscription) {
            return redirect()->route('dashboard');
        }

        // Ambil semua plan yang tersedia
        $plans = SubscriptionPlan::whereIn('name', ['Basic', 'Pro'])
            ->orderBy('price_monthly')
            ->get()
            ->map(function ($plan) {
                return [
                    'id' => $plan->id,
                    'name' => $plan->name,
                    'price_monthly' => $plan->price_monthly,
                    'price_annual' => $plan->price_annual,
                    'feature_flags' => $plan->feature_flags,
                    'max_outlets' => $plan->max_outlets,
                    'max_users' => $plan->max_users,
                    'max_photos_per_month' => $plan->max_photos_per_month,
                ];
            });

        return Inertia::render('onboarding/plan', [
            'plans' => $plans,
            'tenant' => [
                'name' => $tenant->name,
                'business_type' => $tenant->business_type,
                'trial_ends_at' => $subscription->end_date,
            ],
        ]);
    }

    /**
     * Proses pemilihan plan
     * Update subscription dengan plan yang dipilih
     */
    public function selectPlan(Request $request): RedirectResponse
    {
        $request->validate([
            'plan_id' => 'required|exists:subscription_plans,id',
            'billing_period' => 'required|in:monthly,annual',
        ]);

        $user = $request->user();
        $tenant = $user->tenant;

        // Pastikan tenant dalam status trial
        if (! $tenant || ! $tenant->isTrial()) {
            return redirect()->route('dashboard')
                ->with('error', 'Onboarding sudah selesai.');
        }

        $subscription = $tenant->subscription()
            ->where('status', 'trial')
            ->first();

        if (! $subscription) {
            return redirect()->route('dashboard')
                ->with('error', 'Subscription trial tidak ditemukan.');
        }

        $plan = SubscriptionPlan::findOrFail($request->plan_id);

        // Validasi: multi-outlet hanya bisa pilih Pro
        if ($tenant->isMultiOutlet() && $plan->name === 'Basic') {
            return back()->withErrors([
                'plan_id' => 'Bisnis multi-outlet harus memilih plan Pro.',
            ]);
        }

        // Update subscription dengan plan yang dipilih
        $subscription->update([
            'plan_id' => $plan->id,
            // status tetap trial sampai pembayaran
        ]);

        // Simpan billing period preference di session untuk pembayaran
        session(['billing_period' => $request->billing_period]);

        // Redirect ke halaman pembayaran
        return redirect()->route('onboarding.payment');
    }

    /**
     * Tampilkan halaman pembayaran subscription
     */
    public function payment(Request $request): Response
    {
        $user = $request->user();
        $tenant = $user->tenant;

        if (! $tenant || ! $tenant->isTrial()) {
            return redirect()->route('dashboard');
        }

        $subscription = $tenant->subscription()
            ->where('status', 'trial')
            ->first();

        if (! $subscription) {
            return redirect()->route('dashboard');
        }

        $plan = $subscription->plan;
        $billingPeriod = session('billing_period', 'monthly');
        $amount = $billingPeriod === 'annual' ? $plan->price_annual : $plan->price_monthly;

        return Inertia::render('onboarding/payment', [
            'plan' => [
                'name' => $plan->name,
                'price' => $amount,
                'billing_period' => $billingPeriod,
            ],
            'tenant' => [
                'name' => $tenant->name,
            ],
            'payment_methods' => [
                ['id' => 'xendit_va', 'name' => 'Virtual Account (BCA, BNI, Mandiri, dll)'],
                ['id' => 'xendit_qris', 'name' => 'QRIS'],
                ['id' => 'xendit_ewallet', 'name' => 'E-Wallet (OVO, DANA, ShopeePay, dll)'],
            ],
        ]);
    }

    /**
     * Proses pembayaran (placeholder - integrasi Xendit/Midtrans)
     */
    public function processPayment(Request $request): RedirectResponse
    {
        $request->validate([
            'payment_method' => 'required|in:xendit_va,xendit_qris,xendit_ewallet',
        ]);

        $user = $request->user();
        $tenant = $user->tenant;

        if (! $tenant || ! $tenant->isTrial()) {
            return redirect()->route('dashboard');
        }

        $subscription = $tenant->subscription()
            ->where('status', 'trial')
            ->first();

        if (! $subscription) {
            return redirect()->route('dashboard');
        }

        $plan = $subscription->plan;
        $billingPeriod = session('billing_period', 'monthly');
        $amount = $billingPeriod === 'annual' ? $plan->price_annual : $plan->price_monthly;

        // TODO: Integrasi dengan Xendit/Midtrans
        // Untuk sekarang, simulate payment success
        // Dalam implementasi nyata, redirect ke payment gateway

        // Simulate successful payment
        $subscription->update([
            'status' => 'active',
            'payment_gateway_ref' => 'simulated_'.uniqid(),
        ]);

        // Create payment record
        $tenant->subscription->payments()->create([
            'gateway' => 'xendit',
            'amount' => $amount,
            'status' => 'success',
            'gateway_transaction_id' => 'simulated_'.uniqid(),
            'paid_at' => now(),
        ]);

        // Update tenant status to active
        $tenant->update(['status' => 'active']);

        // Clear session
        session()->forget('billing_period');

        return redirect()->route('dashboard')
            ->with('success', 'Selamat! Subscription Anda sudah aktif. Selamat datang di Laundry SaaS!');
    }

    /**
     * Skip payment (untuk development/testing)
     * Langsung aktifkan subscription trial
     */
    public function skipPayment(Request $request): RedirectResponse
    {
        $user = $request->user();
        $tenant = $user->tenant;

        if (! $tenant || ! $tenant->isTrial()) {
            return redirect()->route('dashboard');
        }

        $subscription = $tenant->subscription()
            ->where('status', 'trial')
            ->first();

        if (! $subscription) {
            return redirect()->route('dashboard');
        }

        // Aktifkan subscription tanpa pembayaran (hanya untuk development)
        if (app()->environment('local', 'testing')) {
            $subscription->update([
                'status' => 'active',
                'payment_gateway_ref' => 'dev_skip_'.uniqid(),
            ]);

            $tenant->update(['status' => 'active']);

            return redirect()->route('dashboard')
                ->with('success', 'Development mode: Subscription diaktifkan tanpa pembayaran.');
        }

        return redirect()->route('onboarding.payment')
            ->with('error', 'Skip payment hanya tersedia di development mode.');
    }
}
