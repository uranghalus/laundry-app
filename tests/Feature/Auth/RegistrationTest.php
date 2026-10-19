<?php

namespace Tests\Feature\Auth;

use App\Models\SubscriptionPlan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Fortify\Features;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->skipUnlessFortifyHas(Features::registration());

        // Seed subscription plans
        SubscriptionPlan::factory()->create([
            'name' => 'Basic',
            'price_monthly' => 149000,
            'price_annual' => 1490000,
            'max_outlets' => 1,
            'max_users' => 2,
        ]);
        SubscriptionPlan::factory()->create([
            'name' => 'Pro',
            'price_monthly' => 499000,
            'price_annual' => 4990000,
            'max_outlets' => 5,
            'max_users' => null,
        ]);
    }

    public function test_registration_screen_can_be_rendered()
    {
        $response = $this->get(route('register'));

        $response->assertOk();
    }

    public function test_new_users_can_register()
    {
        $response = $this->post(route('register.store'), [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'phone' => '081234567890',
            'business_type' => 'single',
            'outlet_name' => 'Test Outlet',
            'outlet_address' => 'Jl. Test No. 123',
            'outlet_whatsapp_number' => '081234567891',
        ]);

        $this->assertAuthenticated();
        // Redirect to onboarding plan selection
        $response->assertRedirect(route('onboarding.plan', absolute: false));
    }
}
