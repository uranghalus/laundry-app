<?php

namespace Database\Factories;

use App\Models\SubscriptionPlan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SubscriptionPlan>
 */
class SubscriptionPlanFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = SubscriptionPlan::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->randomElement(['Basic', 'Pro']),
            'price_monthly' => $this->faker->randomElement([149000, 499000]),
            'price_annual' => $this->faker->randomElement([1490000, 4990000]),
            'feature_flags' => [
                'proof_of_condition' => true,
                'proof_of_condition_cap' => $this->faker->randomElement([100, null]),
                'audit_trail' => true,
                'whatsapp_notifications' => true,
                'daily_reports' => true,
                'deposit_tracking' => true,
                'multi_outlet' => $this->faker->boolean(),
                'rbac_full' => $this->faker->boolean(),
                'consolidated_reports' => $this->faker->boolean(),
                'full_audit_log' => $this->faker->boolean(),
            ],
            'max_outlets' => $this->faker->randomElement([1, 5]),
            'max_users' => $this->faker->randomElement([2, null]),
            'max_photos_per_month' => $this->faker->randomElement([100, null]),
        ];
    }

    /**
     * Indicate that the plan is Basic.
     */
    public function basic(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Basic',
            'price_monthly' => 149000,
            'price_annual' => 1490000,
            'feature_flags' => [
                'proof_of_condition' => true,
                'proof_of_condition_cap' => 100,
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
    }

    /**
     * Indicate that the plan is Pro.
     */
    public function pro(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Pro',
            'price_monthly' => 499000,
            'price_annual' => 4990000,
            'feature_flags' => [
                'proof_of_condition' => true,
                'proof_of_condition_cap' => null,
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
            'max_users' => null,
            'max_photos_per_month' => null,
        ]);
    }
}
