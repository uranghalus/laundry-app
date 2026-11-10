import { Head, usePage } from '@inertiajs/react';

import MarketingCtaFooter from '@/components/marketing/cta-footer';
import MarketingFaq, { FAQS } from '@/components/marketing/faq';
import MarketingHero from '@/components/marketing/hero';
import MarketingIntegrations from '@/components/marketing/integrations';
import MarketingPipeline from '@/components/marketing/pipeline';
import MarketingPricing from '@/components/marketing/pricing';
import ProblemsLedger from '@/components/marketing/problems-ledger';
import ProofBand from '@/components/marketing/proof-band';
import MarketingHeader from '@/components/marketing/site-header';
import type { Auth } from '@/types/auth';

/**
 * Halaman marketing Repica di `/` — komposer tipis (R-FE-003): file ini hanya
 * susunan band + metadata `Head`; seluruh isi dan styling berada di
 * `components/marketing/*`.
 *
 * Urutan band "Buku Bukti":
 * Hero (+ pita bukti) → Masalah → Bukti (#fitur) → Cara kerja (#cara-kerja,
 * malam) → Integrasi → Harga (#harga) → FAQ (#faq) → CTA footer (malam).
 *
 * `id` anchor milik masing-masing band harus persis cocok dengan `NAV_LINKS`
 * di `site-header.tsx`.
 */
export default function Welcome() {
    // Generic eksplisit supaya halaman ini tidak bergantung pada augmentasi
    // global `InertiaConfig` di `types/global.d.ts`.
    const { auth } = usePage<{ auth: Auth }>().props;
    const isAuthenticated = Boolean(auth?.user);

    const faqJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQS.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
            },
        })),
    };

    return (
        <div className="welcome-page bg-ground text-ink relative min-h-screen overflow-hidden">
            <Head title="Repica — Manajemen Laundry dengan Bukti Kondisi">
                <meta
                    content="Repica mencatat order, foto kondisi, persetujuan pelanggan, dan kas harian dalam satu buku. Sengketa laundry selesai dengan bukti, bukan ingatan. Trial 14 hari tanpa kartu kredit."
                    name="description"
                />
                <meta
                    content="Repica — manajemen laundry dengan bukti kondisi"
                    property="og:title"
                />
                <meta
                    content="Foto berwatermark, persetujuan WhatsApp, dan jejak audit untuk setiap order. Trial 14 hari tanpa kartu kredit."
                    property="og:description"
                />
                <meta content="website" property="og:type" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(faqJsonLd),
                    }}
                />
            </Head>

            <a
                href="#konten-utama"
                className="bg-action text-action-foreground focus-visible:ring-ring sr-only rounded-md px-4 py-2 text-sm font-semibold focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus-visible:ring-2 focus-visible:ring-offset-2"
            >
                Lewati ke konten
            </a>

            <div className="welcome-shell flex min-h-screen flex-col">
                <MarketingHeader isAuthenticated={isAuthenticated} />

                <main className="flex-1" id="konten-utama" tabIndex={-1}>
                    <MarketingHero isAuthenticated={isAuthenticated} />
                    <ProblemsLedger />
                    <ProofBand />
                    <MarketingPipeline />
                    <MarketingIntegrations />
                    <MarketingPricing isAuthenticated={isAuthenticated} />
                    <MarketingFaq />
                </main>

                <MarketingCtaFooter isAuthenticated={isAuthenticated} />
            </div>
        </div>
    );
}
