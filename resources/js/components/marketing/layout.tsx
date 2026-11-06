import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * Container - satu-satunya penentu lebar baca halaman marketing.
 *
 * Dipakai oleh semua band supaya tepi kiri/kanan konsisten dan padding
 * responsif tidak ditulis ulang. Tanpa container, band akan full-bleed dan
 * ritme halaman pecah.
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
            className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}
        >
            {children}
        </div>
    );
}

/**
 * Eyebrow - penanda seksi bernomor di atas judul band.
 *
 * Nomor seksi (`01`, `02`, ...) memberi halaman urutan baca yang eksplisit dan
 * menjadi benang editorial yang menyatukan band terang dan band malam. Nomornya
 * dekoratif bagi pembaca layar, jadi seluruh penanda dibungkus `aria-hidden`;
 * label teksnya ikut tersembunyi karena judul `h2` sudah menyebut topik band.
 *
 * @param index - Nomor seksi dua digit.
 * @param children - Label seksi singkat.
 * @param tone - `light` di atas kanvas terang, `dark` di atas band malam.
 */
export function Eyebrow({
    index,
    children,
    tone = 'light',
}: {
    index: string;
    children: ReactNode;
    tone?: 'light' | 'dark';
}) {
    return (
        <p
            aria-hidden="true"
            className={cn(
                'flex items-center gap-3 text-[11px] font-bold tracking-[0.18em] uppercase',
                tone === 'dark' ? 'text-night-brand' : 'text-action',
            )}
        >
            <span className="tabular-nums">{index}</span>
            <span
                className={cn(
                    'h-px w-8',
                    tone === 'dark' ? 'bg-night-brand/60' : 'bg-brand',
                )}
            />
            {children}
        </p>
    );
}

/**
 * SectionHeading - pasangan wajib eyebrow + judul + deskripsi.
 *
 * Semua band memakai komposisi yang sama agar hierarki halaman rata: satu
 * `h2` display (Archivo) per band dengan skala `text-display-band`, deskripsi
 * maksimal dua baris, tanpa kicker dekoratif lain.
 *
 * @param index - Nomor seksi dua digit.
 * @param eyebrow - Label seksi.
 * @param title - Judul band (`h2`).
 * @param description - Kalimat penjelas opsional.
 * @param tone - `light` atau `dark` mengikuti latar band.
 * @param className - Kelas tambahan untuk lebar/posisi.
 */
export function SectionHeading({
    index,
    eyebrow,
    title,
    description,
    tone = 'light',
    className,
}: {
    index: string;
    eyebrow: string;
    title: string;
    description?: string;
    tone?: 'light' | 'dark';
    className?: string;
}) {
    return (
        <div className={cn('max-w-2xl', className)}>
            <Eyebrow index={index} tone={tone}>
                {eyebrow}
            </Eyebrow>
            <h2
                className={cn(
                    'text-display-band font-display mt-4 text-balance font-extrabold tracking-tight',
                    tone === 'dark' ? 'text-night-ink' : 'text-ink',
                )}
            >
                {title}
            </h2>
            {description ? (
                <p
                    className={cn(
                        'mt-4 max-w-xl text-base leading-relaxed font-medium sm:text-lg',
                        tone === 'dark' ? 'text-night-ink-soft' : 'text-ink-soft',
                    )}
                >
                    {description}
                </p>
            ) : null}
        </div>
    );
}
