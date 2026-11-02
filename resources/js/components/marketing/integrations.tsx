import {
    Banknote,
    Landmark,
    MessageCircle,
    QrCode,
    Smartphone,
    Wallet,
} from 'lucide-react';

import { Container, SectionHeading } from '@/components/marketing/layout';

/**
 * Kanal yang benar-benar terhubung — bukan grid logo kosmetik.
 *
 * Semua item berasal dari keputusan PRD: Meta WhatsApp Cloud API untuk
 * notifikasi dan persetujuan, Xendit untuk tautan pembayaran, serta SMS
 * sebagai cadangan bila nomor pelanggan tidak punya WhatsApp.
 */
const INTEGRATIONS = [
    {
        icon: MessageCircle,
        label: 'WhatsApp Business',
        note: 'Meta Cloud API',
    },
    {
        icon: Banknote,
        label: 'Xendit',
        note: 'Tautan pembayaran',
    },
    {
        icon: QrCode,
        label: 'QRIS',
        note: 'Bayar langganan',
    },
    {
        icon: Landmark,
        label: 'Virtual Account',
        note: 'Transfer terverifikasi',
    },
    {
        icon: Wallet,
        label: 'E-wallet',
        note: 'OVO · GoPay · Dana',
    },
    {
        icon: Smartphone,
        label: 'SMS cadangan',
        note: 'Bila nomor tanpa WA',
    },
] as const;

/**
 * Band integrasi di atas harga.
 *
 * Latar `bg-band` membungkus seluruh isi (judul dan daftar kanal) — versi
 * sebelumnya meninggalkan `<div>` berwarna kosong sehingga teks jatuh di
 * luar bidang. Daftar kanal disusun sebagai tabel garis rambut dua kolom
 * agar terbaca seperti inventaris, bukan kumpulan badge.
 */
export default function MarketingIntegrations() {
    return (
        <section
            aria-label="Integrasi dan kanal pembayaran"
            className="border-border bg-band border-y"
        >
            <Container className="py-16 sm:py-24">
                <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-16">
                    <SectionHeading
                        index="05"
                        eyebrow="Integrasi"
                        title="Terhubung dengan yang sudah Anda pakai"
                        description="Tidak ada aplikasi baru untuk dipelajari. Konfirmasi pelanggan lewat WhatsApp, pembayaran lewat kanal yang sudah dikenal, semuanya masuk ke alur kerja Repica."
                    />

                    <ul className="border-border bg-border grid gap-px overflow-hidden rounded-xl border sm:grid-cols-2">
                        {INTEGRATIONS.map((item) => (
                            <li
                                key={item.label}
                                className="bg-background flex items-start gap-3 p-4"
                            >
                                <span className="border-border bg-card text-link flex size-9 shrink-0 items-center justify-center rounded-lg border">
                                    <item.icon
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                </span>
                                <span className="min-w-0">
                                    <span className="text-ink block text-sm font-semibold tracking-[-0.01em]">
                                        {item.label}
                                    </span>
                                    <span className="text-ink-soft mt-0.5 block text-xs leading-relaxed">
                                        {item.note}
                                    </span>
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </Container>
        </section>
    );
}
