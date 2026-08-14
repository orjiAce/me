import type { Project } from "./types";
import { NEEDS_INPUT } from "./profile";
import { validateProjects } from "../lib/dates";

/**
 * Single source of truth for all work — §9.3 / §9.4.
 *
 * DATES: the windows for RightNowMD, JIFU360, Lenbi and Sinimax are the
 * corrected §9.3 values. They supersede the CV — do not "fix" them back.
 *
 * `start: null` marks an undated engagement (⚠ NEEDS INPUT months). Those
 * render in "Earlier work", ordered by this array's order, never on the
 * spine. No dates are guessed.
 *
 * `caseStudy` stays false until its MDX body lands in Milestone 4 — the
 * flag asserts "a body exists", not "a body is planned".
 */
export const projects: Project[] = [
  // ——— Engineering: dated (corrected §9.3 windows) ———
  {
    slug: "rightnowmd",
    name: "RightNowMD",
    track: "engineering",
    role: "Lead Mobile Engineer",
    org: "TutuTech",
    summary:
      "Telemedicine platform: AI triage chat, VSee video visits and four booking flows in a React Native / Expo client.",
    start: "2026-07",
    end: null,
    status: "active",
    stack: [
      "React Native",
      "Expo",
      "TypeScript",
      "Zustand",
      "TanStack Query",
      "Formik",
      "Yup",
      "Reanimated",
      "WebSocket",
      "VSee ClinicKit",
    ],
    // §9.3: no public metrics — lead with architecture instead.
    highlights: [
      "Built real-time AI triage chat over WebSocket with a session/turn loop against a REST triage API, keys held outside the mobile bundle.",
      "Integrated video visits through VSee ClinicKit with SSO token handoff.",
      "Shipped booking flows split across telemedicine, nurse, provider visit and clinic visit session types.",
      "Owned client state architecture: Zustand with persistence plus TanStack Query for server state.",
    ],
    featured: true,
    caseStudy: false,
  },
  {
    slug: "jifu360",
    name: "JIFU360",
    track: "engineering",
    role: "Lead Mobile Engineer",
    location: "Dubai, UAE",
    summary:
      "Trading education platform with live Dolby Millicast streaming, MT4/MT5 broker integration and an in-app AI assistant.",
    start: "2025-11",
    end: "2026-08",
    status: "completed",
    stack: ["React Native", "TypeScript", "WebRTC", "Dolby Millicast", "MT4/MT5"],
    metrics: [
      { value: "17,000+", label: "iOS first-time downloads" },
      { value: "12,500", label: "Play Store downloads" },
      { value: "4.8/5", label: "iOS rating", note: "from 96 ratings" },
    ],
    highlights: [
      "Shipped live WebRTC streaming via Dolby Millicast for trading sessions.",
      "Integrated MT4/MT5 broker accounts into the mobile client.",
      "Built the in-app AI assistant.",
      "Reached users across Spain, Mexico and beyond.",
    ],
    featured: true,
    caseStudy: false,
  },
  {
    slug: "lenbi",
    name: "Lenbi",
    track: "engineering",
    role: "Lead Mobile Engineer",
    location: "Canada",
    summary:
      "Rental marketplace for the Canadian market: React Native and Expo, Stripe payments, Haversine-based geolocation search.",
    start: "2025-10",
    end: "2026-07",
    status: "completed",
    stack: ["React Native", "Expo", "TypeScript", "Stripe"],
    highlights: [
      "Delivered the rental marketplace client end to end in React Native and Expo.",
      "Integrated Stripe payments.",
      "Built Haversine-based geolocation search for nearby listings.",
    ],
    caseStudy: false,
  },
  {
    slug: "sinimax",
    name: "Sinimax",
    track: "engineering",
    role: "React Native Engineer",
    summary: "React Native streaming app. Engagement paused by client.",
    start: "2026-02",
    end: "2026-06",
    // §9.3: present neutrally — no commentary on the contract.
    status: "on-hold",
    stack: ["React Native", "TypeScript"],
    highlights: ["Built the SinimaxMobile streaming client in React Native."],
    caseStudy: false,
  },

  // ——— Engineering: undated (⚠ NEEDS INPUT: start/end months for each) ———
  {
    slug: "bluetanks-ev",
    name: "BluetanksEV",
    track: "engineering",
    role: "Mobile Engineer", // ⚠ NEEDS INPUT: confirm exact role title
    location: "United States",
    summary: "EV charging station navigation for the US market.",
    start: null,
    end: null,
    status: "completed",
    stack: [], // ⚠ NEEDS INPUT
    metrics: [{ value: "35,000", label: "Charging stations onboarded" }],
    highlights: ["Onboarded 35,000 charging stations into the navigation experience."],
    caseStudy: false,
  },
  {
    slug: "sumotrust",
    name: "Sumotrust",
    track: "engineering",
    role: "Mobile Engineer", // ⚠ NEEDS INPUT: confirm exact role title
    summary: "Naira savings and investment app.",
    start: null,
    end: null,
    status: "completed",
    stack: [], // ⚠ NEEDS INPUT
    metrics: [{ value: "10,000+", label: "Users' funds managed" }],
    highlights: ["Helped manage savings and investments for 10,000+ users."],
    caseStudy: false,
  },
  {
    slug: "crowdfacture",
    name: "Crowdfacture",
    track: "engineering",
    role: "Engineer", // ⚠ NEEDS INPUT: confirm exact role title
    summary: "Community-driven investment platform, delivered across web and mobile.",
    start: null,
    end: null,
    status: "completed",
    stack: [], // ⚠ NEEDS INPUT
    highlights: [], // ⚠ NEEDS INPUT: shipped outcomes
    caseStudy: false,
  },
  {
    slug: "quant-vertex",
    name: "Quant Vertex",
    track: "engineering",
    role: "Engineer", // ⚠ NEEDS INPUT: confirm exact role title
    summary: "Long-running PHP cryptocurrency trading platform.",
    start: null,
    end: null,
    status: "completed",
    stack: ["PHP"],
    highlights: [], // ⚠ NEEDS INPUT: shipped outcomes
    caseStudy: false,
  },

  /*
   * Owner-supplied additions (2026-08-14), not in spec §9.3. Part of the
   * real 2022 six-way concurrent cluster together with BluetanksEV and
   * Sumotrust. Everything below except name/status is ⚠ NEEDS INPUT —
   * months, roles, summaries and stacks must come from the owner before
   * these can leave "Earlier work" or render meaningful copy.
   */
  {
    slug: "gateway-edu",
    name: "Gateway Edu",
    track: "engineering",
    role: NEEDS_INPUT,
    summary: NEEDS_INPUT,
    start: null, // ⚠ NEEDS INPUT: 2022 months
    end: null,
    status: "completed",
    stack: [],
    highlights: [],
    caseStudy: false,
  },
  {
    slug: "brace-finance",
    name: "Brace Finance",
    track: "engineering",
    role: NEEDS_INPUT,
    summary: NEEDS_INPUT,
    start: null, // ⚠ NEEDS INPUT: 2022 months
    end: null,
    status: "completed",
    stack: [],
    highlights: [],
    caseStudy: false,
  },
  {
    slug: "portsconnect",
    name: "PortsConnect",
    track: "engineering",
    role: NEEDS_INPUT,
    summary: NEEDS_INPUT,
    start: null, // ⚠ NEEDS INPUT: 2022 months
    end: null,
    status: "completed",
    stack: [],
    highlights: [],
    caseStudy: false,
  },
  {
    slug: "truzact",
    name: "Truzact",
    track: "engineering",
    role: NEEDS_INPUT,
    summary: NEEDS_INPUT,
    start: null, // ⚠ NEEDS INPUT: 2022 months
    end: null,
    status: "completed",
    stack: [],
    highlights: [],
    caseStudy: false,
  },
  {
    // Owner instruction 2026-08-14: keep in the content file, archived,
    // excluded from the spine (the spine selector below drops archived).
    slug: "uwa",
    name: "UWA",
    track: "engineering",
    role: NEEDS_INPUT,
    summary: NEEDS_INPUT,
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
    start: null, // ⚠ NEEDS INPUT: founded month — unlocks spine placement
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
  {
    slug: "clipforge",
    name: "ClipForge",
    track: "founder",
    role: "Founder & Engineer",
    summary: "Full video-editing React Native app scaffolded on FFmpeg Kit.",
    start: null, // ⚠ NEEDS INPUT: start month
    end: null,
    status: "active",
    stack: ["React Native", "FFmpeg Kit"],
    highlights: [],
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

/** Undated, non-archived — the "Earlier work" block, in array order (§9.3). */
export const earlierWork = projects.filter(
  (p) => p.start === null && p.status !== "archived",
);

/** Home "Selected work" — §10.1.5: one from each track, deliberately. */
export const featuredProjects = projects.filter((p) => p.featured);

export const projectBySlug = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug);
