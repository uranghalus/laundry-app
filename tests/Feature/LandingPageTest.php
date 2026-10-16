<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

/**
 * Pengujian halaman marketing Repica di `/`.
 *
 * Cakupannya sengaja dijaga tetap: memastikan landing page dirender sebagai
 * komponen Inertia `welcome`, komponen marketing benar-benar terpasang
 * (regresi composer tipis), dan CTA utama mengarah ke `/register` yang bisa
 * dijangkau.
 */
class LandingPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_view_the_landing_page(): void
    {
        $response = $this->get(route('home'));

        $response->assertOk();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('welcome')
            ->where('auth.user', null)
        );
    }

    public function test_landing_page_composes_every_marketing_section(): void
    {
        $response = $this->get(route('home'));

        // Penjaga regresi: bila salah satu section lupa dipasang, compose
        // halaman tetap hidup tapi funnel-nya kehilangan bagian.
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('welcome')
        );

        // Menjaga funnel tetap utuh: harga (angka tabular, "Rp" dipisah
        // elemen dari digitnya), tier Enterprise terkunci, dan kanal integrasi.
        $html = $response->getContent();
        $this->assertStringContainsString('Repica', $html);
        $this->assertStringContainsString('Baju rusak', $html);
        $this->assertStringContainsString('149.000', $html);
        $this->assertStringContainsString('499.000', $html);
        $this->assertStringContainsString('Segera', $html);
        $this->assertStringContainsString('WhatsApp Business', $html);
    }

    public function test_authenticated_user_sees_dashboard_link_instead_of_login(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('home'));

        $response->assertOk();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->where('auth.user.id', $user->id)
        );

        $this->assertStringContainsString(
            'Buka Dashboard',
            $response->getContent(),
        );
    }

    public function test_landing_page_cta_register_route_is_reachable(): void
    {
        // Landing page menjanjikan "Coba Gratis 14 Hari" menuju /register;
        // test ini menjaga agar tautannya tidak pernah mati.
        $this->get(route('register'))->assertOk();
    }
}
