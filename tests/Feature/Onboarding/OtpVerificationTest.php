<?php

namespace Tests\Feature\Onboarding;

use App\Contracts\OtpSender;
use App\Enums\OtpPurpose;
use App\Models\User;
use App\Services\Otp\OtpService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

/**
 * Test alur verifikasi OTP nomor HP setelah registrasi.
 */
class OtpVerificationTest extends TestCase
{
    use RefreshDatabase;

    private RecordingOtpSender $sender;

    protected function setUp(): void
    {
        parent::setUp();

        $this->sender = new RecordingOtpSender;
        $this->app->instance(OtpSender::class, $this->sender);
    }

    public function test_guest_is_redirected_to_login(): void
    {
        $this->get(route('onboarding.verify'))
            ->assertRedirect(route('login'));
    }

    public function test_verification_page_shows_the_masked_phone(): void
    {
        $user = $this->makeUser();

        $this->actingAs($user)
            ->get(route('onboarding.verify'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('onboarding/verify')
                ->where('phone', '6281****7890')
            );
    }

    public function test_wrong_code_does_not_verify_the_phone(): void
    {
        $user = $this->makeUser();
        app(OtpService::class)->issue($user->phone, OtpPurpose::Register);

        $this->actingAs($user)
            ->from(route('onboarding.verify'))
            ->post(route('onboarding.verify.store'), [
                'code' => $this->wrongCode($this->sender->sent[0]['code']),
            ])
            ->assertSessionHasErrors('code');

        $this->assertNull($user->fresh()->phone_verified_at);
    }

    public function test_correct_code_verifies_the_phone_and_redirects_to_business(): void
    {
        $user = $this->makeUser();
        app(OtpService::class)->issue($user->phone, OtpPurpose::Register);

        $this->actingAs($user)
            ->post(route('onboarding.verify.store'), [
                'code' => $this->sender->sent[0]['code'],
            ])
            ->assertRedirect('/onboarding/business');

        $this->assertNotNull($user->fresh()->phone_verified_at);
    }

    public function test_code_issued_for_another_purpose_is_rejected(): void
    {
        $user = $this->makeUser();
        app(OtpService::class)->issue($user->phone, OtpPurpose::OutletWa);

        $this->actingAs($user)
            ->from(route('onboarding.verify'))
            ->post(route('onboarding.verify.store'), [
                'code' => $this->sender->sent[0]['code'],
            ])
            ->assertSessionHasErrors('code');

        $this->assertNull($user->fresh()->phone_verified_at);
    }

    public function test_resend_is_blocked_while_in_cooldown(): void
    {
        $user = $this->makeUser();
        app(OtpService::class)->issue($user->phone, OtpPurpose::Register);

        $this->actingAs($user)
            ->from(route('onboarding.verify'))
            ->post(route('onboarding.verify.resend'))
            ->assertSessionHasErrors('phone');

        $this->assertCount(1, $this->sender->sent);
    }

    public function test_resend_sends_a_new_code_after_cooldown(): void
    {
        $user = $this->makeUser();
        app(OtpService::class)->issue($user->phone, OtpPurpose::Register);

        $this->travel(61)->seconds();

        $this->actingAs($user)
            ->from(route('onboarding.verify'))
            ->post(route('onboarding.verify.resend'))
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('onboarding.verify'));

        $this->assertCount(2, $this->sender->sent);
    }

    public function test_already_verified_user_is_redirected_to_business(): void
    {
        $user = $this->makeUser(['phone_verified_at' => now()]);

        $this->actingAs($user)
            ->get(route('onboarding.verify'))
            ->assertRedirect('/onboarding/business');
    }

    /**
     * Membuat user owner yang belum punya tenant untuk kebutuhan test.
     *
     * @param  array<string, mixed>  $attributes
     */
    private function makeUser(array $attributes = []): User
    {
        return User::factory()->create([
            'phone' => '6281234567890',
            'tenant_id' => null,
            'outlet_id' => null,
            'role' => 'owner',
            'phone_verified_at' => null,
            ...$attributes,
        ]);
    }

    /**
     * Membuat kode 6 digit yang berbeda dari kode benar.
     */
    private function wrongCode(string $code): string
    {
        return $code === '000000' ? '111111' : '000000';
    }
}

/**
 * Test double OtpSender yang mencatat kode yang seharusnya dikirim.
 */
final class RecordingOtpSender implements OtpSender
{
    /** @var list<array{phone: string, code: string}> */
    public array $sent = [];

    public function send(string $phone, string $code): void
    {
        $this->sent[] = ['phone' => $phone, 'code' => $code];
    }
}
