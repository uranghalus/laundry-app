import { Camera, MessageCircle, ShieldCheck } from 'lucide-react';

import { Container, SectionHeading } from '@/components/marketing/layout';
import ProofFlow from '@/components/marketing/proof-flow';
import FadeContent from '@/components/react-bits/fade-content';
import SpotlightCard from '@/components/react-bits/spotlight-card';

/**
 * Tiga kemampuan yang membentuk satu lembar bukti. Ditulis sebagai janji
 * produk yang bisa diperiksa, bukan angka pemasaran.
 */
const CAPABILITIES = [
    {
        icon: Camera,
        label: 'Foto kondisi bersegel',
        description:
            'Waktu, outlet, dan nomor order menempel langsung di foto. Tidak ada foto tanpa konteks yang bisa tertukar dengan order lain.',
    },
    {
        icon: MessageCircle,
        label: 'Persetujuan yang tercatat',
        description:
            'Pelanggan menekan setuju dari tautan WhatsApp. Keputusan tersimpan dengan waktunya, bukan diingat belakangan saat sudah berselisih.',
    },
    {
        icon: ShieldCheck,
        label: 'Riwayat yang tidak hilang',
        description:
            'Setiap perubahan status punya pelaku dan stempel waktu. Pemilik bisa menelusuri urutan kejadian, bukan menebak siapa yang menangani.',
    },
] as const;

/**
 * Band bukti — demo alur interaktif berdampingan dengan tiga kemampuan inti.
 *
 * Demo adalah ilustrasi yang diberi label jelas; tidak ada tangkapan layar
 * palsu, nomor telepon, atau hash rekaan. Spotlight hanya aktif pada pointer
 * halus sehingga tidak mengganggu perangkat sentuh.
 */
export default function ProofBand() {
    return (
        <section
            id="fitur"
            aria-labelledby="fitur-title"
            className="bg-sheet border-line scroll-mt-24 border-y py-20 sm:py-24"
        >
            <Container>
                <SectionHeading
                    id="fitur-title"
                    title="Bukti melekat pada order. Bukan pada ingatan."
                    description="Satu lembar untuk setiap cucian: foto kondisi, persetujuan pelanggan, dan riwayat perubahan status. Bisa dibuka pemilik maupun pelanggan kapan saja."
                />

                <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-14">
                    <FadeContent className="lg:col-span-7">
                        <ProofFlow />
                        <p className="text-ink-soft mt-3 text-xs font-medium">
                            Alur di atas memakai data contoh untuk
                            memperlihatkan urutan pencatatan — bukan data
                            pelanggan nyata.
                        </p>
                    </FadeContent>

                    <div className="lg:col-span-5">
                        <div className="border-ink border-t-2">
                            {CAPABILITIES.map((item, index) => {
                                const Icon = item.icon;

                                return (
                                    <FadeContent
                                        key={item.label}
                                        delay={index * 0.06}
                                    >
                                        <SpotlightCard className="border-line border-b">
                                            <div className="grid grid-cols-[auto_1fr] gap-4 px-1 py-6 sm:gap-5">
                                                <div className="flex flex-col items-center gap-3">
                                                    <span className="bg-muted text-ink flex size-11 items-center justify-center rounded-md">
                                                        <Icon
                                                            className="size-5"
                                                            aria-hidden="true"
                                                        />
                                                    </span>
                                                </div>
                                                <div>
                                                    <h3 className="text-ink text-lg font-extrabold tracking-tight">
                                                        {item.label}
                                                    </h3>
                                                    <p className="text-ink-soft mt-2 text-sm leading-relaxed font-medium">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </SpotlightCard>
                                    </FadeContent>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
