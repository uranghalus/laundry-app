---
name: 'Repica — Buku Bukti'
description: 'Sistem visual Repica: lembar bukti operasional laundry dengan kertas hangat, tinta arsip, garis buku besar, dan satu kobalt aksi.'
version: '6.0'
updated: '2026-11-09'
colors:
    ground: '#FAF9F6'
    sheet: '#FFFFFF'
    paper: '#FAF6EE'
    line: '#E3DFD6'
    line-strong: '#C9C2B4'
    ink: '#121417'
    ink-soft: '#5C6169'
    action: '#0B6EA8'
    action-strong: '#09597F'
    action-text: '#0B6EA8'
    action-foreground: '#FFFFFF'
    graphic: '#008DD5'
    graphic-tint: 'rgba(0, 141, 213, 0.09)'
    accent-warm: '#C2410C'
    accent-warm-dark: '#EA580C'
    accent-warm-tint: 'rgba(194, 65, 12, 0.10)'
    ok: '#0F7A4D'
    ok-tint: '#ECFDF5'
    warn: '#8A5A00'
    warn-tint: '#FBF3E2'
    bad: '#B42318'
    bad-tint: '#FEF2F2'
    night: '#0E1A24'
    night-raised: '#16232E'
    night-line: 'rgba(242, 240, 234, 0.14)'
    night-ink: '#F2F0EA'
    night-ink-soft: '#A8B0B8'
    night-accent: '#7FB8D9'
typography:
    display:
        fontFamily: 'Manrope, ui-sans-serif, system-ui, sans-serif'
        fontSize: 'clamp(2.75rem, 7.4vw, 6rem)'
        fontWeight: 800
        lineHeight: 0.94
        letterSpacing: '-0.035em'
    band:
        fontFamily: 'Manrope, ui-sans-serif, system-ui, sans-serif'
        fontSize: 'clamp(2rem, 4.8vw, 3.75rem)'
        fontWeight: 800
        lineHeight: 0.98
        letterSpacing: '-0.03em'
    lead:
        fontFamily: 'Manrope, ui-sans-serif, system-ui, sans-serif'
        fontSize: 'clamp(1.25rem, 2.2vw, 1.75rem)'
        fontWeight: 500
        lineHeight: 1.35
        letterSpacing: 'normal'
    body:
        fontFamily: 'Manrope, ui-sans-serif, system-ui, sans-serif'
        fontSize: '1rem'
        fontWeight: 400
        lineHeight: 1.65
        letterSpacing: 'normal'
    label:
        fontFamily: 'Manrope, ui-sans-serif, system-ui, sans-serif'
        fontSize: '0.6875rem'
        fontWeight: 700
        lineHeight: 1.4
        letterSpacing: '0.18em'
    mono:
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, Liberation Mono, monospace'
        fontSize: '0.8125rem'
        fontWeight: 500
        lineHeight: 1.4
        letterSpacing: 'normal'
rounded:
    sm: '4px'
    md: '6px'
    lg: '8px'
    xl: '12px'
spacing:
    gutter: '16px (mobile) / 24px (sm) / 32px (lg)'
    band-vertical: '80px (mobile) / 96px (sm+)'
    container-max: '80rem'
components:
    button-primary:
        backgroundColor: '{colors.action}'
        textColor: '{colors.action-foreground}'
        rounded: '{rounded.md}'
        padding: '0 24px'
        height: '48px'
    button-primary-hover:
        backgroundColor: '{colors.action-strong}'
    button-primary-compact:
        backgroundColor: '{colors.action}'
        textColor: '{colors.action-foreground}'
        rounded: '{rounded.md}'
        padding: '0 16px'
        height: '44px'
    header-action:
        backgroundColor: '{colors.ink}'
        textColor: '{colors.ground}'
        rounded: '{rounded.md}'
        height: '44px'
    card-sheet:
        backgroundColor: '{colors.sheet}'
        textColor: '{colors.ink}'
        rounded: '{rounded.lg}'
        padding: '20px'
    artifact-paper:
        backgroundColor: '{colors.paper}'
        textColor: '{colors.ink}'
        rounded: '{rounded.md}'
        padding: '16px'
