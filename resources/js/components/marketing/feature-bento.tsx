import { FileText, MessageCircle, Scale, ScrollText } from 'lucide-react';

/**
 * Bento fitur — empat sel berukuran beda, masing-masing MEMBUKTIKAN satu
 * keunggulan alih-alih menampilkan ikon + judul + teks generik.
 *
 * Setiap sel mengangkat satu masalah PRD §1 ke solusi yang terlihat: sengketa →
 * foto ber-watermark, fraud → jejak audit, status → chat WA, keuangan → angka
 * harian. Baris biaya di kaki kartu memakai angka kerugian dari reasoning
 * DECISIONS.md Q9 (bukan metrik traction rekaan).
 */
const AUDIT_ROWS = [
    {
        action: 'Harga diubah',
        actor: 'Sari',
        time: '10:32',
        detail: 'Rp15.000 → Rp18.000',
    },
    {
        action: 'Status di-rollback',
        actor: 'Owner',
        time: '11:05',
        detail: 'Dicuci → Diterima',
    },
    {
        action: 'Transaksi di-void',
        actor: 'Kasir 2',
        time: '13:47',
        detail: '#RC-2391 · alasan tercatat',
    },
];

/**
 * Grid fitur halaman publik. `#fitur` ditautkan dari navigasi header.
 */
