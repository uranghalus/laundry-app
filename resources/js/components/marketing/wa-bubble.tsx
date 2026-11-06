import { MessageCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * WhatsApp bubble - bubble pesan persetujuan pelanggan dengan tanda
 * "Diterima", sepadan kartu bukti di sachet hero. Dipakai di SachetPreview
 * dan sel konten fitur. Tidak ada nomor telepon asli yang dirender.
 * Permukaan memakai token Sachet Pop (`brand-foam`, `brand-edge`, `ok`).
 *
 * @param text - Teks isi bubble (Bahasa Indonesia, produk-true).
 * @param time - Waktu stamp (contoh: '14:32'), ditampilkan sebagai label kecil.
 * @param approved - Jika true, tampilkan ikon centang + 'Diterima'.
 */
export function WaBubble({
    text,
    time = '14:32',
    approved = true,
}: {
    text: string;
    time?: string;
    approved?: boolean;
}) {
    return (
        <div
            className={cn(
                'bg-brand-foam border-brand-edge relative max-w-xs rounded-[var(--radius-sachet)] rounded-tl-sm border p-3 shadow-card',
                approved ? 'border-brand/60' : '',
            )}
        >
            <div className="mb-1.5 flex items-start gap-1.5">
                <div className="bg-action flex size-6 items-center justify-center rounded-md">
                    <MessageCircle
                        className="size-3.5 text-white"
                        aria-hidden="true"
                    />
                </div>
                <p className="text-ink text-sm leading-relaxed font-medium">
                    {text}
                </p>
            </div>
            <div className="flex items-end justify-between gap-1 pt-1">
                <span className="text-ink-soft text-[10px] tabular-nums">
                    {time}
                </span>
                {approved && (
                    <span className="text-ok inline-flex items-center gap-1 text-[10px] font-bold tabular-nums">
                        <CheckCircle className="size-3.5" aria-hidden="true" />
                        Diterima
                    </span>
                )}
            </div>
        </div>
    );
}
