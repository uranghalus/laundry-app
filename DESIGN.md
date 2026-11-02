---
name: 'Repica Marketing — Bukti Terkendali'
overview: "Permukaan marketing Repica memakai dunia 'Bukti Terkendali': kanvas editorial hampir putih dengan garis rambut, satu artefak tanda tangan berupa nota bukti kondisi (kertas hangat, cap kobalt, angka tabular), dan tepat dua bidang navy penuh sebagai ruang kontrol. Halaman tidak menjual 'aplikasi cantik'; ia memperlihatkan dokumen yang membuat sengketa berhenti."
version: '3.0'
updated: '2026-11-02'
colors:
    ground:
        name: 'Kanvas Bersih'
        value: '#FCFCFD'
    band:
        name: 'Bidang Dingin'
        value: '#EEF3FB'
    band-strong:
        name: 'Bidang Dingin Dalam'
        value: '#E1EBF9'
    paper:
        name: 'Kertas Nota'
        value: '#FAF8F4'
    navy:
        name: 'Navy Kontrol'
        value: '#0E1B2E'
    navy-soft:
        name: 'Navy Panel'
        value: '#16263D'
    brand-200:
        name: 'Kobalt Pucat'
        value: '#C7DAF4'
    brand-500:
        name: 'Kobalt Garis'
        value: '#4E8BE6'
    brand-600:
        name: 'Kobalt Aksi'
        value: '#266DD3'
    brand-700:
        name: 'Kobalt Baca'
        value: '#1E56A8'
    brand-900:
        name: 'Kobalt Dalam'
        value: '#163E7A'
    ink:
        name: 'Tinta Slate'
        value: '#0F172A'
    ink-soft:
        name: 'Tinta Sekunder'
        value: '#475569'
    card:
        name: 'Permukaan Kartu'
        value: '#FFFFFF'
    success:
        name: 'Hijau Disetujui'
        value: '#15803D'
    warning:
        name: 'Amber Perhatian'
        value: '#B45309'
    error:
        name: 'Merah Sengketa'
        value: '#B91C1C'
typography:
    sans:
        name: 'Plus Jakarta Sans'
        weights: [400, 500, 600, 700]
        fallback: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif"
radius:
    control:
        value: '8px (rounded-lg)'
    card:
        value: '16px (rounded-2xl)'
    panel:
        value: '12px (rounded-xl)'
    pill:
        value: '999px (rounded-full)'
spacing:
    steps:
        [
            '4px',
            '8px',
            '12px',
            '16px',
            '20px',
            '24px',
            '32px',
            '48px',
            '64px',
            '96px',
        ]
component-tokens:
    button:
        primary: 'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-action px-6 text-sm font-semibold text-action-foreground transition-colors duration-200 hover:bg-action-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
        secondary: 'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card px-6 text-sm font-semibold text-ink transition-colors duration-200 hover:bg-band focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
        on-dark: 'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-white px-6 text-sm font-semibold text-navy transition-colors duration-200 hover:bg-brand-50 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-navy'
    card:
        base: 'rounded-2xl border border-border bg-card'
        featured: 'rounded-2xl border border-navy bg-navy text-white shadow-lift'
        artifact: 'rounded-[20px] border border-border bg-paper shadow-lift'
    badge:
        neutral: 'rounded-full border border-border bg-band text-ink-soft'
        info: 'rounded-full border border-brand-200 bg-brand-50 text-link'
        success: 'rounded-full border border-success/25 bg-success-tint text-success'
        warning: 'rounded-full border border-warning/25 bg-warning-tint text-warning'
        error: 'rounded-full border border-error/25 bg-error-tint text-error'
---

# Repica Marketing — Bukti Terkendali

## Overview

**Creative North Star: "Bukti Terkendali"** — halaman ini terasa seperti meja kerja pemilik laundry yang rapi: satu lembar nota dengan foto kondisi, satu cap persetujuan, satu buku kas, dan satu papan status. Bukan brosur SaaS. Pengunjung harus keluar dengan satu keyakinan: **Repica menyimpan bukti, bukan sekadar mencatat pesanan.**

Dunia ini menggabungkan tiga bahan, masing-masing dengan porsi yang dikunci:

