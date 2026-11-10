import type { InertiaLinkProps } from '@inertiajs/react';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * Instance tailwind-merge yang mengenali skala tipografi kustom.
 *
 * Tanpa pendaftaran ini, `text-display-band` dianggap kelas warna dan
 * terhapus saat digabung dengan `text-ink` — judul band jatuh ke 16px.
 */
const twMerge = extendTailwindMerge({
    extend: {
        classGroups: {
            'font-size': [
                {
                    text: [
                        'display-hero',
                        'display-band',
                        'display-card',
                        'display-lead',
                    ],
                },
            ],
        },
    },
});

/**
 * Menggabungkan kelas Tailwind dengan aturan konflik yang benar.
 *
 * @param inputs - Daftar kelas, kondisional, atau array kelas.
 * @returns String kelas yang sudah dideduplikasi.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}
