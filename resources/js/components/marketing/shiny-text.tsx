import type { CSSProperties } from 'react';

/**
 * Teks berkilau ala React Bits (ShinyText, varian TS + Tailwind).
 *
 * Kilau adalah sapuan gradient yang melintas pada teks — murni CSS, tanpa
 * dependency JS. Dipakai hemat: satu momen di hero, bukan di setiap judul.
 *
 * @param text      - Isi teks yang diberi efek kilau.
 * @param speed     - Durasi satu siklus kilau dalam detik.
 * @param disabled  - Matikan efek (mis. saat `prefers-reduced-motion` di level komponen induk).
 * @param className - Kelas tambahan (ukuran & warna dasar teks dari sini).
 */
export default function ShinyText({
    text,
    speed = 4,
    disabled = false,
    className = '',
}: {
    text: string;
    speed?: number;
    disabled?: boolean;
    className?: string;
}) {
    const style: CSSProperties | undefined = disabled
        ? undefined
        : {
              backgroundSize: '250% 100%',
              animation: `shiny-text ${speed}s linear infinite`,
          };

    return (
        <span
            className={
                'bg-[linear-gradient(110deg,#0c5f59,45%,#5eead4,55%,#0c5f59)] bg-clip-text text-transparent dark:bg-[linear-gradient(110deg,#e6f4f2,45%,#0f766e,55%,#e6f4f2)] ' +
                className
            }
            style={style}
        >
            {text}
        </span>
    );
}
