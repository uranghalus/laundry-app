import { useState } from 'react';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import {
    Container,
    MetaLabel,
    SectionHeading,
} from '@/components/marketing/layout';
import { PIPELINE_STATUSES } from '@/lib/pipeline-status';
import { cn } from '@/lib/utils';

/**
 * Contoh pesan pelanggan pada setiap status. Isinya mengikuti perilaku
 * notifikasi produk (PRD §5), bukan SLA atau durasi yang direka.
 */
const CUSTOMER_MESSAGES: Record<string, string> = {
    diterima:
        'Order #RC-2391 diterima. Foto kondisi sudah dilampirkan — mohon dicek dan disetujui.',
    dicuci: 'Cucian order #RC-2391 sedang dicuci.',
    dikeringkan: 'Cucian order #RC-2391 masuk tahap pengeringan.',
    disetrika: 'Cucian order #RC-2391 sedang disetrika.',
    siap_diambil:
        'Cucian order #RC-2391 siap diambil di Outlet Gambir. Total tagihan ada di tautan.',
    selesai:
        'Order #RC-2391 sudah diserahkan. Bukti kondisi dan riwayatnya tetap tersimpan.',
};

/**
 * Band cara kerja — stepper status vertikal yang bisa diklik.
 *
 * Enam status memakai definisi bersama di `lib/pipeline-status.ts` supaya
 * bahasa status sama dengan aplikasi. Tidak ada bilah durasi, jumlah order,
 * atau timer rekaan; yang ditampilkan hanya urutan dan pesan contoh.
 */
export default function MarketingPipeline() {
    const [activeIndex, setActiveIndex] = useState(0);
    const prefersReducedMotion = useReducedMotion();
    const status = PIPELINE_STATUSES[activeIndex];
    const ActiveIcon = status.icon;

    return (
        <section
            id="cara-kerja"
            aria-labelledby="cara-kerja-title"
            className="bg-night text-night-ink scroll-mt-24 py-20 sm:py-24"
        >
            <Container>
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <SectionHeading
                        id="cara-kerja-title"
                        tone="dark"
                        title="Enam status. Satu urutan yang bisa dibaca."
                        description="Setiap perubahan status mengirim kabar ke pelanggan dan meninggalkan catatan di order. Pilih status untuk melihat apa yang terjadi."
                    />
                    <MetaLabel tone="dark" className="shrink-0 pb-2">
                        Contoh alur satu order
                    </MetaLabel>
                </div>

                <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:gap-10">
                    <div className="lg:col-span-5">
                        <ol className="border-night-line overflow-hidden rounded-xl border">
                            {PIPELINE_STATUSES.map((item, index) => {
                                const Icon = item.icon;
                                const isActive = index === activeIndex;

                                return (
                                    <li key={item.key}>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setActiveIndex(index)
                                            }
                                            aria-current={
                                                isActive ? 'step' : undefined
                                            }
                                            aria-controls="status-panel"
                                            className={cn(
                                                'border-night-line flex min-h-14 w-full items-center gap-4 border-b px-4 py-3 text-left transition-colors last:border-b-0',
                                                'focus-visible:ring-night-accent focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset',
                                                isActive
                                                    ? 'bg-night-raised text-night-ink'
                                                    : 'text-night-ink-soft hover:bg-night-raised/60 hover:text-night-ink',
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    'flex size-9 shrink-0 items-center justify-center rounded-md border',
                                                    isActive
                                                        ? `border ${item.dotClass}`
                                                        : 'border-night-line text-night-ink-soft',
                                                )}
                                            >
                                                <Icon
                                                    className="size-4"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                            <span className="flex-1 text-sm font-bold">
                                                {item.label}
                                            </span>
                                            <span className="font-mono text-[11px] font-semibold tabular-nums">
                                                0{index + 1}
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ol>
                    </div>

                    <div id="status-panel" className="lg:col-span-7">
                        <p className="sr-only" aria-live="polite">
                            Status {status.label}: {status.description}
                        </p>

                        {prefersReducedMotion ? (
                            <StatusDetail
                                status={status}
                                activeIndex={activeIndex}
                            />
                        ) : (
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={status.key}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{
                                        duration: 0.22,
                                        ease: 'easeOut',
                                    }}
                                >
                                    <StatusDetail
                                        status={status}
                                        activeIndex={activeIndex}
                                    />
                                </motion.div>
                            </AnimatePresence>
                        )}

                        <p className="text-night-ink-soft mt-4 flex items-start gap-2 text-xs leading-relaxed font-medium">
                            <ActiveIcon
                                className="text-night-accent mt-0.5 size-4 shrink-0"
                                aria-hidden="true"
                            />
                            Setiap perubahan status tercatat di audit log —
                            siapa, kapan, dan dari status apa.
                        </p>
                    </div>
                </div>
            </Container>
        </section>
    );
}

/**
 * Panel detail untuk status yang sedang dipilih.
 *
 * @param status - Definisi status dari `PIPELINE_STATUSES`.
 * @param activeIndex - Indeks status aktif untuk penomoran.
 */
function StatusDetail({
    status,
    activeIndex,
}: {
    status: (typeof PIPELINE_STATUSES)[number];
    activeIndex: number;
}) {
    const Icon = status.icon;

    return (
        <div className="bg-night-raised border-night-line relative overflow-hidden rounded-xl border p-6 sm:p-8">
            <span
                aria-hidden="true"
                className="text-night-ink/5 pointer-events-none absolute -top-8 right-2 font-mono text-[9rem] leading-none font-extrabold tabular-nums select-none"
            >
                0{activeIndex + 1}
            </span>

            <div className="relative">
                <div className="flex items-start justify-between gap-4">
                    <span className="bg-night text-night-accent flex size-14 items-center justify-center rounded-lg">
                        <Icon className="size-6" aria-hidden="true" />
                    </span>
                    <MetaLabel tone="dark">
                        Status 0{activeIndex + 1} / 06
                    </MetaLabel>
                </div>

                <h3 className="text-night-ink mt-6 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
                    {status.label}
                </h3>
                <p className="text-night-ink-soft mt-3 max-w-lg text-base leading-relaxed font-medium">
                    {status.description}
                </p>

                <div className="border-night-line mt-8 border-t pt-5">
                    <MetaLabel tone="dark">
                        Pesan ke pelanggan · contoh
                    </MetaLabel>
                    <p className="text-night-ink mt-2 max-w-lg text-sm leading-relaxed font-semibold">
                        “{CUSTOMER_MESSAGES[status.key]}”
                    </p>
                </div>
            </div>
        </div>
    );
}
