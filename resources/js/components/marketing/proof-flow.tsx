import { useState } from 'react';

import {
    ArrowLeft,
    ArrowRight,
    Camera,
    CheckCheck,
    MessageCircle,
    RotateCcw,
    ShieldCheck,
    Stamp,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import { MetaLabel } from '@/components/marketing/layout';
import { ProofCard } from '@/components/marketing/proof-card';
import { StatusBadge } from '@/components/marketing/status-badge';
import { WaBubble } from '@/components/marketing/wa-bubble';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Tiga langkah alur bukti yang benar-benar dijalankan produk: foto kondisi,
 * persetujuan pelanggan lewat WhatsApp, lalu arsip order yang terkunci.
 * Tidak ada durasi atau angka operasional yang direka.
 */
const STEPS = [
    {
        key: 'foto',
        label: 'Foto',
        title: 'Kondisi dicatat sebelum cucian masuk',
        description:
            'Kasir memotret barang di outlet. Foto diberi tanda air outlet, waktu, dan nomor order — bukan foto galeri yang bisa tertukar.',
        icon: Camera,
        announcement: 'Langkah satu dari tiga: foto kondisi diambil di outlet.',
    },
    {
        key: 'setuju',
        label: 'Setujui',
        title: 'Pelanggan menyetujui dari WhatsApp',
        description:
            'Tautan bukti dikirim ke nomor pelanggan. Persetujuan tercatat dengan waktu, bukan lagi kesepakatan lisan di konter.',
        icon: MessageCircle,
        announcement:
            'Langkah dua dari tiga: pelanggan menerima tautan persetujuan lewat WhatsApp.',
    },
    {
        key: 'arsip',
        label: 'Terkunci',
        title: 'Bukti tersimpan pada order yang sama',
        description:
            'Setelah disetujui, lembar bukti menempel pada order dan tidak bisa diedit diam-diam. Sengketa dibaca dari catatan, bukan dari ingatan.',
        icon: ShieldCheck,
        announcement:
            'Langkah tiga dari tiga: bukti tersimpan dan terkunci pada order.',
    },
] as const;

/**
 * ProofFlow — demo interaktif "Ilustrasi alur" pada band bukti.
 *
 * Ketiga langkah dapat dipilih langsung atau dijalankan berurutan. Seluruh
 * data adalah contoh dan diberi label `Contoh`; tidak ada nomor telepon,
 * hash, atau klaim waktu nyata. Panel memakai `aria-live` agar perubahan
 * langkah diumumkan ke pembaca layar.
 *
 * @param className - Kelas tambahan pembungkus.
 */
export default function ProofFlow({ className }: { className?: string }) {
    const [activeStep, setActiveStep] = useState(0);
    const prefersReducedMotion = useReducedMotion();
    const step = STEPS[activeStep];
    const isLastStep = activeStep === STEPS.length - 1;

    /** Memindahkan demo ke langkah berikutnya, atau mengulang dari awal. */
    const handleNext = () => {
        setActiveStep((current) => (current + 1) % STEPS.length);
    };

    /** Mundur satu langkah tanpa melewati batas awal. */
    const handleBack = () => {
        setActiveStep((current) => Math.max(0, current - 1));
    };

    return (
        <div
            className={cn(
                'border-line bg-ground overflow-hidden border-y',
                className,
            )}
        >
            <div className="border-line flex items-center justify-between gap-3 border-b px-4 py-3">
                <MetaLabel>Ilustrasi alur · data contoh</MetaLabel>
                <span className="text-ink-soft font-mono text-[11px] font-semibold tracking-[0.14em] uppercase tabular-nums">
                    Langkah {activeStep + 1}/3
                </span>
            </div>

            <div className="border-line grid grid-cols-3 border-b">
                {STEPS.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = index === activeStep;

                    return (
                        <button
                            key={item.key}
                            type="button"
                            onClick={() => setActiveStep(index)}
                            aria-current={isActive ? 'step' : undefined}
                            className={cn(
                                'relative flex min-h-16 flex-col items-start justify-center gap-1 px-3 py-3 text-left transition-colors sm:px-4',
                                'border-line not-last:border-r last:border-r-0',
                                'hover:bg-muted focus-visible:ring-ring focus-visible:z-10 focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset',
                                isActive ? 'bg-muted' : 'bg-sheet',
                            )}
                        >
                            <span className="flex items-center gap-2">
                                <Icon
                                    className={cn(
                                        'size-4',
                                        isActive
                                            ? 'text-action-text'
                                            : 'text-ink-soft',
                                    )}
                                    aria-hidden="true"
                                />
                                <span
                                    className={cn(
                                        'text-sm font-bold',
                                        isActive ? 'text-ink' : 'text-ink-soft',
                                    )}
                                >
                                    {item.label}
                                </span>
                            </span>
                            <span className="text-ink-soft font-mono text-[11px] tabular-nums">
                                0{index + 1}
                            </span>
                            {isActive ? (
                                <span
                                    aria-hidden="true"
                                    className="bg-action absolute inset-x-0 bottom-0 h-[3px]"
                                />
                            ) : null}
                        </button>
                    );
                })}
            </div>

            <div className="bg-paper relative flex min-h-[23rem] items-center justify-center px-4 py-8 sm:min-h-[25rem] sm:px-8">
                <div
                    aria-hidden="true"
                    className="ledger-grid pointer-events-none absolute inset-0 opacity-50"
                />

                <p className="sr-only" aria-live="polite">
                    {step.announcement}
                </p>

                {prefersReducedMotion ? (
                    <div className="relative w-full">
                        <StepArtifact step={step.key} />
                    </div>
                ) : (
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={step.key}
                            className="relative w-full"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.24, ease: 'easeOut' }}
                        >
                            <StepArtifact step={step.key} />
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>

            <div className="border-line flex flex-col gap-4 border-t px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <p className="text-ink text-sm font-bold text-balance">
                        {step.title}
                    </p>
                    <p className="text-ink-soft mt-1 max-w-md text-xs leading-relaxed font-medium">
                        {step.description}
                    </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleBack}
                        disabled={activeStep === 0}
                        className="border-line text-ink hover:bg-muted h-11 rounded-md px-3"
                    >
                        <ArrowLeft aria-hidden="true" />
                        <span className="sr-only sm:not-sr-only">Mundur</span>
                    </Button>
                    <Button
                        type="button"
                        onClick={handleNext}
                        className="bg-action text-action-foreground hover:bg-action-strong h-11 rounded-md px-4 font-bold"
                    >
                        {isLastStep ? 'Ulangi alur' : 'Langkah berikutnya'}
                        {isLastStep ? (
                            <RotateCcw aria-hidden="true" />
                        ) : (
                            <ArrowRight aria-hidden="true" />
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}

/**
 * Isi panggung untuk satu langkah demo.
 *
 * @param step - Kunci langkah aktif.
 */
function StepArtifact({ step }: { step: (typeof STEPS)[number]['key'] }) {
    if (step === 'foto') {
        return <ProofCard className="mx-auto w-full max-w-sm" />;
    }

    if (step === 'setuju') {
        return (
            <div className="mx-auto w-full max-w-sm">
                <WaBubble
                    className="w-full max-w-none"
                    text="Halo Bu Sari, ini foto kondisi 6 kg cucian order #RC-2391. Mohon dicek sebelum kami proses, ya."
                    time="14:32"
                />
                <div className="border-line bg-sheet mt-3 flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5">
                    <span className="text-ink-soft inline-flex items-center gap-1.5 text-xs font-bold">
                        <CheckCheck
                            className="text-ok size-4"
                            aria-hidden="true"
                        />
                        Persetujuan pelanggan
                    </span>
                    <StatusBadge variant="warning" label="Menunggu" />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-sheet border-line shadow-card relative mx-auto w-full max-w-sm rounded-lg border p-5">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <MetaLabel>Arsip order · contoh</MetaLabel>
                    <p className="text-ink mt-1 font-mono text-sm font-bold tabular-nums">
                        #RC-2391
                    </p>
                </div>
                <StatusBadge variant="success" label="Terkunci" />
            </div>

            <dl className="border-line mt-4 space-y-2 border-t pt-4 text-sm">
                {[
                    ['Disetujui', '14:32'],
                    ['Foto kondisi', '1 lembar'],
                    ['Outlet', 'Gambir'],
                ].map(([label, value]) => (
                    <div
                        key={label}
                        className="flex items-center justify-between gap-3"
                    >
                        <dt className="text-ink-soft font-medium">{label}</dt>
                        <dd className="text-ink font-mono text-xs font-bold tabular-nums">
                            {value}
                        </dd>
                    </div>
                ))}
            </dl>

            <div className="border-line text-ink-soft mt-4 flex items-center gap-2 border-t pt-4 text-xs font-medium">
                <ShieldCheck
                    className="text-ok size-4 shrink-0"
                    aria-hidden="true"
                />
                Bukti disimpan selama masa aktif langganan.
            </div>

            <div className="pointer-events-none absolute -right-2 bottom-5 rotate-[-13deg]">
                <div className="border-ok text-ok flex size-24 flex-col items-center justify-center rounded-full border-2 text-center">
                    <Stamp className="size-4" aria-hidden="true" />
                    <span className="mt-1 text-[11px] leading-tight font-extrabold tracking-[0.12em] uppercase">
                        Disetujui
                    </span>
                    <span className="text-[11px] font-bold tracking-[0.1em] uppercase">
                        contoh
                    </span>
                </div>
            </div>
        </div>
    );
}
