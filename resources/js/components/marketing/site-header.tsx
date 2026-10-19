import { useEffect, useState } from 'react';

import { Link } from '@inertiajs/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Menu, X } from 'lucide-react';

import MarketingThemeSwitcher from '@/components/marketing/theme-switcher';
import RepicaMark, { RepicaWordmark } from '@/components/marketing/repica-mark';
import { Button } from '@/components/ui/button';
import { login, register } from '@/routes';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
    { href: '#fitur', label: 'Fitur' },
    { href: '#alur', label: 'Alur kerja' },
    { href: '#harga', label: 'Harga' },
    { href: '#faq', label: 'FAQ' },
] as const;

/**
 * Header halaman publik Repica.
 *
 * Sticky dengan latar blur; saat halaman digulir, header mendapat border dan
 * bayangan halus supaya tetap terbaca di atas konten apa pun. Menu seluler
 * dibuka dengan animasi tinggi+opasitas (`AnimatePresence`) yang dimatikan
 * bila pengguna memilih reduced motion.
 */
export default function MarketingHeader({
    isAuthenticated,
}: {
    isAuthenticated: boolean;
}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const prefersReducedMotion = useReducedMotion();

    useEffect(() => {
        const onScroll = (): void => setIsScrolled(window.scrollY > 8);

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header
            className={cn(
                'bg-background/85 sticky top-0 z-50 transition-shadow duration-300',
                isScrolled
                    ? 'border-border/80 border-b shadow-[0_8px_24px_-16px_rgb(28_25_23/0.25)]'
                    : 'border-b border-transparent',
            )}
        >
            <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-4 px-4 sm:px-6">
                <Link
                    aria-label="Repica — beranda"
                    className="text-brand-700 dark:text-brand-50 flex shrink-0 items-center gap-2"
                    href="/"
                >
                    <RepicaMark className="size-7" />
                    <RepicaWordmark className="text-foreground" />
                </Link>

                <nav
                    aria-label="Navigasi utama"
                    className="mx-auto hidden items-center gap-1 md:flex"
                >
                    {NAV_LINKS.map((link) => (
                        <a
                            className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                            href={link.href}
                            key={link.href}
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                <div className="ml-auto flex items-center gap-2 md:ml-0">
                    {/* Jalur Persona B: admin multi-outlet diarahkan ke blok harga. */}
                    <a
                        className="text-muted-foreground hover:text-foreground hidden text-sm font-medium lg:inline"
                        href="#multi-outlet"
                    >
                        Punya 3+ outlet?
                    </a>

                    {/*
                     * Di bawah `md`, theme switcher dan "Masuk" pindah ke drawer.
                     * Keduanya ikut membawa lebar CTA trial, dan pada 390px
                     * baris ini meluber 48px ke luar layar — tombol "+
                     * hamburger" jadi tidak pernah terjangkau.
                     */}
                    <MarketingThemeSwitcher className="hidden md:inline-flex" />

                    {isAuthenticated ? (
                        <Button
                            asChild
                            className="hidden md:inline-flex"
                            size="sm"
                        >
                            <Link href="/dashboard">Buka Dashboard</Link>
                        </Button>
                    ) : (
                        <>
                            <Button
                                asChild
                                className="hidden md:inline-flex"
                                size="sm"
                                variant="ghost"
                            >
                                <Link href={login()}>Masuk</Link>
                            </Button>
                            <Button asChild size="sm">
                                <Link href={register()}>
                                    Coba Gratis 14 Hari
                                </Link>
                            </Button>
                        </>
                    )}

                    <Button
                        aria-expanded={isMenuOpen}
                        aria-label={isMenuOpen ? 'Tutup menu' : 'Buka menu'}
                        className="md:hidden"
                        onClick={() => setIsMenuOpen((open) => !open)}
                        size="icon"
                        variant="ghost"
                    >
                        {isMenuOpen ? (
                            <X className="size-5" />
                        ) : (
                            <Menu className="size-5" />
                        )}
                    </Button>
                </div>
            </div>

            <AnimatePresence initial={false}>
                {isMenuOpen ? (
                    <motion.div
                        animate={{ height: 'auto', opacity: 1 }}
                        className="bg-background overflow-hidden border-t md:hidden"
                        exit={{ height: 0, opacity: 0 }}
                        initial={
                            prefersReducedMotion
                                ? false
                                : { height: 0, opacity: 0 }
                        }
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                    >
                        <nav
                            aria-label="Navigasi seluler"
                            className="mx-auto flex max-w-[1200px] flex-col p-2"
                        >
                            {NAV_LINKS.map((link) => (
                                <a
                                    className="hover:bg-accent text-foreground rounded-lg px-3 py-3 text-sm font-medium transition-colors"
                                    href={link.href}
                                    key={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.label}
                                </a>
                            ))}
                            <a
                                className="hover:bg-accent text-foreground rounded-lg px-3 py-3 text-sm font-medium transition-colors"
                                href="#multi-outlet"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Punya 3+ outlet?
                            </a>
                            {!isAuthenticated ? (
                                <div className="p-2 sm:hidden">
                                    <Button
                                        asChild
                                        className="w-full"
                                        variant="ghost"
                                    >
                                        <Link href={login()}>Masuk</Link>
                                    </Button>
                                </div>
                            ) : null}

                            {/* Tampilan tema pindah ke drawer agar header tidak meluber di HP. */}
                            <div className="flex items-center justify-between gap-3 border-t px-3 py-3 md:hidden">
                                <span className="text-muted-foreground text-sm font-medium">
                                    Tampilan
                                </span>
                                <MarketingThemeSwitcher />
                            </div>
                        </nav>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </header>
    );
}
