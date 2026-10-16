import { Link } from '@inertiajs/react';
import { MessageCircle } from 'lucide-react';

import CountUp from '@/components/marketing/count-up';
import RepicaMark, { RepicaWordmark } from '@/components/marketing/repica-mark';
import { Button } from '@/components/ui/button';
import { login, register } from '@/routes';

/** Nomor WhatsApp bisnis untuk jalur kedua (Persona B / non-teknis). */
export const WHATSAPP_URL = 'https://wa.me/6281234567890';

/**
 * Counter penutup — fakta produk yang bisa dibela, bukan traction rekaan.
 *
 * Semua angka bersumber dari spesifikasi: G1 (setup <30 menit), 6 status
 * pipeline FR-6.2, audit trail FR-3.4 (100% aksi kritis), retensi bukti
 * DECISIONS Q6 (12 bulan). Dianimasikan sekali saat masuk viewport (CountUp).
 */
const FACTS = [
    {
        to: 30,
        prefix: '< ',
        suffix: ' menit',
        label: 'setup sampai order pertama',
    },
    { to: 6, prefix: '', suffix: '', label: 'status terpantau otomatis' },
    { to: 100, prefix: '', suffix: '%', label: 'aksi kritis tercatat' },
    { to: 12, prefix: '', suffix: ' bulan', label: 'bukti kondisi tersimpan' },
];

/**
 * Band CTA penutup yang drenched teal + footer.
 *
 * Ini satu-satunya bagian halaman yang "sepenuhnya berwarna" — momen klimaks
 * setelah seluruh argumen dibaca. Angka counter menghitung naik sekali; dua
 * aksi: daftar (primer) atau WhatsApp (sekunder).
 */
export default function MarketingCtaFooter() {
    return (
        <footer>
            <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
                <div className="from-brand-700 dark:from-brand-900 rounded-card to-brand-900 relative overflow-hidden bg-gradient-to-br px-6 py-14 text-center sm:px-12 sm:py-20 dark:to-stone-950">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -top-20 left-1/2 size-[28rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.12),transparent)]"
                    />

                    <div className="relative">
                        <h2 className="text-display-2 font-bold tracking-[-0.03em] text-balance text-white">
                            Mulai 14 hari, tanpa kartu kredit
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-teal-50/90">
                            Semua fitur Pro aktif selama percobaan, maksimal 30
                            order — cukup untuk merasakan alur laundry harian
                            Anda tanpa risiko.
                        </p>

                        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                            <Button
                                asChild
                                className="text-brand-900 size-12 border-white bg-white px-6 hover:bg-teal-50"
                                size="lg"
                            >
                                <Link href={register()}>Daftar Sekarang</Link>
                            </Button>
                            <Button
                                asChild
                                className="size-12 border-white/40 px-6 text-white hover:bg-white/10 hover:text-white"
                                size="lg"
                                variant="outline"
                            >
                                <a
                                    href={WHATSAPP_URL}
                                    rel="noopener noreferrer"
                                    target="_blank"
                                >
                                    <MessageCircle className="mr-2 size-4" />
                                    Tanya dulu via WhatsApp
                                </a>
                            </Button>
                        </div>

                        <dl className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-8 border-t border-white/15 pt-10 lg:grid-cols-4">
                            {FACTS.map((fact) => (
                                <div key={fact.label}>
                                    <dd
                                        className="text-3xl font-bold tracking-tight text-white tabular-nums"
                                        data-numeric
                                    >
                                        <CountUp
                                            prefix={fact.prefix}
                                            suffix={fact.suffix}
                                            to={fact.to}
                                        />
                                    </dd>
                                    <dt className="mt-1.5 text-sm text-teal-50/80">
                                        {fact.label}
                                    </dt>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
                <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <div className="text-brand-700 dark:text-brand-50 flex items-center gap-2">
                            <RepicaMark className="size-6" />
                            <RepicaWordmark
                                className="text-foreground"
                                showDescription={false}
                            />
                        </div>
                        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                            Platform operasional laundry dengan bukti kondisi —
                            dibuat untuk pemilik laundry di Indonesia.
                        </p>
                    </div>

                    <nav aria-label="Jelajah halaman">
                        <h3 className="text-sm font-semibold">Jelajah</h3>
                        <ul className="mt-3 space-y-2 text-sm">
                            {[
                                { href: '#fitur', label: 'Fitur' },
                                { href: '#alur', label: 'Alur kerja' },
                                { href: '#harga', label: 'Harga' },
                                { href: '#faq', label: 'FAQ' },
                            ].map((link) => (
                                <li key={link.href}>
                                    <a
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                        href={link.href}
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <nav aria-label="Akun">
                        <h3 className="text-sm font-semibold">Akun</h3>
                        <ul className="mt-3 space-y-2 text-sm">
                            <li>
                                <Link
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                    href={register()}
                                >
                                    Daftar
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                    href={login()}
                                >
                                    Masuk
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    <div>
                        <h3 className="text-sm font-semibold">Kontak</h3>
                        <a
                            className="text-muted-foreground hover:text-foreground mt-3 inline-flex items-center gap-2 text-sm transition-colors"
                            href={WHATSAPP_URL}
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            <MessageCircle className="size-4" />
                            WhatsApp bisnis
                        </a>
                    </div>
                </div>

                <div className="text-muted-foreground flex flex-col items-center justify-between gap-3 border-t py-6 text-xs sm:flex-row">
                    <p>© 2026 Repica. Seluruh hak cipta.</p>
                    <p lang="id">
                        Dibuat di Indonesia, untuk laundry Indonesia.
                    </p>
                </div>
            </div>
        </footer>
    );
}
