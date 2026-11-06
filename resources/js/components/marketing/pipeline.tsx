import { useState } from 'react';

import {
    Inbox,
    Droplets,
    Wind,
    Flame,
    PackageCheck,
    Check,
} from 'lucide-react';
import { useReducedMotion } from 'motion/react';

import { Container, SectionHeading } from '@/components/marketing/layout';
import CountUp from '@/components/react-bits/count-up';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';

/**
 * Enam status pipeline PRD §6.2 sebagai BLOK BERDURASI TERUKUR (donasi ritme
 * "laban"): tiap tahap digambar sebagai balok dengan lebar proporsional ke
 * durasi tipikalnya, bukan sebagai kartu seragam. Durasi menit adalah contoh
 * pelacakan satu order — label "contoh" selalu terlihat agar tidak dibaca
 * sebagai klaim SLA.
 */
const STAGES = [
    {
        key: 'diterima',
        label: 'Diterima',
        icon: Inbox,
        tint: 'bg-brand',
        minutes: 10,
        count: 12,
        desc: 'Barang diterima di outlet, foto kondisi awal diambil.',
    },
    {
        key: 'dicuci',
        label: 'Dicuci',
        icon: Droplets,
        tint: 'bg-night-brand',
        minutes: 90,
        count: 8,
        desc: 'Masuk proses cuci sesuai jenis layanan.',
    },
    {
        key: 'dikeringkan',
        label: 'Dikeringkan',
        icon: Wind,
        tint: 'bg-mint',
        minutes: 45,
        count: 6,
        desc: 'Selesai dicuci, sedang dikeringkan.',
    },
    {
        key: 'disetrika',
        label: 'Disetrika',
        icon: Flame,
        tint: 'bg-amber',
        minutes: 40,
        count: 5,
        desc: 'Pengeringan selesai, masuk tahap setrika.',
    },
    {
        key: 'siap-diambil',
        label: 'Siap Diambil',
        icon: PackageCheck,
        tint: 'bg-violet',
        minutes: 15,
        count: 4,
        desc: 'Sudah selesai dan siap diambil pelanggan.',
    },
    {
        key: 'selesai',
        label: 'Selesai',
        icon: Check,
        tint: 'bg-ok',
        minutes: 5,
        count: 20,
        desc: 'Barang diserahkan, invoice dan jejak terkunci.',
    },
] as const;

/** Total durasi contoh (menit) — dipakai untuk lebar proporsional balok. */
const TOTAL_MINUTES = STAGES.reduce((sum, s) => sum + s.minutes, 0);

type PipelineFilter = (typeof STAGES)[number]['key'] | 'semua';

/**
 * Band Pipeline — malam `#0B1B33` dengan field biru berpendar (night band).
 *
 * Interaksi: ToggleGroup filter (konvensi shadcn yang dipertahankan) menyaring
 * balok tanpa reload; hasilnya diumumkan lewat `aria-live` karena perubahan
 * grid tidak selalu terlihat oleh pembaca layar. Balok nonaktif diredupkan,
 * bukan disembunyikan, supaya proporsi durasi tetap terbaca utuh.
 *
 * Angka durasi & jumlah order masuk sebagai hitungan fisik via CountUp
 * (react-bits) — dihormati `prefers-reduced-motion` oleh komponen itu sendiri.
 */
