# Landing Page Layout Patterns — Primary-Source Reference

**Scope:** marketing landing page (`/`) for Repica, a Laravel + Inertia React v3 + Tailwind v4 + shadcn/ui Indonesian laundry-management SaaS.
**Evidence rule:** every non-obvious claim below is anchored to a primary source (spec body, official docs, first-party source in `node_modules/`, or the live page). Claims where only a secondary write-up could be found are marked **[UNVERIFIED]** and should not drive implementation. Nothing here changes the brand palette (`--color-brand-700: #0f766e`), which is already decided in `resources/css/app.css`.

**Verified local versions** (read from the working tree, not from `package.json` ranges):

| Package                          | `package.json` range | Installed                     |
| -------------------------------- | -------------------- | ----------------------------- |
| `tailwindcss`                    | `^4.1.11`            | **4.3.3**                     |
| `@inertiajs/react`               | `^3.0.0`             | **3.9.1**                     |
| `@laravel/vite-plugin-wayfinder` | `^0.1.3`             | present, `formVariants: true` |
| `@radix-ui/react-toggle-group`   | `^1.1.2`             | present                       |
| `@radix-ui/react-accordion`      | **absent**           | **not installed**             |

Tailwind's docs site is currently on **v4.3** (`https://tailwindcss.com/docs/theme` header reads `v4.3`), so the official docs you read match the installed runtime. Do not assume 4.1-era docs.

---

## 1. Section order and above-the-fold emphasis

### 1.1 Attention distribution (the hard numbers)

| Finding                                                           | Value                                                                                                                  | Source                                                                                                                    |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Viewing time above the fold                                       | **57%**                                                                                                                | NN/g, _Scrolling and Attention_ (2018) — https://www.nngroup.com/articles/scrolling-and-attention/                        |
| Viewing time in the first two screenfuls (up to 2160px)           | **74%**                                                                                                                | same                                                                                                                      |
| Viewing time in the top 20% of the page                           | **>42%**                                                                                                               | same                                                                                                                      |
| Viewing time in the top 40% of the page                           | **>65%**                                                                                                               | same                                                                                                                      |
| Of the above-fold time, share in the **top half** of the viewport | **>65%**                                                                                                               | same                                                                                                                      |
| Earlier study (2010, 1024×768)                                    | 80.3% above / 19.7% below                                                                                              | https://www.nngroup.com/articles/scrolling-and-attention-original-research/                                               |
| Viewing time on the **left half** vs **right half** of the screen | **69% vs 30%** (remaining 1% beyond the initial 1024px)                                                                | NN/g, _Horizontal Attention Leans Left_ (2010) — https://www.nngroup.com/articles/horizontal-attention-original-research/ |
| Deep scroll ceiling                                               | "the fold as a barrier has been pushed down to the third screenful"; 81% of viewing time in the first three screenfuls | NN/g _Scrolling and Attention_                                                                                            |

**How to apply.** The reference design's **left-aligned hero headline → subhead → dual CTA** is the layout the evidence actually supports: two-thirds of gaze lands left of centre, and content inside the fold is only read reliably if it sits in the top half of the first viewport. Put the product-metric panel on the _right_; put the value proposition and both CTAs on the _left_. Do not centre the hero, and do not push either CTA below ~the first 600px.

### 1.2 Structure guidance, item by item

All from NN/g, _Homepage Design: 5 Fundamental Principles_ (Huei-Hsin Wang, 15 Mar 2024) — https://www.nngroup.com/articles/homepage-design-principles/

| Ref design element                         | Primary-source guidance                                                                                                                                                                                               | How to apply                                                                                                                                                                                                                                          |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sticky header with logo                    | "Display the company name and logo prominently in the **top left** corner… Avoid centered logos." (2.1)                                                                                                               | Logo leftmost in the sticky bar.                                                                                                                                                                                                                      |
| Nav + primary CTA in header                | "Locate primary navigation in a **highly noticeable** place." (4.3)                                                                                                                                                   | Nav visible without a hamburger at ≥`md`; CTA button right-aligned in the same bar.                                                                                                                                                                   |
| Hero headline + subhead                    | "Include a **tagline** that explicitly conveys what your site or company does… simple, scannable, and to the point." (2.2)                                                                                            | One H1 line + one supporting line. NN/g explicitly flags "cheerful welcomes" in the hero as a failure — no "Selamat datang di Repica".                                                                                                                |
| Dual CTA                                   | "Include clear, **descriptive** link labels." Generic "Click Here", "Explore", "Learn More" are called out as failures (4.1)                                                                                          | `Mulai Gratis` + `Lihat Demo` / `Masuk`, not "Pelajari Selengkapnya".                                                                                                                                                                                 |
| Hero product-metric panel                  | "Ensure that featured imagery **accurately reflects your brand**… Opt for informative and relevant visuals… **Avoid purely decorative graphics, as users tend to skip over them.**" (2.4)                             | The right-hand panel must be a real dashboard/metric state, not a gradient blob. NN/g's ✅ example is a facility photo; its ❌ example is a generic stock image.                                                                                      |
| "Trusted by" logo strip                    | —                                                                                                                                                                                                                     | **[UNVERIFIED]** No primary source found for strip placement or its conversion effect. NN/g covers _social proof_ only via `Customers`/`Case Studies` **pages** (see Baymard §1.4). Ship it if the owner wants it; do not cite it as evidence-backed. |
| 4-up "What Sets Us Apart" grid             | "Emphasize the **unique value** your site brings… every element should work harmoniously to deliver a persuasive message." NN/g's own ✅ screenshot is literally a section titled **"What Sets Us Apart"**. (2.3)     | Section title is defensible copy, not a design cliché. Keep feature claims differentiated, not parallel restatements.                                                                                                                                 |
| Alternating screenshot + feature-list band | "Provide **specific examples** of your site's content… a mere link labeled 'Product Spotlight' pales in comparison to showcasing a curated selection." (3.2)                                                          | Use real UI screenshots, not abstract illustrations.                                                                                                                                                                                                  |
| 3-up capability band                       | #8 _Aesthetic and Minimalist Design_: "Every extra unit of information competes with the relevant units and diminishes their relative visibility" — https://www.nngroup.com/articles/ten-usability-heuristics/        | Cap the band at 3–4 items.                                                                                                                                                                                                                            |
| Tinted integrations band                   | Baymard: integration info is "a **crucial** component of their decision-making process"; users expect it **in the main navigation, the footer, and on the homepage**. See §1.4                                        | Band is justified — but a band is _not_ a substitute for a real Integrations page linked from nav + footer.                                                                                                                                           |
| Pricing with Monthly/Yearly toggle         | Baymard: **"The most common design used by nearly all sites is the plan matrix, which proved to be the most effective way to evaluate the type of subscription plan to buy during testing."** See §1.4                | 4 tier cards side by side is the plan-matrix pattern. Do **not** truncate the feature lists.                                                                                                                                                          |
| FAQ accordion                              | NN/g #10 _Help and Documentation_: "It may be necessary to provide documentation… easy to search and focused on the user's task."                                                                                     | FAQ is the right home for objection-handling copy.                                                                                                                                                                                                    |
| Full-bleed gradient CTA + stat counters    | —                                                                                                                                                                                                                     | **[UNVERIFIED]** No primary source located for animated stat counters. If you ship them, honour `prefers-reduced-motion` (§2) and reserve their layout box (§1.5).                                                                                    |
| 4-column footer                            | Baymard: "the footer is where many users, through years of experience browsing e-commerce sites, **instinctively** turn when looking for specific information" — https://baymard.com/research-articles/saas-benchmark | Footer must carry Integrations, Pricing, FAQ links — not just social links.                                                                                                                                                                           |

