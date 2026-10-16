import { useState } from 'react';

import { Link } from '@inertiajs/react';
import { motion, useReducedMotion } from 'motion/react';
import { Check, Lock } from 'lucide-react';

import CountUp from '@/components/marketing/count-up';
import { Button } from '@/components/ui/button';
import { WHATSAPP_URL } from '@/components/marketing/cta-footer';
import { register } from '@/routes';
import { cn } from '@/lib/utils';

/** Dua tier yang benar-benar dapat dibeli, sesuai DECISIONS.md Q1 & Q9. */
const PLANS = [
    {
        key: 'basic',
        name: 'Basic',
        tagline: 'Untuk laundry satu gerai',
        monthlyPrice: 149000,
        annualPrice: 1490000,
        featured: false,
        cta: 'Mulai 14 Hari Gratis',
        features: [
            '1 outlet, 2 user',
            'Order end-to-end + notifikasi WhatsApp',
            'Proof-of-Condition (100 foto/bulan)',
            'Laporan harian + deposit member',
            'Audit trail per order',
        ],
        excluded: ['Multi-outlet', 'Laporan konsolidasi'],
    },
    {
        key: 'pro',
        name: 'Pro',
        tagline: 'Untuk 2–5 outlet',
        monthlyPrice: 499000,
        annualPrice: 4990000,
        featured: true,
        cta: 'Mulai 14 Hari Gratis',
        features: [
            'Sampai 5 outlet, user tak terbatas',
            'Semua fitur Basic',
            'Proof-of-Condition tanpa batas',
            'Multi-outlet + RBAC penuh',
            'Laporan konsolidasi + Audit Log penuh',
        ],
        excluded: [],
    },
] as const;

/**
 * Format nominal Rupiah dengan pemisah ribuan titik (format Indonesia),
 * selalu tabular-nums (DESIGN token: angka uang sejajar vertikal).
 *
 * @param value - Nominal dalam rupiah penuh.
 */
function formatRupiah(value: number): string {
    return value.toLocaleString('id-ID');
}

/**
 * Bagian harga — dua tier hidup + Enterprise yang dikunci terbuka.
 *
 * Toggle Bulanan/Tahunan bergerak dengan pil `layoutId` (satu elemen yang
 * berpindah, bukan dua tombol yang berganti gaya); angka harga menghitung
 * naik saat periode berganti (CountUp). Tier Enterprise sengaja tampil
 * terkunci: DECISIONS.md Q1 me-reserve namanya untuk v2 dan melarang menjual
 * tier yang fiturnya belum ada — jadi kartunya jujur menyebut "Segera".
 */
