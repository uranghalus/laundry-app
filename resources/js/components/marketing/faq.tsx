import { Plus } from 'lucide-react';

import { Container, SectionHeading } from '@/components/marketing/layout';

/**
 * Jawaban atas keberatan nyata pembeli dari PRD §1/§5 dan DECISIONS.md.
 *
 * Semua jawaban sudah ada di DOM lewat `<details>` — bisa dicari Ctrl+F dan
 * terbaca pembaca layar tanpa JavaScript.
 */
const FAQS = [
    {
        question: 'Berapa lama setup dari daftar sampai bisa dipakai?',
        answer: 'Di bawah 30 menit. Anda mendaftar, memilih single atau multi-outlet, mengisi 3 data outlet (nama, alamat, nomor WhatsApp), lalu memilih paket. Tidak ada instalasi apa pun — semua lewat browser di HP maupun laptop.',
    },
    {
        question: 'Kalau WhatsApp pelanggan tidak aktif, apa jadinya?',
        answer: 'Notifikasi otomatis jatuh ke SMS sebagai cadangan. Jika keduanya gagal, status tetap muncul di dashboard staf sebagai pengingat manual. Tautan persetujuan bukti kondisi hanya dikirim ke nomor yang pelanggan berikan sendiri.',
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
        question: 'Apakah bisa order selama trial?',
        answer: 'Ya — trial 14 hari bisa membuat order dengan cap 30 order. Yang diblokir hanyalah tenant yang belum bayar pasca-trial.',
    },
    {
        question: 'Bagaimana sengketa baju rusak dihindari?',
        answer: 'Foto kondisi awal + watermark + persetujuan WhatsApp; owner punya pembelaan berbasis bukti dalam jejak audit.',
    },
    {
        question: 'Siapa yang boleh void transaksi?',
        answer: 'Hanya yang punya role yang diizinkan, dan setiap aksi kritis tercatat dalam audit log (siapa, kapan, dari apa ke apa).',
    },
    {
        question: 'Bukti kondisi disimpan berapa lama?',
        answer: 'Bukti kondisi disimpan selama 12 bulan, dapat diakses kapan saja untuk pembelaan sengketa.',
    },
];

/**
 * Band `#faq` dengan disclosure native.
 *
 * Tidak ada `useState` di dalam `.map()` (pelanggaran aturan hook), tidak ada
 * `aria-expanded`/`aria-controls` yang menduplikasi perilaku bawaan
 * `<details>`, dan ikon plus hanya berputar — teks pertanyaan tetap menjadi
 * satu-satunya pembawa makna.
 *
 * @param items - Daftar pasangan pertanyaan/jawaban (opsional).
 */
export default function MarketingFaq({
    items = FAQS,
}: {
    items?: Array<{ question: string; answer: string }>;
}) {
    return (
        <section
            id="faq"
            aria-label="Pertanyaan yang sering diajukan"
            className="border-border scroll-mt-20 border-t"
        >
            <Container className="py-16 sm:py-24">
                <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-16">
                    <SectionHeading
                        index="07"
                        eyebrow="FAQ"
                        title="Yang biasanya ditanyakan sebelum mulai"
                        description="Jawaban langsung dari spesifikasi produk, bukan klaim pemasaran. Ada yang belum terjawab? Buka WhatsApp kami di bagian bawah halaman."
                    />

                    <div className="border-border divide-border divide-y border-y">
                        {items.map(({ question, answer }) => (
                            <details key={question} className="group">
                                <summary className="focus-visible:ring-ring -mx-2 flex cursor-pointer list-none items-start justify-between gap-4 rounded-lg px-2 py-4 focus-visible:ring-2 focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
                                    <span className="text-ink text-sm font-semibold tracking-[-0.01em] sm:text-base">
                                        {question}
                                    </span>
                                    <Plus
                                        className="text-link mt-0.5 size-4 shrink-0 transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
                                        aria-hidden="true"
                                    />
                                </summary>
                                <p className="text-ink-soft pr-8 pb-5 text-sm leading-relaxed">
                                    {answer}
                                </p>
                            </details>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    );
}
