import { useEffect, useState } from 'react';

import { Link } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';

import RepicaMark, { RepicaWordmark } from '@/components/marketing/repica-mark';
import MarketingThemeSwitcher from '@/components/marketing/theme-switcher';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { dashboard, login, register } from '@/routes';

/**
 * Anchor navigasi halaman publik. Urutannya mengikuti urutan band, dan
 * setiap `href` harus punya pasangan `id` pada band-nya.
 */
const NAV_LINKS = [
    { href: '#fitur', label: 'Fitur' },
    { href: '#cara-kerja', label: 'Cara Kerja' },
    { href: '#harga', label: 'Harga' },
    { href: '#faq', label: 'FAQ' },
] as const;

/** Ring fokus bersama untuk semua kontrol header. */
const FOCUS_RING =
    'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background';

/**
 * Header halaman publik Repica.
 *
 * Bar sticky solid (bukan kaca/blur) dengan garis rambut yang muncul setelah
 * halaman digulir. Semua warna memakai token semantik, jadi mode gelap
 * bekerja tanpa varian `dark:` per elemen.
 *
 * Menu seluler dibuka sebagai panel di bawah bar; tutup lewat tombol, Esc,
 * atau setelah memilih tautan. Target sentuh minimal 44px dan status
 * `aria-expanded` selalu dilaporkan.
 *
 * @param isAuthenticated - Menampilkan tautan dashboard alih-alih masuk/daftar.
 */
export default function MarketingHeader({
    isAuthenticated = false,
}: {
    isAuthenticated?: boolean;
}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeHref, setActiveHref] = useState<string | null>(null);

    useEffect(() => {
        /** Menandai bar sudah bergulir agar garis rambut muncul. */
        const onScroll = (): void => setIsScrolled(window.scrollY > 8);

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        // `IntersectionObserver` menggantikan pembacaan posisi di setiap
        // event scroll: jauh lebih ringan untuk INP di HP kelas bawah.
        const sections = NAV_LINKS.map((link) =>
            document.getElementById(link.href.slice(1)),
        ).filter((section): section is HTMLElement => section !== null);

        if (sections.length === 0) {
            return undefined;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

                if (visible[0]) {
                    setActiveHref(`#${visible[0].target.id}`);
                }
            },
            { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5] },
        );

        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isMenuOpen) {
            return undefined;
        }

        /** Menutup panel dengan Esc dan mengunci gulir latar. */
        const onKeyDown = (event: KeyboardEvent): void => {
            if (event.key === 'Escape') {
                setIsMenuOpen(false);
            }
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [isMenuOpen]);

    return (
        <header
            className={cn(
                'bg-background sticky top-0 z-50 border-b transition-colors duration-200',
                isScrolled || isMenuOpen
                    ? 'border-border'
                    : 'border-transparent',
            )}
        >
            <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between gap-4 px-5 sm:px-8">
                <Link
                    href="/"
                    className={cn(
                        'flex items-center gap-2.5 rounded-lg',
                        FOCUS_RING,
                    )}
                >
                    <RepicaMark className="text-brand-600 dark:text-brand-500 size-7" />
                    <RepicaWordmark
                        className="text-ink"
                        showDescription={false}
                    />
                </Link>

                <nav
                    aria-label="Navigasi utama"
                    className="hidden items-center gap-1 md:flex"
                >
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            aria-current={
                                activeHref === link.href
                                    ? 'location'
                                    : undefined
                            }
                            className={cn(
                                'rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200',
                                activeHref === link.href
                                    ? 'text-link'
                                    : 'text-ink-soft hover:text-ink',
                                FOCUS_RING,
                            )}
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                <div className="hidden items-center gap-2 md:flex">
                    <MarketingThemeSwitcher />

                    {isAuthenticated ? (
                        <Link
                            href={dashboard()}
                            className={cn(
                                'bg-action text-action-foreground hover:bg-action-hover inline-flex h-10 items-center rounded-lg px-4 text-sm font-semibold transition-colors duration-200',
                                FOCUS_RING,
                            )}
                        >
                            Buka Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={login()}
                                className={cn(
                                    'text-ink hover:bg-band inline-flex h-10 items-center rounded-lg px-4 text-sm font-semibold transition-colors duration-200',
                                    FOCUS_RING,
                                )}
                            >
                                Masuk
                            </Link>
                            <Link
                                href={register()}
                                className={cn(
                                    'bg-action text-action-foreground hover:bg-action-hover inline-flex h-10 items-center rounded-lg px-4 text-sm font-semibold transition-colors duration-200',
                                    FOCUS_RING,
                                )}
                            >
                                Coba gratis
                            </Link>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-1 md:hidden">
                    <MarketingThemeSwitcher />
                    <Button
                        aria-controls="menu-navigasi-seluler"
                        aria-expanded={isMenuOpen}
                        aria-label={
                            isMenuOpen
                                ? 'Tutup menu navigasi'
                                : 'Buka menu navigasi'
                        }
                        className={cn(
                            'text-ink hover:bg-band size-11',
                            FOCUS_RING,
                        )}
                        onClick={() => setIsMenuOpen((previous) => !previous)}
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

            {isMenuOpen ? (
                <nav
                    id="menu-navigasi-seluler"
                    aria-label="Navigasi seluler"
                    className="border-border bg-background animate-in fade-in slide-in-from-top-2 border-b duration-150 motion-reduce:animate-none md:hidden"
                >
                    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-1 px-5 py-4 sm:px-8">
                        {NAV_LINKS.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                aria-current={
                                    activeHref === link.href
                                        ? 'location'
                                        : undefined
                                }
                                onClick={() => setIsMenuOpen(false)}
                                className={cn(
                                    'flex min-h-11 items-center rounded-lg px-3 text-base font-medium transition-colors duration-200',
                                    activeHref === link.href
                                        ? 'text-link'
                                        : 'text-ink hover:bg-band',
                                    FOCUS_RING,
                                )}
                            >
                                {link.label}
                            </a>
                        ))}

                        <div className="border-border mt-3 flex flex-col gap-2 border-t pt-4">
                            {isAuthenticated ? (
                                <Link
                                    href={dashboard()}
                                    className={cn(
                                        'bg-action text-action-foreground flex min-h-11 items-center justify-center rounded-lg text-base font-semibold',
                                        FOCUS_RING,
                                    )}
                                >
                                    Buka Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className={cn(
                                            'border-border text-ink flex min-h-11 items-center justify-center rounded-lg border text-base font-semibold',
                                            FOCUS_RING,
                                        )}
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={register()}
                                        className={cn(
                                            'bg-action text-action-foreground flex min-h-11 items-center justify-center rounded-lg text-base font-semibold',
                                            FOCUS_RING,
                                        )}
                                    >
                                        Coba gratis 14 hari
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>
            ) : null}
        </header>
    );
}
