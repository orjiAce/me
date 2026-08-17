/**
 * Zowis page content — §10.4 / §9.4. Every string here restates §9.4
 * facts; nothing is invented brand copy. Gaps are typed NEEDS_INPUT and
 * rendering omits them (never prints the sentinel, never stubs images).
 */
export const zowis = {
  /** One line of positioning — §10.4.1. Facts only. */
  positioning:
    "Women's fashion, designed and sold through its own e-commerce.",

  foundedYear: "2025", // founded 2025-11 (owner-supplied 2026-08-15)

  storeUrl: "https://www.wearzowis.com", // supplied 2026-08-15

  /** The brand's own wordmark, owner-supplied 2026-08-17. */
  logo: { src: "/images/zowis/icon.png", alt: "Zowis", width: 611, height: 295 },

  /** Brand channels — @wearzowis on both (owner-supplied 2026-08-17). */
  socials: [
    { label: "Instagram", handle: "@wearzowis", href: "https://www.instagram.com/wearzowis" },
    { label: "TikTok", handle: "@wearzowis", href: "https://www.tiktok.com/@wearzowis" },
  ],

  portrait: {
    src: "/images/zowis/portrait.jpeg",
    alt: "A model in a draped burgundy mini dress with a red floral off-shoulder strap, against a grey studio backdrop.",
  },

  /** The three supplied lookbook frames (2026-08-17). */
  lookbook: [
    { src: "/images/zowis/lookbook-01.jpeg", alt: "Two models in matching red dresses with oversized bow detailing and ruffled peplum skirts, against a warm stone backdrop.", ratio: "4/3" },
    { src: "/images/zowis/lookbook-03.jpeg", alt: "A model in a red gown with a bow at the bodice, off-shoulder puff sleeves and a full ruffled skirt, against a warm stone backdrop.", ratio: "4/5" },
    { src: "/images/zowis/lookbook-04.jpeg", alt: "Two models on a carved wooden bench, one in a burgundy mini dress with a red floral strap, the other in a mint dress with a green floral strap.", ratio: "4/5" },
  ] as { src: string; alt: string; ratio: "4/3" | "4/5" | "1/1" }[],

  /** The frame the home-page crossover band uses (§10.1.7). */
  feature: {
    src: "/images/zowis/lookbook.jpeg",
    alt: "A model photographed from behind in a red gown with puff sleeves and a sweeping ruffled train, against a warm stone backdrop.",
    ratio: "4/5" as const,
  },

  /** Brand story — §10.4.2, three short paragraphs, first person, §9.4 facts. */
  story: [
    "Zowis Fashion Limited is a women's fashion brand I founded and operate. It sells through its own e-commerce rather than a marketplace storefront, and I run the company end to end: the brand, the filings, the operations.",
    "Its infrastructure is mine too. I built the commerce backend on Supabase, including finding and remediating a critical row-level-security misconfiguration. I integrated the GIG logistics API for delivery and set up Meta Business Suite and the ad account it sells through.",
    "I run a product of my own, not only other people's.",
  ],

  /** "Built and run in-house" — §10.4.4, the crossover section. */
  builtInHouse: [
    {
      label: "Commerce backend",
      body: "Supabase, built and hardened in-house, including remediating a critical RLS misconfiguration.",
    },
    {
      label: "Logistics",
      body: "GIG logistics API integrated for nationwide delivery.",
    },
    {
      label: "Ads infrastructure",
      body: "Meta Business Suite and the ad account, set up and operated.",
    },
    {
      label: "Operations",
      body: "Company filings and day-to-day operations, run by the founder.",
    },
  ],
};
