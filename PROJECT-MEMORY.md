# Project Memory — Laundry SaaS (Repica)

**Initialized:** Fri Oct 30 2026
**Scope:** Project-wide
**Purpose:** Persistent context for future coding sessions

---

## 1. Tech Stack & Commands

### Backend (PHP)

| Item               | Version / Detail                                          |
| ------------------ | --------------------------------------------------------- |
| PHP                | 8.4.23                                                    |
| Laravel            | 13.32.0                                                   |
| Inertia Laravel    | 3.3.4                                                     |
| Fortify            | 1.39.0                                                    |
| Wayfinder          | 0.1.21                                                    |
| Laravel Pint       | 1.32.1                                                    |
| PHPStan / Larastan | 3.12.2 (level 7)                                          |
| PHPUnit            | 12.5.35                                                   |
| Database           | SQLite (dev/testing), MySQL (production per ARCHITECTURE) |
| Queue driver       | database                                                  |
| Cache driver       | database                                                  |

### Frontend (TypeScript + React)

| Item             | Version / Detail                                |
| ---------------- | ----------------------------------------------- |
| React            | 19.2.0                                          |
| Inertia React    | 3.0.0                                           |
| Tailwind CSS     | 4.0.0                                           |
| Vite             | 8.0.0                                           |
| vite-plus (`vp`) | build tool                                      |
| shadcn/ui        | style `new-york`, `components.json`             |
| Radix UI         | primitives                                      |
| Lucide React     | icons                                           |
| Motion           | animations                                      |
| Sonner           | toasts                                          |
| TypeScript       | 5.7.2                                           |
| React Compiler   | enabled via `@vitejs/plugin-react` babel preset |

### Key Commands

- `composer test` — runs Pint lint check + PHPStan + PHPUnit (43 tests, 2 known failing in LandingPageTest)
- `php artisan test` — run PHPUnit
- `vendor/bin/pint --dirty --format agent` — format modified PHP files
- `npm run check` — vite-plus lint + type check
- `npm run types:check` — `tsc --noEmit`
- `npm run dev` / `npm run build` — Vite dev / build
- `php artisan serve` — dev server
- `php artisan route:list --except-vendor` — list routes
- `php artisan config:show <key>` — read config

### composer.json scripts

- `setup` — full install + key generate + migrate + npm install + build
- `dev` — concurrently runs `php artisan serve`, `php artisan queue:listen`, `npm run dev`
- `lint` / `lint:check` — Pint
- `ci:check` — `npm run check`, `npm run types:check`, `@test`
- `test` — config clear, lint:check, types:check, `php artisan test`

---

## 2. Project Structure

