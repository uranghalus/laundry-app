# PRD: Laundry Management SaaS Platform
**Status:** v1.1 — 9 open questions terjawab (lihat Section 10 & `DECISIONS.md`); siap masuk development setelah konfirmasi owner
**Stack:** Laravel + Inertia React + MySQL
**Tim:** Solo developer | **Target MVP:** ~4 bulan

---

## 1. Problem Statement

**Siapa yang dirugikan, dan kenapa:**

Pemilik usaha laundry (single-outlet maupun multi-outlet) saat ini menggunakan software POS laundry generik (CuciQu, Laundrim, LaundryGO, LAUNDRAI, Laundrify OS, Laundreein, Nara POS) yang hanya menyelesaikan masalah operasional dasar: kasir, nota, timbangan, status pesanan, laporan harian. Software ini **tidak menyelesaikan tiga masalah yang secara langsung merugikan owner secara finansial dan reputasional**:

1. **Fraud & kehilangan pendapatan** — tidak ada mekanisme yang mencegah kecurangan staff (mis. transaksi tidak dicatat, harga dimanipulasi, barang "hilang" di tengah proses). Owner kehilangan uang tanpa cara mendeteksi kapan/di titik mana kebocoran terjadi.
2. **Sengketa pakaian rusak/tertukar** — tanpa bukti kondisi awal barang, owner tidak punya pembelaan saat pelanggan klaim baju rusak/hilang/tertukar. Ini berujung refund paksa, kerugian reputasi, dan konflik yang menyita waktu.
3. **Kapasitas mesin & armada tidak dioptimalkan** — estimasi waktu pengerjaan dan harga bersifat statis, tidak menyesuaikan beban mesin real-time. Owner kehilangan potensi revenue di jam sepi (tidak ada insentif dinamis) dan mengecewakan pelanggan di jam sibuk (estimasi waktu meleset).

**Kenapa ini penting sekarang:** kompetitor sudah cukup matang di fitur dasar (commoditized), jadi diferensiasi hanya mungkin lewat fitur yang menyerang tiga masalah di atas — bukan lewat fitur POS yang lebih bagus.

---

## 2. Target User — 2 Persona

### Persona A — "Owner Single-Outlet" (Pak Rudi)
- Pemilik 1 gerai laundry, merangkap kasir/operator harian.
- Non-teknis, pakai HP Android, terbiasa WhatsApp Business.
- Prioritas: pencatatan uang masuk akurat, tidak mau ribet setup, harga terjangkau.
- Takut ditipu karyawan saat dia tidak di tempat.
- Sensitif terhadap harga subscription — butuh tier murah dengan fitur inti saja.

### Persona B — "Admin Pusat Multi-Outlet" (Bu Sari)
- Mengelola 3–10 outlet, punya staff per outlet, tidak selalu berada di lokasi.
- Butuh visibilitas lintas outlet: performa, laporan konsolidasi, kontrol akses staff.
- Punya klien korporat (hotel, apartemen) yang butuh invoice tempo, bukan bayar tunai per transaksi.
- Bersedia bayar lebih untuk fitur kontrol fraud dan pelaporan, karena risiko finansialnya lebih besar per outlet yang tidak dia awasi langsung.

---

## 3. Goals & Non-Goals

### Goals (MVP)
- G1: Owner (single atau multi-outlet) bisa mendaftar, memilih tipe outlet, dan mulai beroperasi dalam <30 menit tanpa bantuan teknis.
- G2: Sistem subscription berbasis tier, dibayar via payment gateway, otomatis mengaktifkan/menonaktifkan fitur sesuai tier.
- G3: Alur order end-to-end (terima → cuci → kering → setrika → selesai → serah terima) tercatat lengkap dengan notifikasi otomatis ke pelanggan.
- G4: Minimal **satu** fitur diferensiator anti-fraud/anti-sengketa yang tidak dimiliki kompetitor sudah live di MVP (lihat Section 5 — rekomendasi: Digital Proof-of-Condition).
- G5: Multi-tenant sejak hari pertama — data antar bisnis laundry terisolasi penuh.

