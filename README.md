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
| M5 Home | **150 kB** † (149 kB `/work` · 106 kB `/work/[slug]`) |

† Over the 130 kB home budget: the §10.1.6 spine preview mounts the full
Spine component, whose scroll-fill imports motion (~44 kB chunk). The M8
motion pass owns the fix — either LazyMotion/`m` or replacing the fill's
`useScroll` with a ~1 kB rAF listener — before M10 enforces the budget.

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
- [ ] M6 Zowis, About, Lab
- [ ] M7 Contact + API
- [ ] M8 Motion pass
- [ ] M9 Polish
- [ ] M10 Hardening
