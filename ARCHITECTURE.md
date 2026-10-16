# ARCHITECTURE.md — Arsitektur Laundry Management SaaS

> **Status:** v1.0 — acuan teknis sebelum & selama development.
> **Sumber:** `PRD-Laundry-SaaS-MVP.md` (v1.1) · `DECISIONS.md` · `DESIGN-BRIEF-Laundry-SaaS.md` · `Rules.md`
> **Prinsip:** solo developer, 4 bulan, web-only (PRD NG1/NG4). Setiap keputusan arsitektur memilih **opsi paling sederhana yang tetap benar** — nol package tambahan di luar yang sudah terpasang di starter kit.

---

## §1 Gambaran Sistem

```
┌──────────────────── Browser (Kasir / Owner / Admin Pusat) ─────────────────────┐
│  Inertia React SPA — pages tipis → components (domain) → components/ui (shadcn)│
│  Wayfinder: @/actions (controller) + @/routes (named) — typed, tanpa hardcode  │
└───────────────▲───────────────────────────────────────┬────────────────────────┘
                │ XHR Inertia (JSON props)              │ link publik signed
                │                                       ▼
┌───────────────┴───────────────────────────────────────────────────────────────┐
│ Laravel 13 — satu aplikasi web (routes/web.php + webhook + route publik)      │
│  middleware: auth → EnsureTenantContext → EnsureSubscriptionActive → EnsureRole│
│  Controller tipis → FormRequest → Service/Action → Eloquent (scope tenant)     │
│  Events → Queue (driver: database) → Jobs: WA/SMS, verifikasi bayar, timeout   │
│  Scheduler: reminder H-3/H-0, expire approval PoC, verify pending payment      │
└──────┬─────────────────┬────────────────────┬─────────────────┬───────────────┘
       │                 │                    │                 │
    MySQL           Object Storage      Xendit Invoice     Meta WA Cloud API
 (tenant-scoped)   (foto PoC, 12 bln)  (+ webhook masuk)   (+ vendor SMS fallback)
```

Satu deploy, satu database, tanpa microservice. Halaman pelanggan (S1/S2) dilayani aplikasi yang sama lewat route publik bertanda tangan — bukan app terpisah.

---

## §2 Keputusan Arsitektur Kunci

| # | Keputusan | Pilihan | Alasan | Sumber |
|---|---|---|---|---|
| A1 | Multi-tenancy | Single DB, kolom `tenant_id` + global scope — **bukan** multi-database/domain routing | Isolasi FR-2.1 tercapai tanpa package; volume MVP kecil; backup/restore tetap sederhana | PRD 6.2 |
| A2 | Resolusi tenant | Dari **user yang login** (`user.tenant_id`), bukan subdomain | Semua pengguna tenant login; tidak ada surface domain untuk salah-resolve | turunan FR-2.1 |
| A3 | Halaman publik (S1/S2) | **Signed URL** (token), tanpa login & tanpa resolusi tenant | Pelanggan tidak punya akun (NG4); signed URL mengikat ke 1 order/proof spesifik | FR-9.3 |
| A4 | API | Tidak ada REST API publik — Inertia + Wayfinder saja | NG1 web-only, NG4 tanpa app dedicated; satu sumber route | PRD Non-Goals |
| A5 | Queue/cache/session | Driver **database**, tanpa Redis | Volume MVP kecil; mengurangi satu proses infra + satu titik gagal | prinsip solo dev |
| A6 | Payment | Xendit Invoice (pay link) + webhook + cron verify 5 menit | Q4 — invoice manual, tanpa tokenisasi kartu | DECISIONS Q4 |
| A7 | WhatsApp | Meta Cloud API via HTTP client (`Http::`), tanpa SDK | Q5 — resmi, template variable; SDK tidak diperlukan | DECISIONS Q5 |
| A8 | Uang & berat | **Integer** — rupiah penuh (`price`), gram (`weight_grams`) | Float membunuh akurasi laporan; IDR tanpa sen di praktik | R-CODE-006 |
| A9 | Status order | PHP backed enum + satu pintu transisi | R-BE-007 — tidak ada `update(['status'])` tersebar | R-BE-007 |
| A10 | RBAC | Enum `role` + Laravel Policies — tanpa package permission | 3 role saja (FR-3.1); package permission = overkill | FR-3.1 |
| A11 | Foto PoC | Object storage + lifecycle purge 12 bulan; watermark canvas client-side, metadata diverifikasi server | Q6 — biaya storage terkendali sejak hari pertama | DECISIONS Q6 |
| A12 | Price list | `PriceListItem.tenant_id` (seragam per tenant); `PriceOverride` hanya placeholder v2 | Q3 — additif, tanpa migrasi data nanti | DECISIONS Q3 |

