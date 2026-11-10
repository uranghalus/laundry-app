import { CheckCheck, MessageCircle } from 'lucide-react';

import { cn } from '@/lib/utils';

/**
 * WhatsApp bubble — ilustrasi pesan persetujuan pelanggan.
 *
 * Bukan tangkapan layar dan tidak memuat nomor telepon. Dipakai di artefak
 * bukti dan demo alur; label waktu memakai mono karena merupakan data.
 *
 * @param text - Isi pesan (Bahasa Indonesia, produk-true).
 * @param time - Waktu contoh, mis. `14:32`.
 * @param approved - Jika true, tampilkan tanda "Disetujui".
 * @param className - Kelas tambahan.
 */
export function WaBubble({
    text,
    time = '14:32',
    approved = true,
    className,
}: {
    text: string;
    time?: string;
    approved?: boolean;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'bg-sheet border-line shadow-card relative max-w-xs rounded-lg rounded-tl-sm border p-3.5',
                className,
            )}
        >
            <div className="mb-2 flex items-center gap-2">
                <span className="bg-action text-action-foreground flex size-6 items-center justify-center rounded-sm">
                    <MessageCircle className="size-3.5" aria-hidden="true" />
                </span>
                <span className="text-ink-soft font-mono text-[11px] font-semibold tracking-[0.12em] uppercase">
                    WhatsApp · pelanggan
                </span>
            </div>

            <p className="text-ink text-sm leading-relaxed font-medium">
                {text}
            </p>

            <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-ink-soft font-mono text-[11px] tabular-nums">
                    {time}
                </span>
                {approved ? (
                    <span className="text-ok inline-flex items-center gap-1 text-[11px] font-bold">
                        <CheckCheck className="size-3.5" aria-hidden="true" />
                        Disetujui
                    </span>
                ) : null}
            </div>
        </div>
    );
}
