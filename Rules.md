# Rules.md — Aturan Proyek Laundry SaaS

> **Status:** v1.1 — aktif mengikat untuk semua kode yang ditulis mulai hari ini.
> **Sumber:** `PRD-Laundry-SaaS-MVP.md` (v1.1) · `DECISIONS.md` · `ARCHITECTURE.md` · `DESIGN-BRIEF-Laundry-SaaS.md`
> **Stack aktual di repo:** Laravel 13 + Fortify + Wayfinder · Inertia React v3 + React Compiler · Tailwind CSS v4 · shadcn/ui (style `new-york`, `components.json`) · PHPUnit + Pint (preset laravel) + PHPStan · vite-plus (`vp`).

---

## §0 Kamus RFC 2119

| Kata | Makna mengikat |
|---|---|
| **WAJIB** | Aturan mutlak. Pelanggaran = kode ditolak, tanpa pengecualian. |
| **HARUS** | Wajib kecuali ada alasan teknis terdokumentasi di PR/commit message. |
| **SEBAIKNYA** | Praktik yang disarankan; boleh dilanggar dengan pertimbangan eksplisit. |
| **TIDAK BOLEH** | Larangan mutlak. |

---

## §1 Tata Kelola Dokumen

**R-GOV-001 — Hierarki konflik.** Jika ada pertentangan antar dokumen, urutan kekuatan: `PRD` & `DECISIONS.md` (keputusan produk) → `ARCHITECTURE.md` (keputusan teknis — cara membangun: multi-tenancy, subsistem, queue/scheduler) → `DESIGN-BRIEF` (keputusan desain) → `Rules.md` (cara menulis kode) → **gaya kode existing di repo** (acuan paling konkret untuk file yang disentuh). *Verifikasi: saat ragu, ikuti tingkat yang lebih tinggi dan catat konfliknya.*

**R-GOV-002 — Rules.md tidak membuat keputusan produk.** Aturan di sini hanya mengatur *cara coding*. Ide fitur/perubahan perilaku tidak boleh masuk lewat kode — harus lewat `DECISIONS.md` dulu (lihat R-PROC-001). *Verifikasi: review diff.*

**R-GOV-003 — Satu gaya, nol pengecualian.** Kode baru WAJIB tidak bisa dibedakan dari kode existing. Sebelum membuat file, WAJIB membaca 2–3 file sejenis di folder tujuan dan meniru struktur, penamaan, dan polanya. *Verifikasi: reviewer tidak bisa menebak file mana yang baru.*

---

## §2 Gaya Kode Umum

**R-CODE-001 — Format dari tool, bukan tangan.**
- PHP: format **hanya** via Pint (`pint.json` preset laravel). Setelah mengubah file PHP: `vendor/bin/pint --dirty --format agent`.
- TS/TSX: format **hanya** via vite-plus fmt (printWidth 80, tabWidth 4, singleQuote, semi — lihat `vite.config.ts`). Jalankan `npm run check` / `check:fix`.
TIDAK BOLEH memformat manual atau menonaktifkan formatter. *Verifikasi: `composer lint:check` dan `npm run check` hijau.*

**R-CODE-002 — Penamaan deskriptif.** Nama WAJIB menjelaskan maksud (`isRegisteredForDiscounts`, bukan `discount()`). TIDAK BOLEH singkatan tidak baku, kecuali konvensi umum (`id`, `url`). *Verifikasi: dibaca ulang 1 minggu kemudian tetap jelas.*

**R-CODE-003 — Satu function, satu tanggung jawab.** Jika nama function butuh kata "dan", pecah. Function WAJIB pendek dan datar; nesting dalam jika/loop lebih dari 2 tingkat SEBAIKNYA diekstrak. *Verifikasi: review.*

**R-CODE-004 — Zero dead code.** Kode yang tidak dipakai WAJIB dihapus, TIDAK BOLEH dikomentari "untuk jaga-jaga". Git menyimpan sejarah. *Verifikasi: tidak ada blok kode terkomentar di diff.*

**R-CODE-005 — DRY.** Logic yang sama muncul ≥2 kali WAJIB diekstrak: PHP → method class / `app/Concerns`, TS → `resources/js/lib/` atau hook. *Verifikasi: cari duplikat sebelum menulis ulang.*

**R-CODE-006 — Tidak ada magic value.** Angka/string yang membawa makna bisnis (harga, status, batas kuota, timeout) WAJIB berupa enum/konstanta/config — backend pakai PHP enum atau `config/`, frontend pakai konstanta bertipe di `resources/js/lib/` atau `types`. *Verifikasi: grep nilai literal di logic.*

