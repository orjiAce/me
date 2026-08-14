import type { Project } from "./types";
import { NEEDS_INPUT } from "./profile";
import { validateProjects } from "../lib/dates";

/**
 * Single source of truth for all work — §9.3 / §9.4 (spec v1.2).
 *
 * DATES: this is the authoritative chronology. For RightNowMD, JIFU360,
 * Lenbi and Sinimax the CV dates are wrong and were corrected — the §9.3
 * table wins; do not "fix" them back. EvriCent and Delta Digital have a
 * start month only (`endUnknown`) — never invent an end date.
 *
 * Owner corrections 2026-08-14: Quant Vertex is removed from the project
 * entirely. Lenbi ending 07.2026 while RightNowMD starts 07.2026 is real
 * concurrency (inclusive month semantics) — keep it.
 *
 * `caseStudy` stays false until its MDX body lands in Milestone 4 — the
 * flag asserts "a body exists", not "a body is planned". §9.3 marks
 * RightNowMD, JIFU360, Lenbi, OneWallet MFB, BluetanksEV and Sumotrust
 * for full case studies.
 */
export const projects: Project[] = [
  // ——— Engineering: the dated chronology, start desc (§9.3) ———
  {
    slug: "rightnowmd",
    name: "RightNowMD",
    track: "engineering",
    role: "Lead Mobile Engineer",
    org: "TutuTech",
    location: "Remote, US",
    summary:
      "Telemedicine app in React Native + Expo: four booking paths, VSee video visits, live nurse tracking and DOKITA, an AI medical assistant on Claude.",
    start: "2026-07",
    end: null,
    status: "active",
    stack: [
      "React Native",
      "Expo",
      "TypeScript",
      "Zustand",
      "TanStack Query",
      "Formik + Yup",
      "Reanimated",
      "Socket.IO",
      "Firebase Messaging",
      "VSee ClinicKit",
      "Anthropic API",
      "EAS",
    ],
    highlights: [
      "Built the full app from scratch: separate booking paths for video calls, in-home nurse visits, clinic appointments and provider sessions, each with its own routing and checkout logic.",
      "Integrated VSee ClinicKit for HD consultations via secure SSO token login — patients join without a second sign-in.",
      "Shipped DOKITA, an AI medical chat assistant on the Anthropic API (Claude Sonnet), with auto-detected questionnaires that turn follow-ups into tappable Yes/No answers.",
      "Built live nurse-location tracking over Socket.IO, updating on a map in real time.",
      "Enforced a 15-minute waiting-room join window with UTC comparisons so it holds across time zones; shipped to TestFlight and Google Play via EAS.",
    ],
    featured: true,
    caseStudy: false,
  },
  {
    slug: "sinimax",
    name: "Sinimax",
    track: "engineering",
    role: "Lead Mobile Engineer",
    location: "Abuja, NG",
    summary:
      "Streaming app architected from scratch in React Native, TypeScript and NativeWind — cross-platform video, store-compliant billing, component system.",
    start: "2026-02",
    end: "2026-06",
    // §9.3: render as "Engagement paused by client." No commentary on the contract.
    status: "on-hold",
    stack: [
      "React Native",
      "Expo",
      "TypeScript",
      "NativeWind",
      "Firebase",
      "SuperTokens",
      "Zustand",
      "TanStack Query",
      "Reanimated",
      "Gesture Handler",
    ],
    highlights: [
      "Architected the app from scratch on a component system: Expo, TypeScript and NativeWind.",
      "Built a cross-platform video player with platform-specific fullscreen — native AVPlayerViewController on iOS, a manual absolute-overlay approach on Android — resolving sync and callback edge cases.",
      "Shipped a consumption-only subscription and billing flow compliant with both stores.",
      "Set up Zustand (persist) for global state and TanStack Query for server state with cache invalidation and optimistic updates.",
    ],
    caseStudy: false,
  },
  {
    slug: "jifu360",
    name: "JIFU360",
    track: "engineering",
    role: "Lead Mobile Engineer",
    location: "Dubai, UAE",
    summary:
      "Trading education platform: live Dolby Millicast streaming with native iOS PiP, MT4/MT5 broker connectivity, PubNub chat and a full course academy.",
    start: "2025-11",
    end: "2026-08",
    status: "completed",
    stack: [
      "React Native",
      "TypeScript",
      "WebRTC",
      "Dolby Millicast",
      "PubNub",
      "Swift",
      "FCM",
      "OneSignal",
      "EAS",
    ],
    // §9.3: lead with the 4.8/5 — third-party verified build quality.
    metrics: [
      { value: "4.8/5", label: "iOS rating", note: "from 96 ratings" },
      { value: "17,000+", label: "iOS first-time downloads" },
      { value: "12,500", label: "Play Store downloads" },
    ],
    highlights: [
      "Built the app from scratch on a domain-driven types → service → hooks → screen module pattern.",
      "Shipped live WebRTC streaming on the Dolby Millicast SDK, including native iOS Picture-in-Picture via a custom AVPictureInPictureVideoCallViewController + AVSampleBufferDisplayLayer module with I420 → BGRA frame conversion.",
      "Connected MT4/MT5 brokers through a .NET REST API and a Go WebSocket service for real-time trade placement, trading ideas and copy-trading.",
      "Built real-time chat on PubNub with cross-platform message normalisation and a link-detection moderation pipeline.",
      "Reached users across Spain, Mexico and beyond; CI/CD and OTA through EAS.",
    ],
    featured: true,
    caseStudy: false,
  },
  {
    slug: "lenbi",
    name: "Lenbi",
    track: "engineering",
    role: "Lead Mobile Engineer",
    location: "Remote, CA",
    summary:
      "Peer-to-peer equipment rental marketplace: Stripe Connect payouts, Stripe Identity verification, real-time chat and location search with availability.",
    start: "2025-10",
    end: "2026-07",
    status: "completed",
    stack: [
      "React Native",
      "Expo",
      "TypeScript",
      "Stripe Connect",
      "Stripe Identity",
      "Firebase Storage",
      "React Query",
      "Formik + Yup",
      "FlashList",
      "OneSignal",
    ],
    highlights: [
      "Built real-time chat over WebSockets with message history, Firebase Storage attachments and automatic blocking of personal contact details inside conversations.",
      "Integrated Stripe end to end: Apple Pay, Google Pay, voucher checkout, and Stripe Connect for lender payouts with earnings tracking and bank withdrawal.",
      "Gated listings behind Stripe Identity ID verification, plus full Google and Apple sign-in with loading and cancellation states handled.",
      "Shipped location search with expo-location and Google Places Autocomplete — distance-sorted, category-filtered, with a date-range availability calendar.",
      "Kept long lists fast with FlashList and React Query caching; resolved iOS build conflicts between the Stripe SDK and other native packages.",
    ],
    caseStudy: false,
  },
  {
    slug: "onewallet-mfb",
    name: "OneWallet MFB",
    track: "engineering",
    role: "Lead Mobile Engineer",
    location: "Abuja, NG",
    summary:
      "Mobile banking for a microfinance bank — wallet, transfers, contactless QR payments and biometric 2FA — taken from nothing to live on both stores.",
    start: "2024-06",
    end: "2026-07",
    status: "completed",
    stack: [
      "React Native",
      "TypeScript",
      "Zustand",
      "TanStack Query",
      "Sentry",
      "Biometrics + 2FA",
      "E2E encryption",
    ],
    highlights: [
      "Sole mobile engineer leading a team of designers and one backend developer — set the architecture (MVVM, Zustand) and coding standards, broke features into ClickUp tasks.",
      "Built authentication with biometrics and 2FA, the wallet, payments, instant bank-to-bank transfer, contactless QR payment, push notifications and internationalisation.",
      "Implemented end-to-end encryption, secure storage and token management at bank-grade security.",
      "Wired Sentry for production bug and stability monitoring — crash visibility the team had never had.",
      "Drove the production release through App Store and Google Play review.",
    ],
    caseStudy: false,
  },
  {
    slug: "evricent",
    name: "EvriCent",
    track: "engineering",
    role: "Lead Mobile Engineer",
    summary:
      "AI-powered spending and repayment system with Plaid bank and card linking and Stripe subscriptions, led with a team of designers and a backend developer.",
    start: "2024-02",
    end: null,
    endUnknown: true, // ⚠ NEEDS INPUT: end month (CV shows start only) — renders "02.2024 —"
    status: "completed",
    stack: [
      "React Native CLI",
      "TypeScript",
      "React Query",
      "Plaid",
      "Stripe",
      "Reanimated",
    ],
    highlights: [
      "Integrated the Plaid SDK for bank and credit-card linking.",
      "Built subscriptions on the Stripe SDK.",
      "Shipped Apple and Google social auth, push notifications and in-app messaging.",
      "Led mobile with a team of designers and a backend developer.",
    ],
    caseStudy: false,
  },
  {
    slug: "delta-digital",
    name: "Delta Digital",
    track: "engineering",
    role: "Lead Mobile Engineer",
    summary:
      "Crypto trading app with live Binance price tickers, a Python trading bot and RevenueCat subscriptions — designed in Figma, built pixel-perfect.",
    start: "2023-05",
    end: null,
    endUnknown: true, // ⚠ NEEDS INPUT: end month (CV shows start only) — renders "05.2023 —"
    status: "completed",
    stack: [
      "React Native",
      "TypeScript",
      "Redux",
      "React Query",
      "RevenueCat",
      "Python",
      "Figma",
    ],
    metrics: [
      { value: "15%", label: "Codebase reduction", note: "via reusable components" },
    ],
    highlights: [
      "Wired the Binance price-ticker API for live crypto prices.",
      "Built a trading-bot feature in Python.",
      "Designed the full app UI in Figma and translated it to pixel-perfect React Native.",
      "Shipped Apple in-app purchase and subscriptions via RevenueCat.",
    ],
    caseStudy: false,
  },
  {
    slug: "gateway-edu",
    name: "Gateway Edu",
    track: "engineering",
    role: "Head of Mobile",
    location: "NG / UK",
    summary:
      "Crypto education platform used across Nigeria, the UK and other African markets — gaming adventure system, communities, Web3 — shipped in 4 months.",
    start: "2022-06",
    end: "2024-02",
    status: "completed",
    stack: [
      "React Native",
      "React Navigation",
      "React Query",
      "Firebase Cloud Messaging",
      "AppsFlyer",
      "Web3",
    ],
    metrics: [{ value: "4", label: "Months to both stores" }],
    highlights: [
      "Set the scalable architecture on React Native + React Navigation as head of mobile.",
      "Built Google, Apple and Facebook OAuth, and React Query caching over REST.",
      "Shipped a gaming adventure system awarding points on completion, and Web3 gaming integrated with a team of game character designers.",
      "Built the interactive community system — create communities, post, like, comment, block, leave.",
      "Wired Firebase Cloud Messaging push and AppsFlyer analytics and attribution.",
    ],
    caseStudy: false,
  },
  {
    slug: "brace-finance",
    name: "Brace Finance",
    track: "engineering",
    role: "Engineering Lead",
    summary:
      "DeFi app for buying, saving, sending and swapping crypto — Skia-drawn virtual cards and a full identity-verification architecture.",
    start: "2022-06",
    end: "2023-01",
    status: "completed",
    stack: ["React Native", "TypeScript", "Skia", "Sentry", "EAS"],
    metrics: [
      { value: "20%", label: "Crash rate cut", note: "on low-end Android" },
    ],
    highlights: [
      "Interpreted complex Figma UI into React Native, using Skia for the virtual-card UI.",
      "Built an identity architecture verifying every user via live images, facial recognition, biometrics and government-issued ID.",
      "Integrated Sentry and optimised API calls, cutting the crash rate 20% on low-end Android.",
      "Mentored junior and mid-level engineers and grew the team; shipped via EAS.",
    ],
    caseStudy: false,
  },
  {
    slug: "portsconnect",
    name: "PortsConnect",
    track: "engineering",
    role: "Lead Mobile Engineer",
    summary:
      "Scheduling and appointments platform — built the v2.0 real-time business↔customer chat and the subscription tier that created revenue.",
    start: "2022-06",
    end: "2023-03",
    status: "completed",
    stack: [
      "React Native",
      "React.js",
      "Redux",
      "React Query",
      "Socket.IO",
      "TypeScript",
      "EAS",
    ],
    metrics: [
      { value: "3,000+", label: "Businesses onboarded", note: "within months of the chat release" },
    ],
    highlights: [
      "Built the v2.0 real-time business↔customer chat on Socket.IO.",
      "Shipped a subscription tier that opened more features and created revenue.",
      "Frontend engineer in a team of four, across mobile and web; shipped to both stores via EAS.",
    ],
    caseStudy: false,
  },
  {
    slug: "bluetanks-ev",
    name: "BluetanksEV",
    track: "engineering",
    role: "Lead Mobile Engineer",
    location: "United States",
    summary:
      "Smart navigation to the nearest EV charging station anywhere in the US, sortable by fastest or cheapest — 35,000 stations onboarded.",
    start: "2022-05",
    end: "2022-10",
    status: "completed",
    stack: [
      "React Native",
      "Expo",
      "Google Maps",
      "Google Places",
      "Stripe",
    ],
    metrics: [{ value: "35,000", label: "Charging stations onboarded" }],
    highlights: [
      "Built the live-location architecture locating stations from the user's current position, with Google Maps and Google Places API for navigation.",
      "Shipped the Stripe payment flow and Expo push notifications.",
      "Built an admin dashboard for registered charging stations.",
    ],
    caseStudy: false,
  },
  {
    slug: "sumotrust",
    name: "Sumotrust",
    track: "engineering",
    role: "Lead Full-Stack Engineer",
    summary:
      "Naira savings and investment across mobile and web — designed from user research, managing funds for 10,000+ users worldwide.",
    start: "2022-01",
    end: "2023-02",
    status: "completed",
    stack: [
      "React Native",
      "React",
      "TypeScript",
      "React Query",
      "Redux",
      "Biometrics",
    ],
    metrics: [{ value: "10,000+", label: "Users' funds managed" }],
    highlights: [
      "Designed the products through user research, then built them in React Native and React with TypeScript.",
      "Built a naira savings system for local-currency deposits earning APY, and — with a backend engineer — a secure investment and money-gifting system.",
      "Hardened the clients: console statements stripped in production, keys in .env, tokens in secure store, biometric or PIN authentication.",
    ],
    caseStudy: false,
  },
  {
    slug: "truzact",
    name: "Truzact",
    track: "engineering",
    role: "Full-Stack Engineer",
    location: "Nigeria",
    summary:
      "Centralised-exchange crypto savings and investment, mobile and web — 80+ live-priced assets and a crowdfunding release that added 1,000 users in two weeks.",
    start: "2020-11",
    end: "2022-04",
    status: "completed",
    stack: [
      "React Native",
      "Expo",
      "TypeScript",
      "Redux Toolkit",
      "React Query",
      "CoinGecko API",
      "Chakra UI",
    ],
    metrics: [
      { value: "1,000", label: "Users added in two weeks", note: "by the crowdfunding release" },
    ],
    highlights: [
      "Designed the UI in Figma from user research and built it on React Native (Expo managed), Redux and TypeScript.",
      "Powered a live price ticker across 80+ assets on CoinGecko infrastructure.",
      "Built a crowdfunding/donation system for raising money from family and friends.",
      "Wrote custom wallet-address authentication with regex rather than pulling an npm package; cached server state with React Query and client state with Redux Toolkit.",
    ],
    caseStudy: false,
  },
  {
    slug: "crowdfacture",
    name: "Crowdfacture",
    track: "engineering",
    role: "Full-Stack Engineer",
    summary:
      "Community-driven investment platform — hi-fi interface designed in Figma, web app in React.js, iOS/Android app in React Native, published to both stores.",
    start: "2019-09",
    end: "2021-10",
    status: "completed",
    stack: ["React.js", "React Native", "Expo", "Redux", "Figma"],
    highlights: [
      "Designed the hi-fi interface in Figma.",
      "Built the web app in React.js + Redux and the iOS/Android app in React Native (Expo) + Redux.",
      "Published to both stores.",
    ],
    caseStudy: false,
  },
  {
    slug: "checkncommit",
    name: "CheckNCommit",
    track: "engineering",
    role: "Full-Stack Engineer",
    summary:
      "Business rating platform, TrustPilot-shaped: membership businesses, free customer accounts, offline-deal ratings — built solo, end to end.",
    start: "2019-10",
    end: "2020-08",
    status: "completed",
    stack: [
      "React.js",
      "Redux",
      "Firebase Cloud Functions",
      "Node.js",
      "Express",
      "Adobe XD",
    ],
    highlights: [
      "Sole engineer on the platform: businesses register on a membership plan, customers who dealt with them offline leave ratings from free accounts.",
      "Built the frontend in React.js (class components) with Redux.",
      "Built the backend on Firebase Cloud Functions with Node.js and Express; designed the UI in Adobe XD.",
    ],
    caseStudy: false,
  },

  // ——— Engineering: held off the spine (§9.3 UWA rule) ———
  {
    // ⚠ NEEDS INPUT before this can go on the spine: role, client, dates,
    // stack, and whether it shipped. Until supplied it stays archived and
    // excluded — do not guess a date to place it.
    slug: "uwa",
    name: "UWA",
    track: "engineering",
    role: NEEDS_INPUT,
    summary:
      "Digital workforce platform for construction — employers post jobs, verify and pay workers; workers build profiles, portfolios and careers.",
    start: null,
    end: null,
    status: "archived",
    stack: [],
    highlights: [],
    caseStudy: false,
  },

  // ——— Founder track (§9.4) ———
  {
    slug: "zowis",
    name: "Zowis Fashion Limited",
    track: "founder",
    role: "Founder",
    summary:
      "Women's fashion brand with its own e-commerce, logistics and ads infrastructure — founded, built and run end to end.",
    start: null, // ⚠ NEEDS INPUT: founding month — unlocks spine placement
    end: null,
    status: "active",
    stack: ["Supabase", "GUO Logistics API", "Meta Business Suite"],
    highlights: [
      "Built the commerce backend on Supabase, including remediating a critical RLS misconfiguration.",
      "Integrated the GUO logistics API for delivery.",
      "Set up Meta Business Suite and the ad account infrastructure.",
      "Run the company end to end: filings, operations and brand.",
    ],
    featured: true,
    caseStudy: false,
  },
  {
    slug: "lingobase",
    name: "LingoBase",
    track: "founder",
    role: "Founder & Engineer",
    summary:
      "Developer-facing translation API on a multi-tenant Supabase backend with dual Paystack + Stripe billing. In development.",
    start: null, // ⚠ NEEDS INPUT: start month
    end: null,
    status: "active",
    stack: [
      "Supabase",
      "Azure Translator",
      "Paystack",
      "Stripe",
      "Tailwind CSS",
      "shadcn/ui",
    ],
    highlights: [
      "Built a multi-tenant Supabase backend for the translation API.",
      "Wired dual billing — Paystack for African markets, Stripe internationally.",
      "Building Nigerian-language TTS across Yoruba, Igbo and Hausa as the differentiator.",
    ],
    caseStudy: false,
  },
];

// Build-time assertion (edge cases #30/#31): importing this module with a
// duplicate slug or malformed date fails the build, naming the slug.
validateProjects(projects);

/** Dated, non-archived — everything that docks to the spine (§7). */
export const spineProjects = projects.filter(
  (p): p is Project & { start: string } =>
    p.start !== null && p.status !== "archived",
);

/** Undated, non-archived — cannot dock to the spine until dates arrive. */
export const undatedWork = projects.filter(
  (p) => p.start === null && p.status !== "archived",
);

/** Home "Selected work" — §10.1.5: JIFU360, RightNowMD, Zowis, deliberately. */
export const featuredProjects = projects.filter((p) => p.featured);

export const projectBySlug = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug);