Also load-bearing, from the same NN/g article:

- **§3.1 "Place the most important content above the fold, and lead users down the page."** NN/g names _false floors_ as a failure mode (a full-bleed hero image that reads as the whole page). Ensure something is visibly cut off at the bottom of the hero.
- **§5.2 "Minimize motion and animation"** — _"moving elements are often assumed to be ads"_. Directly relevant to §3.6 below.
- **§5.3 "Provide immediate access to content"** — NN/g cites Google's finding that **bounce likelihood rises 32% when load time goes 1s → 3s**.
- **§5.3 / §5.4 — ⚠ direct conflict with the repo's existing scroll-reveal.** NN/g: _"avoid animating crucial page elements like the logo, tagline, or main headline. Our research indicated that **scroll-triggered text animations delay users**."_ Their ❌ example is an animated tagline the reader had to scroll to finish.
    - `resources/css/app.css` already defines `@utility reveal` using `animation-timeline: view()` / `animation-range: entry 0% entry 35%`.
    - **Rule:** never apply `reveal` to the hero H1, the hero subhead, the CTA labels, the logo, or the pricing toggle. Apply it only to below-fold sections, and prefer `entry 0%` (start of entry) so text is fully visible for most of its time on screen.
    - Related: NN/g #8 + #4 (Jakob's Law — people spend most of their time on _other_ products) argue for conventional layout; `§5.1` explicitly criticises unconventional layouts with side navigation and parallax.

### 1.3 Jakob's Law / consistency

NN/g heuristic #4: _"people spend most of their time using digital products **other than yours**. Their experiences with those other products set their expectations."_ — https://www.nngroup.com/articles/ten-usability-heuristics/
**How to apply.** The ShopWave-style section order (hero → logo strip → features → screenshot band → capability band → integrations → pricing → FAQ → CTA → footer) is itself a recognised convention; keeping it is the low-risk choice.

### 1.4 Baymard — pricing presentation (direct primary research)

Source: Sally Collins, _SaaS UX Benchmark: 5 Pitfalls to Avoid_, Baymard Institute, 25 Jan 2022 — https://baymard.com/research-articles/saas-benchmark
Method: 10 B2B + 10 B2C digital-subscription/SaaS sites (Slack, Box, Zoom, Dropbox, Shopify, Adobe, Zendesk, Xero, Basecamp, Microsoft Teams, …) manually assessed across 250+ UX parameters.

- **"All sites in our benchmark feature a pricing page… The most common design used by nearly all sites is the plan matrix, which proved to be the most effective way to evaluate the type of subscription plan to buy during testing."**
- **"Most users that viewed the plan matrix page… required assistance to fully understand one or more of the features listed."** The average plan matrix contains **40 features**.
- Three named failures to avoid:
    1. **Not explaining or defining all features in the plan matrix.** The recommended remedy is a **tooltip or similar interactive element per feature** — because the matrix page is already very tall.
    2. **Not linking plan-matrix features to relevant content pages.** Link directly from the matrix row.
    3. **Truncating the full feature list** behind a "see more" link — users overlooked it and concluded the product lacked features. _"sites should simply avoid truncating the full list of plan matrix features."_
- Performance on **Plan Matrix**, **Page Types & Designs**, **Main Navigation**, and **Sign-Up & Account Management** was **"poor" to "mediocre"** for most benchmarked sites — while **Homepage** was mostly "decent", with more than half "perfect". Homepage UX is _not_ where SaaS sites fail.
- Integration links must appear in **three** places: main navigation, footer, and homepage.

**How to apply.**

- Show **all** features on all four tier cards; no "See all features" link.
- Make each feature row hover/focus-activatable (tooltip or expandable) rather than forcing a separate page — but the presenter's `tabular-nums`/`min-w-0` layout must not shift on reveal.
- If the Monthly/Yearly switch only changes the price numerals, say so explicitly near the toggle ("Hemat 20% per tahun") — Baymard's core finding is that _undifferentiated_ plan values are what stall evaluation.

### 1.5 Google / web.dev — Core Web Vitals (primary)

Source: _Web Vitals_, web.dev (Chrome team) — https://web.dev/articles/vitals

| Metric                     | "Good" threshold | Relevance to this page                                                                                                                                 |
| -------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **LCP** (loading)          | ≤ **2.5 s**      | Almost certainly the hero H1 text or the hero metric panel. Whichever paints first _is_ the LCP element — do not animate it in (see §1.2).             |
| **INP** (interactivity)    | ≤ **200 ms**     | Governs the pricing pill toggle and accordion open latency.                                                                                            |
| **CLS** (visual stability) | ≤ **0.1**        | Stat counters, accordions and the pricing switch must **reserve their final box**; no content may inject itself above existing content on interaction. |

Measure at the **75th percentile**, segmented mobile/desktop. The hero product-metric panel must have explicit dimensions (e.g. `aspect-[4/3]` or fixed `h-*`) so that late-loading imagery cannot shift the headline.

---

## 2. Component interaction specs (spec bodies)

### 2.1 FAQ — APG Accordion / Disclosure

**Primary:** https://www.w3.org/WAI/ARIA/apg/patterns/accordion/

Required roles / states / properties, verbatim from the pattern:

- Each accordion header title lives in an element with `role="button"`.
- Each header `button` is wrapped in an element with `role="heading"` carrying an `aria-level` matching the page's information architecture. If the host language has a native heading, use it. _"The `button` element is the only element inside the `heading` element."_
- `aria-expanded="true"` on the header button when the panel is visible, `"false"` when not.
- `aria-controls` on the header button = `id` of the element containing the panel content.
- `aria-disabled="true"` only if the implementation forbids collapsing.
- Optionally the panel container gets `role="region"` + `aria-labelledby`. **Avoid `region` when the accordion holds more than ~6 simultaneously-expandable panels** (landmark proliferation).

Keyboard (APG, Accordion): **Enter** and **Space** toggle. **Tab / Shift+Tab** move through all focusable elements in page order — accordion headers are _not_ a roving-tabindex composite.

**Simpler alternative — Disclosure pattern:** https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
APG ships a literal FAQ example at https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-faq/ using only `role="button"` + `aria-expanded` (no `heading` wrapper, no `region`). This is a legitimate reading for a short FAQ list; if you use it, every question must still be a real `<h3>` heading in the DOM for correct document outline.

**WCAG interaction note — 2.4.11 Focus Not Obscured (Minimum, AA).** APG-level keying does not cover this. The Understanding doc explicitly names **accordions** as a "user openable, persistent disclosure" that _can_ pass, and lists the pattern that does it:

> _"When the additional content appears, it **displaces existing content**. An accordion is an example of this. When an accordion is opened, the disclosed content shifts existing content further down the page. Since the new content does not obscure existing content, it cannot obscure the item with focus."_

**How to apply.** Use in-flow expansion (no overlay, no fixed panel) and ensure the item that receives focus after toggling is never under the sticky header — combine with `scroll-padding-top` (technique **C43**, §2.3).

**Implementation note.** `@radix-ui/react-accordion` is **not installed**. Either `pnpm dlx shadcn@latest add accordion` (it depends on `@radix-ui/react-collapsible`, which _is_ installed), or build the FAQ from the already-present `components/ui/collapsible.tsx` plus native headings.

### 2.2 Monthly/Yearly switch — there is **no APG "toggle-button group" pattern page**

`https://www.w3.org/WAI/ARIA/apg/practices/toggle-button/` returns **404**. APG has no standalone toggle-button-group pattern. The three relevant normative sources are:

**(a) APG Button Pattern — toggle button** — https://www.w3.org/WAI/ARIA/apg/patterns/button/

- _"Toggle button: A two-state button that can be either off (not pressed) or on (pressed)… specify a value for the attribute `aria-pressed`."_
- _"**Important:** it is critical the label on a toggle does not change when its state changes… if the design were to call for the button label to change from 'Mute' to 'Unmute', the `aria-pressed` attribute would not be needed."_

**(b) APG Tabs Pattern** — https://www.w3.org/WAI/ARIA/apg/patterns/tabs/

- Roles: `tablist` on the container, `tab` on each item, `tabpanel` on the panel; `aria-controls` on each tab; `aria-labelledby` on the panel; `aria-selected="true"` on the active tab and `"false"` on all others.
- `tablist` needs an accessible name (`aria-labelledby`, else `aria-label`).
- Keyboard: **Left/Right Arrow** (horizontal) move between tabs and wrap; **Space/Enter** activate if activation is manual; **Home/End** optional. Tab enters the tablist on the _active_ tab and leaves to the panel. Horizontal tablists do **not** bind Up/Down.
- Note 1: automatic activation on focus is recommended _only when panels are preloaded with no noticeable latency_ — which is exactly the pricing-toggle case.
- Note 4: if the tabpanel contains no focusable elements, give it `tabindex="0"`.

**(c) What Radix actually emits** — `node_modules/.pnpm/@radix-ui+react-toggle-grou@*/node_modules/@radix-ui/react-toggle-group/dist/index.mjs`:

```
type === "single"   → root: role="radiogroup"
type === "multiple" → root: role="toolbar"

item (single):   role="radio",  aria-checked={pressed}, aria-pressed={undefined}
item (multiple): inherits Toggle → aria-pressed
```

Roving focus defaults, from `ToggleGroupImpl`: `rovingFocus = true`, `loop = true`. Key map from `@radix-ui/react-roving-focus`:

```
ArrowLeft / ArrowUp   → prev
ArrowRight / ArrowDown→ next
PageUp / Home         → first
PageDown / End        → last
```

(Arrow keys swap meaning under `dir="rtl"`.) The group container gets `tabIndex={0}` when tabbing back out or when it contains no focusable items, and `style={{ outline: 'none' }}`.

**Decision for Repica.** Use `<ToggleGroup type="single" aria-label="Siklus penagihan">` with `ToggleGroupItem` values `"monthly" | "yearly"`. That yields `radiogroup` + `radio` + `aria-checked`, i.e. **mutually-exclusive selection semantics**, which is the truthful model for a two-way billing-period choice, and it gets arrow-key roving focus for free. Do **not** use `type="multiple"` — that yields `role="toolbar"` with `aria-pressed`, modelling independent on/off toggles, which is wrong here.
`type="single"` maps cleanly onto the APG radio-group model: one selected, arrow keys to move, Space/Enter to select. If the switch is later re-skinned as layered panels, move to the Tabs pattern.

**shadcn notes** — https://ui.shadcn.com/docs/components/radix/toggle-group

- The repo's local `resources/js/components/ui/toggle-group.tsx` is an **older** version: it has **no `spacing` prop**, whereas the current registry docs list `spacing` and a changelog entry dated 2026-05-17 changing the default from `0` to `2`. The local file already hardcodes the connected-pill look (`rounded-none first:rounded-l-md last:rounded-r-md`) — i.e. `spacing = 0` semantics. **Do not hand-edit `components/ui/*`** (project rule R-FE-002); re-run the shadcn CLI if you need the `spacing` prop.
- The switch group is a `radiogroup` composite → it **requires an accessible name**. Add `aria-label` (e.g. `"Siklus penagihan"`).

### 2.3 WCAG 2.2 success criteria — normative anchors

Spec: https://www.w3.org/TR/WCAG22/

