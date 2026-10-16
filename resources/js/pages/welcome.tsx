import { Head, usePage } from '@inertiajs/react';

import AudienceStrip from '@/components/marketing/audience-strip';
import MarketingCtaFooter from '@/components/marketing/cta-footer';
import MarketingFaq from '@/components/marketing/faq';
import MarketingHeader from '@/components/marketing/site-header';
import MarketingHero from '@/components/marketing/hero';
import MarketingIntegrations from '@/components/marketing/integrations';
import MarketingPipeline from '@/components/marketing/pipeline';
import MarketingPricing from '@/components/marketing/pricing';
import FeatureBento from '@/components/marketing/feature-bento';
import type { Auth } from '@/types/auth';

/**
 * Halaman marketing Repica di `/`.
 *
 * Composer tipis: seluruh isi berada di `components/marketing/*` supaya tiap
 * bagian bisa ditinjau dan diubah sendiri tanpa menyentuh file ini
 * (Rules.md R-FE-002, reusable-first).
 *
 * Urutan band mengikuti urutan keputusan pembeli: bukti (hero + bento) → alur →
 * kanal → harga → keraguan → aksi penutup. Pacing sengaja berganti densitas:
 * hero ramai, strip tenang, bento padat, tabel hidup, integrasi tenang,
 * harga padat, FAQ tenang, penutup berwarna penuh.
 */
export default function Welcome() {
    // Generic eksplisit supaya halaman ini tidak bergantung pada augmentasi
    // global `InertiaConfig` di `types/global.d.ts`.
    const { auth } = usePage<{ auth: Auth }>().props;
    const isAuthenticated = Boolean(auth?.user);

    return (
        <>
            <Head title="Repica — Manajemen laundry dengan bukti kondisi">
                <meta
                    content="Repica memotret kondisi pakaian saat masuk, memberi stempel waktu, dan meminta persetujuan pelanggan lewat WhatsApp. Staff tidak bisa mengubah harga atau membatalkan transaksi tanpa jejak."
                    name="description"
                />
            </Head>

            <div className="bg-background flex min-h-screen flex-col">
                <MarketingHeader isAuthenticated={isAuthenticated} />

                <main className="flex-1">
                    <MarketingHero isAuthenticated={isAuthenticated} />
                    <AudienceStrip />
                    <FeatureBento />
                    <MarketingPipeline />
                    <MarketingIntegrations />
                    <MarketingPricing />
                    <MarketingFaq />
                </main>

                <MarketingCtaFooter />
            </div>
        </>
    );
}
