# Build Spec — Joseph "Ace" Orji · Personal Portfolio

**Version** 1.4 (§11/§14 motion-strategy decision recorded 2026-08-14; v1.3 folded content amendment v3: UWA unarchived, Nexaflex added, Leadership News held, project links, §7.2 lane amendment; retains the v1.1 §13 CSP decision) · **Owner** Joseph Orji (Ace) · **Intended executor** Claude Code
**Deliverable** A production-quality, fully responsive personal portfolio site, runnable locally and deployable to Vercel.

---

## 0. How to use this document

This spec is written to be executed section by section. Work in the order given in §20 (Build Order). Do not skip §5 (Design System) — every colour, size and easing value in later sections refers to a token defined there.

Three standing rules for the executor:

1. **No placeholder lorem.** All copy comes from §9 (Content Model) or is written to the voice rules in §5.7. Where a fact is missing it is marked `⚠ NEEDS INPUT` — surface those as a checklist at the end of the build rather than inventing values.
2. **Content is data, not markup.** Projects, roles and timeline entries live in typed content files. No hardcoded project markup in page components.
3. **Ship the quality floor silently.** Responsive to 320px, visible keyboard focus, `prefers-reduced-motion` respected, no layout shift. These are not features to announce; they are pass/fail.

---

## 1. Brief

### 1.1 What this is

A single site that presents two parallel bodies of work in one honest chronology:

- **Engineering** — 7+ years and 17 shipped products, from a solo build at CheckNCommit in 2019 to concurrent lead-engineer contracts across Nigeria, the US, Canada, the UK and Dubai, delivered remotely under **Brains Digital Software Technology**.
- **Zowis Fashion Limited** — a women's fashion brand founded and operated by the same person, with its own e-commerce and technical infrastructure.

The site's thesis is that these are not two careers awkwardly stapled together. They are one operator who builds product, ships it, and runs the business around it.

### 1.2 Audiences, in priority order

| # | Audience | What they need in 15 seconds | What they need in 3 minutes |
|---|---|---|---|
| 1 | International recruiters / hiring managers for remote contract roles | Role, stack, availability, proof of shipped scale | Depth on 2–3 engagements, dates, metrics, how to book a call |
| 2 | Founders / agencies hiring a lead mobile engineer | Can he own a mobile product end to end? | Architecture decisions, integrations, delivery record |
| 3 | Zowis stakeholders — retail partners, press, collaborators | That Zowis is a real brand with a real operator | Brand story, product, where to buy |
| 4 | Peer engineers | Open source, technical writing | Package docs, install commands |

**Design consequence:** audience 1 and audience 3 want different things and should never have to scroll past each other. The site therefore uses a **track system** (§7) rather than one flat feed.

### 1.3 A specific decision to make early

Ace keeps Zowis off his freelance/contractor profiles — it's his personal business, deliberately separated from contract engineering. This site merges them, which is the right call for a personal domain, but the separation still needs to be operationally available.

**Resolution built into this spec:** the work index supports a shareable filtered URL (`/work?track=engineering`). Sending a recruiter that link produces an engineering-only view with no Zowis content above the fold, while the canonical `/` remains the full picture. This is a routing requirement, not a nice-to-have — see §10.3.

### 1.4 Non-goals

- No blog at v1. The route is reserved and the content model supports it (§9.6), but nothing ships in it.
- No dark mode at v1. The site is light-only and declares it (§5.1). Do not build a toggle.
- No e-commerce. Zowis product tiles link out to the Zowis store.
- No CMS at v1. Content is typed files in the repo. §12.7 covers the migration path if that changes.

---

## 2. Acceptance criteria

The build is done when all of the following are true.

**Functional**
- [ ] All routes in §8 render, including `404` and `/work/[slug]` for every project in the content file.
- [ ] Track filter works, is URL-driven, is shareable, and survives a page refresh and a back-button press.
- [ ] Contact form sends a real email, handles failure visibly, and cannot be spammed (§12.1).
- [ ] Every external link opens correctly; no dead internal links (§18 link check).

**Design**
- [ ] Renders correctly at 320, 375, 768, 1024, 1440 and 1920px with no horizontal overflow at any width.
- [ ] Matches the token system in §5 exactly — no off-token hex values, font sizes or spacing anywhere in the CSS.
- [ ] The Career Spine (§7) renders overlapping engagements as visually parallel, not stacked sequentially.

**Quality**
- [ ] Lighthouse mobile: Performance ≥ 92, Accessibility 100, Best Practices ≥ 95, SEO 100.
- [ ] CLS < 0.05, LCP < 2.0s on simulated Fast 3G.
- [ ] Zero axe-core violations on every route.
- [ ] Full keyboard traversal of every interactive element with a visible focus ring.
- [ ] With JavaScript disabled, all content is still readable and all links work.
- [ ] With `prefers-reduced-motion: reduce`, no transforms, no parallax, no marquee movement, no counters.

---

## 3. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15, App Router, TypeScript strict** | Server components keep JS payload small; route handlers give a backend without a second service; `next/og` for social cards. |
| Styling | **Tailwind CSS v4** with a CSS-first `@theme` token block | Tokens defined once as CSS custom properties, consumed by both Tailwind utilities and raw CSS. |
| Primitives | **Radix UI** (Dialog, Accordion, Tabs, Toast) | Accessibility handled correctly at the primitive layer. |
| Motion | **Motion for React** (`motion/react`) | Scroll-linked reveals and layout animations. Must be imported per-component, never globally. |
| Smooth scroll | **Lenis**, damping only | See §11.5 for the hard constraints. If it fights iOS Safari, cut it — it is the first thing to drop. |
| Fonts | `next/font` — **Bricolage Grotesque** (display), **Geist Sans** (body), **Geist Mono** (utility) | Self-hosted, zero layout shift, no third-party request. |
| Icons | **Lucide React**, tree-shaken imports | |
| Content | Typed TS modules in `/content`, MDX only for long-form case study bodies | No CMS dependency, no build-time API calls for core content. |
| Forms | React Hook Form + Zod, shared schema client and server | One schema, validated in both places. |
| Email | **Resend** | |
| Bot defence | Honeypot + timing check + Cloudflare Turnstile | §12.1 |
| Rate limit | Upstash Redis, or in-memory LRU if Redis is not provisioned | Must degrade, not crash. |
| Analytics | **Plausible** or Vercel Analytics — one, not both | No cookie banner required with Plausible. |
| Hosting | **Vercel** | |
| Package manager | pnpm | |

**Explicitly rejected:** any UI kit that ships a whole design language (Chakra, MUI). This site's value is that it does not look like a template.

---

## 4. Repository structure

```
portfolio/
├─ app/
│  ├─ layout.tsx                 # fonts, <html lang="en" class="light">, skip link, analytics
│  ├─ page.tsx                   # home
│  ├─ work/
│  │  ├─ page.tsx                # index + track filter (reads searchParams)
│  │  └─ [slug]/page.tsx         # case study
│  ├─ zowis/page.tsx
│  ├─ about/page.tsx
│  ├─ lab/page.tsx               # open source + experiments
│  ├─ contact/page.tsx
│  ├─ api/
│  │  ├─ contact/route.ts
│  │  └─ revalidate/route.ts     # optional, secret-guarded
│  ├─ opengraph-image.tsx
│  ├─ not-found.tsx
│  ├─ robots.ts
│  └─ sitemap.ts
├─ components/
│  ├─ layout/      Header, Footer, Container, Section, SkipLink
│  ├─ ui/          Button, Tag, Eyebrow, Marquee, Counter, Field, Toast
│  ├─ work/        SpineTimeline, SpineEntry, TrackFilter, ProjectCard, MetricRow, StackList
│  ├─ zowis/       LookbookGrid, BrandStory, ProductTile
│  └─ motion/      Reveal, TextReveal, MagneticCTA
├─ content/
│  ├─ projects.ts        # single source of truth for all work
│  ├─ timeline.ts        # derived + non-project life events
│  ├─ packages.ts        # npm packages
│  ├─ profile.ts         # bio, metrics, socials, availability
│  └─ case-studies/*.mdx
├─ lib/
│  ├─ tokens.ts          # TS mirror of design tokens for motion values
│  ├─ schema.ts          # zod schemas
│  ├─ dates.ts           # range formatting, overlap detection, sorting
│  ├─ npm.ts             # download-count fetcher
│  └─ zowis.ts           # optional Supabase read
├─ public/
│  ├─ images/work/…      # AVIF + WebP, 2 densities
│  ├─ ace-orji-cv.pdf
│  └─ og/
├─ styles/globals.css    # @theme token block, base layer, focus styles
├─ tests/                # playwright + axe
├─ .env.example
└─ README.md
```

---

## 5. Design system