---

# Design System: Repica — Buku Bukti

## Overview

**Creative North Star: "Buku bukti" — halaman adalah buku catatan operasional, bukan brosur.**

Repica memperlihatkan diri sebagai buku bukti kondisi laundry: setiap klaim dicatat di atas kertas hangat dengan garis buku besar, diberi nomor order, waktu, dan cap status — persis seperti lembar bukti yang produknya hasilkan. Pengunjung tidak membaca janji SaaS generik; mereka membalik halaman buku dan melihat bukti bekerja.

Dunia ini menolak estetika teknikal-kaca (glassmorphism, pendaran neon, kartu transparan) dan menolak hero screenshot dashboard generik. Kedalaman datang dari tinta dan garis, bukan blur. Interaktivitas meaningful — stepper alur bukti, stepper enam status, marquee ringkasan — dipakai karena membantu pengunjung _memverifikasi_ alur produk, bukan karena cantik. Mode gelap didukung penuh sebagai "malam arsip": kanvas biru-hitam dalam dengan tinta hangat yang sama.

**Key Characteristics:**

- Kertas hangat `#FAF9F6` sebagai kanvas halaman; putih `#FFFFFF` hanya untuk lembar isi (sheet).
- Garis buku besar vertikal 1px (`ledger-grid`) sebagai motif halaman di lapisan `aria-hidden`.
- Satu kobalt aksi `#0B6EA8` untuk semua elemen interaktif; kontras 5.51:1 dua arah terhadap putih.
- Cerulean `#008DD5` hanya sebagai warna grafik/aksen garis — tidak pernah warna teks.
- Tanpa glassmorphism, tanpa raw hex di TSX, tanpa radius metaforis (skala 4/6/8/12 saja).

## Colors

Palet editorial hangat dengan satu aksi kobalt dingin; sebagian besar halaman adalah kertas dan tinta, warna muncul hanya saat membawa makna.

### Primary

- **Kobalt Aksi** (`{colors.action}`): tinta semua elemen interaktif — fill CTA, teks tautan, ring fokus, seleksi teks, caret. Hover memakai `{colors.action-strong}`. Kontras terhadap putih 5.51:1 dua arah.

### Secondary

- **Cerulean Grafik** (`{colors.graphic}`): hanya untuk garis, grafik, sorotan kursor (`spotlight-surface`), dan tint badge dekoratif. Kontrasnya terhadap putih 3.64:1 — gagal AA untuk teks.

### Tertiary

- **Status**: hijau `{colors.ok}` (selesai/disetujui), amber `{colors.warn}` (menunggu), merah `{colors.bad}` (gagal/kritis) — selalu berpasangan dengan tint masing-masing dan tidak pernah jadi satu-satunya pembawa makna.

### Neutral

- **Kertas Hangat** (`{colors.ground}`): latar halaman.
- **Lembar Putih** (`{colors.sheet}`): permukaan kartu, band berbingkai `border-y`.
- **Nota** (`{colors.paper}`): latar di dalam artefak bukti — objek, bukan halaman.
- **Garis** (`{colors.line}`) dan **Garis Kuat** (`{colors.line-strong}`): pemisah 1px, motif buku besar.
- **Tinta** (`{colors.ink}`): teks utama (17.52:1 di atas kertas).
- **Tinta Lembut** (`{colors.ink-soft}`): teks sekunder (5.92:1 di atas kertas).

### Dark Theme (Malam Arsip)

Token `night*` mengikat tiga bidang gelap: band pipeline `#cara-kerja`, panel harga Pro, dan CTA footer. Kanvas `{colors.night}`, lembar terangkat `{colors.night-raised}`, garis `{colors.night-line}`, tinta hangat `{colors.night-ink}`. Aksi tetap kobalt dengan teks putih; tautan naik ke `{colors.night-accent}` (8.19:1).

### Named Rules

**The One-Action Rule.** Semua elemen interaktif memakai `{colors.action}` — tidak ada warna aksi kedua, tidak ada gradasi.