### Non-Goals (MVP)
- NG1: **Tidak** membangun aplikasi mobile native (Android/iOS) — web-only (responsive) untuk semua peran, termasuk kasir.
- NG2: **Tidak** membangun AI Smart Fabric & Stain Assessor di MVP — kompleksitas model AI + akurasi + biaya inferensi terlalu tinggi untuk solo dev 4 bulan (masuk kategori "Nanti", lihat Section 5).
- NG3: **Tidak** membangun optimasi rute/armada otomatis (routing algorithm) di MVP — assign driver tetap manual di MVP.
- NG4: **Tidak** ada aplikasi terpisah untuk pelanggan atau kurir — interaksi pelanggan terjadi via WhatsApp/link web, bukan app dedicated.
- NG5: **Tidak** mendukung multi-currency atau ekspansi luar Indonesia di MVP.

---

## 4. User Stories

**Owner / Admin Pusat**
- Sebagai owner, saya ingin mendaftar dan memilih apakah bisnis saya single-outlet atau multi-outlet, supaya sistem menyesuaikan struktur akses sejak awal.
- Sebagai owner, saya ingin membayar subscription via payment gateway dan langsung melihat fitur saya aktif, supaya saya tidak perlu menunggu approval manual.
- Sebagai admin pusat, saya ingin melihat laporan konsolidasi semua outlet dalam satu dashboard, supaya saya bisa membandingkan performa tanpa mengunjungi tiap outlet.
- Sebagai owner, saya ingin mengatur role & permission staff per outlet, supaya staff hanya bisa mengakses fungsi yang relevan dengan tugasnya.

**Kasir / Staff Outlet**
- Sebagai kasir, saya ingin mencatat order baru dengan cepat (item, berat, harga, estimasi selesai), supaya pelanggan tidak menunggu lama di kasir.
- Sebagai kasir, saya ingin mengambil foto kondisi pakaian saat check-in untuk item berisiko tinggi, supaya ada bukti jika terjadi klaim di kemudian hari.
- Sebagai kasir, saya ingin mengubah status pesanan (cuci → kering → setrika → selesai) dengan satu klik, supaya update ke pelanggan terjadi otomatis.

**Pelanggan (end-customer)**
- Sebagai pelanggan, saya ingin menerima notifikasi WhatsApp saat status pesanan saya berubah, supaya saya tahu kapan harus mengambil.
- Sebagai pelanggan, saya ingin menyetujui foto kondisi pakaian saya sebelum diproses (untuk item berisiko tinggi), supaya saya punya kendali dan bukti sebelum ada sengketa.

**Klien B2B (v2, disebut di sini untuk konteks scope)**
- Sebagai klien korporat, saya ingin ditagih dengan sistem tempo (Net 30) bukan bayar langsung, supaya sesuai proses approval finance perusahaan saya.

---

## 5. Daftar Fitur — MVP / v2 / Nanti

> **Catatan penting soal realisme:** 4 bulan solo dev untuk platform multi-tenant + subscription + billing + order management sudah scope besar. Rekomendasi saya: masukkan **hanya 1 fitur diferensiator** ke MVP (yang ROI-nya tertinggi & effort-nya paling rendah relatif), sisanya ke v2. Detail alasan di tabel.

### MVP (harus ada agar bisa launch & mulai menarik pelanggan)
| Fitur | Kenapa MVP |
|---|---|
| Registrasi & onboarding tenant (pilih single/multi-outlet) | Tanpa ini tidak ada entry point |
| Multi-tenant + isolasi data | Non-negotiable, arsitektur dasar |
| Role-based access control (Owner, Admin Outlet, Kasir) | Dibutuhkan Persona B sejak awal |
| Manajemen outlet (CRUD outlet, untuk multi-outlet) | Bagian dari onboarding |
| Subscription plan + billing via Midtrans/Xendit | G2 — core monetisasi |
| Order management end-to-end (terima → proses → selesai → serah terima) | G3 — core value proposition |
| Notifikasi status via WhatsApp/SMS | Diminta eksplisit, ekspektasi dasar pelanggan |
| Laporan keuangan dasar (harian, per outlet, konsolidasi) | Ekspektasi minimum, semua kompetitor punya ini |
| **Digital Proof-of-Condition (foto + watermark + approval WA)** | Diferensiator dengan effort paling rendah (kamera + watermark + link WA), langsung serang problem #2 (sengketa) |
| Deposit/member tracking dasar | Standar industri, effort rendah |