The reference sites (Mercket, Scalient, Ritovex, Swiftform, Franco, Rekolet, Saleunion, Adspark, Consult Pro) share a consistent grammar. What to take, and what to leave:

**Take:** the eyebrow-label + oversized headline pairing; generous vertical rhythm with sections that breathe; horizontal logo/keyword marquees; animated numeric counters for proof metrics; card grids with hover state changes; a large-type footer that doubles as navigation; sticky-ish scroll sequences where each item reveals in turn.

**Leave:** the agency plural voice ("we build experiences"), the stock-photo team grids, the fake testimonial carousels, the decorative `{01}` numbering applied to non-sequential content, and the "trusted by 1000+ clients" logo wall of unrelated brands. This site is one person and every claim on it must be true.

### 5.1 Colour

White background is the brief. The palette is built from a near-black ink on white with **two accent tracks** — the accents are not decoration, they encode which body of work you are looking at.

```css
@theme {
  /* Canvas */
  --color-paper:      #FFFFFF;  /* page background, always */
  --color-mist:       #F4F5F7;  /* alternating section panels, cards at rest */
  --color-fog:        #ECEEF1;  /* input fills, image placeholders */
  --color-hairline:   #E2E5E9;  /* 1px rules, card borders */

  /* Ink */
  --color-ink:        #0C0D10;  /* headings, primary text */
  --color-graphite:   #4E545C;  /* body copy */
  --color-slate:      #838A93;  /* captions, meta, disabled */

  /* Track accents */
  --color-signal:     #1B3BE8;  /* engineering track */
  --color-signal-sub: #E8ECFE;  /* engineering tint fill */
  --color-plum:       #7A2E4E;  /* Zowis / founder track */
  --color-plum-sub:   #F7ECF1;  /* Zowis tint fill */

  /* State */
  --color-success:    #147A4B;
  --color-danger:     #B3261E;
  --color-focus:      #1B3BE8;
}
```

Rules:
- Ink on paper is the default for everything. Accent is used at roughly **3% of visible surface area** — links, one word in a headline, the spine node, a tag border, the active filter pill. If a section looks colourful, it is wrong.
- `--color-signal` and `--color-plum` never appear in the same component instance except in the track legend and the filter control.
- All text/background pairs meet WCAG AA. `--color-slate` on `--color-paper` is 4.6:1 and is the lightest text permitted; never use it below 14px.
- `<html>` sets `color-scheme: light` and `<meta name="theme-color" content="#FFFFFF">`. No dark-mode media query anywhere.

### 5.2 Typography

| Role | Face | Usage |
|---|---|---|
| Display | **Bricolage Grotesque** variable, weights 500–800, optical-size axis on | Page H1s, section H2s, the big footer, the stat numerals |
| Body | **Geist Sans** 400/500 | Paragraphs, card titles, nav, buttons |
| Utility | **Geist Mono** 400/500, tracking `0.02em`, uppercase where used as label | Date ranges, eyebrows, tags, metric labels, spine markers |

The mono face is doing real work here, not decoration: this is a chronology, and dates, versions and download counts are data. Setting them in mono makes the timeline legible as a record.

**Type scale** — fluid via `clamp()`, base 16px, ratio ~1.25 mobile / ~1.333 desktop.

```css
--text-display: clamp(2.75rem, 1.6rem + 5.6vw, 6.5rem);   /* H1 hero */
--text-h1:      clamp(2.25rem, 1.5rem + 3.6vw, 4.25rem);
--text-h2:      clamp(1.75rem, 1.3rem + 2.2vw, 3rem);
--text-h3:      clamp(1.375rem, 1.15rem + 1.1vw, 1.875rem);
--text-lead:    clamp(1.0625rem, 1rem + 0.4vw, 1.3125rem);
--text-body:    1.0625rem;   /* 17px — body copy */
--text-sm:      0.9375rem;
--text-meta:    0.8125rem;   /* mono labels */
```

Rules:
- Display leading `0.94`–`1.02`, letter-spacing `-0.03em` at the largest sizes, tightening as size grows. Body leading `1.65`.
- Measure capped at `68ch` for body, `22ch` for display headlines (forces the deliberate line breaks the reference sites use).
- Sentence case everywhere except mono utility labels, which are uppercase with tracking. **No Title Case headings.**
- Never centre a paragraph longer than two lines.

### 5.3 Layout & grid

```css
--container:  1280px;      /* max content width */
--gutter-sm:  20px;        /* < 768 */
--gutter-md:  32px;
--gutter-lg:  48px;        /* ≥ 1280 */
--grid-cols:  12;
--grid-gap:   24px;
```

Breakpoints: `sm 480 · md 768 · lg 1024 · xl 1280 · 2xl 1536`.

Section rhythm — one scale, applied consistently:

```css
--section-y-sm: 72px;
--section-y-md: 112px;
--section-y-lg: 160px;
```

Alternating sections use `--color-mist` full-bleed with the container inside. Never two mist sections in a row.

### 5.4 Radii, borders, elevation

```css
--radius-sm: 8px;    --radius-md: 14px;   --radius-lg: 24px;   --radius-pill: 999px;
--border:    1px solid var(--color-hairline);
--shadow-card:  0 1px 2px rgb(12 13 16 / 0.04), 0 8px 24px -12px rgb(12 13 16 / 0.10);
--shadow-lift:  0 2px 4px rgb(12 13 16 / 0.05), 0 20px 40px -16px rgb(12 13 16 / 0.16);
```

Elevation is used sparingly — cards sit flat with a hairline border at rest and lift on hover. No shadows on sections, headers or footers.

### 5.5 Motion tokens

```css
--ease-out:    cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
--dur-fast: 160ms;  --dur-base: 320ms;  --dur-slow: 620ms;
--stagger: 60ms;
```

### 5.6 Component states

Every interactive element defines all five: rest, hover, focus-visible, active, disabled.

- **Focus ring:** `outline: 2px solid var(--color-focus); outline-offset: 3px;` — never removed, never replaced with a box-shadow that disappears on a coloured background.
- **Hover** is a 160ms property change (border colour, background tint, arrow translate `4px`). No hover-only content: anything revealed on hover is also reachable by keyboard focus and visible on touch.
- **Touch targets** ≥ 44×44px.

### 5.7 Voice

Write from the reader's side of the screen.

- First person singular. "I led", "I shipped", "I own". Never "we" for solo work.
- Specific over clever. "35,000 charging stations onboarded" beats "scaled the platform".
- Verbs in active voice. Buttons say what happens: "Send message", not "Submit".
- No superlatives about himself. Let the numbers carry it.
- Dates are always explicit ranges. This site's whole argument is chronology.
- Empty and error states give direction, not mood: "Nothing matches that filter yet. Show all work." not "Oops!"

---

## 6. Component inventory

Build these once, use them everywhere. Each is a typed React component with a documented prop interface.

**Layout:** `Container`, `Section` (props: `tone: 'paper' | 'mist'`, `spacing`), `Header`, `Footer`, `SkipLink`.

**UI:** `Button` (`variant: primary | ghost | link`, all with the arrow micro-interaction), `Eyebrow` (mono uppercase label with a leading rule), `Tag` (`track` prop tints border and text), `Marquee` (respects reduced-motion by rendering a static wrapped list), `Counter` (odometer number that only animates once, on first intersection, and renders the final value immediately if reduced-motion), `Field`, `Toast`, `Accordion`.

**Work:** `SpineTimeline`, `SpineEntry`, `TrackFilter`, `ProjectCard`, `ProjectCardFeature` (large variant), `MetricRow`, `StackList`, `CaseStudyHeader`, `NextProject`.

**Zowis:** `BrandStory`, `LookbookGrid`, `ProductTile`, `ZowisCTA`.

**Motion:** `Reveal` (opacity + 16px rise, once, threshold 0.2), `TextReveal` (line-by-line mask for H1/H2 only), `MagneticCTA` (desktop pointer only, disabled on touch and reduced-motion).

---

## 7. Signature element — the Career Spine

This is the one thing the site is remembered for. Everything else stays quiet so this can be loud.

### 7.1 Why it exists

The engagements were **concurrent contracts, not sequential jobs**, and this is true across the whole record, not just recently:

- **2024–2026:** OneWallet MFB, UWA, Nexaflex, Lenbi, JIFU360, Sinimax and RightNowMD chain in one unbroken overlap — **five running simultaneously** through Nov 2025 and again Feb–Jul 2026.
- **2022:** Gateway Edu, Brace Finance, PortsConnect, BluetanksEV, Sumotrust and Truzact overlap — six engagements inside one year.

A conventional stacked timeline reads that as job-hopping across sixteen employers. Rendering them as parallel lanes on a shared spine tells the truth, and simultaneously demonstrates capacity. This is the single most persuasive thing on the site, which is why it is the signature element.

### 7.2 Behaviour

