import { Building2, Hotel, Store } from 'lucide-react';

import { Container } from '@/components/marketing/layout';
import { cn } from '@/lib/utils';

/**
 * Segmen audiens dari PRD §2 (persona Pak Rudi dan Bu Sari).
 *
 * `state` menandai kesiapan fitur secara jujur: multi-outlet tersedia,
 * invoice korporat belum. Tidak ada logo pelanggan rekaan di band ini karena
 * Repica belum punya pelanggan yang boleh diklaim.
 */
const AUDIENCES = [
    {
        icon: Store,
        title: 'Laundry satu gerai',
        body: 'Pemilik yang merangkap kasir dan butuh catatan uang yang bisa dicocokkan tiap malam.',
        state: 'Tersedia',
    },
    {
        icon: Building2,
        title: 'Jaringan 2–5 outlet',
        body: 'Kontrol akses staf dan laporan konsolidasi lintas gerai dalam satu dashboard.',
        state: 'Tersedia',
    },
    {
        icon: Hotel,
        title: 'Hotel & apartemen',
        body: 'Invoice tempo dan penagihan korporat sedang disiapkan untuk rilis berikutnya.',
        state: 'Segera',
    },
] as const;

/**
 * Strip audiensi — baris tipis tiga segmen, bukan deretan kartu promosi.
 *
 * Bentuknya sengaja menyerupai tabel berkas: satu bingkai garis rambut, tiga
 * kolom, dan status kesiapan di tiap kolom. Dengan begitu band ini menjadi
 * jeda tenang antara hero dan bento fitur, bukan kompetitor visualnya.
 */
export default function AudienceStrip() {
    return (
        <section
            aria-labelledby="audiens-heading"
            className="border-border border-b"
        >
            <Container className="py-10 sm:py-12">
                <div className="grid gap-6 lg:grid-cols-[220px_1fr] lg:items-start lg:gap-14">
                    <div>
                        <h2
                            id="audiens-heading"
                            className="text-ink-soft text-[11px] font-semibold tracking-[0.18em] uppercase"
                        >
                            Dirancang untuk
                        </h2>
                        <p className="text-ink mt-2 text-sm leading-relaxed">
                            Tiga jenis usaha yang paling sering kami temui.
                        </p>
                    </div>

                    <ul className="border-border grid overflow-hidden rounded-xl border sm:grid-cols-3">
                        {AUDIENCES.map((item, index) => (
                            <li
                                key={item.title}
                                className={cn(
                                    'bg-background p-5',
                                    index > 0 &&
                                        'border-border border-t sm:border-t-0 sm:border-l',
                                )}
                            >
                                <div className="flex items-center gap-2">
                                    <item.icon
                                        className="text-link size-4 shrink-0"
                                        aria-hidden="true"
                                    />
                                    <h3 className="text-ink text-sm font-semibold tracking-[-0.01em]">
                                        {item.title}
                                    </h3>
                                </div>
                                <p className="text-ink-soft mt-2 text-sm leading-relaxed">
                                    {item.body}
                                </p>
                                <p className="text-ink-soft mt-3 text-[11px] font-semibold tracking-[0.14em] uppercase tabular-nums">
                                    {item.state}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </Container>
        </section>
    );
}
