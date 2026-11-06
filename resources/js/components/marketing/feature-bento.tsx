import {
    Camera,
    MessageCircle,
    ShieldCheck,
    TrendingUp,
    Wallet,
} from 'lucide-react';

import { Container, SectionHeading } from '@/components/marketing/layout';
import { ProofCard } from '@/components/marketing/proof-card';
import { StatusBadge } from '@/components/marketing/status-badge';
import { WaBubble } from '@/components/marketing/wa-bubble';
import CountUp from '@/components/react-bits/count-up';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * Ring fokus bersama untuk kartu fitur — selalu terlihat, tidak menghapus
 * outline tanpa pengganti.
 */
const FOCUS_RING =
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ground';

/**
 * Entri jejak audit mini — baris "siapa mengubah apa, kapan". Angka lama/baru
 * memakai tabular-nums lewat atribut `data-numeric` (base CSS).
 */
function AuditLine({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-ink-soft border-action/60 border-l-2 pl-3 text-xs leading-snug font-medium tabular-nums">
            {children}
        </p>
    );
}

/**
 * Band Feature Bento — "rak" empat kemasan solusi (dunia Sachet Pop).
 *
 * Ritme visual PLATE-OVER-PAD: setiap sel adalah pad berwarna (tint pastel
 * satu tingkat) dengan piring sachet `bg-sheet` yang menumpuk di atasnya lewat
 * offset — bukan bayangan bertumpuk. Grid asimetris: sel bukti kondisi membesar
 * (2 kolom), tiga sel lain mengisi sisa rak. Angka fisik (Rp/hari, jumlah aksi)
 * digoyang masuk via CountUp react-bits sebagai hitungan nyata, bukan statistik
 * hiasan.
 *
 * Semua warna dari token; aksen pastel hanya chip/tint; teks CTA/aksi memakai
 * `text-action` (AA). Kartu non-interaktif tidak punya hover yang mati — hanya
 * elevasi naik satu tingkat saat hover sebagai umpan balik rak.
 */