export default function FeatureBento() {
    return (
        <section className="scroll-mt-20" id="fitur">
            <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 sm:py-24">
                <div className="max-w-2xl">
                    <h2 className="text-display-3 font-bold tracking-[-0.03em] text-balance">
                        Yang membocorkan uang Anda, ditutup satu per satu
                    </h2>
                    <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
                        Software laundry yang ada menyelesaikan kasir dan nota.
                        Tiga hal yang tidak mereka sentuh — dan yang paling
                        sering menggerus margin — justru di sini.
                    </p>
                </div>

                <div className="mt-12 grid gap-5 lg:grid-cols-12">
                    {/* Sel 1 — besar: diferensiator utama, terlihat bekerja. */}
                    <article className="group bg-card rounded-card border p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-20px_rgb(12_95_89/0.35)] lg:col-span-7">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="text-xl font-semibold">
                                    Sengketa selesai sebelum dimulai
                                </h3>
                                <p className="text-muted-foreground mt-2 max-w-md text-sm leading-relaxed">
                                    Foto kondisi awal ber-watermark dikirim ke
                                    pelanggan untuk disetujui. Saat klaim
                                    datang, Anda tidak membela diri — Anda
                                    menunjukkan bukti.
                                </p>
                            </div>
                            <span className="bg-brand-50 text-brand-900 dark:bg-brand-900/40 dark:text-brand-50 flex size-11 shrink-0 items-center justify-center rounded-xl">
                                <Scale className="size-5" />
                            </span>
                        </div>

                        <div className="mt-5 flex items-end gap-4">
                            <div className="relative flex aspect-[3/4] w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-stone-200 dark:bg-stone-800">
                                <FileText className="size-8 text-stone-500 dark:text-stone-400" />
                                <span
                                    className="absolute inset-x-0 bottom-0 bg-stone-900/70 px-1 py-0.5 text-center text-[0.5rem] leading-tight text-stone-50"
                                    data-numeric
                                >
                                    12/03 14:32 · RC-2418
                                </span>
                            </div>
                            <div className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-800 dark:bg-green-950 dark:text-green-200">
                                Disetujui pelanggan · 14:38
                            </div>
                        </div>

                        <p
                            className="border-brand-50 dark:border-brand-900/40 text-brand-900 dark:text-brand-50 mt-5 border-t pt-4 text-sm font-semibold"
                            data-numeric
                        >
                            ≈ Rp50–500rb refund yang tidak perlu dibayar
                        </p>
                    </article>

                    {/* Sel 2 — jejak audit, baris nyata bukan gambar. */}
                    <article className="group bg-card rounded-card border p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-20px_rgb(28_25_23/0.3)] lg:col-span-5">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="text-xl font-semibold">
                                    Transaksi tak bisa hilang diam-diam
                                </h3>
                                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                                    Setiap aksi kritis tercatat: siapa, kapan,
                                    nilai sebelum–sesudah.
                                </p>
                            </div>
                            <span className="bg-brand-50 text-brand-900 dark:bg-brand-900/40 dark:text-brand-50 flex size-11 shrink-0 items-center justify-center rounded-xl">
                                <ScrollText className="size-5" />
                            </span>
                        </div>

                        <ul
                            className="bg-background mt-5 divide-y rounded-lg border text-xs"
                            role="list"
                        >
                            {AUDIT_ROWS.map((row) => (
                                <li
                                    className="flex items-center gap-2 px-3 py-2.5"
                                    key={row.detail}
                                >
                                    <span className="font-semibold">
                                        {row.action}
                                    </span>
                                    <span className="text-muted-foreground">
                                        · {row.actor} · {row.time}
                                    </span>
                                    <span
                                        className="text-muted-foreground ml-auto shrink-0 tabular-nums"
                                        data-numeric
                                    >
                                        {row.detail}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <p
                            className="border-brand-50 dark:border-brand-900/40 text-brand-900 dark:text-brand-50 mt-5 border-t pt-4 text-sm font-semibold"
                            data-numeric
                        >
                            ≈ Rp600rb–1,5jt/bln kebocoran yang tertutup
                        </p>
                    </article>

                    {/* Sel 3 — notifikasi WA sebagai percakapan. */}
                    <article className="group bg-card rounded-card border p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-20px_rgb(28_25_23/0.3)] lg:col-span-5">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="text-xl font-semibold">
                                    Status berubah, pelanggan langsung tahu
                                </h3>
                                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                                    Kasir satu klik; WhatsApp terkirim otomatis
                                    di tiap tahap.
                                </p>
                            </div>
                            <span className="bg-brand-50 text-brand-900 dark:bg-brand-900/40 dark:text-brand-50 flex size-11 shrink-0 items-center justify-center rounded-xl">
                                <MessageCircle className="size-5" />
                            </span>
                        </div>

                        <div className="bg-background mt-5 space-y-2 rounded-lg border p-3">
                            <p className="bg-muted text-muted-foreground rounded-md px-3 py-2 text-xs">
                                Order <span data-numeric>#RC-2418</span> dibuat
                                · estimasi Rabu
                            </p>
                            <p className="bg-brand-50 text-brand-900 dark:bg-brand-900/40 dark:text-brand-50 ml-auto w-fit rounded-md px-3 py-2 text-xs font-medium">
                                Siap Diambil — bisa dijemput hari ini ✓
                            </p>
                        </div>

                        <p className="text-muted-foreground border-border mt-5 border-t pt-4 text-sm font-medium">
                            Fallback SMS otomatis bila nomor tidak terdaftar WA
                        </p>
                    </article>

                    {/* Sel 4 — laporan dengan angka tabular. */}
                    <article className="group bg-card rounded-card border p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-20px_rgb(12_95_89/0.35)] lg:col-span-7">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="text-xl font-semibold">
                                    Uang harian terbaca dalam satu laporan
                                </h3>
                                <p className="text-muted-foreground mt-2 max-w-md text-sm leading-relaxed">
                                    Per outlet dan konsolidasi, dengan angka
                                    yang sejajar vertikal — dan export
                                    PDF/Excel.
                                </p>
                            </div>
                            <span className="bg-brand-50 text-brand-900 dark:bg-brand-900/40 dark:text-brand-50 flex size-11 shrink-0 items-center justify-center rounded-xl">
                                <FileText className="size-5" />
                            </span>
                        </div>

                        <dl className="mt-5 grid grid-cols-3 gap-3 text-center">
                            {[
                                {
                                    label: 'Pendapatan hari ini',
                                    value: 'Rp2.415.000',
                                },
                                { label: 'Order aktif', value: '37' },
                                { label: 'Siap diambil', value: '12' },
                            ].map((stat) => (
                                <div
                                    className="bg-background rounded-lg border px-2 py-3"
                                    key={stat.label}
                                >
                                    <dd
                                        className="text-lg font-bold tabular-nums"
                                        data-numeric
                                    >
                                        {stat.value}
                                    </dd>
                                    <dt className="text-muted-foreground mt-1 text-xs">
                                        {stat.label}
                                    </dt>
                                </div>
                            ))}
                        </dl>

                        <p className="text-muted-foreground border-border mt-5 border-t pt-4 text-sm font-medium">
                            Angka ilustrasi — isinya live dari data order Anda
                        </p>
                    </article>
                </div>
            </div>
        </section>
    );
}
