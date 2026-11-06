import { Image, ShieldCheck, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Proof card - kartu bukti kondisi order di dalam sachet hero (bukan bitmap):
 * permukaan sheet dengan watermark memo simulasi ("15:32 - OUTLET GAMBIR -
 * RC-2391") dan cap status. Kelas warna hanya token Sachet Pop (`ok`,
 * `brand-*`, `line`), elevation satu tingkat (`shadow-card`). Semua elemen
 * media berdimesi eksplisit agar CLS tidak terpengaruh.
 *
 * @param orderId - ID order (contoh: 'RC-2391'), ditampilkan sebagai tabular-nums.
 * @param garment - Deskripsi pakaian (contoh: '4 baju, 2 celana').
 * @param weight - Berat cucian (contoh: '6 kg').
 * @param statusLabel - Label status (contoh: 'Diterima').
 * @param time - Waktu stamp (contoh: '15:32').
 * @param outlet - Nama outlet (contoh: 'Outlet Gambir').
 */
export function ProofCard({
    orderId = 'RC-2391',
    garment = '4 baju, 2 celana',
    weight = '6 kg',
    statusLabel = 'Diterima',
    time = '15:32',
    outlet = 'Outlet Gambir',
}: {
    orderId?: string;
    garment?: string;
    weight?: string;
    statusLabel?: string;
    time?: string;
    outlet?: string;
}) {
    return (
        <div className="bg-brand-foam border-brand-edge relative overflow-hidden rounded-[var(--radius-sachet)] border p-5 shadow-card">
            {/* Tanda air simulasi - tidak ada gambar asli, ukuran eksplisit. */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10 select-none">
                <Image className="text-ink size-32" aria-hidden="true" />
            </div>
            <div className="relative z-10 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                    <span className="text-ink text-xs font-bold tabular-nums">
                        {outlet}
                    </span>
                    <span className="text-action text-xs font-bold tabular-nums">
                        #{orderId}
                    </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                    <p className="text-ink-soft text-sm leading-none font-medium">
                        {garment} · {weight}
                    </p>
                    <span
                        className={cn(
                            'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold',
                            statusLabel === 'Diterima'
                                ? 'bg-ok-tint text-ok border-ok/25'
                                : 'bg-wait-tint text-wait border-wait/25',
                        )}
                    >
                        <ShieldCheck className="size-3.5" aria-hidden="true" />{' '}
                        {statusLabel}
                    </span>
                </div>
                <div className="text-ink-soft border-line flex items-center gap-2 border-t pt-2 text-[11px] font-medium tabular-nums">
                    <Clock className="size-3.5" aria-hidden="true" />
                    <span>
                        {time} · foto kondisi awal tercap & berwatermark
                    </span>
                </div>
            </div>
        </div>
    );
}
