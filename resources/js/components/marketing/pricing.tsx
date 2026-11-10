import { useState } from 'react';

import { Link } from '@inertiajs/react';
import { ArrowRight, Check, Minus } from 'lucide-react';

import { Container, SectionHeading } from '@/components/marketing/layout';
import { Button } from '@/components/ui/button';
import { formatIDR } from '@/lib/format';
import { dashboard, register } from '@/routes';
import { cn } from '@/lib/utils';

/** Dua tier yang benar-benar dapat dibeli, sesuai DECISIONS.md Q1 & Q9. */
const PLANS = [
    {
        key: 'basic',
        name: 'Basic',
        tagline: 'Untuk laundry satu gerai',
        meta: '1 outlet · 2 user',
        monthlyPrice: 149_000,
        annualPrice: 1_490_000,
        featured: false,
        features: [
            'Order end-to-end + notifikasi WhatsApp',
            'Proof-of-Condition 100 foto/bulan',
            'Laporan harian + deposit member',
            'Jejak audit per order',
        ],
        excluded: ['Multi-outlet', 'Laporan konsolidasi lintas outlet'],
    },
    {
        key: 'pro',
        name: 'Pro',
        tagline: 'Untuk 2–5 outlet, user tak terbatas',
        meta: 'Sampai 5 outlet',
        monthlyPrice: 499_000,
        annualPrice: 4_990_000,
        featured: true,
        features: [
            'Semua fitur Basic',
            'Proof-of-Condition tanpa batas foto',
            'Multi-outlet + RBAC penuh',
            'Laporan konsolidasi + audit log penuh',
        ],
        excluded: [],
    },
] as const;

type Billing = 'bulanan' | 'tahunan';

/**
 * Band harga — dua lembar penawaran dengan panel Pro berwarna tinta.
 *
 * Periode memakai radio natif di dalam fieldset (keyboard dan pembaca layar
 * gratis dari browser). Nominal tahunan ditampilkan sebagai total penuh dan
 * penghematan persis, bukan ekuivalen bulanan yang dibulatkan.
 *
 * @param isAuthenticated - Menentukan CTA menuju dashboard atau registrasi.
 */