- A continuous 1px vertical rule (`--color-hairline`) runs the full height of the work section, positioned at the left gutter on mobile and at the 2nd grid column on desktop.
- Each engagement docks to the spine with a node: a 9px circle, filled with the **track accent**, ringed white.
- The spine rule **fills with accent colour** from the top down as the section scrolls, driven by `useScroll` progress. This is the only scroll-linked animation on the site.
- **Overlap rendering:** entries whose date ranges intersect are assigned to distinct lanes (offset horizontally by **18px** on desktop — amended v3) and their nodes are connected by a hairline bracket, with the mono label `CONCURRENT ×N` set once per overlap cluster. Lane assignment is computed in `lib/dates.ts` by interval-graph colouring — do not hardcode lanes.
- **Lane cap (amended v3):** the offset cap is **six lanes** at 18px. Collapse to a bracketed group applies only to *historic* clusters — a run peaking **before 2023** with more than four simultaneous engagements (the real 2022 six) renders as one group sharing a node, headed `2022 — SIX CONCURRENT ENGAGEMENTS`. Recent clusters never collapse: the 2024–2026 five-lane run is the site's strongest evidence and must render as parallel lanes. Beyond six simultaneous engagements, collapse remains the fallback regardless of era. Verify at 1440px that six lanes clear the container gutter; if they don't, drop the offset to 14px before falling back to collapse.
- **Year rails:** sticky mono year markers (`2026`, `2025`, … `2019`) sit on the spine and pin to the top of the viewport as their range scrolls through. With sixteen entries this is what makes the timeline scannable.
- On mobile (< 768px) lanes collapse to a single column; overlapping entries instead render a `⇄ concurrent with JIFU360` mono line beneath the title.
- Date ranges render in Geist Mono as `10.2025 — 07.2026`; open ranges render `07.2026 — PRESENT` with the accent applied to `PRESENT` and a 2px pulsing dot (static when reduced-motion).
- Entries are ordered by **start date descending**. Ties break on end date descending, then alphabetically — deterministic ordering is required so builds are reproducible.
- Clicking any entry navigates to its case study. The whole row is the target, with the title as the accessible link name.

### 7.3 Accessibility

The spine is decorative; the content underneath is a semantic ordered list. Markup:

```html
<ol class="spine" aria-label="Work history, most recent first">
  <li>
    <article>
      <h3><a href="/work/rightnowmd">RightNowMD</a></h3>
      <p class="meta"><time datetime="2026-07">Jul 2026</time> — present</p>
      …
    </article>
  </li>
</ol>
```

The SVG rule carries `aria-hidden="true"`. Lane offsets are visual only and must not change DOM order.

---

## 8. Routes

| Route | Purpose | Render |
|---|---|---|
| `/` | Home | Static |
| `/work` | Full chronology + track filter | Static, `searchParams` read on server |
| `/work/[slug]` | Case study | SSG via `generateStaticParams` |
| `/zowis` | Zowis Fashion brand page | Static, ISR 3600s if the product feed is enabled |
| `/about` | Bio, timeline, stack, availability | Static |
| `/lab` | Open source packages + side projects | ISR 21600s (npm download counts) |
| `/contact` | Form + direct channels | Static shell, dynamic POST |
| `/api/contact` | Form handler | Route handler, Node runtime |
| `/not-found` | 404 | Static |
| `/sitemap.xml`, `/robots.txt` | | Generated |

Reserved but not built at v1: `/writing`, `/writing/[slug]`, `/uses`.

---

## 9. Content model

### 9.1 Types

```ts
// content/types.ts
export type Track = 'engineering' | 'founder' | 'open-source';

export type Project = {
  slug: string;
  name: string;
  track: Track;
  role: string;                  // "Lead Mobile Engineer"
  org?: string;                  // client / company
  location?: string;             // "Dubai, UAE"
  summary: string;               // ≤ 160 chars, used on cards and meta description
  start: string;                 // ISO 'YYYY-MM'
  end: string | null;            // null === present
  status: 'active' | 'completed' | 'on-hold' | 'archived';
  confidential?: boolean;        // hides client name, shows "Confidential — fintech"
  stack: string[];
  metrics?: { value: string; label: string; note?: string }[];
  highlights: string[];          // 3–5 bullets, each a shipped outcome
  links?: { label: string; href: string }[];
  cover?: { src: string; alt: string; ratio: '16/10' | '4/5' | '1/1' };
  gallery?: { src: string; alt: string }[];
  featured?: boolean;            // surfaces on home
  caseStudy?: boolean;           // if true, an MDX body must exist
};

export type Pkg = {
  name: string;                  // npm name
  description: string;
  repo: string;
  npm: string;
  install: string;
};

export type Profile = {
  name: string; alias: string; title: string; company: string;
  location: string; timezone: string;
  availability: { open: boolean; note: string; preferredLength: string };
  stats: { value: string; label: string }[];
  socials: { label: string; href: string }[];
  email: string;
};
```

### 9.2 Profile seed

```ts
export const profile: Profile = {
  name: 'Joseph Orji', alias: 'Ace',
  title: 'Lead Mobile Engineer · React Native & TypeScript',
  company: 'Brains Digital Software Technology',
  location: 'Abuja, Nigeria', timezone: 'WAT (UTC+1)',
  availability: {
    open: true,
    note: 'Available for fully remote contract engagements',
    preferredLength: '3–6 months',
  },
  stats: [
    { value: '7+',   label: 'Years shipping mobile' },
    { value: '17',   label: 'Products shipped' },
    { value: '2019', label: 'Shipping since' },
    { value: '2',    label: 'Open-source packages' },
  ],
  socials: [
    { label: 'GitHub',   href: 'https://github.com/orjiace' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/orji-joseph-mobile-dev' },
  ],
  email: 'orjiace@gmail.com',
};
```

Notes:
- The stat `16` counts the shipped products in §9.3. The CV says "12+ apps" — **use the real count, not the old rounded one**, but confirm before publishing (§21).
- The phone number on the CV is deliberately **not** on the site. Public phone numbers on a portfolio attract recruiter spam and offer nothing the contact form doesn't. Add it only if Ace explicitly wants it.

### 9.3 Projects seed — engineering track

This is the authoritative chronology. It merges the CV with the date corrections Ace made afterwards.

> **⚠ Date authority rule.** For **RightNowMD, JIFU360, Lenbi and Sinimax** the CV dates are wrong and have been corrected. The table below wins. Do not "fix" these back to the CV values.

| slug | name | role | location | window | status |
|---|---|---|---|---|---|
| `rightnowmd` | RightNowMD | Lead Mobile Engineer | Remote, US | 2026-07 → present | active |
| `jifu360` | JIFU360 | Lead Mobile Engineer | Dubai, AE | 2025-11 → 2026-08 | completed |
| `lenbi` | Lenbi | Lead Mobile Engineer | Remote, CA | 2025-10 → 2026-07 | completed |
| `sinimax` | Sinimax | Lead Mobile Engineer | Abuja, NG | 2026-02 → 2026-06 | on-hold |
| `nexaflex` | Nexaflex | Lead Mobile Engineer ⚠ confirm title | ⚠ NEEDS INPUT | 2025-01 → 2025-11 | completed |
| `onewallet-mfb` | OneWallet MFB | Lead Mobile Engineer | Abuja, NG | 2024-06 → 2026-07 | completed |
| `uwa` | UWA | Lead Mobile Engineer | Nigeria | 2024-06 → 2026-07 | completed |
| `leadership-news` | Leadership News | ⚠ NEEDS INPUT | ⚠ NEEDS INPUT | ⚠ NEEDS INPUT | archived (held) |
| `evricent` | EvriCent | Lead Mobile Engineer | — | 2024-02 → ⚠ | completed |
| `delta-digital` | Delta Digital | Lead Mobile Engineer | — | 2023-05 → ⚠ | completed |
| `gateway-edu` | Gateway Edu | Lead Mobile Engineer | NG / UK | 2022-06 → 2024-02 | completed |
| `brace-finance` | Brace Finance | Engineering Lead | — | 2022-06 → 2023-01 | completed |
| `portsconnect` | PortsConnect | Lead Mobile Engineer | — | 2022-06 → 2023-03 | completed |
| `bluetanks-ev` | BluetanksEV | Lead Mobile Engineer | United States | 2022-05 → 2022-10 | completed |
| `sumotrust` | Sumotrust | Lead Full-Stack Engineer | — | 2022-01 → 2023-02 | completed |
| `truzact` | Truzact | Full-Stack Engineer | Nigeria | 2020-11 → 2022-04 | completed |
| `crowdfacture` | Crowdfacture | Full-Stack Engineer | — | 2019-09 → 2021-10 | completed |
| `checkncommit` | CheckNCommit | Full-Stack Engineer | — | 2019-10 → 2020-08 | completed |

