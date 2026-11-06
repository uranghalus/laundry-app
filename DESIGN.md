---

name: 'Repica Marketing — Percikan Segar'
overview: "Permukaan marketing Repica memakai dunia 'Percikan Segar': ground off-white hangat (#FBFCFE) dengan aksen #63ADF2 yang melimpah sebagai field, garis, dan gradient; teks slate #0F172A untuk keterbacaan AA; kartu bento asimetris dengan radius 2xl–3xl dan border halus; partikel latar sebagai hiasan non-blokir; nuansa konveksi segar, konsumen-premium, dan interaktif. Halaman ini menjual 'bukti kondisi' (foto + watermark + persetujuan WhatsApp) sebagai dokumen yang mencegah sengketa laundry — bukan sekadar aplikasi cantik."
version: '4.0'
updated: '2026-11-03'
colors:
ground:
name: 'Ground Segar'
value: '#FBFCFE'
band:
name: 'Band Biru Pucat'
value: '#F0F7FF'
band-strong:
name: 'Band Biru Sedang'
value: '#E0F2FE'
brand-500:
name: 'Primer Segar'
value: '#63ADF2'
note: 'AKSEN Saja — #63ADF2 di atas putih hanya 2.39:1, tidak pernah jadi teks.'
brand-600:
name: 'Action Ink'
value: '#2563EB'
note: 'Fill CTA, teks link, ring fokus — 4.57:1 di atas putih, lolos AA body.'
brand-700:
name: 'Birunya Gelap'
value: '#1D4ED8'
brand-900:
name: 'Field Gelap'
value: '#1E40AF'
accent-pink-500:
name: 'Aksen Mawar'
value: '#EC4899'
note: 'Hiasan kartu bento dan partikel.'
accent-purple-500:
name: 'Aksen Ungu'
value: '#8B5CF6'
note: 'Hiasan kartu bento dan partikel.'
accent-emerald-500:
name: 'Aksen Hijau'
value: '#10B981'
note: 'Hiasan kartu bento dan partikel.'
accent-amber-500:
name: 'Aksen Emas'
value: '#F59E0B'
note: 'Hiasan kartu bento dan partikel.'
ink:
name: 'Tinta Slate'
value: '#0F172A'
ink-soft:
name: 'Tinta Sekunder'
value: '#64748B'
card:
name: 'Permukaan Kartu'
value: '#FFFFFF'
navy:
name: 'Slate Gelap'
value: '#0F172A'
navy-soft:
name: 'Slate Panel'
value: '#1E293B'
success:
name: 'Hijau Disetujui'
value: '#15803D'
warning:
name: 'Amber Perhatian'
value: '#B45309'
error:
name: 'Merah Sengketa'
value: '#B91C1C'
typography:
sans:
name: 'Plus Jakarta Sans'
weights: [400, 500, 600, 700, 800]
fallback: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif"
heading:
weight: 800
tracking: '-0.02em'
body:
weight: 400
leading: 'relaxed'
radius:
control:
value: '8px'
card:
value: '12px'
bento:
value: '16px (rounded-2xl)'
band:
value: '24px (rounded-3xl)'
spacing:
steps: ['4px', '8px', '12px', '16px', '24px', '32px', '48px', '64px']
motion:
hover: '150–250ms'
ease: 'ease-out'
reduced_motion: 'render keadaan akhir statis'
component-tokens:
button:
primary: 'rounded-lg bg-brand-600 px-6 py-3.5 font-semibold text-white transition-colors duration-200 hover:bg-brand-700 focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2'
secondary: 'rounded-lg border border-brand-600 bg-card px-6 py-3.5 font-semibold text-brand-600 transition-colors duration-200 hover:bg-brand-50 focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2'
accent: 'rounded-lg bg-brand-500 px-6 py-3.5 font-semibold text-white transition-colors duration-200 hover:bg-brand-600 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2'
ghost: 'rounded-lg bg-card px-6 py-3.5 font-semibold text-ink-soft transition-colors duration-200 hover:bg-muted focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2'
card:
base: 'rounded-xl border border-border bg-card shadow-sm'
bento: 'rounded-2xl border border-border bg-card shadow-band hover:bg-brand-50/50 hover:border-brand-200 transition-colors duration-200'
featured: 'rounded-2xl border-2 border-brand-600 bg-card shadow-lift'
badge:
neutral: 'rounded-full bg-muted text-ink-soft px-2 py-0.5 text-xs font-medium'
brand: 'rounded-full bg-brand-50 text-brand-600 border border-brand-100 px-2 py-0.5 text-xs font-medium'
success: 'rounded-full bg-success-tint text-success px-2 py-0.5 text-xs font-medium'
warning: 'rounded-full bg-warning-tint text-warning px-2 py-0.5 text-xs font-medium'
layout:
max_width: 'max-w-7xl'
hero_grid: 'lg:grid-cols-2 lg:gap-16 items-start'
bento_grid: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'
band_separator: 'divide-y divide-border'
motion_spec:
split_text: 'stagger 0.07s per kata, duration 0.5s, ease [0.16,1,0.3,1]'
count_up: 'IntersectionObserver sekali, ease-out'
particles: 'opacity rendah, pointer-events-none, aria-hidden, statis di prefers-reduced-motion'
hover: '150–250ms ease-out'
accessibility:
contrast_body: '4.5:1 minimum'
contrast_large: '3:1 minimum'
brand_500_on_white: '2.39:1 — TIDAK PAKAI SEBAGAI TEKS'
brand_600_on_white: '4.57:1 — lolos AA'
touch_target: '>=44px'
focus_ring: 'ring-2 ring-brand-600 ring-offset-2'
reduced_motion: 'hormati prefers-reduced-motion'
aria_controls: 'faq: aria-expanded/aria-controls'
pricing_radiogroup: 'role=radiogroup, aria-checked'
band_order: - Hero - Audience Strip - Feature Bento (#fitur) - Pipeline (#cara-kerja) - Integrations - Pricing (#harga) - FAQ (#faq) - CTA Footer
notes: - 'Komponen wajib pakai shadcn/ui dan react-bits vendored; tidak ada dep npm baru.' - 'Semua komentar di komponen: Bahasa Indonesia (R-FE-001).' - 'Nol raw hex di kelas TSX — gunakan token Tailwind via app.css @theme (R-FE-006).' - 'Angka gunakan tabular-nums.' - 'Vibes: modern, interaktif, mencolok, segar, konsumen-premium.'