---

## §3 Multi-Tenancy & Isolasi

**Resolusi context** — satu support class, di-set middleware, dibaca semua layer:

```
EnsureTenantContext (middleware, setelah auth)
  → resolve CurrentTenant dari Auth::user()->tenant_id
  → register singleton CurrentTenant
BelongsToTenant (concern di semua model operasional)
  → global scope: WHERE tenant_id = CurrentTenant->id (otomatis di semua query)
  → creating hook: isi tenant_id otomatis
```

**Tiga lapis pertahanan isolasi (semua wajib, bukan pilihan):**
1. **Query layer** — global scope (A1) mencegah lupa `where tenant_id`.
2. **Authorization layer** — Policy memvalidasi `outlet_id` terhadap assignment user per request; manipulasi URL → **403** (FR-3.3).
3. **Test layer** — setiap endpoint baru wajib test negatif isolasi (R-QA-006).

**Pengecualian context tenant:** route webhook (Xendit), route publik signed (S1/S2), dan job antrean berjalan di *system context* — mereka **tidak** memakai `CurrentTenant`; akses data dilakukan langsung per model dengan `tenant_id` eksplisit. Model operasional yang ter-scope concern: `Outlet, Customer, PriceListItem, Order, OrderItem, ProofOfCondition, Notification, AuditLog`. Yang di luar: `Tenant, SubscriptionPlan, TenantSubscription, Payment, User` (User terikat tenant via kolom, tanpa global scope agar auth tetap bisa bekerja).

---

## §4 Struktur Direktori

### Backend (app/)

```
app/
  Concerns/            BelongsToTenant, HasAuditLog, (existing: PasswordValidationRules…)
  Enums/               OrderStatus, UserRole, TenantStatus, PlanName, NotificationChannel,
                       PaymentStatus, ProofApprovalStatus
  Models/              Tenant, Outlet, Customer, PriceListItem, Order, OrderItem,
                       ProofOfCondition, Notification, AuditLog, SubscriptionPlan,
                       TenantSubscription, Payment, (existing: User)
  Support/             CurrentTenant, AuditLogger, Money
  Services/            OrderService, SubscriptionService, NotificationService,
                       ProofOfConditionService, ReportService
  Policies/            OrderPolicy, OutletPolicy, CustomerPolicy, ReportPolicy, …
  Jobs/                SendWhatsAppNotification, SendSmsFallback, VerifyPendingPayment,
                       ExpireProofApprovals, SendSubscriptionReminders
  Events/              OrderStatusChanged, ProofApproved, PaymentConfirmed
  Listeners/           (mapping event → job notifikasi)
  Http/
    Middleware/        EnsureTenantContext, EnsureSubscriptionActive, EnsureRole (+
                       existing: HandleInertiaRequests, HandleAppearance)
    Controllers/       Tenant/ (Orders, Customers, Outlets, Staff, Reports, Pricing,
                       ProofOfCondition, Subscription, Settings, Audit)
                       Public/ (ProofApproval, OrderStatus)   ← tanpa auth
                       Webhooks/ (Xendit)                     ← tanpa auth, signature
    Requests/          satu FormRequest per action
```

### Frontend (resources/js/)