```
app/
  Actions/Fortify/        — CreateNewUser, ResetUserPassword
  Concerns/               — PasswordValidationRules, ProfileValidationRules
  Console/Commands/       — (empty)
  Http/
    Controllers/
      Auth/               — OnboardingController, RegisterController
      Settings/           — ProfileController, SecurityController
    Middleware/           — EnsureTenantIsTrial, HandleAppearance, HandleInertiaRequests
    Requests/
      Auth/               — RegisterRequest
      Settings/           — PasswordUpdateRequest, ProfileDeleteRequest, ProfileUpdateRequest, TwoFactorAuthenticationRequest
  Models/                 — 12 Eloquent models (see §4)
  Providers/              — AppServiceProvider, FortifyServiceProvider
bootstrap/app.php         — middleware aliases ('tenant.trial'), exception config
config/                   — 12 config files (app, auth, cache, database, filesystems, fortify, inertia, logging, mail, queue, services, session)
database/
  migrations/             — 18 migrations (users, tenants, outlets, subscription_plans, tenant_subscriptions, customers, price_list_items, orders, order_items, proof_of_conditions, notifications, audit_logs, payments + standard Laravel)
  seeders/                — DatabaseSeeder, SubscriptionPlanSeeder
  factories/              — UserFactory, SubscriptionPlanFactory
resources/
  js/
    app.tsx               — Inertia app root, layout switching
    pages/
      auth/               — login, register, forgot-password, reset-password, verify-email, confirm-password, two-factor-challenge
      onboarding/         — plan, payment
      settings/           — appearance, profile, security
      dashboard.tsx       — placeholder (stub)
      welcome.tsx         — marketing landing page
    components/
      ui/*                — shadcn/ui primitives (DO NOT EDIT MANUALLY per R-FE-002)
      marketing/*         — hero, pipeline, pricing, faq, etc.
      react-bits/         — count-up, particles
      app-shell.tsx, app-sidebar.tsx, app-header.tsx, etc.
    hooks/                — use-appearance, use-clipboard, use-current-url, use-flash-toast, use-initials, use-mobile, use-mobile-navigation, use-two-factor-auth
    lib/                  — utils.ts (cn, toUrl), pipeline-status.ts (PIPELINE_STATUSES)
    layouts/              — app-layout, auth-layout, settings-layout
    routes/               — wayfinder-generated + index.ts (login, register, onboarding, settings, etc.)
    types/                — auth.ts, navigation.ts, ui.ts, global.d.ts, vite-env.d.ts
    wayfinder/index.ts    — route type definitions
  css/app.css             — Tailwind imports, custom theme tokens (font, radius, colors)
routes/
  web.php                 — home, register, onboarding (tenant.trial middleware), dashboard, requires settings.php
  settings.php            — profile, security, appearance, well-known passkey endpoints
  console.php             — (empty)
  settings.php            — settings routes
```

### Routes (14 total, excluding vendor)

```
GET|HEAD  .well-known/passkey-endpoints          well-known.passkeys
GET|HEAD  onboarding/payment                     onboarding.payment
POST      onboarding/payment                     onboarding.payment.process
GET|HEAD  onboarding/plan                        onboarding.plan
POST      onboarding/plan                        onboarding.plan.select
POST      onboarding/skip-payment                onboarding.skip-payment
GET|HEAD  register                               register
POST      register                               register.store
ANY       settings                               RedirectController
PUT       settings/password                      user-password.update
GET|HEAD  settings/profile                       profile.edit
PATCH     settings/profile                       profile.update
DELETE    settings/profile                       profile.destroy
GET|HEAD  settings/security                      security.edit
GET|HEAD  settings/appearance                    appearance.edit
GET|HEAD  dashboard                              dashboard
GET|HEAD  /                                      home (welcome)
```

---

## 3. Domain Models (12 Eloquent models)

All models use `HasFactory`, `BelongsTo`/`HasMany` relations, PHPDoc in Bahasa Indonesia, and explicit property annotations.

