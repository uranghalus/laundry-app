/**
 * FAQ dengan disclosure native.
 *
 * Sengaja memakai `<details>`/`<summary>` + kelas animasi `tw-animate-css`
 * (sudah ada di proyek), bukan primitif accordion baru: tetap dapat diakses
 * keyboard dan screen reader tanpa JavaScript, tanpa menambah dependency
 * (Rules.md — primitive hanya lewat shadcn CLI).
 */
const FAQS = [
    {
        question: 'Berapa lama setup dari daftar sampai bisa dipakai?',
        answer: 'Di bawah 30 menit. Anda mendaftar, memilih single atau multi-outlet, mengisi 3 data outlet (nama, alamat, nomor WhatsApp), lalu memilih paket. Tidak ada instalasi apa pun — semua lewat browser di HP maupun laptop.',
    },
    {
        question: 'Kalau WhatsApp pelanggan tidak aktif, apa jadinya?',
        answer: 'Notifikasi otomatis jatuh ke SMS sebagai cadangan. Jika keduanya gagal, status tetap muncul di dashboard staff sebagai pengingat manual. Link approval bukti kondisi hanya dikirim ke nomor yang pelanggan berikan sendiri.',
    },
    {
        question: 'Apakah data laundry saya bisa dibaca laundry lain?',
        answer: 'Tidak. Setiap bisnis adalah tenant terpisah dengan isolasi data di tingkat database. Kasir Outlet A tidak bisa menyentuh data Outlet B — validasinya di backend, bukan sekadar disembunyikan di menu.',
    },
    {
        question: 'Kenapa tidak ada tagihan otomatis via kartu kredit?',
        answer: 'Kartu kredit sering gagal ditagih di Indonesia, dan setiap kegagalan berubah menjadi tiket support. Kami kirim invoice dengan tautan pembayaran (VA, QRIS, e-wallet) plus pengingat 3 hari sebelum jatuh tempo. Langganan lewat masa aktif tidak langsung dimatikan — data tetap terbaca, order berjalan selesai.',
    },
    {
        question: 'Kalau ada staff yang curang, bisa ketahuan?',
        answer: 'Ya. Semua tindakan kritis — ubah harga, void transaksi, rollback status, hapus order — tercatat lengkap dengan siapa, kapan, dan nilai sebelum/sesudahnya, terlihat langsung di detail order. Deteksi anomali otomatis menyusul di rilis berikutnya, tetapi jejaknya sudah ada sejak hari pertama.',
    },
    {
        question: 'Apakah ada aplikasi terpisah untuk pelanggan?',
        answer: 'Tidak perlu. Pelanggan berinteraksi lewat WhatsApp — yang memang sudah mereka pakai sehari-hari. Satu-satunya halaman web tanpa login adalah halaman persetujuan bukti kondisi, dan halaman itu memenuhi standar aksesibilitas yang sama dengan aplikasi.',
    },
] as const;

/**
 * Bagian FAQ — menutup keraguan tepat sebelum keputusan, dengan jawaban yang
 * menyebut mekanisme nyata (fallback SMS, isolasi per-tenant, invoice H-3).
 */
export default function MarketingFaq() {
    return (
        <section className="scroll-mt-20 border-t" id="faq">
            <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
                <h2 className="text-display-3 text-center font-bold tracking-[-0.03em] text-balance">
                    Pertanyaan yang sering muncul
                </h2>

                <div className="divide-border mt-10 divide-y border-y">
                    {FAQS.map((faq) => (
                        <details className="group" key={faq.question}>
                            <summary className="focus-visible:ring-brand-700 dark:focus-visible:ring-brand-50 hover:text-brand-700 dark:hover:text-brand-50 flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none">
                                {faq.question}
                                <span
                                    aria-hidden="true"
                                    className="text-muted-foreground shrink-0 text-xl leading-none transition-transform duration-300 group-open:rotate-45"
                                >
                                    +
                                </span>
                            </summary>
                            <div className="animate-in fade-in-0 slide-in-from-top-1 duration-300">
                                <p className="text-muted-foreground pb-5 text-sm leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}
