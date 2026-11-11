import { CreditCard, MessageCircle, Smartphone } from 'lucide-react';

import {
    Container,
    MetaLabel,
    SectionHeading,
} from '@/components/marketing/layout';
import FadeContent from '@/components/react-bits/fade-content';
import { cn } from '@/lib/utils';

/**
 * Tiga kanal yang benar-benar dipakai produk. Ditulis sebagai bagian
 * infrastruktur — bukan logo klien atau badge kemitraan.
 */
const CHANNELS = [
    {
        icon: MessageCircle,
        name: 'WhatsApp Business',
        meta: 'Meta Cloud API',
        description:
            'OTP, notifikasi status, dan tautan persetujuan bukti kondisi dikirim ke nomor pelanggan.',
    },
    {
        icon: CreditCard,
        name: 'Xendit',
        meta: 'VA · QRIS · e-wallet',
        description:
            'Tautan pembayaran menempel di setiap invoice, dengan pengingat sebelum jatuh tempo.',
    },
    {
        icon: Smartphone,
        name: 'SMS cadangan',
        meta: 'Fallback otomatis',
        description:
            'Dipakai saat notifikasi WhatsApp tidak terkirim, supaya kabar status tidak menggantung.',
    },
] as const;

/**
 * Band integrasi — tiga rel ledger, bukan grid logo kosmetik.
 */
export default function MarketingIntegrations() {
    return (
        <section
            aria-labelledby="integrasi-title"
            className="bg-sheet border-line border-y py-20 sm:py-24"
        >
            <Container>
                <SectionHeading
                    id="integrasi-title"
                    title="Tiga kanal yang benar-benar dipakai."
                    description="Bukan deretan logo. Ini bagian yang mengirim pesan dan menagih pembayaran, lengkap dengan jalur cadangan saat kanal utama gagal."
                    className="max-w-2xl"
                />

                <div className="border-line bg-line mt-12 grid gap-px overflow-hidden rounded-xl border md:grid-cols-3">
                    {CHANNELS.map((channel, index) => {
                        const Icon = channel.icon;

                        return (
                            <FadeContent
                                key={channel.name}
                                delay={index * 0.06}
                                className="bg-ground h-full"
                            >
                                <div className="flex h-full flex-col justify-between gap-8 p-6 sm:p-8">
                                    <div className="flex items-start justify-between gap-4">
                                        <span
                                            className={cn(
                                                'flex size-12 items-center justify-center rounded-md transition-colors',
                                                index === 0
                                                    ? 'bg-action text-action-foreground hover:bg-action-strong'
                                                    : index === 1
                                                      ? 'bg-ok-tint text-ok hover:bg-ok'
                                                      : 'bg-warn-tint text-warn hover:bg-warn',
                                            )}
                                        >
                                            <Icon
                                                className="size-5"
                                                aria-hidden="true"
                                            />
                                        </span>
                                    </div>

                                    <div>
                                        <MetaLabel>{channel.meta}</MetaLabel>
                                        <h3 className="text-ink mt-2 text-xl font-extrabold tracking-tight">
                                            {channel.name}
                                        </h3>
                                        <p className="text-ink-soft mt-3 text-sm leading-relaxed font-medium">
                                            {channel.description}
                                        </p>
                                    </div>
                                </div>
                            </FadeContent>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
}
