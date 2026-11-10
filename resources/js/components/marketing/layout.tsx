import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * Container — satu-satunya penentu lebar baca halaman marketing.
 *
 * Dipakai oleh semua band supaya tepi kiri/kanan konsisten dan padding
 * responsif tidak ditulis ulang.
 *
 * @param className - Kelas tambahan (mis. padding vertikal band).
 * @param children - Isi container.
 */
export function Container({
    className,
    children,
}: {
    className?: string;
    children: ReactNode;
}) {
    return (
        <div
            className={cn(
                'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8',
                className,
            )}
        >
            {children}
        </div>
    );
}

/**
 * SectionHeading — judul band tanpa kicker dekoratif.
 *
 * Hierarki dibawa oleh ukuran dan berat huruf, bukan oleh label kecil di
 * atasnya. Deskripsi dibatasi agar tetap dua sampai tiga baris.
 *
 * @param title - Judul band (`h2`).
 * @param description - Kalimat penjelas opsional.
 * @param tone - `light` atau `dark` mengikuti latar band.
 * @param align - Perataan blok judul.
 * @param id - ID untuk dihubungkan ke `aria-labelledby` section.
 * @param className - Kelas tambahan untuk lebar/posisi.
 */
export function SectionHeading({
    title,
    description,
    tone = 'light',
    align = 'left',
    id,
    className,
}: {
    title: string;
    description?: string;
    tone?: 'light' | 'dark';
    align?: 'left' | 'center';
    id?: string;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'max-w-3xl',
                align === 'center' && 'mx-auto text-center',
                className,
            )}
        >
            <h2
                id={id}
                className={cn(
                    'text-display-band font-display font-extrabold tracking-tight text-balance',
                    tone === 'dark' ? 'text-night-ink' : 'text-ink',
                )}
            >
                {title}
            </h2>
            {description ? (
                <p
                    className={cn(
                        'mt-5 max-w-2xl text-base leading-relaxed font-medium sm:text-lg',
                        align === 'center' && 'mx-auto',
                        tone === 'dark'
                            ? 'text-night-ink-soft'
                            : 'text-ink-soft',
                    )}
                >
                    {description}
                </p>
            ) : null}
        </div>
    );
}

/**
 * MetaLabel — label mono kecil untuk metadata artefak (ID order, waktu,
 * status contoh). Bukan kicker di atas judul band.
 *
 * @param children - Teks label.
 * @param tone - `light` di kertas, `dark` di band malam.
 * @param className - Kelas tambahan.
 */
export function MetaLabel({
    children,
    tone = 'light',
    className,
}: {
    children: ReactNode;
    tone?: 'light' | 'dark';
    className?: string;
}) {
    return (
        <span
            className={cn(
                'font-mono text-[11px] font-semibold tracking-[0.16em] uppercase',
                tone === 'dark' ? 'text-night-ink-soft' : 'text-ink-soft',
                className,
            )}
        >
            {children}
        </span>
    );
}
