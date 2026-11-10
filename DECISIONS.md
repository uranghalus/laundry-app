# DECISIONS.md — Keputusan Open Questions PRD

> **Status:** Keputusan final — menunggu konfirmasi/override owner sebelum coding modul Billing & Onboarding.
> **Tanggal:** 2026-09-22
> **Referensi:** `PRD-Laundry-SaaS-MVP.md` (Section 10), `DESIGN-BRIEF-Laundry-SaaS.md`
> Semua keputusan diambil tegas dengan alasan — bukan default generic.

---

## Ringkasan

| #   | Pertanyaan         | Keputusan (satu baris)                                                       |
| --- | ------------------ | ---------------------------------------------------------------------------- |
| 1   | Struktur tier      | 2 tier di MVP (Basic/Pro), **PoC masuk Basic**, Enterprise ditunda sampai v2 |
| 2   | Channel OTP        | WhatsApp OTP default + fallback SMS; email opsional                          |
| 3   | Price list         | **Per tenant di MVP**, skema disiapkan untuk override per outlet             |
| 4   | Model billing      | Invoice manual per periode + pay link, bukan auto-charge                     |
| 5   | Provider WA        | Meta WhatsApp Cloud API (resmi), hindari gateway unofficial                  |
| 6   | Retensi foto PoC   | 12 bulan (lifecycle auto-purge), metadata approval permanen                  |
| 7   | Timeout approval   | Default 2 jam, configurable 1–24 jam, 1 reminder                             |
| 8   | Target adopsi      | 20 tenant bayar & MRR ±Rp4–5jt akhir bulan ke-3 (hipotesis, review D+30)     |
| 9   | Harga nominal      | Basic Rp149rb/bln, Pro Rp499rb/bln, annual = 2 bulan gratis                  |
| 10  | Desain welcome `/` | Arah **"Segar Premium"** (premium fresh); overhaul total + token baru        |

---

## Q1 — Struktur Tier: 2 tier, dan PoC masuk Basic

**Keputusan:** Luncurkan **Basic + Pro saja**. Enterprise ditunda sampai fitur B2B (v2) benar-benar ada. Dan **Proof-of-Condition pindah ke Basic** — revisi terbesar dari usulan PRD.

**Alasan PoC harus di Basic:**

