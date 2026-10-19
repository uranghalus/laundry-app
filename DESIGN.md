---
name: "Laundry OS — Marketing Design System"
overview: "Sistem desain permukaan marketing Laundry OS. Landing page tipografi-berat yang menjual alur bukti 'kirim foto → dapat estimasi' dalam bahasa manusia: tenang, utilitarian, industrial-hangat. Bukan dasbor SaaS gelap, bukan marketplace ceria."
version: "1.0"
updated: "2026-10-19"
colors:
  primary:
    name: "Teal Air Bersih"
    value: "#0f766e"
  brand-tint:
    name: "Teal Kabut"
    value: "#f0fdfa"
  brand-deep:
    name: "Teal Malam"
    value: "#134e4a"
  background:
    name: "Putih Cucian"
    value: "#ffffff"
  surface-muted:
    name: "Putih Abu"
    value: "#f8fafc"
  ink:
    name: "Tinta Malam"
    value: "#0f172a"
  ink-muted:
    name: "Tinta Kabut"
    value: "#475569"
  border:
    name: "Garis Tenang"
    value: "#e2e8f0"
  success:
    name: "Hijau Bersih"
    value: "#15803d"
  warning:
    name: "Amber Tunggu"
    value: "#b45309"
  error:
    name: "Merah Tandai"
    value: "#b91c1c"
  dark-background:
    name: "Navy Malam"
    value: "#020617"
  dark-surface:
    name: "Navy Kartu"
    value: "#0f172a"
  dark-border:
    name: "Garis Malam"
    value: "#1e293b"
typography:
  display:
    name: "Plus Jakarta Sans"
    weights: [600, 800]
    fallback: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif"
  body:
    name: "Inter"
    weights: [400, 500, 600]
    fallback: "Inter, ui-sans-serif, system-ui, sans-serif"
  mono:
    name: "JetBrains Mono"
    weights: [400]
    fallback: "'JetBrains Mono', ui-monospace, monospace"
radius:
  control:
    name: "rounded-md"
    value: "6px"
  card:
    name: "rounded-xl"
    value: "12px"
  pill:
    name: "rounded-full"
    value: "999px"
spacing:
  steps: ["4px", "8px", "12px", "16px", "24px", "32px", "48px", "64px"]
component-tokens:
  button:
    primary: "bg-brand-700 text-white rounded-md px-6 py-3.5 font-semibold hover:bg-brand-900 transition-colors focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2"
    secondary: "border border-brand-700 text-brand-700 bg-transparent rounded-md px-6 py-3.5 hover:bg-brand-50 transition-colors"
    on-dark: "bg-brand-50 text-brand-900 hover:bg-white"
  input:
    base: "rounded-md border border-border bg-white px-4 py-3 text-base text-ink placeholder:text-ink-muted/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-1"
    invalid: "border-red-600 focus-visible:ring-red-600"
    disabled: "bg-surface-muted text-ink-muted/70"
  card:
    base: "rounded-xl border border-border bg-white shadow-card"
    on-dark: "rounded-xl border border-[#1e293b] bg-[#0f172a]"
  badge:
    neutral: "rounded-full border border-brand-700/30 bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700"
    success: "rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-2.5 py-1 text-xs font-medium"
    warning: "rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 px-2.5 py-1 text-xs font-medium"
---

# Laundry OS — Marketing Design System

## Overview

Design system untuk permukaan **marketing** Laundry OS: landing page, hero, pricing, dan komponen persuasi. Design system ini menjawab pertanyaan "apakah produk ini bisa dipercaya?" — bukan "apakah produk ini keren?".

**Komitmen produk** (dari PRODUCT.md) yang harus terbaca di setiap keputusan desain:

- **Bukti, bukan janji.** Setiap klaim harus bisa ditunjukkan dalam bentuk konkret (foto, stempel waktu, rantai audit) — bukan angka abstrak "hemat 40%".
- **Alur lengkap, bukan fitur.** Pengunjung diajak menyusuri satu alur kerja nyata (kirim foto → AI baca → estimasi → WA → disetujui), bukan daftar fitur.
- **Bahasa manusia.** Istilah UI memakai kata yang diucapkan pemilik laundry: "kilo", "estimasi", "disetujui pelanggan" — bukan "input", "status", "konfirmasi".
- **Operator sebagai pahlawan.** Pemilik laundry adalah tokoh utamanya; produk adalah alatnya.

