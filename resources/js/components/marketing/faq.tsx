import { ChevronDown } from 'lucide-react';

import { Container, SectionHeading } from '@/components/marketing/layout';
import { cn } from '@/lib/utils';

/**
 * FAQ dengan disclosure native (`<details>`/`<summary>`) — jawaban sudah ada
 * di DOM (bisa dicari Ctrl+F), screen-reader friendly tanpa JavaScript, dan
 * tanpa primitive accordion baru (Rules.md: primitive hanya lewat shadcn CLI).
 * Versi sachet: tiap pertanyaan adalah kemasan kecil bersobekan; membuka =
 * sobek sachet-nya.
 *
 * Semua pertanyaan menjawab keberatan nyata pembeli dari PRD §1/§5 + keputusan
 * DECISIONS.md (bukan interview marketing); maksimal 8 item. Indikator buka/
 * tutup memakai ikon + rotasi (bukan hanya warna), teks tetap `text-ink` AA.
 */
export default function MarketingFaq() {
    return (
        <section id="faq" className="bg-ground scroll-mt-20 border-t border-line py-20 sm:py-24">
            <Container>
                <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
                    <SectionHeading
                        index="06"
                        eyebrow="FAQ"
                        title="Pertanyaan yang benar-benar ditanyakan pemilik laundry"
                        description="Jawaban langsung dari spesifikasi produk, bukan klaim pemasaran. Ada yang belum terjawab? Buka WhatsApp kami di bawah halaman."
                    />

                    <ul className="flex max-w-2xl flex-col gap-3">
                        {FAQS.map(({ question, answer }, index) => (
                            <li key={question}>
                                <details
                                    className={cn(
                                        'bg-sheet border-line group rounded-[var(--radius-sachet)] border-2 transition-shadow duration-200',
                                        'open:shadow-pop',
                                    )}
                                >
                                    <summary
                                        className={cn(
                                            'flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-5 py-4',
                                            'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ground rounded-[calc(var(--radius-sachet)-2px)]',
                                            '[&::-webkit-details-marker]:hidden',
                                        )}
                                    >
                                        <span className="text-ink text-sm font-bold sm:text-base">
                                            {question}
                                        </span>
                                        <span
                                            aria-hidden="true"
                                            className="bg-brand-tint text-action flex size-7 shrink-0 items-center justify-center rounded-full transition-transform duration-200 group-open:rotate-180"
                                        >
                                            <ChevronDown className="size-4" />
                                        </span>
                                    </summary>
                                    <p
                                        id={`faq-${index}-content`}
                                        className="text-ink-soft border-line mx-5 mb-5 border-t pt-4 text-sm leading-relaxed font-medium"
                                    >
                                        {answer}
                                    </p>
                                </details>
                            </li>
                        ))}
                    </ul>
                </div>
            </Container>
        </section>
    );
}

/** Konten produk-true dari PRD §1/§5 + DECISIONS.md — tanpa klaim rekaan. */
const FAQS: Array<{ question: string; answer: string }> = [
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
        question: 'Apakah bisa order selama trial?',
        answer: 'Ya — trial 14 hari bisa membuat order dengan cap 30 order. Yang diblokir hanyalah tenant yang belum bayar pasca-trial.',
    },
    {
        question: 'Bagaimana sengketa baju rusak dihindari?',
        answer: 'Foto kondisi awal berwatermark + persetujuan WhatsApp + jejak audit per aksi: owner punya pembelaan berbasis bukti, bukan ingatan bersama.',
    },
    {
        question: 'Siapa yang boleh void transaksi?',
        answer: 'Hanya peran yang diizinkan (RBAC per outlet), dan setiap aksi kritis tercatat di audit log — siapa, kapan, dari apa ke apa.',
    },
];
