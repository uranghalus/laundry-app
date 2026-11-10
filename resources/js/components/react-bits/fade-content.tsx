import { useRef, type ReactNode } from 'react';

import { motion, useInView, useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';

/**
 * FadeContent — reveal saat elemen masuk viewport, ala React Bits.
 *
 * Hanya memakai `transform` dan `opacity`, dipicu sekali, dan langsung
 * menampilkan keadaan akhir saat `prefers-reduced-motion` aktif. Dipakai
 * untuk bagian di bawah lipatan; elemen LCP tidak boleh dibungkus komponen
 * ini.
 *
 * @param children - Isi yang akan direveal.
 * @param className - Kelas pembungkus.
 * @param delay - Jeda detik sebelum animasi dimulai.
 * @param distance - Jarak geser vertikal dalam piksel.
 * @param once - Jika true, animasi hanya berjalan sekali.
 */
export default function FadeContent({
    children,
    className,
    delay = 0,
    distance = 18,
    once = true,
}: {
    children: ReactNode;
    className?: string;
    delay?: number;
    distance?: number;
    once?: boolean;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once, margin: '0px 0px -10% 0px' });
    const prefersReducedMotion = useReducedMotion();

    if (prefersReducedMotion) {
        return (
            <div ref={ref} className={className}>
                {children}
            </div>
        );
    }

    return (
        <motion.div
            ref={ref}
            className={cn(className)}
            initial={{ opacity: 0, y: distance }}
            animate={
                isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: distance }
            }
            transition={{
                duration: 0.65,
                delay,
                ease: [0.16, 1, 0.3, 1],
            }}
        >
            {children}
        </motion.div>
    );
}
