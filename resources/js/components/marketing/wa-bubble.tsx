import { CheckCircle2, MessageCircle } from 'lucide-react';

import { cn } from '@/lib/utils';

/**
 * WaBubble — kutipan persetujuan pelanggan dari WhatsApp.
 *
 * Dipakai di sel bento fitur. Bentuknya sengaja meniru balon percakapan
 * ringkas (ekor di kanan atas) karena pelanggan Repica memang berinteraksi
 * lewat WhatsApp — bukan dekorasi chat generik. Tidak ada nomor telepon
 * yang dirender.
 *
 * @param text - Isi pesan pelanggan (Bahasa Indonesia, produk-TRUE).
 * @param time - Waktu persetujuan, ditampilkan sebagai meta.
 * @param className - Kelas tambahan untuk penempatan.
 */
export function WaBubble({
    text,
    time = '14:32',
    className,
}: {
    text: string;
    time?: string;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'border-border bg-card rounded-2xl rounded-tr-sm border p-3',
                className,
            )}
        >
            <div className="flex items-start gap-2.5">
                <span className="bg-brand-50 text-link mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full">
                    <MessageCircle className="size-3.5" aria-hidden="true" />
                </span>
                <p className="text-ink text-sm leading-relaxed">{text}</p>
            </div>
            <div className="mt-2.5 flex items-center justify-between gap-2 text-[11px]">
                <span className="text-ink-soft tabular-nums">{time}</span>
                <span className="text-success inline-flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="size-3.5" aria-hidden="true" />
                    Disetujui
                </span>
            </div>
        </div>
    );
}
