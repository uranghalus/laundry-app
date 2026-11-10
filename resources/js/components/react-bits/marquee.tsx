import { useState, type CSSProperties } from 'react';

import { Pause, Play } from 'lucide-react';
import { useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';

/**
 * Marquee — pita berjalan dua salinan, ala React Bits.
 *
 * Isi pita bersifat dekoratif (`aria-hidden`); makna yang sama selalu ada di
 * teks halaman. Tombol jeda 44px tersedia untuk pengguna keyboard dan sentuh;
 * saat `prefers-reduced-motion` aktif pita berhenti dan tombol disembunyikan.
 *
 * @param items - Daftar label pendek yang diulang.
 * @param duration - Durasi satu siklus dalam detik.
 * @param className - Kelas pita luar.
 * @param label - Nama aksesibel untuk wilayah pita.
 */
export default function Marquee({
    items,
    duration = 36,
    className,
    label = 'Pita bukti',
}: {
    items: readonly string[];
    duration?: number;
    className?: string;
    label?: string;
}) {
    const [isPaused, setIsPaused] = useState(false);
    const prefersReducedMotion = useReducedMotion();
    const isStopped = isPaused || Boolean(prefersReducedMotion);

    return (
        <div
            className={cn('flex items-stretch', className)}
            role="region"
            aria-label={label}
        >
            <div className="min-w-0 flex-1 overflow-hidden">
                <div
                    className="marquee-track flex w-max shrink-0 items-stretch"
                    data-paused={isStopped ? 'true' : 'false'}
                    style={
                        {
                            '--marquee-duration': `${duration}s`,
                        } as CSSProperties
                    }
                    aria-hidden="true"
                >
                    {[0, 1].map((copy) => (
                        <div key={copy} className="flex shrink-0 items-stretch">
                            {items.map((item) => (
                                <span
                                    key={`${copy}-${item}`}
                                    className="flex shrink-0 items-center gap-4 px-6 text-[11px] font-bold tracking-[0.18em] whitespace-nowrap uppercase"
                                >
                                    {item}
                                    <span
                                        aria-hidden="true"
                                        className="size-1 rounded-full bg-current/40"
                                    />
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {!prefersReducedMotion ? (
                <button
                    type="button"
                    onClick={() => setIsPaused((paused) => !paused)}
                    aria-pressed={isPaused}
                    aria-label={
                        isPaused ? 'Jalankan pita bukti' : 'Hentikan pita bukti'
                    }
                    className="bg-night text-night-ink hover:bg-night-raised focus-visible:ring-night-accent border-night-line flex size-11 shrink-0 items-center justify-center border-l transition-colors focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:outline-none"
                >
                    {isPaused ? (
                        <Play className="size-4" aria-hidden="true" />
                    ) : (
                        <Pause className="size-4" aria-hidden="true" />
                    )}
                </button>
            ) : null}
        </div>
    );
}