| Model                  | Key Fillable                                                                                                   | Key Casts                            | Notable Methods                                                                                                                                            |
| ---------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Tenant**             | name, business_type, status                                                                                    | string                               | `isTrial()`, outlets(), users(), subscription(), customers(), priceListItems(), orders()                                                                   |
| **Outlet**             | tenant_id, name, address, whatsapp_number, operating_hours                                                     | array (operating_hours)              | tenant(), users(), orders()                                                                                                                                |
| **User**               | name, email, password, phone, role, status, tenant_id, outlet_id                                               | datetime, hashed                     | `isOwner()`, `isAdminOutlet()`, `isKasir()`, `canManageStaff()`, `canViewFinancialReports()`, `canChangePrices()`, `canAccessOutlet()`, tenant(), outlet() |
| **SubscriptionPlan**   | name, price_monthly, price_annual, feature_flags, max_outlets, max_users, max_photos_per_month                 | decimal:2, array, integer            | `isBasic()`, `isPro()`, tenantSubscriptions()                                                                                                              |
| **TenantSubscription** | tenant_id, plan_id, status, start_date, end_date, payment_gateway_ref                                          | date, string                         | `isActive()`, `isExpired()`, trial check, tenant(), plan(), payments()                                                                                     |
| **Customer**           | tenant_id, name, phone, address, member_since, deposit_balance                                                 | date, decimal:2                      | tenant(), orders()                                                                                                                                         |
| **PriceListItem**      | tenant_id, service_type, unit, price, estimated_duration_hours                                                 | decimal:2, integer                   | tenant()                                                                                                                                                   |
| **Order**              | tenant_id, outlet_id, customer_id, created_by, status, is_high_risk, total_price, payment_status, completed_at | boolean, decimal:2, string, datetime | STATUSES = [diterima, dicuci, dikeringkan, disetrika, siap_diambil, selesai], tenant(), outlet(), customer(), creator(), orderItems(), proofOfCondition()  |
| **OrderItem**          | order_id, description, quantity_weight, service_type, price                                                    | decimal:2                            | order()                                                                                                                                                    |
| **ProofOfCondition**   | order_id, photo_url, watermark_data, customer_approval_status, approved_at, wa_message_ref                     | array, string, datetime              | APPROVAL_STATUSES = [pending, approved, timeout], `isApproved()`, `isTimeout()`, `isPending()`, `approve()`, order()                                       |
| **Notification**       | tenant_id, order_id, channel, event_type, status, sent_at                                                      | string, datetime                     | `isSent()`, `isFailed()`, `markSent()`, `markFailed()`, tenant(), order()                                                                                  |
| **AuditLog**           | tenant_id, user_id, action_type, entity_type, entity_id, before_value, after_value                             | array                                | static `log()`, tenant(), user()                                                                                                                           |
| **Payment**            | tenant_subscription_id, gateway, amount, status, gateway_transaction_id, paid_at                               | decimal:2, string, datetime          | `isSuccess()`, `isPending()`, `isFailed()`, `markSuccess()`, tenantSubscription()                                                                          |

**Pipeline status order:** diterima → dicuci → dikeringkan → disetrika → siap_diambil → selesai

---

## 4. Architecture Decisions (from DECISIONS.md & ARCHITECTURE.md)

| Decision            | Value                                                        |
| ------------------- | ------------------------------------------------------------ |
| Tier structure      | 2 tiers (Basic/Pro), PoC in Basic, Enterprise deferred to v2 |
| OTP channel         | WhatsApp default + SMS fallback, email optional              |
| Price list          | Per tenant at MVP, skema for per-outlet override             |
| Billing model       | Manual invoice per periode + pay link, not auto-charge       |
| WhatsApp provider   | Meta WhatsApp Cloud API (official)                           |
| PoC photo retention | 12 months (lifecycle auto-purge), metadata permanent         |
| Timeout approval    | Default 2 hours, configurable 1–24 hours, 1 reminder         |
| Target adoption     | 20 paying tenants, MRR ±Rp4–5jt by end of month 3            |
| Pricing             | Basic Rp149rb/bln, Pro Rp499rb/bln, annual = 2 months free   |

**Architecture:** Single deploy, single database, no microservices. Laravel 13 monolith with Inertia React SPA. Middleware chain: `auth → EnsureTenantContext → EnsureSubscriptionActive → EnsureRole`. Events → Queue (database) → Jobs for WA/SMS, payment verification, timeout. Scheduler for reminders H-3/H-0, expire approval PoC, verify pending payment.

**Object storage:** foto PoC (12 bulan retention).

**Document hierarchy (R-GOV-001):** PRD & DECISIONS.md → ARCHITECTURE.md → DESIGN-BRIEF → Rules.md → existing code style.

---

## 5. Coding Conventions (Rules.md)

- **R-GOV-003:** Satu gaya, nol pengecarian — kode baru wajib menyatu dengan gaya existing
- **R-BE-001 / R-FE-001:** Every function/method/component/hook wajib punya doc comment tujuan (PHPDoc/JSDoc, Bahasa Indonesia)
- **R-CODE-001:** Pint untuk PHP, vite-plus fmt untuk TS/TSX
- **R-FE-002 (§5):** reusable-first; primitive hanya via shadcn CLI; `resources/js/components/ui/*` dilarang diedit manual
- **R-QA-001/002:** `composer test` (backend) dan `npm run check` + `npm run types:check` (frontend) harus hijau
- **R-PROC-001:** Perubahan arsitektur wajib lewat `DECISIONS.md` dulu

