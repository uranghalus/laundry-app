import {
    ArrowRight,
    Banknote,
    BookOpen,
    Camera,
    MessageCircle,
} from 'lucide-react';

import {
    Container,
    MetaLabel,
    SectionHeading,
} from '@/components/marketing/layout';
import FadeContent from '@/components/react-bits/fade-content';

/**
 * Empat masalah operasional yang dijawab Repica, diambil dari keluhan pemilik
 * laundry di PRD §2. Setiap baris memasangkan masalah dengan bagian produk
 * yang menanganinya — tanpa angka kerugian yang direka.
 */
const PROBLEMS = [
    {
        icon: Banknote,
        title: 'Uang kas tidak pernah pas',
        problem:
            'Setoran akhir hari selisih, dan tidak ada yang bisa menunjuk transaksi mana yang salah.',
        answer: 'Setiap invoice terkunci angka. Rekap kas per outlet, per hari.',
    },
    {
        icon: Camera,
        title: 'Sengketa baju rusak',
        problem:
            'Pelanggan bilang nodanya sudah ada; kasir bilang belum. Tidak ada bukti yang bisa dibuka.',
        answer: 'Foto kondisi berstempel waktu diambil sebelum cucian masuk, lalu disetujui pelanggan.',
    },
    {
        icon: MessageCircle,
        title: 'Pelanggan menunggu tanpa kabar',
        problem:
            'Status hanya diingat kasir. Pelanggan menelepon untuk bertanya, staff meninggalkan pekerjaan.',
        answer: 'Notifikasi WhatsApp terkirim di setiap perubahan status order.',
    },
    {
        icon: BookOpen,
        title: 'Omzet hilang di buku tulis',
        problem:
            'Catatan order, deposit member, dan kas tersebar di kertas dan ingatan orang berbeda.',
        answer: 'Order, deposit, dan laporan dibaca dari satu sumber yang sama.',
    },
] as const;

/**
 * ProblemsLedger — empat baris editorial bergaris, bukan kartu seragam.
 *
 * Kolom kiri memuat masalah, kolom kanan memuat jawaban produk. Angka baris
 * adalah urutan baca buku besar, bukan kicker dekoratif.
 */
export default function ProblemsLedger() {
    return (
        <section
            aria-labelledby="masalah-title"
            className="bg-ground py-20 sm:py-24"
        >
            <Container>
                <SectionHeading
                    id="masalah-title"
                    title="Kalau tidak tercatat, tidak pernah terjadi."
                    description="Empat masalah yang paling sering muncul di laundry, dan bagian mana dari Repica yang menjawabnya."
                />

                <div className="border-ink mt-12 border-t-2">
                    <div className="border-line hidden gap-8 border-b py-3 md:grid md:grid-cols-12">
                        <MetaLabel className="md:col-span-5">
                            Yang terjadi
                        </MetaLabel>
                        <MetaLabel className="md:col-span-7">
                            Yang tercatat di Repica
                        </MetaLabel>
                    </div>

                    {PROBLEMS.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <FadeContent key={item.title} delay={index * 0.05}>
                                <article className="border-line hover:bg-sheet group grid gap-4 border-b py-8 transition-colors md:grid-cols-12 md:gap-8">
                                    <div className="md:col-span-5">
                                        <div className="flex items-start gap-4">
                                            <div className="flex shrink-0 flex-col items-center gap-2">
                                                <span className="bg-graphic-tint text-action-text flex size-11 items-center justify-center rounded-md">
                                                    <Icon
                                                        className="size-5"
                                                        aria-hidden="true"
                                                    />
                                                </span>
                                                <span className="text-ink-soft font-mono text-[11px] font-semibold tabular-nums">
                                                    0{index + 1}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="text-ink text-xl font-extrabold tracking-tight text-balance sm:text-2xl">
                                                    {item.title}
                                                </h3>
                                                <p className="text-ink-soft mt-2 text-sm leading-relaxed font-medium">
                                                    {item.problem}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:col-span-7 md:flex md:items-center md:gap-5">
                                        <ArrowRight
                                            className="text-action-text hidden size-5 shrink-0 transition-transform group-hover:translate-x-1 md:block"
                                            aria-hidden="true"
                                        />
                                        <p className="text-ink text-base leading-relaxed font-bold sm:text-lg">
                                            {item.answer}
                                        </p>
                                    </div>
                                </article>
                            </FadeContent>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
}
