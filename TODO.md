# TODO.md - Laundry SaaS MVP Implementation

## 📅 Tanggal: 2026-10-19 (Hari Ini - Selesai)

### ✅ Phase 1: Setup & Foundation - **SELESAI**

#### Database & Models
- [x] 13 migrasi database dibuat (tenants, outlets, users, subscription_plans, tenant_subscriptions, customers, price_list_items, orders, order_items, proof_of_conditions, notifications, audit_logs, payments)
- [x] 12 Eloquent models dengan relasi lengkap (Tenant, Outlet, SubscriptionPlan, TenantSubscription, Customer, PriceListItem, Order, OrderItem, ProofOfCondition, Notification, AuditLog, Payment)
- [x] User model diperluas dengan RBAC: role (owner/admin_outlet/kasir), tenant_id, outlet_id, phone, status
- [x] Helper methods RBAC: `isOwner()`, `isAdminOutlet()`, `isKasir()`, `canManageStaff()`, `canViewFinancialReports()`, `canChangePrices()`, `canAccessOutlet()`
- [x] SubscriptionPlan seeder (Basic Rp149rb/bln, Pro Rp499rb/bln, Annual = 2 bln gratis)
- [x] Factory untuk SubscriptionPlan (basic/pro states)

#### Verifikasi
- [x] Semua 43 test pass
- [x] Laravel Pint formatting applied
- [x] TypeScript types check pass (setelah wayfinder regenerate)

---

### ✅ Phase 2 Step 1: Registrasi & Onboarding - **SELESAI**

#### Backend
- [x] `RegisterRequest` - validasi lengkap (nama, email, password, phone, business_type, outlet data)
- [x] `RegisterController` - create tenant, outlet, owner user, subscription trial (14 hari)
- [x] `OnboardingController` - 3 step: pilih plan → pembayaran → skip payment (dev)
- [x] Middleware `EnsureTenantIsTrial` - proteksi route onboarding
- [x] Route registration dengan named routes

#### Frontend (Inertia React)
- [x] `resources/js/pages/auth/register.tsx` - form registrasi lengkap dengan Select business_type
- [x] `resources/js/pages/onboarding/plan.tsx` - pemilihan plan Basic/Pro dengan fitur comparison
- [x] `resources/js/pages/onboarding/payment.tsx` - metode pembayaran (VA, QRIS, E-Wallet via Xendit)
- [x] Wayfinder routes regenerated untuk onboarding

#### Test
- [x] `RegistrationTest` updated untuk flow baru (redirect ke onboarding.plan)

---

## 📅 Tanggal: 2026-10-20 (Besok - Rencana)

### 🎯 Phase 2 Step 2: Order Management System (Prioritas Tinggi)

#### Backend - Controllers & Actions
- [ ] `OrderController` dengan actions:
  - `index` - list orders dengan filter (status, date, outlet, customer)
  - `create` - form order baru (pilih customer, tambah item dari price list)
  - `store` - simpan order, hitung total harga otomatis
  - `show` - detail order dengan items & proof of condition
  - `updateStatus` - advance status (diterima → dicuci → dikeringkan → disetrika → siap_diambil → selesai)
  - `destroy` - void order (dengan audit log)

- [ ] `CustomerController` - CRUD customer (search, create inline di order form)
- [ ] `PriceListController` - CRUD price list items per tenant

#### Frontend - Pages
- [ ] `resources/js/pages/orders/index.tsx` - Order list dengan table, filter, pagination
- [ ] `resources/js/pages/orders/create.tsx` - Form order baru (customer search/create, item picker)
- [ ] `resources/js/pages/orders/show.tsx` - Detail order dengan status timeline
- [ ] `resources/js/pages/customers/index.tsx` - Customer management
- [ ] `resources/js/pages/price-list/index.tsx` - Price list management

#### Features
- [ ] Auto-calculate total price dari price list
- [ ] Status badge dengan warna (diterima=yellow, dicuci=blue, selesai=green)
- [ ] Quick status advance button (one-click next status)
- [ ] Customer search/typeahead saat buat order
- [ ] Item picker dari price list dengan quantity input

---

### 🎯 Phase 2 Step 3: Digital Proof-of-Condition (Diferensiator MVP)

#### Backend
- [ ] `ProofOfConditionController`:
  - `store` - upload foto, generate watermark (timestamp + order_id)
  - `approve` - customer approval via WhatsApp link
  - `timeout` - handle timeout 2 jam (configurable)

#### Frontend
- [ ] Camera capture component (browser-based, bukan native)
- [ ] Watermark overlay pada preview
- [ ] WhatsApp approval flow simulation
- [ ] Integration di order create/show untuk high-risk items

#### Integration
- [ ] Order status blocked sampai PoC approved (untuk high-risk)
- [ ] Notification trigger ke customer via WhatsApp

---

### 🎯 Phase 2 Step 4: Notifications System

#### Backend
- [ ] `NotificationService` - kirim WhatsApp via Meta Cloud API
- [ ] Event listeners: `OrderCreated`, `OrderStatusChanged`, `OrderCompleted`
- [ ] Fallback SMS via vendor lokal
- [ ] Template customization per tenant

#### Frontend
- [ ] Notification history di order detail
- [ ] Template editor di settings

---

### 🎯 Phase 3: Dashboard & Reporting

#### Backend
- [ ] `DashboardController` - stats cards (orders today, revenue, pending, completed)
- [ ] `ReportController` - daily report per outlet, consolidated untuk multi-outlet
- [ ] Export PDF/Excel (Laravel Excel)

#### Frontend
- [ ] `resources/js/pages/dashboard.tsx` - stats cards, recent orders, quick actions
- [ ] `resources/js/pages/reports/index.tsx` - date range picker, outlet filter, export buttons

---

## 🔧 Technical Debt / Improvements

- [ ] Implement WhatsApp OTP verification (saat ini skip email verification)
- [ ] Integrasi Xendit/Midtrans payment gateway (saat ini simulate)
- [ ] File upload untuk Proof-of-Condition (S3/local storage)
- [ ] AuditLog observer untuk auto-log critical actions
- [ ] Multi-tenant query scope (global scope di models)
- [ ] Rate limiting untuk registration/login
- [ ] Email verification fallback

---

## 📋 Notes untuk Besok

1. **Mulai dari OrderController** - ini core value proposition
2. **Gunakan TDD** - tulis test dulu untuk setiap action
3. **Follow Laravel Best Practices** - FormRequest, Resources, Policies
4. **Frontend pakai shadcn/ui** - components sudah tersedia di `resources/js/components/ui/`
5. **Wayfinder** - gunakan `@/routes` untuk type-safe routing
6. **Test command**: `php artisan test --compact --filter=Order`
7. **Format command**: `vendor/bin/pint --dirty --format agent`

---

## 🎯 Target Minggu Ini

| Hari | Fokus |
|------|-------|
| Senin (20/10) | Order Management (CRUD, status flow) |
| Selasa (21/10) | Proof-of-Condition + Notifications |
| Rabu (22/10) | Dashboard + Reports |
| Kamis (23/10) | Customer & Price List Management |
| Jumat (24/10) | Integration testing, bug fixes, Polish |

---

## 📌 Blockers / Risks

1. **WhatsApp Business API** - butuh approval Meta (mulai minggu ini)
2. **Xendit/Midtrans** - butuh akun merchant untuk testing
3. **File upload** - perlu setup S3 atau local storage config
4. **Multi-tenant isolation** - pastikan global scopes bekerja di semua queries

---

*Update TODO.md ini di akhir setiap hari kerja*