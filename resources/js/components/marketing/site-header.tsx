import { useEffect, useState } from 'react';

import { Link } from '@inertiajs/react';
import { ArrowRight, Menu, X } from 'lucide-react';

import RepicaMark from '@/components/marketing/repica-mark';
import MarketingThemeSwitcher from '@/components/marketing/theme-switcher';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { dashboard, home, login, register } from '@/routes';

/**
 * Anchor navigasi publik. Setiap `href` cocok dengan `id` band di
 * `welcome.tsx`; semua band memakai `scroll-mt-24` agar tidak tertutup
 * header sticky setinggi 64px.
 */
const NAV_LINKS = [
    { href: '#fitur', label: 'Fitur' },
    { href: '#cara-kerja', label: 'Cara kerja' },
    { href: '#harga', label: 'Harga' },
    { href: '#faq', label: 'FAQ' },
] as const;

/** Jarak aman di bawah header untuk menentukan section aktif. */
const ACTIVE_SECTION_OFFSET = 96;

/**
 * Header halaman publik — permukaan kertas solid tanpa blur, satu garis
 * bawah, dan target sentuh minimal 44px. Menu ponsel memakai dialog Radix
 * sehingga fokus terkurung, Escape menutup, dan offset panel tidak dihitung
 * manual.
 *
 * @param isAuthenticated - Menentukan CTA menuju dashboard atau registrasi.
 */