export default function MarketingPricing({
    isAuthenticated = false,
}: {
    isAuthenticated?: boolean;
}) {
    const [billing, setBilling] = useState<Billing>('bulanan');

    return (
        <section
            id="harga"
            aria-labelledby="harga-title"
            className="bg-ground border-line scroll-mt-24 border-t py-20 sm:py-24"
        >
            <Container>
                <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                    <SectionHeading
                        id="harga-title"
                        title="Harga yang bisa dihitung di buku."
                        description="Dua paket, tanpa biaya tersembunyi. Trial 14 hari penuh; tidak perlu kartu kredit untuk mulai."
                    />

                    <fieldset className="shrink-0">
                        <legend className="sr-only">
                            Pilih periode penagihan
                        </legend>
                        <div className="bg-muted border-line inline-flex rounded-lg border p-1">
                            {(
                                [
                                    ['bulanan', 'Bulanan'],
                                    ['tahunan', 'Tahunan'],
                                ] as const
                            ).map(([value, label]) => (
                                <label key={value} className="relative">
                                    <input
                                        type="radio"
                                        name="billing"
                                        value={value}
                                        checked={billing === value}
                                        onChange={() => setBilling(value)}
                                        className="peer sr-only"
                                    />
                                    <span
                                        className={cn(
                                            'flex h-11 cursor-pointer items-center rounded-md px-4 text-sm font-bold transition-colors',
                                            'text-ink-soft hover:text-ink',
                                            'peer-checked:bg-ink peer-checked:text-ground',
                                            'peer-focus-visible:ring-ring peer-focus-visible:ring-offset-muted peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2',
                                        )}
                                    >
                                        {label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </fieldset>
                </div>

                <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:gap-8">
                    {PLANS.map((plan) => {
                        const isFeatured = plan.featured;
                        const amount =
                            billing === 'bulanan'
                                ? plan.monthlyPrice
                                : plan.annualPrice;
                        const savings =
                            plan.monthlyPrice * 12 - plan.annualPrice;

                        const tone = isFeatured
                            ? {
                                  card: 'bg-night text-night-ink border-night dark:border-night-line',
                                  tagline: 'text-night-ink-soft',
                                  meta: 'border-night-line text-night-accent',
                                  rule: 'border-night-line',
                                  priceNote: 'text-night-ink-soft',
                                  includedLabel: 'text-night-ink-soft',
                                  includedIcon: 'text-night-accent',
                                  includedText: 'text-night-ink',
                              }
                            : {
                                  card: 'bg-sheet text-ink border-line border-graphic-tint/20',
                                  tagline: 'text-ink-soft',
                                  meta: 'border-line text-ink-soft',
                                  rule: 'border-line',
                                  priceNote: 'text-ink-soft',
                                  includedLabel: 'text-ink-soft',
                                  includedIcon: 'text-ok',
                                  includedText: 'text-ink',
                              };

                        return (
                            <div
                                key={plan.key}
                                className={cn(
                                    'shadow-card flex flex-col rounded-xl border p-6 sm:p-8',
                                    tone.card,
                                )}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="text-2xl font-extrabold tracking-tight">
                                            {plan.name}
                                        </h3>
                                        <p
                                            className={cn(
                                                'mt-1 text-sm font-medium',
                                                tone.tagline,
                                            )}
                                        >
                                            {plan.tagline}
                                        </p>
                                    </div>
                                    <span
                                        className={cn(
                                            'shrink-0 rounded-sm border px-2 py-1 font-mono text-[11px] font-semibold tracking-[0.08em] uppercase',
                                            tone.meta,
                                        )}
                                    >
                                        {plan.meta}
                                    </span>
                                </div>

                                <div className="mt-8">
                                    <div className="flex flex-wrap items-end gap-x-2 gap-y-1">
                                        <span
                                            data-numeric
                                            className="text-4xl leading-none font-extrabold tracking-tight sm:text-5xl"
                                        >
                                            {formatIDR(amount)}
                                        </span>
                                        <span
                                            className={cn(
                                                'pb-1 text-sm font-semibold',
                                                tone.priceNote,
                                            )}
                                        >
                                            /
                                            {billing === 'bulanan'
                                                ? 'bulan'
                                                : 'tahun'}
                                        </span>
                                    </div>
                                    <p
                                        className={cn(
                                            'mt-3 min-h-10 text-xs leading-relaxed font-medium',
                                            tone.priceNote,
                                        )}
                                    >
                                        {billing === 'bulanan'
                                            ? 'Tagihan per bulan. Trial 14 hari sudah termasuk.'
                                            : `Hemat ${formatIDR(savings)} dibanding 12 bulan pembayaran bulanan.`}
                                    </p>
                                </div>

                                <div
                                    className={cn(
                                        'mt-6 border-t pt-6',
                                        tone.rule,
                                    )}
                                >
                                    <p
                                        className={cn(
                                            'font-mono text-[11px] font-semibold tracking-[0.14em] uppercase',
                                            tone.includedLabel,
                                        )}
                                    >
                                        Termasuk
                                    </p>
                                    <ul className="mt-4 space-y-3">
                                        {plan.features.map((feature) => (
                                            <li
                                                key={feature}
                                                className="flex items-start gap-2.5"
                                            >
                                                <Check
                                                    className={cn(
                                                        'mt-0.5 size-4 shrink-0',
                                                        tone.includedIcon,
                                                    )}
                                                    aria-hidden="true"
                                                />
                                                <span
                                                    className={cn(
                                                        'text-sm leading-relaxed font-semibold',
                                                        tone.includedText,
                                                    )}
                                                >
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    {plan.excluded.length > 0 ? (
                                        <ul className="mt-3 space-y-3">
                                            {plan.excluded.map((feature) => (
                                                <li
                                                    key={feature}
                                                    className="flex items-start gap-2.5"
                                                >
                                                    <Minus
                                                        className="text-ink-soft mt-0.5 size-4 shrink-0"
                                                        aria-hidden="true"
                                                    />
                                                    <span className="text-ink-soft text-sm leading-relaxed font-medium">
                                                        {feature}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : null}
                                </div>

                                <div className="mt-auto pt-8">
                                    <Button
                                        asChild
                                        variant={
                                            isFeatured ? 'default' : 'outline'
                                        }
                                        className={cn(
                                            'h-12 w-full rounded-md text-sm font-bold',
                                            isFeatured
                                                ? 'bg-action text-action-foreground hover:bg-action-strong border-transparent'
                                                : 'border-line text-ink hover:bg-muted bg-transparent',
                                        )}
                                    >
                                        <Link
                                            href={
                                                isAuthenticated
                                                    ? dashboard()
                                                    : register()
                                            }
                                        >
                                            {isAuthenticated
                                                ? 'Buka dashboard'
                                                : `Mulai ${plan.name}`}
                                            <ArrowRight aria-hidden="true" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <p className="text-ink-soft mt-6 text-xs leading-relaxed font-medium">
                    Pembayaran lewat tautan Xendit (VA, QRIS, atau e-wallet).
                    Tidak ada penagihan kartu kredit otomatis.
                </p>
            </Container>
        </section>
    );
}