| Bahan                 | Asal                                                       | Porsi pemakaian                               |
| --------------------- | ---------------------------------------------------------- | --------------------------------------------- |
| **A — Bukti Nyata**   | Kanvas editorial terang, garis rambut, artefak produk asli | Dasar seluruh halaman                         |
| **B — Buku Cucian**   | Nota kertas hangat, cap kobalt, angka tabular              | Hanya di dalam artefak bukti dan sel data     |
| **C — Ruang Kontrol** | Bidang navy penuh                                          | Tepat dua: band Pipeline dan band CTA penutup |

Komitmen produk yang harus terbaca (dari `PRODUCT.md`, tidak bisa dinegasikan):

- **Bukti, bukan janji.** Proof-of-Condition tampil sebagai nota nyata: nomor order, foto ber-watermark, berat, estimasi, persetujuan WhatsApp, cap waktu.
- **Operator sebagai pahlawan.** Bahasa menyapa pemilik laundry, bukan "manajemen enterprise".
- **Kejujuran klaim.** Setiap angka bersumber PRD/DECISIONS. Kalau sebuah artefak memuat contoh, ia diberi label contoh — bukan diangkat menjadi metrik traction.

**Key characteristics:**

- Terang secara default; navy hanya untuk dua momen yang memang butuh tekanan.
- Garis rambut 1px sebagai anatomi; bayangan hanya untuk objek yang benar-benar diangkat (nota, kartu Pro).
- Angka selalu `tabular-nums`; label kecil selalu huruf kapital ber-tracking lebar.
- Tidak ada glow, partikel dekoratif, parallax, glassmorphism, atau gradien pelangi.
- Semua warna lewat token semantik; mode gelap bekerja tanpa `dark:` per elemen.

## Colors

Palet hemat: **satu keluarga kobalt**, netral slate, dan tiga warna status. `#266DD3` adalah **action ink** — fill CTA, tautan, dan ring fokus.

| Token                   | Nama                | Hex       | Peran & kontras terukur                                                 |
| ----------------------- | ------------------- | --------- | ----------------------------------------------------------------------- |
| `ground` / `background` | Kanvas Bersih       | `#FCFCFD` | Latar halaman.                                                          |
| `band`                  | Bidang Dingin       | `#EEF3FB` | Band integrasi dan tint permukaan.                                      |
| `band-strong`           | Bidang Dingin Dalam | `#E1EBF9` | Tint kedua, garis perforasi nota.                                       |
| `paper`                 | Kertas Nota         | `#FAF8F4` | **Hanya** di dalam artefak bukti, bukan latar halaman.                  |
| `navy`                  | Navy Kontrol        | `#0E1B2E` | Band Pipeline + CTA penutup. Putih di atasnya > 15:1.                   |
| `navy-soft`             | Navy Panel          | `#16263D` | Kartu di dalam band navy.                                               |
| `brand-500`             | Kobalt Garis        | `#4E8BE6` | **Garis/underline/dot saja.** Tidak pernah teks.                        |
| `brand-600`             | Kobalt Aksi         | `#266DD3` | Fill CTA + teks aksi. Di putih **4.99:1**; putih di atasnya **4.99:1**. |
| `brand-700`             | Kobalt Baca         | `#1E56A8` | Teks biru di atas tint (`#E1EBF9`): **7.1:1**. Juga warna hover aksi.   |
| `brand-900`             | Kobalt Dalam        | `#163E7A` | Aksen terdalam, chart, teks di tint sangat pucat.                       |
| `ink`                   | Tinta Slate         | `#0F172A` | Teks utama, judul, angka.                                               |
| `ink-soft`              | Tinta Sekunder      | `#475569` | Teks sekunder di atas putih (≈7.4:1).                                   |
| `card`                  | Permukaan Kartu     | `#FFFFFF` | Permukaan kartu di atas kanvas/band.                                    |
| `success`               | Hijau Disetujui     | `#15803D` | Persetujuan, status selesai.                                            |
| `warning`               | Amber Perhatian     | `#B45309` | Menunggu persetujuan, perubahan harga.                                  |
| `error`                 | Merah Sengketa      | `#B91C1C` | Validasi, void, aksi destruktif.                                        |

**Kontras yang mengikat keputusan:**

- `#266DD3` di atas putih = **4.99:1** → lolos AA body, tetapi tipis. Jangan diturunkan opacity-nya.
- `#266DD3` di atas `#E1EBF9` = **4.14:1** → **gagal** AA body. Teks biru di dalam tint wajib `brand-700` (`#1E56A8`, 7.1:1).
- Putih di atas `#266DD3` = 4.99:1 → aman untuk label tombol 14px semibold.
- `ink-soft` (`#475569`) di atas `navy` **tidak** dipakai; di band gelap teks sekunder memakai putih 65–70%.

