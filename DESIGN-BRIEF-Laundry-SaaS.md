# Design Brief — Laundry Management SaaS MVP

> Derasarkan pada `PRD-Laundry-SaaS-MVP.md` (Draft v1). Dokumen ini adalah acuan desain sebelum satu baris kode ditulis.
> Semua keputusan diambil tegas dengan alasan — bukan default generic.

---

## 1. Design Principles (3 aturan wajib)

### P1 — "Kecepatan kasir adalah fitur, bukan bonus."
Pengguna dengan frekuensi tertinggi bukan owner, tapi kasir yang melayani pelanggan berdiri di depan meja. Setiap flow inti (buat order, update status) harus selesai **satu tangan, <30 detik, tanpa scroll panjang**.

*Alasan:* PRD G1 menjanjikan operasional <30 menit sejak daftar, tapi nilai harian produk ini ditentukan di counter. Setiap field opsional dipindah ke "detail", setiap tombol utama berada di zone jempol di mobile.

### P2 — "Bukti harus terlihat, bukan tersembunyi di log."
Diferensiasi produk adalah anti-fraud & anti-sengketa (Problem #1 & #2 PRD). Setiap aksi konsekuensial (override harga, void, rollback status) menampilkan konsekuensinya **sebelum** dikonfirmasi, dan jejak auditnya (siapa, kapan, dari-apa-ke-apa) terlihat di UI order — bukan cuma di tabel AuditLog yang tidak pernah dibuka.

*Alasan:* fitur diferensiator yang UI-nya tidak terasa berbeda tidak akan terasa berbeda juga di mata pembeli.

### P3 — "Status adalah bahasa bersama."
Enam status pipeline (`Diterima → Dicuci → Dikeringkan → Disetrika → Siap Diambil → Selesai`) harus punya **warna, ikon, dan kata yang identik** di seluruh permukaan: aplikasi, pesan WhatsApp, halaman approval pelanggan, laporan.

*Alasan:* Persona A non-teknis dan staff turnover di laundry tinggi — konsistensi total memangkas biaya training dan mencegah salah status (edge case Section 8 PRD).

---

## 2. Visual Direction

**Mood:** *"Mesin cuci yang tenang"* — bersih, utilitarian, industrial-hangat. Terasa seperti peralatan kerja yang andal, bukan konsumen-app yang manis, bukan enterprise-dashboard yang dingin.

**Referensi:**
- **BukuWarung/BukuKas** — kesederhanaan merchant-app Indonesia, bahasa yang familiar bagi Pak Rudi.
- **Linear/Notion** — disiplin density dan tipografi untuk laporan Bu Sari.
- **WhatsApp Business** (bukan sebagai gaya, tapi sebagai bahasa) — pelanggan berinteraksi lewat WA, jadi halaman approval Proof-of-Condition harus terasa "dilanjutan dari chat WA", bukan landing page marketing.

**Yang dihindari (keras):**
- Template admin SaaS generik (sidebar gelap + kartu gradient + chart 3D) — ini yang membuat semua kompetitor terlihat sama.
- Emoji sebagai ikon fungsional, ilustrasi playful, glassmorphism, dark mode (di MVP).
- Shadow dalam bertumpuk — cukup border 1px + satu level shadow. Lebih cepat dibangun solo dev dan terlihat lebih tajam.

---

## 3. Design Tokens

### Palet Warna

| Token | Hex | Alasan |
|---|---|---|
| `brand-700` (primary) | `#0F766E` | Deep teal: asosiasi air bersih & kain segar — relevan literal dengan produk — tanpa jatuh ke "biru SaaS generik". Kontras di putih ≈ 5.2:1, lolos AA untuk teks & tombol. |
| `brand-900` (hover/tekan) | `#0C5F59` | Turunan gelap, bukan hitam — menjaga rasa "satu dunia warna". |
| `brand-50` (tint bg) | `#E6F4F2` | Latar badge, selected state, banner. |
| `stone-50` | `#FAFAF9` | Background app. Warm gray, bukan cool gray — laundry adalah bisnis rumah tangga, bukan server room. |
| `stone-900` | `#1C1917` | Teks utama. Kontras di `stone-50` ≈ 16:1. |
| `stone-400` | `#A8A29E` | Border/divider — cukup untuk non-teks (3:1+ di bg). |
| `amber-700` / `amber-100` | `#B45309` / `#FEF3C7` | **High-risk & menunggu** (item berisiko, approval pending, subscription H-3). Amber dipilih khusus: inilah warna "perhatian kasir", dipakai hemat agar tetap menolong. |
| `green-700` | `#15803D` | Sukses: `Siap Diambil`, `Selesai`, pembayaran lunas. |
| `red-700` | `#B91C1C` | Error, void, gagal upload. |
| `sky-600` | `#0284C7` | Informasional (status `Dicuci`, `Dikeringkan`). |

**Warna status pipeline** (selalu berpasangan ikon + label, tidak pernah warna saja — lihat §10):

| Status | Warna |
|---|---|
| `Diterima` | stone |
| `Dicuci` | sky |
| `Dikeringkan` | cyan |
| `Disetrika` | violet |
| `Siap Diambil` | green |
| `Selesai` | stone-terisi |
| `Menunggu Persetujuan` (turunan, high-risk) | amber |

### Tipografi — **Plus Jakarta Sans (400/500/600/700)**

*Alasan tegas:* dirancang foundry Indonesia (Tokotype), open source (OFL) — nol biaya lisensi untuk solo dev — geometris-humanist sehingga sangat terbaca di layar HP kecil milik Pak Rudi, dan memberi identitas lokal yang bukan klise.

Semua kolom uang & nomor order wajib `font-variant-numeric: tabular-nums` agar Rupiah sejajar vertikal di tabel laporan — detail yang membuat laporan Bu Sari terasa "akurat".

Skala: `12 / 14 (body) / 16 (body-lg, mobile default) / 20 (h3) / 24 (h2) / 32 (h1 & angka revenue)`. Line-height 1.5 body, 1.25 heading.

### Spacing (base 4px)

`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64`

Container max-width: `1200px` desktop; konten form max `640px`.

### Radius

- `8px` — input, tombol
- `12px` — kartu
- `999px` — badge/pill

Konsisten karena kasir mengenali elemen dari bentuk, bukan membaca label.

### Shadow

Hanya 2 level — `shadow-sm` (input fokus, kartu terangkat) dan `shadow-md` (popover, dropdown, modal). Sisanya border `1px stone-300`.

---

## 4. Screen Inventory

### Permukaan pelanggan (via link WA — wajib pola karena ini etalase publik)

| # | Screen | Tujuan |
|---|---|---|
| S1 | PoC Approval Page | Pelanggan melihat foto kondisi awal + tombol "Setuju & Lanjutkan" (FR-9.3). Ini halaman paling kritis reputasi. |
| S2 | Order Status Page | Cek status order via link/nomor — fallback jika WA notif gagal (edge case 6.7). |

### Aplikasi tenant

| # | Screen | Tujuan |
|---|---|---|
| S3 | Register + OTP | Verifikasi (FR-1.1). |
| S4 | Onboarding Wizard | 3 langkah: tipe bisnis → data outlet → pilih plan & bayar (FR-1.2–1.5). |
| S5 | Dashboard | Ringkasan: order masuk hari ini, siap diambil, pendapatan harian, alert (approval pending, WA gagal). |
| S6 | Orders (list) | Tabel/kartu semua order + filter status/outlet/tanggal; kasir mulai hari di sini. |
| S7 | Order Create | **Layar paling penting produk.** Buat order <30 detik. |
| S8 | Order Detail | Timeline status, item, foto PoC, pembayaran, aksi (update status, void — dengan jejak audit). |
| S9 | Customers | Daftar + saldo deposit (FR deposit/member). |
| S10 | Price List | CRUD layanan & harga. |
| S11 | Outlets | CRUD outlet (multi-outlet, Pro tier). |
| S12 | Staff & Roles | Assign kasir/admin ke outlet (FR-3.2). |
| S13 | Reports | Harian per outlet + konsolidasi + export (FR-8.1–8.3). |
| S14 | Subscription & Billing | Plan aktif, upgrade/downgrade, riwayat pembayaran (FR-5.1). |
| S15 | Settings | Template pesan WA (FR-7.3), jam operasional, profil. |
| S16 | Audit Log | Feed aksi kritikal (FR-3.4). |

### Platform Super Admin

Dashboard terpisah, bukan bagian tenant (FR-2.3): tenant list, MRR, status subscription. Desain minimal, bukan fokus brief ini.

---

## 5. User Flow (journey utama)

### F1 — Onboarding → order pertama (G1: <30 menit)
1. Register (HP + OTP)
2. Wizard: pilih "Single/Multi-Outlet" (menentukan langkah selanjutnya)
3. Isi data outlet (nama, alamat, WA operasional — hanya 3 field wajib)
4. Pilih plan → bayar via Midtrans/Xendit
5. Status "menunggu konfirmasi" dengan copy jujur ("Kami cek otomatis tiap X menit")
6. Aktif → langsung dilempar ke **Order Create**, bukan dashboard kosong.

*Alasan: order pertama adalah "aha moment", bukan dashboard.*

### F2 — Kasir buat order (dengan cabang high-risk)
1. Ketuk FAB "+ Order"
2. Cari customer (berdasarkan **nomor HP**, bukan nama — orang Indonesia hafal nomor, bukan ejaan nama)
3. Tambah item dari price list (kg/pcs) → sistem hitung total
4. *Jika item ditandai high-risk:* layar kamera terbuka **wajib** → foto → watermark otomatis → simpan → link WA terkirim → order masuk status `Menunggu Persetujuan` (turunan amber dari `Diterima`)
5. Order non-high-risk langsung tersimpan
6. Nota/print opsional
7. WA notif "order dibuat" otomatis

### F3 — Update status
Di Order Detail atau swipe di list: satu ketuk status berikutnya → status berubah + WA terkirim (FR-6.3) → toast "✓ Status: Dicuci · WA terkirim". Jika WA gagal → toast peringatan + fallback SMS otomatis (edge case Section 8).

### F4 — Approval PoC (pelanggan)
Buka link WA (S1) → lihat foto + detail order → "Setuju & Lanjutkan" → status order lanjut otomatis. Timeout 24 jam (usulan, pending Open Question #7) → order dapat flag `customer_no_response`, kasir bisa lanjut manual dengan tombol yang menuliskan konsekuensinya secara eksplisit (P2).

### F5 — Subscription expired
Tenant read-only: order berjalan tetap bisa diselesaikan, order baru diblokir (FR-5.4, edge case Section 8). Banner amber permanen + tombol "Perpanjang" — bukan modal interstitial yang menghalangi melihat data.

### F6 — Sengketa
Owner buka Order Detail riil → foto PoC ber-watermark + log approval terlihat → dapat dibagikan/diunduh sebagai bukti. Ini momen nilai produk — foto harus bisa di-share langsung ke WA pelanggan yang komplain.

---

## 6. Layout per Screen (screen kunci)

### S7 — Order Create (mobile-first)
- Hierarki: (1) Customer picker di atas — search by HP; (2) daftar item (chip layanan + input berat/jumlah, subtotal live); (3) bar total sticky di bawah dengan **primary action "Simpan Order"** — selalu terlihat, tidak perlu scroll; (4) checkbox "Item berisiko tinggi" dekat item, bukan di menu; (5) estimasi selesai otomatis dari rule statis (FR-6.5), tampil sebagai teks sekunder.
- Komponen: `CustomerPicker`, `ServiceChip`, `WeightInput`, `MoneyDisplay`, `StickyActionBar`, `HighRiskToggle`, `CameraCapture`.

### S5 — Dashboard (owner)
- Hierarki: (1) baris alert amber (approval pending, WA gagal) — masalah duluan daripada vanity metric; (2) 3 angka besar tabular-nums: pendapatan hari ini, order aktif, siap diambil; (3) daftar order terbaru; (4) shortcut "Buat Order". Bukan grid widget SaaS generik.

### S13 — Reports (desktop-first)
- Kiri: filter (rentang tanggal, outlet) — kanan: tabel + chart garis sederhana. Primary action: "Export PDF/Excel" di header. Angka selalu tabular-nums, breakdown metode bayar sebagai bar horizontal sederhana.

### S1 — PoC Approval (public)
- Satu kolom: logo outlet → foto besar (bisa pinch-zoom) → watermark timestamp + order ID terlihat → detail order ringkas → tombol besar "Setuju & Lanjutkan" → state "Sudah disetujui ✓" setelahnya. Tanpa navigasi, tanpa login.

---

## 7. Component Library (reusable + variant/state)

| Komponen | Variant | State |
|---|---|---|
| `Button` | primary / secondary / ghost / danger | default · hover · active · disabled · loading |
| `StatusBadge` | 6 status pipeline + `Menunggu Persetujuan` | — (selalu ikon+label) |
| `CustomerPicker` | — | kosong · searching · hasil · tidak-ditemukan · buat-baru |
| `WeightInput` | kg / pcs | kosong · fokus · invalid · disabled |
| `CameraCapture` | — | idle · aktif · mengambil · meng-upload · retry (koneksi lemah) · gagal |
| `PhotoCard` (PoC) | grid / full | ter-watermark · pending-approval · approved · timeout |
| `StickyActionBar` | — | normal · loading · disabled |
| `ConfirmDialog` | destructive / informative | — (wajib menyebut konsekuensi + jejak audit, P2) |
| `TierGate` | inline lock (menu buram + ikon gembok) | locked · upgrading. **Keputusan: tidak ada modal upsell pop-up** — menghormati alur kasir. |
| `EmptyState` | with-CTA / informational | — |
| `DataTable` | desktop | sortable · filtered · export-ready; jadi `CardList` di mobile |
| `Toast` | success / warning / error | auto-dismiss 4s; warning (WA gagal) persistent |
| `OfflineBanner` | — | muncul saat koneksi hilang — kritis untuk PoC upload |
| `Timeline` (order) | vertical | done · current · pending · rolled-back |
| `PlanCard` | current / recommended / locked | selected · disabled |

---

## 8. State per Screen Kunci

| Screen | Empty | Loading | Error | Success | Offline |
|---|---|---|---|---|---|
| Dashboard | "Belum ada order hari ini" + CTA buat order | skeleton angka | banner error + retry | — | banner amber, data cache terakhir |
| Orders | EmptyState dengan filter-reset | skeleton rows | retry inline | toast per aksi | banner, read cache |
| Order Create | CustomerPicker kosong → "Buat customer baru" | tombol simpan spinner | **draft order tetap tersimpan lokal**, error inline per field | toast + redirect ke detail | **tolak simpan order high-risk tanpa foto ter-upload** (sesuai edge case PRD), non-high-risk boleh queue offline |
| CameraCapture | — | overlay progress | retry otomatis 3× lalu manual | preview + watermark terlihat | indikator kuat sinyal; draft foto lokal |
| Reports | "Belum ada transaksi di rentang ini" | skeleton tabel | retry | export mengunduh file | blok export dengan pesan |
| PoC Approval (S1) | foto gagal load → placeholder + tombol muat ulang | spinner tombol | pesan jelas + kontak outlet | halaman "Disetujui ✓" persisten (kalau di-refresh) | pesan "butuh koneksi" |
| Subscription | — | — | pembayaran pending sesuai edge case PRD (cron cek gateway, **tidak pernah asumsi sukses**) | plan aktif langsung terlihat | — |

---

## 9. Responsive Behaviour

| Breakpoint | Perangkat | Keputusan |
|---|---|---|
| `<768px` (mobile) | Kasir di counter (HP Android Pak Rudi) — **prioritas #1** | Bottom tab nav (Order, +, Customer, Lainnya), FAB "+ Order", semua list berupa kartu (bukan tabel), CameraCapture dioptimalkan di sini, target sentuh ≥44px |
| `768–1024px` (tablet) | Kasir meja | Layout mobile dengan grid 2 kolom untuk Order Create; kamera tetap via web |
| `≥1024px` (desktop) | Bu Sari & owner | Sidebar kiri (bukan bottom nav), Reports & Audit Log & Staff sebagai tabel penuh, keyboard-first (search `/`, Enter submit) |

Prinsip: **bukan satu layout yang di-shrink** — alur kasir dirancang mobile-first, alur analitik dirancang desktop-first, keduanya bertemu di Order Detail.

---

## 10. Accessibility

- **Kontras:** teks ≥4.5:1, elemen UI ikonik ≥3:1. Kombinasi di atas sudah diverifikasi (brand-700 di putih 5.2:1; stone-900 di stone-50 16:1). Warna status **tidak pernah** satu-satunya pembawa makna — selalu ikon + teks label (penting: buta warna merah-hijau akan tertukar `Siap Diambil` vs `Dikeringkan` jika hanya warna).
- **Focus order:** mengikuti urutan logis per layout (atas→bawah, kiri→kanan); di Order Create urutannya: customer → item → total → simpan.
- **Keyboard nav (desktop):** semua aksi kasir bisa keyboard-only; `Esc` tutup modal, fokus ter-trap di modal dan kembali ke trigger setelah tutup; skip-link ke konten utama.
- **ARIA:**
  - `StatusBadge` pakai `role="status"` + `aria-label` teks lengkap.
  - Timeline pakai `aria-current="step"`.
  - CameraCapture memberi feedback live-region ("Foto tersimpan, mengunggah…").
  - PhotoCard `alt` = "Kondisi awal: [deskripsi item], [timestamp], [order ID]".
  - Loading pakai `aria-busy`, toast pakai `role="alert"` untuk error.
- **Lainnya:** `lang="id"` di HTML, form error terkait via `aria-describedby`, angka uang tidak dibacakan per-digit (format Indonesia `Rp 150.000`), halaman publik S1 harus accessible tanpa login (ini satu-satunya permukaan pelanggan — standar aksesibilitasnya sama dengan aplikasi).

---

## Rekomendasi Strategis (big bets)

1. **Jadikan halaman PoC Approval (S1) sebagai permukaan marketing.** Ini satu-satunya halaman yang dilihat *pelanggan akhir* laundry — desain terbaik di sana adalah iklan gratis: setiap pelanggan puas adalah calon tenant berikutnya.
2. **Offline-first hanya untuk foto PoC.** Koneksi outlet lemah adalah edge case eksplisit PRD; alih-alih menyelesaikannya di seluruh app (mahal), fokuskan queue + retry lokal hanya pada foto dan order draft. Effort rendah, dampak besar pada fitur diferensiator.
3. **Audit log sebagai UI, bukan archive.** Render jejak audit langsung di Order Detail ("Harga diubah oleh Sari, 10:32, Rp15.000→Rp18.000") — ini membuat janji anti-fraud *terlihat* sebelum fitur anomaly detection v2 ada, dan menaikkan persepsi nilai tier Pro.
4. **Hindari dark pattern tier-gating.** Semua fitur terkunci tampil sebagai inline lock yang menjelaskan nilainya satu kalimat — bukan modal interupsi. Churn kasir karena UI menghalangi pekerjaan akan terbaca sebagai produk buruk, bukan tier.

---

## Catatan Terbuka

Open question PRD yang paling memengaruhi desain: **#3 (price list per outlet vs tenant)** — menentukan apakah Price List (S10) butuh tab per outlet atau tidak.