**The Graphic-Only Cerulean Rule.** `{colors.graphic}` tidak pernah menjadi warna teks di latar terang.

**The Paper-Is-An-Object Rule.** `{colors.paper}` hanya latar artefak bukti; halaman tidak pernah berlatar nota.

**The Three-Dark-Fields Rule.** `night` hanya untuk pipeline, panel Pro, dan CTA penutup — tidak menyebar ke band lain.

## Typography

**Display & Body Font:** Manrope (self-hosted `resources/fonts/manrope-latin.woff2`, variabel 200–800, fallback system sans).
**Label/Mono Font:** mono sistem hanya untuk ID order, stempel waktu, dan angka teknis.

**Character:** Satu keluarga huruf untuk seluruh halaman; hierarki dibawa oleh berat (800 vs 400–600) dan ukuran, bukan oleh font kedua atau label dekoratif.

### Hierarchy

- **Display** (`{typography.display}`): H1 hero. Maksimum 6rem di desktop.
- **Band** (`{typography.band}`): H2 tiap band. Maksimum 3.75rem. Tanpa kicker di atasnya.
- **Lead** (`{typography.lead}`): paragraf pembuka band.
- **Body** (`{typography.body}`, 400; 500–600 untuk frasa yang perlu ditekankan): deskripsi, baris harga, jawaban FAQ.
- **Label** (`{typography.label}`, uppercase, tracking 0.18em): meta label (`MetaLabel`), footer nav. Batas bawah fungsional 11px.
- **Mono** (`{typography.mono}`): ID order (`RC-2391`), waktu, berat. Bukan kostum "technical".

### Named Rules

**The No-Kicker Rule.** Judul band tidak memakai label kecil di atasnya; hierarki murni tipografis.

**The Tabular Rule.** Semua angka uang/nomor order memakai `tabular-nums`.

## Layout

Container tunggal `max-w-7xl` (80rem) dengan gutter 16/24/32px mengikat seluruh band — tepi kiri-kanan identik dari header sampai footer. Band vertikal 80px (mobile) / 96px (sm+). Grid konten standar 12 kolom implisit; hero 2 kolom di lg (copy kiri, artefak kanan), pipeline & pricing berubah menjadi kolom tunggal di mobile.

Ritme band bergantian dua bentuk: band "lembar" berbingkai penuh `border-y` dengan latar `{colors.sheet}`, dan band "kertas" tanpa bingkai dengan latar `{colors.ground}`. Band gelap `night` menyela sebagai bidang penuh. Urutan band halaman `/`: Hero (+ marquee) → Problems ledger → Proof band `#fitur` → Dark status stepper `#cara-kerja` → Integrations → Pricing `#harga` → FAQ `#faq` → CTA footer.

## Elevation & Depth

Sistem bayangan datar-editorial, dua level saja, tanpa glow. Kedalaman utama adalah garis dan tinta; bayangan hanya menandai objek yang benar-benar mengambang di atas halaman.

### Shadow Vocabulary

- **`shadow-card`** (`0 1px 2px rgba(18,20,23,0.06), 0 8px 24px -12px rgba(18,20,23,0.18)`): kartu lembar, artefak di hero, panel langkah demo.
- **`shadow-float`** (`0 2px 4px rgba(18,20,23,0.06), 0 18px 40px -18px rgba(18,20,23,0.28)`): header sticky dan drawer mobile saja.

### Named Rules

**The Flat-By-Default Rule.** Permukaan datar saat diam; bayangan muncul hanya pada objek yang mengambang atau saat state berubah (spotlight, tilt).

**The No-Nested-Card Rule.** Kartu tidak bersarang dalam kartu; demo bukti dibingkai garis `border-y`, bukan cangkang kartu di dalam kartu.

## Shapes

Bahasa bentuk nota dan formulir: sudut hampir siku, garis tegas, tanpa pil dan tanpa lengkung dekoratif. Radius mengikuti skala tetap 4/6/8/12px (`{rounded.sm}`–`{rounded.xl}`) — `rounded-xl` dan lebih besar dinormalisasi ke 12px di seluruh tema. Tepi band ditentukan garis 1px (`border-y`, `border-b`), bukan radius. Ikon hanya dari `lucide-react`; tanpa emoji, tanpa SVG kustom.

