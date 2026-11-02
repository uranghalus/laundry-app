---
version: 3
slug: 'resources-js-pages-welcome-tsx'
primary_target: 'resources/js/pages/welcome.tsx'
related_targets: ['resources/js/components/marketing/proof-artifact.tsx', 'resources/js/components/marketing/layout.tsx']
---

# Surface brief — `/` (welcome, halaman marketing Repica)

## Scope & mode

Route `/` (`resources/js/pages/welcome.tsx` + `components/marketing/*`). Mode: **Persuade**.
Audiensi: Pak Rudi (pemilik 1 gerai, non-teknis, Android) primer; Bu Sari (3–10 outlet) sekunder.
Job: paham diferensiator (bukti kondisi), percaya, daftar trial 14 hari. Aksi utama: `/register`.

## Constraints

- Palet terikat pada **#266DD3** sebagai action ink, netral slate, dan tiga warna status.
  Sumber kebenaran lengkap: `DESIGN.md` v3 "Bukti Terkendali".
- Dua momen navy hanya di band Pipeline (`#cara-kerja`) dan CTA penutup; band lain terang.
- Nol customer: tidak ada logo klien, tidak ada angka traction. Angka = fakta produk.
- Hanya 2 tier dapat dibeli (Basic/Pro) + trial 14 hari; korporat "Segera" (DECISIONS Q1/Q9).
- Dark + light penuh lewat token semantik; prefers-reduced-motion dihormati; lang=id; AA kontras.

## Direction contract

THESIS: Halaman ini adalah meja kerja pemilik laundry yang rapi — satu nota bukti kondisi,
satu buku kas, satu papan status. Produk yang menjual kejujuran harus memperlihatkan dokumennya
di detik pertama, bukan screenshot dashboard generik.

OWN-WORLD: Kanvas hampir putih (`#FCFCFD`) dengan garis rambut 1px sebagai anatomi; kertas hangat
(`#FAF8F4`) hanya di dalam artefak nota; kobalt `#266DD3` membawa semua aksi dan tautan. Dua bidang
navy (`#0E1B2E`) menjadi ruang kontrol: Pipeline dan CTA penutup. Radius 8/12/16/20, bayangan hanya
untuk nota dan kartu Pro. Plus Jakarta Sans 700 tracking -0.035em; angka selalu tabular.

STORY: Pengunjung melihat loop bukti bekerja (foto→watermark→WA→setuju) di hero, membaca empat
masalah operasional yang ditutup di bento, memahami enam tahap pipeline, membandingkan harga jujur,
lalu mendaftar atau bertanya via WhatsApp. Yang tersisa di kepala: "yang motret duluan".

FIRST VIEWPORT (1440): Header 64px solid, garis muncul saat scroll. Kiri: H1 clamp(2.35rem, 6.4vw,
4.5rem) tracking -0.035em dengan satu kata bergaris bawah kobalt, lead maks 2–3 baris, dua CTA
(primer `bg-action` + WhatsApp garis), lalu strip empat fakta produk. Kanan: `ProofArtifact` —
nota bukti kondisi dengan tepi perforasi, nomor order, slot foto ber-watermark, baris meta, cap
disetujui. Di bawahnya audience strip tiga segmen bergaris rambut.

FORM: tidak memakai concept-seed. Dunia visual diturunkan dari `DESIGN.md` v3 dan diverifikasi
dengan detector impeccable (0 temuan).

FINISH: `npm run check`, `npm run types:check`, `npm run build`, `php artisan test`,
`vendor/bin/pint --dirty --format agent` hijau. Handoff visual terakhir: review desktop + mobile.
