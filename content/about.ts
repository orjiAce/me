/**
 * About page content — §10.5, with §9.5 education and certifications.
 * Bio and ways-of-working are written to §5.7 voice from §9 facts only.
 */

/** First-person bio — 7+ years, first shipped app → lead, why remote, why fashion. */
export const bio = [
  "I'm Joseph Orji — Ace. I've been shipping mobile products since 2019. The first was CheckNCommit, a business rating platform I built alone: frontend, backend, and the UI design. Seventeen shipped products later, the work spans telemedicine, trading, banking, marketplaces, EV infrastructure and education, most of it as the lead engineer.",
  "I work as a fully remote contractor under Brains Digital Software Technology, from Abuja. The contracts run concurrently by design — at the peak, five at once — and the work index shows that overlap as it actually happened, lane by lane.",
  "Zowis Fashion Limited is the other track. I founded it, I run it, and I built its infrastructure myself: the Supabase commerce backend, the logistics integration, the ads account. Running my own company changes how I build for other people's — I've been on the side that pays for the software.",
];

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
