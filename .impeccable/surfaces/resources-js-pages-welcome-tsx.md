---
version: 1
slug: 'resources-js-pages-welcome-tsx'
primary_target: 'resources/js/pages/welcome.tsx'
related_targets: []
---

# Surface brief — `/` (welcome, halaman marketing Repica)

## Scope & mode

Route `/` (resources/js/pages/welcome.tsx + components/marketing/*). Mode: **Persuade**.
Audiensi: Pak Rudi (pemilik 1 gerai, non-teknis, Android) primer; Bu Sari (3–10 outlet) sekunder.
Job: paham diferensiator (bukti kondisi), percaya, daftar trial 14 hari. Aksi utama: `/register`.

## Constraints

- Palet & font terikat (deep teal #0F766E, warm stone, Plus Jakarta Sans) — komitmen brand.
- Layout mengikuti referensi pin-an user (ShopWave): header sticky, hero split, strip, grid fitur,
  band alternating, integrasi, pricing toggle, FAQ, CTA gradient, footer.
- Nol customer: tidak ada logo strip klien, tidak ada angka traction. Angka = fakta produk.
- Hanya 2 tier dapat dibeli (Basic/Pro); Enterprise terkunci "Segera" (DECISIONS Q1/Q9).
- Dark + light penuh; prefers-reduced-motion dihormati; lang=id; AA kontras.

## Direction contract

THESIS: Halaman ini adalah etalase mesin bukti — produk yang menjual kejujuran harus terlihat
jujur di detik pertama; menolak template SaaS generik dengan menampilkan mekanisme PoC yang
benar-benar bekerja di viewport pertama, bukan screenshot dashboard.

OWN-WORLD: Ground warm stone (#FAFAF9) dengan tinta utama stone-900; teal #0F766E membawa semua
aksi utama dan menenggelamkan band CTA penutup (Drenched di satu momen); amber hanya untuk
"menunggu". Radius 12–16, satu sistem elevasi (border 1px + soft offset shadow). Display voice
Plus Jakarta Sans 700 tracking -0.03em; angka tabular. Ikon lucide, stroke konsisten.

STORY: Pengunjung melihat loop bukti bekerja (foto→watermark→WA→setuju) dalam 5 detik, paham
bahwa sengketa & fraud jadi terbukti bukan diklaim, membandingkan 2 harga jujur dalam satu
viewport, lalu mendaftar atau bertanya via WA. Yang tersisa di kepala: "yang motret duluan".

FIRST VIEWPORT (1440): Header 64px sticky blur. Kiri (7/12): chip fungsional trial, H1 2 baris
±68px, sub 18px maks 52ch, CTA primer + WhatsApp, mikroline kepercayaan. Kanan (5/12): panel
demo PoC terangkat di atas wash teal, memainkan langkah otomatis. Di bawahnya strip audiensi.

FORM: seed: none (unavailable — arah di-pin user: referensi ShopWave + judgment didelegasikan;
concept-seed tidak dijalankan).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the
verdict, DESIGN.md, and every shipping raster carrying its provenance.
