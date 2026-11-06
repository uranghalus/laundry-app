import { Banknote, Scale, Timer, Users } from 'lucide-react';

import { SectionHeading, Container } from '@/components/marketing/layout';
import { cn } from '@/lib/utils';

/**
 * Empat sachet masalah operasional — bahan bakar band Audience (brief v4:
 * "menyapu empat sachet masalah operasional").
 *
 * Setiap sachet = satu sakit nyata pemilik laundry (PRD §2) yang dijawab
 * Repica. Aksen warna pastel (violet / mint / rose / amber) HANYA sebagai
 * chip dan tint kemasan — bukan teks di bidang terang — mengikuti aturan
 * ground Sachet Pop. Kartu punya target sentuh ≥44px lewat padding.
 */
const SACHETS = [
    {
        icon: Banknote,
        tone: 'violet',
        title: 'Uang kas tidak pernah pas',
        problem:
            'Setoran akhir hari selisih, dan tidak ada yang bisa menunjuk di transaksi mana.',
        answer: 'Setiap invoice terkunci angka — rekap kas per outlet, per hari.',
    },
    {
        icon: Scale,
        tone: 'rose',
        title: 'Sengketa baju rusak',
        problem:
            'Kata pelanggan vs kata staff. Tidak ada foto, tidak ada jejak, yang tersisa komplain.',
        answer: 'Foto kondisi berwatermark + cap waktu + jejak audit tiap aksi.',
    },
    {
        icon: Timer,
        tone: 'amber',
        title: 'Order menumpuk tanpa urutan',
        problem:
            'Antrean cucian dihitung dengan kepala — mana duluan, mana nearing telat, tidak kelihatan.',
        answer: 'Pipeline status dengan durasi terukur per tahap, bukan sekadar warna.',
    },
    {
        icon: Users,
        tone: 'mint',
        title: 'Staff kerja tanpa batas akses',
        problem:
            'Satu akun dipakai bersama; harga modal terlihat semua orang; tidak ada yang bertanggung jawab.',
        answer: 'Akses per peran dan per outlet — tiap perubahan tercatat siapa dan kapan.',
    },
] as const;

/**
 * Peta tone → kelas token (chip aksen + border kemasan). Dikelola lewat
 * record literal supaya tidak ada hex polos dan kelas tetap terdeteksi JIT.
 */
const TONES = {
    violet: {
        chip: 'bg-violet-tint',
        edge: 'border-violet/35',
        glow: 'bg-violet/10',
    },
    rose: {
        chip: 'bg-rose-tint',
        edge: 'border-rose/35',
        glow: 'bg-rose/10',
    },
    amber: {
        chip: 'bg-amber-tint',
        edge: 'border-amber/40',
        glow: 'bg-amber/10',
    },
    mint: {
        chip: 'bg-mint-tint',
        edge: 'border-mint/35',
        glow: 'bg-mint/10',
    },
} as const;

/**
 * Band Audience — "Empat sachet masalah di rak laundry Anda".
 *
 * Komposisi: heading bernomor + grid 2x2 (1 kolom di mobile) sachet masalah.
 * Bahasa bentuk: radius sachet, bibir sobekan `edge-tear-t` di kepala kartu
 * (maskot garis, bukan isi), garis keras `border-2` seperti kemasan.
 */
export default function MarketingAudienceStrip() {
    return (
        <section
            id="audiens"
            className="bg-ground scroll-mt-20 border-t border-line py-20 sm:py-24"
        >
            <Container>
                <SectionHeading
                    index="01"
                    eyebrow="Untuk siapa"
                    title="Empat sachet masalah yang ada di rak Anda"
                    description="Repica dirancang dari keluhan pemilik laundry yang paling sering berulang — bukan dari daftar fitur yang enak dibaca."
                />

                <ul
                    className="mt-12 grid list-none gap-5 sm:grid-cols-2"
                    aria-label="Empat masalah operasional yang dijawab Repica"
                >
                    {SACHETS.map(({ icon: Icon, tone, title, problem, answer }) => (
                        <li
                            key={title}
                            className={cn(
                                'bg-sheet edge-tear-t relative overflow-hidden border-2 rounded-[var(--radius-sachet)] p-6 pt-8 shadow-card transition-transform duration-200 hover:-translate-y-1',
                                TONES[tone].edge,
                            )}
                        >
                            {/* Percikan warna kemasan — dekorasi, aria-hidden. */}
                            <span
                                aria-hidden="true"
                                className={cn(
                                    'absolute -top-10 -right-10 size-32 rounded-full blur-2xl',
                                    TONES[tone].glow,
                                )}
                            />
                            <div className="relative flex flex-col gap-3">
                                <span
                                    className={cn(
                                        'text-ink inline-flex size-11 items-center justify-center rounded-xl',
                                        TONES[tone].chip,
                                    )}
                                >
                                    <Icon className="size-5" aria-hidden="true" />
                                </span>
                                <h3 className="text-display-card font-display text-ink font-extrabold">
                                    {title}
                                </h3>
                                <p className="text-ink-soft text-sm leading-relaxed font-medium">
                                    {problem}
                                </p>
                                <p
                                    className={cn(
                                        'text-ink border-t-2 pt-3 text-sm font-bold',
                                        TONES[tone].edge,
                                    )}
                                >
                                    {answer}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            </Container>
        </section>
    );
}