Three entries have an open end date on the CV (`onewallet-mfb` end is known from a later correction; `evricent` and `delta-digital` show a start month only). Where an end month is missing, render the range as `02.2024 —` with the dash trailing and no "present" label, and flag it in §21. **Never invent an end date.**

#### Per-project content

**RightNowMD** — Telemedicine, team TutuTech. Full app from scratch in React Native + Expo, connecting patients with doctors across video calls, in-home nurse visits, clinic appointments and provider sessions. Separate booking paths per session type with their own routing, session creation and checkout logic. VSee ClinicKit for HD consultations via secure SSO token login so patients join without a second sign-in. Live nurse-location tracking over Socket.IO, updating on a map in real time. **DOKITA**, an AI medical chat assistant on the Anthropic API (Claude Sonnet), with auto-detected questionnaires that turn follow-ups into tappable Yes/No answers. Waiting-room timer that only exposes "Join call" inside a 15-minute window, using UTC comparisons so it holds across time zones. Firebase push for reminders, incoming calls and provider assignment. Shipped to TestFlight and Google Play via EAS. *Also in flight: a new REST triage API with a sessions/turns loop and VSee handoff, running alongside the existing chat, with the API key kept out of the mobile bundle.*
Stack: React Native, Expo, TypeScript, Zustand (persist), TanStack Query, Formik + Yup, Reanimated, Socket.IO, Firebase Messaging, VSee ClinicKit, Anthropic API, EAS.

**JIFU360** — Trading education platform: social feeds, live streaming, AI assistance, broker integrations and a full course academy in one app. Built from scratch on a domain-driven `types → service → hooks → screen` module pattern. Live WebRTC streaming on the Dolby Millicast SDK and react-native-webrtc, including native iOS Picture-in-Picture via a custom `AVPictureInPictureVideoCallViewController` + `AVSampleBufferDisplayLayer` module with I420 → BGRA frame conversion. MT4/MT5 broker connectivity through a .NET REST API and a Go WebSocket/assets service for real-time trade placement, global trading ideas and copy-trading. Real-time chat on PubNub with cross-platform message normalisation and a link-detection moderation pipeline. Push via FCM and OneSignal. CI/CD and OTA through EAS.
Metrics: `17,000+` iOS first-time downloads · `12,500` Play Store downloads · `4.8/5` from 96 iOS ratings · users across Spain, Mexico and beyond.
**Lead with the 4.8/5.** It is third-party verified and speaks to build quality, which is the thing a client cannot otherwise assess.

**Lenbi** — Peer-to-peer equipment rental marketplace where users both rent out and borrow, supporting phone and tablet. Real-time chat over WebSockets with message history, Firebase Storage attachments and automatic blocking of personal contact details inside conversations. Stripe for payments including Apple Pay, Google Pay, voucher checkout and **Stripe Connect** for lender payouts with earnings tracking and bank withdrawal. **Stripe Identity** ID verification gating listings, plus full Google and Apple sign-in with loading and cancellation states handled. Location search with expo-location and Google Places Autocomplete, sorted by distance, filtered by category, with a date-range availability calendar. Multi-step listing flow (photos, pricing, availability, location) validated step by step with Formik + Yup. OneSignal push and a rewards-points system for bookings and referrals. Performance: FlashList for long lists, React Query caching, and resolution of iOS build conflicts between the Stripe SDK and other native packages.

**Sinimax** — Streaming app architected from scratch in React Native (Expo), TypeScript and NativeWind on a component system. Auth via Google OAuth through Firebase with SuperTokens session management. Cross-platform video player with platform-specific fullscreen: native `AVPlayerViewController` on iOS and a manual absolute-overlay approach on Android, resolving sync and callback edge cases. Consumption-only subscription and billing flow compliant with both stores. Zustand (persist) for global state, TanStack Query for server state with cache invalidation and optimistic updates. Reanimated + Gesture Handler for shimmer skeletons, animated headers and collapsible tab views. Status `on-hold` — render as "Engagement paused by client." No commentary on the contract.

**OneWallet MFB** — Mobile banking for a microfinance bank: hold a wallet, move money, pay merchants, no branch visit, at bank-grade security. Sole mobile engineer leading a team of designers and one backend developer; set architecture (MVVM, Zustand) and coding standards, broke features into ClickUp tasks. Built authentication with biometrics and 2FA, the wallet, payments, instant bank-to-bank transfer, contactless QR payment, push notifications and internationalisation. Implemented end-to-end encryption, secure storage and token management. TanStack Query for server-state caching. Sentry for production bug and stability monitoring. Drove the production release through App Store and Google Play review.
Impact line: took the app from nothing to live on both stores, and gave the team crash and stability visibility they had never had.

**UWA** *(amended v3, from the project README)* — Nigeria's marketplace for skilled and unskilled labour: a React Native (Expo) client for uwa.ng carrying the full employment lifecycle for both sides of the market in one binary, with one navigation shell reshaping itself on `user_class` rather than duplicating screens per role. Talent side: job search with best-match scoring, application status timelines, in-app résumé and portfolio, clock-in/clock-out attendance, a wallet with Nigerian bank withdrawals, identity verification. Employer side: pay-to-activate job posting, applicant review with downloadable CVs, project tracking with clock-in audits, a four-tab payments hub with PDF receipts. Bulk Labour Requests was the heaviest feature: multi-role staffing with per-role headcount, in-thread messaging, invoicing, full or instalment Paystack payment and PDF export. Hard parts: Paystack via `expo-web-browser` auth sessions with deep-link returns; a four-endpoint `useQueries` invoice hook; a custom `useInfinitePagedQuery`; an axios client that never throws; `expo-print` PDFs matching the web client's jsPDF output; persisted TanStack Query cache; a 13-milestone web→mobile parity programme with deliberate divergences recorded. Release: v1.0.0, iOS build 81, Android versionCode 12. ⚠ No download/user/transaction numbers supplied — no numeric impact line.
Stack: React Native 0.81.5, React 19.1, Expo SDK 54 (new architecture), TypeScript, React Navigation v7, TanStack Query v5 + AsyncStorage persistence, Zustand, axios, Formik + Yup, FlashList, Reanimated 4, Gesture Handler, Google & Facebook auth, Paystack, OneSignal, expo-print/sharing/secure-store, EAS Build + Update.

