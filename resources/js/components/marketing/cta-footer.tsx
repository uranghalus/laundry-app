import { Link } from '@inertiajs/react';
import { ArrowRight, MessageCircle } from 'lucide-react';

import RepicaMark, { RepicaWordmark } from '@/components/marketing/repica-mark';
import { Container } from '@/components/marketing/layout';
import CountUp from '@/components/react-bits/count-up';
import { Button } from '@/components/ui/button';
import { dashboard, register } from '@/routes';
import { cn } from '@/lib/utils';

/** Nomor WhatsApp bisnis untuk jalur kedua (Persona B / non-teknis). */
export const WHATSAPP_URL = 'https://wa.me/6281234567890';

/**
 * Counter penutup - fakta produk yang bisa dibela, bukan traction rekaan.
 *
 * Semua angka bersumber dari spesifikasi: setup <30 menit, 6 status pipeline
 * terpantau otomatis, 100% aksi kritis tercatat, bukti kondisi tersimpan 12
 * bulan. CountUp react-bits memicu sekali saat masuk viewport dan langsung
 * tampil final di `prefers-reduced-motion`.
 */
const FACTS = [
    { to: 30, prefix: '< ', suffix: ' menit', label: 'setup sampai order pertama' },
    { to: 6, prefix: '', suffix: '', label: 'status terpantau otomatis' },
    { to: 100, prefix: '', suffix: '%', label: 'aksi kritis tercatat' },
    { to: 12, prefix: '', suffix: ' bulan', label: 'bukti kondisi tersimpan' },
] as const;

/**
 * Ring fokus pada bidang biru — ring terang agar tetap terlihat di #66C3FF.
 */
const FOCUS_RING =
    'focus-visible:ring-2 focus-visible:ring-sheet focus-visible:ring-offset-2 focus-visible:ring-offset-brand';

/**
 * Band CTA penutup — BIDANG BIRU penuh sebagai klimaks halaman (dunia Sachet
 * Pop), ditutup footer lembaran terang. Teks ink di atas biru (#0F172A di
 * #66C3FF ≈ 9.9:1, lolos AA), CTA primer fill `bg-action`.
 *
 * @param isAuthenticated - Tamu melihat ajuan daftar; pengguna aktif melihat dashboard.
 */
export default function MarketingCtaFooter({
    isAuthenticated = false,
}: {
    isAuthenticated?: boolean;
}) {
    return (
        <footer>
            {/* Klimaks: bidang biru + strip fakta + dua jalur aksi. */}
            <div className="bg-brand edge-tear-t relative py-20 sm:py-24">
                <Container className="relative">
                    {/* Empat fakta produk — angka fisik, hitungan masuk viewport. */}
                    <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                        {FACTS.map((fact) => (
                            <div
                                key={fact.label}
                                data-welcome-surface
                                className="bg-sheet border-brand-edge rounded-[var(--radius-sachet)] border-2 p-4 text-center shadow-card"
                            >
                                <dd className="text-ink font-display text-3xl leading-none font-extrabold tabular-nums sm:text-4xl">
                                    <CountUp
                                        to={fact.to}
                                        prefix={fact.prefix}
                                        suffix={fact.suffix}
                                    />
                                </dd>
                                <dt className="text-ink-soft mt-2 text-xs leading-snug font-semibold sm:text-sm">
                                    {fact.label}
                                </dt>
                            </div>
                        ))}
                    </dl>

                    <div className="mt-12 flex flex-col items-center text-center">
                        <h2 className="text-display-band text-ink font-display max-w-2xl text-balance font-extrabold tracking-tight">
                            Sobek sachet pertama Anda hari ini
                        </h2>
                        <p className="text-ink mt-4 max-w-xl text-base leading-relaxed font-medium sm:text-lg">
                            Coba semua fitur Pro 14 hari — tanpa kartu kredit,
                            sampai 30 order. Kalau bukan untuk Anda, tidak ada
                            yang perlu dibatalkan.
                        </p>

                        <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
                            <Link
                                href={isAuthenticated ? dashboard() : register()}
                                className={cn(
                                    'bg-action text-action-foreground hover:bg-action-strong inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[var(--radius-tear)] px-8 py-3.5 text-sm font-bold whitespace-nowrap shadow-[0_4px_0_0_var(--color-action-strong)] transition-colors duration-200 sm:w-auto',
                                    FOCUS_RING,
                                )}
                            >
                                {isAuthenticated
                                    ? 'Ke Dashboard'
                                    : 'Mulai trial 14 hari'}
                                <ArrowRight className="size-4" aria-hidden="true" />
                            </Link>
                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className={cn(
                                    'w-full gap-2 rounded-[var(--radius-tear)] border-2 border-ink/25 bg-sheet text-sm font-bold text-ink hover:bg-brand-foam sm:w-auto',
                                    FOCUS_RING,
                                )}
                            >
                                <a
                                    href={WHATSAPP_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <MessageCircle className="size-4" aria-hidden="true" />
                                    Hubungi via WhatsApp
                                </a>
                            </Button>
                        </div>

                        <p className="text-ink mt-8 text-sm font-medium tabular-nums">
                            Trial 14 hari · Tanpa kartu kredit · Cap 30 order ·
                            Batalkan kapan saja
                        </p>
                    </div>
                </Container>
            </div>

            {/* Footer lembaran — identitas + baris hak, bukan kolom link kosong. */}
            <div className="bg-ground border-line border-t">
                <Container className="flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
                    <div className="flex items-center gap-2">
                        <span className="flex size-8 items-center justify-center rounded-lg bg-brand text-white">
                            <RepicaMark className="size-5" />
                        </span>
                        <RepicaWordmark
                            showDescription={false}
                            className="text-ink text-sm font-bold"
                        />
                    </div>
                    <p className="text-ink-soft text-center text-xs leading-relaxed font-medium sm:text-right">
                        Repica — SaaS manajemen laundry dengan bukti kondisi per
                        transaksi. © {new Date().getFullYear()} Repica.
                    </p>
                </Container>
            </div>
        </footer>
    );
}
