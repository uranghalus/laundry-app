import { Building2, Store, Hotel } from 'lucide-react';

/**
 * Strip audiensi — pengganti jujur untuk baris "Trusted by" berisi logo klien.
 *
 * Kita belum punya pelanggan (target Q8: 100 trial), jadi menampilkan logo
 * rekaan adalah kebohongan yang langsung ketahuan oleh pemilik laundry yang
 * bertanya "siapa saja yang pakai?". Sebagai gantinya: siapa yang produk ini
 * dirancang untuk, dengan segmen nyata dari PRD §2.
 */
const AUDIENCES = [
    {
        icon: Store,
        title: 'Laundry single-outlet',
        body: 'Pemilik yang merangkap kasir dan butuh pencatatan uang yang akurat.',
    },
    {
        icon: Building2,
        title: 'Gerai multi-outlet',
        body: 'Laporan konsolidasi dan kontrol akses staff lintas outlet.',
    },
    {
        icon: Hotel,
        title: 'Klien korporat',
        body: 'Hotel dan apartemen — invoice tempo hadir di rilis berikutnya.',
    },
];

/**
 * Band tipis di bawah hero: menempatkan produk di dunia pembeli tanpa klaim
 * palsu. Satu baris, tenang, tidak bersaing dengan hero.
 */
export default function AudienceStrip() {
    return (
        <section
            aria-label="Untuk siapa Repica"
            className="bg-muted/40 border-y"
        >
            <div className="mx-auto grid max-w-[1200px] gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6">
                {AUDIENCES.map((item) => (
                    <div className="flex items-start gap-3" key={item.title}>
                        <span className="text-brand-700 dark:text-brand-50 bg-brand-50 dark:bg-brand-900/40 mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg">
                            <item.icon className="size-4" />
                        </span>
                        <div>
                            <p className="text-sm font-semibold">
                                {item.title}
                            </p>
                            <p className="text-muted-foreground mt-0.5 text-sm leading-snug">
                                {item.body}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
