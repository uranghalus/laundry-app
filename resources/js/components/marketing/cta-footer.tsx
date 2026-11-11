import { Link } from '@inertiajs/react';
import { ArrowRight, Check, MessageCircle } from 'lucide-react';

import { Container } from '@/components/marketing/layout';
import RepicaMark from '@/components/marketing/repica-mark';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { hasWhatsAppContact, siteConfig } from '@/lib/site';
import { dashboard, login, register } from '@/routes';

/** Tiga janji pembuka yang dapat diperiksa saat trial. */
const TRIAL_FACTS = [
    'Trial 14 hari penuh',
    'Tanpa kartu kredit',
    'Setup di bawah 30 menit',
] as const;

/** Navigasi footer; hanya anchor yang benar-benar ada di halaman ini. */
const FOOTER_LINKS = [
    { href: '#fitur', label: 'Fitur' },
    { href: '#cara-kerja', label: 'Cara kerja' },
    { href: '#harga', label: 'Harga' },
    { href: '#faq', label: 'FAQ' },
] as const;

/**
 * Penutup halaman — satu ajakan besar di atas bidang malam, lalu footer
 * ringkas. Tautan WhatsApp hanya dirender bila kanal sudah dikonfigurasi;
 * tidak ada nomor placeholder atau entitas hukum rekaan.
 *
 * @param isAuthenticated - Menentukan CTA menuju dashboard atau registrasi.
 */
export default function MarketingCtaFooter({
    isAuthenticated = false,
}: {
    isAuthenticated?: boolean;
}) {
    const year = new Date().getFullYear();
    const hasContact = hasWhatsAppContact();

    return (
        <footer className="bg-night text-night-ink">
            <Container className="py-20 sm:py-24">
                <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
                    <div className="relative lg:col-span-8">
                        <div
                            className="bg-action/10 absolute -top-1/3 -right-1/4 h-[40%] w-[40%] rounded-full mix-blend-overlay blur-[96px]"
                            aria-hidden="true"
                        />
                        <h2 className="text-display-band font-display font-extrabold tracking-tight text-balance">
                            Mulai hari ini.{' '}
                            <span className="text-night-accent">
                                Besok sudah ada buktinya.
                            </span>
                        </h2>
                        <p className="text-night-ink-soft mt-5 max-w-xl text-base leading-relaxed font-medium sm:text-lg">
                            Satu buku untuk order, kondisi cucian, persetujuan
                            pelanggan, dan kas harian. Buka dari HP di outlet
                            maupun laptop di rumah.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end">
                        <Button
                            asChild
                            className="bg-action text-action-foreground hover:bg-action-strong h-12 w-full rounded-md px-6 text-base font-bold sm:w-auto"
                        >
                            <Link
                                href={
                                    isAuthenticated ? dashboard() : register()
                                }
                            >
                                {isAuthenticated
                                    ? 'Buka dashboard'
                                    : 'Mulai trial 14 hari'}
                                <ArrowRight aria-hidden="true" />
                            </Link>
                        </Button>

                        {hasContact && siteConfig.whatsappUrl ? (
                            <Button
                                asChild
                                variant="outline"
                                className="border-night-line text-night-ink hover:bg-night-raised h-12 w-full rounded-md bg-transparent px-5 font-bold sm:w-auto"
                            >
                                <a
                                    href={siteConfig.whatsappUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <MessageCircle aria-hidden="true" />
                                    Tanya lewat WhatsApp
                                </a>
                            </Button>
                        ) : (
                            <Link
                                href={login()}
                                className="text-night-ink-soft hover:text-night-ink focus-visible:ring-night-accent inline-flex min-h-11 items-center justify-center rounded-md px-2 text-sm font-bold underline underline-offset-4 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                            >
                                Sudah punya akun? Masuk
                            </Link>
                        )}
                    </div>
                </div>

                <ul className="border-night-line mt-12 flex flex-wrap gap-x-6 gap-y-3 border-t pt-6">
                    {TRIAL_FACTS.map((fact, index) => (
                        <li
                            key={fact}
                            className="text-night-ink-soft flex items-center gap-2 text-sm font-semibold"
                        >
                            <span
                                className={cn(
                                    'flex shrink-0 items-center justify-center rounded-full',
                                    index === 0
                                        ? 'bg-action text-action-foreground size-4'
                                        : index === 1
                                          ? 'bg-ok-tint text-ok size-4'
                                          : 'bg-graphic-tint text-action-text size-4',
                                )}
                                aria-hidden="true"
                            >
                                <Check className="size-2.5" />
                            </span>
                            {fact}
                        </li>
                    ))}
                </ul>
            </Container>

            <div className="border-night-line border-t">
                <Container className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2.5">
                        <RepicaMark className="text-night-accent size-6" />
                        <span className="text-lg font-extrabold tracking-tight">
                            Repica
                        </span>
                        <span className="text-night-ink-soft ml-2 hidden text-xs font-medium sm:inline">
                            Manajemen laundry dengan bukti
                        </span>
                    </div>

                    <nav aria-label="Navigasi footer">
                        <ul className="flex flex-wrap gap-x-5 gap-y-2">
                            {FOOTER_LINKS.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        className="text-night-ink-soft hover:text-night-ink focus-visible:ring-night-accent inline-flex min-h-11 items-center rounded-sm text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </Container>
            </div>

            <div className="border-night-line border-t">
                <Container className="text-night-ink-soft flex flex-col gap-2 py-5 text-xs font-medium sm:flex-row sm:items-center sm:justify-between">
                    <p>© {year} Repica. Perangkat lunak manajemen laundry.</p>
                    <p>Dibuat untuk laundry di Indonesia.</p>
                </Container>
            </div>
        </footer>
    );
}