```
  pages/               tenant/ orders/ customers/ reports/ pricing/ subscription/ …
                       public/ poc-approval, order-status           ← layout minimal
                       auth/ (existing Fortify)  settings/ (existing)
  components/          domain: status-badge, customer-picker, weight-input,
                       camera-capture, photo-card, sticky-action-bar, confirm-dialog,
                       tier-gate, empty-state, offline-banner, timeline, plan-card,
                       money-display, service-chip          (Rules §5, design brief §7)
    ui/                shadcn primitives — zona dilarang-edit (R-UI-002)
  layouts/             (existing app/auth layouts) + layout publik tanpa-nav
  hooks/               use-order-status, use-camera, use-offline, (existing)
  lib/                 format.ts (formatIDR, formatWeight), constants.ts, order-status.ts
  types/               tipe props Inertia per halaman
  actions/ routes/     hasil generate Wayfinder — jangan diedit manual
```

Konvensi: page tipis (R-FE-003), komponen domain membungkus shadcn (R-UI-003), logic di Services (R-BE-003). Penamaan file kebab-case.

---

## §5 Lifecycle Request (alur data standar)

```
Browser → Inertia visit (Wayfinder action, typed)
  → middleware stack: auth → EnsureTenantContext → EnsureSubscriptionActive → EnsureRole
  → Controller (tipis) → FormRequest (validasi)
  → Service/Action (business logic + AuditLogger bila kritikal)
  → Eloquent (global scope tenant aktif)
  → Inertia::render('pages/...', props) — props tervalidasi tipe di sisi React
  → React page merender via komponen domain; feedback user via toast (sonner)
```

Aksi mutasi dari client selalu lewat `<Form>` Inertia (server-side validation redirect), bukan fetch manual (R-FE-004). Real-time cukup dengan polling Inertia pada layar antrian kasir — tanpa WebSocket (tidak ada package broadcast di MVP).

**Pembacaan data untuk halaman publik S1/S2:** controller Public memuat data langsung via route binding ber-signature — tidak menyentuh `CurrentTenant`, tidak membocorkan data selain order yang ditandatangani.

---

## §6 Domain Model

Relasi inti (kolom teknis `id/timestamps` dihilangkan):

```
Tenant 1─* Outlet          Tenant 1─* User (role: owner|admin_outlet|kasir; outlet_id nullable)
Tenant 1─* Customer        Tenant 1─* PriceListItem (tenant-level — Q3)
Tenant 1─* Order           Tenant 1─* AuditLog       Tenant 1─* Notification
TenantSubscription *─1 SubscriptionPlan   Payment *─1 TenantSubscription
Order 1─* OrderItem        Order 1─* ProofOfCondition   Order 1─* Notification
User (created_by) 1─* Order
```

**Keputusan skema yang mengikat implementasi:**

| Hal | Keputusan |
|---|---|
| Uang | Integer rupiah (`price`, `total_price`, `deposit_balance`) — tanpa float/desimal |
| Berat | `weight_grams` integer — `1.5 kg` disimpan `1500` |
| Order status | Enum `OrderStatus`: `diterima, dicuci, dikeringkan, disetrika, siap_diambil, selesai` — 6 nilai, persis FR-6.2 |
| High-risk gating | Bukan status order — `ProofOfCondition.approval_status` (`pending/approved/timeout`) yang meng-gate transisi `diterima → dicuci` |
| Customer unik | `tenant_id + phone` unik — pencarian kasir by no. HP (design brief F2) |
| Idempotensi payment | `gateway_transaction_id` unik — webhook ganda aman |
| AuditLog | `before_value/after_value` JSON; ditulis via `AuditLogger`, dibaca di Order Detail (P2) |
| PriceOverride | **Tidak dibuat di MVP** — hanya pola terdokumentasi (Q3) |
| Tenant status | `trial → active → expired (read-only) / suspended` |

---

## §7 State Machine Status Order

```
diterima ──► dicuci ──► dikeringkan ──► disetrika ──► siap_diambil ──► selesai
    │
    └── [is_high_risk] ter-gate: ProofOfCondition.approval_status harus
        approved (atau timeout lalu lanjut manual oleh kasir + flag
        customer_no_response di audit) sebelum transisi ke dicuci.
```

- Satu-satunya pintu: `OrderStatus->transitionTo($target, $actor)` — memvalidasi langkah legal, menulis audit bila rollback, memicu `OrderStatusChanged` (R-BE-007, FR-6.3).
- Rollback status: hanya Admin Outlet/Owner, selalu tercatat (edge case PRD §8).
- `OrderService::markCompleted()` mengunci penyelesaian order lama saat tenant expired — read-only hanya memblokir order **baru** (edge case PRD §8).

