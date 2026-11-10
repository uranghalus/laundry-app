import { useEffect, useRef, useState, type ReactNode } from 'react';

import {
    motion,
    useMotionValue,
    useReducedMotion,
    useSpring,
} from 'motion/react';

import { cn } from '@/lib/utils';

/**
 * TiltCard — kemiringan ringan mengikuti pointer, ala React Bits.
 *
 * Maksimum 4 derajat, hanya pada pointer halus, dan mati total saat
 * `prefers-reduced-motion` aktif. Transformasi diterapkan pada pembungkus,
 * sehingga konten di dalamnya tetap bisa menerima fokus dan klik.
 *
 * @param children - Isi kartu.
 * @param className - Kelas pembungkus.
 * @param maxTilt - Kemiringan maksimum dalam derajat.
 */
export default function TiltCard({
    children,
    className,
    maxTilt = 4,
}: {
    children: ReactNode;
    className?: string;
    maxTilt?: number;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [isActive, setIsActive] = useState(false);
    const prefersReducedMotion = useReducedMotion();

    const rotateXValue = useMotionValue(0);
    const rotateYValue = useMotionValue(0);
    const rotateX = useSpring(rotateXValue, {
        stiffness: 220,
        damping: 24,
        mass: 0.4,
    });
    const rotateY = useSpring(rotateYValue, {
        stiffness: 220,
        damping: 24,
        mass: 0.4,
    });

    useEffect(() => {
        const finePointer = window.matchMedia('(pointer: fine)');
        const sync = () => setIsActive(finePointer.matches);

        sync();
        finePointer.addEventListener('change', sync);

        return () => finePointer.removeEventListener('change', sync);
    }, []);

    /**
     * Mengubah posisi pointer relatif kartu menjadi dua sudut kemiringan.
     *
     * @param event - Peristiwa pointer dari pembungkus kartu.
     */
    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        const element = ref.current;

        if (!element || !isActive || prefersReducedMotion) {
            return;
        }

        const rect = element.getBoundingClientRect();
        const relativeX = (event.clientX - rect.left) / rect.width - 0.5;
        const relativeY = (event.clientY - rect.top) / rect.height - 0.5;

        rotateXValue.set(relativeY * -maxTilt * 2);
        rotateYValue.set(relativeX * maxTilt * 2);
    };

    /** Mengembalikan kartu ke posisi datar saat pointer keluar. */
    const handlePointerLeave = () => {
        rotateXValue.set(0);
        rotateYValue.set(0);
    };

    if (prefersReducedMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            ref={ref}
            className={cn('[transform-style:preserve-3d]', className)}
            style={{ rotateX, rotateY, transformPerspective: 1000 }}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
        >
            {children}
        </motion.div>
    );
}
