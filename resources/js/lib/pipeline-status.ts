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
 *
 * Semua warna pakai token DESIGN.md v6 (ok/warn/bad/action/night-accent),
 * tidak ada raw hex maupun Tailwind warna bawaan di luar token.
 */
export const PIPELINE_STATUSES = [
    {
        key: 'diterima',
        label: 'Diterima',
        description: 'Barang diterima di outlet, foto kondisi awal diambil.',
        icon: Inbox,
        /** Badge: latar tint + teks gelap (mode terang) / lembut di malam. */
        badgeClass:
            'bg-ok-tint text-ok border-ok/25 dark:bg-night-raised dark:text-night-ink-soft dark:border-ok/30',
        /** Titik solid pada timeline, memakai skala warna yang sama. */
        dotClass: 'bg-ok dark:bg-night-accent',
    },
    {
        key: 'dicuci',
        label: 'Dicuci',
        description: 'Masuk proses cuci sesuai jenis layanan.',
        icon: Droplets,
        badgeClass:
            'bg-action text-action-foreground dark:bg-night-accent dark:text-night-ink dark:border-night-accent',
        dotClass: 'bg-action dark:bg-night-accent',
    },
    {
        key: 'dikeringkan',
        label: 'Dikeringkan',
        description: 'Selesai dicuci, sedang dikeringkan.',
        icon: Wind,
        badgeClass:
            'bg-warn-tint text-warn border-warn/25 dark:bg-night-raised dark:text-night-ink-soft dark:border-warn/30',
        dotClass: 'bg-warn dark:bg-night-accent',
    },
    {
        key: 'disetrika',
        label: 'Disetrika',
        description: 'Pengeringan selesai, masuk tahap setrika.',
        icon: Flame,
        badgeClass:
            'bg-action text-action-foreground dark:bg-night-accent dark:text-night-ink dark:border-night-accent',
        dotClass: 'bg-action dark:bg-night-accent',
    },
    {
        key: 'siap_diambil',
        label: 'Siap Diambil',
        description: 'Sudah selesai dan siap diambil pelanggan.',
        icon: PackageCheck,
        badgeClass:
            'bg-ok-tint text-ok border-ok/25 dark:bg-night-raised dark:text-night-ink-soft dark:border-ok/30',
        dotClass: 'bg-ok dark:bg-night-accent',
    },
    {
        key: 'selesai',
        label: 'Selesai',
        description: 'Barang sudah diserahkan ke pelanggan.',
        icon: Check,
        badgeClass:
            'bg-action text-action-foreground dark:bg-night-accent dark:text-night-ink dark:border-night-accent',
        dotClass: 'bg-action dark:bg-night-accent',
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
        'bg-warn-tint text-warn border-warn/25 dark:bg-night-raised dark:text-night-ink-soft dark:border-warn/30',
    dotClass: 'bg-warn dark:bg-night-accent',
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