**Suara desain:** *Tenang · Utilitarian · Industrial-hangat*. Referensi: buku panduan mesin cuci era 1980-an — label huruf jelas, tombol yang jelas, tanpa dekorasi; ruang kendali pabrik yang bersih — informasi padat tapi tidak berisik.

**Anti-referensi** (yang TIDAK boleh ditiru): dasbor SaaS gelap neon, ilustrasi kartun stok, marketplace ceria dengan banyak gradien, glassmorphism, gradient mesh, emoji sebagai ikon.

## Colors

Palet sangat hemat: **teal sebagai satu-satunya aksen**, sisanya netral yang bergeser antara mode terang (putih dingin) dan gelap (navy malam). Semua warna memakai token CSS dari `resources/css/app.css`; jangan pernah menulis hex mentah di class Tailwind baru.

### Mode terang (default)

| Slug | Nama | Hex | Peran |
|------|------|-----|-------|
| `primary` | Teal Air Bersih | `#0f766e` | brand-700. Semua yang interaktif: CTA utama, link, fokus, state aktif. |
| `brand-tint` | Teal Kabut | `#f0fdfa` | brand-50. Latar lembut: badge, hover sekunder, ikon di dalam kartu. |
| `brand-deep` | Teal Malam | `#134e4a` | brand-900. Hover CTA, header kartu bukti, watermark. |
| `background` | Putih Cucian | `#ffffff` | Latar halaman. |
| `surface-muted` | Putih Abu | `#f8fafc` | Latar sekunder: zona form, kartu pendukung. |
| `ink` | Tinta Malam | `#0f172a` | Teks utama, angka harga, judul. |
| `ink-muted` | Tinta Kabut | `#475569` | Teks sekunder, label, deskripsi. |
| `border` | Garis Tenang | `#e2e8f0` | Semua garis pemisah, 1px. |
| `success` | Hijau Bersih | `#15803d` | "Selesai", "Disetujui", saldo masuk. |
| `warning` | Amber Tunggu | `#b45309` | "Menunggu persetujuan", antrian. |
| `error` | Merah Tandai | `#b91c1c` | Error validasi, aksi destruktif. |

### Mode gelap

| Slug | Nama | Hex | Peran |
|------|------|-----|-------|
| `dark-background` | Navy Malam | `#020617` | bg-page |
| `dark-surface` | Navy Kartu | `#0f172a` | bg-card, header kartu bukti |
| `dark-border` | Garis Malam | `#1e293b` | Semua garis pemisah |

Teks di mode gelap: teks utama putih dingin (white), teks sekunder slate-300. Aksen teal **terbalik**: brand-700 (`#0f766e`) → brand-50 (`#f0fdfa`), brand-900 (`#134e4a`) → brand-50 — kontras minimum 4.5:1 dipertahankan.

### Aturan pemakaian

- **Satu aksen.** Hanya teal (dan pasangan status success/warning/error pada data status). Tanpa ungu, pink, oranye, atau gradien berwarna.
- **CTA utama = brand-700 atau lebih gelap.** brand-50 hanya untuk latar, bukan untuk aksi.
- **Status memakai pasangan bg+text lengkap** (contoh: `bg-amber-100 text-amber-700` + varian gelap `dark:bg-amber-950 dark:text-amber-200`), bukan teks berwarna saja.
- **Aksen per kartu maksimal satu.** Kartu bukti hanya boleh menonjolkan satu hal — jangan bersaing dengan CTA utama halaman.

## Typography

**Plus Jakarta Sans** memimpin sebagai suara produk (display, judul, angka di kartu); **Inter** untuk teks baca panjang (deskripsi, testimoni); **JetBrains Mono** hanya untuk kode/unduhan. Semua dari Google Fonts — layar pemasaran harus berisi hidup dari awal.

