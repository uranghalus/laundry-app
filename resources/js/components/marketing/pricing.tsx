import { useState } from 'react';

import { Link } from '@inertiajs/react';
import { ArrowRight, Check, Minus } from 'lucide-react';

import { Container, SectionHeading } from '@/components/marketing/layout';
import { cn } from '@/lib/utils';
import { dashboard, register } from '@/routes';

/**
 * Paket berbayar yang benar-benar dapat dibeli (DECISIONS.md Q1 & Q9).
 * Harga tahunan = 10× bulanan, jadi dua bulan gratis — bukan diskon rekaan.
 */
const PLANS = [
    {
        key: 'basic',
        name: 'Basic',
        tagline: 'Untuk satu gerai yang ingin rapi dulu.',
        monthlyPrice: 149000,
        annualPrice: 1490000,
        featured: false,
        features: [
            '1 outlet, 2 pengguna',
            'Order end-to-end + notifikasi WhatsApp',
            'Bukti kondisi 100 foto/bulan',
            'Laporan harian + deposit member',
            'Jejak audit per order',
        ],
        excluded: ['Multi-outlet', 'Laporan konsolidasi'],
    },
    {
        key: 'pro',
        name: 'Pro',
        tagline: 'Untuk jaringan 2–5 outlet dengan banyak staf.',
        monthlyPrice: 499000,
        annualPrice: 4990000,
        featured: true,
        features: [
            'Sampai 5 outlet, pengguna tak terbatas',
            'Semua fitur Basic',
            'Bukti kondisi tanpa batas',
            'Multi-outlet + RBAC penuh',
            'Laporan konsolidasi + audit log penuh',
        ],
        excluded: [],
    },
] as const;

type Billing = 'bulanan' | 'tahunan';

/**
 * Format nominal Rupiah dengan pemisah ribuan titik (format Indonesia).
 *
 * @param value - Nominal dalam rupiah.
 * @returns Nominal tanpa awalan `Rp`, mis. `149.000`.
 */
function formatRupiah(value: number): string {
    return value.toLocaleString('id-ID');
}

/**
 * Kartu satu paket berbayar.
 *
 * Paket unggulan memakai bidang navy penuh dengan teks putih — satu-satunya
 * kartu berwarna di band harga, supaya rekomendasi terbaca tanpa badge
 * tambahan yang berisik.
 *
 * @param plan - Definisi paket dari `PLANS`.
 * @param billing - Siklus tagihan yang sedang dipilih.
 * @param isAuthenticated - Menentukan tujuan CTA.
 */
function PlanCard({
    plan,
    billing,
    isAuthenticated,
}: {
    plan: (typeof PLANS)[number];
    billing: Billing;
    isAuthenticated: boolean;
}) {
    const featured = plan.featured;
    const price = billing === 'bulanan' ? plan.monthlyPrice : plan.annualPrice;
    const perMonth = Math.round(plan.annualPrice / 12);
    const href = isAuthenticated ? dashboard() : register();

    return (
        <article
            className={cn(
                'flex flex-col rounded-2xl border p-6 sm:p-7',
                featured
                    ? 'border-navy bg-navy shadow-lift'
                    : 'border-border bg-card',
            )}
        >
            <div className="flex flex-wrap items-start justify-between gap-2">
                <h3
                    className={cn(
                        'text-lg font-bold tracking-[-0.01em]',
                        featured ? 'text-white' : 'text-ink',
                    )}
                >
                    {plan.name}
                </h3>
                {featured ? (
                    <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white">
                        Direkomendasikan
                    </span>
                ) : null}
            </div>

            <p
                className={cn(
                    'mt-1 text-sm leading-relaxed',
                    featured ? 'text-white/65' : 'text-ink-soft',
                )}
            >
                {plan.tagline}
            </p>

            <p className="mt-6 flex items-baseline gap-1.5">
                <span
                    className={cn(
                        'text-4xl font-bold tracking-[-0.03em] tabular-nums',
                        featured ? 'text-white' : 'text-ink',
                    )}
                >
                    <span className="text-base font-semibold">Rp</span>
                    {formatRupiah(price)}
                </span>
                <span
                    className={cn(
                        'text-sm',
                        featured ? 'text-white/55' : 'text-ink-soft',
                    )}
                >
                    {billing === 'bulanan' ? '/bln' : '/tahun'}
                </span>
            </p>

            <p
                className={cn(
                    'mt-1 text-xs leading-relaxed tabular-nums',
                    featured ? 'text-white/55' : 'text-ink-soft',
                )}
            >
                {billing === 'bulanan'
                    ? 'Ditagih bulanan, berhenti kapan saja.'
                    : `Setara Rp${formatRupiah(perMonth)}/bln — dua bulan gratis.`}
            </p>

            <ul
                className={cn(
                    'mt-6 divide-y border-y',
                    featured
                        ? 'divide-white/15 border-white/15'
                        : 'divide-border border-border',
                )}
            >
                {plan.features.map((feature) => (
                    <li
                        key={feature}
                        className="flex items-start gap-2.5 py-2.5"
                    >
                        <Check
                            className={cn(
                                'mt-0.5 size-4 shrink-0',
                                featured ? 'text-brand-200' : 'text-link',
                            )}
                            aria-hidden="true"
                        />
                        <span
                            className={cn(
                                'text-sm leading-relaxed',
                                featured ? 'text-white/85' : 'text-ink',
                            )}
                        >
                            {feature}
                        </span>
                    </li>
                ))}
            </ul>

            {plan.excluded.length > 0 ? (
                <ul className="mt-4 space-y-1.5">
                    {plan.excluded.map((item) => (
                        <li
                            key={item}
                            className={cn(
                                'flex items-start gap-2 text-xs',
                                featured ? 'text-white/50' : 'text-ink-soft',
                            )}
                        >
                            <Minus
                                className="mt-0.5 size-3.5 shrink-0"
                                aria-hidden="true"
                            />
                            <span>Tidak termasuk: {item}</span>
                        </li>
                    ))}
                </ul>
            ) : null}

            <div className="mt-auto pt-6">
                <Link
                    href={href}
                    className={cn(
                        'focus-visible:ring-ring inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2',
                        featured
                            ? 'text-navy hover:bg-brand-50 bg-white'
                            : 'border-action text-action hover:bg-brand-50 border',
                    )}
                >
                    Mulai trial 14 hari
                    <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
            </div>
        </article>
    );
}

