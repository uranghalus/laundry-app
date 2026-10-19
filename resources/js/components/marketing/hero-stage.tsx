import { Fragment, useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import {
    motion,
    useMotionValue,
    useReducedMotion,
    useSpring,
    useTransform,
} from 'motion/react';
import {
    Camera,
    Check,
    CheckCheck,
    Clock,
    Pause,
    Play,
    ShieldCheck,
} from 'lucide-react';

import CountUp from '@/components/react-bits/count-up';
import Particles from '@/components/react-bits/particles';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

/**
 * Panggung kanan hero — rantai bukti yang bisa ditonton ATAU dipegang.
 *
 * SATU kartu detail order menampilkan seluruh rantai bukti sekaligus dan
 * selalu UTUH: foto berwatermark, gelembung persetujuan WhatsApp, dan baris
 * jejak audit tidak pernah menghilang — nol ruang kosong di dalam kartu, nol
 * pergeseran layout di layar mana pun. Loop 4 langkah hanya memindahkan
 * penekanan (ring teal), mencap watermark, dan menukar pill status (Menunggu
 * → Disetujui); tidak ada kontrol yang berjejer di dalam kartu.
 *
 * Interaksi yang tersedia pengunjung:
 * - Rail langkah di bawah kartu: klik/keyboard untuk melompat ke langkah mana
 *   pun; satu kali pilih membuat loop berhenti otomatis (pengunjung memegang
 *   kendali), dengan tombol jeda/lanjut untuk mengembalikannya.
 * - Loop juga berhenti saat kursor menguasai rail, kartu tidak terlihat, atau
 *   tab sembunyi — tidak ada animasi yang jalan saat tak seharusnya dilihat.
 * - Medan partikel bereaksi: parallax halus saat kursor masuk panggung dan
 *   burst saat panggung diklik (bawaan `Particles`, `clickBurst`), sehingga
 *   latar ikut "hidup" disentuh.
 * - Kartu miring tipis mengikuti kursor (khusus mouse) sebagai umpan balik
 *   kedalaman; tetap datar di layar sentuh.
 *
 * Momen yang diakten: cap watermark yang menghentak turun ke foto — stempel
 * adalah mekanisme produk sendiri, bukan hiasan generik.
 *
 * `prefers-reduced-motion`: loop tidak berjalan sendiri, kartu langsung
 * membuka state akhir (Disetujui) sehingga narasi utuh tanpa gerak; rail
 * tetap berfungsi dan hanya mengganti warna/opacity.
 */

/** Durasi tiap langkah (ms) — seluruh rantai selesai ±5,4 detik, sesuai
 *  STORY surface brief ("foto→watermark→WA→setuju dalam 5 detik"). */
const PROOF_STEP_DURATIONS = [1100, 1100, 1400, 2200] as const;

/** Label pendek rail + deskripsi untuk `aria-label` tiap langkah. */
const PROOF_STEPS = [
    { label: 'Foto', description: 'Foto kondisi awal diambil' },
    {
        label: 'Stempel',
        description: 'Watermark tercap dan jejak audit tercatat',
    },
    {
        label: 'WA',
        description: 'Persetujuan pelanggan diterima lewat WhatsApp',
    },
    { label: 'Disetujui', description: 'Status disetujui dan disegel' },
] as const;

/** Easing tiba meyakinkan — dipakai semua transisi masuk di panggung ini. */
const PROOF_EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Foto kondisi berwatermark — jantung rantai bukti (FR-9.1/FR-9.2).
 *
 * Scene digambar sebagai TUMPUKAN PAKAIAN MELIPAT (rose di atas biru) di
 * atas latar kain berlipat — terbaca sebagai foto laundry sungguhan yang
 * berwarna, bukan siluet kaos raksasa yang mendominasi kartu. Rasio 16/10
 * supaya foto adalah konten, bukan halaman.
 *
 * Watermark SELALU tampil (ia menempel di file, bukan muncul di antarmuka);
 * gerak "cap" hanya diputar ulang saat loop melewati langkah Stempel.
 *
 * @param isActive             - Langkah "Foto" sedang aktif: foto diberi ring penekanan teal.
 * @param isStamped            - Loop melewati langkah Stempel: cap watermark bergerak turun.
 * @param prefersReducedMotion - Bila true, cap langsung utuh tanpa gerak.
 */
function GarmentPhoto({
    isActive,
    isStamped,
    prefersReducedMotion,
}: {
    isActive: boolean;
    isStamped: boolean;
    prefersReducedMotion: boolean;
}) {
    return (
        <div
            className={cn(
                'relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-gradient-to-br from-rose-200 via-rose-100 to-sky-100 transition-shadow duration-300',
                isActive && 'ring-brand-700/30 dark:ring-brand-50/25 ring-2',
            )}
        >
            {/*
             * Tumpukan pakaian melipat — dua potong bersih (blus biru di
             * bawah, dress rose di atas) dengan lipatan dan kerah V. Warna
             * cerahnya yang membuat panggung terasa hidup.
             */}
            <svg
                aria-hidden="true"
                className="absolute inset-0 size-full"
                fill="none"
                viewBox="0 0 160 100"
            >
                {/* Lipatan kain latar. */}
                <path
                    d="M-10 26 C 40 18, 100 36, 170 24"
                    stroke="#ffffff"
                    strokeOpacity="0.4"
                    strokeWidth="7"
                />
                <path
                    d="M-10 66 C 50 58, 110 76, 170 62"
                    stroke="#ffffff"
                    strokeOpacity="0.28"
                    strokeWidth="9"
                />
                {/* Bayangan lembut di bawah tumpukan. */}
                <ellipse
                    cx="80"
                    cy="84"
                    fill="#0f172a"
                    fillOpacity="0.14"
                    rx="44"
                    ry="6"
                />
                {/* Potongan bawah — blus biru langit. */}
                <rect
                    fill="#38bdf8"
                    fillOpacity="0.9"
                    height="17"
                    rx="5"
                    width="84"
                    x="38"
                    y="63"
                />
                <path
                    d="M60 63v17M100 63v17"
                    stroke="#0369a1"
                    strokeOpacity="0.35"
                    strokeWidth="1.5"
                />
                {/* Potongan atas — dress rose dengan kerah V. */}
                <rect
                    fill="#fb7185"
                    fillOpacity="0.95"
                    height="20"
                    rx="5"
                    width="72"
                    x="44"
                    y="43"
                />
                <path
                    d="M74 43l6 7 6-7"
                    stroke="#9f1239"
                    strokeOpacity="0.45"
                    strokeLinecap="round"
                    strokeWidth="2"
                />
                <path
                    d="M58 43v20M102 43v20"
                    stroke="#be123c"
                    strokeOpacity="0.35"
                    strokeWidth="1.5"
                />
            </svg>

            {/* Kilau kain — highlight lembut supaya terasa seperti foto asli. */}
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(circle_at_32%_22%,rgb(255_255_255/0.5),transparent_58%)]"
            />

            {/*
             * Watermark otomatis (FR-9.2) — selalu menempel di file. Dimount
             * ulang per siklus loop hanya untuk memutar gerak cap yang
             * menghentak turun saat langkah Stempel dicapai.
             */}
            <motion.span
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                className="absolute inset-x-0 bottom-0 bg-stone-900/70 px-2 py-1 text-center text-[0.58rem] leading-tight text-stone-50"
                data-numeric
                initial={
                    isStamped && !prefersReducedMotion
                        ? { opacity: 1, rotate: -2.5, scale: 1.25 }
                        : { opacity: 1 }
                }
                key={isStamped ? 'watermark-stamped' : 'watermark-plain'}
                transition={{ duration: 0.32, ease: PROOF_EASE }}
            >
                12/03/2026 14:32 · RC-2418 · dress sutra
            </motion.span>
        </div>
    );
}