Rasio skala ~1.25, semuanya `font-variation-settings: 'opsz' 32` pada elemen display:

| Role | Size | Line height | Weight | Catatan |
|------|------|-------------|--------|---------|
| Display (H1 hero) | clamp 36px → 56px | 1.10 | 800 | tracking rapat `-0.02em`; kata kunci hero diberi `underline decoration-brand-700/30 decoration-4 underline-offset-8` |
| Heading 1 | 30px (text-3xl) | 1.20 | 700 | Judul seksi. |
| Heading 2 | 24px (text-2xl) | 1.25 | 700 | Sub-judul kartu besar. |
| Heading 3 | 20px (text-xl) | 1.25 | 700 | Judul kartu. |
| Body large | 18px (text-lg) | 1.6 | 400 | Lead paragraph hero, testimoni. |
| Body | 16px (text-base) | 1.5 | 400 | Default semua deskripsi. |
| Label | 14px (text-sm) | 1.5 | 500–600 | Label form, tombol, badge. |
| Micro | 12px (text-xs) | 1.5 | 500 | Timestamp, meta, catatan kaki. |

Aturan:

- **Berat = makna.** 800 hanya untuk display hero dan label kartu bukti; 700 untuk judul; 400 untuk isi; 600 untuk tombol. Jangan memakai 800 pada teks baca.
- **Judul terasa seperti halaman koran**, bukan brosur: line-height rapat, panjang baris terbatas.
- **Tebal hanya pada satu frasa per paragraf** (`.prose-lead strong` → `font-weight: 600`) — frasa bukti, bukan kata sifat.
- **Angka di kartu memakai display font** (pada kartu bukti: `display: swap` untuk mencegah layout shift saat angka berubah).

## Layout

**Grid:** container `max-w-6xl mx-auto px-4 sm:px-6 lg:px-8`, dengan `container-bleed` (lebar penuh, padding rapat) untuk zona form. Grid halaman: hero 2 kolom (`lg:grid-cols-[1.05fr,0.95fr]`, gap 12), seksi pricing 3 kolom (`sm:grid-cols-2 lg:grid-cols-3`, gap 6), kartu alur & fitur `md:grid-cols-3` (gap 6).

