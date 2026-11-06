import { CheckCircle, Clock, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Status badge - pill sachet kecil berisi ikon + label, untuk status pipeline
 * (Diterima / Menunggu Persetujuan / Ditolak) maupun sel konten. Varian warna
 * diikat pada token semantik `@theme` Sachet Pop: ok / warn / wait / bad /
 * brand-tint / netral. Tidak ada hex polos dan tidak ada kelas skala v3 yang
 * sudah mati.
 *
 * @param variant - 'success' | 'warning' | 'info' | 'neutral' | 'brand' | 'bad'
 * @param label - Teks status yang ditampilkan.
 * @param icon - Ikon lucide opsional di depan label.
 */
export function StatusBadge({
    variant = 'info',
    label,
    icon: Icon,
}: {
    variant?: 'success' | 'warning' | 'info' | 'neutral' | 'brand' | 'bad';
    label: string;
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
    const base =
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold transition-colors duration-200';
    const variants = {
        success: 'bg-ok-tint text-ok border-ok/25',
        warning: 'bg-warn-tint text-warn border-warn/25',
        info: 'bg-wait-tint text-wait border-wait/25',
        bad: 'bg-bad-tint text-bad border-bad/25',
        brand: 'bg-brand-tint text-action border-brand-edge',
        neutral: 'bg-brand-foam text-ink-soft border-line',
    };

    return (
        <span
            className={cn(base, variants[variant])}
            role="status"
            aria-label={label}
        >
            {Icon && <Icon className="size-3.5" aria-hidden="true" />}
            <span className="tabular-nums">{label}</span>
        </span>
    );
}