export default function FeatureBento() {
    return (
        <section id="fitur" className="bg-ground scroll-mt-20 border-t border-line py-20 sm:py-24">
            <Container>
                <SectionHeading
                    index="02"
                    eyebrow="Fitur"
                    title="Empat kemasan, satu janji: semua ada buktinya"
                    description="Setiap masalah operasional di rak sebelah sudah disobek di sini — solusinya terlihat sebagai artefak, bukan sebagai daftar fitur."
                />

                {/* Rak — grid asimetris plate-over-pad. */}
                <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                    {/* Pad 1 — sel besar bukti kondisi (2 kolom). */}
                    <div className="bg-brand-tint rounded-[var(--radius-sachet)] p-3 md:col-span-2 lg:row-span-2">
                        <Card
                            tabIndex={0}
                            className={cn(
                                'bg-sheet border-brand-edge relative h-full gap-0 overflow-hidden rounded-[calc(var(--radius-sachet)-0.375rem)] border-2 p-6 shadow-card transition-transform duration-200 hover:-translate-y-1',
                                FOCUS_RING,
                            )}
                        >
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-action flex items-center gap-2 text-sm font-extrabold">
                                    <Camera className="size-4" aria-hidden="true" />
                                    Buktikan kondisi awal
                                </span>
                                <Badge variant="secondary" className="bg-ok-tint text-ok">
                                    Foto + watermark
                                </Badge>
                            </div>
                            <p className="text-ink-soft mt-3 text-sm leading-relaxed font-medium">
                                Setiap order dimulai dengan foto kondisi awal
                                berwatermark outlet, waktu, dan nomor order —
                                sengketa baju rusak tidak pernah lagi jadi kata
                                satu melawan kata yang lain.
                            </p>
                            <div className="mt-5">
                                <ProofCard />
                            </div>
                        </Card>
                    </div>

                    {/* Pad 2 — jejak audit harga. */}
                    <div className="bg-violet-tint rounded-[var(--radius-sachet)] p-3">
                        <Card
                            tabIndex={0}
                            className={cn(
                                'bg-sheet border-violet/30 relative h-full gap-0 overflow-hidden rounded-[calc(var(--radius-sachet)-0.375rem)] border-2 p-5 shadow-card transition-transform duration-200 hover:-translate-y-1',
                                FOCUS_RING,
                            )}
                        >
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-action flex items-center gap-2 text-sm font-extrabold">
                                    <ShieldCheck className="size-4" aria-hidden="true" />
                                    Jejak audit harga
                                </span>
                                <StatusBadge variant="warning" label="Terpantau" />
                            </div>
                            <div className="mt-4 flex flex-col gap-2.5">
                                <AuditLine>
                                    Harga diubah · Sari · 10:32 · Rp15.000 → Rp18.000
                                </AuditLine>
                                <AuditLine>
                                    Status di-rollback · Owner · 11:05 · Dicuci → Diterima
                                </AuditLine>
                                <AuditLine>
                                    Transaksi di-void · Kasir 2 · 13:47 · dicatat otomatis
                                </AuditLine>
                            </div>
                        </Card>
                    </div>

                    {/* Pad 3 — konfirmasi WhatsApp. */}
                    <div className="bg-rose-tint rounded-[var(--radius-sachet)] p-3">
                        <Card
                            tabIndex={0}
                            className={cn(
                                'bg-sheet border-rose/30 relative h-full gap-0 overflow-hidden rounded-[calc(var(--radius-sachet)-0.375rem)] border-2 p-5 shadow-card transition-transform duration-200 hover:-translate-y-1',
                                FOCUS_RING,
                            )}
                        >
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-action flex items-center gap-2 text-sm font-extrabold">
                                    <MessageCircle className="size-4" aria-hidden="true" />
                                    Persetujuan WhatsApp
                                </span>
                                <StatusBadge variant="info" label="Terekam" />
                            </div>
                            <div className="mt-4">
                                <WaBubble
                                    text="Pesanan diterima, cuci mulai besok."
                                    time="14:32"
                                    approved
                                />
                            </div>
                        </Card>
                    </div>

                    {/* Pad 4 — kas harian tertutup (artefak lembar malam hari). */}
                    <div className="bg-mint-tint rounded-[var(--radius-sachet)] p-3 md:col-span-2 lg:col-span-2">
                        <Card
                            tabIndex={0}
                            className={cn(
                                'bg-sheet border-mint/30 relative h-full gap-0 overflow-hidden rounded-[calc(var(--radius-sachet)-0.375rem)] border-2 p-5 shadow-card transition-transform duration-200 hover:-translate-y-1',
                                FOCUS_RING,
                            )}
                        >
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-action flex items-center gap-2 text-sm font-extrabold">
                                    <Wallet className="size-4" aria-hidden="true" />
                                    Kas harian tertutup
                                </span>
                                <StatusBadge variant="success" label="Tercatat" />
                            </div>
                            <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_1.2fr] sm:items-center">
                                <dl className="border-line divide-line divide-y rounded-[var(--radius-tear)] border text-xs">
                                    <div className="flex items-center justify-between px-3 py-2">
                                        <dt className="text-ink-soft font-semibold">Tunai</dt>
                                        <dd className="text-ink font-bold tabular-nums">
                                            Rp
                                            <CountUp to={840} duration={1.2} suffix=".000" />
                                        </dd>
                                    </div>
                                    <div className="flex items-center justify-between px-3 py-2">
                                        <dt className="text-ink-soft font-semibold">QRIS</dt>
                                        <dd className="text-ink font-bold tabular-nums">
                                            Rp
                                            <CountUp to={360} duration={1} suffix=".000" />
                                        </dd>
                                    </div>
                                    <div className="bg-brand-foam flex items-center justify-between px-3 py-2">
                                        <dt className="text-ink-soft font-semibold">Selisih</dt>
                                        <dd className="text-ok font-bold tabular-nums">Rp0</dd>
                                    </div>
                                </dl>
                                <p className="text-ink-soft text-sm leading-relaxed font-medium">
                                    Tunai dan non-tunai masuk satu lembar yang
                                    bisa dicocokkan malam itu juga — tidak ada
                                    lagi setoran yang “kemarin kurang, tidak
                                    tahu kurangnya di mana”.
                                </p>
                            </div>
                        </Card>
                    </div>

                    {/* Pad 5 — batas trial yang jujur (angka dari DECISIONS Q9). */}
                    <div className="bg-amber-tint rounded-[var(--radius-sachet)] p-3 md:col-span-2 lg:col-span-2">
                        <Card
                            tabIndex={0}
                            className={cn(
                                'bg-sheet border-amber/40 relative h-full gap-0 overflow-hidden rounded-[calc(var(--radius-sachet)-0.375rem)] border-2 p-5 shadow-card transition-transform duration-200 hover:-translate-y-1',
                                FOCUS_RING,
                            )}
                        >
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-action flex items-center gap-2 text-sm font-extrabold">
                                    <TrendingUp className="size-4" aria-hidden="true" />
                                    Cara memulai yang jujur
                                </span>
                                <StatusBadge variant="neutral" label="Tanpa kartu" />
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                                <div>
                                    <p className="text-ink font-display text-2xl leading-none font-extrabold tabular-nums">
                                        <CountUp to={14} duration={1} />
                                    </p>
                                    <p className="text-ink-soft mt-1 text-xs font-semibold">
                                        hari trial penuh fitur
                                    </p>
                                </div>
                                <div>
                                    <p className="text-ink font-display text-2xl leading-none font-extrabold tabular-nums">
                                        <CountUp to={30} duration={1} />
                                    </p>
                                    <p className="text-ink-soft mt-1 text-xs font-semibold">
                                        order maks selama trial
                                    </p>
                                </div>
                                <div>
                                    <p className="text-ink font-display text-2xl leading-none font-extrabold tabular-nums">
                                        <CountUp to={0} from={0} duration={0.6} prefix="Rp" />
                                    </p>
                                    <p className="text-ink-soft mt-1 text-xs font-semibold">
                                        biaya mulai (tanpa kartu)
                                    </p>
                                </div>
                            </div>
                            <p className="text-ink-soft mt-3 text-sm leading-relaxed font-medium">
                                Angka-angka ini adalah ketentuan trial yang
                                berlaku di halaman harga — bukan janji bonus.
                            </p>
                        </Card>
                    </div>
                </div>
            </Container>
        </section>
    );
}
