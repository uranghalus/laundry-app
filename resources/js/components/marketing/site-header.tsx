import { useEffect, useState } from 'react';

import { Link } from '@inertiajs/react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import RepicaMark, { RepicaWordmark } from '@/components/marketing/repica-mark';
import MarketingThemeSwitcher from '@/components/marketing/theme-switcher';
import { dashboard, login, register } from '@/routes';
import { cn } from '@/lib/utils';

/**
 * Anchor navigasi halaman publik (Keputusan Q10, DECISIONS.md): urutan
 * bottom-to-top pembacaan halaman — fitur, cara kerja, harga, FAQ. Setiap
 * `href` cocok dengan `id` pada band di `welcome.tsx`; semua band memakai
 * `scroll-mt-20` agar tidak tertutup header sticky.
 */
const NAV_LINKS = [
    { href: '#fitur', label: 'Fitur' },
    { href: '#cara-kerja', label: 'Cara Kerja' },
    { href: '#harga', label: 'Harga' },
    { href: '#faq', label: 'FAQ' },
] as const;

/**
 * Offset jarak aman di bawah header (h-16 = 64px) untuk menentukan section
 * aktif saat digulir; menyatu dengan `scroll-mt-20` (80px) pada band.
 */
const ACTIVE_SECTION_OFFSET = 96;

/**
 * Ring fokus bersama untuk semua kontrol interaktif header: indikator
 * keyboard selalu terlihat via ring token `--ring` (biru aksi), tanpa pernah
 * menghapus outline bawaan browser.
 */
const FOCUS_RING =
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ground';

/**
 * Header halaman publik Repica — bar lembar terang di atas medan biru (Sachet Pop).
 *
 * Bar sticky setengah-transparan (`bg-sheet/85` + blur) dengan border rambut
 * dan bayangan pop saat halaman digulir. Tautan aktif memakai pil `bg-brand-tint
 * text-action` ( kontras AA ); CTA primer fill `bg-action` (#1D4ED8), sekunder
 * outline aksi.
 *
 * Menu seluler: drawer mengambang dari kanan dengan backdrop gelap, tutup via
 * tombol / Esc / klik latar. Semua item `min-h-11` (≥44px sentuhan),
 * `aria-expanded`, `aria-controls`, dan ring fokus terlihat.
 *
 * @param isAuthenticated - Menentukan apakah CTA "Buka Dashboard" ditampilkan
 *   (saat sudah login) atau CTA daftar (saat tamu).
 */
