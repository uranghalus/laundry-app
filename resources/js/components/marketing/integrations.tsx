import {
    Banknote,
    Landmark,
    MessageCircle,
    QrCode,
    Smartphone,
    Wallet,
} from 'lucide-react';

/**
 * Band integrasi — kanal yang benar-benar terhubung, bukan grid logo kosmetik.
 *
 * Semua item di sini adalah integrasi nyata dari keputusan PRD (Meta WhatsApp
 * Cloud API untuk OTP/notifikasi/PoC, Xendit untuk pay link VA/QRIS/e-wallet,
 * SMS fallback). Nama kanal ditampilkan sebagai chip ikon + label yang jujur.
 */
const INTEGRATIONS = [
    { icon: MessageCircle, label: 'WhatsApp Business', note: 'Meta Cloud API' },
    { icon: Banknote, label: 'Xendit', note: 'Pay link invoice' },
    { icon: QrCode, label: 'QRIS', note: 'Bayar subscription' },
    {
        icon: Landmark,
        label: 'Virtual Account',
        note: 'Transfer terverifikasi',
    },
    { icon: Wallet, label: 'E-wallet', note: 'OVO · GoPay · Dana' },
    { icon: Smartphone, label: 'SMS fallback', note: 'Bila nomor tanpa WA' },
];

/**
 * Band kanal. Dipisat tipis di atas band harga supaya keputusan memilih paket
 * tidak diinterupsi.
 */
export default function MarketingIntegrations() {
    return (
        <section aria-label="Kanal terintegrasi">
            <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 sm:py-20">
                <div className="bg-brand-50 dark:bg-brand-900/20 rounded-card px-6 py-10 sm:px-12">
                    <div className="max-w-xl">
                        <h2 className="text-display-3 font-bold tracking-[-0.03em] text-balance">
                            Terhubung dengan yang sudah Anda pakai
                        </h2>
                        <p className="text-muted-foreground mt-3 leading-relaxed">
                            Tidak ada aplikasi baru untuk pelanggan — interaksi
                            lewat WhatsApp. Tidak ada kartu kredit wajib — bayar
                            lewat kanal yang biasa Anda pakai.
                        </p>
                    </div>

                    <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {INTEGRATIONS.map((item) => (
                            <li
                                className="bg-card flex items-center gap-3 rounded-xl border px-4 py-3"
                                key={item.label}
                            >
                                <span className="text-brand-700 dark:text-brand-50 bg-brand-50 dark:bg-brand-900/40 flex size-9 shrink-0 items-center justify-center rounded-lg">
                                    <item.icon className="size-4" />
                                </span>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold">
                                        {item.label}
                                    </p>
                                    <p className="text-muted-foreground truncate text-xs">
                                        {item.note}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