export default function MarketingPipeline() {
    const [filter, setFilter] = useState<PipelineFilter>('semua');
    const prefersReducedMotion = useReducedMotion() ?? false;

    return (
        <section
            id="cara-kerja"
            className="bg-night scroll-mt-20 relative overflow-hidden py-20 sm:py-24"
        >
            {/* Field biru berpendar — dua busur, bukan wash penuh (aksen 1-2). */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className="bg-brand/15 absolute top-1/4 -left-32 size-96 rounded-full blur-3xl" />
                <div className="bg-night-brand/10 absolute -right-24 -bottom-16 size-80 rounded-full blur-3xl" />
            </div>

            <Container className="relative">
                <SectionHeading
                    index="03"
                    eyebrow="Cara kerja"
                    tone="dark"
                    title="Sebuah order, dari pintu sampai tangan"
                    description="Enam status, satu jejak. Lebar tiap balok adalah durasi tipikal tahapnya dalam satu order contoh — waktu tunggu pelanggan berhenti jadi tebak-tebakan."
                />

                {/* Filter radiogroup — konvensi ToggleGroup shadcn dipertahankan. */}
                <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="bg-night-soft border-night-line inline-flex max-w-full items-center overflow-x-auto rounded-[var(--radius-tear)] border p-1">
                        <ToggleGroup
                            type="single"
                            value={filter}
                            onValueChange={(value: string) =>
                                setFilter((value || 'semua') as PipelineFilter)
                            }
                            aria-label="Filter status pipeline"
                            className="flex flex-row"
                        >
                            <ToggleGroupItem
                                value="semua"
                                className={cn(
                                    'text-night-ink-soft data-[state=on]:bg-night-brand/25 data-[state=on]:text-night-ink min-h-11 rounded-md px-4 text-sm font-bold whitespace-nowrap transition-colors',
                                )}
                            >
                                Semua
                            </ToggleGroupItem>
                            {STAGES.map((s) => (
                                <ToggleGroupItem
                                    key={s.key}
                                    value={s.key}
                                    className={cn(
                                        'text-night-ink-soft data-[state=on]:bg-night-brand/25 data-[state=on]:text-night-ink min-h-11 rounded-md px-4 text-sm font-bold whitespace-nowrap transition-colors',
                                    )}
                                >
                                    {s.label}
                                </ToggleGroupItem>
                            ))}
                        </ToggleGroup>
                    </div>
                    <p
                        className="text-night-ink-soft text-xs font-semibold tabular-nums"
                        aria-live="polite"
                    >
                        {filter === 'semua'
                            ? `Menampilkan ${STAGES.length} tahap · total ${TOTAL_MINUTES} menit contoh`
                            : `Menampilkan 1 tahap dari ${STAGES.length}`}
                    </p>
                </div>

                {/* Balok durasi — lebar proporsional, ritme horizontal di desktop. */}
                <ol className="mt-10 flex flex-col gap-3" aria-label="Tahap pipeline dengan durasi">
                    {STAGES.map((stage) => {
                        const Icon = stage.icon;
                        const dim = filter !== 'semua' && filter !== stage.key;
                        const widthPct = Math.max(
                            14,
                            Math.round((stage.minutes / TOTAL_MINUTES) * 100),
                        );
                        return (
                            <li key={stage.key} data-welcome-surface>
                                <div
                                    className={cn(
                                        'border-night-line bg-night-soft flex min-h-11 flex-wrap items-center gap-x-4 gap-y-2 rounded-[var(--radius-tear)] border-2 p-4 transition-opacity duration-200',
                                        dim
                                            ? 'opacity-40'
                                            : 'opacity-100 hover:opacity-100',
                                        filter === stage.key
                                            ? 'border-night-brand ring-2 ring-night-brand/50'
                                            : '',
                                    )}
                                    style={
                                        prefersReducedMotion
                                            ? undefined
                                            : {
                                                  transition:
                                                      'opacity 200ms ease',
                                              }
                                    }
                                >
                                    {/* Bar durasi proporsional (bukan teks warna). */}
                                    <span
                                        aria-hidden="true"
                                        className={cn(
                                            'hidden h-2 shrink-0 rounded-full lg:block',
                                            stage.tint,
                                        )}
                                        style={{ width: `${widthPct * 2.6}px`, maxWidth: '40%' }}
                                    />
                                    <span className="text-night-ink flex size-9 shrink-0 items-center justify-center rounded-lg bg-night-brand/20">
                                        <Icon className="size-4" aria-hidden="true" />
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-night-ink text-sm font-extrabold">
                                            {stage.label}
                                        </p>
                                        <p className="text-night-ink-soft text-xs leading-snug font-medium">
                                            {stage.desc}
                                        </p>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-5 tabular-nums">
                                        <span className="text-night-ink font-display text-lg leading-none font-extrabold">
                                            <CountUp
                                                to={stage.minutes}
                                                duration={0.8}
                                            />
                                            <span className="text-night-ink-soft text-xs font-bold">
                                                {' '}
                                                mnt
                                            </span>
                                        </span>
                                        <span className="text-night-brand bg-night-brand/15 rounded-full px-2.5 py-1 text-xs font-bold">
                                            <CountUp to={stage.count} duration={0.6} />{' '}
                                            order
                                        </span>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ol>

                <p className="text-night-ink-soft mt-6 text-xs font-medium">
                    Durasi dan jumlah di atas adalah contoh satu hari satu
                    outlet, bukan janji SLA — angka nyata datang dari mesin
                    Anda sendiri setelah terhubung.
                </p>
            </Container>
        </section>
    );
}