**Nexaflex** *(new in v3, from the project README; dates owner-confirmed 2025-01 → 2025-11, completed)* — A crypto-native finance app, live on both stores at v1.9.1: multi-chain wallet across eight chains (per-network deposit addresses, ERC20/TRC20/BEP20 abbreviation handling, QR receive/send, swaps), a USD virtual card with passkey-gated detail reveal, Nigerian bill payments from a crypto balance on a check-quote → confirm → buy pattern, events with QR tickets, Bitcoin mixing behind an educational consent gate, and tiered KYC (NIN/passport/voter's card, BVN). **Lead the case study with:** (1) the security architecture the app was rebuilt around — per-account `SecureLockManager`, **panic mode** unlocking into a decoy state for coercion scenarios, biometric unlock, a passkey gating high-value actions, `AppState` auto-lock, JWT silent refresh; (2) the **quote-polling engine** — per-flow polling hooks where quotes auto-refresh, expire, back off and re-validate before submission so a user never signs a stale price. Also: 24-hour persisted query state, resilient balance hooks surfacing cache age, 7-day layered caches, MMKV on the hot path. Convention: screens never call axios directly; server data in TanStack Query, only UI/session state in Zustand, secrets in secure store. ⚠ Role title and location NEEDS INPUT. ⚠ No download/user/volume numbers supplied.
Stack: React Native 0.79, Expo SDK 53, React 19, TypeScript, React Navigation 7, TanStack Query 5 + AsyncStorage persistence, Zustand, axios interceptor chain, expo-secure-store + react-native-keychain + MMKV, Formik + Yup, Reanimated 3, react-native-svg, expo-image, FlashList, Gorhom Portal, OneSignal, expo-updates OTA, EAS.

**Leadership News** *(new in v3, held)* — Store links are known (§9.3a); role, dates, stack and description are ⚠ NEEDS INPUT. Held as `status: 'archived'`, excluded from the spine, no summary written from the app name.

#### 9.3a Project links (amendment v3 §4)

Render as mono text links in the case-study fact rail and on the work index — **never** as App Store / Google Play badge images (their brand guidelines fight the palette). Work index rows with a store link get a small mono `LIVE` marker; the ten projects that predate store links have none, and that contrast is informative, not a gap to fill.

| Project | Website | App Store | Google Play |
|---|---|---|---|
| UWA | `https://uwa.ng` | ⚠ none supplied | ✓ |
| OneWallet MFB | `https://www.onewalletweb.com/` | ✓ ⚠ listing is "OneWallet Business" — confirm before shortening the label | ✓ |
| Nexaflex | `https://www.nexaflex.com/` | ✓ | ✓ |
| JIFU360 | ⚠ none supplied | ✓ | ✓ |
| Lenbi | ⚠ none supplied | ✓ | ✓ |
| BluetanksEV | ⚠ none supplied | ✓ | ⚠ none supplied |
| Leadership News | ⚠ none supplied | ✓ | ✓ |

Full URLs live in `content/projects.ts` `links[]`.

**EvriCent** — AI-powered spending and repayment system. React Native CLI + TypeScript, React Query for server-state caching, Apple and Google social auth, push notifications and in-app messaging, Reanimated for transitions, **Plaid SDK** for bank and credit-card linking, Stripe SDK for subscriptions. Led mobile with a team of designers and a backend developer.

**Delta Digital** — Crypto trading app. TypeScript, Redux, React Query, functional components and hooks. Binance price-ticker API for live crypto prices. A trading-bot feature built in Python. Designed the full app UI in Figma and translated it to pixel-perfect React Native. Apple in-app purchase and subscriptions via RevenueCat.
Metric: reusable component work cut the codebase by `15%` and smoothed navigation.

**Gateway Edu** — Crypto education platform used across Nigeria, the UK and other African markets. Head of mobile: scalable architecture on React Native + React Navigation. Google, Apple and Facebook OAuth. React Query caching for REST. A gaming adventure system awarding points on completion. An interactive community system — create communities, post, like, comment, block, leave. Firebase Cloud Messaging push. AppsFlyer for analytics and attribution. Web3 gaming integrated with a team of game character designers.
Metric: shipped to both stores in `4 months`.

**Brace Finance** — DeFi app for buying crypto, saving, sending, swapping and tracking spending. Interpreted complex Figma UI into React Native, using **Skia** for the virtual-card UI. Built an identity architecture verifying every user via live images, facial recognition, biometrics and government-issued ID. Integrated Sentry and optimised API calls. Mentored junior and mid-level engineers and grew the team. Shipped via EAS.
Metric: crash rate cut `20%` on low-end Android.

**PortsConnect** — Scheduling and appointments platform, frontend engineer in a team of four, mobile and web. React Native, Redux, React.js, React Query, Socket.IO, TypeScript. Built the v2.0 real-time business↔customer chat on Socket.IO, then a subscription tier that opened more features and created revenue. Shipped to both stores via EAS.
Metric: `3,000+` businesses onboarded within months of the chat release.

**BluetanksEV** — Smart navigation for finding the nearest EV charging station anywhere in the US, sortable by fastest or cheapest. Live-location architecture locating stations from the user's current position, with Google Maps and Google Places API for navigation. Stripe payment flow. Expo push notifications. An admin dashboard for registered charging stations.
Metric: `35,000` charging stations onboarded.

**Sumotrust** — Naira savings and investment across mobile and web. Designed the products through user research, then built them in React Native and React with TypeScript. A naira savings system for local-currency deposits earning APY, and — with a backend engineer — a secure investment and money-gifting system. React Query for server state, Redux for client state, console statements stripped in production, keys in `.env`, tokens in secure store, biometric or PIN authentication.
Metric: managed funds for `10,000+` users worldwide.

**Truzact** — Centralised-exchange crypto savings and investment, mobile and web. UI designed in Figma from user research, built on React Native (Expo managed), Redux and TypeScript. CoinGecko infrastructure powering a live price ticker across `80+` assets. A crowdfunding/donation system for raising money from family and friends. Performance work: removed console statements and unused imports, moved styles to the StyleSheet API, cached server state with React Query and client state with Redux Toolkit. Custom wallet-address authentication written with regex rather than pulling an npm package. Chakra UI on the web app.
Metric: the crowdfunding release added `1,000` users in two weeks.

**Crowdfacture** — Community-driven investment platform. Designed the hi-fi interface in Figma, built the web app in React.js + Redux and the iOS/Android app in React Native (Expo) + Redux, and published to both stores.

**CheckNCommit** — Business rating platform, TrustPilot-shaped: businesses register on a membership plan, customers who dealt with them offline create free accounts and leave ratings. Sole engineer. React.js, class components, Redux, Firebase Cloud Functions, Node.js and Express on the backend, UI designed in Adobe XD.

#### Presentation rules for the long tail

Sixteen projects is too many to give equal weight. Rank them:

- **Case study (full MDX page, amended v3):** RightNowMD, JIFU360, Lenbi, OneWallet MFB, UWA, Nexaflex, BluetanksEV, Sumotrust. Eight deep pages.
- **Spine entry with expandable detail, no separate page:** Sinimax, EvriCent, Delta Digital, Gateway Edu, Brace Finance, PortsConnect, Truzact, Crowdfacture, CheckNCommit.
- Everything stays on the spine regardless. The chronology is the argument — nothing gets dropped for being old.

### 9.4 Projects seed — founder track

**Zowis Fashion Limited** (`slug: zowis`, `track: founder`, active). Women's fashion brand with e-commerce. Ace is founder and also builds and runs its technical infrastructure: Supabase backend (including remediating a critical RLS misconfiguration), GUO logistics API integration for delivery, Meta Business Suite and ad-account setup, plus company filings and operations. Framed as: *"I don't just build product for clients. I run one."* ⚠ Founding date needed.

**LinguaAPI / LingoBase** (`slug: lingobase`, `track: founder`, in development). Developer-facing translation API. Supabase multi-tenant backend, Azure Translator engine, dual Paystack + Stripe billing for African and international markets. Differentiator in progress: Nigerian-language TTS across Yoruba, Igbo and Hausa. UI being rebuilt to a light modern SaaS surface on Tailwind + shadcn/ui, keeping the mint/emerald accent. Label it honestly as in development.

### 9.5 Education & credentials

For the About page chronology (§10.5).

| Institution | Award | Years |
|---|---|---|
| Zero To Mastery Academy | Computer Software Engineering | 2019 – 2020 |
| Petroleum Training Institute | High School Diploma, Computer Science & IT | 2017 – 2020 |
| Abia State Polytechnic | National Diploma, Computer Science | 2014 – 2016 |

Certifications (LinkedIn): Design Thinking — Understanding the Process; React Hooks. Render these as a quiet mono list, not as badges.

### 9.6 Packages seed

```ts
export const packages: Pkg[] = [
  { name: 'rn-credit-card-textinput',
    description: 'Credit card input for React Native that accepts and validates card numbers. Works with Expo and the CLI, with TypeScript support.',
    repo: 'https://github.com/orjiace', // ⚠ confirm exact repo URL
    npm: 'https://www.npmjs.com/package/rn-credit-card-textinput',
    install: 'npm i rn-credit-card-textinput' },
  { name: 'rn-slick-bottom-tabs',
    description: 'Production-ready custom bottom tab navigation for React Native — fully customisable, multiple variants, strong TypeScript support.',
    repo: 'https://orjiace.github.io/rn-slick-bottom-tabs/',
    npm: 'https://www.npmjs.com/package/rn-slick-bottom-tabs',
    install: 'npm i rn-slick-bottom-tabs' },
];
```

### 9.7 Reserved

`content/writing/*.mdx` with frontmatter `{title, date, summary, tags, draft}`. Route not built at v1.

---

## 10. Page specifications

Section order is fixed. Each numbered block is one `<Section>`.

### 10.1 Home `/`

1. **Header** — sticky, `paper` background, hairline bottom border that appears only after 40px scroll. Left: wordmark "ACE" in display face + small mono `ORJI`. Centre/right: Work · Zowis · Lab · About. Right: `Get in touch` button. Mobile: full-screen overlay menu, links at `--text-h2`, staggered in at 40ms, body scroll locked, focus trapped, Escape closes.

2. **Hero** — the thesis. Full-width, `min-height: 88svh`, top-aligned with generous bottom space (not vertically centred).
   - Eyebrow (mono): `LEAD MOBILE ENGINEER — ABUJA, NIGERIA — UTC+1`
   - H1 at `--text-display`, three deliberate lines (count amended v3):
     > Seventeen apps in production.
     > Two npm packages.
     > **One fashion label.**
     Last line in `--color-plum`; first two lines' full stops in `--color-signal`.
   - Lead paragraph: "I'm Ace. I lead mobile builds in React Native and TypeScript for teams in Lagos, Toronto, Dubai and San Francisco — and I run Zowis Fashion, my own brand, on infrastructure I built myself."
   - Two CTAs: `See the work →` (primary) · `Download CV` (ghost, mono label with file size).
   - Availability pill: 8px `--color-success` dot + "Open to remote contracts · 3–6 months".
   - Animation: `TextReveal` line mask, 620ms, 80ms stagger, once, on load only.

3. **Proof strip** — four `Counter` stats from `profile.stats`, separated by hairlines, mono labels beneath. Animates once on intersection.

4. **Client marquee** — organisation names in display face, not logos (logos for these clients may not be licensed), derived from the content file (amended v3 adds UWA and Nexaflex): `RightNowMD · Sinimax · JIFU360 · Lenbi · Nexaflex · OneWallet MFB · UWA · EvriCent · Delta Digital · Gateway Edu · Brace Finance · PortsConnect · BluetanksEV · Sumotrust · Truzact · Crowdfacture · CheckNCommit · Zowis`. Duplicated track, CSS transform, 40s linear loop, paused on hover and when reduced-motion. Edges masked with a paper gradient.

5. **Selected work** — three featured projects: **JIFU360** (the metrics and the hardest engineering), **RightNowMD** (current, AI + telemedicine), **Zowis** (the founder track). Deliberately one from each argument the site is making — technical depth, current relevance, ownership. Asymmetric grid: first card spans 7 columns, second 5, third full width. Each card: cover image (`--radius-lg`, hairline border), track tag, name, one-line summary, top metric in mono, arrow. Hover: `--shadow-lift`, image scale `1.03` over 620ms, arrow translates 4px.

6. **The Spine preview** — 2024 to present only (RightNowMD, Sinimax, JIFU360, Lenbi, Nexaflex, OneWallet MFB, UWA, EvriCent — amended v3), rendered in the full Spine component so the concurrency is visible immediately, with `View all 17 projects, back to 2019 →` linking to `/work`. This is the first sight of the signature element; it must land here.

7. **Zowis crossover band** — full-bleed `--color-plum-sub`. Two columns: left, one lookbook image at 4/5; right, eyebrow `FOUNDER TRACK`, H2 "Zowis Fashion Limited", 60-word brand paragraph, and three mono facts (e-commerce · logistics integration · brand operations). CTA `Enter Zowis →` in plum. This is the only plum-dominant band on the home page.

8. **Capabilities** — not a services list. Four honest capability blocks with mono index numbers (justified here: they map to a real delivery sequence): `01 Architecture & app foundations` · `02 Real-time & streaming` · `03 Payments & fintech flows` · `04 Ship, store, and iterate`. Each with two sentences drawn from actual project work.

9. **Lab teaser** — the two npm packages with live download counts, install command in a copy-to-clipboard mono block.

10. **Contact band** — display-size question "Have something to build?", email as a large link, availability line, `Start a conversation →`.

11. **Footer** — see §10.8.

### 10.2 Work index `/work`

- Page header: H1 "Work", lead sentence, and a mono line stating the honest frame: `Contracts ran concurrently. The lanes below show real overlap.`
- **TrackFilter**: pills — `All · Engineering · Founder · Open source`. Active pill fills with its track accent at 8% and takes an accent border. Implemented as links to `/work?track=…` (works with JS disabled), enhanced client-side with `router.replace` + `scroll: false`. Filter state is announced to screen readers via a polite live region: "Showing 8 of 11 projects."
- **SpineTimeline** with all dated projects (§7).
- Year rails down the spine (2026 · 2025 · 2024 · 2023 · 2022 · 2021 · 2020 · 2019) as sticky mono markers, so the reader can place any entry without reading its dates.
- A **density note** at the 2022 cluster: five engagements overlap there. Do not hide them behind a "show more" — that cluster is the strongest evidence on the page.
- Empty state when a filter matches nothing: "No projects on this track yet." + reset link.

### 10.3 Case study `/work/[slug]`

1. Breadcrumb (mono): `WORK / RIGHTNOWMD`
2. Header: name at `--text-h1`, role · org · location, date range, status chip.
3. Fact rail — sticky on desktop `lg+`, inline card on mobile: Role, Window, Track, Stack, Links.
4. Cover image, full-bleed within container, `--radius-lg`.
5. Metrics row, if metrics exist. Omit the section entirely rather than showing zeros.
6. MDX body — free-form, but structured as: Context → What I owned → Hard parts → Outcome. Prose styled with a typography plugin scoped to `.prose`, max measure 68ch.
7. Gallery — 2-up grid, lightbox via Radix Dialog with keyboard nav and a visible close.
8. `NextProject` — the chronologically adjacent project, full-width band with a large hover arrow.
9. Per-page `generateMetadata` and a dynamic OG image (§12.5).

### 10.4 Zowis `/zowis`

Distinct enough to feel like a brand page, same skeleton so it doesn't feel bolted on. Plum accent throughout; still white background.

1. Hero: brand wordmark, H1 "Zowis Fashion Limited", one line of positioning, founded-year mono line.
2. Brand story: two-column, 3 short paragraphs + portrait or atelier image.
3. Lookbook grid: 6–8 images, masonry-ish 2/3-column, `4/5` and `1/1` ratios mixed, lazy-loaded, lightbox. `⚠ NEEDS INPUT: images`
4. **"Built and run in-house"** — the crossover section that makes this page valuable to a technical audience: Supabase commerce backend, RLS hardening, GUO logistics API for delivery, Meta Business Suite and ads infrastructure, corporate filings and operations. Presented as four cards with mono labels.
5. Featured products (optional, §12.2) or a static 3-tile grid linking to the store.
6. CTA band → Zowis store + Instagram.

### 10.5 About `/about`

1. Portrait + H1 "Ace" + the long-form bio in first person: 7+ years, path from first shipped app to lead engineer, why remote contract work, why fashion as well.
2. Full life/career chronology — the Spine reused with `variant="compact"`, mixing engineering, founder milestones (Zowis incorporation, first package published) and any education entry. `⚠ NEEDS INPUT: education, first-year-of-career date`
3. Stack — grouped columns, not a logo soup. Every entry below appears in at least one project in §9.3, which is the rule for inclusion:
   - **Mobile:** React Native (Expo + CLI), TypeScript, Swift, Kotlin, Reanimated, Gesture Handler, Skia, NativeWind, FlashList, EAS
   - **State & data:** Zustand (persist, MMKV), Redux / Redux Toolkit, TanStack Query, GraphQL, Formik + Yup
   - **Backend:** Node.js, Express, Firebase (Auth, Storage, Cloud Functions, FCM), Supabase, SuperTokens, Go, PHP, SQL
   - **Payments & identity:** Stripe (Connect, Identity, Apple/Google Pay), Paystack, Plaid, RevenueCat, biometrics + 2FA, E2E encryption
   - **Real-time & media:** WebRTC (Dolby Millicast), native iOS PiP, Socket.IO, PubNub, VSee ClinicKit, react-native-video
   - **AI:** Anthropic API (Claude), Azure Translator
   - **Ops:** Sentry, OneSignal, AppsFlyer, Google Maps & Places, ClickUp, Figma
4. Ways of working — 4 short statements (remote-first, contract length, timezone overlap, handover standards).
5. CTA.

### 10.6 Lab `/lab`

Open-source packages with live weekly download counts and star counts, install snippets and repo links; then LingoBase as a card with an honest `In development` chip. Do not pad this page — two packages and one side project is what exists, and a short honest page reads better than a padded one.

### 10.7 Contact `/contact`

- Left: H1 "Let's talk", availability, response-time promise, timezone, direct email and social links, and a Cal.com embed if a link is supplied (`⚠ NEEDS INPUT`).
- Right: form — Name, Email, Company (optional), Project type (select: Contract role / Product build / Consultation / Zowis / Other), Budget range (optional select), Message, plus honeypot. Inline validation on blur, submit disabled while pending with a spinner and the label changing to "Sending…", success replaces the form with a confirmation block, failure shows a toast **and** an inline error with the mailto fallback.

### 10.8 Footer

Large-type footer in the manner of the reference sites: oversized display navigation (`/Work /Zowis /Lab /About /Contact`) with hover underline sweep; second row with email, location and timezone; social row; bottom bar with `© 2026 Joseph Orji · Brains Digital Software Technology` and a mono `Built with Next.js` line. Full-bleed `--color-mist`.

### 10.9 404

H1 "That page doesn't exist." + one line + three links (Home, Work, Contact). No illustration, no joke.

---

## 11. Motion & interaction

1. **Page load** — hero text reveal only. Nothing else animates above the fold. Total orchestration ≤ 900ms.
2. **Scroll reveals** — `Reveal` wrapper: `opacity 0→1`, `translateY 16px→0`, 620ms `--ease-out`, `once: true`, `amount: 0.2`. Grid children stagger 60ms, capped at 6 children — never stagger a long list. **Decision recorded 2026-08-14:** `Reveal` and `TextReveal` are IntersectionObserver + CSS transitions, not motion components, unless M8 demonstrates a concrete effect they cannot achieve; where motion is genuinely needed (layout animation, springs), M8 imports `LazyMotion` with `domAnimation` features and `m` components — never the full `motion` import.
3. **Scroll-linked** — only the spine fill. No parallax on images, no pinned sections, no horizontal scroll hijacking. **Decision recorded 2026-08-14:** the spine fill is a plain rAF-batched scroll listener, not a motion `useScroll` — importing motion for one scaleY put the home route 20 kB over budget. Motion stays off every route until M8.
4. **Hover** — arrow translate, image scale, border colour, tint fill. 160ms.
5. **Lenis** — `duration: 1.05`, `wheelMultiplier: 1`, `smoothTouch: false`. Must not break anchor links, `scroll-margin-top` on headings, or browser find-in-page. **Cut it entirely if it degrades iOS scrolling.**
6. **Reduced motion** — a single global guard: when `prefers-reduced-motion: reduce`, `Reveal` renders children at final state, `Counter` renders the final number, `Marquee` renders a static wrapped list, `MagneticCTA` is inert, Lenis is not initialised, and CSS sets `animation-duration: 0.01ms !important; transition-duration: 0.01ms !important`.
7. **Never**: auto-playing carousels, entrance animations on scroll-up, animation on route change longer than 200ms, cursor followers.

---

## 12. Backend & integrations

### 12.1 Contact API — `POST /api/contact` (required)

Node runtime. Flow:

1. Parse and validate against the shared Zod schema. Reject with 422 + field errors on failure.
2. **Bot checks, in order:** honeypot field non-empty → return 200 with a fake success (do not tell bots they failed); form submitted < 2500ms after mount (timestamp signed with `HMAC(FORM_SECRET)`, not trusted from the client raw) → reject; Turnstile token verified server-side against Cloudflare → reject on failure.
3. **Rate limit** by IP: 3 requests / 10 minutes, 20 / day. Upstash Redis if `UPSTASH_*` env vars exist, otherwise an in-memory LRU with a logged warning. Exceeding returns 429 with a `Retry-After` header and a human message.
4. Sanitise all string fields (strip HTML, cap message at 4000 chars) before templating into email.
5. Send via Resend: notification to Ace, plus an auto-acknowledgement to the sender. Both plain-text-first with an HTML alternative.
6. Optionally persist to Supabase `contact_submissions`. **If persistence fails, still return success** — the email is the source of truth.
7. Return `{ ok: true }`. Log failures with a request id; never leak provider errors to the client.

Env: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `FORM_SECRET`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.

### 12.2 Zowis product feed (optional)

Server-side read from the Zowis Supabase, ISR 3600s, rendering 3–6 featured products on `/zowis`.

**Hard security requirements** — this connects to a live commerce database:
- Read through a **dedicated `featured_products` view** exposing only `id, name, slug, price, image_url, in_stock`. Never select from the base product or order tables.
- Anon key only, and only in a server component or route handler. The service-role key must never appear in this repo or in any client bundle. Add a CI grep that fails the build if `SERVICE_ROLE` appears outside `.env.example`.
- RLS policy on the view: `SELECT` for `anon` where `is_featured = true`. Given the RLS issue previously found on this project, verify the policy with an unauthenticated client before shipping.
- **Fail open, quietly:** if the fetch errors or times out (3s), render the static 3-tile fallback. The Zowis page must never 500 because the store is down.

### 12.3 Package stats (optional)

`GET https://api.npmjs.org/downloads/point/last-week/{pkg}` and the GitHub repo endpoint for stars, both server-side, ISR 21600s (6h), `Promise.allSettled`, hard 2s timeout. On failure render the package card without the number — never render `0` or `NaN`, and never block the page.

### 12.4 CV download

Static PDF at `/ace-orji-cv.pdf`, served with `Content-Disposition: inline`. Fire an analytics event `cv_download` on click. Keep the file under 1MB. Filename must include a version date so it is obvious when it is stale.

### 12.5 OG images

`app/opengraph-image.tsx` for the site default, `app/work/[slug]/opengraph-image.tsx` per case study, both via `next/og` (Edge runtime). Layout: white background, project name in display face, role and date range in mono, a track-accent rule down the left edge, `ACE ORJI` wordmark bottom-left. 1200×630. Fonts loaded as buffers — verify Bricolage renders, and fall back to Geist if the variable font fails in the Edge runtime.

### 12.6 Analytics

Plausible script with `defer`, plus custom events: `cta_click` (with location), `cv_download`, `contact_submit`, `contact_error`, `track_filter` (with value), `project_open` (with slug). No PII in event props. No cookies.

### 12.7 CMS migration path (not built)

If content ever moves to Sanity: keep `content/*.ts` as the interface, replace its internals with a fetch, and keep the `Project` type unchanged. Nothing in `components/` should need to change. Do not build this at v1.

---

## 13. Security & privacy

- CSP header — **decision recorded 2026-08 (kept from spec v1.1):** `script-src` keeps `'unsafe-inline'` permanently. A nonce-based CSP would force dynamic rendering on every route, breaking the static/ISR model in §8 and the LCP budget in §14. The policy is tightened around it instead. Full policy: `default-src 'self'`; `script-src 'self' 'unsafe-inline' https://plausible.io https://challenges.cloudflare.com`; `style-src 'self' 'unsafe-inline'` (Next injects inline styles); `img-src 'self' data: https://cdn.prod.website-files.com https://*.supabase.co`; `font-src 'self'`; `connect-src 'self' https://plausible.io`; `frame-src https://challenges.cloudflare.com https://cal.com`; `object-src 'none'`; `base-uri 'self'`; `form-action 'self'`; `frame-ancestors 'none'`. Plus `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, HSTS.
- No secrets in `NEXT_PUBLIC_*` except the Turnstile site key and the Plausible domain.
- `.env.example` committed with every key and a comment; real `.env.local` gitignored.
- Contact submissions are personal data: state retention in a short privacy note, and do not log message bodies.
- All external links: `rel="noopener noreferrer"`.

---

## 14. Performance budgets

| Metric | Budget |
|---|---|
| First-load JS (home) | ≤ 130 KB gzipped |
| LCP (mobile, Fast 3G) | < 2.0s |
| CLS | < 0.05 |
| INP | < 200ms |
| Largest image | ≤ 180 KB |
| Fonts | 3 families, variable, `font-display: swap`, subset `latin` |

Rules: `next/image` everywhere with explicit `width`/`height` or `fill` + aspect-ratio wrapper; AVIF with WebP fallback; `priority` on the hero image only; every other image lazy with a `--color-fog` placeholder box at the correct ratio; `motion` and Lenis imported only in client components that need them, never in `layout.tsx`; no barrel-file icon imports.

**Budget decision recorded 2026-08-14:** the home route carries no motion at all — the spine fill is a ~1 kB rAF scroll listener (§11.3). When M8 adds animation it must use `LazyMotion` + `m` with `domAnimation` (IntersectionObserver + CSS for reveals), and the home first-load number is re-measured against the 130 kB budget at the end of that milestone. Measured after this decision: home 107 kB, `/work` 106 kB.

---

## 15. Accessibility

Target WCAG 2.1 AA, verified with axe on every route.

- Skip-to-content link, visible on focus, first in tab order.
- One `<h1>` per page; heading levels never skip.
- Landmarks: `header`, `nav`, `main`, `footer`, with `aria-label` where duplicated.
- Mobile menu: focus trapped, Escape closes, focus returns to the trigger, `aria-expanded` on the trigger, background inert.
- Lightbox: same rules, plus arrow-key navigation and an image counter announced.
- Filter changes announced in an `aria-live="polite"` region.
- All images have meaningful `alt`; decorative SVG is `aria-hidden`.
- Form fields have real `<label>`s (not placeholders), errors linked by `aria-describedby`, and `aria-invalid` on failure.
- Colour is never the only signal — track is also carried by the text tag label.
- Contrast ≥ 4.5:1 body, ≥ 3:1 large text and UI borders.
- Zoom to 200% without loss of content or horizontal scroll.

---

## 16. SEO

- Per-route `generateMetadata`: title template `%s — Ace Orji`, description from `project.summary`, canonical URL, OG + Twitter card tags.
- JSON-LD: `Person` on `/` (with `jobTitle`, `worksFor`, `knowsAbout`, `sameAs`), `BreadcrumbList` + `CreativeWork` on case studies, `Organization` on `/zowis`.
- `sitemap.ts` enumerating all static routes plus every project slug, with `lastModified`.
- `robots.ts` allowing all, pointing at the sitemap.
- Semantic HTML throughout — the site must be fully readable as a document with CSS disabled.

---

## 17. Edge cases & error states

Handle every row. These are the ones that break portfolio sites in practice.

| # | Case | Required behaviour |
|---|---|---|
| 1 | Project has no cover image | Render a `--color-mist` panel at the correct ratio with the project name in display face. Never a broken image, never a stretched layout. |
| 2 | Project has no metrics | Omit the metrics section entirely. Do not render "N/A" or zeros. |
| 3 | Project has no case study body | Card does not link to a detail page; it renders as a static card. `generateStaticParams` excludes it. |
| 4 | Project with an unknown end month (EvriCent, Delta Digital) | Renders `02.2024 —` with a trailing dash and no "present" label. Never infer an end date, and never treat it as active. |
| 5 | `end: null` | Renders "PRESENT". Verify the pulsing dot is static under reduced-motion. |
| 6 | Concurrency beyond the lane budget | Lane algorithm generalises to N. Up to six 18px lanes offset horizontally (amended v3). Clusters peaking before 2023 with 5+ simultaneous engagements collapse to one bracketed group (the real 2022 six); recent clusters never collapse; beyond six lanes collapse is the fallback regardless of era. Test against both the 2022 data and the 2024–2026 five-lane cluster. |
| 7 | Very long project or client name | `text-wrap: balance`, hyphenation, and a `min-width: 0` on flex children so nothing overflows. Test with a 40-character name. |
| 8 | Confidential client | Renders "Confidential — {sector}". Case study still exists; client name is absent from the DOM, the slug and the OG image. |
| 9 | Filter matches nothing | Empty state with a reset link, and a live-region announcement. |
| 10 | `?track=` has an unknown value | Fall back to "All", do not 404, and normalise the URL. |
| 11 | Unknown project slug | 404 page, correct status code, no crash. |
| 12 | Contact form: network failure | Inline error + toast + a visible `mailto:` fallback with the message preserved in the textarea. Never lose the user's typed text. |
| 13 | Contact form: rate limited | Friendly 429 message with the retry window, plus the mailto fallback. |
| 14 | Contact form: double submit | Button disabled on pending; server dedupes on `(email + message hash)` within 60s. |
| 15 | Turnstile fails to load | Do not block submission; fall through to honeypot + timing + rate limit, and log the degradation. |
| 16 | Resend outage | 502 to the client with the mailto fallback surfaced. Alert via log. |
| 17 | Zowis feed down / slow | 3s timeout, static fallback tiles, page still renders 200. |
| 18 | npm/GitHub API down or rate-limited | Card renders without the stat. Never `0`, never `NaN`, never a loading spinner stuck forever. |
| 19 | JavaScript disabled | All content readable, all navigation works, filter works via links, form degrades to a mailto link. |
| 20 | `prefers-reduced-motion: reduce` | Per §11.6. |
| 21 | Slow connection | Fonts swap without invisible text; images show ratio-correct placeholders; no CLS. |
| 22 | 320px viewport | No horizontal scroll. Display type clamps down. Spine collapses. Tables scroll within their own container, not the page. |
| 23 | Very wide (2560px+) | Container caps at 1280px, full-bleed backgrounds still extend, hero type stops growing. |
| 24 | iOS Safari `100vh` | Use `svh`/`dvh` with a `vh` fallback. Test the mobile menu with the URL bar collapsing. |
| 25 | Long-press / text selection on cards | Text remains selectable; do not set `user-select: none` on content. |
| 26 | Back button after filtering | Restores the previous filter and scroll position. |
| 27 | Deep link to a case study, then Back | Returns to `/work` with the filter intact. |
| 28 | Print / save-as-PDF | Print stylesheet: hide nav, footer nav, marquee and decorative elements; expand all content; show link URLs after anchors. |
| 29 | Image fails to load at runtime | `onError` swaps to the mist placeholder — no broken-image icon. |
| 30 | Duplicate slugs in the content file | A build-time assertion fails the build with a clear message. |
| 31 | Malformed date in content | `lib/dates.ts` throws at build time with the offending slug named. |
| 32 | Spine with all 16 entries on a 320px screen | Total scroll length must stay sane — collapse pre-2022 entries into a compact variant (title, dates, one line) rather than full cards. Verify the page is under 12 screens tall on mobile. |
| 33 | Screen reader on the spine | DOM order is chronological regardless of visual lanes; verify with VoiceOver and NVDA. |

---

## 18. Testing

- **Unit (Vitest):** `lib/dates.ts` — range formatting, overlap detection, lane assignment (include a 3-way overlap case and an adjacent-but-not-overlapping case), sorting determinism; `lib/schema.ts` validation.
- **Component (Testing Library):** TrackFilter URL sync; form validation and error rendering; Counter under reduced-motion.
- **E2E (Playwright):** nav on mobile and desktop; filter → shareable URL → refresh → back; case study navigation; contact form happy path against a mocked API; contact form failure path; keyboard-only traversal of the home page.
- **a11y:** `@axe-core/playwright` on every route, zero violations, run in CI.
- **Visual:** Playwright screenshots at 375 / 768 / 1440 for each route, committed as baselines.
- **Link check:** a script that asserts every internal href resolves to a real route and every project `links[]` returns < 400.
- **CI:** typecheck, lint, unit, build, axe. Block merge on failure.

---

## 19. Local development & deployment

```bash
pnpm install
cp .env.example .env.local     # fill in keys; site runs without them, contact form will not
pnpm dev                       # http://localhost:3000
pnpm build && pnpm start       # production check
pnpm test && pnpm test:e2e
pnpm lint && pnpm typecheck
```

The site **must build and run with an empty `.env.local`.** Missing keys degrade features (contact form shows the mailto fallback, Zowis feed shows static tiles, package stats hide) — they never break the build. This is a hard requirement so the repo is clonable.

**Deploy (Vercel):** connect the repo, add env vars for Production and Preview, set the custom domain, enable Analytics, confirm the security headers in `next.config.ts` are applied to the deployed responses. Preview deploys on every PR; `main` is production.

**Post-deploy checklist:** Lighthouse on the live URL · OG cards validated in the LinkedIn Post Inspector and X card validator · sitemap submitted to Google Search Console · a real contact-form submission received end to end · 404 verified on an unknown route.

---

## 20. Build order

Work in these milestones; each ends in a runnable state.

1. **Foundation** — Next.js + TS + Tailwind v4, `@theme` token block from §5, fonts, `Container`/`Section`, header, footer, 404, security headers. *Done when: an empty page renders with correct type and spacing at all breakpoints.*
2. **Content layer** — types, all seed data from §9, `lib/dates.ts` with unit tests passing, build-time assertions. *Done when: `pnpm test` is green and duplicate slugs fail the build.*
3. **The Spine** — the signature element, including lane assignment, scroll fill, mobile collapse and screen-reader markup. Build this third, not last; it is the hardest piece and everything else is arranged around it.
4. **Work index + case studies** — filter, routing, MDX bodies, `NextProject`.
5. **Home** — all sections in order, using components already built.
6. **Zowis, About, Lab.**
7. **Contact + API** — form, validation, Resend, bot defence, rate limiting, all failure states.
8. **Motion pass** — reveals, counters, marquee, magnetic CTA, reduced-motion guard.
9. **Polish** — OG images, metadata, JSON-LD, sitemap, print styles, image optimisation.
10. **Hardening** — full edge-case table, axe on every route, Lighthouse to budget, E2E suite, visual baselines.

After milestone 3 and again after milestone 8, screenshot the site at 375 and 1440 and critique it against §5 before continuing. Remove one thing each time.

---

## 21. Open items — needs input before launch

- [ ] Email address, and the social URLs (GitHub, LinkedIn, X, Upwork) for `profile.socials`
- [ ] End months for EvriCent and Delta Digital (the CV shows a start month only)
- [ ] Nexaflex: role title and location (README doesn't state them)
- [ ] Leadership News: role, dates, stack, description — held off the spine until supplied
- [ ] OneWallet App Store listing is "OneWallet Business" — confirm it is the app Ace built before shortening the link label
- [ ] UWA App Store link, if one exists (only Google Play was supplied)
- [ ] Zowis Fashion founding date
- [ ] Confirm the shipped-product count (17 in §9.3 as amended vs "12+" on the old CV)
- [ ] Career start year and any education entry for the About chronology
- [ ] Repo URLs for both npm packages
- [ ] Confirmation of which client names and metrics are contractually shareable
- [ ] Cover images for each project (screens, device mockups, or abstract stand-ins)
- [ ] Zowis lookbook images and brand copy, plus the store URL and Instagram handle
- [ ] Portrait photograph
- [ ] Current CV as PDF
- [ ] Domain name
- [ ] Whether the Zowis product feed is in scope for v1 (§12.2) or the static fallback is enough
- [ ] Cal.com or other booking link, if wanted

---

## 22. What "good" looks like

If the finished site does its job, a hiring manager in Toronto lands on it, understands within fifteen seconds that this is a lead mobile engineer with real production scale, scrolls once and sees four contracts running in parallel — which reframes overlap as capacity rather than churn — and books a call. And a Zowis stakeholder lands on the same domain, follows one link, and finds a brand page that stands on its own.

The spine is the argument. Everything else stays out of its way.
