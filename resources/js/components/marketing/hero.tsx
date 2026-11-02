import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

import { Eyebrow } from '@/components/marketing/layout';
import { ProofArtifact } from '@/components/marketing/proof-artifact';
import { register } from '@/routes';

/**
 * Fakta produk yang boleh tampil di bawah hero.
 *
 * Semua angka berasal dari PRD/DECISIONS (trial 14 hari, cap 30 order, enam
 * status pipeline, retensi bukti 12 bulan) — tidak ada metrik traction
 * rekaan.
 */
const HERO_FACTS = [
    { value: '14 hari', label: 'uji coba penuh' },
    { value: '30 order', label: 'selama trial' },
    { value: '6 status', label: 'terpantau' },
    { value: '12 bulan', label: 'bukti tersimpan' },
] as const;

/**
 * Hero halaman marketing.
 *
 * Komposisi: kolom kiri membawa klaim yang bisa dibela, kolom kanan membawa
 * buktinya sebagai nota kondisi nyata. Di mobile nota tetap tampil (tidak
 * disembunyikan) karena mayoritas pengunjung membuka halaman dari HP.
 *
 * Tidak ada glow, partikel, atau parallax. Gerak satu-satunya adalah hover
 * tombol dan transisi warna 200ms.
 *
 * @param isAuthenticated - Menentukan label CTA utama.
 */
export default function MarketingHero({
    isAuthenticated = false,
}: {
    isAuthenticated?: boolean;
}) {
    return (
        <section id="hero" className="border-border border-b">
            <div className="mx-auto grid w-full max-w-[1200px] items-center gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:py-24">
                <div>
                    <Eyebrow index="01">Bukti kondisi</Eyebrow>

                    <h1 className="text-ink mt-6 text-[clamp(2.35rem,6.4vw,4.5rem)] leading-[1.02] font-bold tracking-[-0.035em] text-balance">
                        Laundry Anda,{' '}
                        <span className="decoration-brand-500 underline decoration-[3px] underline-offset-[7px]">
                            dibuktikan
                        </span>{' '}
                        — bukan dijanjikan.
                    </h1>

                    <p className="text-ink-soft mt-6 max-w-xl text-base leading-relaxed sm:text-lg">
                        Foto kondisi awal ber-watermark, persetujuan pelanggan
                        lewat WhatsApp, dan jejak audit untuk setiap aksi.
                        Sengketa baju rusak berhenti jadi kata satu terhadap
                        yang lain.
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <Link
                            href={register()}
                            className="bg-action text-action-foreground hover:bg-action-hover focus-visible:ring-ring inline-flex h-12 items-center justify-center gap-2 rounded-lg px-6 text-sm font-semibold transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2"
                        >
                            {isAuthenticated
                                ? 'Buka dashboard'
                                : 'Coba gratis 14 hari'}
                            <ArrowRight className="size-4" aria-hidden="true" />
                        </Link>
                        <a
                            href="#cara-kerja"
                            className="border-border text-ink hover:bg-band focus-visible:ring-ring inline-flex h-12 items-center justify-center rounded-lg border px-6 text-sm font-semibold transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2"
                        >
                            Lihat cara kerjanya
                        </a>
                    </div>

                    <p className="text-ink-soft mt-5 text-sm tabular-nums">
                        Tanpa kartu kredit · batalkan kapan saja
                    </p>
                </div>

                <div className="lg:pl-4">
                    <ProofArtifact />
                </div>
            </div>

            {/* Strip instrumen: empat fakta produk, dipisah garis rambut. */}
            <div className="border-border border-t">
                <dl className="bg-border mx-auto grid w-full max-w-[1200px] grid-cols-2 gap-px px-5 sm:grid-cols-4 sm:px-8">
                    {HERO_FACTS.map((fact) => (
                        <div
                            key={fact.label}
                            className="bg-background flex flex-col py-5 sm:py-6"
                        >
                            <dt className="text-ink-soft order-2 mt-1 text-xs">
                                {fact.label}
                            </dt>
                            <dd className="text-ink order-1 text-xl font-bold tracking-[-0.02em] tabular-nums sm:text-2xl">
                                {fact.value}
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    );
}
