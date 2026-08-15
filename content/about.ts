import { profile } from "./profile";

/**
 * About page content — §10.5, with §9.5 education and certifications.
 * The bio is the owner-supplied about-copy.md (2026-08-14) — first
 * person, §5.7 voice, every claim tracing to content/projects.ts.
 * Backtick spans render as inline code.
 */

// Per the copy's executor notes: the product count reads from
// profile.stats so it can't drift again. Word form with numeral fallback.
const COUNT_WORDS: Record<string, string> = {
  "15": "Fifteen", "16": "Sixteen", "17": "Seventeen",
  "18": "Eighteen", "19": "Nineteen", "20": "Twenty",
};
const shipped =
  profile.stats.find((s) => s.label === "Products shipped")?.value ?? "17";
const since =
  profile.stats.find((s) => s.label === "Shipping since")?.value ?? "2019";
const shippedWord = COUNT_WORDS[shipped] ?? shipped;

export type BioBlock = { heading?: string; paragraphs: string[] };

export const bioBlocks: BioBlock[] = [
  {
    paragraphs: [
      "I build React Native apps where the hard part isn't the screens. It's the real-time video, the payment rails, the native module nobody wants to write, or the AI layer that has to hold up in production.",
      `${shippedWord} products shipped since ${since}, for clients in the US, Canada, Dubai, the UK and Nigeria. Seven years of it, most as the lead mobile engineer and often as the only one.`,
    ],
  },
  {
    heading: "Live video and native modules",
    paragraphs: [
      "A WebRTC streaming system for a Dubai trading platform on the Dolby Millicast SDK, including native iOS Picture-in-Picture through a custom `AVPictureInPictureVideoCallViewController` with I420 → BGRA frame conversion — the off-the-shelf SDK couldn't do it, so I wrote it. HD telemedicine consultations through VSee ClinicKit with SSO token login, so patients join a call without a second sign-in.",
    ],
  },
  {
    heading: "AI in production",
    paragraphs: [
      // Amendment v4: two model providers in production — name both.
      "DOKITA, a medical chat assistant running on the Anthropic API, with questionnaire auto-detection that turns clinical follow-up questions into tappable answers instead of free text. And a Google Gemini reading layer for Leadership News, one of Nigeria's national dailies — on-demand summaries, key points and deeper insights, streamed and cached client-side. Two model providers, both in production.",
      // Amendment v4: the Igbo/Hausa/Yoruba thread, in one sentence.
      "The languages are a through-line: Leadership News ships in seven locales including Igbo, Hausa and Yoruba — the same three LingoBase, my own translation API, is building text-to-speech for.",
    ],
  },
  {
    heading: "Money, and moving it safely",
    paragraphs: [
      "MT4/MT5 broker connectivity for real-time trade placement and copy-trading. Stripe Connect payouts and Stripe Identity verification for a rental marketplace. A wallet, instant bank-to-bank transfers, biometrics, 2FA and end-to-end encryption for a microfinance bank. A multi-chain crypto wallet across eight networks with a USD virtual card and Nigerian bill payments, where every quote refreshes on a timer and revalidates before submission so nobody signs a stale price. Escrow-backed job payments and bulk-labour invoicing through Paystack.",
    ],
  },
  {
    heading: "Security when the threat model is physical",
    paragraphs: [
      "For a crypto app used in Nigeria, I built a second PIN that unlocks the phone into a decoy state — balances mask, the tab bar swaps out, nothing sensitive is reachable. It exists for coercion, not convenience. Alongside it: per-user app locks that wipe the previous user's credentials on device handover, a passkey gate on high-value actions, and idle auto-lock.",
    ],
  },
  {
    heading: "Real-time systems",
    paragraphs: [
      "Live location tracking over Socket.IO so a patient can watch their nurse approach on a map. PubNub chat with a link-detection moderation pipeline. WebSocket messaging that blocks users from trading contact details inside a marketplace conversation.",
    ],
  },
  {
    heading: "How I work",
    paragraphs: [
      "I also run Zowis Fashion Limited, a women's fashion brand I founded — and I build and maintain its infrastructure myself: the Supabase commerce backend, delivery through the GUO logistics API, the ads stack, the filings. It changes how I build for other people. When you've had to answer for an outage on your own storefront, you stop treating reliability as somebody else's column.",
    ],
  },
  {
    heading: "Stack",
    paragraphs: [
      "React Native (Expo and CLI), TypeScript, Zustand, TanStack Query, Reanimated. Node.js, Express, Firebase, Supabase, GraphQL. Swift and Kotlin when a native module has to be written from scratch.",
      "I've taken apps through App Store and Google Play review many times over — EAS builds, OTA updates, permissions, compliance, submission. I maintain two open-source React Native packages, `rn-credit-card-textinput` and `rn-slick-bottom-tabs`.",
      "Comfortable leading a mobile team, or working solo as the only mobile engineer on a product.",
    ],
  },
];

