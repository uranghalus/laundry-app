import { useEffect, useRef } from 'react';

import { Link } from '@inertiajs/react';
import { ArrowRight, Clock, CreditCard, ShieldCheck, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import Particles from '@/components/react-bits/particles';
import SachetPreview from '@/components/marketing/sachet-preview';
import SplitText from '@/components/marketing/split-text';
import { Button } from '@/components/ui/button';
import { register } from '@/routes';
import { cn } from '@/lib/utils';

/**
 * Mikro-fakta jujur di bawah CTA — angka yang bisa diverifikasi, bukan klaim.
 * Dipakai sebagai chip Sachet Pop di bidang biru hero.
 */
const FACT_CHIPS = [
    { icon: Clock, label: 'Trial 14 hari' },
    { icon: CreditCard, label: 'Tanpa kartu kredit' },
    { icon: ShieldCheck, label: 'Cap 30 order/hari' },
    { icon: Sparkles, label: 'Watermark & jejak audit' },
] as const;

/**
 * Hero Repica — rak sachet paling depan (dunia "Sachet Pop — Kemasan Segar").
 *
 * Kiri: display headline Archivo per-kata (SplitText) di atas BIDANG BIRU
 * #66C3FF penuh; teks ink (kontras ~10:1), CTA primer fill `bg-action`
 * (#1D4ED8, AA), sekunder chip terang. Empat chip mikro-fakta di bawah CTA.
 *
 * Kanan: SachetPreview — interaksi tanda tangan halaman (tarik sobekan →
 * bukti tersingkap).
 *
 * Latar: Particles (react-bits, WebGL) warna token yang dibaca dari
 * computed style — tanpa hex polos di file ini; bloom kursor via
 * `field-bloom` yang titik pusatnya mengikuti pointer. Kedua efek aria-hidden,
 * tidak memblokir interaksi, dan dibekukan di `prefers-reduced-motion`.
 *
 * @param isAuthenticated - Menentukan label CTA primer (guest → daftar).
 */
export default function MarketingHero({
    isAuthenticated,
}: {
    isAuthenticated?: boolean;
}) {
    const prefersReducedMotion = useReducedMotion() ?? false;
    const fieldRef = useRef<HTMLDivElement>(null);
    const colorsRef = useRef<string[] | undefined>(undefined);

    // Warna partikel dibaca dari token CSS saat mount — sumber kebenaran tetap
    // satu (app.css), tidak ada hex yang disalin ke TSX.
    useEffect(() => {
        const css = getComputedStyle(document.documentElement);
        const brand = css.getPropertyValue('--brand').trim();
        const foam = css.getPropertyValue('--brand-foam').trim();
        const sheet = css.getPropertyValue('--sheet').trim();
        colorsRef.current = [brand, foam, sheet].filter(Boolean);
    }, []);

    /** Pindahkan titik pusat bloom mengikuti pointer (murah: dua CSS var). */
    const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        if (prefersReducedMotion || !fieldRef.current) {
            return;
        }
        const rect = fieldRef.current.getBoundingClientRect();
        fieldRef.current.style.setProperty('--bloom-x', `${event.clientX - rect.left}px`);
        fieldRef.current.style.setProperty('--bloom-y', `${event.clientY - rect.top}px`);
    };

    return (
        <section id="hero" className="relative isolate overflow-hidden">
            {/* Bidang biru + bloom + partikel — satu kesatuan latar hero. */}
            <div
                ref={fieldRef}
                onPointerMove={onPointerMove}
                className="field-bloom bg-brand absolute inset-0 -z-10"
                aria-hidden="true"
            >
                {/* Dua busur cahaya lembut agar bidang tidak datar (aksen 1-2). */}
                <div className="bg-brand-foam/50 absolute -top-24 -left-24 size-72 rounded-full blur-3xl" />
                <div className="bg-sheet/30 absolute -right-20 -bottom-28 size-80 rounded-full blur-3xl" />
                <Particles
                    className="absolute inset-0 opacity-60"
                    particleColors={colorsRef.current}
                    particleCount={40}
                    particleSpread={9}
                    speed={0.1}
                    particleBaseSize={70}
                    moveParticlesOnHover={false}
                    alphaParticles={false}
                    disableRotation
                    paused={prefersReducedMotion}
                />
            </div>

            <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:py-24 xl:px-8">
                <div className="flex flex-col items-start">
                    <span className="bg-sheet text-action mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-wide shadow-card">
                        <ShieldCheck className="size-3.5" aria-hidden="true" />
                        Sistem operasi laundry dengan bukti per transaksi
                    </span>

                    {/* Headline display — LCP, langsung terbaca, tanpa tertunda animasi. */}
                    <h1 className="text-ink font-display font-extrabold tracking-tight">
                        <SplitText
                            text="Laundry Anda, dibuktikan — bukan dijanjikan."
                            delay={0}
                            duration={0.5}
                            className="text-display-hero block"
                        />
                    </h1>

                    <p className="text-ink mt-6 max-w-xl text-lg leading-relaxed font-medium">
                        Kirim foto kondisi awal, dapatkan estimasi otomatis, dan
                        terima persetujuan lewat WhatsApp — setiap aksi dicatat
                        dalam jejak audit agar sengketa baju rusak tidak pernah
                        menjadi kata satu terhadap kata yang lain.
                    </p>

                    {/* CTA pair. */}
                    <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
                        <Link
                            href={register()}
                            className={cn(
                                'bg-action text-action-foreground hover:bg-action-strong inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-tear)] px-8 py-3.5 text-sm font-bold whitespace-nowrap shadow-[0_4px_0_0_var(--color-action-strong)] transition-colors duration-200',
                                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-brand',
                            )}
                        >
                            {isAuthenticated
                                ? 'Ke Dashboard'
                                : 'Coba Gratis 14 Hari'}
                            <ArrowRight className="size-4" aria-hidden="true" />
                        </Link>
                        <Button
                            asChild
                            variant="secondary"
                            size="lg"
                            className="rounded-[var(--radius-tear)] text-sm font-bold"
                        >
                            <a href="#fitur">Lihat Fitur</a>
                        </Button>
                    </div>

                    {/* Chip mikro-fakta — angka yang bisa diverifikasi. */}
                    <ul
                        className="mt-8 flex flex-wrap items-center gap-2"
                        aria-label="Fakta trial dan batas gratis"
                    >
                        {FACT_CHIPS.map(({ icon: Icon, label }) => (
                            <li
                                key={label}
                                className="border-brand-edge bg-sheet/85 text-ink inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold tabular-nums"
                            >
                                <Icon className="text-action size-3.5" aria-hidden="true" />
                                {label}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Sachet bukti — interaksi tanda tangan; tetap tampil di mobile. */}
                <div className="relative">
                    <SachetPreview />
                </div>
            </div>

            {/* Cue gulir — tidak ada false floor. */}
            <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
                {prefersReducedMotion ? (
                    <span className="text-ink inline-flex items-center gap-2 text-sm font-semibold">
                        Gulir untuk melihat lebih banyak
                    </span>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="flex items-center gap-2"
                    >
                        <span className="bg-ink/60 h-1.5 w-1.5 animate-[bounce_2s_infinite] rounded-full" />
                        <span className="text-ink text-sm font-semibold">
                            Gulir untuk melihat lebih banyak
                        </span>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
