import type { ReactNode } from 'react';

import { Camera, MessageCircle, ShieldCheck, Wallet } from 'lucide-react';

import { Container, SectionHeading } from '@/components/marketing/layout';
import { ProofArtifact } from '@/components/marketing/proof-artifact';
import { StatusBadge } from '@/components/marketing/status-badge';
import { WaBubble } from '@/components/marketing/wa-bubble';
import { cn } from '@/lib/utils';

/**
 * Satu sel bento fitur.
 *
 * Sel bukan tombol: tidak ada aksi yang bisa dilakukan di sini, jadi memakai
 * `<article>` lebih jujur daripada `<button>` yang hanya bereaksi secara
 * visual. Ikon dan badge memperkuat judul, sementara `children` membawa
 * artefak bukti yang bisa dibaca.
 *
 * @param icon - Ikon lucide yang mewakili fitur.
 * @param title - Judul fitur (heading level 3).
 * @param description - Satu kalimat penjelas.
 * @param badge - Label status singkat.
 * @param variant - Warna badge status.
 * @param className - Kelas tambahan untuk rentang grid.
 * @param children - Artefak atau data contoh di dalam sel.
 */
function BentoCell({
    icon: Icon,
    title,
    description,
    badge,
    variant = 'neutral',
    className,
    children,
}: {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    title: string;
    description: string;
    badge: string;
    variant?: 'success' | 'warning' | 'info' | 'neutral';
    className?: string;
    children: ReactNode;
}) {
    return (
        <article
            className={cn(
                'border-border bg-card flex flex-col gap-4 rounded-2xl border p-5 sm:p-6',
                className,
            )}
        >
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                    <Icon
                        className="text-link size-4 shrink-0"
                        aria-hidden="true"
                    />
                    <h3 className="text-ink text-sm font-semibold tracking-[-0.01em] sm:text-base">
                        {title}
                    </h3>
                </div>
                <StatusBadge variant={variant} label={badge} />
            </div>
            <p className="text-ink-soft text-sm leading-relaxed">
                {description}
            </p>
            <div className="mt-auto">{children}</div>
        </article>
    );
}

/**
 * Grid bento fitur halaman publik (`#fitur`).
 *
 * Rentang kolom ditulis statis supaya Tailwind benar-benar menghasilkan
 * kelasnya — kelas dinamis `md:col-span-${n}` tidak pernah dikompilasi.
 *
 * Komposisi desktop 4 kolom:
 *
 * ```
 * bukti   bukti   audit   audit
 * bukti   bukti   wa      kas
 * ```
 *
 * Di tablet semua sel menjadi dua kolom, di ponsel satu kolom.
 */
export default function FeatureBento() {
    return (
        <section id="fitur" className="scroll-mt-20">
            <Container className="py-16 sm:py-24">
                <SectionHeading
                    index="02"
                    eyebrow="Fitur"
                    title="Yang membocorkan uang Anda, ditutup satu per satu"
                    description="Setiap sel membuka satu masalah operasional laundry ke bukti yang bisa diperiksa: foto, jejak audit, persetujuan, dan kas."
                />

                <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
                    <BentoCell
                        className="md:col-span-2 lg:row-span-2"
                        icon={Camera}
                        title="Bukti kondisi awal, ber-watermark"
                        description="Foto diambil saat barang masuk, dikunci waktu dan outlet, lalu disetujui pelanggan lewat WhatsApp."
                        badge="Tersimpan 12 bulan"
                        variant="success"
                    >
                        <ProofArtifact compact />
                    </BentoCell>

                    <BentoCell
                        className="md:col-span-2"
                        icon={ShieldCheck}
                        title="Jejak audit di setiap perubahan"
                        description="Harga, diskon, dan void tercatat lengkap: siapa, kapan, dari nilai berapa ke berapa."
                        badge="Terpantau"
                        variant="warning"
                    >
                        <ul className="border-border bg-background divide-border divide-y rounded-lg border text-xs">
                            <li className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-3 py-2.5">
                                <span className="text-ink-soft">
                                    Cuci kering · Sari
                                </span>
                                <span className="text-ink flex items-center gap-1.5">
                                    <del className="text-ink-soft decoration-error/50">
                                        Rp15.000
                                    </del>
                                    <span aria-hidden="true">→</span>
                                    <span className="sr-only">menjadi</span>
                                    <span className="font-semibold tabular-nums">
                                        Rp18.000
                                    </span>
                                </span>
                            </li>
                            <li className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-3 py-2.5">
                                <span className="text-ink-soft">
                                    Void transaksi · Budi
                                </span>
                                <span className="text-ink font-semibold tabular-nums">
                                    RC-2388
                                </span>
                            </li>
                        </ul>
                    </BentoCell>

                    <BentoCell
                        icon={MessageCircle}
                        title="Persetujuan pelanggan"
                        description="Status berubah setelah pelanggan membalas, bukan setelah kasir menekan tombol."
                        badge="Disetujui"
                        variant="success"
                    >
                        <WaBubble text="Oke, kondisi bajunya sesuai foto. Lanjut cuci." />
                    </BentoCell>

                    <BentoCell
                        icon={Wallet}
                        title="Kas harian tertutup"
                        description="Tunai dan non-tunai dalam satu lembar yang bisa dicocokkan malam itu juga."
                        badge="Tercatat"
                    >
                        <dl className="border-border divide-border divide-y rounded-lg border text-xs">
                            <div className="flex items-center justify-between px-3 py-2">
                                <dt className="text-ink-soft">Tunai</dt>
                                <dd className="text-ink font-semibold tabular-nums">
                                    Rp840.000
                                </dd>
                            </div>
                            <div className="flex items-center justify-between px-3 py-2">
                                <dt className="text-ink-soft">QRIS</dt>
                                <dd className="text-ink font-semibold tabular-nums">
                                    Rp360.000
                                </dd>
                            </div>
                            <div className="bg-band/70 flex items-center justify-between px-3 py-2">
                                <dt className="text-ink-soft">Selisih</dt>
                                <dd className="text-ink font-semibold tabular-nums">
                                    Rp0
                                </dd>
                            </div>
                        </dl>
                    </BentoCell>
                </div>
            </Container>
        </section>
    );
}