**R-CODE-007 — Type safety penuh.**
- PHP: type hint + return type WAJIB di semua parameter & method; PHPDoc array-shape untuk array kompleks; constructor property promotion. Lolos `composer types:check` (PHPStan).
- TS: mode `strict` TIDAK BOLEH dilemahkan; TIDAK BOLEH `any`, TIDAK BOLEH `@ts-ignore`/`!` non-null assertion — pakai tipe benar atau `unknown` + narrowing. Lolos `npm run types:check`.
*Verifikasi: kedua typechecker hijau.*

**R-CODE-008 — Bahasa komentar: Bahasa Indonesia.** Semua komentar baru WAJIB berbahasa Indonesia (seluruh dokumen proyek berbahasa Indonesia; pembaca utamanya owner). Komentar bawaan starter kit yang berbahasa Inggris tidak wajib diterjemahkan, cukup saat file disentuh. *Verifikasi: konsistensi dalam satu file.*

---

## §3 Backend — PHP / Laravel

### Comment wajib (aturan inti Anda)

**R-BE-001 — Setiap function/method WAJIB punya PHPDoc tujuan.** Satu kalimat yang menjawab *apa yang dilakukan & kenapa ada* — bukan mengulang nama function atau menjelaskan *bagaimana*. Tanpa kecuali, termasuk yang sepele. Exception/return non-trivial dicatat di baris berikutnya.

```php
// ❌ SALAH — tanpa doc, atau doc yang tidak bermakna
public function rollback(Order $order): void
{
    $order->update(['status' => $order->getOriginal('status')]);
}

// ✅ BENAR
/**
 * Mengembalikan status order ke nilai sebelumnya dan mencatat siapa yang melakukan rollback di AuditLog.
 * Dipakai Admin Outlet/Owner saat kasir salah input tahap (PRD edge case Section 8).
 */
public function rollback(Order $order, User $actor): void
{
    // ...
}
```
*Verifikasi: setiap function punya doc yang menjawab "kenapa".*

### Struktur

**R-BE-002 — Buat file via artisan.** Model, controller, migration, request, test WAJIB lewat `php artisan make:*` (dengan `--no-interaction`). TIDAK BOLEH copy-paste file sejenis. *Verifikasi: namespace & struktur bawaan Laravel.*

**R-BE-003 — Controller tipis.** Controller HANYA: menerima request → validasi (FormRequest terpisah) → delegasi ke service/action/model → return `Inertia::render()` atau redirect. Logic bisnis TIDAK BOLEH di controller. *Verifikasi: isi controller < ±40 baris per action.*

**R-BE-004 — Isolasi tenant mutlak.** Semua query data operasional (outlet, order, customer, staff, laporan) WAJIB ter-scope `tenant_id` (global scope atau explicit). Validasi `outlet_id` terhadap assignment user WAJIB di server per request — 403, bukan cuma disembunyikan di UI (PRD FR-2.1, FR-3.3). *Verifikasi: test negatif per endpoint (R-QA-006).*

**R-BE-005 — Audit trail untuk aksi kritikal.** Perubahan harga manual, void transaksi, hapus order, rollback status, override approval WAJIB menulis `AuditLog` (user_id, timestamp, before/after). Ini fondasi fraud detection v2 — wajib sejak MVP (FR-3.4). *Verifikasi: setiap endpoint kritikal punya assertion log di test.*

**R-BE-006 — Harga & total dihitung server-side.** Total order WAJIB dihitung dari price list di server. TIDAK BOLEH memercayai angka harga/total dari client (FR-6.1). *Verifikasi: tidak ada field harga yang di-accept langsung dari request tanpa validasi terhadap price list.*

**R-BE-007 — Transisi status lewat satu pintu.** Perubahan status order (`diterima → … → selesai`) WAJIB lewat enum + method transisi tunggal yang memvalidasi transisi legal; TIDAK BOLEH `update(['status' => ...])` tersebar. *Verifikasi: satu-satunya tempat yang menulis kolom status.*

**R-BE-008 — Schema lewat migration.** Perubahan database WAJIB lewat migration baru. Migration yang sudah ter-merge TIDAK BOLEH diedit. Setiap model baru WAJIB punya factory. *Verifikasi: `php artisan migrate:fresh --seed` di environment bersih lulus.*

**R-BE-009 — Konfigurasi via config/env.** Nilai yang bergantung deployment (kredensial gateway, provider WA, timeout approval) WAJIB via `config/` + `.env`. TIDAK BOLEH hardcode credential atau URL produksi di kode. *Verifikasi: grep di review.*

---

## §4 Frontend — React / TypeScript / Inertia

### Comment wajib (aturan inti Anda)

**R-FE-001 — Setiap component, hook, dan function WAJIB punya JSDoc tujuan.** Satu kalimat "apa & kenapa", persis semangat R-BE-001. Tanpa kecuali.