export default function MarketingHeader({
    isAuthenticated = false,
}: {
    isAuthenticated?: boolean;
}) {
    const [activeSection, setActiveSection] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const syncActiveSection = () => {
            const fromTop = window.scrollY + ACTIVE_SECTION_OFFSET;
            const active = NAV_LINKS.find(({ href }) => {
                const element = document.getElementById(href.slice(1));

                return (
                    element !== null &&
                    element.offsetTop <= fromTop &&
                    element.offsetTop + element.offsetHeight > fromTop
                );
            });

            setActiveSection(active?.href ?? '');
        };

        syncActiveSection();
        window.addEventListener('scroll', syncActiveSection, {
            passive: true,
        });

        return () => window.removeEventListener('scroll', syncActiveSection);
    }, []);

    const primaryLabel = isAuthenticated ? 'Buka dashboard' : 'Mulai trial';

    return (
        <header className="bg-ground border-line sticky top-0 z-50 border-b">
            <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <Link
                    href={home()}
                    aria-label="Repica — kembali ke beranda"
                    className="focus-visible:ring-ring focus-visible:ring-offset-ground flex min-h-11 items-center gap-2.5 rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                    <RepicaMark className="text-ink size-7" />
                    <span className="text-ink text-lg font-extrabold tracking-tight">
                        Repica
                    </span>
                    <span className="border-line text-ink-soft ml-1 hidden border-l pl-3 font-mono text-[11px] font-semibold tracking-[0.14em] uppercase xl:inline">
                        Buku bukti laundry
                    </span>
                </Link>

                <nav
                    aria-label="Navigasi utama"
                    className="hidden items-center gap-1 lg:flex"
                >
                    {NAV_LINKS.map((link) => {
                        const isActive = activeSection === link.href;

                        return (
                            <a
                                key={link.href}
                                href={link.href}
                                aria-current={isActive ? 'location' : undefined}
                                className={cn(
                                    'focus-visible:ring-ring relative inline-flex min-h-11 items-center rounded-md px-3 text-sm font-bold transition-colors focus-visible:ring-2 focus-visible:outline-none',
                                    isActive
                                        ? 'text-ink'
                                        : 'text-ink-soft hover:text-ink',
                                )}
                            >
                                {link.label}
                                <span
                                    aria-hidden="true"
                                    className={cn(
                                        'bg-action absolute right-3 bottom-1.5 left-3 h-[2px] transition-opacity',
                                        isActive ? 'opacity-100' : 'opacity-0',
                                    )}
                                />
                            </a>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-2">
                    <MarketingThemeSwitcher className="text-ink-soft hover:bg-muted hover:text-ink size-11" />

                    <span
                        aria-hidden="true"
                        className="bg-line mx-1 hidden h-6 w-px sm:block"
                    />

                    {isAuthenticated ? (
                        <Button
                            asChild
                            className="bg-ink text-ground hover:bg-ink/90 hidden h-11 rounded-md px-4 font-bold sm:inline-flex"
                        >
                            <Link href={dashboard()}>
                                Buka dashboard
                                <ArrowRight aria-hidden="true" />
                            </Link>
                        </Button>
                    ) : (
                        <>
                            <Link
                                href={login()}
                                className="text-ink-soft hover:text-ink focus-visible:ring-ring hidden min-h-11 items-center rounded-md px-3 text-sm font-bold transition-colors focus-visible:ring-2 focus-visible:outline-none sm:inline-flex"
                            >
                                Masuk
                            </Link>
                            <Button
                                asChild
                                className="bg-action text-action-foreground hover:bg-action-strong hidden h-11 rounded-md px-4 text-sm font-bold sm:inline-flex"
                            >
                                <Link href={register()}>
                                    Mulai trial
                                    <ArrowRight aria-hidden="true" />
                                </Link>
                            </Button>
                        </>
                    )}

                    <Dialog open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                        <DialogTrigger asChild>
                            <Button
                                type="button"
                                variant="outline"
                                aria-label="Buka menu navigasi"
                                className="border-line text-ink hover:bg-muted size-11 rounded-md bg-transparent lg:hidden"
                            >
                                <Menu aria-hidden="true" />
                            </Button>
                        </DialogTrigger>

                        <DialogContent
                            className={cn(
                                'bg-ground border-line shadow-float fixed inset-y-0 top-0 right-0 left-auto flex h-dvh w-[min(20rem,calc(100vw-3rem))] max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none border-l p-0',
                                '[&>button]:hidden',
                            )}
                        >
                            <DialogTitle className="sr-only">
                                Menu navigasi Repica
                            </DialogTitle>
                            <DialogDescription className="sr-only">
                                Pilih bagian halaman atau masuk ke akun Anda.
                            </DialogDescription>

                            <div className="border-line flex h-16 shrink-0 items-center justify-between border-b px-4">
                                <span className="text-ink flex items-center gap-2.5">
                                    <RepicaMark className="size-6" />
                                    <span className="text-lg font-extrabold tracking-tight">
                                        Repica
                                    </span>
                                </span>
                                <DialogClose asChild>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        aria-label="Tutup menu navigasi"
                                        className="text-ink hover:bg-muted size-11 rounded-md"
                                    >
                                        <X aria-hidden="true" />
                                    </Button>
                                </DialogClose>
                            </div>

                            <nav
                                aria-label="Navigasi ponsel"
                                className="flex-1 overflow-y-auto px-4 py-2"
                            >
                                <ul>
                                    {NAV_LINKS.map((link, index) => (
                                        <li key={link.href}>
                                            <a
                                                href={link.href}
                                                onClick={() =>
                                                    setIsMenuOpen(false)
                                                }
                                                aria-current={
                                                    activeSection === link.href
                                                        ? 'location'
                                                        : undefined
                                                }
                                                className={cn(
                                                    'border-line focus-visible:ring-ring flex min-h-14 items-center justify-between rounded-sm border-b text-lg font-bold transition-colors focus-visible:ring-2 focus-visible:outline-none',
                                                    activeSection === link.href
                                                        ? 'text-ink'
                                                        : 'text-ink-soft hover:text-ink',
                                                )}
                                            >
                                                {link.label}
                                                <span className="text-ink-soft font-mono text-xs">
                                                    0{index + 1}
                                                </span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </nav>

                            <div className="border-line shrink-0 space-y-3 border-t p-4">
                                {isAuthenticated ? (
                                    <Button
                                        asChild
                                        className="bg-ink text-ground hover:bg-ink/90 h-12 w-full rounded-md font-bold"
                                    >
                                        <Link
                                            href={dashboard()}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Buka dashboard
                                            <ArrowRight aria-hidden="true" />
                                        </Link>
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            asChild
                                            className="bg-action text-action-foreground hover:bg-action-strong h-12 w-full rounded-md font-bold"
                                        >
                                            <Link
                                                href={register()}
                                                onClick={() =>
                                                    setIsMenuOpen(false)
                                                }
                                            >
                                                {primaryLabel}
                                                <ArrowRight aria-hidden="true" />
                                            </Link>
                                        </Button>
                                        <Button
                                            asChild
                                            variant="outline"
                                            className="border-line text-ink hover:bg-muted h-12 w-full rounded-md bg-transparent font-bold"
                                        >
                                            <Link
                                                href={login()}
                                                onClick={() =>
                                                    setIsMenuOpen(false)
                                                }
                                            >
                                                Sudah punya akun? Masuk
                                            </Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </header>
    );
}
