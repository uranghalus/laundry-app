import { Link } from '@inertiajs/react';
import { ArrowDown, ArrowRight } from 'lucide-react';

import { Container, MetaLabel } from '@/components/marketing/layout';
import { ProofCard } from '@/components/marketing/proof-card';
import { WaBubble } from '@/components/marketing/wa-bubble';
import Marquee from '@/components/react-bits/marquee';
import TiltCard from '@/components/react-bits/tilt-card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { dashboard, register } from '@/routes';

/**
 * Fakta pembuka yang bisa dipertanggungjawabkan — bukan traction rekaan.
 * Diletakkan sebagai baris buku besar di bawah CTA.
 */
const FACTS = [
    { value: '14 hari', label: 'Trial penuh' },
    { value: 'Tanpa', label: 'Kartu kredit' },
    { value: '< 30 menit', label: 'Setup' },
    { value: '6 status', label: 'Terlacak' },
] as const;

/** Label pita di bawah hero; mengulang bahasa bukti, bukan logo klien palsu. */
const MARQUEE_ITEMS = [
    'Foto kondisi',
    'Persetujuan pelanggan',
    'Stempel waktu',
    'Jejak audit',
    'Rekap kas',
    'Notifikasi WhatsApp',
    'Enam status order',
    'Multi-outlet',
] as const;

/**
 * Hero halaman marketing — halaman depan "Buku Bukti".
 *
 * Judul dua warna memakai satu tinta aksi kobalt; artefak bukti dimiringkan
 * ringan dan bisa mengikuti pointer lewat TiltCard. Semua isi artefak adalah
 * ilustrasi berlabel `Contoh`, bukan tangkapan layar produk.
 *
 * @param isAuthenticated - Menentukan CTA utama antara daftar dan dashboard.
 */
export default function MarketingHero({
    isAuthenticated = false,
}: {
    isAuthenticated?: boolean;
}) {
    return (
        <section className="bg-ground relative overflow-hidden">
            <div
                className="pointer-events-none absolute inset-0 -z-10"
                aria-hidden="true"
            >
                <div className="bg-action/10 absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full mix-blend-overlay blur-[120px]" />
                <div className="bg-graphic-tint absolute right-[-10%] bottom-[-15%] h-[35%] w-[35%] rounded-full mix-blend-overlay blur-[100px]" />
            </div>
            <div
                aria-hidden="true"
                className="ledger-grid pointer-events-none absolute inset-0 opacity-60"
            />

            <Container className="relative">
                <div className="border-line text-ink-soft flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b py-3">
                    <MetaLabel>Repica · Manajemen laundry</MetaLabel>
                    <MetaLabel>Foto · Persetujuan · Arsip</MetaLabel>
                </div>

                <div className="grid gap-14 pt-12 pb-20 lg:grid-cols-12 lg:items-end lg:gap-10 lg:pt-16 lg:pb-24">
                    <div className="lg:col-span-7">
                        <h1 className="text-display-hero font-display text-ink font-extrabold text-balance">
                            Setiap cucian{' '}
                            <span className="text-action-text">
                                punya bukti.
                            </span>
                        </h1>

                        <p className="text-ink-soft mt-6 max-w-xl text-lg leading-relaxed font-medium text-pretty sm:text-xl">
                            Repica mencatat order, foto kondisi, dan persetujuan
                            pelanggan dalam satu buku yang sama. Sengketa
                            selesai dengan catatan — bukan dengan saling
                            mengingat.
                        </p>

                        <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
                            <Button
                                asChild
                                className="bg-action text-action-foreground hover:bg-action-strong h-12 rounded-md px-6 text-base font-bold"
                            >
                                <Link
                                    href={
                                        isAuthenticated
                                            ? dashboard()
                                            : register()
                                    }
                                >
                                    {isAuthenticated
                                        ? 'Buka dashboard'
                                        : 'Mulai trial 14 hari'}
                                    <ArrowRight aria-hidden="true" />
                                </Link>
                            </Button>

                            <a
                                href="#fitur"
                                className="text-ink hover:text-action-text focus-visible:ring-ring focus-visible:ring-offset-ground inline-flex min-h-11 items-center gap-2 rounded-md px-1 text-sm font-bold underline decoration-1 underline-offset-4 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                            >
                                Lihat contoh bukti
                                <ArrowDown
                                    className="size-4"
                                    aria-hidden="true"
                                />
                            </a>
                        </div>

                        <dl className="border-line bg-line mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-lg border sm:grid-cols-4">
                            {FACTS.map((fact) => (
                                <div
                                    key={fact.label}
                                    className="bg-sheet flex min-h-20 flex-col justify-between gap-3 px-4 py-4"
                                >
                                    <dt className="text-ink-soft inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold tracking-[0.14em] uppercase">
                                        <span
                                            className={cn(
                                                'h-1.5 w-1.5 shrink-0 rounded-full',
                                                fact.label === 'Trial penuh'
                                                    ? 'bg-ok'
                                                    : fact.label ===
                                                        'Kartu kredit'
                                                      ? 'bg-warn'
                                                      : fact.label === 'Setup'
                                                        ? 'bg-action'
                                                        : 'bg-graphic-tint',
                                            )}
                                            aria-hidden="true"
                                        />
                                        {fact.label}
                                    </dt>
                                    <dd className="text-ink text-lg leading-none font-extrabold tabular-nums">
                                        {fact.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>

                    <div className="relative lg:col-span-5">
                        <div
                            aria-hidden="true"
                            className="bg-graphic-tint absolute -inset-x-2 top-6 bottom-4 rounded-xl sm:-inset-x-4"
                        />

                        <TiltCard
                            maxTilt={3}
                            className="relative mx-auto w-full max-w-md lg:max-w-none"
                        >
                            <div className="relative">
                                <ProofCard className="-rotate-[1.2deg]" />

                                <WaBubble
                                    className="absolute top-[36%] right-0 w-[17rem] rotate-[1.8deg] sm:-right-6"
                                    text="Bukti kondisi order #RC-2391 sudah siap dicek. Setujui agar cucian bisa kami proses."
                                    time="14:32"
                                />
                            </div>
                        </TiltCard>

                        <MetaLabel className="mt-3 flex justify-end">
                            Ilustrasi · data contoh
                        </MetaLabel>
                    </div>
                </div>
            </Container>

            <div className="bg-night text-night-ink border-night-line border-t">
                <Marquee
                    items={MARQUEE_ITEMS}
                    label="Pita ringkasan bukti Repica"
                    className="py-3.5"
                />
            </div>
        </section>
    );
}
