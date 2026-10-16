import { useEffect, useState } from 'react';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
    Camera,
    Check,
    Image as ImageIcon,
    MessageCircle,
    Pause,
    Play,
    RotateCcw,
    Shirt,
} from 'lucide-react';

import { cn } from '@/lib/utils';

/**
 * Langkah demo Proof-of-Condition, sesuai FR-9.1–9.4.
 *
 * Berisi `icon` (komponen), `title`, `caption`, dan `screen` — layar yang
 * dirender di dalam bingkai telepon.
 */
const STEPS = [
    {
        key: 'foto',
        icon: Camera,
        title: '1. Kasir foto kondisi awal',
        caption:
            'Barang berisiko tinggi wajib difoto saat check-in. Tidak ada kamera sungguhan yang dibuka — ini simulasi.',
        screen: 'camera',
    },
    {
        key: 'watermark',
        icon: ImageIcon,
        title: '2. Foto diberi watermark otomatis',
        caption:
            'Tanggal, waktu, dan ID order menempel di foto. Bukti tidak bisa diklaim "sudah saya kirim sebelum masuk".',
        screen: 'watermark',
    },
    {
        key: 'whatsapp',
        icon: MessageCircle,
        title: '3. Link approval dikirim via WhatsApp',
        caption:
            'Pelanggan menerima tautan resmi Meta WhatsApp Cloud API — bukan kanal unofficial yang berisiko membuat nomor pengirim diblokir.',
        screen: 'whatsapp',
    },
    {
        key: 'approval',
        icon: Check,
        title: '4. Pelanggan menyetujui',
        caption:
            'Order baru boleh masuk proses cuci setelah pelanggan menekan "Setuju & Lanjutkan".',
        screen: 'approval',
    },
] as const;

/** Durasi auto-advance per langkah, dalam milidetik. */
const AUTO_ADVANCE_MS = 2600;

/**
 * Demo interaktif Proof-of-Condition untuk hero.
 *
 * Berhenti pada langkah 4 sampai pengguna menekan "Ulangi", supaya iterasi
 * visual terakhir tidak terburu-buru hilang sebelum sempat terbaca.
 *
 * Sepenuhnya client-side: memakai state React + animasi `motion/react`, bukan
 * permission API dan bukan backend (keputusan Q15a). Karena itu bisa berjalan
 * di iOS Safari, yang memblokir `setInterval` di tab latent. `prefers-reduced-motion`
 * mengubah pergantian langkah menjadi potongan langsung tanpa gerak.
 */
