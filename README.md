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

## Build progress

- [x] **M1 Foundation** — tokens, fonts, Container/Section, header, footer, 404, security headers
- [ ] M2 Content layer
- [ ] M3 The Spine
- [ ] M4 Work index + case studies
- [ ] M5 Home
- [ ] M6 Zowis, About, Lab
- [ ] M7 Contact + API
- [ ] M8 Motion pass
- [ ] M9 Polish
- [ ] M10 Hardening