---

## §8 Subsistem Kunci

### 8.1 Subscription & Billing (Q4)

```
Pilih plan → Payment(pending) + pay link Xendit → tenant bayar
  → Webhook Xendit (signature + idempoten) → Payment(success)
  → TenantSubscription aktif (perpanjang end_date)
Safety net: Scheduler VerifyPendingPayment (tiap 5 menit) mengecek Payment
  pending > 15 menit langsung ke API Xendit — fitur tidak pernah aktif atas asumsi.
```

Downgrade: data historis read-only, fitur baru diblokir — tidak ada penghapusan data (edge case PRD §8). Middleware `EnsureSubscriptionActive` hanya dipasang di route pembuatan order, bukan route baca/status — inilah implementasi mode read-only FR-5.4.

### 8.2 Pipeline Notifikasi WA/SMS (Q5, FR-6.7)

```
Event (order dibuat / status berubah / PoC link) → NotificationService
  → row Notification(channel=wa, status=pending) → Job SendWhatsAppNotification
  → Meta Cloud API (template variable: nama outlet, no. order — FR-7.3)
  ├─ sukses  → status=sent
  └─ gagal   → Job SendSmsFallback → row Notification(channel=sms)
                └─ gagal lagi → status=failed → muncul sebagai reminder manual
                                                 di dashboard staff (edge case PRD §8)
```

Semua pengiriman lewat queue (A5) — request kasir tidak pernah menunggu HTTP ke provider.

### 8.3 Digital Proof-of-Condition (Q6, Q7, FR-6.9)

```
Order high-risk (FR-6.4) → CameraCapture (getUserMedia)
  → canvas: kompres ≤1280px JPEG + watermark (tanggal, jam, ID order)
  → upload → ProofOfCondition(pending) + WA link signed ke pelanggan
  → pelanggan approve (route publik signed) → approved → order boleh dicuci
Timeout: Scheduler ExpireProofApprovals (tiap 5 menit) — pending > 2 jam
  (configurable per tenant 1–24 jam, 1 reminder WA di tengah window)
  → status=timeout → kasir boleh lanjut manual via ConfirmDialog.
Upload gagal (koneksi lemah): retry otomatis, draft foto lokal (design brief §8);
  order high-risk TIDAK bisa disimpan tanpa foto ter-upload.
```

### 8.4 RBAC & Audit

- `UserRole` enum di `User.role` + `outlet_id` (null = tenant-wide untuk Owner).
- Policies per model; middleware `EnsureRole` untuk prefix route (mis. `/reports` menutup Kasir — FR-3.1).
- Aksi kritikal (override harga, void, hapus order, rollback status, lanjut-manual PoC) → `AuditLogger` (user, timestamp, before/after) → tampil di Order Detail + halaman Audit Log Pro (R-BE-005).

### 8.5 Laporan (FR-6.8)

`ReportService` — agregasi SQL (GROUP BY tanggal) dari tabel order, tanpa tabel pivot/report sendiri. Konsolidasi multi-outlet = query antar outlet dalam satu tenant (aman oleh scope tenant). Export PDF/Excel lewat response stream. Angka selalu dari sumber yang sama dengan dashboard (tidak ada angka kedua).

---

## §9 Queue, Scheduler & Webhook

**Queue** — driver `database`, satu queue default. Retry 3× (backoff) untuk job provider eksternal; setelah itu status `failed` + visible di dashboard.

**Scheduler (routes/console.php):**

| Jadwal | Job | Keterangan |
|---|---|---|
| tiap 5 menit | `VerifyPendingPayment` | pending > 15 menit → cek ke API gateway (edge case PRD §8) |
| tiap 5 menit | `ExpireProofApprovals` | approval pending > timeout tenant → `timeout` |
| harian 07:00 | `SendSubscriptionReminders` | H-3 & H-0 via WA (+ email bila ada) — FR-5.3 |

**Webhook** — `POST /webhooks/xendit`: tanpa session, verifikasi signature, idempoten by `gateway_transaction_id`, balas cepat (2xx) lalu proses. Tidak pernah mengaktifkan fitur berdasarkan asumsi sukses.