### Named Rules (mengikat)

- **The Action-Ink Rule.** Semua aksi memakai `--color-action` (`#266DD3`). Hover memakai `--color-action-hover` (`#1E56A8`). Tidak ada CTA kedua dengan warna berbeda di band yang sama.
- **The No-Pale-Text Rule.** `brand-500` tidak pernah menjadi warna teks. Ia hanya garis, underline, dot, atau dekorasi.
- **The Tint-Text Rule.** Di atas bidang tint (`band`, `band-strong`, `brand-50`), teks biru naik ke `brand-700`/`--color-link`.
- **The Two-Dark-Bands Rule.** Hanya band Pipeline dan CTA penutup yang memakai navy. Hero, fitur, integrasi, harga, dan FAQ tetap terang.
- **The Paper-Only Rule.** `paper` (`#FAF8F4`) hanya boleh muncul di dalam artefak (nota bukti). Latar halaman tidak boleh berubah hangat.

## Typography

**Plus Jakarta Sans** satu-satunya keluarga font. Tidak ada font mono, tidak ada serif, tidak ada italic dekoratif. Angka memakai `tabular-nums` di seluruh halaman.

| Peran             | Ukuran                          | Berat | Catatan                                                                                         |
| ----------------- | ------------------------------- | ----- | ----------------------------------------------------------------------------------------------- |
| Display (H1 hero) | `clamp(2.35rem, 6.4vw, 4.5rem)` | 700   | `leading-[1.02]`, `tracking-[-0.035em]`; satu kata kunci bergaris bawah `decoration-brand-500`. |
| Judul band (H2)   | 30 → 44px                       | 700   | `tracking-[-0.03em]`, `text-balance`.                                                           |
| Judul kartu (H3)  | 14–18px                         | 600   | `tracking-[-0.01em]`; tidak pernah lebih besar dari judul band.                                 |
| Lead              | 18px                            | 400   | `leading-relaxed`, maksimal 2–3 baris.                                                          |
| Body              | 14–16px                         | 400   | `leading-relaxed`.                                                                              |
| Label/eyebrow     | 11px                            | 600   | `tracking-[0.18em]`, uppercase, selalu dekoratif (`aria-hidden`).                               |
| Meta/nota         | 10–12px                         | 500   | `tabular-nums`; dipakai di artefak dan cap waktu.                                               |

Aturan: maksimal dua ukuran teks besar per band; tidak ada uppercase pada kalimat body; tidak ada `text-shadow`.

## Layout

**Container tunggal:** `Container` di `components/marketing/layout.tsx` — `mx-auto w-full max-w-[1200px] px-5 sm:px-8`. Setiap band wajib memakainya; tidak ada band full-bleed yang kehilangan tepi.

**Ritme band:** `py-16 sm:py-24`. Antar band dipisah garis rambut (`border-b`/`border-t`) atau pergantian permukaan (`bg-band`), bukan bayangan.

**Urutan band (mengikat):**

1. Header — bar solid, garis muncul saat scroll.
2. Hero — kanvas terang, copy kiri, nota bukti kanan; strip 4 fakta di bawah.
3. Audience — baris tabel tiga segmen, garis rambut.
4. Feature Bento (`#fitur`) — grid 4 kolom, sel bukti 2×2.
5. Pipeline (`#cara-kerja`) — **navy**, enam tahap, filter tombol.
6. Integrations — band tint, daftar kanal dua kolom.
7. Pricing (`#harga`) — tiga kartu: Basic, Pro (navy), Trial.
8. FAQ (`#faq`) — judul kiri, `<details>` kanan.
9. CTA footer — **navy**, lalu bar footer terang.

**Grid yang dipakai:**

- Audience: `sm:grid-cols-3` di dalam satu bingkai ber-border; sel dipisah `border-l`.
- Bento: `md:grid-cols-2 lg:grid-cols-4`; sel bukti `md:col-span-2 lg:row-span-2`; sel audit `md:col-span-2`; dua sel kecil `md:col-span-1`.
- Pipeline: `sm:grid-cols-2 lg:grid-cols-3`; saat filter menyisakan satu tahap, grid menyempit ke satu kolom `max-w-md`.
- Integrasi: `lg:grid-cols-[0.85fr_1.15fr]`; daftar kanal `sm:grid-cols-2` dengan `gap-px` di atas `bg-border` (garis rambut otomatis).
- Harga: `lg:grid-cols-3`, kartu Pro di tengah sebagai bidang navy.
- FAQ: `lg:grid-cols-[0.8fr_1.2fr]`.