/**
 * Rail langkah rantai bukti di bawah kartu — kendali utama walkthrough.
 *
 * Menampilkan langkah aktif (dot + label terisi teal), garis progres antar
 * langkah, dan tombol jeda/lanjut. Semua kontrol adalah `<button>` nyata
 * dengan `aria-current="step"`, target sentuh ≥40px, dan focus ring brand
 * (mengikuti pola tombol marketing di `pipeline.tsx`). Hover kursor pada rail
 * menahan loop otomatis sementara — pengunjung sedang membaca pilihan.
 *
 * @param activeStep       - Indeks langkah aktif (0-based).
 * @param isAutoPlaying    - Status loop otomatis; menentukan ikon jeda/lanjut.
 * @param onStepSelect     - Dipanggil saat pengunjung memilih langkah secara manual.
 * @param onToggleAutoPlay - Dipanggil saat tombol jeda/lanjut ditekan.
 * @param onHoveredChange  - Memancarkan status hover rail (khusus mouse) ke induk.
 */
function ProofStepRail({
    activeStep,
    isAutoPlaying,
    onStepSelect,
    onToggleAutoPlay,
    onHoveredChange,
}: {
    activeStep: number;
    isAutoPlaying: boolean;
    onStepSelect: (index: number) => void;
    onToggleAutoPlay: () => void;
    onHoveredChange: (isHovered: boolean) => void;
}) {
    /**
     * Hover rail menahan loop sementara; sentuh sengaja diabaikan agar
     * tombol jeda tetap bekerja di HP (tap tanpa mouse-leave).
     */
    const handlePointerEnter = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (event.pointerType === 'mouse') {
            onHoveredChange(true);
        }
    };
    const handlePointerLeave = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (event.pointerType === 'mouse') {
            onHoveredChange(false);
        }
    };

    const pauseLabel = isAutoPlaying
        ? 'Jeda loop bukti'
        : 'Lanjutkan loop bukti';

    return (
        <div
            aria-label="Alur bukti kondisi"
            className="mt-3 flex w-full items-center gap-1"
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
            role="group"
        >
            {PROOF_STEPS.map((step, index) => (
                <Fragment key={step.label}>
                    {index > 0 ? (
                        <span
                            aria-hidden="true"
                            className={cn(
                                'h-px flex-1 rounded-full transition-colors duration-300',
                                activeStep >= index
                                    ? 'bg-brand-700/60 dark:bg-brand-50/50'
                                    : 'bg-border',
                            )}
                        />
                    ) : null}
                    <button
                        aria-current={index === activeStep ? 'step' : undefined}
                        aria-label={`Langkah ${index + 1} dari ${PROOF_STEPS.length}: ${step.description}`}
                        className={cn(
                            'focus-visible:ring-brand-700 dark:focus-visible:ring-brand-50 focus-visible:ring-offset-background flex min-h-10 min-w-10 items-center justify-center gap-1.5 rounded-full px-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:min-w-auto sm:justify-start sm:px-2',
                            index === activeStep
                                ? 'bg-brand-700 text-primary-foreground dark:bg-brand-50 dark:text-brand-900'
                                : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                        )}
                        onClick={() => onStepSelect(index)}
                        type="button"
                    >
                        <span
                            aria-hidden="true"
                            className={cn(
                                'size-1.5 shrink-0 rounded-full transition-colors',
                                index === activeStep
                                    ? 'bg-primary-foreground dark:bg-brand-900'
                                    : 'bg-muted-foreground/50',
                            )}
                        />
                        <span className="text-[0.7rem] font-semibold tracking-tight whitespace-nowrap">
                            <span className="sr-only sm:not-sr-only">
                                {step.label}
                            </span>
                        </span>
                    </button>
                </Fragment>
            ))}
            <button
                aria-label={pauseLabel}
                className="focus-visible:ring-brand-700 dark:focus-visible:ring-brand-50 text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-offset-background ml-auto flex size-10 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                onClick={onToggleAutoPlay}
                title={pauseLabel}
                type="button"
            >
                {isAutoPlaying ? (
                    <Pause aria-hidden="true" className="size-3.5" />
                ) : (
                    <Play aria-hidden="true" className="size-3.5" />
                )}
            </button>
        </div>
    );
}

