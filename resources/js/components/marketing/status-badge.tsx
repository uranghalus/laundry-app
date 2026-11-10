import { cn } from '@/lib/utils';

/**
 * Status badge — label status kecil dengan ikon opsional.
 *
 * Badge statis tidak memakai `role="status"`; live region hanya dipakai
 * ketika status benar-benar berubah (mis. pada demo alur bukti).
 *
 * @param variant - Nada semantik badge.
 * @param label - Teks status yang ditampilkan.
 * @param icon - Ikon lucide opsional di depan label.
 * @param className - Kelas tambahan.
 */
export function StatusBadge({
    variant = 'neutral',
    label,
    icon: Icon,
    className,
}: {
    variant?: 'success' | 'warning' | 'action' | 'neutral' | 'bad';
    label: string;
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    className?: string;
}) {
    const variants = {
        success: 'bg-ok-tint text-ok border-ok/25',
        warning: 'bg-warn-tint text-warn border-warn/25',
        action: 'bg-graphic-tint text-action-text border-action/20',
        bad: 'bg-bad-tint text-bad border-bad/25',
        neutral: 'bg-muted text-ink-soft border-line',
    } as const;

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-sm border px-2 py-1 text-[11px] leading-none font-bold',
                variants[variant],
                className,
            )}
        >
            {Icon ? <Icon className="size-3.5" aria-hidden="true" /> : null}
            <span className="tabular-nums">{label}</span>
        </span>
    );
}