### v2 (setelah MVP live, prioritas berikutnya — 2–4 bulan berikutnya)
| Fitur | Kenapa v2, bukan MVP |
|---|---|
| Smart Machine Capacity & Surge Pricing Automation | Butuh data historis dari MVP dulu untuk kalibrasi ambang batas 80% & pricing rules — tidak akurat tanpa data riil |
| B2B & Corporate Client Invoicing (Net 30, e-sign, SLA tracking) | Segmen pelanggan berbeda (B2B), butuh flow approval & billing terpisah — kompleksitas tinggi, tidak menghalangi launch MVP ke segmen retail |
| Micro-Item QR Tagging per garment | Butuh hardware tambahan (printer stiker QR tahan panas/air) — dependency eksternal, bukan murni software |
| Fraud detection / anomaly alert pada transaksi kasir | Butuh volume data transaksi dulu untuk mendefinisikan "anomali" secara bermakna |
| Happy Hour promo otomatis (bagian dari capacity automation) | Turunan dari Smart Capacity, sama alasannya |

### Nanti (butuh riset lebih lanjut / dependency besar, tidak direncanakan dalam 2 rilis ke depan)
| Fitur | Kenapa Nanti |
|---|---|
| AI Smart Fabric & Stain Assessor | Butuh model vision terlatih/API pihak ketiga + akurasi tinggi agar tidak menyesatkan kasir (risiko rekomendasi salah = kerugian pelanggan). Effort & biaya operasional (inference cost) tinggi untuk solo dev |
| Optimasi rute/armada antar-jemput otomatis | Butuh algoritma routing + data lokasi real-time, kompleksitas project tersendiri |
| Aplikasi mobile native (customer/kurir) | Di luar scope teknis saat ini (web-only) |

**Struktur tier final (keputusan Q1 & Q9 — detail di `DECISIONS.md`):** 2 tier di MVP. Prinsip: *jual skala bisnis, bukan nilai inti* — diferensiator (Proof-of-Condition) masuk Basic, batas tier mengikuti ukuran bisnis (outlet/user), bukan fitur core.

| Tier | Harga | Target | Isi |
|---|---|---|---|
| **Basic** | Rp149.000/bln · annual Rp1.490.000 | Single-outlet (Persona A) | 1 outlet, 2 user, order management, notifikasi WA, laporan harian, deposit, **Proof-of-Condition (cap 100 foto/bln)**, audit trail per order |
| **Pro** | Rp499.000/bln · annual Rp4.990.000 | Multi-outlet kecil (2–5 outlet) | Semua fitur Basic + PoC tanpa cap + multi-outlet + RBAC penuh + laporan konsolidasi + Audit Log penuh, user tak terbatas |
| **Enterprise** | Add-on Rp75.000/outlet/bln di atas 5 outlet | Ditunda ke v2, diluncurkan bersama B2B invoicing |

**Trial:** 14 hari, semua fitur Pro, 1 outlet, maksimal 30 order (lihat FR-1.5 yang direvisi).

---

## 6. Functional Requirements Detail per Fitur MVP

### 6.1 Registrasi & Onboarding Tenant
- FR-1.1: User mendaftar dengan no. HP + password, verifikasi via OTP **WhatsApp** (authentication template); fallback **SMS** jika nomor tidak terdaftar WA. Email opsional, bukan kanal utama (keputusan Q2).
- FR-1.2: Saat onboarding, user memilih tipe bisnis: "Single-Outlet" atau "Multi-Outlet". Pilihan ini menentukan apakah wizard setup outlet tambahan ditampilkan.
- FR-1.3: User mengisi data outlet pertama wajib: nama outlet, alamat, no. WA operasional (dipakai untuk kirim notifikasi ke pelanggan).
- FR-1.4: Setelah data outlet lengkap, user diarahkan ke halaman pemilihan subscription plan sebelum bisa mengakses dashboard operasional.
- FR-1.5: (Direvisi — keputusan Q9) Tenant **trial** bisa membuat order dengan cap **30 order** selama trial; tanpa itu trial tidak memberi pengalaman nilai dan konversi trial→paid mustahil. Yang diblokir membuat order hanyalah tenant **unpaid** pasca-trial (lihat 6.5).

### 6.2 Multi-Tenant & Isolasi Data
- FR-2.1: Setiap tenant (bisnis laundry) memiliki `tenant_id` yang menjadi scope wajib di semua query data operasional (outlet, order, customer, staff, laporan).
- FR-2.2: Tidak ada endpoint yang mengembalikan data lintas tenant tanpa role "Super Admin" (internal, untuk platform owner sendiri).
- FR-2.3: Super Admin (platform-level) punya dashboard terpisah untuk monitoring seluruh tenant — bukan bagian dari dashboard tenant.

