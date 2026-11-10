import { useEffect, useRef } from 'react';

import { Plus } from 'lucide-react';

import { Container, SectionHeading } from '@/components/marketing/layout';
import { hasWhatsAppContact, siteConfig } from '@/lib/site';
import { cn } from '@/lib/utils';

/** Konten produk-true dari PRD §1/§5 + DECISIONS.md — tanpa klaim rekaan. */
export const FAQS: ReadonlyArray<{ question: string; answer: string }> = [
    {
        question: 'Berapa lama setup dari daftar sampai bisa dipakai?',
        answer: 'Di bawah 30 menit. Anda mendaftar, memilih single atau multi-outlet, mengisi 3 data outlet (nama, alamat, nomor WhatsApp), lalu memilih paket. Tidak ada instalasi apa pun — semua lewat browser di HP maupun laptop.',
    },
    {
        question: 'Kalau WhatsApp pelanggan tidak aktif, apa jadinya?',
        answer: 'Notifikasi otomatis jatuh ke SMS sebagai cadangan. Jika keduanya gagal, status tetap muncul di dashboard staff sebagai pengingat manual. Tautan persetujuan bukti kondisi hanya dikirim ke nomor yang pelanggan berikan sendiri.',
    },
    {
        question: 'Apakah data laundry saya bisa dibaca laundry lain?',
        answer: 'Tidak. Setiap bisnis adalah tenant terpisah dengan isolasi data di tingkat database. Kasir Outlet A tidak bisa menyentuh data Outlet B — validasinya di backend, bukan sekadar disembunyikan di menu.',
    },
    {
        question: 'Kenapa tidak ada tagihan otomatis via kartu kredit?',
        answer: 'Kartu kredit sering gagal ditagih di Indonesia, dan setiap kegagalan berubah menjadi tiket support. Kami kirim invoice dengan tautan pembayaran (VA, QRIS, e-wallet) plus pengingat 3 hari sebelum jatuh tempo. Langganan lewat masa aktif tidak langsung dimatikan — data tetap terbaca dan order berjalan selesai.',
    },
    {
        question: 'Apakah bisa membuat order selama trial?',
        answer: 'Ya — trial 14 hari bisa membuat order dengan cap 30 order. Yang diblokir hanyalah tenant yang belum membayar setelah masa trial berakhir.',
    },
    {
        question: 'Bagaimana sengketa baju rusak dihindari?',
        answer: 'Foto kondisi awal berwatermark + persetujuan pelanggan lewat WhatsApp + jejak audit per aksi. Pemilik punya pembelaan berbasis catatan, bukan ingatan bersama.',
    },
    {
        question: 'Siapa yang boleh membatalkan transaksi?',
        answer: 'Hanya peran yang diizinkan (RBAC per outlet). Setiap aksi kritis tercatat di audit log — siapa, kapan, dan dari nilai apa ke nilai apa.',
    },
];

/**
 * Band FAQ — disclosure native `<details>` tanpa primitive accordion baru.
 *
 * Jawaban sudah ada di DOM sehingga bisa dicari dengan Ctrl+F dan tetap
 * terbaca tanpa JavaScript. Item pertama dibuka sekali saat mount sebagai
 * petunjuk bahwa baris-baris ini dapat dibuka.
 */
export default function MarketingFaq() {
    const firstItemRef = useRef<HTMLDetailsElement>(null);
    const hasContact = hasWhatsAppContact();

    useEffect(() => {
        if (firstItemRef.current) {
            firstItemRef.current.open = true;
        }
    }, []);

    return (
        <section
            id="faq"
            aria-labelledby="faq-title"
            className="bg-sheet border-line scroll-mt-24 border-y py-20 sm:py-24"
        >
            <Container>
                <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
                    <div className="lg:col-span-5">
                        <SectionHeading
                            id="faq-title"
                            title="Pertanyaan yang benar-benar ditanyakan pemilik laundry."
                            description="Jawaban diambil dari spesifikasi produk, bukan dari klaim pemasaran."
                        />

                        {hasContact ? (
                            <p className="text-ink-soft mt-6 text-sm leading-relaxed font-medium">
                                Ada yang belum terjawab?{' '}
                                <a
                                    href={siteConfig.whatsappUrl ?? undefined}
                                    className="text-action-text font-bold underline underline-offset-4"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Buka WhatsApp kami
                                </a>
                                .
                            </p>
                        ) : null}
                    </div>

                    <div className="lg:col-span-7">
                        <div className="border-ink border-t-2">
                            {FAQS.map((item, index) => (
                                <details
                                    key={item.question}
                                    ref={index === 0 ? firstItemRef : undefined}
                                    className={cn(
                                        'border-line group border-b transition-colors',
                                        'open:bg-paper',
                                    )}
                                >
                                    <summary
                                        className={cn(
                                            'flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-1 py-4 sm:px-3',
                                            'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset',
                                            '[&::-webkit-details-marker]:hidden',
                                        )}
                                    >
                                        <span className="text-ink text-base leading-snug font-bold">
                                            {item.question}
                                        </span>
                                        <span
                                            aria-hidden="true"
                                            className="border-line text-ink-soft group-open:border-action group-open:text-action-text flex size-8 shrink-0 items-center justify-center rounded-sm border transition-colors"
                                        >
                                            <Plus className="size-4 transition-transform duration-200 group-open:rotate-45" />
                                        </span>
                                    </summary>
                                    <p className="text-ink-soft max-w-[68ch] px-1 pb-5 text-sm leading-relaxed font-medium sm:px-3">
                                        {item.answer}
                                    </p>
                                </details>
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
