# Ace Orji — portfolio

Personal portfolio for Joseph "Ace" Orji: lead mobile engineering work and
Zowis Fashion Limited, presented as one chronology. Built to the spec in
`portfolio-spec.md` (v1.0).

## Stack

Next.js 15 (App Router, TypeScript strict) · Tailwind CSS v4 (CSS-first
`@theme` tokens) · Radix UI · Motion for React · Resend · pnpm.

## Local development

```bash
pnpm install
cp .env.example .env.local     # fill in keys; site runs without them, contact form will not
pnpm dev                       # http://localhost:3000
pnpm build && pnpm start       # production check
pnpm lint && pnpm typecheck
```

The site builds and runs with an empty `.env.local`. Missing keys degrade
features (contact form → mailto fallback, Zowis feed → static tiles, package
stats hidden) — they never break the build.

## First-load JS budget

Budget: ≤ 130 kB gzipped on the home route (§14). Re-measured at the end of
every milestone — Motion, Lenis and the rest of Radix land in M8, so the
number is expected to move there.

| Milestone | First-load JS (home) |
|---|---|
| M1 Foundation | 102 kB |
| M2 Content layer | 102 kB |
| M3 The Spine | 102 kB (150 kB on `/work` — motion loads there only) |
| M4 Work index + case studies | 102 kB (149 kB `/work` · 106 kB `/work/[slug]`) |
| M5 Home | 150 kB → **107 kB** after the motion-strategy decision † (106 kB `/work` · 106 kB `/work/[slug]`) |
| M6 Zowis · About · Lab | 107 kB (102 kB `/zowis` · 106 kB `/about` · 103 kB `/lab`) |
| M7 Contact + API | 107 kB (145 kB `/contact` — RHF + Zod + Radix Toast, route-local) |
| M8 Motion pass | **108 kB** home · **106 kB** `/work` — no motion library; dep removed |

† Decision recorded in spec §11/§14 (v1.4): the spine fill is a plain rAF
scroll listener; motion is off every route until M8, and M8 must use
LazyMotion + `m` with `domAnimation` (IntersectionObserver + CSS for
Reveal/TextReveal). Home is back under the 130 kB budget with 23 kB
headroom for the motion pass.

An accidental Next 15 → 16 upgrade rode along with the M3 commit and was
reverted immediately after; numbers above are Next 15's build table
throughout, so all rows are comparable.

Note: `pnpm dev` runs Turbopack. Next 15.5's webpack dev pipeline
mis-resolves React inside `.mdx` modules in the RSC layer and 500s the
case-study routes; Turbopack dev and the webpack production build are both
unaffected (see the comment in `next.config.ts`).

## Build progress

- [x] **M1 Foundation** — tokens, fonts, Container/Section, header, footer, 404, security headers
- [x] **M2 Content layer** — full §9 content model, `lib/dates.ts` (35 unit tests, written first), build-time content gate
- [x] **M3 The Spine** — full §9.3 chronology in content (16 projects, corrected dates, `endUnknown` for EvriCent/Delta Digital), spine layout algorithm (lanes, concurrency runs, the 2022 six-way bracketed group), SpineTimeline/SpineEntry/SpineRule components, minimal `/work` page (68 tests)
- [x] **M4 Work index + case studies** — URL-driven TrackFilter (works without JS, live-region announcements, unknown values normalise), six MDX case studies (RightNowMD, JIFU360, Lenbi, OneWallet MFB, BluetanksEV, Sumotrust) with fact rail, metrics, cover fallback and NextProject band; whole-row spine links; everything else stays spine-only
- [x] **M5 Home** — hero (17 count), proof strip, derived name marquee, selected work (JIFU360 · RightNowMD · Zowis), spine preview 2024→present, Zowis crossover band, capabilities, lab teaser with live npm counts (6h ISR), contact band; TextReveal/odometers/magnetic CTA deferred to M8
- [x] **M6 Zowis, About, Lab** — Zowis brand page (plum accent, edge-#1 ratio panels, founded date/store/Instagram held as typed NEEDS_INPUT), About with the compact spine variant over all 17 dated entries + §9.5 education at year granularity, grouped stack, ways of working; Lab with live npm counts (6h ISR) and LingoBase — nothing padded
- [x] **M7 Contact + API** — degraded-mode-first: mailto path works end to end with zero env keys (503 → inline error + toast + mailto carrying the typed message); Resend behind `RESEND_API_KEY`; honeypot fake-success, HMAC timing challenge, Turnstile-optional, in-memory rate limit (3/10min, 20/day, `Retry-After`), 60s dedupe registered only on successful send; §17 rows 12–16 covered by 14 unit tests + live curl/browser demos; about-copy.md applied with the count derived from `profile.stats`
- [x] **M7.5 Colour pass** — five-domain palette (owner-approved, bases 5.06–5.16:1, tints ≥16:1, nudged off framework defaults), `domain` axis on all engineering projects, applied in exactly four places (tag, duotone cover, card hover border, case-study rule + fact-rail labels); Zowis rides the plum track accent, LingoBase stays hue-less; spine rail untouched
- [x] **M8 Motion pass** — guard built first (html.js gate + `usePrefersReducedMotion`; hidden states exist only when JS runs and motion is allowed), then: hero TextReveal line masks (pure CSS, 780ms total), Reveal (IO + CSS, 60ms stagger capped at 6, IO-less fallback shows content), Counter rAF odometer (SSR renders final value), MagneticCTA (fine pointers only), marquee/spine-fill already guarded; `motion` dependency removed — nothing needed a library
- [x] **M9 Polish** — OG images via next/og with Bricolage verified rendering in the Edge runtime (static TTF fetch; built-in-face fallback, never a 500), per-case-study cards with track-accent rule; metadataBase + OG/Twitter defaults and per-route canonical/OG; JSON-LD (Person on `/`, Organization on `/zowis`, BreadcrumbList + CreativeWork on case studies); sitemap (14 URLs) + robots; print stylesheet per edge case #28. Image optimisation: no raster assets exist yet (covers are CSS, fonts self-hosted) — `next/image` rules apply when real screenshots land. ⚠ set `NEXT_PUBLIC_SITE_URL` before deploy (domain is a §21 open item)
- [ ] M10 Hardening
