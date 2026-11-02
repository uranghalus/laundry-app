import { useState } from 'react';

import { Container, SectionHeading } from '@/components/marketing/layout';
import { cn } from '@/lib/utils';
import { PIPELINE_STATUSES } from '@/lib/pipeline-status';

/**
 * Opsi filter pipeline. `semua` mengembalikan keenam tahap.
 */
const FILTERS = [
    { key: 'semua', label: 'Semua' },
    ...PIPELINE_STATUSES.map((status) => ({
        key: status.key,
        label: status.label,
    })),
] as const;

/**
 * Satu kartu tahap pipeline di atas band navy.
 *
 * Kartu tidak interaktif — penyaringan dilakukan tombol filter di atasnya.
 * Sebelumnya kartu diberi `role="region"` dan `tabIndex`, yang membuat enam
 * perhentian Tab tambahan tanpa aksi apa pun; sekarang semantiknya kembali
 * menjadi `<article>` biasa.
 *
 * @param status - Definisi status dari `PIPELINE_STATUSES`.
 * @param order - Nomor urut tahap (1–6) untuk penanda ledger.
 */
function StageCard({
    status,
    order,
}: {
    status: (typeof PIPELINE_STATUSES)[number];
    order: number;
}) {
    const Icon = status.icon;

    return (
        <article className="bg-navy-soft/70 flex h-full flex-col gap-3 rounded-xl border border-white/15 p-5">
            <div className="flex items-center justify-between">
                <span className="text-brand-200 text-[11px] font-semibold tracking-[0.18em] tabular-nums">
                    {String(order).padStart(2, '0')}
                </span>
                <span
                    className={cn('size-2 rounded-full', status.dotClass)}
                    aria-hidden="true"
                />
            </div>

            <Icon className="text-brand-200 size-5" aria-hidden="true" />

            <h3 className="text-base font-semibold tracking-[-0.01em] text-white">
                {status.label}
            </h3>

            <p className="text-sm leading-relaxed text-white/65">
                {status.description}
            </p>
        </article>
    );
}

/**
 * Band `#cara-kerja`: enam tahap pipeline dengan penyaring yang benar-benar
 * menyaring.
 *
 * Band ini salah satu dari dua momen navy penuh di halaman (satunya CTA
 * penutup) — dipakai supaya alur operasional terasa seperti ruang kontrol,
 * bukan bagian dekoratif lain.
 *
 * Filter memakai tombol `aria-pressed`, bukan radiogroup buatan: tombol
 * sudah membawa semantik "aktif/tidak aktif" dan bisa dioperasikan dengan
 * Tab + Enter tanpa implementasi panah khusus.
 */
export default function MarketingPipeline() {
    const [active, setActive] = useState<string>('semua');

    const visible = PIPELINE_STATUSES.map((status, index) => ({
        status,
        order: index + 1,
    })).filter(({ status }) => active === 'semua' || status.key === active);

    return (
        <section
            id="cara-kerja"
            aria-labelledby="heading-cara-kerja"
            className="bg-navy scroll-mt-20"
        >
            <Container className="py-16 sm:py-24">
                <SectionHeading
                    index="04"
                    eyebrow="Cara kerja"
                    title="Enam tahap, satu catatan yang tidak bisa diubah diam-diam"
                    description="Setiap order bergerak dari diterima sampai diserahkan. Status, pelaku, dan waktunya tercatat di tempat yang sama."
                    tone="dark"
                />

                <div
                    role="group"
                    aria-label="Saring tahap pipeline"
                    className="mt-10 flex flex-wrap gap-2"
                >
                    {FILTERS.map((filter) => (
                        <button
                            key={filter.key}
                            type="button"
                            aria-pressed={active === filter.key}
                            onClick={() => setActive(filter.key)}
                            className={cn(
                                'focus-visible:ring-brand-500 focus-visible:ring-offset-navy inline-flex min-h-9 items-center rounded-full border px-3.5 text-xs font-semibold transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2',
                                active === filter.key
                                    ? 'text-navy border-white bg-white'
                                    : 'border-white/20 text-white/70 hover:border-white/40 hover:text-white',
                            )}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>

                <ul
                    aria-label="Tahap pipeline"
                    className={cn(
                        'mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3',
                        visible.length === 1 &&
                            'sm:grid-cols-1 lg:max-w-md lg:grid-cols-1',
                    )}
                >
                    {visible.map(({ status, order }) => (
                        <li key={status.key} className="h-full">
                            <StageCard status={status} order={order} />
                        </li>
                    ))}
                </ul>

                <p
                    aria-live="polite"
                    className="text-brand-200/80 mt-6 text-xs tabular-nums"
                >
                    Menampilkan {visible.length} dari {PIPELINE_STATUSES.length}{' '}
                    tahap
                </p>
            </Container>
        </section>
    );
}
