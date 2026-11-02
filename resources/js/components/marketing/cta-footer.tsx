import { Link } from '@inertiajs/react';
import { ArrowRight, MessageCircle } from 'lucide-react';

import CountUp from '@/components/marketing/count-up';
import { Container, Eyebrow } from '@/components/marketing/layout';
import RepicaMark, { RepicaWordmark } from '@/components/marketing/repica-mark';
import { dashboard, register } from '@/routes';

/**
 * Nomor WhatsApp bisnis untuk jalur kedua (Persona B / non-teknis).
 *
 * TODO: ganti dengan nomor produksi sebelum rilis. Nilai ini masih contoh
 * dan tidak boleh dipakai di kampanye nyata.
 */
export const WHATSAPP_URL = 'https://wa.me/6281234567890';

/**
 * Fakta penutup yang bisa dibela — bukan traction rekaan.
 *
 * Semua angka berasal dari spesifikasi: setup di bawah 30 menit, enam tahap
 * pipeline, seluruh aksi kritis tercatat, dan bukti kondisi disimpan 12
 * bulan.
 */
const FACTS = [
    {
        to: 30,
        prefix: '< ',
        suffix: ' menit',
        label: 'sampai order pertama',
    },
    {
        to: 6,
        prefix: '',
        suffix: '',
        label: 'tahap terpantau',
    },
    {
        to: 100,
        prefix: '',
        suffix: '%',
        label: 'aksi kritis tercatat',
    },
    {
        to: 12,
        prefix: '',
        suffix: ' bulan',
        label: 'bukti kondisi tersimpan',
    },
];

/**
 * Band CTA penutup + footer.
 *
 * Ini momen navy penuh kedua (setelah band pipeline): seluruh isi CTA berada
 * di dalam bidang navy, bukan teks putih di atas latar putih seperti versi
 * sebelumnya. Dua aksi disediakan — daftar sebagai jalur utama, WhatsApp
 * sebagai jalur manusia.
 *
 * @param isAuthenticated - Jika true, CTA utama menuju dashboard.
 */
export default function MarketingCtaFooter({
    isAuthenticated = false,
}: {
    isAuthenticated?: boolean;
}) {
    return (
        <footer>
            <section
                aria-labelledby="cta-heading"
                className="bg-navy"
                data-band="closing"
            >
                <Container className="py-16 sm:py-24">
                    <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
                        <div>
                            <Eyebrow index="08" tone="dark">
                                Mulai
                            </Eyebrow>

                            <h2
                                id="cta-heading"
                                className="mt-5 text-3xl font-bold tracking-[-0.03em] text-balance text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.05]"
                            >
                                Mulai dengan bukti, bukan keberanian.
                            </h2>

                            <p className="mt-5 max-w-md text-base leading-relaxed text-white/70">
                                Trial 14 hari membuka seluruh alur: order, bukti
                                kondisi, persetujuan WhatsApp, dan kas harian.
                                Tanpa kartu kredit.
                            </p>

                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href={
                                        isAuthenticated
                                            ? dashboard()
                                            : register()
                                    }
                                    className="text-navy focus-visible:ring-brand-500 hover:bg-brand-50 focus-visible:ring-offset-navy inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-white px-6 text-sm font-semibold transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2"
                                >
                                    {isAuthenticated
                                        ? 'Buka dashboard'
                                        : 'Mulai trial 14 hari'}
                                    <ArrowRight
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                </Link>

                                <a
                                    href={WHATSAPP_URL}
                                    rel="noopener noreferrer"
                                    target="_blank"
                                    className="focus-visible:ring-brand-500 focus-visible:ring-offset-navy inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/30 px-6 text-sm font-semibold text-white transition-colors duration-200 hover:border-white/60 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-offset-2"
                                >
                                    <MessageCircle
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                    Hubungi via WhatsApp
                                </a>
                            </div>

                            <p className="mt-5 text-xs leading-relaxed text-white/55 tabular-nums">
                                Trial 14 hari · Tanpa kartu kredit · Cap 30
                                order · Batalkan kapan saja
                            </p>
                        </div>

                        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/15 bg-white/15">
                            {FACTS.map((fact) => (
                                <div
                                    key={fact.label}
                                    className="bg-navy flex flex-col p-5 sm:p-6"
                                >
                                    <dt className="order-2 mt-1 text-xs leading-relaxed text-white/60">
                                        {fact.label}
                                    </dt>
                                    <dd className="order-1 text-2xl font-bold tracking-[-0.02em] text-white tabular-nums sm:text-3xl">
                                        <CountUp
                                            to={fact.to}
                                            prefix={fact.prefix}
                                            suffix={fact.suffix}
                                            separator="."
                                        />
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </Container>
            </section>

            <div className="border-border bg-background border-t">
                <Container className="flex flex-col items-start justify-between gap-4 py-8 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-2.5">
                        <RepicaMark className="text-brand-600 dark:text-brand-500 size-6" />
                        <RepicaWordmark
                            showDescription={false}
                            className="text-ink text-sm font-bold"
                        />
                        <span className="text-ink-soft text-xs">
                            Manajemen laundry dengan bukti kondisi
                        </span>
                    </div>

                    <p className="text-ink-soft text-xs leading-relaxed tabular-nums">
                        © {new Date().getFullYear()} Repica. Semua hak
                        dilindungi.
                    </p>
                </Container>
            </div>
        </footer>
    );
}
