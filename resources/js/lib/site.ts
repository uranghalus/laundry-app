/**
 * Konfigurasi identitas dan kanal kontak halaman publik.
 *
 * Nomor WhatsApp produksi belum tersedia. Selama `whatsappUrl` bernilai
 * `null`, seluruh tombol WhatsApp tidak dirender — halaman tidak boleh
 * menampilkan nomor palsu seolah-olah kanal resmi.
 */
interface SiteConfig {
    name: string;
    whatsappUrl: string | null;
}

export const siteConfig: SiteConfig = {
    name: 'Repica',
    whatsappUrl: null,
};

/**
 * Mengecek apakah kanal WhatsApp sudah dikonfigurasi.
 *
 * @returns `true` bila `whatsappUrl` berisi tautan yang bisa dibuka.
 */
export function hasWhatsAppContact(): boolean {
    return siteConfig.whatsappUrl !== null;
}
