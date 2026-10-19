<?php

namespace Database\Seeders;

use App\Models\SubscriptionPlan;
use Illuminate\Database\Seeder;

/**
 * Seeder untuk Subscription Plan (Basic & Pro)
 * Harga sesuai PRD: Basic Rp149rb/bln, Pro Rp499rb/bln
 * Annual = 2 bulan gratis
 */
class SubscriptionPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Basic Plan - Single outlet
        SubscriptionPlan::create([
            'name' => 'Basic',
            'price_monthly' => 149000,
            'price_annual' => 1490000, // 10 bulan = 2 bulan gratis
            'feature_flags' => [
                'proof_of_condition' => true,
                'proof_of_condition_cap' => 100, // 100 foto/bulan
                'audit_trail' => true,
                'whatsapp_notifications' => true,
                'daily_reports' => true,
                'deposit_tracking' => true,
                'multi_outlet' => false,
                'rbac_full' => false,
                'consolidated_reports' => false,
                'full_audit_log' => false,
            ],
            'max_outlets' => 1,
            'max_users' => 2,
            'max_photos_per_month' => 100,
        ]);

        // Pro Plan - Multi outlet (2-5)
        SubscriptionPlan::create([
            'name' => 'Pro',
            'price_monthly' => 499000,
            'price_annual' => 4990000, // 10 bulan = 2 bulan gratis
            'feature_flags' => [
                'proof_of_condition' => true,
                'proof_of_condition_cap' => null, // unlimited
                'audit_trail' => true,
                'whatsapp_notifications' => true,
                'daily_reports' => true,
                'deposit_tracking' => true,
                'multi_outlet' => true,
                'rbac_full' => true,
                'consolidated_reports' => true,
                'full_audit_log' => true,
            ],
            'max_outlets' => 5,
            'max_users' => null, // unlimited
            'max_photos_per_month' => null, // unlimited
        ]);
    }
}
