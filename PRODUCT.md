# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Laravel + Inertia React + MySQL

## Users

Primary: Owner Single-Outlet (Pak Rudi) — pemilik 1 gerai laundry, merangkap kasir/operator harian, non-teknis, pakai HP Android, terbiasa WhatsApp Business.
Secondary: Admin Pusat Multi-Outlet (Bu Sari) — mengelola 3–10 outlet, butuh visibilitas lintas outlet dan kontrol akses.
Supporting: Kasir/Staff Outlet, Pelanggan end-customer.

## Product Purpose

Laundry Management SaaS multi-tenant yang membantu pemilik usaha laundry single dan multi-outlet mengelola operasional end-to-end, mencegah fraud dan sengketa, serta mengoptimalkan kapasitas.

Success: Tenant bisa mendaftar, onboarding <30 menit, dan mulai beroperasi; order tercatat lengkap dengan notifikasi otomatis; fitur Digital Proof-of-Condition live di MVP.

## Positioning

Diferensiasi utama lewat anti-fraud & anti-sengketa via Digital Proof-of-Condition (foto kondisi awal + watermark + approval WA) dan audit trail aksi kritikal. Competitor hanya menyelesaikan operasional dasar POS.

## Operating Context

Usaha laundry di Indonesia, interaksi pelanggan via WhatsApp Business, pembayaran subscription via link invoice Xendit/Midtrans. Staff turnover tinggi, kasir bekerja di counter dengan HP Android.

## Capabilities and Constraints

Confirmed: registrasi & onboarding tenant, multi-tenant isolasi data, RBAC Owner/Admin Outlet/Kasir, manajemen outlet, subscription tier Basic/Pro, order management end-to-end, notifikasi WA/SMS, laporan keuangan dasar, Digital Proof-of-Condition dengan foto + watermark + approval, audit log.
Constraints: MVP web-only responsive, tidak ada aplikasi mobile native (rencana mobile native dicatat user). Harga seragam per tenant di MVP. Tidak ada AI Smart Fabric, tidak ada optimasi rute/armada otomatis, tidak multi-currency.
Undecided: detail UI tier gate, rentang timeout approval default 2 jam configurable.

## Brand Commitments

Nama brand: Repica. Visual direction: "Mesin cuci yang tenang" — bersih, utilitarian, industrial-hangat. Referensi BukuWarung/BukuKas, Linear/Notion, WhatsApp Business. Palet utama deep teal #0F766E, stone warm, amber untuk high-risk/pending. Tipografi Plus Jakarta Sans. Tidak ada dark mode di MVP, tidak glassmorphism.

## Evidence on Hand

PRD-Laundry-SaaS-MVP.md, DESIGN-BRIEF-Laundry-SaaS.md, DECISIONS.md. Data model terdefinisi di PRD Section 7.

## Product Principles

1. Kecepatan kasir adalah fitur.
2. Bukti harus terlihat, bukan tersembunyi di log.
3. Status adalah bahasa bersama.
4. Multi-tenant sejak hari pertama.
5. Onboarding <30 menit tanpa bantuan teknis.

## Accessibility & Inclusion

Kontras AA minimum, status selalu ikon + label, keyboard nav desktop, aria-label lengkap, lang=id. Perangkat utama HP Android kasir.