### 6.3 Role-Based Access Control
- FR-3.1: Role minimum MVP: **Owner** (akses penuh dalam tenant), **Admin Outlet** (akses penuh dalam 1 outlet, termasuk laporan outlet tsb), **Kasir** (hanya create/update order, tidak bisa lihat laporan keuangan agregat).
- FR-3.2: Owner bisa assign staff ke role & outlet tertentu.
- FR-3.3: Kasir yang di-assign ke Outlet A tidak bisa melihat/mengakses data Outlet B.
- FR-3.4: Setiap aksi kritikal (perubahan harga manual, void transaksi, hapus order) tercatat di audit log dengan user_id, timestamp, before/after value — **ini fondasi untuk fraud detection di v2**, wajib ada dari MVP meski fitur deteksinya belum ada.

### 6.4 Manajemen Outlet
- FR-4.1: Owner multi-outlet bisa CRUD outlet (nama, alamat, no. WA, jam operasional).
- FR-4.2: (Keputusan Q3) Harga **seragam per tenant** di MVP — mayoritas tenant awal single-outlet, dan satu price list menjaga janji onboarding <30 menit (G1). Skema disiapkan untuk override per outlet di v2 via tabel `PriceOverride` — additif, tanpa migrasi data.

### 6.5 Subscription & Billing
- FR-5.1: Tenant memilih plan (Basic/Pro — Enterprise ditunda ke v2, lihat Section 5) saat onboarding dan bisa upgrade/downgrade kapan saja dari dashboard.
- FR-5.2: (Keputusan Q4) Pembayaran subscription via **invoice manual per periode + pay link** (VA/QRIS/e-wallet) — bukan auto-charge kartu. Reminder H-3 & H-0; expired → read-only (FR-5.4); reaktivasi otomatis via webhook gateway. Gateway direkomendasikan: **Xendit** (Midtrans jika akun sudah ada). Opsi annual tersedia (2 bulan gratis).
- FR-5.3: Sistem mengirim reminder H-3 sebelum masa aktif subscription habis (via email + WA).
- FR-5.4: Jika subscription expired, tenant masuk mode "read-only" (bisa lihat data lama, tidak bisa buat order baru) — bukan langsung suspend data.
- FR-5.5: Fitur yang tersedia di UI (menu, tombol) mengikuti tier aktif tenant secara real-time — tidak butuh redeploy/manual toggle.

### 6.6 Order Management End-to-End
- FR-6.1: Kasir membuat order baru: pilih/buat customer, input item (jenis, jumlah/berat, catatan khusus), sistem menghitung harga otomatis dari price list.
- FR-6.2: Status order mengikuti alur tetap: `Diterima → Dicuci → Dikeringkan → Disetrika → Siap Diambil → Selesai`. Kasir update status manual per tahap.
- FR-6.3: Setiap perubahan status memicu notifikasi otomatis ke pelanggan (lihat 6.7).
- FR-6.4: Order bisa ditandai "Item Berisiko Tinggi" — memicu wajib foto Proof-of-Condition (lihat 6.9) sebelum order bisa disimpan.
- FR-6.5: Estimasi waktu selesai dihitung dari rule statis (mis. jenis layanan reguler = 2 hari, express = 1 hari) — **bukan dinamis berdasarkan kapasitas mesin (itu v2)**.

### 6.7 Notifikasi WhatsApp/SMS
- FR-7.1: Notifikasi otomatis terkirim pada event: order dibuat, order siap diambil, order selesai/diserahkan.
- FR-7.2: (Keputusan Q5) Channel utama **Meta WhatsApp Cloud API** (resmi) — link approval PoC dikirim via WA sehingga tidak boleh bergantung pada kanal unofficial yang berisiko ban nomor. Fallback SMS via satu vendor lokal. Verifikasi bisnis Meta & approval template dimulai minggu pertama development.
- FR-7.3: Template pesan bisa dikustomisasi minimal (nama outlet, nomor order) oleh owner.

