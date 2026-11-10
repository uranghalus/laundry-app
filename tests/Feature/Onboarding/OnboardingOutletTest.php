<?php

namespace Tests\Feature\Onboarding;

use App\Models\Outlet;
use App\Models\Tenant;
use App\Models\User;
use App\Support\PhoneNumber;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

/**
 * Test langkah outlet pertama pada wizard onboarding multi-tenant.
 */
class OnboardingOutletTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Guest harus diarahkan ke halaman login untuk GET maupun POST.
     */
    public function test_guest_is_redirected_to_login_for_get_and_post(): void
    {
        $this->get(route('onboarding.outlet'))
            ->assertRedirect(route('login'));

        $this->post(route('onboarding.outlet.store'))
            ->assertRedirect(route('login'));
    }

    /**
     * User terverifikasi tanpa tenant dikembalikan ke langkah tipe bisnis.
     */
    public function test_verified_user_without_tenant_is_sent_back_to_the_business_step(): void
    {
        $user = $this->makeUser(['phone_verified_at' => now()]);

        $this->actingAs($user)
            ->get(route('onboarding.outlet'))
            ->assertRedirect('/onboarding/business');

        $this->actingAs($user)
            ->post(route('onboarding.outlet.store'), [
                'name' => 'Gerai Barito',
                'address' => 'Jl. Jenderal Sudirman No. 10, Banjarmasin',
                'whatsapp_number' => '081234567890',
            ])
            ->assertRedirect('/onboarding/business');

        $this->assertSame(0, Outlet::query()->count());
    }

    /**
     * User terverifikasi dengan tenant tanpa outlet melihat halaman outlet.
     */
    public function test_verified_user_with_tenant_without_outlet_sees_the_outlet_page(): void
    {
        $user = $this->makeUser([
            'phone_verified_at' => now(),
            'tenant_id' => $this->makeTenant()->id,
        ]);

        $this->actingAs($user)
            ->get(route('onboarding.outlet'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('onboarding/outlet')
            );
    }

    /**
     * User yang nomornya belum terverifikasi diarahkan ke verifikasi OTP.
     */
    public function test_unverified_user_is_redirected_to_phone_verification(): void
    {
        $user = $this->makeUser(['tenant_id' => $this->makeTenant()->id]);

        $this->actingAs($user)
            ->get(route('onboarding.outlet'))
            ->assertRedirect(route('onboarding.verify'));
    }

    /**
     * Submit valid membuat satu outlet dengan tenant_id dari user, bukan input.
     */
    public function test_valid_submission_creates_one_outlet_with_tenant_from_the_user(): void
    {
        $tenant = $this->makeTenant();
        $otherTenant = $this->makeTenant();
        $user = $this->makeUser(['phone_verified_at' => now(), 'tenant_id' => $tenant->id]);

        $this->actingAs($user)
            ->post(route('onboarding.outlet.store'), [
                'name' => 'Gerai Barito',
                'address' => 'Jl. Jenderal Sudirman No. 10, Banjarmasin',
                'whatsapp_number' => '0812-3456-7890',
                // Usaha membajak tenant_id tidak boleh berpengaruh.
                'tenant_id' => $otherTenant->id,
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect('/onboarding/selesai');

        $outlet = Outlet::query()->sole();

        $this->assertSame($tenant->id, $outlet->tenant_id);
        $this->assertNotSame($otherTenant->id, $outlet->tenant_id);
        $this->assertSame('Gerai Barito', $outlet->name);
        $this->assertSame('Jl. Jenderal Sudirman No. 10, Banjarmasin', $outlet->address);
        $this->assertSame('6281234567890', $outlet->whatsapp_number);
        $this->assertSame($outlet->id, $user->fresh()->outlet_id);
    }

    /**
     * Double submit tidak boleh menggandakan outlet milik tenant (guard R2).
     */
    public function test_double_submission_does_not_duplicate_the_outlet(): void
    {
        $user = $this->makeUser([
            'phone_verified_at' => now(),
            'tenant_id' => $this->makeTenant()->id,
        ]);

        $this->actingAs($user)
            ->post(route('onboarding.outlet.store'), [
                'name' => 'Gerai Pertama',
                'address' => 'Jl. Awal No. 1',
                'whatsapp_number' => '081234567890',
            ])
            ->assertRedirect('/onboarding/selesai');

        $this->actingAs($user)
            ->post(route('onboarding.outlet.store'), [
                'name' => 'Gerai Kedua',
                'address' => 'Jl. Berbeda No. 2',
                'whatsapp_number' => '6289876543210',
            ])
            ->assertRedirect('/onboarding/selesai');

        $outlet = Outlet::query()->sole();

        $this->assertSame(1, Outlet::query()->count());
        $this->assertSame(1, $user->tenant->outlets()->count());
        $this->assertSame('Gerai Pertama', $outlet->name);
        $this->assertSame($outlet->id, $user->fresh()->outlet_id);
    }

    /**
     * User yang sudah punya outlet diarahkan ke langkah selesai tanpa membuat
     * outlet baru lagi.
     */
    public function test_user_with_existing_outlet_is_redirected_to_the_finish_step(): void
    {
        $tenant = $this->makeTenant();
        $outlet = $this->makeOutlet($tenant);
        $user = $this->makeUser([
            'phone_verified_at' => now(),
            'tenant_id' => $tenant->id,
            'outlet_id' => $outlet->id,
        ]);

        $this->actingAs($user)
            ->get(route('onboarding.outlet'))
            ->assertRedirect('/onboarding/selesai');

        $this->actingAs($user)
            ->post(route('onboarding.outlet.store'), [
                'name' => 'Gerai Baru',
                'address' => 'Jl. Baru No. 3',
                'whatsapp_number' => '081234567890',
            ])
            ->assertRedirect('/onboarding/selesai');

        $this->assertSame(1, Outlet::query()->count());
    }

    /**
     * Nomor WA terlalu pendek ditolak dan tidak ada outlet yang dibuat.
     */
    public function test_too_short_whatsapp_number_is_rejected_and_creates_no_outlet(): void
    {
        $user = $this->makeUser([
            'phone_verified_at' => now(),
            'tenant_id' => $this->makeTenant()->id,
        ]);

        $this->actingAs($user)
            ->from(route('onboarding.outlet'))
            ->post(route('onboarding.outlet.store'), [
                'name' => 'Gerai Barito',
                'address' => 'Jl. Jenderal Sudirman No. 10, Banjarmasin',
                'whatsapp_number' => '081200',
            ])
            ->assertSessionHasErrors('whatsapp_number');

        $this->assertSame(0, Outlet::query()->count());
    }

    /**
     * Nomor WA dengan pemisah atau awalan +62 dinormalisasi sebelum dibandingkan.
     */
    public function test_whatsapp_number_with_separators_is_normalized_before_validation(): void
    {
        $user = $this->makeUser([
            'phone_verified_at' => now(),
            'tenant_id' => $this->makeTenant()->id,
        ]);

        $this->actingAs($user)
            ->post(route('onboarding.outlet.store'), [
                'name' => 'Gerai Barito',
                'address' => 'Jl. Jenderal Sudirman No. 10, Banjarmasin',
                'whatsapp_number' => '+62 812 3456 7890',
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect('/onboarding/selesai');

        $this->assertSame('6281234567890', Outlet::query()->sole()->whatsapp_number);
    }

    /**
     * Tenant yang sudah punya outlet mengarahkan owner tanpa ikatan outlet ke
     * langkah selesai (paruh count() dari guard R2, kasus co-owner).
     */
    public function test_tenant_with_outlet_but_unassigned_owner_is_sent_to_the_finish_step(): void
    {
        $tenant = $this->makeTenant();
        $this->makeOutlet($tenant);
        $user = $this->makeUser(['phone_verified_at' => now(), 'tenant_id' => $tenant->id]);

        $this->actingAs($user)
            ->get(route('onboarding.outlet'))
            ->assertRedirect('/onboarding/selesai');

        $this->actingAs($user)
            ->post(route('onboarding.outlet.store'), [
                'name' => 'Gerai Baru',
                'address' => 'Jl. Baru No. 3',
                'whatsapp_number' => '081234567890',
            ])
            ->assertRedirect('/onboarding/selesai');

        $this->assertSame(1, Outlet::query()->count());
    }

    /**
     * Normalisasi nomor telepon: pemisah dibuang, awalan 0/8 menjadi 62.
     *
     * Kasus '081200' sengaja diteruskan oleh normalisasi — panjang bukan urusan
     * normalisasi, penolakannya di regex validasi (regex:^62[0-9]{7,13}$).
     */
    public function test_normalize_rewrites_common_phone_formats(): void
    {
        $cases = [
            '0812-3456-7890' => '6281234567890',
            ' 0812.3456.7890 ' => '6281234567890',
            '+62 812 3456 7890' => '6281234567890',
            '6281234567890' => '6281234567890',
            '81234567890' => '6281234567890',
            '081200' => '6281200',
        ];

        foreach ($cases as $input => $expected) {
            $this->assertSame($expected, PhoneNumber::normalize($input));
        }
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

    /**
     * Membuat tenant trial untuk kebutuhan test.
     */
    private function makeTenant(): Tenant
    {
        return Tenant::create([
            'name' => 'Laundry Bersih Jaya',
            'business_type' => 'single',
            'status' => 'trial',
        ]);
    }

    /**
     * Membuat outlet milik tenant untuk kebutuhan test.
     */
    private function makeOutlet(Tenant $tenant): Outlet
    {
        return Outlet::create([
            'tenant_id' => $tenant->id,
            'name' => 'Gerai Awal',
            'address' => 'Jl. Awal No. 1',
            'whatsapp_number' => '6281234567890',
        ]);
    }
}