export default function MarketingHeader({
    isAuthenticated = false,
}: {
    isAuthenticated?: boolean;
}) {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<string>('');
    const prefersReducedMotion = useReducedMotion() ?? false;

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 0);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const onScroll = () => {
            const fromTop = window.scrollY + ACTIVE_SECTION_OFFSET;
            const hit = NAV_LINKS.find(({ href }) => {
                const el = document.getElementById(href.slice(1));
                return (
                    el &&
                    el.offsetTop <= fromTop &&
                    el.offsetTop + el.offsetHeight > fromTop
                );
            });
            setActiveSection(hit ? hit.href : '');
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const navLinks = (
        <div className="hidden items-center gap-1 sm:flex">
            {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.href;
                return (
                    <Link
                        key={link.label}
                        href={link.href}
                        className={cn(
                            'rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors duration-200',
                            FOCUS_RING,
                            isActive
                                ? 'bg-brand-tint text-action'
                                : 'text-ink-soft hover:bg-brand-tint/60 hover:text-ink',
                        )}
                        aria-current={isActive ? 'page' : undefined}
                    >
                        {link.label}
                    </Link>
                );
            })}
        </div>
    );

    const authActions = (
        <div className="hidden items-center gap-2.5 sm:flex">
            {isAuthenticated ? (
                <Link
                    href={dashboard()}
                    className={cn(
                        'inline-flex items-center gap-2 rounded-lg bg-action px-5 py-2.5 text-sm font-bold text-action-foreground shadow-[0_3px_0_0_var(--color-action-strong)] transition-colors hover:bg-action-strong',
                        FOCUS_RING,
                    )}
                >
                    Buka Dashboard
                    <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
            ) : (
                <>
                    <Link
                        href={login()}
                        className={cn(
                            'rounded-lg border-2 border-action/60 px-5 py-2.5 text-sm font-bold text-action transition-colors hover:border-action hover:bg-brand-tint',
                            FOCUS_RING,
                        )}
                    >
                        Masuk
                    </Link>
                    <Link
                        href={register()}
                        className={cn(
                            'rounded-lg bg-action px-5 py-2.5 text-sm font-bold text-action-foreground shadow-[0_3px_0_0_var(--color-action-strong)] transition-colors hover:bg-action-strong',
                            FOCUS_RING,
                        )}
                    >
                        Coba Gratis 14 Hari
                    </Link>
                </>
            )}
        </div>
    );

    return (
        <header
            className={cn(
                'sticky top-0 z-50 transition-shadow duration-300',
                scrolled
                    ? 'border-line/70 bg-sheet/85 border-b shadow-pop backdrop-blur-md'
                    : 'border-b border-transparent bg-sheet/60 backdrop-blur-sm',
            )}
        >
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex shrink-0 items-center gap-2">
                    <Link
                        href="/"
                        className={cn('flex items-center gap-2 rounded-lg', FOCUS_RING)}
                    >
                        <span className="flex size-8 items-center justify-center rounded-lg bg-brand text-white">
                            <RepicaMark className="size-5" />
                        </span>
                        <RepicaWordmark showDescription={false} />
                    </Link>
                </div>

                <div className="hidden items-center gap-1 lg:flex">
                    {navLinks}
                    {authActions}
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    <MarketingThemeSwitcher />
                    <button
                        onClick={() => setOpen((o) => !o)}
                        aria-expanded={open}
                        aria-controls="menu-nav-seluler"
                        aria-label={open ? 'Tutup navigasi seluler' : 'Buka navigasi seluler'}
                        className={cn(
                            'size-11 rounded-lg p-2 text-ink-soft transition-colors hover:bg-brand-tint hover:text-ink lg:hidden',
                            FOCUS_RING,
                        )}
                    >
                        {open ? (
                            <X className="size-5" aria-hidden="true" />
                        ) : (
                            <Menu className="size-5" aria-hidden="true" />
                        )}
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {open && (
                    <motion.div
                        key="backdrop"
                        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
                        animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1 }}
                        exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0 }}
                        transition={prefersReducedMotion ? {} : { duration: 0.2 }}
                        className="fixed inset-0 top-16 z-40 bg-ink/40 backdrop-blur-sm"
                        onClick={() => setOpen(false)}
                    />
                )}
                {open && (
                    <motion.div
                        key="drawer"
                        id="menu-nav-seluler"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Navigasi seluler"
                        initial={prefersReducedMotion ? { x: 0 } : { x: '100%' }}
                        animate={{ x: 0 }}
                        exit={prefersReducedMotion ? { x: 0 } : { x: '100%' }}
                        transition={
                            prefersReducedMotion
                                ? {}
                                : { type: 'spring', damping: 25, stiffness: 300 }
                        }
                        className="border-line bg-sheet fixed top-16 right-0 z-50 w-full border-l p-6 shadow-pop sm:max-w-md sm:p-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <nav className="flex flex-col gap-1" aria-label="Navigasi seluler">
                            {NAV_LINKS.map((link) => {
                                const isActive = activeSection === link.href;
                                return (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        onClick={() => setOpen(false)}
                                        className={cn(
                                            'flex min-h-11 w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold transition-colors',
                                            FOCUS_RING,
                                            isActive
                                                ? 'bg-brand-tint text-action'
                                                : 'text-ink hover:bg-brand-tint/60',
                                        )}
                                        aria-current={isActive ? 'page' : undefined}
                                    >
                                        {link.label}
                                        {isActive ? (
                                            <span className="text-xs font-bold uppercase tracking-wide text-action">
                                                Aktif
                                            </span>
                                        ) : null}
                                    </Link>
                                );
                            })}
                            <div className="mt-6 flex flex-col gap-3 border-t border-line pt-6">
                                {isAuthenticated ? (
                                    <Link
                                        href={dashboard()}
                                        onClick={() => setOpen(false)}
                                        className={cn(
                                            'flex min-h-11 items-center justify-center gap-2 rounded-lg bg-action px-6 py-3 text-sm font-bold text-action-foreground',
                                            FOCUS_RING,
                                        )}
                                    >
                                        Buka Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={login()}
                                            onClick={() => setOpen(false)}
                                            className={cn(
                                                'flex min-h-11 items-center justify-center rounded-lg border-2 border-action/60 px-6 py-3 text-sm font-bold text-action',
                                                FOCUS_RING,
                                            )}
                                        >
                                            Masuk
                                        </Link>
                                        <Link
                                            href={register()}
                                            onClick={() => setOpen(false)}
                                            className={cn(
                                                'flex min-h-11 items-center justify-center rounded-lg bg-action px-6 py-3 text-sm font-bold text-action-foreground',
                                                FOCUS_RING,
                                            )}
                                        >
                                            Coba Gratis 14 Hari
                                        </Link>
                                    </>
                                )}
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
