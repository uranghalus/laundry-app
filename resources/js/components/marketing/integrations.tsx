import {
    Banknote,
    Landmark,
    MessageCircle,
    QrCode,
    Wallet,
    Smartphone,
} from 'lucide-react';

import { Container, SectionHeading } from '@/components/marketing/layout';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * Kanal yang benar-benar terhubung (PRD §5 — Meta WhatsApp Cloud API, Xendit
 * pay link VA/QRIS/e-wallet, SMS fallback), bukan grid logo kosmetik.
 * Digambarkan sebagai sachet kecil satu baris di rak integrasi: chip ikon +
 * nama + catatan jujur apa yang kanal itu lakukan di Repica.
 */
const INTEGRATIONS = [
    {
        icon: MessageCircle,
        tone: 'bg-brand-tint text-action',
        label: 'WhatsApp Business',
        note: 'OTP & notifikasi via Meta Cloud API',
    },
    {
        icon: Banknote,
        tone: 'bg-violet-tint text-action',
        label: 'Xendit',
        note: 'Pay link di setiap invoice',
    },
    {
        icon: QrCode,
        tone: 'bg-mint-tint text-action',
        label: 'QRIS',
        note: 'Bayar langganan sekali scan',
    },
    {
        icon: Landmark,
        tone: 'bg-rose-tint text-action',
        label: 'Virtual Account',
        note: 'Transfer terverifikasi otomatis',
    },
    {
        icon: Wallet,
        tone: 'bg-amber-tint text-action',
        label: 'E-wallet',
        note: 'OVO · GoPay · Dana',
    },
    {
        icon: Smartphone,
        tone: 'bg-brand-foam text-ink',
        label: 'SMS fallback',
        note: 'Untuk nomor tanpa WhatsApp',
    },
] as const;

/**
 * Band Integrasi — sachet kanal di rak biru tipis (dunia Sachet Pop).
 *
 * Bukan hero logo: satu baris chip yang mengakui apa yang sudah terhubung,
 * dengan catatan fungsi tiap kanal. Chip non-aktif tidak punya hover mati —
 * satu-satunya gerak adalah elevasi, tanpa perubahan warna yang tidak
 * bermakna.
 */
export default function MarketingIntegrations() {
    return (
        <section
            id="integrasi"
            className="bg-brand-foam scroll-mt-20 border-y border-line py-20 sm:py-24"
        >
            <Container>
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <SectionHeading
                        index="04"
                        eyebrow="Integrasi"
                        title="Terhubung dengan yang sudah Anda pakai"
                        description="Tidak ada aplikasi baru untuk dipelajari — kanal pembayaran dan pesan ini bekerja di dalam alur Repica."
                    />
                    <Badge
                        variant="secondary"
                        className="bg-sheet text-action w-fit self-start border border-brand-edge px-3 py-1.5 text-xs font-bold md:self-auto"
                    >
                        Semua aktif hari ini
                    </Badge>
                </div>

                <ul
                    className="mt-12 grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-3"
                    aria-label="Kanal yang terintegrasi"
                >
                    {INTEGRATIONS.map(({ icon: Icon, tone, label, note }) => (
                        <li
                            key={label}
                            data-welcome-surface
                            className="bg-sheet border-line hover:shadow-pop flex min-h-11 items-center gap-3 rounded-[var(--radius-sachet)] border p-4 transition-shadow duration-200"
                        >
                            <span
                                className={cn(
                                    'flex size-11 shrink-0 items-center justify-center rounded-xl',
                                    tone,
                                )}
                            >
                                <Icon className="size-5" aria-hidden="true" />
                            </span>
                            <div className="min-w-0">
                                <p className="text-ink text-sm font-extrabold">
                                    {label}
                                </p>
                                <p className="text-ink-soft text-xs font-medium">{note}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </Container>
        </section>
    );
}
