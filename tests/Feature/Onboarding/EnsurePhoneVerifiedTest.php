<?php

namespace Tests\Feature\Onboarding;

use App\Http\Middleware\EnsurePhoneVerified;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

/**
 * Test middleware yang memastikan nomor HP sudah terverifikasi.
 */
class EnsurePhoneVerifiedTest extends TestCase
{
    use RefreshDatabase;

    public function test_unverified_user_is_redirected_to_the_verification_page(): void
    {
        Route::middleware(['auth', 'phone.verified'])
            ->get('/_onboarding/protected', fn () => 'ok');

        $user = User::factory()->create([
            'phone' => '6281234567890',
            'phone_verified_at' => null,
        ]);

        $this->actingAs($user)
            ->get('/_onboarding/protected')
            ->assertRedirect(route('onboarding.verify'));
    }

    public function test_verified_user_can_access_the_protected_route(): void
    {
        Route::middleware(['auth', 'phone.verified'])
            ->get('/_onboarding/protected', fn () => 'ok');

        $user = User::factory()->create([
            'phone' => '6281234567890',
            'phone_verified_at' => now(),
        ]);

        $this->actingAs($user)
            ->get('/_onboarding/protected')
            ->assertOk();
    }

    public function test_guest_passes_through_the_middleware(): void
    {
        $request = Request::create('/_onboarding/protected', 'GET');
        $request->setUserResolver(fn () => null);

        $response = app(EnsurePhoneVerified::class)
            ->handle($request, fn () => response('ok'));

        $this->assertSame(200, $response->getStatusCode());
        $this->assertSame('ok', $response->getContent());
    }
}