| SC                                      | Level             | Normative text (abridged)                                                                                                                                                                             | Understanding doc                                                            | Implement note                                                                                                                                                                                                                                                                                                                                                                                                           |
| --------------------------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **1.4.1** Use of Color                  | **A**             | "Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element."                                                | https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html                | A hue+lightness difference reaching **3:1 contrast** counts as an additional visual distinction. Anything below that needs a second cue. Applies to the pricing toggle's selected state, "Paling Populer" badges, and status dots.                                                                                                                                                                                       |
| **1.4.3** Contrast (Minimum)            | **AA**            | 4.5:1 for text; **3:1** for large-scale text; exempt for pure decoration, inactive components, logotypes.                                                                                             | https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html            | Large-scale = ≥18 pt, or ≥14 pt bold (≈ 24 px / 18.5 px). Thresholds are **not rounded** — 4.499:1 fails. Applies to placeholder text and to text shown on hover and on keyboard focus.                                                                                                                                                                                                                                  |
| **1.4.11** Non-text Contrast            | **AA**            | ≥3:1 against adjacent colours for (a) UI components and (b) graphical objects required to understand content.                                                                                         | https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html           | Applies to the focus indicator, the toggle's selected pill border/fill, card borders, accordion chevron, and logo-strip marks. A control does **not** need a visible boundary if it has contrasting visible content. Inactive/disabled components are exempt. **Author-supplied hover effects need not reach 3:1**, but must not _reduce_ the component's own contrast. Gradients: measure the least contrasting region. |
| **2.4.7** Focus Visible                 | **AA**            | (unchanged in 2.2)                                                                                                                                                                                    | https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html               | Baseline for every interactive element on the page.                                                                                                                                                                                                                                                                                                                                                                      |
| **2.4.11** Focus Not Obscured (Minimum) | **AA**            | "When a user interface component receives keyboard focus, the component is not entirely hidden due to author-created content."                                                                        | https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html  | Names **sticky headers and sticky footers** as the typical offenders; failure **F110**. Remedy for this page: `scroll-padding-top` equal to the sticky header height (technique **C43**).                                                                                                                                                                                                                                |
| **2.4.13** Focus Appearance             | **AAA**           | The visible indicator must be at least the area of a **2 CSS px thick perimeter** of the unfocused component, **and** have ≥3:1 contrast **between the same pixels in focused and unfocused states**. | https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html            | Simplest compliant shape: a solid 2 px `outline` (optionally `outline-offset`). Area for a `w×h` rectangle = `4w + 4h`. Inset indicators must be ≥3 px. Failure **F78**: styling outlines/borders so the indicator becomes invisible. **Treat as AA-grade practice even though it is AAA** — it is cheap and it subsumes 1.4.11 for focus.                                                                               |
| **2.5.8** Target Size (Minimum)         | **AA**            | ≥**24 × 24 CSS px**, or pass the **spacing** exception: a 24 px-diameter circle centred on each target's bounding box must not intersect any other target or circle.                                  | https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html         | Five exceptions: spacing, equivalent control, inline-in-sentence, user-agent-determined, essential. Independent of zoom — cannot be satisfied by claiming "the user can zoom". Tailwind: `size-11` (44 px) on the pricing items and any icon button; nav links need `py-*`/`min-h-6` to reach 24 px of height.                                                                                                           |
| **2.3.3** Animation from Interactions   | **⚠ AAA, not AA** | "Motion animation triggered by interaction can be disabled, unless the animation is essential…"                                                                                                       | https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html | Level AAA. Sufficient techniques: **C39** (`prefers-reduced-motion` in CSS), SCR40, and a user preference setting. It names **parallax scrolling** explicitly as non-essential motion.                                                                                                                                                                                                                                   |
| **2.2.2** Pause, Stop, Hide             | **A**             | (auto-updating / auto-playing content)                                                                                                                                                                | https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html             | This — **not 2.3.3** — is the binding **Level A** obligation, and only for content that starts automatically and runs >5 s.                                                                                                                                                                                                                                                                                              |
| —                                       | —                 | Advisory technique **C15**: "Using CSS to change the presentation of a user interface component when it receives focus"                                                                               | https://www.w3.org/WAI/WCAG22/Techniques/css/C15                             | Relevant to 1.4.1: the focus ring is a permitted _supplementary_ cue.                                                                                                                                                                                                                                                                                                                                                    |

**Bottom line on the brief's assumption:** the brief lists 2.3.3 as if it were a hard requirement. It is **Level AAA**. Honour `prefers-reduced-motion` anyway (it is the C39 sufficient technique for 2.3.3, NN/g §5.2 asks for it, and the repo already implements it), but the conformance target for this page should be **A + AA**.

**1.4.11 focus-indicator subtlety worth internalising** (from the Understanding doc): Non-text Contrast measures the indicator against **adjacent colours in one state**; Focus Appearance (2.4.13) measures the **change between states**. An indicator can pass one and fail the other — both are shown as explicit ❌ figures in that document.

---

## 3. Tailwind CSS v4 (installed 4.3.3) — exact utility names and syntax

Sources: official docs `https://tailwindcss.com/docs/{theme,dark-mode,position}` plus the installed package source `node_modules/tailwindcss/theme.css` and `dist/lib.js`.

### 3.1 Max-width container

`max-w-*` is driven by the **`--container-*`** namespace, not `--max-width-*`. Docs table: _"`--container-*` → Container query variants like `@sm:*` and size utilities like `max-w-md`"_.

Default values, read from the installed `node_modules/tailwindcss/theme.css`:

```
--container-3xs: 16rem  256px     --container-lg:  32rem  512px
--container-2xs: 18rem  288px     --container-xl:  36rem  576px
--container-xs:  20rem  320px     --container-2xl: 42rem  672px
--container-sm:  24rem  384px     --container-3xl: 48rem  768px
--container-md:  28rem  448px     --container-4xl: 56rem  896px
                              --container-5xl: 64rem 1024px
                              --container-6xl: 72rem 1152px
                              --container-7xl: 80rem 1280px
```

There is also a literal `container` utility (`max-width` per breakpoint, plus `w-full` and `container-type: inline-size`). `@theme` can add a marketing token:

```css
@theme {
    --container-page: 75rem; /* → max-w-page */
    --container-prose: 42rem; /* → max-w-prose */
}
```

**How to apply.** Page shell: `mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8`. A 4-up tier grid at `max-w-6xl` (1152 px) gives ~264 px cards at `gap-6` — comfortable for a price + 7 check rows. Avoid `container` if you want the padding to be exactly controllable; it is `w-full` + per-breakpoint `max-width`, which fights a sticky-header inner container.

### 3.2 Responsive grid

`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`; arbitrary form `grid-cols-[repeat(auto-fit,minmax(16rem,1fr))]`. The same `--container-*` namespace also generates **container-query** variants (`@sm:`, `@min-sm:`, `@max-sm:`), and `@min-<n>` / `@max-<n>` **media-query** variants exist alongside the standard `sm: md: lg: xl: 2xl:` (defaults `40rem / 48rem / 64rem / 80rem / 96rem`, per `theme.css`).

Use plain media breakpoints for a marketing page. Container queries only pay off for a genuinely reusable card whose content changes independently of the viewport.

