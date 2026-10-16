import { Link } from '@inertiajs/react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, MessageCircle } from 'lucide-react';

import PocDemo from '@/components/marketing/poc-demo';
import ShinyText from '@/components/marketing/shiny-text';
import SplitText from '@/components/marketing/split-text';
import { Button } from '@/components/ui/button';
import { WHATSAPP_URL } from '@/components/marketing/cta-footer';
import { register } from '@/routes';

/**
 * Hero Repica — janji utama + demo Proof-of-Condition yang benar-benar bekerja.
 *
 * Mode Persuade: penawaran harus terbaca dalam hitungan detik dan terbukti,
 * bukan diklaim. Karena itu visual kanannya bukan screenshot dashboard dengan
 * angka rekaan, melainkan loop bukti yang berjalan sendiri (foto → watermark →
 * persetujuan WhatsApp). Headline masuk per kata (SplitText); angka di halaman
 * ini hanya fakta produk, tanpa klaim traction.
 */
export default function MarketingHero({
    isAuthenticated,
}: {
    isAuthenticated: boolean;
}) {
    const prefersReducedMotion = useReducedMotion() ?? false;

    return (
        <section className="relative overflow-hidden">
            {/* Wash warna di belakang panel demo — statis, bukan efek animasi. */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 right-[-10%] hidden size-[34rem] rounded-full bg-[radial-gradient(closest-side,#e6f4f2,transparent)] lg:block dark:bg-[radial-gradient(closest-side,rgba(15,118,110,0.18),transparent)]"
            />

            <div className="relative mx-auto grid max-w-[1200px] items-center gap-12 px-4 pt-12 pb-16 sm:px-6 sm:pt-16 sm:pb-24 lg:grid-cols-12 lg:gap-10">
                <div className="lg:col-span-7">
                    <p className="text-muted-foreground text-sm font-medium">
                        <ShinyText
                            disabled={prefersReducedMotion}
                            speed={5}
                            text="14 hari penuh fitur Pro · tanpa kartu kredit"
                        />
                    </p>

                    <h1 className="text-display-1 mt-4 font-bold tracking-[-0.03em] text-balance">
                        <SplitText delay={0.1} text="Baju rusak? Tertukar?" />{' '}
                        <SplitText
                            className="text-brand-700 dark:text-brand-50"
                            delay={0.5}
                            text="Ada buktinya."
                        />
                    </h1>

                    <p className="text-muted-foreground mt-6 max-w-xl text-lg leading-relaxed">
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
                        prefersReducedMotion
                            ? undefined
                            : { opacity: 1, y: 0, filter: 'blur(0px)' }
                    }
                    className="lg:col-span-5"
                    initial={
                        prefersReducedMotion
                            ? false
                            : { opacity: 0, y: 24, filter: 'blur(6px)' }
                    }
                    transition={{
                        duration: 0.7,
                        ease: [0.16, 1, 0.3, 1],
                        delay: 0.35,
                    }}
                >
                    <PocDemo />
                </motion.div>
            </div>
        </section>
    );
}
