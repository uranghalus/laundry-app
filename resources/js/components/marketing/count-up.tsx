import { useEffect, useRef, useState } from 'react';

import { useInView, useReducedMotion } from 'motion/react';

/**
 * Angka yang menghitung naik saat masuk viewport, ala React Bits (CountUp).
 *
 * Dibangun di atas `motion/react` (satu-satunya dependency animasi proyek).
 * Menghormati `prefers-reduced-motion`: langsung tampil angka akhir.
 *
 * @param to        - Angka akhir.
 * @param from      - Angka awal (default 0).
 * @param duration  - Durasi animasi dalam detik.
 * @param delay     - Jeda sebelum mulai, dalam detik.
 * @param separator - Pemisah ribuan (default titik, format Indonesia).
 * @param prefix    - Teks sebelum angka, mis. `< `.
 * @param suffix    - Teks setelah angka, mis. ` menit`.
 */
export default function CountUp({
    to,
    from = 0,
    duration = 1.4,
    delay = 0,
    separator = '.',
    prefix = '',
    suffix = '',
    className = '',
}: {
    to: number;
    from?: number;
    duration?: number;
    delay?: number;
    separator?: string;
    prefix?: string;
    suffix?: string;
    className?: string;
}) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-40px' });
    const prefersReducedMotion = useReducedMotion();
    // `null` = belum dianimasikan. SSR dan frame pertama menampilkan angka
    // AKHIR supaya harga terbaca crawler dan tidak berkedip dari nol;
    // animasi hanya hidup setelah komponen terlihat di klien.
    const [animatedValue, setAnimatedValue] = useState<number | null>(null);

    useEffect(() => {
        if (!isInView) {
            return;
        }

        if (prefersReducedMotion) {
            setAnimatedValue(to);

            return;
        }

        let frame = 0;
        let start: number | null = null;
        let timer = 0;

        const step = (time: number): void => {
            if (start === null) {
                start = time;
            }

            const elapsed = (time - start) / 1000 - delay;

            if (elapsed < 0) {
                frame = requestAnimationFrame(step);

                return;
            }

            const progress = Math.min(elapsed / duration, 1);
            // easeOutExpo: cepat di awal, melambat halus di ujung.
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

            setAnimatedValue(from + (to - from) * eased);

            if (progress < 1) {
                frame = requestAnimationFrame(step);
            }
        };

        frame = requestAnimationFrame(step);

        return () => {
            cancelAnimationFrame(frame);
            window.clearTimeout(timer);
        };
    }, [isInView, prefersReducedMotion, to, from, duration, delay]);

    const displayValue = animatedValue ?? to;

    const formatted = Math.round(displayValue)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, separator);

    return (
        <span className={className} ref={ref}>
            {prefix}
            {formatted}
            {suffix}
        </span>
    );
}