### 6.8 Laporan Keuangan
- FR-8.1: Laporan harian per outlet: total transaksi, total pendapatan, breakdown metode pembayaran.
- FR-8.2: Untuk multi-outlet: laporan konsolidasi lintas outlet, filter per rentang tanggal & per outlet.
- FR-8.3: Export laporan ke PDF/Excel.

### 6.9 Digital Proof-of-Condition
- FR-9.1: Saat check-in order dengan tag "Item Berisiko Tinggi", aplikasi wajib mengaktifkan kamera (browser-based, bukan native) untuk foto kondisi awal pakaian.
- FR-9.2: Foto otomatis diberi watermark: tanggal, waktu, ID order.
- FR-9.3: Sistem mengirim link konfirmasi via WhatsApp ke pelanggan berisi foto + tombol "Setuju & Lanjutkan".
- FR-9.4: Order dengan tag berisiko tinggi **tidak bisa lanjut ke proses cuci** sampai pelanggan menekan approval (atau timeout — lihat Section 8 untuk failure state).
- FR-9.5: (Keputusan Q6) Foto disimpan **12 bulan** (auto-purge via lifecycle policy object storage; foto dikompresi max 1280px JPEG). **Metadata approval log disimpan permanen** di database.

---

## 7. Sketsa Data Model (Entitas + Field Kunci)

```
Tenant
- id, name, business_type (single/multi), status (active/trial/suspended), created_at

Outlet
- id, tenant_id (FK), name, address, whatsapp_number, operating_hours, created_at

User (staff/owner)
- id, tenant_id (FK), outlet_id (FK, nullable untuk Owner tenant-level), name,
  email, phone, password_hash, role (owner/admin_outlet/kasir), status

SubscriptionPlan
- id, name (Basic/Pro — enum siap ditambah Enterprise di v2), price, billing_period, feature_flags (JSON),
  max_outlets, max_users

TenantSubscription
- id, tenant_id (FK), plan_id (FK), status (active/expired/trial),
  start_date, end_date, payment_gateway_ref

Customer
- id, tenant_id (FK), name, phone, address (nullable), member_since,
  deposit_balance

PriceListItem
- id, outlet_id (FK) atau tenant_id (FK — tergantung FR-4.2), service_type,
  unit (kg/pcs), price, estimated_duration_hours

Order
- id, tenant_id (FK), outlet_id (FK), customer_id (FK), created_by (user_id),
  status (enum: diterima/dicuci/dikeringkan/disetrika/siap/selesai),
  is_high_risk (bool), total_price, payment_status, created_at, completed_at

OrderItem
- id, order_id (FK), description, quantity/weight, service_type, price

ProofOfCondition
- id, order_id (FK), photo_url, watermark_data (JSON: timestamp, order_id),
  customer_approval_status (pending/approved/timeout), approved_at, wa_message_ref

Notification
- id, tenant_id (FK), order_id (FK), channel (wa/sms), event_type, status
  (sent/failed), sent_at

AuditLog
- id, tenant_id (FK), user_id (FK), action_type, entity_type, entity_id,
  before_value (JSON), after_value (JSON), created_at

Payment (subscription billing)
- id, tenant_subscription_id (FK), gateway (midtrans/xendit), amount,
  status (pending/success/failed), gateway_transaction_id, paid_at
```

**Catatan (resolved — keputusan Q3):** `PriceListItem` memakai `tenant_id` (harga seragam per tenant di MVP). Override per outlet masuk v2 via tabel `PriceOverride (tenant_id, outlet_id, price_list_item_id, price)` — additif, tanpa migrasi data lama.

---

## 8. Edge Case & Failure State

