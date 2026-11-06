import { useState } from 'react';

import { Scissors, ShieldCheck } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import RepicaMark from '@/components/marketing/repica-mark';
import { ProofCard } from '@/components/marketing/proof-card';
import { StatusBadge } from '@/components/marketing/status-badge';
import { WaBubble } from '@/components/marketing/wa-bubble';
import { cn } from '@/lib/utils';

/**
 * SachetPreview — sachet "bukti" interaktif di kanan hero (dunia Sachet Pop).
 *
 * Interaksi tanda tangan halaman: sachet tertutup cover bermotif kemasan;
 * strip sobekan di bibir atas adalah kontrolnya. Saat ditarik (klik / Enter /
 * Spasi), cover terangkat dan berputar sedikit (exit animation) memperlihatkan
 * isi: artefak bukti ProofCard + bubble persetujuan WA + badge status.
 * `prefers-reduced-motion`: perpindahan terjadi tanpa animasi.
 *
 * Murni CSS/SVG — tanpa bitmap: permukaan sachet adalah lembar `bg-sheet`
 * ber-border biru, radius sachet, dan bayangan pop satu tingkat. Strip punya
 * bibir sobekan (`edge-tear-b`) dan tekstur serat (`fiber-line`) sehingga
 * bahasa bentuk sobekan terasa bahkan saat diam.
 */
export default function SachetPreview() {
    const [torn, setTorn] = useState(false);
    const prefersReducedMotion = useReducedMotion() ?? false;

    return (
        <div
            data-welcome-surface
            className="relative mx-auto w-full max-w-md select-none"
        >
            {/* Badan sachet — lembar isi yang selama ini tertutup cover. */}
            <div className="border-brand bg-sheet relative overflow-hidden rounded-[var(--radius-sachet)] border-2 p-5 shadow-pop sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-2">
                    <span className="text-ink font-display text-xs font-extrabold tracking-tight">
                        BUKTI CUCIAN
                    </span>
                    <StatusBadge
                        variant="success"
                        label="Terverifikasi"
                        icon={ShieldCheck}
                    />
                </div>

                <div className="flex flex-col gap-4">
                    <ProofCard />
                    <div className="flex items-end justify-between gap-3">
                        <WaBubble
                            text="Setuju, lanjut cuci. Total Rp47.000 ya."
                            time="14:32"
                            approved
                        />
                        <span
                            className="text-ink-soft hidden text-[11px] font-semibold tabular-nums sm:block"
                            data-numeric
                        >
                            12 aksi
                            <br />
                            jejak audit
                        </span>
                    </div>
                </div>

                {/* Cover kemasan — menutupi isi sampai strip ditarik. */}
                <AnimatePresence>
                    {!torn && (
                        <motion.div
                            key="cover"
                            initial={false}
                            animate={{ y: 0, rotate: 0, opacity: 1 }}
                            exit={
                                prefersReducedMotion
                                    ? { opacity: 0 }
                                    : { y: '-108%', rotate: -2, opacity: 1 }
                            }
                            transition={
                                prefersReducedMotion
                                    ? { duration: 0 }
                                    : {
                                          duration: 0.65,
                                          ease: [0.65, 0, 0.35, 1],
                                      }
                            }
                            className="pointer-events-none absolute inset-0 z-20"
                            aria-hidden={torn}
                        >
                            <div className="bg-brand-tint border-brand absolute inset-0 flex flex-col items-center justify-center gap-3 border-2 px-6 text-center">
                                <span className="bg-brand text-ink flex size-12 items-center justify-center rounded-full">
                                    <RepicaMark className="size-6" />
                                </span>
                                <p className="text-ink font-display text-lg leading-tight font-extrabold">
                                    Sachet Bukti
                                </p>
                                <p className="text-ink-soft text-sm font-medium">
                                    Isi terkunci: foto kondisi, persetujuan WA,
                                    dan jejak audit satu order.
                                </p>
                                <p className="text-action text-xs font-bold">
                                    Sobek strip di atas ↑
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Strip sobekan — kontrol aksesibel (min. tinggi 44px). */}
            {!torn && (
                <button
                    type="button"
                    onClick={() => setTorn(true)}
                    aria-label="Tarik sobekan sachet untuk melihat bukti"
                    className={cn(
                        'bg-brand edge-tear-b border-action/50 fiber-line absolute inset-x-4 -top-3 z-30 flex min-h-11 items-center justify-center gap-2 border-2 bg-repeat-x pt-1',
                        'text-ink font-display text-xs font-extrabold tracking-wider',
                        'cursor-grab shadow-card transition-transform duration-200 hover:-translate-y-1 active:cursor-grabbing',
                        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ground',
                    )}
                >
                    <Scissors className="size-4" aria-hidden="true" />
                    TARIK UNTUK SOBEK
                </button>
            )}

            {/* Label petunjuk di bawah sachet — status terbaca jelas. */}
            <p
                className="text-ink mt-3 text-center text-xs font-semibold"
                aria-live="polite"
            >
                {torn
                    ? 'Bukti tersingkap — setiap aksi punya jejaknya.'
                    : 'Setiap sachet bukti bisa disobek. Coba tarik strip di atas.'}
            </p>
        </div>
    );
}