**Breakpoints** (Tailwind default): `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px.

**Ritme spacing:** kelipatan 4px. Token: `--space-1` 4, `--space-2` 8, `--space-3` 12, `--space-4` 16, `--space-5` 24, `--space-6` 32, `--space-7` 48, `--space-8` 64 (px). Jarak antar seksi besar (≥ 96px / `py-24`), jarak dalam kartu rapat (12–24px).

**Prinsip:**

- **Aturan pertama komposisi: setiap seksi menjawab satu keberatan.** Tidak ada seksi dekoratif tanpa tujuan persuasi.
- **Dua halaman yang sama penting:** halaman yang menjelaskan (teks kiri) dan halaman yang membuktikan (kartu bukti kanan).
- **Angka besar menopang klaim** (step numerals `01`, `02`, `03` dengan `text-brand-700/30`, `aria-hidden`), bukan ornamen.
- **Komposisi satu bidang.** Halaman hanya boleh memilih satu bidang yang menang: hero tipografi-berat dengan kartu bukti sebagai satu-satunya "produk" yang terlihat. Pricing adalah bidang kedua — jadikan lebih tenang, bukan lebih ramai.
- **Zona form memakai kontras tipografi yang berbeda**: input font-body (teks nyata), kartu bukti font-display (antarmuka). Kontras itu pesannya: "di sini kamu bicara, di sana produk bekerja."
- **Mobile:** hero 1 kolom, kartu bukti tetap tampil (bukan disembunyikan), stepper bisa geser, CTA utama selebar layar. Jangan ada overflow horizontal.

## Elevation & Depth

**"Lifted terangkat": setiap kartu diangkat dengan tepi tegas dan tepat satu bayangan lembut.** Filosofi ini merekonsiliasi dua hal: border 1px sebagai anatomi utama (dari brief desain) dan satu bayangan offset sebagai penanda "objek ini terangkat dari meja" — bukan sebagai efek dramatis.

Token bayangan (CSS `app.css`):

- `--shadow-card`: `0 4px 20px -2px rgb(0 0 0 / 0.06)` — kartu biasa, kartu fitur, testimoni.
- `--shadow-card-lg`: `0 10px 28px -6px rgb(0 0 0 / 0.10)` — hanya untuk objek yang benar-benar di atas: kartu bukti hero (produk yang sedang didemokan) dan kartu harga populer.

Aturan keras:

- **Tepat satu bayangan per kartu, tidak pernah ditumpuk** (ini yang dimaksud brief: tanpa *stacked* box-shadow). Tidak ada bayangan ganda `shadow-card shadow-card-lg`.
- **Border tetap pembawa utama pemisah** — bayangan hanya pelengkap, boleh dihapus tanpa kehilangan makna.
- **Bayangan bukan satu-satunya penanda difokus** (WCAG 2.2): selalu ada pasangan `ring-2 ring-brand-700` pada `focus-visible`.
- **Tidak ada efek kedalaman lain:** tanpa glassmorphism, gradient mesh, parallax background, atau neon glow.

## Shapes

- **Radius tiga tingkat saja:**
  - `rounded-md` (6px) — semua yang bisa diklik atau diketik: tombol, input, elemen form.
  - `rounded-xl` (12px) — semua kartu: fitur, bukti, testimoni, harga.
  - `rounded-full` (999px) — status, chip, badge, avatar stack.
- **Tidak ada radius yang tidak termasuk ketiganya.** Radius 0 (sudut tajam) hanya untuk garis pemisah seksi (`border-t`).
- **Ikon selalu lucide-react**, ukuran konsisten: 20px di dalam label chip, 24–32px di dalam kartu fitur, 40px di dalam kartu harga. Tidak ada emoji, tidak ada SVG custom, tidak ada ikon dari pihak ketiga.

## Components

Setiap komponen memakai token di atas. Nama class mengikuti konvensi proyek: token `brand-*` (bukan `primary-*`) untuk teal, `--shadow-card` (bukan Tailwind `shadow-md` default), `border-border` / `text-ink` / `bg-surface-muted` dari base.css.

### Tombol

| Variant | Class | Peran |
|---------|-------|-------|
| Primary | `rounded-md bg-brand-700 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-brand-900` | Satu per halaman: "Coba alurnya sendiri" / "Mulai Uji Coba". |
| Secondary | `rounded-md border border-brand-700 bg-transparent px-6 py-3.5 font-semibold text-brand-700 transition-colors hover:bg-brand-50` | Aksi kedua: "Lihat cara kerjanya". |
| On-dark | `rounded-md bg-brand-50 px-6 py-3.5 font-semibold text-brand-900 transition-colors hover:bg-white` | CTA di dalam kartu bukti gelap. |

Semua tombol: `focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2` (di dalam kartu gelap: `ring-brand-50`), target sentuh ≥ 44px tinggi, label verba yang menjelaskan hasil ("Coba alurnya sendiri", bukan "Klik di sini").

### Input

`rounded-md border border-border bg-white px-4 py-3 text-base text-ink placeholder:text-ink-muted/60 focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-1`. Status invalid: `border-red-600` + `focus-visible:ring-red-600` + pesan `text-sm text-red-600` di bawah. Label selalu terlihat di atas input (tidak ada placeholder-only), `font-medium text-sm text-ink`.

### Kartu

`rounded-xl border border-border bg-white shadow-card` — anatomi: ikon teal 40px di pojok kiri atas → judul `text-lg font-semibold text-ink` → deskripsi `text-base text-ink-muted` → baris meta terpisah `border-t border-border` berisi label + angka. Header kartu di mode gelap memakai `bg-surface-muted` (atau `bg-surface` di mode gelap) sebagai pita pemisah.

### Kartu bukti (komponen tanda tangan)

Satu-satunya "produk hidup" di halaman. `rounded-xl border border-border bg-white shadow-card-lg` (gelap: `border-[#1e293b] bg-[#0f172a]`). Anatomi dari atas ke bawah:

1. **Header** (`bg-surface-muted`): avatar 40px (foto pelanggan asli, radius 6px) → nama + lokasi (`text-sm font-semibold text-ink`) → pill status (`rounded-full` + pasangan bg/text) → di kanan: chip bukti.
2. **Chip bukti** ("● Foto terkirim 14:32"): `pointer-events-none rounded-full border border-brand-700/30 bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700` + titik indikator berdenyut.
3. **Baris audit** (grid 3 kolom: label 90px / nilai / meta 76px kanan): label `text-sm font-medium text-ink-muted`, nilai `display font-semibold text-ink` (`font-variant-numeric: tabular-nums`), meta `text-xs text-ink-muted`. Baris fokus diberi ring tipis.
4. **Bubble chat WA** kanan (`ml-8 rounded-xl rounded-tr-sm bg-brand-50 p-3`), teks `text-sm text-ink`, meta `text-xs text-ink-muted`, ikon centang/silang kecil.
5. **Footer** `border-t border-border`: saldo `text-2xl display font-bold text-success` + label micro.

**Watermark** bukti: angka 160px, `font-weight: 900`, `color: #134e4a` (atau brand-50 di mode gelap), `opacity: 0.4` (0.25 di gelap), `aria-hidden: true` — bukan latar, bukan teks yang bisa dibaca.

### Stepper & kontrol putar

Rail tombol langkah: `rounded-full` indikator + label `text-sm`; langkah aktif `aria-current="step"` + `text-ink font-semibold`; tombol pause/play `rounded-full border border-border`. Kontrol ini di luar kartu, di bawahnya, dengan `aria-live="polite"` untuk status "Sedang diputar / Dijeda". Hormati `prefers-reduced-motion`: mulai di langkah akhir, putar-otomatis mati.

### Badge netral

`rounded-full border border-brand-700/30 bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700` (gelap: `border-brand-50/30 bg-brand-50/10 text-brand-50`) — hanya untuk tag fitur/bukti, bukan untuk status data.

## Do's and Don'ts

### Do

- **Tunjukkan alurnya, jangan janjikan hasilnya.** Setiap seksi menjawab satu keberatan dengan bukti: foto → stempel waktu → estimasi → WA → persetujuan.
- **Pakai kata yang diucapkan pemilik laundry** ("kilo", "estimasi", "disetujui pelanggan").
- **Satu bidang menang per halaman** — sisanya tenang. Komposisi hero: teks kiri + satu kartu bukti.
- **Border 1px sebagai anatomi utama**, satu bayangan lembut per kartu sebagai penanda terangkat.
- **Tebal pada frasa bukti**, bukan kata sifat.
- **Momen kecil yang terasa nyata:** stempel waktu berdetak, saldo naik, chip bukti berdenyut — semuanya di dalam satu kartu, dengan jeda yang memberi ruang membaca.
- **Aksesibilitas minimal:** `:focus-visible` pada semua kontrol, `aria-current` untuk langkah aktif, `aria-hidden` pada watermark, target sentuh ≥ 44px, hormati `prefers-reduced-motion`.
- **Palet hemat:** teal + netral + tiga warna status.

### Don't

- **Jangan menampilkan angka penghematan sebagai bukti utama** (klaim "hemat 40%" adalah pengganti lemah untuk alur nyata).
- **Jangan memakai ilustrasi kartun stok**, 3D, emoji sebagai ikon, atau gradien.
- **Jangan memakai glassmorphism, gradient mesh, parallax background, atau neon glow** — ini bukan halaman web3.
- **Jangan menumpuk box-shadow** — satu bayangan per kartu, tidak lebih.
- **Jangan memakai gradien berwarna atau ungu/pink/oranye sebagai aksen** — teal adalah satu-satunya aksen.
- **Jangan menampilkan lebih dari satu kartu hidup di hero** — kartu pendukung hanya lewat bukti ringan (badge, ikon), bukan kartu penuh.
- **Jangan menaruh dua CTA utama** pada satu seksi (satu primary, sisanya secondary).
- **Jangan menulis hex mentah** di class Tailwind baru — pakai token `brand-*` atau komponen `text-success` / `text-warning` / `text-error`.