/**
 * Kartu masuk tanpa biaya.
 *
 * Diletakkan sejajar paket berbayar supaya pengunjung yang belum siap
 * membayar tetap melihat jalur mencoba — trial 14 hari dengan cap 30 order,
 * bukan "gratis selamanya" yang tidak benar.
 *
 * @param isAuthenticated - Menentukan tujuan CTA.
 */
function TrialCard({ isAuthenticated }: { isAuthenticated: boolean }) {
    const href = isAuthenticated ? dashboard() : register();

    return (
        <article className="border-border bg-band/60 flex flex-col rounded-2xl border border-dashed p-6 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="text-ink text-lg font-bold tracking-[-0.01em]">
                    Trial
                </h3>
                <span className="border-border bg-card text-ink-soft rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide">
                    Tanpa kartu
                </span>
            </div>

            <p className="text-ink-soft mt-1 text-sm leading-relaxed">
                Untuk mencoba alur penuh sebelum memutuskan.
            </p>

            <p className="mt-6 flex items-baseline gap-1.5">
                <span className="text-ink text-4xl font-bold tracking-[-0.03em] tabular-nums">
                    14 hari
                </span>
            </p>
            <p className="text-ink-soft mt-1 text-xs leading-relaxed tabular-nums">
                Rp0 · berhenti otomatis bila tidak dilanjutkan.
            </p>

            <ul className="divide-border border-border mt-6 divide-y border-y">
                {[
                    'Semua fitur Basic terbuka',
                    'Maksimal 30 order selama trial',
                    '1 outlet, 2 pengguna',
                ].map((feature) => (
                    <li
                        key={feature}
                        className="flex items-start gap-2.5 py-2.5"
                    >
                        <Check
                            className="text-link mt-0.5 size-4 shrink-0"
                            aria-hidden="true"
                        />
                        <span className="text-ink text-sm leading-relaxed">
                            {feature}
                        </span>
                    </li>
                ))}
            </ul>

            <p className="text-ink-soft mt-4 text-xs leading-relaxed">
                Setelah trial berakhir, data tetap terbaca dan order berjalan
                tetap bisa diselesaikan.
            </p>

            <div className="mt-auto pt-6">
                <Link
                    href={href}
                    className="border-action text-action hover:bg-brand-50 focus-visible:ring-ring inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border px-5 text-sm font-semibold transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                    Mulai tanpa kartu
                    <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
            </div>
        </article>
    );
}

/**
 * Band `#harga`: dua paket berbayar + satu jalur trial.
 *
 * Sakelar siklus tagihan memakai `<input type="radio">` asli di dalam
 * `<fieldset>`: panah kiri/kanan bekerja tanpa JavaScript tambahan dan
 * pembaca layar sudah tahu ini satu pilihan. Versi sebelumnya memakai
 * `role="radiogroup"` di atas dua `<button>` tanpa dukungan panah.
 *
 * @param isAuthenticated - Jika true, CTA mengarah ke dashboard.
 */
export default function MarketingPricing({
    isAuthenticated = false,
}: {
    isAuthenticated?: boolean;
}) {
    const [billing, setBilling] = useState<Billing>('bulanan');

    return (
        <section id="harga" className="scroll-mt-20">
            <Container className="py-16 sm:py-24">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                    <SectionHeading
                        index="06"
                        eyebrow="Harga"
                        title="Dua paket berbayar, satu trial tanpa kartu"
                        description="Harga tetap, tanpa biaya tersembunyi. Paket tahunan memotong dua bulan; trial memberi ruang untuk membuktikan alurnya lebih dulu."
                    />

                    <fieldset className="border-border bg-card inline-flex w-fit shrink-0 items-center rounded-full border p-1">
                        <legend className="sr-only">Siklus tagihan</legend>
                        {(['bulanan', 'tahunan'] as const).map((value) => (
                            <label key={value} className="relative">
                                <input
                                    type="radio"
                                    name="siklus-tagihan"
                                    value={value}
                                    checked={billing === value}
                                    onChange={() => setBilling(value)}
                                    className="peer sr-only"
                                />
                                <span className="text-ink-soft hover:text-ink peer-checked:bg-action peer-checked:text-action-foreground peer-focus-visible:ring-ring inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-colors duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2">
                                    {value === 'bulanan'
                                        ? 'Bulanan'
                                        : 'Tahunan'}
                                    {value === 'tahunan' ? (
                                        <span className="text-[10px] font-bold tracking-wide opacity-80">
                                            −2 bln
                                        </span>
                                    ) : null}
                                </span>
                            </label>
                        ))}
                    </fieldset>
                </div>

                <div className="mt-12 grid items-stretch gap-5 lg:grid-cols-3">
                    {PLANS.map((plan) => (
                        <PlanCard
                            key={plan.key}
                            plan={plan}
                            billing={billing}
                            isAuthenticated={isAuthenticated}
                        />
                    ))}
                    <TrialCard isAuthenticated={isAuthenticated} />
                </div>
            </Container>
        </section>
    );
}
