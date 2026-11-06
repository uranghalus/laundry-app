import { useState } from 'react';

import { Link } from '@inertiajs/react';
import { ArrowRight, Check, Minus, Sparkles } from 'lucide-react';

import { Container, SectionHeading } from '@/components/marketing/layout';
import CountUp from '@/components/react-bits/count-up';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { register } from '@/routes';
import { cn } from '@/lib/utils';

/** Dua tier yang benar-benar dapat dibeli, sesuai DECISIONS.md Q1 & Q9. */
const PLANS = [
    {
        key: 'basic',
        name: 'Basic',
        tagline: 'Untuk laundry satu gerai',
        monthlyPrice: 149_000,
        annualPrice: 1_490_000,
        featured: false,
        features: [
            '1 outlet, 2 user',
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
        tagline: 'Untuk 2-5 outlet, user tak terbatas',
        monthlyPrice: 499_000,
        annualPrice: 4_990_000,
        featured: true,
        features: [
            'Sampai 5 outlet, user tak terbatas',
            'Semua fitur Basic',
            'Proof-of-Condition tanpa batas foto',
            'Multi-outlet + RBAC penuh',
            'Laporan konsolidasi + Audit Log penuh',
        ],
        excluded: [],
    },
] as const;

type Billing = 'bulanan' | 'tahunan';

/**
 * Format nominal Rupiah dengan titik ribuan (format Indonesia) — lokal file
 * ini karena hanya band harga yang menampilkan harga.
 *
 * @param value - Nominal dalam rupiah utuh.
 */
function formatRupiah(value: number): string {
    return value.toLocaleString('id-ID');
}

/**
 * Ring fokus untuk radio billing — indikator keyboard terlihat di kedua latar.
 */
const FOCUS_RING =
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ground';

/**
 * Band Harga — dua sachet paket + strip hemat yang "sobek" (dunia Sachet Pop).
 *
 * Toggle periodis memakai fieldset + radio NATIF (kontrak test & a11y), bukan
 * tombol hiasan: `role` dan keyboard behavior gratis dari browser. Hemat
 * tahunan ditampilkan sebagai tear-strip `fiber-line` miring di kartu — bahasa
 * bentuk sobekan harga yang ditempel, dengan angka CountUp saat pertama terlihat.
 *
 * Kejujoran dipertahankan: apa yang TIDAK ada di paket ditulis dengan ikon
 * minus, bukan dihilangkan diam-diam.
 */
export default function MarketingPricing() {
    const [billing, setBilling] = useState<Billing>('bulanan');

    return (
        <section id="harga" className="bg-ground scroll-mt-20 py-20 sm:py-24">
            <Container>
                <SectionHeading
                    index="05"
                    eyebrow="Harga"
                    title="Dua paket, tanpa jaring tersembunyi"
                    description="Semua fitur Pro dicoba gratis 14 hari (1 outlet, maks 30 order). Setelah itu pilih sachet yang pas — batennya tertulis apa adanya."
                    className="mx-auto text-center"
                />

                {/* Toggle periodis: fieldset + radio natif. */}
                <fieldset className="mt-10 flex justify-center">
                    <legend className="sr-only">Periode tagihan</legend>
                    <div className="bg-brand-foam border-line inline-flex rounded-[var(--radius-tear)] border p-1">
                        {(['bulanan', 'tahunan'] as const).map((mode) => (
                            <label
                                key={mode}
                                className={cn(
                                    'relative flex min-h-11 cursor-pointer items-center gap-2 rounded-md px-5 text-sm font-bold capitalize transition-colors',
                                    FOCUS_RING,
                                    billing === mode
                                        ? 'bg-action text-action-foreground shadow-card'
                                        : 'text-ink-soft hover:text-ink',
                                )}
                            >
                                <input
                                    type="radio"
                                    name="periode-tagihan"
                                    value={mode}
                                    checked={billing === mode}
                                    onChange={() => setBilling(mode)}
                                    className="peer sr-only"
                                />
                                {mode}
                                {mode === 'tahunan' ? (
                                    <span
                                        className={cn(
                                            'rounded-full px-2 py-0.5 text-[10px] font-extrabold',
                                            billing === 'tahunan'
                                                ? 'bg-white/20 text-white'
                                                : 'bg-ok-tint text-ok',
                                        )}
                                    >
                                        -2 bln
                                    </span>
                                ) : null}
                            </label>
                        ))}
                    </div>
                </fieldset>

                {/* Dua sachet paket. */}
                <div className="mt-12 grid gap-5 lg:grid-cols-2 lg:gap-6">
                    {PLANS.map((plan) => {
                        const price =
                            billing === 'bulanan'
                                ? plan.monthlyPrice
                                : Math.round(plan.annualPrice / 12);
                        const yearlySaving = plan.monthlyPrice * 12 - plan.annualPrice;
                        return (
                            <Card
                                key={plan.key}
                                className={cn(
                                    'relative overflow-hidden gap-0 rounded-[var(--radius-sachet)] border-2 p-6 shadow-card sm:p-8',
                                    plan.featured
                                        ? 'bg-sheet border-brand'
                                        : 'bg-sheet border-line',
                                )}
                            >
                                {/* Tear-strip hemat — hanya saat tahunan. */}
                                {billing === 'tahunan' ? (
                                    <div
                                        aria-label={`Hemat Rp${formatRupiah(yearlySaving)} per tahun`}
                                        className="fiber-line bg-amber-tint text-ink edge-tear-b absolute top-0 right-0 z-10 flex min-h-11 items-center gap-1.5 rounded-bl-[var(--radius-sachet)] border-b-2 border-l-2 border-amber/50 px-4 py-2 text-xs font-extrabold"
                                    >
                                        <Sparkles className="size-3.5" aria-hidden="true" />
                                        HEMAT Rp
                                        <CountUp
                                            to={yearlySaving}
                                            duration={1}
                                            separator="."
                                        />
                                        /THN
                                    </div>
                                ) : null}

                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-ink font-display text-xl leading-tight font-extrabold">
                                            {plan.name}
                                        </p>
                                        <p className="text-ink-soft mt-1 text-sm font-medium">
                                            {plan.tagline}
                                        </p>
                                    </div>
                                    {plan.featured ? (
                                        <Badge className="bg-action text-action-foreground">
                                            Paling cocok multi-outlet
                                        </Badge>
                                    ) : null}
                                </div>

                                <div className="mt-6 flex items-end gap-2 tabular-nums">
                                    <span className="text-ink font-display text-4xl leading-none font-extrabold sm:text-5xl">
                                        Rp{formatRupiah(price)}
                                    </span>
                                    <span className="text-ink-soft pb-1 text-sm font-semibold">
                                        /bulan
                                    </span>
                                </div>
                                <p className="text-ink-soft mt-1 text-xs font-medium tabular-nums">
                                    {billing === 'tahunan'
                                        ? `Ditagih Rp${formatRupiah(plan.annualPrice)} per tahun`
                                        : 'Ditagih bulanan, berhenti kapan saja'}
                                </p>

                                <Separator className="bg-line my-6" />

                                <CardContent className="flex flex-col gap-3 p-0">
                                    {plan.features.map((f) => (
                                        <p
                                            key={f}
                                            className="text-ink flex items-start gap-2 text-sm font-medium"
                                        >
                                            <Check
                                                className="text-ok mt-0.5 size-4 shrink-0"
                                                aria-hidden="true"
                                            />
                                            {f}
                                        </p>
                                    ))}
                                    {plan.excluded.map((f) => (
                                        <p
                                            key={f}
                                            className="text-ink-soft flex items-start gap-2 text-sm font-medium line-through decoration-line"
                                        >
                                            <Minus
                                                className="mt-0.5 size-4 shrink-0 opacity-60"
                                                aria-hidden="true"
                                            />
                                            {f}
                                        </p>
                                    ))}
                                </CardContent>

                                <Button
                                    asChild
                                    size="lg"
                                    variant={plan.featured ? 'default' : 'outline'}
                                    className={cn(
                                        'mt-8 w-full rounded-[var(--radius-tear)] text-sm font-bold',
                                        plan.featured
                                            ? 'bg-action text-action-foreground hover:bg-action-strong shadow-[0_4px_0_0_var(--color-action-strong)]'
                                            : 'border-2 border-action/60 text-action hover:border-action hover:bg-brand-tint',
                                    )}
                                >
                                    <Link href={register()}>
                                        Mulai 14 Hari Gratis
                                        <ArrowRight className="size-4" aria-hidden="true" />
                                    </Link>
                                </Button>
                            </Card>
                        );
                    })}
                </div>

                <p className="text-ink-soft mt-8 text-center text-xs font-medium">
                    Trial 14 hari semua fitur Pro · 1 outlet · maksimal 30
                    order · tanpa kartu kredit. Pajak termasuk; ganti atau
                    berhenti kapan saja.
                </p>
            </Container>
        </section>
    );
}
