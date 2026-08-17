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
 * `caseStudy: true` asserts an MDX body exists in content/case-studies/
 * (the build gate verifies this). Nine case studies (§9.3 as amended
 * v4): RightNowMD, JIFU360, Lenbi, OneWallet MFB, UWA, Nexaflex,
 * BluetanksEV, Sumotrust and Leadership News (page live once dated).
 * Everything else is spine-only.
 *
 * Amendment v3 (2026-08-14): UWA unarchived with README-sourced data;
 * Nexaflex added (dates owner-confirmed: 2025-01 → 2025-11, completed);
 * Leadership News held with links only; store/website links on seven
 * projects — rendered as mono text links, never store badge images.
 */
export const projects: Project[] = [
  // ——— Engineering: the dated chronology, start desc (§9.3) ———
  {
    slug: "rightnowmd",
    name: "RightNowMD",
    track: "engineering",
    domain: "health",
    role: "Lead Mobile Engineer",
    org: "TutuTech",
    location: "Remote, US",
    summary:
      "Telemedicine app in React Native + Expo: four booking paths, VSee video visits and live nurse tracking. Plus DOKITA, an AI medical assistant on Claude.",
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
    cover: {
      src: "/images/work/rightnowmd/cover.png",
      alt: "Three RightNowMD screens: a booking menu offering DOKITA AI, a $50 telemedicine video call, a $200 provider visit or a clinic visit; the DOKITA AI assistant introducing itself above a medical disclaimer; and a My Sessions list of active AI triage and nurse visits.",
      ratio: "4/5",
    },
    featured: true,
    icon: { src: "/images/work/rightnowmd/icon.png", alt: "" },
    caseStudy: true,
  },
  {
    slug: "sinimax",
    name: "Sinimax",
    track: "engineering",
    domain: "media",
    role: "Lead Mobile Engineer",
    location: "Abuja, NG",
    summary:
      "Streaming app architected from scratch in React Native, TypeScript and NativeWind: cross-platform video, store-compliant billing, component system.",
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
    icon: { src: "/images/work/sinimax/icon.png", alt: "" },
    caseStudy: false,
  },
  {
    slug: "jifu360",
    name: "JIFU360",
    track: "engineering",
    domain: "media",
    role: "Lead Mobile Engineer",
    location: "Dubai, UAE",
    summary:
      "Trading education platform: live Dolby Millicast streaming with native iOS PiP and MT4/MT5 broker connectivity. Plus PubNub chat and a full course academy.",
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
    links: [
      { label: "App Store", href: "https://apps.apple.com/ng/app/jifu-360/id6756445902" },
      { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.jifu360.app" },
    ],
    cover: {
      src: "/images/work/jifu360/cover.png",
      alt: "Three JIFU360 screens: a dashboard welcoming a member into the academy above a promotional carousel; a five-minute Bitcoin candlestick chart with the drawing toolbar open; and a Market Ideas screen with FX and crypto idea channels and a EURUSD buy idea marked active.",
      ratio: "16/10",
    },
    featured: true,
    icon: { src: "/images/work/jifu360/icon.png", alt: "" },
    caseStudy: true,
  },
  {
    slug: "lenbi",
    name: "Lenbi",
    track: "engineering",
    domain: "marketplace",
    role: "Lead Mobile Engineer",
    location: "Remote, CA",
    summary:
      "Peer-to-peer equipment rental marketplace: Stripe Connect payouts and Stripe Identity verification. Real-time chat and location search with availability.",
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
    links: [
      { label: "App Store", href: "https://apps.apple.com/ng/app/lenbi/id6751556858" },
      { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.lenbi.mobile.app" },
    ],
    icon: { src: "/images/work/lenbi/icon.png", alt: "" },
    cover: {
      src: "/images/work/lenbi/cover.png",
      alt: "Four Lenbi screens: a home feed toggling between borrowing and lending with featured items priced per day; a listings view where an owner approves or declines booking requests; an item detail with rental fees, rating and rental period; and a profile showing rental and listing earnings beside a points and rewards tier.",
      ratio: "16/9",
    },
    caseStudy: true,
  },
  {
    // Amendment v3 §2. Dates owner-confirmed 2026-08-14: 2025-01 → 2025-11,
    // completed. Role title ⚠ NEEDS INPUT (README doesn't state it);
    // location ⚠ NEEDS INPUT.
    slug: "nexaflex",
    name: "Nexaflex",
    track: "engineering",
    role: "Lead Mobile Engineer",
    domain: "fintech",
    summary:
      "A crypto-native finance app: multi-chain wallet, USD virtual card, Nigerian bill payments and ticketing. All behind a security layer built for coercion.",
    start: "2025-01",
    end: "2025-11",
    status: "completed",
    stack: [
      "React Native",
      "Expo",
      "TypeScript",
      "React Navigation",
      "TanStack Query",
      "Zustand",
      "expo-secure-store",
      "react-native-keychain",
      "MMKV",
      "Formik + Yup",
      "Reanimated",
      "FlashList",
      "OneSignal",
      "EAS",
    ],
    highlights: [
      "Rebuilt the app around a security architecture: per-account SecureLockManager, panic mode unlocking into a decoy state for coercion scenarios, biometric unlock, a passkey gating high-value actions and AppState-driven auto-lock.",
      "Built the quote-polling engine — quotes auto-refresh, expire, back off after failures and re-validate before submission, so a user never signs a stale price.",
      "Shipped a multi-chain wallet across eight chains with per-network deposit addresses and ERC20/TRC20/BEP20 abbreviation handling.",
      "Delivered a USD virtual card, Nigerian bill payments from a crypto balance, and QR event ticketing.",
      "Kept unreliable networks usable: 24-hour persisted query state, resilient balance hooks surfacing cache age, and MMKV on the synchronous hot path.",
    ],
    cover: {
      src: "/images/work/nexaflex/cover.png",
      alt: "Four Nexaflex screens: a portfolio home showing a $629.00 balance with send, receive and pay-bills actions; an events browser with upcoming and nearby events; a bills menu covering airtime and data, electricity, cable TV and betting wallets; and a USD virtual card above its transaction history.",
      ratio: "16/10",
    },
    links: [
      { label: "Website", href: "https://www.nexaflex.com/" },
      { label: "App Store", href: "https://apps.apple.com/ng/app/nexaflex/id6745123491" },
      { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.nexaflex.mobile.app" },
    ],
    caseStudy: true,
  },
  {
    slug: "onewallet-mfb",
    name: "OneWallet MFB",
    track: "engineering",
    domain: "fintech",
    role: "Lead Mobile Engineer",
    location: "Abuja, NG",
    summary:
      "Mobile banking for a microfinance bank: wallet, transfers, contactless QR payments and biometric 2FA. Taken from nothing to live on both stores.",
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
    cover: {
      src: "/images/work/onewallet-mfb/cover.png",
      alt: "Three OneWallet MFB screens: a merchant dashboard showing a 60,000 naira balance with the day's takings and commission, biller shortcuts and store, POS and QR services; an instalment payment plan open on a handheld phone; and a shareable scan-to-pay QR poster with the account details beneath it.",
      ratio: "16/10",
    },
    links: [
      { label: "Website", href: "https://www.onewalletweb.com/" },
      // ⚠ Listing is "OneWallet Business" — confirm it is this app, not a
      // sibling, before shortening the label to plain "App Store" (§4 note).
      { label: "App Store (OneWallet Business)", href: "https://apps.apple.com/ng/app/onewallet-business/id6744119883" },
      { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.onewallet.business.app" },
    ],
    icon: { src: "/images/work/onewallet-mfb/icon.png", alt: "" },
    caseStudy: true,
  },
  {
    // Amendment v3 §1 — unarchived with full data from the project README.
    slug: "uwa",
    name: "UWA",
    track: "engineering",
    role: "Lead Mobile Engineer",
    org: "Uwa",
    location: "Nigeria",
    domain: "marketplace",
    summary:
      "Nigeria's marketplace for skilled and unskilled labour: the full employment lifecycle for employers and workers in one React Native binary.",
    start: "2024-06",
    end: "2026-07",
    status: "completed",
    stack: [
      "React Native",
      "Expo",
      "TypeScript",
      "React Navigation",
      "TanStack Query",
      "Zustand",
      "axios",
      "Formik + Yup",
      "FlashList",
      "Reanimated",
      "Paystack",
      "OneSignal",
      "expo-print",
      "EAS",
    ],
    // ⚠ Amendment: no download/user/transaction numbers supplied — no
    // metrics, no numeric impact line.
    highlights: [
      "Carried the whole employment lifecycle for both sides of the market in one binary — one navigation shell reshaping itself on user_class rather than duplicating screens per role.",
      "Built Bulk Labour Requests: multi-role staffing with per-role headcount, in-thread messaging, invoicing, full or instalment Paystack payment and PDF export.",
      "Shipped the talent side end to end: search and best-match scoring, application timelines, in-app résumé and portfolio, clock-in/clock-out attendance, and a wallet with Nigerian bank withdrawals.",
      "Ran Paystack checkout through expo-web-browser's auth session with deep-link returns — no WebView hacks — reused across job activation and invoices.",
      "Closed a 13-milestone web→mobile parity programme feature by feature, recording deliberate divergences instead of porting screen-for-screen.",
    ],
    links: [
      { label: "Website", href: "https://uwa.ng" },
      { label: "Google Play", href: "https://play.google.com/store/apps/details?id=ng.uwamobile.app" },
    ],
    icon: { src: "/images/work/uwa/icon.png", alt: "" },
    cover: {
      src: "/images/work/uwa/cover.png",
      alt: "Four UWA screens: a construction job feed with percentage-match badges on each listing; a My Jobs feed showing site-engineer roles with salary and location; an application-submitted confirmation; and the employer dashboard, where posted roles sit in an approved, under-review or shortlisted state above ongoing projects.",
      ratio: "2/1",
    },
    caseStudy: true,
  },
  {
    slug: "evricent",
    name: "EvriCent",
    track: "engineering",
    domain: "fintech",
    role: "Lead Mobile Engineer",
    summary:
      "AI-powered spending and repayment system with Plaid bank and card linking and Stripe subscriptions. Led with a team of designers and a backend developer.",
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
    domain: "fintech",
    role: "Lead Mobile Engineer",
    summary:
      "Crypto trading app with live Binance price tickers, a Python trading bot and RevenueCat subscriptions. Designed in Figma, built pixel-perfect.",
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
    domain: "media",
    role: "Head of Mobile",
    location: "NG / UK",
    summary:
      "Crypto education platform used across Nigeria, the UK and other African markets: gaming adventure system, communities, Web3. Shipped in 4 months.",
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
    domain: "fintech",
    role: "Engineering Lead",
    summary:
      "DeFi app for buying, saving, sending and swapping crypto: Skia-drawn virtual cards and a full identity-verification architecture.",
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
    domain: "marketplace",
    role: "Lead Mobile Engineer",
    summary:
      "Scheduling and appointments platform: built the v2.0 real-time business↔customer chat and the subscription tier that created revenue.",
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
    cover: {
      src: "/images/work/portsconnect/cover.png",
      alt: "Three PortsConnect screens: a role picker offering a personal account that books appointments or an organisation account that approves and declines them; a login screen; and a home screen with an appointment-booking entry point above the day's appointment, showing the staff member and time slot.",
      ratio: "16/10",
    },
    caseStudy: false,
  },
  {
    slug: "bluetanks-ev",
    name: "BluetanksEV",
    track: "engineering",
    domain: "mobility",
    role: "Lead Mobile Engineer",
    location: "United States",
    summary:
      "Smart navigation to the nearest EV charging station anywhere in the US, sortable by fastest or cheapest. 35,000 stations onboarded.",
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
    links: [
      { label: "App Store", href: "https://apps.apple.com/ng/app/bluetanks-ev/id1637245676" },
    ],
    icon: { src: "/images/work/bluetanks-ev/icon.png", alt: "" },
    cover: {
      src: "/images/work/bluetanks-ev/cover.png",
      alt: "Four BluetanksEV screens: a sign-up screen over an illustration of a car at a charge point; a home screen with charge, vehicle-to-grid, navigation and payment tiles above a utilisation history listing each charge point's energy delivered, duration and amount paid; the BlueTanks Pay card with its balance and transaction history; and the EVox community feed, where drivers report non-functional stations.",
      ratio: "16/9",
    },
    caseStudy: true,
  },
  {
    slug: "sumotrust",
    name: "Sumotrust",
    track: "engineering",
    domain: "fintech",
    role: "Lead Full-Stack Engineer",
    summary:
      "Naira savings and investment across mobile and web, designed from user research. Manages funds for 10,000+ users worldwide.",
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
    caseStudy: true,
  },
  {
    slug: "truzact",
    name: "Truzact",
    track: "engineering",
    domain: "fintech",
    role: "Full-Stack Engineer",
    location: "Nigeria",
    summary:
      "Centralised-exchange crypto savings and investment, mobile and web. 80+ live-priced assets and a crowdfunding release that added 1,000 users in two weeks.",
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
    domain: "fintech",
    role: "Full-Stack Engineer",
    summary:
      "Community-driven investment platform: hi-fi interface designed in Figma, web app in React.js, iOS/Android app in React Native. Published to both stores.",
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
    domain: "marketplace",
    role: "Full-Stack Engineer",
    summary:
      "Business rating platform, TrustPilot-shaped: membership businesses, free customer accounts, offline-deal ratings. Built solo, end to end.",
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

  // ——— Engineering: held off the spine ———
  {
    // Amendment v4 (2026-08-15) — full entry and case-study body from the
    // project README. ⚠ role and start/end are the ONLY unsourced fields:
    // do not assume "Lead Mobile Engineer", do not infer dates. Archived
    // and off the spine until both arrive (status → "completed" then);
    // the case-study page 404s while undated. Counts stay 17 until dated.
    slug: "leadership-news",
    name: "Leadership News",
    track: "engineering",
    role: "Lead Mobile Engineer",
    org: "Leadership Newspaper",
    location: "Nigeria",
    domain: "media",
    summary:
      "The official Leadership Newspaper app: the full paper on a phone, with Gemini reading aids and seven locales including Igbo, Hausa and Yoruba.",
    start: "2025-11",
    end: "2026-05",
    // v4 §1: archived → completed once dated. Arrived as "active" with a
    // past end date — impossible; completed per the amendment's own note.
    status: "completed",
    stack: [
      "React Native",
      "Expo",
      "TypeScript",
      "React Navigation",
      "TanStack Query",
      "Zustand",
      "MMKV",
      "Google Gemini",
      "Reanimated",
      "FlashList",
      "react-native-pdf",
      "react-native-video",
      "Formik + Yup",
      "OneSignal",
      "EAS",
    ],
    highlights: [
      "Carried the whole paper onto a phone: a personalised For You feed, news-flash carousel, WhatsApp-style stories, vertical shorts, long-form video and a PDF e-paper replica.",
      "Integrated Google Gemini reading aids — on-demand summaries, key points and insights across three models, with streaming generation and a client-side cache.",
      "Built a custom seven-locale i18n layer in-house — English, French, Dutch, Spanish, Igbo, Hausa and Yoruba.",
      "Made reading offline-first: TanStack Query state persisted to MMKV for 24 hours, so cold starts open with real articles instead of spinners.",
      "Centralised networking in a singleton axios client — JWT attachment, token-expiry buffering, global 401 handling; screens never touch axios directly.",
    ],
    cover: {
      src: "/images/work/leadership-news/cover.png",
      alt: "Four Leadership News screens: a top-news feed with a story-circle rail above the lead article; a full-screen story card opened mid-article; a sports highlights list of Premier League video clips; and the e-newspaper shelf showing dated front pages of the printed paper.",
      ratio: "16/10",
    },
    links: [
      { label: "App Store", href: "https://apps.apple.com/ng/app/leadership-news/id6749127071" },
      { label: "Google Play", href: "https://play.google.com/store/apps/details?id=ng.leadershipnews.app" },
    ],
    caseStudy: true,
  },

  // ——— Founder track (§9.4) ———
  {
    slug: "zowis",
    name: "Zowis Fashion Limited",
    track: "founder",
    role: "Founder",
    summary:
      "A women's fashion brand I founded. I built its e-commerce and logistics infrastructure and I run it.",
    start: "2025-11",
    end: null,
    status: "active",
    stack: ["Supabase", "GIG Logistics API", "Meta Business Suite"],
    cover: {
      src: "/images/work/zowis/cover.png",
      alt: "The Zowis storefront at wearzowis.com — two models in red ruffled dresses beside the debut-collection headline 'A tasteful garment that truly celebrates your form.'",
      ratio: "16/10",
    },
    links: [{ label: "Website", href: "https://www.wearzowis.com" }],
    highlights: [
      "Built the commerce backend on Supabase, including remediating a critical RLS misconfiguration.",
      "Integrated the GIG logistics API for delivery.",
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
