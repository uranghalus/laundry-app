import type { SVGProps } from 'react';

/**
 * Logo mark Repica — drum mesin cuci + tetesan air.
 *
 * DESIGN-BRIEF §2 mood "mesin cuci yang tenang": geometris, industrial-hangat,
 * bukan ilustrasi playful. Mark sengaja dibuat dari dua bentuk agar tetap
 * terbaca pada 16px (favicon) maupun pada ukuran header.
 *
 * Seluruh warna memakai `currentColor` supaya pemanggil menentukan warna lewat
 * className, bukan SVG yang memiliki warna hardcoded.
 */
export default function RepicaMark({
    className = '',
    ...props
}: SVGProps<SVGSVGElement>) {
    return (
        <svg
            aria-hidden="true"
            className={className}
            fill="none"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            {/* Cincin drum — outline agar ringan di favicon. */}
            <circle
                cx="16"
                cy="16"
                r="13"
                stroke="currentColor"
                strokeWidth="2.5"
            />
            {/* Tetesan air di tengah drum. */}
            <path
                d="M16 7.5c3.6 4.6 5.6 7.1 5.6 9.6a5.6 5.6 0 0 1-11.2 0c0-2.5 2-5 5.6-9.6Z"
                fill="currentColor"
            />
        </svg>
    );
}

/**
 * Wordmark Repica — nama brand + deskripsi singkat.
 *
 * `Repica` memakai `font-semibold` dengan `tracking-tight`; deskripsi memakai
 * warna `muted-foreground` agar hierarki visual jelas di header yang ramai.
 */
export function RepicaWordmark({
    description = 'Manajemen laundry',
    className = '',
    showDescription = true,
}: {
    description?: string;
    className?: string;
    showDescription?: boolean;
}) {
    return (
        <span className={className}>
            <span className="text-lg font-semibold tracking-tight">Repica</span>
            {showDescription ? (
                <span className="text-muted-foreground ml-2 hidden text-sm sm:inline">
                    {description}
                </span>
            ) : null}
        </span>
    );
}
