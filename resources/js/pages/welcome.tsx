import { Head, usePage } from '@inertiajs/react';

import AudienceStrip from '@/components/marketing/audience-strip';
import MarketingCtaFooter from '@/components/marketing/cta-footer';
import MarketingFaq from '@/components/marketing/faq';
import FeatureBento from '@/components/marketing/feature-bento';
import MarketingHero from '@/components/marketing/hero';
import MarketingIntegrations from '@/components/marketing/integrations';
import MarketingPipeline from '@/components/marketing/pipeline';
import MarketingPricing from '@/components/marketing/pricing';
import MarketingHeader from '@/components/marketing/site-header';
import type { Auth } from '@/types/auth';

/**
 * Halaman marketing Repica di `/` — komposer tipis (R-FE-003): file ini hanya
 * susunan band + metadata `Head`; seluruh isi dan styling berada di
 * `components/marketing/*`.
 *
 * Urutan band "Bukti Terkendali" (DESIGN.md v3):
 * Hero → Audience → Feature Bento (#fitur) → Pipeline (#cara-kerja, navy) →
 * Integrations → Pricing (#harga) → FAQ (#faq) → CTA footer (navy).
 *
 * `id` anchor milik masing-masing band harus persis cocok dengan `NAV_LINKS`
 * di `site-header.tsx`.
 */
export default function Welcome() {
    // Generic eksplisit supaya halaman ini tidak bergantung pada augmentasi
    // global `InertiaConfig` di `types/global.d.ts`.
    const { auth } = usePage<{ auth: Auth }>().props;
    const isAuthenticated = Boolean(auth?.user);

    return (
        <>
            <Head title="Repica — SaaS Manajemen Laundry dengan Bukti Kondisi">
                <meta
                    content="Repica adalah SaaS manajemen laundry dengan bukti kondisi: foto saat masuk + watermark + persetujuan WhatsApp untuk mencegah fraud dan sengketa. Trial 14 hari."
                    name="description"
                />
                <meta
                    content="Repica — manajemen laundry dengan bukti kondisi"
                    property="og:title"
                />
                <meta
                    content="Foto ber-watermark, persetujuan WhatsApp, dan jejak audit untuk setiap order. Trial 14 hari tanpa kartu kredit."
                    property="og:description"
                />
                <meta content="website" property="og:type" />
            </Head>

            <a
                href="#konten-utama"
                className="bg-action text-action-foreground focus-visible:ring-ring sr-only rounded-lg px-4 py-2 text-sm font-semibold focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus-visible:ring-2 focus-visible:ring-offset-2"
            >
                Lewati ke konten
            </a>

            <div className="bg-background flex min-h-screen flex-col">
                <MarketingHeader isAuthenticated={isAuthenticated} />

                <main className="flex-1" id="konten-utama" tabIndex={-1}>
                    <MarketingHero isAuthenticated={isAuthenticated} />
                    <AudienceStrip />
                    <FeatureBento />
                    <MarketingPipeline />
                    <MarketingIntegrations />
                    <MarketingPricing isAuthenticated={isAuthenticated} />
                    <MarketingFaq />
                </main>

                <MarketingCtaFooter isAuthenticated={isAuthenticated} />
            </div>
        </>
    );
}