| Kasus | Perilaku yang Diharapkan |
|---|---|
| Payment gateway callback gagal/timeout saat bayar subscription | Order pembayaran masuk status "pending", cron job cek ulang status ke gateway tiap X menit; tenant tetap "unpaid" sampai konfirmasi diterima — jangan aktifkan fitur berdasarkan asumsi sukses |
| Subscription expired di tengah order yang sedang diproses | Order yang sudah berjalan tetap bisa diselesaikan (read-only mode hanya blokir order **baru**), supaya pelanggan yang barangnya sedang dicuci tidak dirugikan |
| Pelanggan tidak merespon link approval Proof-of-Condition dalam waktu tertentu | Timeout **2 jam default (configurable 1–24 jam per tenant), 1 reminder WA di tengah window** (keputusan Q7). Setelah timeout, order tetap bisa dilanjutkan manual oleh kasir dengan flag "customer_no_response" tercatat di log — jangan biarkan order stuck permanen |
| Kasir salah input status order (mis. skip step) | Status bisa di-rollback oleh Admin Outlet/Owner, tercatat di AuditLog (siapa, kapan, dari status apa ke apa) |
| Notifikasi WA gagal terkirim (nomor tidak valid/provider down) | Fallback otomatis ke SMS; jika keduanya gagal, notifikasi tetap muncul di dashboard staff sebagai reminder manual |
| Tenant multi-outlet, Admin Outlet mencoba akses outlet lain via URL manipulation | Request ditolak di level backend (403), bukan hanya disembunyikan di UI — validasi `outlet_id` terhadap assignment user di setiap request |
| Foto Proof-of-Condition gagal upload (koneksi lemah di outlet) | Order tidak bisa disimpan sebagai "high risk confirmed" sampai foto berhasil upload; sistem retry otomatis, simpan draft lokal sementara jika memungkinkan |
| Downgrade tier saat tenant sedang pakai fitur tier lebih tinggi (mis. RBAC/laporan konsolidasi) | Data historis tetap bisa dilihat (read-only), tapi fitur baru tidak bisa dibuat sampai upgrade lagi — jangan hapus data saat downgrade |

---

## 9. Success Metrics

**Adopsi**
- Jumlah tenant terdaftar & aktif (subscription paid) dalam 3 bulan pertama pasca-launch — target hipotesis (keputusan Q8): **100 trial → 20 tenant bayar**, MRR ±Rp4–5jt akhir bulan ke-3. Wajib review ulang di hari ke-30 dengan data riil.
- Conversion rate trial → paid subscription — target **20%**.
- North star: tenant bayar yang **aktif** (≥20 order/minggu tercatat di sistem) — bukan sekadar signup.

**Engagement / Retensi**
- % tenant yang masih aktif (login + buat order) setelah 30/60/90 hari.
- Rata-rata jumlah order per tenant per minggu (indikator tenant benar-benar pakai, bukan sekadar daftar).

**Value Proposition (Proof-of-Condition)**
- % order high-risk yang menggunakan fitur Proof-of-Condition dari total order high-risk yang seharusnya pakai — target **≥60%** (instrument sejak hari pertama).
- Jumlah komplain/sengketa pelanggan terkait kondisi barang — target: menurun dibanding baseline (perlu tenant lama sebagai pembanding, atau self-reported survey).

**Kesehatan Bisnis**
- MRR (Monthly Recurring Revenue).
- Churn rate bulanan.
- Distribusi tenant per tier (validasi apakah tier pricing sudah tepat).

---

## 10. Keputusan Open Questions (Resolved — 2026-09-22)

Semua 9 open questions telah dijawab. Detail lengkap + reasoning tiap keputusan ada di **`DECISIONS.md`** — jika ada perbedaan dengan catatan lama di dokumen ini, `DECISIONS.md` yang jadi sumber kebenaran.

| # | Pertanyaan | Keputusan |
|---|---|---|
| 1 | Struktur tier | 2 tier di MVP (Basic/Pro); PoC masuk Basic; Enterprise ditunda ke v2 |
| 2 | Channel OTP | WhatsApp default + fallback SMS; email opsional |
| 3 | Price list | Seragam per tenant di MVP; skema siap untuk override per outlet (v2) |
| 4 | Model billing | Invoice manual per periode + pay link — bukan auto-charge |
| 5 | Provider WA | Meta WhatsApp Cloud API (resmi) + vendor SMS lokal untuk fallback |
| 6 | Retensi foto PoC | 12 bulan (lifecycle purge); metadata approval permanen |
| 7 | Timeout approval | Default 2 jam (configurable 1–24 jam), 1 reminder WA |
| 8 | Target adopsi | 100 trial → 20 tenant bayar, MRR ±Rp4–5jt di bulan ke-3; review D+30 |
| 9 | Harga nominal | Basic Rp149rb/bln, Pro Rp499rb/bln; annual = 2 bulan gratis; trial 14 hari cap 30 order |

**Blokir coding dicabut:** prasyarat "pertanyaan 1, 3, 4, 9 terjawab" sudah terpenuhi — modul Subscription & Billing (Section 6.5) dan Onboarding (Section 6.1) boleh masuk development setelah owner mengonfirmasi/mengoverride keputusan di atas.