### 3.3 Sticky header

```
<header class="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
```

`sticky` maps to `position: sticky` and needs an offset utility — `top-0` — to trigger, per https://tailwindcss.com/docs/position. `sticky` is a static utility (not theme-driven), as is `top-0`.

The `backdrop-blur-*` utilities emit `backdrop-filter`, not `filter`. Progressive enhancement is `supports-[backdrop-filter]:bg-background/80` — otherwise `bg-background/80` alone leaves a translucent bar on browsers without `backdrop-filter`.

**WCAG 2.4.11 pairing:** put `scroll-mt-*` on in-page anchor targets, or `scroll-pt-*`/`scroll-py-*` on the scrolling container, matching the header height.

### 3.4 `dark:` variant — ⚠ the repo's override is narrower than Tailwind's

Default (official docs): `r("dark", ["@media (prefers-color-scheme: dark)"])` — confirmed in the installed `dist/lib.js`.

To drive dark mode from a class, the docs specify:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

`resources/css/app.css` currently has:

```css
@custom-variant dark (&:is(.dark *));
```

`&:is(.dark *)` matches **descendants of** `.dark` only — it does **not** match the `.dark` element itself. Consequence: a `dark:*` utility placed directly on `<html class="dark">` or on `<body>` will not apply. Anything on `page.tsx` or below is fine, but this is a real trap when styling the header or `body`. Either switch to the documented `&:where(.dark, .dark *)`, or keep the existing override and never place `dark:*` on the root/body elements. Data-attribute form: `@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));`.

### 3.5 `@theme` tokens

Docs: https://tailwindcss.com/docs/theme. `@theme` variables _generate utilities_; `:root` variables do not. That is the reason to use `@theme` over `:root` for anything with a utility counterpart.

Full namespace table (docs): `--color-*`, `--font-*`, `--text-*`, `--font-weight-*`, `--tracking-*`, `--leading-*`, `--tab-size-*`, `--breakpoint-*`, `--container-*`, `--spacing-*`, `--radius-*`, `--shadow-*`, `--inset-shadow-*`, `--drop-shadow-*`, `--blur-*`, `--perspective-*`, `--zoom-*`, `--aspect-*`, `--ease-*`, `--animate-*`.