**PHP rules:**

- Curly braces for all control structures
- PHP 8 constructor property promotion
- Explicit return types and type hints
- TitleCase for Enum keys
- PHPDoc over inline comments
- Array shape type definitions in PHPDoc

**Wayfinder:** Use `@/actions` (controllers) or `@/routes` (named routes) for typed route references — no hardcoded URLs.

---

## 6. Test Conventions

- Feature tests in `tests/Feature/`, unit tests in `tests/Unit/`
- Use `RefreshDatabase` trait
- Use model factories (`User::factory()`, `SubscriptionPlan::factory()`)
- `skipUnlessFortifyHas(Features::registration())` for Fortify-gated tests
- Assertions: `assertOk()`, `assertRedirect()`, `assertAuthenticated()`, `assertGuest()`, `assertSessionHasNoErrors()`, `assertStringContainsString()`
- Test naming: `test_<description>` (snake_case with `test_` prefix)

**Known failing tests (2):** `Tests\Feature\LandingPageTest::test_landing_page_composes_every_marketing_section` — checks for marketing content strings ('Repica', 'Baju rusak', '149.000', '499.000', 'Segera') in rendered HTML. May need Vite build (`npm run build`) for assets to be available in test environment.

---

## 7. Git & Workflow

- **Branch:** `main` (only branch)
- **Commits:** Conventional commits (`feat:`, `Update`, etc.)
- **4 commits total** — early project stage
- **No PRs as triage surface** (external PRs not treated as feature requests)
- **Issue tracker:** GitHub issues via `gh` CLI
- **Triage labels:** `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`

---

## 8. Environment

- `.env`: APP_NAME=Repica, APP_LOCALE=id, APP_FAKER_LOCALE=id_ID, APP_URL=http://localhost:8000, DB_CONNECTION=sqlite, QUEUE_CONNECTION=database, SESSION_DRIVER=database
- APP_ENV=local, APP_DEBUG=true
- VITE_APP_NAME="${APP_NAME}"

---

## 9. Key Frontend Patterns

- `PIPELINE_STATUSES` in `resources/js/lib/pipeline-status.ts` — centralized status definitions (key, label, icon, badgeClass, dotClass) per DESIGN-BRIEF P3 "Status adalah bahasa bersama"
- `cn()` utility in `resources/js/lib/utils.ts` — clsx + tailwind-merge
- `toUrl()` utility — converts InertiaLinkProps href to string
- `usePage<{ auth: Auth }>().props` — typed page props with explicit generic augmentation
- Wayfinder routes: `dashboard()`, `login()`, `register()`, etc. imported from `@/routes`
- Layout switching in `app.tsx` based on page name (welcome → null, auth/ → AuthLayout, settings/ → [AppLayout, SettingsLayout], default → AppLayout)
- shadcn/ui components from `@/components/ui/*` — never edit manually
- Marketing components in `@/components/marketing/*`

---

## 10. Known Issues / Gotchas

1. **2 failing tests** in `LandingPageTest::test_landing_page_composes_every_marketing_section` — likely needs `npm run build` so Vite assets are available during Inertia rendering in tests
2. **Dashboard page is a stub** (`resources/js/pages/dashboard.tsx`) — only placeholder patterns, no real data
3. **No `.ai/rules/` directory** exists despite AGENTS.md referencing it
4. **No GLOSSARY.md or ADRs** exist despite docs/agents/domain.md referencing them
5. **Queue driver is database** — need `php artisan queue:listen` running for background jobs
6. **PHP 8.4 required** — constructor property promotion, readonly, etc.
7. **Tailwind CSS v4** — uses `@import 'tailwindcss'` and `@theme` CSS-based configuration (no tailwind.config.js)

---

_This memory file is project-scoped and should be updated as the codebase evolves._
