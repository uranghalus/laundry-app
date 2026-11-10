---
version: 6
slug: 'resources-js-pages-welcome-tsx'
primary_target: 'resources/js/pages/welcome.tsx'
related_targets:
    [
        'resources/js/components/marketing/hero.tsx',
        'resources/js/components/marketing/problems-ledger.tsx',
        'resources/js/components/marketing/proof-band.tsx',
        'resources/js/components/marketing/proof-flow.tsx',
        'resources/js/components/marketing/proof-card.tsx',
        'resources/js/components/marketing/pipeline.tsx',
        'resources/js/components/marketing/integrations.tsx',
        'resources/js/components/marketing/pricing.tsx',
        'resources/js/components/marketing/faq.tsx',
        'resources/js/components/marketing/cta-footer.tsx',
        'resources/js/components/marketing/site-header.tsx',
        'resources/js/components/marketing/layout.tsx',
        'resources/js/components/marketing/theme-switcher.tsx',
        'resources/js/components/marketing/status-badge.tsx',
        'resources/js/components/marketing/wa-bubble.tsx',
        'resources/js/components/react-bits/fade-content.tsx',
        'resources/js/components/react-bits/spotlight-card.tsx',
        'resources/js/components/react-bits/tilt-card.tsx',
        'resources/js/components/react-bits/marquee.tsx',
        'resources/js/components/react-bits/count-up.tsx',
        'resources/js/lib/site.ts',
        'resources/js/lib/format.ts',
        'resources/css/app.css',
    ]
---

# Surface brief — `/` (welcome, halaman marketing Repica)

## Scope & mode

Route `/` (`resources/js/pages/welcome.tsx` + `components/marketing/*`). Mode: **Persuade**.
Audiens: Pak Rudi (pemilik 1 gerai, non-teknis, Android) primer; Bu Sari (3–10 outlet) sekunder.
Job: paham diferensiator (bukti kondisi), percaya, daftar trial 14 hari. Aksi utama: `/register`.

## Constraints

- **Dunia visual:** "Buku Bukti" (Evidence Ledger) per **DESIGN.md v6** dan **DECISIONS.md Q11** —
  kertas hangat, tinta arsip, satu kobalt aksi `#0B6EA8`, cerulean `#008DD5` hanya grafik.
- Anchor band (`#fitur`, `#cara-kerja`, `#harga`, `#faq`) dan tautan nav tetap sinkron; scroll spy
  di header.
- Tanpa dependensi npm baru. `motion` dan `lucide-react` sudah tersedia. Font self-host Manrope
  (`@font-face`, file di repo), tanpa stylesheet eksternal.
- Tanpa raw hex di class TSX — token Tailwind via `app.css` `@theme`. Komentar kode Bahasa Indonesia.
- AA kontras, `prefers-reduced-motion` dihormati (reveal tampil langsung, demo punya jalur statis),
  `lang="id"`, target sentuh ≥44px, focus ring terlihat, teks fungsional ≥11px.
- Semua angka uang/order pakai `tabular-nums` + `formatIDR`. Dark mode jalan via token semantik
  (`night*`) tanpa `dark:` per elemen; toggle tema dipertahankan.
- Kontak WhatsApp config-driven: `siteConfig.whatsappUrl = null` → elemen WA tidak dirender. Tanpa
  metrik palsu; setiap data contoh berlabel ("Contoh", "Ilustrasi alur · data contoh").

## Direction contract

THESIS: Halaman ini adalah buku bukti operasional. Setiap band adalah halaman buku yang membuktikan
satu klaim — masalah dicatat seperti entri ledger, alur bukti diputar sebagai ilustrasi berlabel,
enam status dibaca sebagai daftar terkunci. Penolakan atas hero SaaS headline-copy-button di atas
screenshot dashboard generik, dan atas estetika kaca (glassmorphism/neon).

OWN-WORLD: Kertas hangat `#FAF9F6` sebagai kanvas; lembar putih `#FFFFFF` untuk band berbingkai
`border-y`; nota `#FAF6EE` hanya di dalam artefak bukti. Tinta `#121417`, garis buku besar 1px
`#E3DFD6` (`ledger-grid`). Satu kobalt aksi `#0B6EA8` (fill CTA, tautan, ring, seleksi); cerulean
`#008DD5` hanya garis/grafik/spotlight. Radius 4/6/8/12px, bayangan datar dua level (`shadow-card`,
`shadow-float` untuk header/drawer). Tiga bidang gelap `#0E1A24`: pipeline, panel harga Pro, CTA
penutup. Tanpa pil untuk status data; ikon lucide saja.

STORY: Pengunjung membuka buku di hero (headline dua nada + artefak bukti miring + marquee
ringkasan), membaca entri kerugian di ledger masalah, memutar ilustrasi alur bukti (Foto →
Persetujuan WA → Stempel Terkunci) di band `#fitur`, mengikuti enam status di band gelap
`#cara-kerja` dengan contoh pesan pelanggan, memverifikasi kanal, membandingkan dua harga jujur
(dengan total & hemat annual yang persis), menjawab FAQ, lalu mendaftar — yang tertinggal:
"bukti kondisi tercatat dan terkunci, bukan janji".

FIRST VIEWPORT (1440): Header sticky tipis dengan garis bawah. Kiri: headline display raksasa
(dua nada — kalimat kedua diwarnai), sub-lead, dua CTA (primer kobalt h-12, sekunder garis),
fakta ledger di bawahnya. Kanan: artefak bukti miring ringan (`-1.2deg`) dengan sheet putih,
header bergaris, bidang foto bergambar ikon pakaian + tanda air, bubble WA menimpa area ilustrasi
saja. Di bawah hero: marquee ringkasan berbingkai dengan kolom jeda 44px statis di sisi kanan.
Mobile: satu kolom, artefak di bawah copy, semua target ≥44px.

FORM: Grounded editorial-documentary; seed dari DESIGN.md v6. Interaksi: spotlight mengikuti kursor
pada kartu (`spotlight-card`), tilt halus pada artefak (`tilt-card`), reveal sekali di bawah lipatan
(`fade-content`), marquee `linear infinite` dengan `animation-play-state` dikontrol. Semua gerak
mematuhi `prefers-reduced-motion`.

FINISH: Halaman selesai dan terverifikasi — detector desktop 0 warning / 9 advisory, mobile
0 warning / 6 advisory (`.impeccable/detect-final-*.json`), QA CDP 8 viewport × 2 skema tanpa
overflow horizontal & teks <11px, interaksi (demo, stepper, harga annual, FAQ, drawer, Escape)
lulus, 110 test backend hijau. DESIGN.md v6 + DECISIONS.md Q11 adalah catatan finalnya.
