<?php

namespace Tests\Feature\Auth;

use App\Enums\OtpPurpose;
use App\Models\User;
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
    }

    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get(route('register'));

        $response->assertOk();
    }

    public function test_new_users_can_register_with_account_data_only(): void
    {
        $response = $this->post(route('register.store'), [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'phone' => '081234567890',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertRedirect(route('onboarding.verify'));
        $this->assertAuthenticated();

        $user = User::query()->where('email', 'test@example.com')->firstOrFail();

        $this->assertNull($user->tenant_id);
        $this->assertNull($user->outlet_id);
        $this->assertSame('owner', $user->role);
        $this->assertSame('active', $user->status);
        $this->assertSame('6281234567890', $user->phone);
        $this->assertNull($user->email_verified_at);
        $this->assertNull($user->phone_verified_at);

        $this->assertDatabaseHas('otp_codes', [
            'phone' => '6281234567890',
            'purpose' => OtpPurpose::Register->value,
        ]);
    }

    public function test_registration_succeeds_without_business_or_outlet_fields(): void
    {
        $response = $this->post(route('register.store'), [
            'name' => 'Owner Laundry',
            'email' => 'owner@example.com',
            'phone' => '6281234567891',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect(route('onboarding.verify'));

        $this->assertDatabaseHas('users', ['email' => 'owner@example.com']);
        $this->assertDatabaseCount('tenants', 0);
        $this->assertDatabaseCount('outlets', 0);
    }

    public function test_registration_requires_phone(): void
    {
        $response = $this->from(route('register'))->post(route('register.store'), [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'phone' => '',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertSessionHasErrors('phone');
        $this->assertDatabaseMissing('users', ['email' => 'test@example.com']);
    }

    public function test_phone_separators_are_stripped_before_validation(): void
    {
        $response = $this->post(route('register.store'), [
            'name' => 'Test User',
            'email' => 'format@example.com',
            'phone' => '0812-3456-7890',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('users', [
            'email' => 'format@example.com',
            'phone' => '6281234567890',
        ]);
    }

    public function test_short_password_is_rejected(): void
    {
        $response = $this->from(route('register'))->post(route('register.store'), [
            'name' => 'Test User',
            'email' => 'weak@example.com',
            'phone' => '081234567890',
            'password' => 'pendek',
            'password_confirmation' => 'pendek',
        ]);

        $response->assertSessionHasErrors('password');
        $this->assertDatabaseMissing('users', ['email' => 'weak@example.com']);
    }
}