export default function MarketingPricing() {
    const [isAnnual, setIsAnnual] = useState(false);
    const prefersReducedMotion = useReducedMotion();

    return (
        <section className="scroll-mt-20" id="harga">
            <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 sm:py-24">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-display-3 font-bold tracking-[-0.03em] text-balance">
                        Harga dihitung dari kerugian yang dihindari
                    </h2>
                    <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
                        Satu transaksi tak tercatat per bulan sudah lebih besar
                        dari langganan Basic.
                    </p>

                    <div
                        aria-label="Periode penagihan"
                        className="border-border relative mt-7 inline-flex rounded-full border p-1"
                        role="group"
                    >
                        {[
                            { key: 'monthly', label: 'Bulanan', value: false },
                            {
                                key: 'annual',
                                label: 'Tahunan · 2 bulan gratis',
                                value: true,
                            },
                        ].map((option) => (
                            <button
                                aria-pressed={isAnnual === option.value}
                                className={cn(
                                    'relative min-h-11 rounded-full px-4 text-sm font-medium transition-colors',
                                    isAnnual === option.value
                                        ? 'text-primary-foreground dark:text-brand-900'
                                        : 'text-muted-foreground hover:text-foreground',
                                )}
                                key={option.key}
                                onClick={() => setIsAnnual(option.value)}
                                type="button"
                            >
                                {isAnnual === option.value ? (
                                    <motion.span
                                        aria-hidden="true"
                                        className="bg-brand-700 dark:bg-brand-50 absolute inset-0 rounded-full"
                                        layout
                                        layoutId="billing-pill"
                                        transition={
                                            prefersReducedMotion
                                                ? { duration: 0 }
                                                : {
                                                      type: 'spring',
                                                      stiffness: 400,
                                                      damping: 32,
                                                  }
                                        }
                                    />
                                ) : null}
                                <span className="relative">{option.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mx-auto mt-12 grid max-w-4xl gap-5 lg:grid-cols-3">
                    {PLANS.map((plan) => {
                        const price = isAnnual
                            ? plan.annualPrice
                            : plan.monthlyPrice;
                        const suffix = isAnnual ? '/tahun' : '/bulan';

                        return (
                            <article
                                className={cn(
                                    'bg-card rounded-card relative flex flex-col border p-6',
                                    plan.featured &&
                                        'border-brand-700 dark:border-brand-500 shadow-[0_24px_48px_-24px_rgb(12_95_89/0.4)] lg:-my-3 lg:py-9',
                                )}
                                key={plan.key}
                            >
                                {plan.featured ? (
                                    <span className="bg-brand-700 dark:bg-brand-50 text-primary-foreground dark:text-brand-900 absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap">
                                        Paling sering dipilih
                                    </span>
                                ) : null}

                                <h3 className="text-xl font-semibold">
                                    {plan.name}
                                </h3>
                                <p className="text-muted-foreground mt-1 text-sm">
                                    {plan.tagline}
                                </p>

                                <p
                                    className="mt-5 text-3xl font-bold tracking-tight"
                                    data-numeric
                                >
                                    <span className="text-xl font-semibold">
                                        Rp
                                    </span>
                                    <CountUp
                                        key={`${plan.key}-${isAnnual}`}
                                        duration={0.7}
                                        separator="."
                                        to={price}
                                    />
                                    <span className="text-muted-foreground ml-1 text-base font-medium">
                                        {suffix}
                                    </span>
                                </p>

                                <Button
                                    asChild
                                    className="mt-6 w-full"
                                    variant={
                                        plan.featured ? 'default' : 'outline'
                                    }
                                >
                                    <Link href={register()}>{plan.cta}</Link>
                                </Button>

                                <ul className="mt-6 space-y-2.5">
                                    {plan.features.map((feature) => (
                                        <li
                                            className="flex gap-2.5 text-sm"
                                            key={feature}
                                        >
                                            <Check className="text-brand-700 dark:text-brand-50 mt-0.5 size-4 shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                    {plan.excluded.map((feature) => (
                                        <li
                                            className="text-muted-foreground flex gap-2.5 text-sm"
                                            key={feature}
                                        >
                                            <span
                                                aria-hidden="true"
                                                className="mt-0.5 w-4 text-center"
                                            >
                                                —
                                            </span>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </article>
                        );
                    })}

                    {/* Kartu Enterprise: roadmap yang jujur, bukan janji kosong. */}
                    <article
                        className="bg-card/50 rounded-card flex flex-col border border-dashed p-6"
                        id="multi-outlet"
                    >
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="text-xl font-semibold">
                                Enterprise
                            </h3>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-200">
                                <Lock className="size-3" />
                                Segera
                            </span>
                        </div>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Untuk jaringan di atas 5 outlet
                        </p>

                        <p
                            className="text-muted-foreground mt-5 text-3xl font-bold tracking-tight"
                            data-numeric
                        >
                            <span className="text-xl font-semibold">Rp</span>
                            75rb
                            <span className="text-muted-foreground ml-1 text-base font-medium">
                                /outlet/bln
                            </span>
                        </p>

                        <Button asChild className="mt-6 w-full" variant="ghost">
                            <a
                                href={WHATSAPP_URL}
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                Tanya ketersediaan
                            </a>
                        </Button>

                        <ul className="mt-6 space-y-2.5">
                            {[
                                'Multi-outlet tanpa batas',
                                'Invoice tempo untuk klien korporat',
                                'Harga khusus per outlet',
                            ].map((feature) => (
                                <li
                                    className="text-muted-foreground flex gap-2.5 text-sm"
                                    key={feature}
                                >
                                    <Lock className="mt-0.5 size-4 shrink-0" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <p className="text-muted-foreground mt-auto pt-5 text-xs leading-relaxed">
                            Dirilis bersama fitur B2B — belum bisa dibeli hari
                            ini, dan kami tidak menjual yang belum ada.
                        </p>
                    </article>
                </div>

                <p className="text-muted-foreground mx-auto mt-8 max-w-xl text-center text-sm">
                    Tanpa tier gratis. Bayar lewat invoice + pay link (VA, QRIS,
                    e-wallet) dengan pengingat H-3 — bukan tagihan otomatis
                    {formatRupiah(0) === '0' ? '' : ''} kartu.
                </p>
            </div>
        </section>
    );
}
