import type { LucideIcon } from 'lucide-react';
import {
    Check,
    CircleDashed,
    Droplets,
    Flame,
    Inbox,
    PackageCheck,
    Wind,
} from 'lucide-react';

/**
 * Status pipeline laundry — DESIGN-BRIEF §3 "Warna status pipeline".
 *
 * Prinsip P3 ("Status adalah bahasa bersama"): warna, ikon, dan kata yang
 * identik di seluruh permukaan — aplikasi, pesan WhatsApp, halaman approval,
 * dan laporan. Karena itu definisinya dipusatkan di sini, bukan ditulis ulang
 * per halaman.
 *
 * Warna TIDAK PERNAH menjadi satu-satunya pembawa makna (brief §10): setiap
 * usage wajib menampilkan ikon + label teks, penting untuk buta warna
 * merah-hijau yang akan tertukar `Siap Diambil` vs `Dikeringkan`.
 */
export const PIPELINE_STATUSES = [
    {
        key: 'diterima',
        label: 'Diterima',
        description: 'Barang diterima di outlet, foto kondisi awal diambil.',
        icon: Inbox,
        /** Badge: latar tint + teks gelap (mode terang) / tint gelap + teks terang. */
        badgeClass:
            'bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-200',
        /** Titik solid pada timeline, memakai skala warna yang sama. */
        dotClass: 'bg-stone-500',
    },
    {
        key: 'dicuci',
        label: 'Dicuci',
        description: 'Masuk proses cuci sesuai jenis layanan.',
        icon: Droplets,
        badgeClass: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200',
        dotClass: 'bg-sky-600',
    },
    {
        key: 'dikeringkan',
        label: 'Dikeringkan',
        description: 'Selesai dicuci, sedang dikeringkan.',
        icon: Wind,
        badgeClass:
            'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-200',
        dotClass: 'bg-cyan-600',
    },
    {
        key: 'disetrika',
        label: 'Disetrika',
        description: 'Pengeringan selesai, masuk tahap setrika.',
        icon: Flame,
        badgeClass:
            'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200',
        dotClass: 'bg-violet-600',
    },
    {
        key: 'siap_diambil',
        label: 'Siap Diambil',
        description: 'Sudah selesai dan siap diambil pelanggan.',
        icon: PackageCheck,
        badgeClass:
            'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200',
        dotClass: 'bg-green-700',
    },
    {
        key: 'selesai',
        label: 'Selesai',
        description: 'Barang sudah diserahkan ke pelanggan.',
        icon: Check,
        badgeClass:
            'bg-stone-800 text-stone-50 dark:bg-stone-200 dark:text-stone-900',
        dotClass: 'bg-stone-800 dark:bg-stone-300',
    },
] as const satisfies readonly {
    key: string;
    label: string;
    description: string;
    icon: LucideIcon;
    badgeClass: string;
    dotClass: string;
}[];

export type PipelineStatus = (typeof PIPELINE_STATUSES)[number];

/**
 * Status turunan untuk order bertanda "Item Berisiko Tinggi": order tertahan
 * sampai pelanggan menyetujui foto Proof-of-Condition (FR-9.4). Amber dipilih
 * khusus di brief §3 sebagai warna "perhatian kasir".
 */
export const AWAITING_APPROVAL_STATUS = {
    key: 'menunggu_persetujuan',
    label: 'Menunggu Persetujuan',
    description:
        'Foto kondisi awal sudah diambil, menunggu pelanggan menyetujui lewat WhatsApp.',
    icon: CircleDashed,
    badgeClass:
        'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-200',
    dotClass: 'bg-amber-700',
} as const satisfies {
    key: string;
    label: string;
    description: string;
    icon: LucideIcon;
    badgeClass: string;
    dotClass: string;
};

/**
 * Cari definisi status berdasarkan key-nya.
 *
 * @param key - Key status, misalnya `dicuci` atau `menunggu_persetujuan`.
 * @returns Definisi status, atau `undefined` bila key tidak dikenal.
 */
export function getPipelineStatus(
    key: string,
): PipelineStatus | typeof AWAITING_APPROVAL_STATUS | undefined {
    return (
        PIPELINE_STATUSES.find((status) => status.key === key) ??
        (AWAITING_APPROVAL_STATUS.key === key
            ? AWAITING_APPROVAL_STATUS
            : undefined)
    );
}
