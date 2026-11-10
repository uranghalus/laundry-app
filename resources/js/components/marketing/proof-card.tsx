import { Camera, Shirt } from 'lucide-react';

import { MetaLabel } from '@/components/marketing/layout';
import { StatusBadge } from '@/components/marketing/status-badge';
import { cn } from '@/lib/utils';

/**
 * Proof card — ilustrasi lembar bukti kondisi satu order.
 *
 * Bukan bitmap dan bukan tangkapan layar: foto digambar sebagai bidang
 * kertas dengan ikon pakaian, lalu diberi tanda air outlet, waktu, dan nomor
 * order. Label "Contoh" selalu terlihat agar tidak dibaca sebagai data live.
 *
 * @param orderId - Nomor order contoh.
 * @param outlet - Nama outlet contoh.
 * @param time - Waktu pencatatan contoh.
 * @param garment - Deskripsi pakaian contoh.
 * @param weight - Berat cucian contoh.
 * @param statusLabel - Label status pada lembar.
 * @param statusVariant - Nada status pada lembar.
 * @param className - Kelas tambahan.
 */
export function ProofCard({
    orderId = 'RC-2391',
    outlet = 'Outlet Gambir',
    time = '15:32',
    garment = '4 baju, 2 celana',
    weight = '6 kg',
    statusLabel = 'Diterima',
    statusVariant = 'success',
    className,
}: {
    orderId?: string;
    outlet?: string;
    time?: string;
    garment?: string;
    weight?: string;
    statusLabel?: string;
    statusVariant?: 'success' | 'warning' | 'action' | 'neutral' | 'bad';
    className?: string;
}) {
    const watermark = `${outlet} · ${time} · #${orderId}`;

    return (
        <div
            className={cn(
                'bg-sheet border-line shadow-card overflow-hidden rounded-lg border',
                className,
            )}
        >
            <div className="border-line flex items-center justify-between gap-3 border-b px-4 py-3">
                <div className="flex min-w-0 items-center gap-2">
                    <span
                        aria-hidden="true"
                        className="bg-action size-1.5 shrink-0 rounded-full"
                    />
                    <MetaLabel className="truncate">{outlet}</MetaLabel>
                </div>
                <span className="text-ink shrink-0 font-mono text-[11px] font-bold tabular-nums">
                    #{orderId}
                </span>
            </div>

            <div
                className="bg-paper relative aspect-[4/3] overflow-hidden"
                role="img"
                aria-label={`Ilustrasi foto kondisi ${garment} untuk order ${orderId} dari ${outlet}, pukul ${time}.`}
            >
                <div
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <Shirt
                        className="text-line-strong size-24"
                        strokeWidth={0.9}
                    />
                </div>

                <div
                    aria-hidden="true"
                    className="absolute inset-0 flex -rotate-12 flex-col items-center justify-center gap-5 opacity-15"
                >
                    {[0, 1, 2].map((line) => (
                        <p
                            key={line}
                            className="text-ink font-mono text-[11px] font-bold tracking-[0.16em] whitespace-nowrap uppercase"
                        >
                            {watermark}
                        </p>
                    ))}
                </div>

                <MetaLabel className="bg-sheet/90 border-line absolute top-3 left-3 border px-1.5 py-1">
                    Foto 1/1
                </MetaLabel>
                <MetaLabel className="bg-night text-night-ink absolute top-3 right-3 px-1.5 py-1">
                    Contoh
                </MetaLabel>

                <span className="text-ink-soft absolute bottom-3 left-3 inline-flex items-center gap-1.5">
                    <Camera className="size-3.5" aria-hidden="true" />
                    <span className="text-[11px] font-bold">Kondisi awal</span>
                </span>
            </div>

            <div className="border-line flex items-center justify-between gap-3 border-t px-4 py-3">
                <div className="min-w-0">
                    <p className="text-ink truncate text-sm font-bold">
                        {garment} · {weight}
                    </p>
                    <p className="text-ink-soft mt-0.5 font-mono text-[11px] tabular-nums">
                        {time}
                    </p>
                </div>
                <StatusBadge variant={statusVariant} label={statusLabel} />
            </div>
        </div>
    );
}