---

## §10 Storage Media

| Data | Lokasi | Retensi |
|---|---|---|
| Foto PoC | Object storage, path `tenant/{id}/poc/{order}/…` | **12 bulan**, lifecycle purge di level bucket (Q6) — set sejak hari pertama |
| Metadata approval | MySQL — permanen | `ProofOfCondition` + log audit |
| Session/cache/queue | MySQL (driver database) | default |

Foto tersimpan terkompresi (hasil canvas client-side, diverifikasi server saat upload: mime, ukuran ≤ ±1MB, dimensi). Dilarang menyimpan foto di disk lokal server — deployment harus stateless (lihat §13).

---

## §11 Keamanan

- **Signed URL** untuk semua route publik (`URL::signedRoute`, expiry mengikuti masa relevansi order) — akses S1/S2 tanpa login tapi terikat satu objek.
- **Webhook signature** Xendit diverifikasi sebelum menyentuh DB; endpoint tidak masuk grup `web` middleware session.
- **Isolasi tenant 3 lapis** (§3) + test negatif wajib (R-QA-006).
- **Server-side pricing** — harga/total dihitung ulang dari price list; nilai dari client tidak pernah dipercaya (R-BE-006).
- **OTP registrasi** — WA auth template, kode 6 digit, expirasi 5 menit, maks 3 percobaan, throttle per nomor (simpan hash, bukan kode plain).
- Audit trail untuk semua aksi kritikal (FR-3.4) — fondasi fraud detection v2.

---

## §12 Strategi Testing (PHPUnit, R-QA-003/004)

| Lapis | Cakupan | Contoh |
|---|---|---|
| Feature (utama) | endpoint per endpoint, pakai factory | simpan order menghitung total dari price list |
| Isolasi (wajib per endpoint baru) | user lintas tenant/outlet → 403 | kasir Outlet A request order Outlet B |
| State machine | transisi legal/ilegal, rollback ter-audit | `selesai → dicuci` ditolak |
| Integration provider | Http::fake untuk Xendit & Cloud API | webhook duplikat tidak menciptakan 2 activation |
| Unit (seepam) | enum transisi, formatter uang/berat | `formatIDR(150000)` |

Konvensi: `RefreshDatabase`, factory + state existing, `php artisan make:test --phpunit`. Tidak ada test yang di-skip demi lolos gate (R-QA-005).

---

## §13 Runtime & Deployment

Kebutuhan proses: **web server (php-fpm) + queue worker (`queue:work`) + scheduler** — tanpa Redis, tanpa Node di produksi (aset di-build saat deploy via `npm run build`). Disk server dianggap ephemeral: stateless, semua media di object storage (§10). Environment via `.env` (R-BE-009): kredensial Xendit, token Meta Cloud API, vendor SMS, kredensial bucket. Migrasi: `migrate --force` saat deploy; migration ter-merge tidak pernah diedit (R-BE-008).

Urutan eksekusi yang disarankan untuk solo dev: **M1** fondasi (tenant, auth, multi-tenancy) → **M2** order end-to-end + price list → **M3** notifikasi WA → **M4** PoC → **M5** billing + tier gating → **M6** laporan + audit UI. Setiap milestone lolos definition of done (R-QA-001/002).

---

## §14 Yang Sengaja TIDAK Ada di MVP

REST API publik · aplikasi mobile/kurir terpisah · WebSocket/realtime push · Redis/Meilisearch · package multi-tenancy & permission pihak ketiga · SDK payment/WA (cukup HTTP client) · Docker khusus · price list per outlet (pola `PriceOverride` ditunda ke v2, Q3) · auto-charge kartu (v2 bila ada demand, Q4) · dark mode & i18n multi-bahasa.

Setiap item di daftar ini adalah keputusan, bukan kelalaian — menambahkannya butuh revisi `DECISIONS.md` dulu (R-PROC-001).

---

## Log Perubahan

| Versi | Tanggal | Perubahan |
|---|---|---|
| v1.0 | 2026-09-22 | Versi awal — 14 keputusan arsitektur (A1–A12), multi-tenancy 3 lapis, 5 subsistem kunci, queue/scheduler/webhook, strategi testing & milestone. |