Mobile: semua grid runtuh ke satu kolom; artefak bukti tetap tampil (tidak `hidden`); tidak ada overflow horizontal; target sentuh ≥44px.

## Elevation & Depth

Kedalaman dibawa oleh **garis rambut**, bukan bayangan. Bayangan hanya menandai objek fisik:

- `--shadow-band`: `0 4px 24px -2px rgb(15 23 42 / 0.08)` — permukaan yang sedikit terangkat.
- `--shadow-lift`: `0 10px 28px -6px rgb(15 23 42 / 0.12)` — hanya nota bukti dan kartu Pro.

Aturan:

- Maksimal **satu** bayangan per permukaan; tidak pernah ditumpuk.
- Kartu biasa di dalam grid cukup `border` tanpa bayangan.
- Hover tidak mengubah bayangan menjadi glow; perubahan warna permukaan (`hover:bg-band`) lebih disukai.
- Tidak ada `backdrop-blur`, gradien dekoratif, atau bayangan berwarna.

## Shapes

- `rounded-lg` (8px) untuk kontrol: tombol, input, radio, chip filter.
- `rounded-xl` (12px) untuk panel kecil dan daftar bergaris.
- `rounded-2xl` (16px) untuk kartu band dan sel bento.
- `rounded-[20px]` khusus nota bukti — sedikit lebih longgar agar terasa seperti kertas.
- `rounded-full` untuk badge, pill filter, dan status.
- Ikon selalu `lucide-react`, ukuran 14–20px. Status selalu **ikon + label**, tidak pernah warna saja.
- Garis rambut memakai `border-border`; tidak ada double border, tidak ada `border-transparent` sebagai trik layout.

## Motion

Motion minimal dan fungsional:

- Transisi warna/hover: 200ms ease-out.
- Chevron/plus FAQ berputar 200ms; `motion-reduce:transition-none`.
- Panel menu seluler: `animate-in fade-in slide-in-from-top-2` 150ms, dimatikan pada `prefers-reduced-motion`.
- `CountUp` berjalan sekali saat masuk viewport dan langsung menampilkan angka akhir bila reduced-motion.
- Tidak ada parallax, scroll-jacking, reveal per huruf, partikel, atau animasi yang menunda LCP.
- Semua konten utama sudah ada di DOM sebelum JS berjalan.

## Components

### Container / Eyebrow / SectionHeading (`layout.tsx`)

- `Container` adalah satu-satunya penentu lebar baca.
- `Eyebrow` menampilkan nomor seksi dua digit + garis + label; seluruhnya `aria-hidden="true"` karena judul seksi tetap menjadi heading semantik.
- `SectionHeading` memasangkan eyebrow, `h2`, dan deskripsi maksimal dua baris. `tone="dark"` dipakai di band navy.

### ProofArtifact (`proof-artifact.tsx`)

Komponen tanda tangan halaman: satu nota bukti kondisi.

Anatomi:

1. **Tepi perforasi** — pola garis vertikal `band-strong`, penanda lembar nota.
2. **Header nota** — label "Nota bukti", nomor `#RC-2391`, pill "Disetujui".
3. **Slot foto kondisi awal** — bidang dokumen berlabel (bukan bitmap), watermark outlet/waktu/nomor order, cap "Disetujui" miring.
4. **Baris meta** — item, berat, estimasi, dan (versi penuh) persetujuan WhatsApp.
5. **Kutipan persetujuan** — balon pelanggan + meta retensi 12 bulan.
6. **Footer unduh** — penanda bahwa bukti bisa dibawa keluar saat sengketa.

`compact` menghapus satu baris meta untuk dipakai di sel bento. Tidak pernah menyembunyikan nomor order, watermark, atau persetujuan.

### WaBubble (`wa-bubble.tsx`)

- Bentuk: `rounded-2xl rounded-tr-sm`, `bg-card`, `border-border`.
- Isi: kutipan pelanggan, waktu `tabular-nums`, label "Disetujui" dengan ikon.
- Tidak menampilkan nomor telepon; tidak memakai logo WhatsApp resmi.