- PRD sendiri menyatakan diferensiasi _hanya_ mungkin lewat fitur yang menyerang 3 masalah utama. Kalau diferensiator dikunci di Pro, calon tenant single-outlet — segmen yang paling mudah diakuisisi — hanya melihat POS generic yang sama dengan kompetitor yang sudah matang. Funnel konversi jadi didorong fitur komoditas. Kontradiksi dengan tesis PRD sendiri.
- Sengketa pakaian rusak (Problem #2) dialami sama beratnya oleh single-outlet. Pak Rudi butuh PoC bukan kalah penting dari Bu Sari.
- Biaya PoC kecil (foto + pesan WA); menguncinya di tier mahal bukan perlindungan margin, tapi pembuangan nilai jual.

**Prinsip tier:** _jual skala bisnis, bukan nilai inti._ Batas tier mengikuti ukuran bisnis (jumlah outlet, jumlah user, kebutuhan konsolidasi) — bukan mengunci fitur core di tier termurah.

|                                                     | **Basic** — Rp149rb/bln | **Pro** — Rp499rb/bln       |
| --------------------------------------------------- | ----------------------- | --------------------------- |
| Outlet                                              | 1                       | ≤5                          |
| User                                                | 2 (owner + 1 kasir)     | Tak terbatas                |
| Order end-to-end, WA notif, laporan harian, deposit | ✓                       | ✓                           |
| **Proof-of-Condition**                              | ✓ (cap 100 foto/bln)    | ✓ tanpa cap                 |
| Audit trail per order                               | ✓ (di Order Detail)     | ✓ + halaman Audit Log penuh |
| RBAC, multi-outlet, laporan konsolidasi             | —                       | ✓                           |

Cap foto 100/bln hampir tidak akan tersentuh (10% order high-risk × laundry kecil ≈ 20–30 foto/bln) tapi memberi jalur upsell yang jujur. Enterprise tetap _di-reserve namanya_ untuk rilis v2 — jangan jual tier yang fiturnya belum ada; itu janji kosong yang menyita support.

**Dampak:** matriks feature-flag (FR-5.5) kecil dan mudah dites solo dev. Halaman pricing jujur dan sederhana.

---

## Q2 — OTP: WhatsApp default, fallback SMS

**Keputusan:** OTP via **WhatsApp** (authentication template), fallback **SMS**. Email opsional, bukan kanal utama.

**Alasan:**

- Persona PRD hidup di WA ("terbiasa WhatsApp Business"). Open rate WA jauh di atas email untuk demografi ini; email sering tidak aktif dipakai pemilik laundry.
- **Nomor HP adalah kunci identitas produk ini** — customer dicari by nomor HP, notifikasi dikirim ke nomor HP. Memverifikasi nomor sejak registrasi jauh lebih bernilai daripada memverifikasi email.
- Satu vendor WA untuk OTP + notifikasi order + link PoC = satu integrasi, satu hubungan vendor, satu model biaya.
- SMS fallback tetap wajib karena nomor bisa tidak terdaftar di WA — dan fallback ini sudah dimodelkan di tabel `Notification` (channel wa/sms).

---

## Q3 — Price List: per tenant di MVP, siapkan override per outlet

**Keputusan:** **Seragam per tenant di MVP.** Skema data disiapkan agar per-outlet bisa ditambah belakangan tanpa rework.

**Alasan:**

- Mayoritas tenant awal single-outlet — price list per-outlet adalah dead weight untuk mereka, hanya menambah kompleksitas UI dan onboarding.
- G1 menjanjikan setup <30 menit. Satu price list untuk diisi vs N price list — ini langsung memengaruhi janji onboarding.
- Untuk bisnis 2–5 outlet, harga seragam adalah praktik umum; harga beda per outlet (mall vs residential) adalah pengecualian, bukan default. Kalau ada Pro customer yang menuntut, itu validasi baru — bukan asumsi awal.
- **Jebakan yang dihindari:** ini bukan "simple sekarang, migrasi mahal nanti". Pola yang benar: `PriceListItem` pakai `tenant_id` sekarang; nanti tambah tabel `PriceOverride (tenant_id, outlet_id, price_list_item_id, price)` — additif, tanpa migrasi data lama.

**Dampak:** S10 (Price List) di design brief tidak butuh tab per outlet di MVP. FR-4.2 dijawab: _tidak wajib di MVP_.

---

## Q4 — Billing: invoice manual + pay link, bukan recurring otomatis

**Keputusan:** **Invoice manual per periode** dengan pay link (VA/QRIS/e-wallet), reminder H-3 & H-0, expired → read-only sesuai FR-5.4, reaktivasi otomatis via webhook gateway. Opsi annual tersedia.

**Alasan:**

- Auto-charge kartu (tokenization) di Indonesia punya success rate rendah — penetrasi kartu rendah, dunning (kartu expired, 3DS gagal) adalah mesin support ticket. Solo dev tidak seharusnya membangun dunning di MVP.
- Metode bayar dominan pasar ini adalah VA, QRIS, e-wallet — semuanya _pull_ (customer yang bayar), bukan _push_ (merchant menarik). Model invoice mencocokkan perilaku bayar nyata SMB Indonesia.
- FR-5.3 (reminder H-3) dan FR-5.4 (read-only) yang sudah ada di PRD memang didesain untuk model ini.
- Edge case Section 8 (callback gagal, cron cek ulang) tetap dibutuhkan tapi lebih sederhana: status hanya aktif atas webhook sukses, tidak pernah asumsi.
- **Opsi annual** memotong frekuensi penagihan dan churn sekaligus.

Auto-charge (kartu token / e-wallet direct debit) ditunda ke v2 jika data menunjukkan demand. **Gateway:** Xendit — produk Invoice-nya maps 1:1 ke model ini (recurring invoice otomatis + VA/QRIS/retail luas). Kecuali sudah ada akun Midtrans — pakai yang ada, perbedaannya tidak sepadan dengan effort migrasi.

---

## Q5 — Provider WA: resmi, bukan gateway unofficial

**Keputusan:** **Meta WhatsApp Cloud API** (resmi, self-serve, tanpa perantara BSP) + satu vendor SMS lokal untuk fallback.

**Alasan:**

- Wablas/Fonnte murah dan mudah — tapi dibangun di atas area abu-abu ToS WA dengan risiko **ban nomor pengirim**. Untuk produk berbayar B2B itu bukan risiko teknis biasa: **link approval PoC dikirim via WA**. Kalau nomor keban, seluruh pipeline high-risk macet dan diferensiator mati. Dependensi eksistensial tidak boleh berdiri di atas kanal yang melanggar ToS.
- FR-7.3 butuh template dengan variabel (nama outlet, nomor order) — Cloud API memang didesain untuk ini (template kategori utility, biaya conversation murah).
- **Catatan eksekusi:** verifikasi bisnis Meta + approval template bisa makan waktu — mulai proses verifikasi di minggu pertama development, bukan menjelang launch.

---

## Q6 — Retensi foto PoC: 12 bulan, metadata permanen

**Keputusan:** Foto disimpan **12 bulan**, lalu auto-purge/arsip via lifecycle policy object storage. **Log approval (metadata) disimpan permanen** di database.

**Alasan:**

- Sengketa muncul dalam hitungan hari–minggu, bukan tahun. 12 bulan menutup klaim "baju saya bulan lalu" dengan margin lega, dan menyamai siklus billing annual.
- Yang membuktikan secara hukum-praktis bukan hanya foto, tapi _rekaman bahwa approval terjadi_ (timestamp, status, wa_message_ref) — itu baris DB berukuran bytes, simpan selamanya. Foto adalah bulk-nya; pisahkan keduanya.
- Biaya: foto terkompresi (max 1280px, JPEG ±200–400KB) × 10% order ≈ ~1GB/tahun per tenant sibuk — receh. Tapi pasang lifecycle policy **sejak hari pertama**: sekali set, nol maintenance.
- Untuk Enterprise/v2 (klien hotel), retensi diperpanjang bisa jadi fitur berbayar.

---

## Q7 — Timeout approval: 2 jam default, configurable

**Keputusan:** **Default 2 jam** (configurable 1–24 jam per tenant), dengan **1 reminder WA** di tengah window. Setelah timeout: flag `customer_no_response`, kasir lanjut manual via ConfirmDialog yang menyebut konsekuensinya (design principle P2).

**Alasan:**

- 24 jam (usulan PRD) terlalu lama: layanan reguler = 2 hari (FR-6.5), express = 1 hari. Timeout 24 jam memakan setengah hingga seluruh SLA — order stuck adalah pelanggaran janji waktu ke pelanggan yang tidak bersalah.
- Foto + timestamp tetap menjadi bukti kondisi awal _apa pun_ status approvalnya — approval hanya meng-gate mulai proses. Jadi timeout pendek berisiko rendah.
- Flag `customer_no_response` justru **membuktikan pelanggan diberi kesempatan** — menguntungkan owner saat sengketa, bukan merugikan.
- Jangan kaitkan timeout ke jam operasional outlet — over-engineering untuk MVP.

---

## Q8 — Target adopsi: angka hipotesis + gerbang review D+30

**Keputusan:** Pasang hipotesis sekarang, **review wajib di hari ke-30** dengan data riil:

- **North star:** tenant bayar yang aktif (≥20 order/minggu tercatat di sistem) — bukan sekadar signup, karena MRR mengikuti ini.
- Bulan 1–3: **100 trial → 20 tenant bayar** (konversi 20%, wajar untuk self-serve SMB SaaS) → **MRR ±Rp4–5jt** akhir bulan ke-3.
- Retensi aktif 30/60/90 hari: **60/50/40%** (churn SMB awal brutal; ini target realistis, bukan aspirasi).
- Engagement: median ≥15 order/minggu per tenant aktif; **adopsi PoC ≥60%** dari order high-risk — metrik validasi diferensiator, instrument sejak hari pertama.
- Sengketa: kumpulkan self-report baseline tenant pertama sebagai pembanding (PRD sudah benar menyebut ini).

Semua angka adalah **hipotesis eksplisit**, bukan komitmen — fungsinya supaya keputusan marketing bisa diukur.

---

## Q9 — Pricing nominal + revisi wajib ke PRD

**Keputusan:**

- **Basic: Rp149.000/bln** — annual Rp1.490.000 (≈2 bulan gratis).
- **Pro: Rp499.000/bln** (≤5 outlet) — annual Rp4.990.000. Add-on **Rp75.000/outlet/bln** di atas 5 (aktif bersama Enterprise di v2).
- **Trial: 14 hari, semua fitur Pro, 1 outlet, maksimal 30 order.** Tanpa tier gratis — free tier mendatangkan pencari gratisan dan tetap menanggung biaya pesan WA.

**Alasan harga:**

- Anchor ke **nilai yang dihindari, bukan ke harga kompetitor**: satu sengketa terhindar (refund paksa Rp50–500rb) atau satu transaksi tak tercatat per hari (≈Rp600rb–1,5jt/bln) sudah mengembalikan biaya Pro. Race-to-bottom melawan kompetitor matang adalah perang yang tidak bisa dimenangkan solo dev.
- Kurva nilai per outlet masuk akal: owner 3 outlet bayar Rp499rb (≈Rp166rb/outlet) — lebih murah per outlet dari Basic, insentif upgrade alami.
- Annual memotong frekuensi penagihan (Q4) dan churn sekaligus.

**⚠️ Revisi wajib ke PRD — FR-1.5 kontradiktif:** FR-1.5 melarang tenant trial membuat order sampai subscription aktif. Kalau trial tidak bisa membuat order, trial tidak memberikan pengalaman nilai apa pun — konversi 20% di Q8 mustahil tercapai. FR-1.5 direvisi menjadi: _tenant trial bisa membuat order dengan cap 30 order; yang diblokir hanyalah tenant "unpaid" pasca-trial._ Prasyarat funnel, bukan detail kecil.

---

## Q10 — Desain welcome publik `/`: kunci arah "Segar Premium" (2026-10-30)

**Keputusan:** Arah desain halaman **welcome publik `/`** dikunci **"Segar Premium"** (premium fresh). Semua token, aturan a11y, tipografi, motif, dan urutan band di bawah mengikat implementasi. Keputusan dicatat ke `DECISIONS.md` ini via proses revisi dokumen sesuai **R-PROC-001**.

**Token warna:**

| Token     | Nilai                 | Fungsi / batasan                                            |
| --------- | --------------------- | ----------------------------------------------------------- |
| ground    | `#FBFCFE`             | latar dasar halaman                                         |
| band-tint | `#F0F7FF` / `#EAF3FE` | band mengambang                                             |
| brand-500 | `#63ADF2`             | aksen SAJA — 2.39:1 di atas putih, tidak pernah jadi teks   |
| brand-600 | `#2563EB`             | action ink/fill CTA — 5.17:1, lolos AA                      |
| brand-900 | `#0B3E7A`             | field gelap CTA footer                                      |
| ink       | `#0F172A`             | teks utama                                                  |
| muted     | `#64748B`             | teks sekunder — koreksi dari nilai lama `#6484B` yang salah |
| kartu     | `#FFFFFF`             | permukaan kartu                                             |

**Dua terjemahan a11y mengikat:**

1. Headline tetap slate `#0F172A`; `#63ADF2` hanya dipakai sebagai underline aksen.
2. Fill CTA selalu `#2563EB`.

**Tipografi:** Plus Jakarta Sans; heading `font-bold tracking-[-0.02em]`; body `leading-relaxed`; semua angka `tabular-nums`; tanpa font mono.

**Motif:** bento asimetris bintang, band mengambang, radius `2xl`–`3xl`, border tipis, wash partikel opacity rendah, CountUp sekali.

**Lingkup (overhaul total):**

- Semua `resources/js/components/marketing/*` ditulis ulang — tidak ada yang survive as-is.
- `hero-stage.tsx` + glow blob dihapus.
- Primitif baru: `proof-card`, `status-badge`, `wa-bubble`.
- `app.css` di-re-token mengikuti tabel token di atas; `DESIGN.md` ditulis ulang.

**Urutan band:** Hero → Audience Strip → Feature Bento (bintang) → Pipeline interaktif filterable → Integrations → Pricing (bento, Pro featured) → FAQ `<details>` natif → CTA footer.

**Supersede:** `WELCOME-PAGE-REDESIGN.md` & `WELCOME-PAGE-REDESIGN-COLORFUL.md` dihapus dari repo atas konfirmasi user (2026-10-30). `DESIGN.md` lama (teal `#0f766e`) ditinggalkan — tidak jadi acuan implementasi.

---

## Q11 - Desain welcome publik `/`: kunci arah "Buku Bukti" (2026-11-09)

**Keputusan:** Arah desain halaman **welcome publik `/`** dikunci ulang sebagai **"Buku Bukti"** (Evidence Ledger), menggantikan Q10 "Segar Premium" serta dua eksplorasi antara yang tidak pernah dicatat di dokumen ini (v3 "Bukti Terkendali" kobalt `#266DD3`, v5 "KryptonLab Technical" cerulean glassmorphism). Token, aturan, tipografi, dan urutan band di bawah mengikat implementasi; `DESIGN.md` v6 adalah sumber kebenaran visualnya.

**Token warna:**

| Token           | Nilai                             | Fungsi / batasan                                             |
| --------------- | --------------------------------- | ------------------------------------------------------------ |
| ground          | `#FAF9F6`                         | latar halaman (kertas hangat)                                |
| sheet           | `#FFFFFF`                         | lembar isi / band berbingkai `border-y`                      |
| paper           | `#FAF6EE`                         | **hanya** di dalam artefak bukti (nota), bukan latar halaman |
| line            | `#E3DFD6`                         | garis 1px, motif buku besar                                  |
| line-strong     | `#C9C2B4`                         | garis penekanan / scrollbar                                  |
| ink             | `#121417`                         | teks utama — 17.52:1 di atas ground                          |
| ink-soft        | `#5C6169`                         | teks sekunder — 5.92:1                                       |
| action          | `#0B6EA8`                         | semua elemen interaktif — 5.51:1 dua arah terhadap putih     |
| action-strong   | `#09597F`                         | hover aksi                                                   |
| graphic         | `#008DD5`                         | **grafik/garis saja** — 3.64:1 di putih, tidak pernah teks   |
| ok / warn / bad | `#0F7A4D` / `#8A5A00` / `#B42318` | status + tint masing-masing                                  |
| night           | `#0E1A24`                         | tiga bidang gelap: pipeline, panel Pro, CTA penutup          |
| night-accent    | `#7FB8D9`                         | tautan di bidang gelap — 8.19:1                              |

**Tipografi:** Manrope self-hosted sebagai satu-satunya keluarga huruf (display = body; hierarki via berat/ukuran), mono sistem hanya untuk ID/waktu/angka teknis. Skala display: hero `clamp(2.75rem, 7.4vw, 6rem)`, band `clamp(2rem, 4.8vw, 3.75rem)`. Judul band tanpa kicker.

**Aturan yang mengikat:** One-Action (satu kobalt untuk semua aksi) · Graphic-Only Cerulean · Paper-Is-An-Object · Three-Dark-Fields · No-Kicker · tanpa glassmorphism · radius 4/6/8/12px · teks fungsional ≥11px · target sentuh ≥44px · semua data contoh berlabel ("Contoh", "Ilustrasi alur · data contoh") · tidak ada metrik palsu.

**Interaktivitas (React Bits lokal):** `fade-content`, `spotlight-card`, `tilt-card`, `marquee`, `count-up` — implementasi sendiri tanpa dependensi baru, `motion` + `lucide-react` saja. Demo alur bukti interaktif (Foto → Persetujuan WA → Stempel) adalah "Ilustrasi alur · data contoh", bukan konsol live palsu.

**Urutan band:** Hero (+ marquee) → Problems ledger → Proof band `#fitur` → Dark status stepper `#cara-kerja` → Integrations → Pricing `#harga` (Pro panel gelap, annual menampilkan total + hemat persis) → FAQ `#faq` → CTA footer.

**Supersede:** Q10 (Segar Premium), keputusan vault v3 "Bukti Terkendali" (2026-11-02) dan v5 "KryptonLab Technical" (2026-11-06). `DESIGN.md` v5 tidak lagi menjadi acuan. Kontak WhatsApp tetap config-driven (`siteConfig.whatsappUrl = null`) sampai nomor produksi ada.

---

## Status Blokir

Dengan Q1, Q3, Q4, Q9 terjawab, prasyarat "tidak boleh mulai coding Subscription & Billing (6.5) dan Onboarding (6.1)" di Section 10 PRD **terpenuhi** — tinggal owner mengonfirmasi/mengoverride keputusan di atas. Q2, Q5, Q6, Q7, Q8 tidak memblokir coding, tapi Q5 punya lead time verifikasi Meta yang perlu dimulai cepat.
