<?php

namespace Tests\Feature\Onboarding;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

/**
 * Test langkah tipe bisnis pada wizard onboarding multi-tenant.
 */
class BusinessTypeTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Guest harus diarahkan ke halaman login untuk ketiga route onboarding.
     */
    public function test_guest_is_redirected_to_login(): void
    {
        $this->get(route('onboarding.index'))
            ->assertRedirect(route('login'));

        $this->get(route('onboarding.business'))
            ->assertRedirect(route('login'));

        $this->post(route('onboarding.business.store'))
            ->assertRedirect(route('login'));
    }

    /**
     * User terverifikasi tanpa tenant harus melihat halaman tipe bisnis.
     */
    public function test_verified_user_without_tenant_sees_the_business_type_page(): void
    {
        $user = $this->makeUser(['phone_verified_at' => now()]);

        $this->actingAs($user)
            ->get(route('onboarding.business'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('onboarding/business-type')
            );
    }

    /**
     * User yang nomornya belum terverifikasi harus diarahkan ke verifikasi OTP.
     */
    public function test_unverified_user_is_redirected_to_phone_verification(): void
    {
        $user = $this->makeUser();

        $this->actingAs($user)
            ->get(route('onboarding.business'))
            ->assertRedirect(route('onboarding.verify'));
    }

    /**
     * Submit valid membuat satu tenant trial dan menautkan user sebagai owner.
     */
    public function test_valid_submission_creates_one_trial_tenant_and_assigns_owner(): void
    {
        $user = $this->makeUser(['phone_verified_at' => now()]);

        $this->actingAs($user)
            ->post(route('onboarding.business.store'), [
                'business_name' => 'Laundry Bersih',
                'business_type' => 'multi',
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect('/onboarding/outlet');

        $tenant = Tenant::query()->sole();

        $this->assertSame('Laundry Bersih', $tenant->name);
        $this->assertSame('multi', $tenant->business_type);
        $this->assertSame('trial', $tenant->status);
        $this->assertSame($tenant->id, $user->fresh()->tenant_id);
        $this->assertSame('owner', $user->fresh()->role);
    }

    /**
     * Double submit tidak boleh menggandakan tenant milik user (guard tenant_id).
     */
    public function test_double_submission_does_not_duplicate_the_tenant(): void
    {
        $user = $this->makeUser(['phone_verified_at' => now()]);

        $this->actingAs($user)
            ->post(route('onboarding.business.store'), [
                'business_name' => 'Laundry Pertama',
                'business_type' => 'single',
            ])
            ->assertRedirect('/onboarding/outlet');

        $this->actingAs($user)
            ->post(route('onboarding.business.store'), [
                'business_name' => 'Nama Berbeda',
                'business_type' => 'multi',
            ])
            ->assertRedirect('/onboarding/outlet');

        $user->fresh();

        $this->assertSame(1, Tenant::query()->count());
        $this->assertSame('Laundry Pertama', $user->fresh()->tenant->name);
    }

    /**
     * User yang sudah punya tenant diarahkan ke langkah outlet berikutnya.
     */
    public function test_verified_user_with_tenant_is_redirected_to_outlet_step(): void
    {
        $tenant = Tenant::create([
            'name' => 'Tenant Ada',
            'business_type' => 'single',
            'status' => 'trial',
        ]);
        $user = $this->makeUser(['phone_verified_at' => now(), 'tenant_id' => $tenant->id]);

        $this->actingAs($user)
            ->get(route('onboarding.business'))
            ->assertRedirect('/onboarding/outlet');
    }

    /**
     * Nama usaha wajib diisi.
     */
    public function test_business_name_is_required(): void
    {
        $user = $this->makeUser(['phone_verified_at' => now()]);

        $this->actingAs($user)
            ->from(route('onboarding.business'))
            ->post(route('onboarding.business.store'), [
                'business_name' => '',
                'business_type' => 'single',
            ])
            ->assertSessionHasErrors('business_name');

        $this->assertSame(0, Tenant::query()->count());
    }

    /**
     * Tipe bisnis hanya boleh single atau multi.
     */
    public function test_business_type_must_be_single_or_multi(): void
    {
        $user = $this->makeUser(['phone_verified_at' => now()]);

        $this->actingAs($user)
            ->from(route('onboarding.business'))
            ->post(route('onboarding.business.store'), [
                'business_name' => 'Laundry Cepat',
                'business_type' => 'branch',
            ])
            ->assertSessionHasErrors('business_type');

        $this->assertSame(0, Tenant::query()->count());
    }

    /**
     * Index onboarding mengarahkan user belum terverifikasi ke halaman OTP.
     */
    public function test_index_redirects_unverified_user_to_phone_verification(): void
    {
        $user = $this->makeUser();

        $this->actingAs($user)
            ->get(route('onboarding.index'))
            ->assertRedirect(route('onboarding.verify'));
    }

    /**
     * Index onboarding mengarahkan user terverifikasi tanpa tenant ke tipe bisnis.
     */
    public function test_index_redirects_verified_user_without_tenant_to_business_step(): void
    {
        $user = $this->makeUser(['phone_verified_at' => now()]);

        $this->actingAs($user)
            ->get(route('onboarding.index'))
            ->assertRedirect('/onboarding/business');
    }

    /**
     * Index onboarding mengarahkan user yang sudah punya tenant ke langkah outlet.
     */
    public function test_index_redirects_verified_user_with_tenant_to_outlet_step(): void
    {
        $tenant = Tenant::create([
            'name' => 'Tenant Ada',
            'business_type' => 'single',
            'status' => 'trial',
        ]);
        $user = $this->makeUser(['phone_verified_at' => now(), 'tenant_id' => $tenant->id]);

        $this->actingAs($user)
            ->get(route('onboarding.index'))
            ->assertRedirect('/onboarding/outlet');
    }

    /**
     * Membuat user owner untuk kebutuhan test.
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
}