### StatusBadge (`status-badge.tsx`)

- `rounded-full border px-2.5 py-1 text-xs font-medium`, ikon 14px + label.
- Varian: `success`, `warning`, `info`, `neutral`, `error`.
- Tidak memasang `role="status"` secara default — badge statis bukan live region.

### Tombol

| Varian             | Resep                                                                              | Peran                      |
| ------------------ | ---------------------------------------------------------------------------------- | -------------------------- |
| Primer             | `bg-action text-action-foreground hover:bg-action-hover`, `min-h-11`, `rounded-lg` | Satu per band; aksi utama. |
| Sekunder           | `border border-border bg-card text-ink hover:bg-band`                              | Aksi pendamping.           |
| Di atas navy       | `bg-white text-navy hover:bg-brand-50`                                             | CTA penutup.               |
| Garis di atas navy | `border-white/30 text-white hover:bg-white/10`                                     | WhatsApp.                  |

Semua kontrol: `focus-visible:ring-2 ring-ring ring-offset-2`; `min-h-11` (44px) untuk target sentuh.

### Audience strip

- Satu bingkai `rounded-xl border` berisi tiga sel.
- Tiap sel: ikon 16px, judul 14px semibold, satu kalimat, label kesiapan uppercase 11px (`Tersedia`/`Segera`).
- Tidak ada logo pelanggan rekaan.

### Feature Bento

- Empat sel, rentang kolom **statis** (bukan template string dinamis).
- Sel bukti memuat `ProofArtifact compact`; sel audit memuat daftar perubahan harga; sel persetujuan memuat `WaBubble`; sel kas memuat ringkasan tunai/QRIS/selisih.
- Setiap sel `<article>` dengan ikon + judul + deskripsi + badge. Tidak ada sel yang berpura-pura menjadi tombol.

### Pipeline

- Band navy penuh; enam kartu tahap dengan nomor ledger `01–06`, ikon, label, deskripsi, dan dot status.
- Filter memakai `<button aria-pressed>` asli dan **benar-benar menyaring** kartu.
- Jumlah hasil diumumkan lewat `aria-live="polite"` ("Menampilkan N dari 6 tahap").
- Tidak ada `role="grid"`, tidak ada `tabIndex` pada kartu, tidak ada tinggi minimum paksa.

### Integrations

- Band `bg-band border-y`; seluruh isi berada di dalam bidang tint (bukan div kosong).
- Daftar kanal: WhatsApp Business, Xendit, QRIS, Virtual Account, E-wallet, SMS cadangan.
- Nama kanal selalu disertai catatan peran; tidak ada grid logo kosmetik.

### Pricing

- Tiga kartu: **Basic**, **Pro** (navy, badge "Direkomendasikan"), **Trial** (border putus-putus).
- Harga: Basic `Rp149.000`/bln (`Rp1.490.000`/tahun), Pro `Rp499.000`/bln (`Rp4.990.000`/tahun), Trial `Rp0` selama 14 hari.
- Sakelar siklus tagihan memakai `<input type="radio">` asli di dalam `<fieldset>` — panah kiri/kanan bekerja tanpa JS khusus.
- Fitur disusun sebagai baris ledger bergaris; yang tidak termasuk ditulis eksplisit, bukan disamarkan.
- Trial menjelaskan cap 30 order dan nasib data setelah trial berakhir.

### FAQ

- `<details>`/`<summary>` native; jawaban sudah ada di DOM.
- Tidak ada `useState` di dalam `.map()`, tidak ada `aria-expanded`/`aria-controls` yang menduplikasi perilaku native.
- Ikon plus berputar 45° saat terbuka; teks tetap satu-satunya pembawa makna.

### CTA Footer

- Band navy penuh; konten berada **di dalam** bidang, bukan teks putih di atas latar putih.
- Kiri: eyebrow `08`, judul "Mulai dengan bukti, bukan keberanian.", dua CTA (trial, WhatsApp), dan ringkasan syarat trial.
- Kanan: grid 2×2 fakta produk (`<30 menit`, `6 tahap`, `100%`, `12 bulan`) dengan `CountUp`.
- Footer bawah: wordmark, deskripsi singkat, hak cipta.

### CountUp

