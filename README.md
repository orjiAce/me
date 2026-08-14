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
| M3 The Spine | 185 kB home · 226 kB /work † |

† Measured differently from M1/M2: Next 16 (Turbopack) no longer prints the
per-route size table, so M3 sums the gzipped transfer of every script tag on
the served page. The jump is the uncommitted Next 15 → 16 upgrade in the
working tree, not the spine — motion loads only on `/work` (one extra 40 kB
chunk; home and `/work` otherwise share identical chunks). Re-baseline after
deciding whether to keep Next 16.

## Build progress

- [x] **M1 Foundation** — tokens, fonts, Container/Section, header, footer, 404, security headers
- [x] **M2 Content layer** — full §9 content model, `lib/dates.ts` (35 unit tests, written first), build-time content gate
- [x] **M3 The Spine** — full §9.3 chronology in content (16 projects, corrected dates, `endUnknown` for EvriCent/Delta Digital), spine layout algorithm (lanes, concurrency runs, the 2022 six-way bracketed group), SpineTimeline/SpineEntry/SpineRule components, minimal `/work` page (68 tests)
- [ ] M4 Work index + case studies
- [ ] M5 Home
- [ ] M6 Zowis, About, Lab
- [ ] M7 Contact + API
- [ ] M8 Motion pass
- [ ] M9 Polish
- [ ] M10 Hardening