## Components

### Buttons

- **Shape:** radius `{rounded.md}` (6px), tinggi 44px (kontrol standar & di dalam kartu) atau 48px (CTA hero/footer); selalu ≥44px target sentuh.
- **Primary:** fill `{colors.action}`, teks `{colors.action-foreground}`, label `font-bold`; hover `{colors.action-strong}`.
- **Header action:** fill `{colors.ink}` dengan teks `{colors.ground}` — kontras maksimum, tidak bersaing dengan CTA aksi.
- **Secondary / on-dark:** garis 1px (`{colors.line}` / `{colors.night-line}`), transparan, hover `{colors.night-raised}` di bidang gelap.
- **Focus:** ring `outline 2px var(--ring)` + offset 2px, global via `:focus-visible`.

### Chips / Badges

- **Style:** tint solid + teks berpasangan (`{colors.ok-tint}`/`{colors.ok}`, dst.), radius `{rounded.sm}` (4px) untuk badge status, tanpa pil penuh untuk status data.
- **State:** status selalu ikon + label; warna tidak pernah satu-satunya pembawa makna.

### Cards / Containers

- **Corner Style:** radius `{rounded.lg}` (8px).
- **Background:** `{colors.sheet}` di atas `{colors.ground}`; artefak bukti memakai `{colors.paper}`.
- **Shadow Strategy:** `shadow-card` satu level; lihat Elevation & Depth.
- **Border:** garis 1px `{colors.line}`; band memakai `border-y` tanpa cangkang kartu.
- **Internal Padding:** 16–20px; header kartu bukti berpola header-baris bergaris.

### Inputs / Fields

- **Style:** garis 1px `{colors.line}` di atas `{colors.sheet}`, radius `{rounded.md}`.
- **Focus:** ring kobalt 2px offset 2px; caret `{colors.action}`.
- **Error / Disabled:** `{colors.bad}` + `{colors.bad-tint}`; disabled redup dengan opacity.

### Navigation

Header sticky putih setengah-transparan dengan garis bawah; tautan teks berubah `aria-current` saat scroll (scroll spy). Mobile memakai drawer Radix Dialog dari kanan (lebar `min(20rem, 100vw-3rem)`), fokus terjebak, `DialogDescription` tersedia, Escape menutup, semua target ≥44px.

### Lembar Bukti (signature)

Artefak bukti kondisi — nota kertas `{colors.paper}` dengan header garis (ID order mono + badge status), bidang foto digambar sebagai bidang kertas ber ikon pakaian plus tanda air outlet/waktu, dan footer garis. Semua contoh diberi label "Contoh" / "Ilustrasi alur · data contoh" yang selalu terlihat; tidak ada data palsu yang dibaca live. Interaksi demo (Foto → Persetujuan WA → Stempel Terkunci) dipandu tombol ≥44px dengan `aria-live` dan jalur statis saat `prefers-reduced-motion`.

## Do's and Don'ts

### Do:

- **Do** pakai token semantik (`action`, `ink`, `night`, dst.) — dark mode bekerja tanpa `dark:` per elemen.
- **Do** beri setiap angka uang `tabular-nums` dan format via `formatIDR`.
- **Do** hormati `prefers-reduced-motion`: reveal tampil langsung, stepper mulai di langkah akhir, marquee bisa dijeda lewat kontrol 44px.
- **Do** label semua data contoh secara eksplisit ("Contoh", "Ilustrasi alur · data contoh").

### Don't:

- **Don't** pakai glassmorphism, backdrop-blur, atau pendaran neon — ditolak eksplisit.
- **Don't** pakai `{colors.graphic}` sebagai warna teks (3.64:1 di putih).
- **Don't** menaruh metric palsu atau klaim kuantitatif tanpa sumber.
- **Don't** melewati 12px radius; tidak ada pil untuk status data.
- **Don't** membuat target interaktif di bawah 44px atau teks fungsional di bawah 11px.
