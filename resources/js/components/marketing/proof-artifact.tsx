import {
    Camera,
    CheckCircle2,
    Download,
    MessageCircle,
    Shirt,
} from 'lucide-react';

import { cn } from '@/lib/utils';

/**
 * ProofArtifact — komponen tanda tangan halaman: satu nota bukti kondisi.
 *
 * Ini bukan kartu dekoratif. Ia memuat anatomi nyata Digital
 * Proof-of-Condition dari PRD: nomor order, foto kondisi awal ber-watermark,
 * berat & item, persetujuan WhatsApp, dan cap waktu. Semua angka memakai
 * `tabular-nums` agar nota terasa seperti dokumen, bukan ilustrasi.
 *
 * Tidak ada bitmap: slot foto sengaja tampil sebagai bidang dokumen
 * berlabel, supaya halaman tidak berpura-pura punya screenshot pelanggan.
 *
 * @param compact - Versi ringkas untuk sel bento (tanpa baris audit).
 * @param className - Kelas tambahan untuk penempatan.
 */
export function ProofArtifact({
    compact = false,
    className,
}: {
    compact?: boolean;
    className?: string;
}) {
    return (
        <figure
            className={cn(
                'relative w-full',
                // Sedikit rotasi hanya di desktop supaya terasa seperti kertas
                // yang diletakkan di meja; di mobile tetap rata agar terbaca.
                !compact && 'lg:-rotate-1',
                className,
            )}
        >
            <div className="border-border bg-paper shadow-lift relative overflow-hidden rounded-[20px] border">
                {/* Tepi perforasi — penanda bahwa ini lembar nota, bukan kartu UI. */}
                <div
                    aria-hidden="true"
                    className="h-3 bg-[repeating-linear-gradient(90deg,var(--color-band-strong)_0px,var(--color-band-strong)_2px,transparent_2px,transparent_10px)]"
                />

                <div className="border-border/70 flex items-center justify-between gap-3 border-b px-5 py-3">
                    <div className="flex items-baseline gap-2">
                        <span className="text-ink-soft text-[10px] font-semibold tracking-[0.16em] uppercase">
                            Nota bukti
                        </span>
                        <span className="text-ink text-sm font-bold tabular-nums">
                            #RC-2391
                        </span>
                    </div>
                    <span className="bg-success-tint text-success inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold">
                        <CheckCircle2 className="size-3" aria-hidden="true" />
                        Disetujui
                    </span>
                </div>

                {/* Slot foto kondisi awal + watermark + cap persetujuan. */}
                <div
                    className="relative aspect-[4/3] overflow-hidden bg-[repeating-linear-gradient(135deg,var(--color-band)_0px,var(--color-band)_10px,var(--color-band-strong)_10px,var(--color-band-strong)_11px)]"
                    role="img"
                    aria-label="Contoh foto kondisi awal: 4 baju dan 2 celana, diambil di Outlet Gambir pukul 15:32, disetujui pelanggan lewat WhatsApp."
                >
                    <Shirt
                        className="text-brand-600/20 absolute inset-0 m-auto size-24"
                        aria-hidden="true"
                    />
                    <span className="bg-navy/85 absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white">
                        <Camera className="size-3" aria-hidden="true" />
                        Foto kondisi awal
                    </span>

                    <span className="border-link text-link bg-paper/90 absolute top-3 right-3 -rotate-6 rounded-sm border-2 px-2 py-0.5 text-[9px] font-bold tracking-[0.18em] uppercase">
                        Disetujui
                    </span>

                    <div className="bg-navy/70 absolute inset-x-0 bottom-0 px-4 py-2">
                        <p className="text-[11px] font-medium tracking-wide text-white tabular-nums">
                            OUTLET GAMBIR · 15:32 · RC-2391
                        </p>
                    </div>
                </div>

                <div className="divide-border/70 divide-y px-5">
                    <MetaRow label="Item" value="4 baju, 2 celana" />
                    <MetaRow label="Berat" value="6 kg" />
                    <MetaRow label="Estimasi" value="Jumat, 12:00" />
                    {!compact ? (
                        <MetaRow label="Disetujui via WA" value="14:32" />
                    ) : null}
                </div>

                {/* Persetujuan pelanggan — bukti yang membedakan Repica. */}
                <div className="border-border/70 bg-card/70 border-t px-4 py-3">
                    <div className="flex items-start gap-2.5">
                        <span className="bg-success-tint text-success mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full">
                            <MessageCircle
                                className="size-3.5"
                                aria-hidden="true"
                            />
                        </span>
                        <div className="min-w-0">
                            <p className="text-ink text-xs leading-relaxed">
                                “Oke, kondisi bajunya sesuai foto. Lanjut cuci.”
                            </p>
                            <p className="text-ink-soft mt-1 text-[10px] tabular-nums">
                                Pelanggan · 14:32 · bukti tersimpan 12 bulan
                            </p>
                        </div>
                    </div>
                </div>

                <div className="border-border/70 flex items-center gap-1.5 border-t px-4 py-2.5">
                    <Download
                        className="text-ink-soft size-3.5"
                        aria-hidden="true"
                    />
                    <span className="text-ink-soft text-[11px]">
                        Bisa diunduh &amp; dibagikan saat sengketa
                    </span>
                </div>
            </div>
        </figure>
    );
}

/**
 * Satu baris label/nilai di dalam nota.
 *
 * @param label - Nama field.
 * @param value - Nilai yang ditampilkan (selalu angka/tabular bila berupa data).
 */
function MetaRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between gap-4 py-2.5">
            <span className="text-ink-soft text-xs">{label}</span>
            <span className="text-ink text-sm font-semibold tabular-nums">
                {value}
            </span>
        </div>
    );
}