/** Sits directly above the compact spine — the caption for it. */
export const concurrencyNote =
  "Most of these ran at the same time. Through 2026 I was carrying five contracts concurrently, and in 2022 six. The timeline on this site shows that as parallel lanes rather than a stack, because that's what it was.";

// The copy's closing line ("Tell me what you're building…") is dropped:
// the contact band already ends the page with a CTA — don't say it twice.

/** §9.5 — rendered as quiet rows, year ranges as given (no invented months). */
export const education = [
  {
    institution: "Zero To Mastery Academy",
    award: "Computer Software Engineering",
    years: "2019 – 2020",
  },
  {
    institution: "Petroleum Training Institute",
    award: "High School Diploma, Computer Science & IT",
    years: "2017 – 2020",
  },
  {
    institution: "Abia State Polytechnic",
    award: "National Diploma, Computer Science",
    years: "2014 – 2016",
  },
];

/** §9.5 — a quiet mono list, not badges. */
export const certifications = [
  "Design Thinking — Understanding the Process",
  "React Hooks",
];

/**
 * §10.5.3 — grouped columns, not a logo soup. Rule of inclusion: every
 * entry appears in at least one §9.3 project.
 */
export const stackGroups: { label: string; items: string }[] = [
  {
    label: "Mobile",
    items:
      "React Native (Expo + CLI), TypeScript, Swift, Kotlin, Reanimated, Gesture Handler, Skia, NativeWind, FlashList, EAS",
  },
  {
    label: "State & data",
    items:
      "Zustand (persist, MMKV), Redux / Redux Toolkit, TanStack Query, GraphQL, Formik + Yup",
  },
  {
    label: "Backend",
    items:
      "Node.js, Express, Firebase (Auth, Storage, Cloud Functions, FCM), Supabase, SuperTokens, Go, PHP, SQL",
  },
  {
    label: "Payments & identity",
    items:
      "Stripe (Connect, Identity, Apple/Google Pay), Paystack, Plaid, RevenueCat, biometrics + 2FA, E2E encryption",
  },
  {
    label: "Real-time & media",
    items:
      "WebRTC (Dolby Millicast), native iOS PiP, Socket.IO, PubNub, VSee ClinicKit, react-native-video",
  },
  { label: "AI", items: "Anthropic API (Claude), Azure Translator" },
  {
    label: "Ops",
    items:
      "Sentry, OneSignal, AppsFlyer, Google Maps & Places, ClickUp, Figma",
  },
];

/** §10.5.4 — four short statements. */
export const waysOfWorking = [
  {
    label: "Remote-first",
    body: "Fully remote from Abuja, and set up for it — every engagement since 2019 has been delivered that way.",
  },
  {
    label: "Contract length",
    body: "3–6 month engagements preferred; several have renewed into multi-year runs.",
  },
  {
    label: "Timezone",
    body: "WAT (UTC+1): full overlap with Europe, mornings with North America.",
  },
  {
    label: "Handover",
    body: "Typed codebases, architecture set down early, tasks broken out in the open, Sentry wired before release — teams keep shipping after I leave.",
  },
];
