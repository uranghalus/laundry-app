import { useEffect, useRef, useState, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * SpotlightCard — sorotan radial yang mengikuti kursor, ala React Bits.
 *
 * Hanya aktif pada perangkat dengan pointer halus dan saat pengguna tidak
 * meminta gerak dikurangi. Sorotan adalah lapisan `aria-hidden`; konten dan
 * fokus keyboard tidak terpengaruh.
 *
 * @param children - Isi kartu.
 * @param className - Kelas pembungkus.
 */
export default function SpotlightCard({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const finePointer = window.matchMedia('(pointer: fine)');
        const reducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        );

        const sync = () => {
            setIsActive(finePointer.matches && !reducedMotion.matches);
        };

        sync();
        finePointer.addEventListener('change', sync);
        reducedMotion.addEventListener('change', sync);

        return () => {
            finePointer.removeEventListener('change', sync);
            reducedMotion.removeEventListener('change', sync);
        };
    }, []);

    /**
     * Menulis posisi pointer ke CSS variable; tidak memicu render React.
     *
     * @param event - Peristiwa pointer dari pembungkus kartu.
     */
    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        const element = ref.current;

        if (!element || !isActive) {
            return;
        }

        const rect = element.getBoundingClientRect();
        element.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
        element.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
    };

    return (
        <div
            ref={ref}
            className={cn('group relative isolate overflow-hidden', className)}
            onPointerMove={handlePointerMove}
        >
            {isActive ? (
                <span
                    aria-hidden="true"
                    className="spotlight-surface pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
            ) : null}
            <div className="relative">{children}</div>
        </div>
    );
}