Modifying forms documented: **extend** (redefine one variable), **override** (redefine a default's value), **wipe a namespace** with `--color-*: initial`, **wipe everything** with `--*: initial`; plus `@theme inline` (when the value is `var()` of another variable) and `@theme static` (emit all variables, not just used ones).

Already present in `resources/css/app.css` and available as utilities: `--color-brand-50/700/900`, `--radius-card`, `--text-display-1/2/3` (with `--line-height`), the full shadcn `--color-*` bridge, and `--font-sans` = Plus Jakarta Sans.

### 3.6 Scroll-driven animations — **not a Tailwind feature**

Verified by scanning every `.js`/`.css` file in `node_modules/tailwindcss`: **zero occurrences of `animation-timeline`, `view-timeline`, `animation-range`, or `scroll-timeline`.** Tailwind v4.3 ships no `animation-timeline` utility and no docs page for it. Supported routes, all first-party:

1. **Arbitrary properties** — `class="[animation-timeline:view()] [animation-range:entry_0%_entry_35%]"`. Underscores become spaces.
2. **`supports-[…]` variant** — `supports-[animation-timeline:view()]:…` for progressive enhancement.
3. **`@utility` in CSS** — **this repo already does it.** `resources/css/app.css` defines `@keyframes reveal-up` + `@utility reveal { animation: reveal-up both; animation-timeline: view(); animation-range: entry 0% entry 35%; }`, followed by a plain `@media (prefers-reduced-motion: reduce) { .reveal { animation: none } }`. The in-repo comment records why: _"`@utility` tidak boleh bersarang di dalam media query"_.
4. **Reduced-motion variants** (both present in 4.3.3, verified in `dist/lib.js`):
    ```
    r("motion-safe",  ["@media (prefers-reduced-motion: no-preference)"])
    r("motion-reduce", ["@media (prefers-reduced-motion: reduce)"])
    ```
    i.e. `motion-safe:animate-[reveal-up_…]` / `motion-reduce:transition-none`. These are the clean way to do the opt-in on the utility side, and they let you keep `reveal` scoped to below-fold content.

**Browser support is not the gate here — WCAG is.** `animation-timeline` is Baseline-available in current Chrome/Edge/Safari/Firefox, but the repo's decision (documented in `DESIGN-BRIEF §10 a11y`) already accepted it _because_ it ships a `prefers-reduced-motion` escape hatch. Keep that escape hatch. Wrap the `animation-timeline` declarations so browsers without support simply render the element in its **final** state (`animation-fill-mode: both` already does this for the `reveal` utility: without a timeline the animation never runs and the element stays at its `to` state).

### 3.7 Other variants confirmed present in 4.3.3

From `node_modules/tailwindcss/dist/lib.js`: `hover`, `focus`, `focus-visible`, `focus-within`, `active`, `disabled`, `enabled`, `inert`, `checked`, `indeterminate`, `default`, `invalid`, `placeholder`, `placeholder-shown`, `autofill`, `read-only`, `required`, `open`, `first`/`last`/`only`/`odd`/`even`/`nth-*`, `visited`, `target`, `file`, `marker`, `selection`, `before`/`after`, `backdrop`, `details-content`; compound `group-*`, `peer-*`, `not-*`, `in-*`, `has-*`; functional `aria-*`, `data-*`, `supports-*`; media `portrait`, `landscape`, `ltr`, `rtl`, `dark`, `starting`, `print`, `forced-colors`, `inverted-colors`, `pointer-none/coarse/fine`, `any-pointer-*`, `noscript`, `motion-safe`, `motion-reduce`, `contrast-more`, `contrast-less`; plus `@min-*`, `@max-*`, `@<container>`, `min-*`, `max-*`.

`aria-*` is value-driven — `aria-expanded:bg-brand-700` compiles to `[aria-expanded="true"]`, not `[aria-expanded]` (per the source's `on()` helper). Available `aria-*` suggestions: `busy, checked, disabled, expanded, hidden, pressed, readonly, required, selected`. The pricing-toggle selected state is therefore styleable as `aria-checked:bg-brand-700`.

---

## 4. shadcn/ui + Inertia v3 + Wayfinder

### 4.1 The documented rule

Inertia v3 docs, _Links_ → §Wayfinder (source: `https://github.com/inertiajs/docs/blob/main/v3/the-basics/links.mdx`, rendered at `https://inertiajs.com/docs/v3/the-basics/links`):

> "When using **Wayfinder** in conjunction with the `Link` component, you can simply **pass the resulting object directly to the `href` prop**. The `Link` will infer the HTTP method and URL directly from the Wayfinder object."
>
> ```jsx
> import { Link } from '@inertiajs/react';
> import { show } from 'App/Http/Controllers/UserController';
>
> <Link href={show(1)}>John Doe</Link>;
> ```

### 4.2 Why it type-checks — the type contract

From `node_modules/.pnpm/@inertiajs+core@3.9.1/.../types/types.d.ts`:

```ts
export type UrlMethodPair = { url: string; method: Method; component?: string | Record<string,string> };
export interface LinkComponentBaseProps extends … {
    href: string | UrlMethodPair;
    // …
}
```

And the runtime discriminator, `dist/index.js`:

```js
function isUrlMethodPair(href) {
  return href !== null && typeof href === "object" && href !== undefined && "url" in href && "method" in href;
}
function resolveUrlMethodPairComponent(pair) { … }   // only for instant visits
```

This repo's generated helpers (`resources/js/routes/index.ts`, enabled by `wayfinder({ formVariants: true })`) already satisfy it exactly:

```ts
export const login = (options?): RouteDefinition<'get'> => ({ url: login.url(options), method: 'get' })
login.url  = (options?) => …  // → string
login.get  = (options?) => …  // → RouteDefinition<'get'>
login.form = loginForm         // → RouteFormDefinition<'get'>
```

`RouteDefinition<T> = { url: string } & (T extends Method[] ? {methods:T} : {method:T})`; `RouteFormDefinition<T> = { action: string; method: T }`.

### 4.3 Verdict + the two real gotchas

| Form                                          | `Link href`                               | Correct?                                                                                                                                                                                                                                                                                                 |
| --------------------------------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `login()`                                     | `{ url, method }`                         | ✅ **Correct.** Idiomatic Inertia v3 + Wayfinder. Already used in this repo: `app-sidebar.tsx:47`, `user-menu-content.tsx:39,52`, `app-header.tsx:138`.                                                                                                                                                  |
| `login({ query: { page: 2 } })`               | `{ url: '/login?page=2', method: 'get' }` | ✅ Correct — query params must go in the _options_ argument, not in `href`.                                                                                                                                                                                                                              |
| `login.url()`                                 | `'/login'`                                | ✅ Valid (`string` branch). You lose method inference — fine for GET, wrong for POST/DELETE.                                                                                                                                                                                                             |
| **`login.form()`**                            | `{ action, method }`                      | ❌ **Gotcha 1.** There is **no `url` key**, so `isUrlMethodPair()` is `false` and `href` will be structurally wrong / type-errored. `.form*` helpers are for **`<Form action={…}>`** (shadcn `<Form>` / Inertia `<Form>`) or a native `<form action={…} method="post">`. Never pass them to `Link href`. |
| **Plain `<a href={login()}>`**                | object → `[object Object]`                | ❌ **Gotcha 2.** Outside `<Link>` there is no resolver. Passing a Wayfinder object to a raw anchor, or to anything typed `string` (e.g. `router.visit`, `window.location`, `redirect()`), will not work. Use `.url()` in those positions.                                                                |
| `href="https://…"` / `"tel:…"` / `"mailto:…"` | string                                    | ✅ Use plain strings for anything external or non-HTTP.                                                                                                                                                                                                                                                  |

Also from the same v3 docs page: Inertia renders `<a>` by default, and **automatically renders a `<button>` for POST/PUT/PATCH/DELETE** because anchor links issuing those methods break "Open Link in New Tab". For the marketing page, all CTAs are GET navigations to `register`/`login`, so `href={register}` / `href={login}` with the bare call is correct.

### 4.4 shadcn/ui pieces

- **Accordion** — not installed. `pnpm dlx shadcn@latest add accordion`. The official docs page ships a **pricing-FAQ accordion inside a `<Card>`** ("Subscription & Billing" / "What subscription plans do you offer?" / "How does billing work?" / "How do I cancel my subscription?") — https://ui.shadcn.com/docs/components/radix/accordion. That is a direct template for the "All Your Questions, Answered" band.
- **ToggleGroup** — installed, and the local file already produces a joined pill (`rounded-none first:rounded-l-md last:rounded-r-md`, no gap). Use `type="single"` + `aria-label` (§2.2).
- **Tabs** — alternative if the Monthly/Yearly switch ever grows more than two states; `components/ui/tabs` is not currently installed.
- Per project rule R-FE-002, `resources/js/components/ui/*` is **generated by the shadcn CLI and must not be hand-edited**; the version drift in §2.2 is resolved by re-running the CLI, not by patching the file.

---

## 5. First-party competitive check — observable structure only

Live pages fetched 2026-10-16. Structure as rendered; no quality judgements.

### 5.1 Laundrify OS — https://aplikasi.laundry.co.id/

Closest structural match to the brief.

**Nav:** logo left; three dropdown groups (`Aplikasi POS & ERP Laundry`, `1st Laundry Marketplace`, `Laundry Indonesia Network`, `About Us`); `FAQ` as a top-level item; two right-side CTAs — `WhatsApp` (outline) and `Demo Gratis` (filled).

**Order:** hero (eyebrow "Untuk owner laundry yang ingin omzet naik tanpa operasional berantakan" → H1 → paragraph → 4-tick checklist → 2 CTAs) → **stat band** (500+ / 50K+ / 99.9%) → **embedded dashboard screenshot** rendered as a live-looking panel containing 137 order masuk, Omzet Rp 82,4 jt, +18% vs bulan lalu, Margin kotor 71%, Cabang aktif 4, then an "Insight prioritas" list and an "Aktivitas terbaru" list → persona-selector table (Jenis akun / Cocok untuk) → Google Play badge + social share row → **"Masalah Utama"** 3-up numbered problem band (01/02/03) → **"Apa yang Didapat"** 4-up value band → **"Visual Produk"** 3-up alternating screenshot+caption band (Dashboard / Insight / Stok), each with its own CTA → **"Cara Mulai"** 3-step numbered band → **pricing**, 4 cards (`Paket Lite` Rp 35.000/bln, `Subscription Basic` Rp 150.000/bln marked **"Paling Populer"**, `Multi Outlet` Rp 300.000/bln, `Lifetime` = "WhatsApp Me" instead of a price) → **FAQ** as 5 collapsed disclosure rows → **closing CTA band** with 2 CTAs → footer with 6 anchor links.

**Pricing presentation:** card-per-tier (not a comparison matrix), each card = name, one-line audience, price + `/bulan`, description, ✓ feature list, one CTA. Higher tiers repeat lower-tier features with "Semua fitur …". **No Monthly/Yearly toggle.** No client logos; the trust surface is a Google Play badge and the stat band.
**Trust signals:** 500+ laundry aktif / 50K+ transaksi per bulan / 99.9% uptime; live dashboard figures; `+18% vs bulan lalu`.

### 5.2 LAMAN — https://laundrymanajemen.com/

**Nav:** logo left; 5 anchors (`Fitur`, `Cara Kerja`, `Testimoni`, `Harga`, `FAQ`); 2 CTAs right (`Lihat Harga`, `Coba Gratis`).

**Order:** hero (H1 + paragraph + 2 CTAs + reassurance line "Tanpa kartu kredit") → **product-metric card** styled as a receipt: `Laba naik 18% / Lunas ✓`, line items (`Cuci Kering Lipat 5kg Rp26.500`, `Antar (2.4km) Rp6.000`, `Estimasi 3 hari`, `Total Rp32.500`) → 6 reassurance bullets → **"Masalah yang sering terjadi"** 3-up band, each item a quoted owner complaint → **"Semua dalam satu aplikasi"** 6-up feature grid → **"Lihat Langsung"** 3-up screenshot band → testimonials → **pricing 3 cards** (`Rintisan` Rp99rb/bln · 1 cabang; `Berkembang` Rp199rb/bln · 5 cabang marked "Paling Laris"; `Jaringan` Rp399rb/bln) → FAQ (2 rows) → trial CTA → footer.

**Pricing presentation:** 3 cards, price + `per bulan · N cabang`, identical "Semua fitur lengkap" statement on every card with only the branch count differing, then 3 differentiated bullets. Explicit _"Tanpa fitur yang dikunci di paket murah."_ **No Monthly/Yearly toggle.**
**Trust signals:** 14-day trial with no credit card; "Support langsung via WhatsApp"; receipt-style metric panel.

### 5.3 Kasgo Laundry — https://kasgo.id/laundry

**Nav:** logo left; 7 anchors (`Video`, `Kenapa Laundry`, `Cara Kerja`, `Fitur`, `Sewa vs Beli`, `Harga`, `FAQ`); `Chat WhatsApp` CTA.

**Order:** hero (badge `LAUNDRY KILOAN & SATUAN`, H1, paragraph, price-with-strikethrough CTA `Rp 250.000` → `Rp 155.000`, secondary WhatsApp CTA) → **inline stat triple** (`Rp 0 / BIAYA BULANAN`, `100% / JALAN OFFLINE`, `∞ / PRODUK & NOTA`) → **screenshot with live status readout** (`KASGO LAUNDRY / Status cucian pelanggan / OFFLINE`) → **video-demo section** with 4 timestamped chapters → **"Masalah harian laundry"** 3-up band, each item formatted `PROBLEM` / `DI KASGO LAUNDRY` (a two-row problem→answer pair) → **"Sehari di laundry"** 5-step numbered flow → **"Isi aplikasi"** laundry-specific features + a shared "Fitur dasar" checklist → **"Sewa vs Beli"** 2-column comparison with a 3-year cost table (Year 1/2/3) → **pricing** single price + 4-step "Yang Anda terima setelah pembayaran" → 3 testimonials → **FAQ** as 6 collapsed rows → closing CTA → footer with variant links, hours, and a payment-logos row (Midtrans, QRIS, GoPay, BNI, BRI, Mandiri, CIMB, Permata).

**Pricing presentation:** single one-time price, no tiers, no toggle. The comparison is **subscription-vs-lifetime over 3 years** rather than tier-vs-tier.
**Trust signals:** 3 named testimonials with business names and cities; 4.9★/1.200+ reviews referenced on the sibling POS page; explicit payment-provider logos; stated hardware/OS requirement (`Android 10 atau lebih baru`); licence terms (`1 HP · pindah device pakai backup`).

### 5.4 Smartlink — https://smartlink.id/

**Nav:** logo left; 4 anchors (`Beranda`, `Fitur`, `Biaya`, `Artikel`); `Coba Gratis` CTA.

**Order:** hero (H1 `Revolusi Bisnis Laundry` + subtitle, 2 CTAs `Coba Gratis` / `Ajakan Demo`) → product screenshot → **"Seluruh Manajemen Terintegrasi Dalam Genggaman"** 5-slide carousel with per-slide screenshot + heading + description, each duplicated as a static benefit row → **"Bisnis Lebih Optimal Dengan Fitur Unggulan"** 8-up feature grid with icon tiles → **"Testimonial Pengusaha Laundry"** 5-slide carousel, each quote attributed to a named owner + business + city, with a YouTube link → **"Biaya Pokok Smartlink"** 3 cards (`Biaya Aktivasi` Rp 1.250.000 for life; `Biaya Deposit` Rp 1/Koin; `Biaya Transaksi` 100 Koin per nota) → **"Biaya Opsional"** per-feature add-on list → **closing CTA band** with the trial promise (30 days + 20.000 coin) → footer with legal entity, address, and Play Store badge.

**Pricing presentation:** a **cost-component breakdown**, not tiers — one-off activation fee + prepaid deposit + per-transaction cost, each its own card, then a separate add-on list. **No Monthly/Yearly toggle.**
**Trust signals:** 5 testimonials with real business names and cities, several stating a start year ("Sejak 2016"); company legal name and physical address in the footer.

### 5.5 What all four share — and what none of them do

Observed in all four: left-aligned hero text with the product visual on the right; 2 CTAs in the hero; a problem/pain band before the feature band; a screenshot band with per-item captions; tiered or component pricing as the page's centre of gravity; an FAQ accordion near the bottom; a full-width closing CTA; testimonials; a footer carrying navigation links.

**None of the four uses a Monthly/Yearly billing toggle, none has a client-logo "trusted by" strip, and none has an integrations logo grid.** The Monthly/Yearly switch and the integrations band are therefore **differentiators relative to the local competitive set**, not table stakes — and Baymard's evidence (§1.4) says a _plan matrix with complete, defined features_ is what actually moves SaaS plan selection, so the toggle must not come at the cost of feature completeness.

---

## Normative checklist

Testable items. Every line traces to a source above.

### Contrast and colour

- [ ] All body and small text meets **4.5:1** against its actual background in **both** themes (`1.4.3`).
- [ ] Text ≥24 px (or ≥18.5 px bold) meets **≥3:1** (`1.4.3`, large-scale).
- [ ] Contrast ratios are computed **unrounded** — 4.499:1 fails (`1.4.3`).
- [ ] Every specified `color`/`background-color` pair has both sides specified; a missing background defaults to white and fails (`1.4.3`).
- [ ] Selected/active states, focus rings, card borders, accordion chevrons, and logo-strip marks meet **≥3:1** against adjacent colours (`1.4.11`).
- [ ] No information is conveyed by hue alone — the pricing toggle's selected state, status dots, and "Paling Populer" badges each carry a second cue (shape, weight, icon, or text). A hue+lightness difference reaching 3:1 is acceptable as the "second cue" (`1.4.1`).
- [ ] Hover treatments do **not** reduce a component's own contrast against its background (`1.4.11`).
- [ ] Gradients and the tinted CTA band: measure the least-contrast region; any text on it still hits 4.5:1 (`1.4.3`, `1.4.11`).

### Focus

- [ ] Every interactive element has a visible focus indicator (`2.4.7`).
- [ ] The focus indicator is a solid **≥2 px** outline, meeting the area of a 2 px perimeter of the component (`4w + 4h` for a rectangle) and a **≥3:1 change of contrast** between focused and unfocused states (`2.4.13`, AAA — treated as AA practice).
- [ ] No element or ancestor sets `outline: none` on focusable elements (failure `F78`).
- [ ] Tabbing from the top never puts a focused control **entirely** behind the sticky header or footer; verified by tabbing the whole page at 360 px, 768 px, 1280 px and 200% zoom (`2.4.11`, failure `F110`).
- [ ] In-page anchor targets carry `scroll-mt-*` (or the container carries `scroll-pt-*`) equal to the sticky header height (`2.4.11`, technique `C43`).

### Target size

- [ ] Every pointer target is **≥24 × 24 CSS px**, or satisfies the 24 px-circle spacing rule (`2.5.8`).
- [ ] Nav links, footer links, and the pricing-toggle items are each ≥24 px tall (Tailwind: `min-h-6` or equivalent padding).
- [ ] Checked at 200% zoom as well — the criterion is zoom-independent (`2.5.8`).
- [ ] Spacing between adjacent top-bar icons and between toggle items is sufficient that no 24 px circles intersect (`2.5.8`).

### FAQ accordion (APG Accordion / Disclosure)

- [ ] Each question is wrapped in an element with `role="heading"` and an `aria-level` matching the page outline, and the trigger `button` is the **only** child of that heading (APG Accordion).
- [ ] Trigger has `aria-expanded="true"` when open, `"false"` when closed (`APG Accordion`).
- [ ] Trigger has `aria-controls` pointing at the panel element's real `id` (`APG Accordion`).
- [ ] Enter and Space toggle each item (`APG Accordion` / `APG Disclosure`).
- [ ] Every focusable element inside the accordion is in the normal Tab sequence — headers are **not** a roving-tabindex composite (`APG Accordion`).
- [ ] If `role="region"` is used on panels, the accordion has **≤6** simultaneously-expandable panels (`APG Accordion`, landmark-proliferation note).
- [ ] Expansion is in-flow (content is displaced, not overlaid), so it cannot obscure the focused item (`2.4.11`).
- [ ] Closing an item returns focus somewhere visible, and long answers scroll into view rather than expanding past the viewport (`2.4.11`).

### Monthly/Yearly toggle

- [ ] Root is `<ToggleGroup type="single">` → emits `role="radiogroup"`; items emit `role="radio"` + `aria-checked` (verified in `@radix-ui/react-toggle-group@1.1.x` source).
- [ ] The `radiogroup` has an accessible name (`aria-label="Siklus penagihan"`).
- [ ] Exactly one item is checked at all times, including the initial render — pass an explicit `value`, never leave it `undefined`.
- [ ] Left/Right Arrow move between the two items and **wrap**; the group is a **single Tab stop** (roving focus, `loop = true` — verified in `@radix-ui/react-roving-focus` source).
- [ ] Space/Enter selects the focused item.
- [ ] Item labels ("Bulanan" / "Tahunan") are **static** — they do not change with state; state is exposed via `aria-checked` only (`APG Button`, toggle-button note).
- [ ] The switch **only** changes price numerals/period labels; the full feature list stays identical and complete — no truncation behind "See more" (Baymard pitfall 3).
- [ ] Any feature-dependent discount is stated in text near the switch, not implied by colour.
- [ ] Switching the period does not shift layout (reserve the widest price string's box) — `CLS ≤ 0.1`.

### Motion

- [ ] `reveal` (scroll-driven) is **not** applied to the hero H1, subhead, CTAs, logo, or pricing toggle (NN/g §5.3: scroll-triggered text animations delay users).
- [ ] The hero LCP element is not animated in at all (LCP ≤ 2.5 s).
- [ ] `@media (prefers-reduced-motion: reduce)` disables every non-essential animation, including `reveal`, stat counters, and any parallax (`2.3.3` technique **C39**; repo already ships this for `reveal` — verify it also covers anything new).
- [ ] No autoplaying video, auto-forwarding carousel, or scrolljacking (`2.2.2` Level A; NN/g §5.2).
- [ ] `reveal` degrades to the element's **final** state in browsers without `animation-timeline` support (verify `animation-fill-mode: both`; wrap in `supports-[animation-timeline:view()]:` if in doubt).

### Structure and performance

- [ ] Logo is in the **top-left** of the header; not centred (NN/g 2.1).
- [ ] H1 is a single scannable line stating what the product does — no "welcome" filler (NN/g 2.2).
- [ ] Both hero CTAs and their labels are visible in the first viewport, in the **left half** (NN/g: 69% of gaze is left-of-centre; 57% above the fold).
- [ ] The hero has a visible cue that content continues below — no false floor (NN/g §3.1).
- [ ] Primary nav is reachable without a menu toggle at `md` and up (NN/g §4.3).
- [ ] The hero visual is a real product/metric state, not decorative stock imagery (NN/g §2.4).
- [ ] Footer carries **Integrations, Pricing, and FAQ** links, not only social links (Baymard: footer is where users instinctively look).
- [ ] Integrations are also reachable from the homepage band **and** the main navigation (Baymard's three required locations).
- [ ] Every plan-matrix feature is either self-explanatory, has a hover/focus-activated explanation, or links to a detail page (Baymard pitfall 1 & 2).
- [ ] No element is injected into the document flow above existing content on interaction (accordion, toggle) — `CLS ≤ 0.1`.
- [ ] Interactivity on toggle/accordion responds within **INP ≤ 200 ms**.