/**
 * Panggung kanan hero — etalase satu-satunya: bukti kondisi yang bekerja.
 *
 * Komposisi diwarisi dari versi statis (kartu PoC + chip CountUp + medan
 * partikel teal/amber); yang berubah adalah perilaku: kartu kini menjalankan
 * loop bukti 4 langkah yang bisa dijeda, dipilih, dan disentuh — tanpa
 * menambah kontrol ke dalam kartu dan tanpa menggeser layout satu piksel pun.
 */
export default function HeroStage() {
    const { resolvedAppearance } = useAppearance();
    const prefersReducedMotion = useReducedMotion() ?? false;

    const [activeStep, setActiveStep] = useState(() =>
        // Reduced motion: langsung di langkah terakhir supaya narasi
        // utuh (foto + watermark + WA + Disetujui) tampil statis.
        prefersReducedMotion ? PROOF_STEPS.length - 1 : 0,
    );
    const [isAutoPlaying, setIsAutoPlaying] = useState(
        () => !prefersReducedMotion,
    );
    const [isRailHovered, setIsRailHovered] = useState(false);
    const [isStageVisible, setIsStageVisible] = useState(true);
    const [isPageVisible, setIsPageVisible] = useState(
        () => typeof document === 'undefined' || !document.hidden,
    );

    const stageRef = useRef<HTMLDivElement>(null);

    const isApproved = activeStep === PROOF_STEPS.length - 1;
    const isAuditShown = activeStep >= 1;

    /**
     * Respons atas perubahan preferensi reduced motion di tengah sesi:
     * hentikan loop dan buka narasi ke state akhir yang utuh.
     */
    useEffect(() => {
        if (!prefersReducedMotion) {
            return;
        }
        setIsAutoPlaying(false);
        setActiveStep(PROOF_STEPS.length - 1);
    }, [prefersReducedMotion]);

    /** Loop otomatis wajib berhenti saat tab sembunyi (animate.md). */
    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsPageVisible(!document.hidden);
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () =>
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange,
            );
    }, []);

    /** Loop otomatis wajib berhenti saat panggung keluar viewport. */
    useEffect(() => {
        const stage = stageRef.current;
        if (!stage) {
            return undefined;
        }
        const observer = new IntersectionObserver(
            (entries) =>
                setIsStageVisible(
                    entries.some((entry) => entry.isIntersecting),
                ),
            { threshold: 0.15 },
        );
        observer.observe(stage);
        return () => observer.disconnect();
    }, []);

    /**
     * Jantung loop: maju ke langkah berikutnya (melingkar) hanya ketika
     * pengunjung tidak sedang memegang kendali dan panggung benar-benar
     * terlihat; timer selalu di-reset saat langkah atau kondisi berubah.
     */
    const shouldAutoAdvance =
        isAutoPlaying && !isRailHovered && isStageVisible && isPageVisible;
    useEffect(() => {
        if (!shouldAutoAdvance) {
            return undefined;
        }
        const timerId = window.setTimeout(
            () => setActiveStep((step) => (step + 1) % PROOF_STEPS.length),
            PROOF_STEP_DURATIONS[activeStep],
        );
        return () => window.clearTimeout(timerId);
    }, [activeStep, shouldAutoAdvance]);

    /** Nilai mentah posisi kursor (-0.5..0.5) untuk tilt kartu. */
    const pointerX = useMotionValue(0);
    const pointerY = useMotionValue(0);
    const rotateX = useSpring(
        useTransform(pointerY, [-0.5, 0.5], [3.5, -3.5]),
        { stiffness: 150, damping: 18, mass: 0.6 },
    );
    const rotateY = useSpring(
        useTransform(pointerX, [-0.5, 0.5], [-4.5, 4.5]),
        { stiffness: 150, damping: 18, mass: 0.6 },
    );

    /**
     * Miringkan kartu mengikuti kursor sebagai umpan balik kedalaman —
     * khusus mouse; sentuh dan reduced motion diabaikan (kartu tetap datar).
     */
    const handleCardPointerMove = (
        event: ReactPointerEvent<HTMLDivElement>,
    ) => {
        if (prefersReducedMotion || event.pointerType !== 'mouse') {
            return;
        }
        const bounds = event.currentTarget.getBoundingClientRect();
        pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
        pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
    };

    /** Kembalikan kartu ke posisi datar saat kursor keluar. */
    const handleCardPointerLeave = () => {
        pointerX.set(0);
        pointerY.set(0);
    };

    /**
     * Pilih langkah secara manual: pengunjung memegang kendali, jadi loop
     * otomatis berhenti dan tombol rail berubah menjadi "Lanjutkan".
     */
    const handleStepSelect = (index: number) => {
        setActiveStep(index);
        setIsAutoPlaying(false);
    };

    /** Tombol jeda/lanjut — override eksplisit pengunjung atas loop. */
    const handleToggleAutoPlay = () => {
        setIsAutoPlaying((isPlaying) => !isPlaying);
    };

    return (
        <div
            className="relative mx-auto w-full max-w-[22rem] lg:max-w-[24rem]"
            ref={stageRef}
        >
            {/*
             * Medan partikel latar — teal + amber, `lightMode` mengikuti tema
             * aktif. Kini parallax mengikuti kursor (`moveParticlesOnHover`)
             * dan klik panggung memicu burst (bawaan `clickBurst`) — latar
             * yang bereaksi terhadap sentuhan, tetapi tetap `pointer-events-none`
             * sehingga tidak pernah menghalangi CTA atau kartu.
             */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-10 -z-10 sm:-inset-14"
            >
                <Particles
                    glow={0.35}
                    lightMode={resolvedAppearance === 'light'}
                    moveParticlesOnHover
                    opacity={resolvedAppearance === 'light' ? 0.45 : 0.6}
                    particleBaseSize={46}
                    particleColors={
                        resolvedAppearance === 'light'
                            ? ['#0F766E', '#0D9488', '#B45309']
                            : ['#2DD4BF', '#5EEAD4', '#F59E0B']
                    }
                    particleCount={70}
                    speed={0.35}
                    twinkle={0.4}
                />
            </div>

            {/*
             * Lapisan kartu + chip. Chip sengaja `pointer-events-none` agar
             * tidak mematikan area tilt di sudut kiri kartu.
             */}
            <div className="relative">
                {/*
                 * Chip statistik melayang — sengaja menimpa sudut kiri-atas
                 * foto (layered etalase), bukan ruang kosong: menempel jelas
                 * di atas bidang berwarna sehingga tak pernah hilang putih-
                 * di-putih, dan hanya menutupi area ilustrasi — teks header,
                 * watermark, serta isi kartu tetap bebas. `pointer-events-none`
                 * agar tilt kartu di bawahnya tetap hidup.
                 */}
                <div className="pointer-events-none absolute top-16 -left-6 z-10 hidden w-40 lg:block">
                    <div className="bg-card rounded-xl border p-3 shadow-[0_16px_32px_-16px_rgb(12_95_89/0.25)]">
                        <p className="text-foreground text-2xl font-bold tracking-tight">
                            <CountUp
                                delay={0.9}
                                duration={1.6}
                                suffix="%"
                                to={100}
                            />
                        </p>
                        <p className="text-muted-foreground mt-0.5 text-xs leading-snug">
                            aksi kritikal punya jejak audit — tanpa tombol
                            &quot;hapus&quot; tersembunyi
                        </p>
                    </div>
                </div>

                {/*
                 * Kartu utama — mockup detail order yang kini berjalan sebagai
                 * loop 4 langkah. Tilt halus mengikuti kursor; semua elemen
                 * di dalamnya permanen (ruang selalu terisi) sehingga langkah
                 * hanya menyalakan penekanan, bukan memindahkan layout.
                 */}
                <motion.div
                    className="bg-card ml-auto w-full rounded-2xl border p-3 shadow-[0_28px_56px_-28px_rgb(12_95_89/0.35)] transition-shadow duration-300 hover:shadow-[0_36px_64px_-30px_rgb(12_95_89/0.45)]"
                    onPointerLeave={handleCardPointerLeave}
                    onPointerMove={handleCardPointerMove}
                    style={{
                        rotateX,
                        rotateY,
                        transformPerspective: 900,
                    }}
                >
                    {/*
                     * Header kartu. Pill status adalah indikator akhir rantai:
                     * amber "Menunggu" selama proses, hijau "Disetujui" saat
                     * langkah terakhir menyegel bukti.
                     */}
                    <div className="flex items-center justify-between gap-2 px-1 pb-3">
                        <div className="flex items-center gap-2">
                            <span className="bg-brand-700 flex size-7 items-center justify-center rounded-md">
                                <Camera
                                    aria-hidden="true"
                                    className="text-primary-foreground size-4"
                                />
                            </span>
                            <div className="leading-tight">
                                <p className="text-foreground text-sm font-semibold">
                                    Order #RC-2418
                                </p>
                                <p className="text-muted-foreground text-xs">
                                    Dress sutra · paket express
                                </p>
                            </div>
                        </div>
                        <span
                            className={cn(
                                'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium transition-colors duration-300',
                                isApproved
                                    ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-200',
                            )}
                        >
                            {isApproved ? (
                                <motion.span
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-center gap-1"
                                    initial={
                                        prefersReducedMotion
                                            ? false
                                            : { opacity: 0, scale: 1.16 }
                                    }
                                    key="pill-approved"
                                    transition={{
                                        duration: 0.36,
                                        ease: PROOF_EASE,
                                    }}
                                >
                                    <Check
                                        aria-hidden="true"
                                        className="size-3"
                                    />
                                    Disetujui
                                </motion.span>
                            ) : (
                                <span className="flex items-center gap-1">
                                    <Clock
                                        aria-hidden="true"
                                        className="size-3"
                                    />
                                    Menunggu
                                </span>
                            )}
                        </span>
                    </div>

                    {/* Foto kondisi — penekanan langkah 1. */}
                    <GarmentPhoto
                        isActive={activeStep === 0}
                        isStamped={isAuditShown}
                        prefersReducedMotion={prefersReducedMotion}
                    />

                    {/*
                     * Persetujuan pelanggan lewat WhatsApp (FR.9.3) — selalu
                     * tampil (ruang tak pernah kosong); langkah WA hanya
                     * menyalakan ring penekanan, dan meta berganti dari
                     * "Terkirim" (centang ganda khas WhatsApp) menjadi bukti
                     * persetujuan di langkah akhir.
                     */}
                    <div className="mt-3 flex justify-end">
                        <div
                            className={cn(
                                'max-w-[85%] rounded-xl rounded-br-sm bg-green-100 px-3 py-2 transition-shadow duration-300 dark:bg-green-950',
                                activeStep === 2 &&
                                    'ring-brand-700/30 dark:ring-brand-50/25 ring-2',
                            )}
                        >
                            <p className="text-xs leading-snug text-green-950 dark:text-green-100">
                                Bu, foto kondisi awal dress sutra sudah saya
                                kirim ya. Kancing masih utuh, tidak ada noda.
                            </p>
                            <p className="mt-1 flex items-center justify-end gap-1 text-[0.65rem] text-green-800/80 dark:text-green-300/80">
                                <span data-numeric>14:33</span>
                                {isApproved ? (
                                    <>
                                        <Check
                                            aria-hidden="true"
                                            className="size-3"
                                        />
                                        Disetujui pelanggan
                                    </>
                                ) : (
                                    <>
                                        <CheckCheck
                                            aria-hidden="true"
                                            className="size-3"
                                        />
                                        Terkirim
                                    </>
                                )}
                            </p>
                        </div>
                    </div>

                    {/*
                     * Jejak audit (FR-3.4) — selalu tampil sebagai baris
                     * permanen kartu; ring penekanan menyala tepat di langkah
                     * Stempel, bersamaan cap watermark (sebab dan akibat
                     * dalam satu denyut).
                     */}
                    <div
                        className={cn(
                            'border-border mt-3 flex items-center gap-2 rounded-lg border-t px-1 pt-3 transition-shadow duration-300',
                            activeStep === 1 &&
                                'ring-brand-700/25 dark:ring-brand-50/20 ring-2',
                        )}
                    >
                        {activeStep === 1 && !prefersReducedMotion ? (
                            <motion.span
                                animate={{ scale: [1, 1.28, 1] }}
                                className="text-brand-700 dark:text-brand-50 shrink-0"
                                initial={{ scale: 1 }}
                                key="audit-shield-pulse"
                                transition={{
                                    duration: 0.5,
                                    ease: PROOF_EASE,
                                }}
                            >
                                <ShieldCheck className="size-4" />
                            </motion.span>
                        ) : (
                            <ShieldCheck
                                aria-hidden="true"
                                className="text-brand-700 dark:text-brand-50 size-4 shrink-0"
                            />
                        )}
                        <p className="text-muted-foreground text-xs leading-snug">
                            <span
                                className="text-foreground font-medium"
                                data-numeric
                            >
                                14:32
                            </span>{' '}
                            Andini (kasir) memotret kondisi awal · tercatat
                            otomatis
                        </p>
                        <span className="text-muted-foreground ml-auto flex shrink-0 items-center gap-1 text-[0.65rem]">
                            <Clock aria-hidden="true" className="size-3" />1
                            menit
                        </span>
                    </div>
                </motion.div>
            </div>

            {/* Rail langkah — kendali walkthrough di luar kartu. */}
            <ProofStepRail
                activeStep={activeStep}
                isAutoPlaying={isAutoPlaying}
                onHoveredChange={setIsRailHovered}
                onStepSelect={handleStepSelect}
                onToggleAutoPlay={handleToggleAutoPlay}
            />
        </div>
    );
}