```tsx
// ❌ SALAH
function StatusBadge({ status }: { status: OrderStatus }) {
    return <Badge>{status}</Badge>;
}

// ✅ BENAR
/** Badge status order — warna + ikon + label dari satu pemetaan bersama agar identik di semua layar (brief §3, P3). */
function StatusBadge({ status }: { status: OrderStatus }) {
    return <Badge>{status}</Badge>;
}
```
*Verifikasi: setiap deklarasi function/component punya JSDoc bermakna.*

### Keputusan arsitektur Anda (mengikat)

**R-FE-002 — Reusable-first.** Markup yang muncul ≥2 kali WAJIB menjadi komponen reusable di `resources/js/components/` — dilarang copy-paste JSX. Tujuan: basis kode kecil, ringan di disk, konsisten. Komponen satu-halaman diletakkan lokal di `pages/` sampai terbukti dipakai ulang, lalu dinaikkan. *Verifikasi: tidak ada JSX duplikat lintas file.*

**R-FE-003 — Page tipis.** File di `resources/js/pages/` HANYA komposisi komponen + data dari props Inertia. Logic reusable → `hooks/`; formatter/helper → `lib/`; komponen presentasional → `components/`. TIDAK BOLEH fetch/logic bisnis di page. *Verifikasi: page bisa dibaca seperti daftar section.*

**R-FE-004 — Routing & form via Wayfinder + Inertia.** Import controller dari `@/actions/...` dan named route dari `@/routes/...`; form pakai komponen `<Form>` Inertia v3. TIDAK BOLEH hardcode URL string atau pakai axios/fetch manual untuk route yang ada Wayfinder-nya. *Verifikasi: tidak ada string '/orders' di JSX.*

**R-FE-005 — State server = props Inertia.** Data dari server mengalir lewat props; TIDAK BOLEH diduplikasi ke store global tanpa alasan terukur. State lokal UI (form, modal) pakai `useState` — TIDAK BOLEH menambah state management library. *Verifikasi: tidak ada dependency state baru di package.json.*

**R-FE-006 — Styling hanya Tailwind + token.** Class Tailwind dengan token dari `resources/css/app.css` (CSS variables Tailwind v4). TIDAK BOLEH: inline `style={}`, file CSS baru per halaman, library UI kedua. Warna/hex WAJIB lewat token theme — dilarang menulis hex langsung di class. *Verifikasi: grep hex di tsx = 0.*

**R-FE-007 — Ikon hanya `lucide-react`.** TIDAK BOLEH menambah icon library lain atau emoji sebagai ikon fungsional (brief §2). *Verifikasi: import ikon konsisten.*

**R-FE-008 — Format angka & uang lewat helper bersama.** Uang `formatIDR()`, berat, tanggal — satu implementasi di `lib/`, tabular-nums, format Indonesia (`Rp 150.000`). TIDAK BOLEH format manual per komponen (brief §3). *Verifikasi: satu sumber helper.*

**R-FE-009 — Aksesibilitas non-negotiable.** `Label htmlFor` terhubung, `alt` bermakna, ikon-only button punya `aria-label`, error form terkait via `aria-describedby`, target sentuh ≥44px di alur kasir. *Verifikasi: checklist per komponen baru (brief §10).*

**R-FE-010 — Satu file satu komponen.** Default export satu component per file, nama file kebab-case (konvensi starter: `status-badge.tsx`). *Verifikasi: konsisten dengan existing `components/`.*

---

## §5 Tata Kelola Komponen — shadcn/ui

**R-UI-001 — Primitive hanya dari shadcn/ui.** Komponen dasar (button, input, dialog, select, dll) WAJIB ditambah via CLI: `npx shadcn@latest add <nama>` — terpasang di `resources/js/components/ui/` sesuai `components.json` (style `new-york`). TIDAK BOLEH menulis primitive sendiri dari nol atau menambah library UI ketiga. *Verifikasi: setiap file di `components/ui/` punya asal CLI.*

**R-UI-002 — `components/ui/*` adalah zona dilarang-edit.** File hasil CLI TIDAK BOLEH diedit manual (vite lint pun mengabaikannya). Kustomisasi visual WAJIB lewat: (a) CSS variables/token di `resources/css/app.css`, atau (b) komponen domain wrapper. *Verifikasi: diff tidak menyentuh `components/ui/*`.*

**R-UI-003 — Komponen domain membungkus primitive.** Komponen spesifik laundry WAJIB meng-wrap primitive shadcn (dengan variant via `class-variance-authority`), bukan markup raw. Daftar WAJIB ada dan WAJIB dipakai ulang (R-FE-002) — sesuai design brief §7:

| Komponen domain | Membungkus | Catatan variant |
|---|---|---|
| `StatusBadge` | `Badge` | 6 status pipeline + `Menunggu Persetujuan`; selalu ikon+label |
| `CustomerPicker` | `Command`/`Combobox` (via CLI saat dibutuhkan) | search by no. HP; state kosong/hasil/tidak-ditemukan |
| `WeightInput` | `Input` + keypad | unit kg/pcs |
| `CameraCapture` | native `getUserMedia` + `Button` | idle/aktif/upload/retry/gagal |
| `PhotoCard` | `Card` | watermark/pending/approved/timeout |
| `StickyActionBar` | `Button` | sticky bar order create |
| `ConfirmDialog` | `AlertDialog` | wajib sebut konsekuensi + jejak audit |
| `TierGate` | `Tooltip` + lock | inline lock, tanpa modal upsell |
| `EmptyState` | — | with-CTA / informational |
| `OfflineBanner` | `Alert` | koneksi hilang |
| `Timeline` | `Separator`/custom | done/current/pending/rolled-back |
| `PlanCard` | `Card` | current/recommended/locked |

Toast memakai `sonner` yang sudah terpasang; DataTable pakai `Table` (via CLI) → jadi `CardList` di mobile. Sebelum membuat komponen apa pun: cek tabel di atas + `components/ui/` + `components/` dulu. *Verifikasi: tidak ada komponen domain yang tidak terdaftar tanpa alasan.*

**R-UI-004 — State adalah prop, bukan komponen baru.** `loading`, `disabled`, `error` WAJIB jadi prop variant komponen yang sama. TIDAK BOLEH membuat `LoadingButton` terpisah dari `Button`. *Verifikasi: jumlah file komponen proporsional dengan jumlah konsep, bukan state.*

**R-UI-005 — Overlay/portal hanya via primitive Radix bawaan shadcn** (`Dialog`, `Sheet`, `DropdownMenu`, `Tooltip`). TIDAK BOLEH implementasi modal/dropdown manual. *Verifikasi: tidak ada `createPortal` di components/*

---

## §6 Quality Gates — Definition of Done

**R-QA-001 — Backend selesai berarti:** `composer test` hijau (pint --test + PHPStan + PHPUnit). *Verifikasi: output.*

**R-QA-002 — Frontend selesai berarti:** `npm run check` + `npm run types:check` hijau. *Verifikasi: output.*

**R-QA-003 — Perubahan behavior/logic WAJIB ada test** (PHPUnit, feature test dulu); pure copy/styling tidak wajib. Test baru dibuat via `php artisan make:test --phpunit`. *Verifikasi: coverage kasus yang berubah.*

**R-QA-004 — Test pakai factory + state existing;** TIDAK BOLEH membuat model manual bertumpuk di test. Faker via `fake()`. *Verifikasi: baca test.*

**R-QA-005 — TIDAK BOLEH menonaktifkan/skip test, lint, atau typecheck demi lolos gate.** Jika gate gagal, perbaiki kodenya. *Verifikasi: diff tidak menyentuh konfigurasi QA.*

**R-QA-006 — Setiap endpoint baru di sistem multi-tenant WAJIB punya test negatif isolasi** (kasir Outlet A tidak bisa akses Outlet B → 403) — turunan langsung R-BE-004. *Verifikasi: daftar test.*

---

## §7 Proses & Dokumentasi

**R-PROC-001 — Keputusan baru masuk `DECISIONS.md` dulu**, baru dikode. Kode tidak boleh mendahului keputusan produk. *Verifikasi: riwayat DECISIONS.md.*

**R-PROC-002 — Mengubah Rules.md WAJIB menaikkan versi + mencatat di §9 changelog.** *Verifikasi: changelog.*

**R-PROC-003 — TIDAK BOLEH membuat file dokumentasi baru** (README tambahan, catatan, dsb.) tanpa diminta eksplisit. *Verifikasi: daftar file root tetap ramping.*

**R-PROC-004 — Jika Rules.md diam, gaya existing menang** (turunan R-GOV-003). Kode lama tidak perlu direfactor massal, TAPI file yang disentuh WAJIB disesuaikan ke aturan ini saat itu juga (boy-scout, cakupan file yang disentuh saja). *Verifikasi: diff terbatas.*

---

## §8 Log Perubahan

| Versi | Tanggal | Perubahan |
|---|---|---|
| v1.0 | 2026-09-22 | Versi awal — 45 aturan ber-ID: tata kelola, gaya kode, backend, frontend, shadcn/ui, QA, proses. |
| v1.1 | 2026-09-22 | Menambahkan `ARCHITECTURE.md` ke sumber dokumen dan hierarki konflik R-GOV-001 (posisi: setelah DECISIONS, sebelum DESIGN-BRIEF). |
