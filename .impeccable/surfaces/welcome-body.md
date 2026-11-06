---
version: 4
slug: 'resources-js-pages-welcome-tsx'
primary_target: 'resources/js/pages/welcome.tsx'
related_targets:
    [
        'resources/js/components/marketing/hero.tsx',
        'resources/js/components/marketing/hero-bento-preview.tsx',
        'resources/js/components/marketing/audience-strip.tsx',
        'resources/js/components/marketing/feature-bento.tsx',
        'resources/js/components/marketing/pipeline.tsx',
        'resources/js/components/marketing/integrations.tsx',
        'resources/js/components/marketing/pricing.tsx',
        'resources/js/components/marketing/faq.tsx',
        'resources/js/components/marketing/cta-footer.tsx',
        'resources/js/components/marketing/site-header.tsx',
        'resources/js/components/marketing/layout.tsx',
        'resources/js/components/marketing/theme-switcher.tsx',
        'resources/js/components/marketing/split-text.tsx',
        'resources/js/components/marketing/count-up.tsx',
        'resources/js/components/marketing/proof-artifact.tsx',
        'resources/js/components/marketing/proof-card.tsx',
        'resources/js/components/marketing/status-badge.tsx',
        'resources/js/components/marketing/wa-bubble.tsx',
        'resources/js/components/marketing/repica-mark.tsx',
        'resources/css/app.css',
    ]
---

# Surface brief — `/` (welcome, halaman marketing Repica)

## Scope & mode

Route `/` (`resources/js/pages/welcome.tsx` + `components/marketing/*`). Mode: **Persuade**.
Audiens: Pak Rudi (pemilik 1 gerai, non-teknis, Android) primer; Bu Sari (3–10 outlet) sekunder.
Job: paham diferensiator (bukti kondisi), percaya, daftar trial 14 hari. Aksi utama: `/register`.

## Constraints (diperbarui sesi ini)

- **Override pengguna sesi ini:** rebuild penuh halaman marketing; `DESIGN.md`, `DESIGN-BRIEF-Laundry-SaaS.md`,
  dan `PRODUCT.md` **tidak mengikat** permukaan ini. Dunia visual di bawah menggantikannya.
- **Pin pengguna:** warna primer `#66C3FF`. Arah: interaktif + colorful, **tidak** norak.
- Anchor band (`#fitur`, `#cara-kerja`, `#harga`, `#faq`) dan tautan nav harus tetap sinkron.
- Tanpa dependensi npm baru. `motion` dan `lucide-react` sudah tersedia. Font self-host (`@font-face`,
  file di repo), tanpa stylesheet eksternal.
- Tanpa raw hex di class TSX — token Tailwind via `app.css` `@theme`. Komentar kode Bahasa Indonesia.
- AA kontras, `prefers-reduced-motion` dihormati, `lang="id"`, target sentuh ≥44px, focus ring terlihat.
- Semua angka uang/order pakai `tabular-nums`. Dark mode tetap jalan via token semantik bila toggle dipertahankan.

## Direction contract

THESIS: Halaman ini adalah rak sachet deterjen: tiap fitur adalah satu kemasan yang disobek untuk
menuangkan buktinya. Tawaran terbaca di detik pertama lewat sobekan sachet utama yang membuka
artefak bukti kondisi (foto + watermark + approval WhatsApp) — penolakan atas hero SaaS
headline-copy-button di atas screenshot dashboard generik.

OWN-WORLD: Ground off-white `#FBFCFE`; bidang warna #66C3FF sebagai dominan (field, garis, potongan);
pastel pendukung hemat — violet `#8B5CF6`, minta `#34D399`, rose `#FB7185`, amber `#FBBF24` — hanya
sebagai chip, aksen kartu, dan bekas sobekan. Tinta `#0F172A` untuk teks; action ink `#1D4ED8`
(fill CTA, teks tautan, ring fokus) karena #66C3FF di atas putih terlalu kontras-rendah untuk teks.
Bentuk: sobekan (tear edge) sebagai bahasa tepi, radius 12–24, elevasi lembut offset+blur
(`shadow-sm`, satu level untuk terangkat; `shadow-md` hanya untuk popover/modal), tanpa bayangan
bertumpuk; chip aksen warna; malam `#0B1B33` dengan field biru berpendar untuk band gelap. Tanpa glassmorphism.

STORY: Pengunjung melihat bukti kondisi tersobek keluar dari sachet hero, menyapu empat sachet
masalah operasional, mengikuti pipeline sebagai blok berdurasi terukur, membandingkan dua harga
jujur, menjawab FAQ, lalu mendaftar — yang tertinggal: "yang motret duluan, disetujui lewat WA".

FIRST VIEWPORT (1440): Nav strip biru bersobek di atas. Kiri: headline raksasa (display weights,
tracking ketat) di atas field blok pastel tak simetris; sub 2 baris; dua CTA — primer biru border
tinta hard-shadow, sekunder garis; strip empat fakta produk sebagai chip warna. Kanan: sachet
hero (rotasi halus) bersobek pada gesture/klik, di dalamnya artefak bukti kondisi; band bawah tetaplah
strip fakta yang sama. Mobile: satu kolom, sachet di bawah copy, sobekan tetap.

FORM: Kandidat 5 dari 7 daftar grounded (sachet deterjen di rak minimarket); seed:708681af0298dd10.
Raise yang dibawa: angka terhitung sebagai kejadian fisik (donasi nixie), ritme plate-over-pad
(donasi kalender), blok durasi terukur (donasi laban), bloom keaksesan cursor (donasi understory).
Signature interaction: **tear** — sobekan sachet sebagai interaksi pembuka konten.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the
verdict, DESIGN.md, and every shipping raster carrying its provenance.
