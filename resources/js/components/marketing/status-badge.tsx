import { cn } from '@/lib/utils';

type StatusVariant = 'success' | 'warning' | 'info' | 'neutral' | 'error';

/**
 * StatusBadge — pill status dengan ikon + label.
 *
 * Status tidak pernah dibawa oleh warna saja: ikon dan teks selalu ada,
 * supaya pembaca dengan buta warna tetap membedakan "Siap Diambil" dan
 * "Selesai". Komponen ini tidak lagi memasang `role="status"` secara
 * default — badge statis bukan live region, dan belasan badge dalam satu
 * halaman akan membanjiri pembaca layar. Kalau status benar-benar berubah
 * dinamis, bungkus dengan `<div aria-live="polite">` di pemakainya.
 *
 * @param variant - Warna status.
 * @param label - Teks status yang ditampilkan.
 * @param icon - Ikon lucide opsional di depan label.
 * @param className - Kelas tambahan untuk penempatan.
 */
export function StatusBadge({
    variant = 'info',
    label,
    icon: Icon,
    className,
}: {
    variant?: StatusVariant;
    label: string;
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    className?: string;
}) {
    const variants: Record<StatusVariant, string> = {
        success: 'bg-success-tint text-success border-success/25',
        warning: 'bg-warning-tint text-warning border-warning/25',
        info: 'bg-brand-50 text-link border-brand-200',
        neutral: 'bg-band text-ink-soft border-border',
        error: 'bg-error-tint text-error border-error/25',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap',
                variants[variant],
                className,
            )}
        >
            {Icon ? <Icon className="size-3.5" aria-hidden="true" /> : null}
            <span className="tabular-nums">{label}</span>
        </span>
    );
}
