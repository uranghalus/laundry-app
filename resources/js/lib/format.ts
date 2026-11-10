/**
 * Pemformat angka bersama untuk seluruh halaman marketing (R-FE-008).
 *
 * Satu instance `Intl.NumberFormat` dipakai ulang agar tidak membuat
 * formatter baru di setiap render.
 */
const idNumberFormatter = new Intl.NumberFormat('id-ID');

/**
 * Memformat nominal rupiah utuh menjadi teks Indonesia.
 *
 * @param value - Nominal dalam rupiah utuh (bukan sen).
 * @returns Teks seperti `Rp149.000`.
 */
export function formatIDR(value: number): string {
    return `Rp${idNumberFormatter.format(Math.round(value))}`;
}

/**
 * Memformat angka biasa dengan pemisah ribuan Indonesia.
 *
 * @param value - Angka yang akan diformat.
 * @returns Teks seperti `1.490`.
 */
export function formatNumber(value: number): string {
    return idNumberFormatter.format(value);
}