- Satu kali per angka, dipicu `IntersectionObserver`.
- `tabular-nums` wajib; reduced-motion langsung ke nilai akhir.
- Hanya untuk angka produk-TRUE; tidak untuk traction rekaan.

## Aksesibilitas

1. **Kontras:** body ≥ 4.5:1. `brand-600` di putih 4.99:1 (batas aman); teks biru di tint wajib `brand-700`; `ink-soft` tidak dipakai di atas navy.
2. **Fokus:** `focus-visible:ring-2` di semua kontrol, dengan `ring-offset` yang cocok dengan permukaan (terang/gelap). `outline: none` tanpa pengganti dilarang.
3. **Target sentuh:** minimal 44×44px; jarak antar target ≥ 8px.
4. **Skip link:** "Lewati ke konten" adalah elemen fokus pertama dan menuju `#konten-utama`.
5. **Navigasi:** anchor header memakai `aria-current="location"` berdasarkan `IntersectionObserver`; menu seluler melaporkan `aria-expanded` dan mendukung Esc.
6. **FAQ:** semantik `<details>` native; jawaban tidak pernah `aria-hidden`.
7. **Filter pipeline:** `aria-pressed` + pengumuman `aria-live`; tidak ada perangkap fokus.
8. **Form/toggle harga:** radio native, `<fieldset>`/`<legend>`; panah kiri/kanan didukung browser.
9. **Ikon:** dekoratif selalu `aria-hidden="true"`; ikon-only wajib `aria-label`.
10. **Motion:** `prefers-reduced-motion` mematikan animasi non-esensial.
11. **Markup:** satu `h1` (hero), `h2` per band, `h3` per kartu; `lang="id"`.
12. **Artefak:** slot foto memakai `role="img"` + `aria-label` deskriptif; tidak ada gambar tanpa teks alternatif.

## Do's and Don'ts

### Do

- **Do** mulai dari bukti: setiap band menampilkan artefak, angka, atau konsekuensi nyata.
- **Do** pakai `#266DD3` untuk aksi dan `#1E56A8` untuk teks biru di atas tint.
- **Do** pakai token semantik (`bg-action`, `text-ink`, `bg-band`, `bg-navy`) — tanpa hex mentah di TSX.
- **Do** pakai `Container`, `SectionHeading`, `ProofArtifact`, `WaBubble`, `StatusBadge` sebagai primitif bersama.
- **Do** jaga dua momen navy saja; sisanya terang dan tenang.
- **Do** tulis angka dengan `tabular-nums` dan format Indonesia (`149.000`).
- **Do** tulis label kesiapan secara jujur (`Tersedia`, `Segera`) dan beri label "contoh" pada data ilustratif.
- **Do** pertahankan `149.000`, `499.000`, `WhatsApp Business`, `Segera`, `baju rusak`, dan `Buka Dashboard` — string ini dijaga `LandingPageTest`.
- **Do** hormati reduced-motion dan sediakan fokus yang terlihat di semua permukaan.

### Don't

- **Don't** memakai `paper` sebagai latar halaman; kertas hanya di dalam artefak.
- **Don't** memakai `brand-500` sebagai teks.
- **Don't** menambah band gelap ketiga, glow, partikel, gradien dekoratif, atau glassmorphism.
- **Don't** memakai kartu sebagai tombol imajiner; kalau tidak ada aksi, pakai `<article>`.
- **Don't** menulis kelas Tailwind dinamis (`md:col-span-${n}`) — tidak akan dikompilasi.
- **Don't** menaruh `useState` di dalam `.map()`.
- **Don't** menduplikasi semantik native (`aria-expanded` pada `<details>`, `role="status"` pada badge statis).
- **Don't** mengklaim metrik traction, logo pelanggan, atau integrasi yang belum ada di PRD.
- **Don't** memakai lebih dari satu bayangan per permukaan atau bayangan berwarna.
- **Don't** menunda LCP dengan animasi masuk pada headline.

---

**Status:** sumber kebenaran visual untuk permukaan marketing (`/`).
**Implementasi:** `resources/js/pages/welcome.tsx` + `resources/js/components/marketing/*`.
**Token:** `resources/css/app.css` (`@theme`, `:root`, `.dark`).
**Dihapus pada v3:** `hero-bento-preview.tsx`, `split-text.tsx`, `proof-card.tsx`, `hero-stage.tsx`, seluruh glow blob dan partikel dekoratif.
