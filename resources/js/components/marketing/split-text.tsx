import { motion, useReducedMotion } from 'motion/react';
/**
 * Judul yang masuk per kata, ala React Bits (SplitText, varian TS + Tailwind).
 *
 * Implementasi memakai `motion/react` alih-alih GSAP supaya seluruh animasi
 * halaman berbagi satu dependency. Menghormati `prefers-reduced-motion`:
 * teks langsung tampil penuh tanpa gerak.
 *
 * @param text     - Teks yang dipecah per kata.
 * @param delay    - Jeda sebelum kata pertama, dalam detik.
 * @param duration - Durasi per kata, dalam detik.
 * @param className - Kelas pewarisan tipografi dari pemanggil.
 */
export default function SplitText({
    text,
    delay = 0,
    duration = 0.55,
    className = '',
}: {
    text: string;
    delay?: number;
    duration?: number;
    className?: string;
}) {
    const prefersReducedMotion = useReducedMotion();
    const words = text.split(' ');

    const container = {
        hidden: {},
        visible: {
            transition: { staggerChildren: 0.07, delayChildren: delay },
        },
    };

    const wordVariants = {
        hidden: { y: '0.6em', opacity: 0, filter: 'blur(4px)' },
        visible: {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            transition: {
                duration,
                ease: [0.16, 1, 0.3, 1] as const,
            },
        },
    };

    if (prefersReducedMotion) {
        return <span className={className}>{text}</span>;
    }

    return (
        <motion.span
            aria-label={text}
            className={className}
            initial="hidden"
            animate="visible"
            variants={container}
        >
            {words.map((w, index) => (
                <motion.span
                    key={index}
                    initial="hidden"
                    animate="visible"
                    variants={wordVariants}
                    className="inline-block"
                >
                    {w}
                    {index < words.length - 1 ? ' ' : ''}
                </motion.span>
            ))}
        </motion.span>
    );
}
