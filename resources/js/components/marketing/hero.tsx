import { Link } from '@inertiajs/react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, MessageCircle } from 'lucide-react';

import HeroStage from '@/components/marketing/hero-stage';
import SplitText from '@/components/marketing/split-text';
import { Button } from '@/components/ui/button';
import { WHATSAPP_URL } from '@/components/marketing/cta-footer';
import { register } from '@/routes';

/**
 * Hero Repica — janji utama + bukti yang benar-benar bekerja.
 *
 * Mode Persuade: mekanismenya harus terlihat di detik pertama, bukan sekadar
 * diklaim. Sisi kanan karena itu bukan screenshot dashboard, melainkan
 * satu mockup kartu order statis yang memperlihatkan seluruh rantai bukti
 * sekaligus — foto berwatermark, persetujuan WhatsApp, jejak audit — di atas
 * medan partikel (ReactBits) yang tenang.
 *
 * Kolom kiri sengaja TIDAK memakai kicker atau eyebrow di atas heading: heading
 * harus membawa bobotnya sendiri. Fakta trial yang biasanya duduk di kicker
 * dipindahkan ke baris micro-fact di bawah CTA, tepat di sebelah aksi yang
 *Dijanjikan oleh baris itu.
 *
 * Geraknya satu momenlop: SplitText untuk headline, loop PoC untuk bukti.
 * Tidak ada shimmer, tidak ada gradien teks.
 *
 * @param isAuthenticated - Menentukan label CTA primer.
 */
export default function MarketingHero({
    isAuthenticated,
}: {
    isAuthenticated: boolean;
}) {
    const prefersReducedMotion = useReducedMotion() ?? false;

    return (
        <section className="relative overflow-hidden">
            {/*
             * Wash warna di belakang panggung — gradien radial, bukan lingkaran
             * pekat, supaya tepinya tidak terbaca sebagai busur keras yang
             * memotong header.
             */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 right-[-10%] hidden size-[36rem] rounded-full bg-[radial-gradient(closest-side,#e6f4f2,transparent)] lg:block dark:bg-[radial-gradient(closest-side,rgba(15,118,110,0.18),transparent)]"
            />

            <div className="relative mx-auto grid max-w-[1200px] items-center gap-12 px-4 pt-10 pb-16 sm:px-6 sm:pt-14 sm:pb-20 lg:grid-cols-12 lg:gap-8 lg:pb-20">
                <div className="lg:col-span-6">
                    <h1 className="text-[clamp(2.5rem,4.6vw,4.25rem)] leading-[1.04] font-bold tracking-[-0.03em] text-balance">
                        <SplitText delay={0.1} text="Baju rusak? Tertukar?" />{' '}
                        <SplitText
                            className="text-brand-700 dark:text-brand-50"
                            delay={0.5}
                            text="Ada buktinya."
                        />
                    </h1>

                    <p className="text-muted-foreground mt-6 max-w-lg text-lg leading-relaxed">
                        Repica memotret kondisi setiap pakaian yang masuk,
                        memberi stempel waktu, lalu meminta persetujuan
                        pelanggan lewat WhatsApp. Staff tidak bisa mengubah
                        harga atau membatalkan transaksi tanpa jejak.
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Button asChild size="lg">
                            <Link href={register()}>
                                Coba Gratis 14 Hari
                                <ArrowRight className="ml-2 size-4" />
                            </Link>
                        </Button>

                        <Button asChild size="lg" variant="outline">
                            <a
                                href={WHATSAPP_URL}
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                <MessageCircle className="mr-2 size-4" />
                                Tanya via WhatsApp
                            </a>
                        </Button>
                    </div>

                    <p className="text-muted-foreground mt-5 text-sm">
                        Data terisolasi per tenant · 1 outlet · maks. 30 order
                        selama trial
                    </p>
                </div>

                <motion.div
                    animate={
                        prefersReducedMotion ? undefined : { opacity: 1, y: 0 }
                    }
                    className="lg:col-span-6"
                    initial={
                        prefersReducedMotion ? false : { opacity: 0, y: 24 }
                    }
                    transition={{
                        duration: 0.7,
                        ease: [0.16, 1, 0.3, 1],
                        delay: 0.35,
                    }}
                >
                    <HeroStage />
                </motion.div>
            </div>
        </section>
    );
}
