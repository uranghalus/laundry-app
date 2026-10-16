import { useState } from 'react';

import { PIPELINE_STATUSES, getPipelineStatus } from '@/lib/pipeline-status';
import { cn } from '@/lib/utils';

/** Baris order ilustrasi untuk tabel alur kerja. Data sintetis, dilabeli. */
const ORDERS = [
    {
        id: '#RC-2418',
        customer: 'Bu Rina',
        outlet: 'Melati',
        status: 'siap_diambil',
        placed: '12 Mar',
        pickup: '14 Mar',
    },
    {
        id: '#RC-2417',
        customer: 'Pak Doni',
        outlet: 'Melati',
        status: 'dicuci',
        placed: '12 Mar',
        pickup: '15 Mar',
    },
    {
        id: '#RC-2416',
        customer: 'Mbak Ayu',
        outlet: 'Cempaka',
        status: 'menunggu_persetujuan',
        placed: '12 Mar',
        pickup: '—',
    },
    {
        id: '#RC-2415',
        customer: 'Pak Hendra',
        outlet: 'Cempaka',
        status: 'disetrika',
        placed: '11 Mar',
        pickup: '14 Mar',
    },
    {
        id: '#RC-2414',
        customer: 'Bu Sari',
        outlet: 'Melati',
        status: 'selesai',
        placed: '11 Mar',
        pickup: '13 Mar',
    },
] as const;

/** Filter status yang tersedia pada tabel; `semua` menampilkan seluruh baris. */
const FILTERS = [
    { key: 'semua', label: 'Semua' },
    { key: 'dicuci', label: 'Dicuci' },
    { key: 'siap_diambil', label: 'Siap Diambil' },
    { key: 'selesai', label: 'Selesai' },
] as const;

/**
 * Band alur kerja — kiri narasi, kanan tabel order yang BENAR-BENAR berfungsi.
 *
 * Filter status memfilter baris secara nyata (bukan hiasan), dan setiap badge
 * status memakai kosakata bersama `lib/pipeline-status.ts` (prinsip P3: warna,
 * ikon, dan kata identik dengan aplikasi, WA, dan halaman approval).
 */
export default function MarketingPipeline() {
    const [activeFilter, setActiveFilter] =
        useState<(typeof FILTERS)[number]['key']>('semua');

    const visibleOrders =
        activeFilter === 'semua'
            ? ORDERS
            : ORDERS.filter((order) => order.status === activeFilter);

    return (
        <section className="bg-muted/40 border-y" id="alur">
            <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:gap-14">
                <div>
                    <h2 className="text-display-3 font-bold tracking-[-0.03em] text-balance">
                        Satu klik kasir, pelanggan langsung tahu
                    </h2>
                    <p className="text-muted-foreground mt-4 max-w-lg text-lg leading-relaxed">
                        Status mengikuti alur tetap — Diterima sampai Selesai.
                        Setiap perubahan mengirim WhatsApp otomatis, dan filter
                        di tabel ini benar-benar bekerja; coba saja.
                    </p>

                    <ol className="mt-8 space-y-3">
                        {PIPELINE_STATUSES.slice(0, 3).map((status, index) => (
                            <li
                                className="flex items-center gap-3"
                                key={status.key}
                            >
                                <span
                                    aria-hidden="true"
                                    className={cn(
                                        'size-2.5 shrink-0 rounded-full',
                                        status.dotClass,
                                    )}
                                />
                                <span className="text-sm font-semibold">
                                    {status.label}
                                </span>
                                <span className="text-muted-foreground text-sm">
                                    {index === 0
                                        ? '— foto kondisi awal bila berisiko tinggi'
                                        : index === 1
                                          ? '— WhatsApp "order dibuat" terkirim'
                                          : '— WhatsApp terkirim otomatis'}
                                </span>
                            </li>
                        ))}
                        <li className="text-muted-foreground flex items-center gap-3 pl-5 text-sm">
                            + 3 tahap lagi sampai Selesai
                        </li>
                    </ol>
                </div>

                <div className="bg-card rounded-card border p-5 shadow-[0_24px_48px_-32px_rgb(28_25_23/0.4)]">
                    <div
                        aria-label="Filter status order"
                        className="flex flex-wrap gap-2"
                        role="group"
                    >
                        {FILTERS.map((filter) => (
                            <button
                                aria-pressed={activeFilter === filter.key}
                                className={cn(
                                    'min-h-11 rounded-full px-4 text-sm font-medium transition-colors',
                                    activeFilter === filter.key
                                        ? 'bg-brand-700 dark:bg-brand-50 text-primary-foreground dark:text-brand-900'
                                        : 'text-muted-foreground hover:bg-accent border',
                                )}
                                key={filter.key}
                                onClick={() => setActiveFilter(filter.key)}
                                type="button"
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>

                    <table className="mt-4 w-full text-sm">
                        <caption className="sr-only">
                            Daftar order dengan status yang dapat difilter
                        </caption>
                        <thead>
                            <tr className="text-muted-foreground border-border border-b text-left text-xs">
                                <th className="py-2 pr-2 font-medium">Order</th>
                                <th className="py-2 pr-2 font-medium">
                                    Pelanggan
                                </th>
                                <th className="py-2 pr-2 font-medium">
                                    Outlet
                                </th>
                                <th className="py-2 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-border divide-y">
                            {visibleOrders.map((order) => {
                                const status = getPipelineStatus(order.status);

                                return (
                                    <tr
                                        className="hover:bg-accent/50 transition-colors"
                                        key={order.id}
                                    >
                                        <td
                                            className="py-2.5 pr-2 font-semibold tabular-nums"
                                            data-numeric
                                        >
                                            {order.id}
                                        </td>
                                        <td className="py-2.5 pr-2">
                                            {order.customer}
                                        </td>
                                        <td className="text-muted-foreground py-2.5 pr-2">
                                            {order.outlet}
                                        </td>
                                        <td className="py-2.5">
                                            {status ? (
                                                <span
                                                    className={cn(
                                                        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
                                                        status.badgeClass,
                                                    )}
                                                >
                                                    <status.icon className="size-3.5" />
                                                    {status.label}
                                                </span>
                                            ) : null}
                                        </td>
                                    </tr>
                                );
                            })}
                            {visibleOrders.length === 0 ? (
                                <tr>
                                    <td
                                        className="text-muted-foreground py-6 text-center"
                                        colSpan={4}
                                    >
                                        Tidak ada order dengan status ini
                                    </td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>

                    <p className="text-muted-foreground mt-4 text-xs">
                        Data ilustrasi dengan kosakata status yang sama persis
                        dengan aplikasi.
                    </p>
                </div>
            </div>
        </section>
    );
}