export default function PocDemo({ className = '' }: { className?: string }) {
    const [stepIndex, setStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const prefersReducedMotion = useReducedMotion();

    const isLastStep = stepIndex === STEPS.length - 1;
    const step = STEPS[stepIndex];

    useEffect(() => {
        if (!isPlaying || isLastStep) {
            return;
        }

        const timer = window.setTimeout(() => {
            setStepIndex((index) => index + 1);
        }, AUTO_ADVANCE_MS);

        return () => window.clearTimeout(timer);
    }, [isPlaying, isLastStep, stepIndex]);

    function replay() {
        setStepIndex(0);
        setIsPlaying(true);
    }

    return (
        <div className={cn('w-full', className)}>
            {/* Bingkai telepon — sinyal "ini tampilan yang dilihat kasir". */}
            <div className="bg-card rounded-card mx-auto w-full max-w-[19rem] border p-3 shadow-[0_24px_48px_-24px_rgb(12_95_89/0.35)]">
                <div className="bg-muted text-muted-foreground flex items-center justify-between rounded-md px-3 py-1.5 text-xs">
                    <span>Simulasi layar kasir</span>
                    <span data-numeric>#RC-2418</span>
                </div>

                <div className="bg-background mt-3 flex min-h-[15rem] flex-col overflow-hidden rounded-md border">
                    <AnimatePresence initial={false} mode="wait">
                        <motion.div
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-1 flex-col p-3"
                            exit={{
                                opacity: 0,
                                x: prefersReducedMotion ? 0 : -12,
                            }}
                            initial={{
                                opacity: 0,
                                x: prefersReducedMotion ? 0 : 12,
                            }}
                            key={step.key}
                            transition={{ duration: 0.22, ease: 'easeOut' }}
                        >
                            <StepScreen screen={step.screen} />
                        </motion.div>
                    </AnimatePresence>
                </div>

                <p
                    aria-live="polite"
                    className="text-muted-foreground mt-3 min-h-[2.5rem] text-xs leading-relaxed"
                >
                    {step.caption}
                </p>
            </div>

            {/* Kontrol — target sentuh ≥44px (brief §9). */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                {STEPS.map((item, index) => (
                    <button
                        aria-current={index === stepIndex ? 'step' : undefined}
                        aria-label={item.title}
                        className={cn(
                            'flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-medium transition-colors',
                            index === stepIndex
                                ? 'bg-brand-50 text-brand-900 dark:bg-brand-900/40 dark:text-brand-50'
                                : 'text-muted-foreground hover:bg-accent',
                        )}
                        key={item.key}
                        onClick={() => {
                            setStepIndex(index);
                            setIsPlaying(index !== STEPS.length - 1);
                        }}
                        type="button"
                    >
                        <item.icon className="size-4" />
                        <span className="hidden sm:inline">{item.title}</span>
                    </button>
                ))}
            </div>

            <div className="mt-3 flex items-center justify-center gap-2">
                {!isLastStep ? (
                    <button
                        className="text-muted-foreground hover:text-foreground inline-flex min-h-11 items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors"
                        onClick={() => setIsPlaying((playing) => !playing)}
                        type="button"
                    >
                        {isPlaying ? (
                            <>
                                <Pause className="size-4" />
                                Jeda
                            </>
                        ) : (
                            <>
                                <Play className="size-4" />
                                Lanjutkan
                            </>
                        )}
                    </button>
                ) : (
                    <button
                        className="text-brand-700 dark:text-brand-50 hover:bg-brand-50 dark:hover:bg-brand-900/40 inline-flex min-h-11 items-center gap-1.5 rounded-md px-3 text-sm font-semibold transition-colors"
                        onClick={replay}
                        type="button"
                    >
                        <RotateCcw className="size-4" />
                        Ulangi
                    </button>
                )}
            </div>
        </div>
    );
}

/**
 * Render layar simulasi sesuai langkah aktif.
 *
 * @param screen - Kunci layar dari `STEPS`.
 */
function StepScreen({ screen }: { screen: (typeof STEPS)[number]['screen'] }) {
    if (screen === 'camera') {
        return (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
                <div className="border-brand-700 dark:border-brand-50 flex size-20 items-center justify-center rounded-full border-2 border-dashed">
                    <Camera className="text-brand-700 dark:text-brand-50 size-8" />
                </div>
                <p className="text-sm font-semibold">Ambil foto kondisi</p>
                <p className="text-muted-foreground text-xs">
                    Item berisiko tinggi: dress sutra, blus, gamis
                </p>
                <div className="bg-brand-700 dark:bg-brand-50 text-primary-foreground dark:text-brand-900 mt-1 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold">
                    <Camera className="size-3.5" />
                    Ambil foto
                </div>
            </div>
        );
    }

    if (screen === 'watermark') {
        return (
            <div className="flex flex-1 flex-col items-center justify-center gap-3">
                <div className="relative flex aspect-[3/4] w-24 items-center justify-center overflow-hidden rounded-md bg-stone-200 dark:bg-stone-800">
                    <Shirt className="size-10 text-stone-500 dark:text-stone-400" />
                    <span
                        className="absolute inset-x-0 bottom-0 bg-stone-900/70 px-1 py-0.5 text-center text-[0.5rem] leading-tight text-stone-50"
                        data-numeric
                    >
                        12/03/2026 14:32 · RC-2418
                    </span>
                </div>
                <p className="text-muted-foreground text-xs">
                    Watermark tertempel permanen di file
                </p>
            </div>
        );
    }

    if (screen === 'whatsapp') {
        return (
            <div className="flex flex-1 flex-col gap-2">
                <div className="bg-muted text-muted-foreground rounded-md px-3 py-2 text-xs">
                    Halo Bu Rina, ini laundry Melati. Pesanan{' '}
                    <span data-numeric>#RC-2418</span> perlu konfirmasi kondisi
                    awal sebelum kami proses.
                </div>
                <div className="bg-brand-50 dark:bg-brand-900/40 text-brand-900 dark:text-brand-50 rounded-md px-3 py-2 text-xs font-medium">
                    Lihat foto & setujui →
                </div>
                <p className="text-muted-foreground mt-auto text-center text-[0.65rem]">
                    Dikirim via Meta WhatsApp Cloud API
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
                <Check className="size-8 text-green-700 dark:text-green-300" />
            </div>
            <p className="text-sm font-semibold">Sudah disetujui</p>
            <p className="text-muted-foreground text-xs">
                Disetujui 14:38 oleh pelanggan. Order boleh masuk proses cuci.
            </p>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 dark:bg-green-950 dark:text-green-200">
                Menunggu Dicuci
            </span>
        </div>
    );
}
