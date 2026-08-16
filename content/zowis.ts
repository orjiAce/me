import { NEEDS_INPUT } from "./profile";

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
  instagram: NEEDS_INPUT, // ⚠ CTA band held until supplied

  portrait: {
    src: "/images/zowis/portrait.jpeg",
    alt: "A model in a draped burgundy mini dress with a red floral off-shoulder strap, against a grey studio backdrop.",
  },

  /** Two supplied so far; the grid keeps ratio panels for the rest (⚠ 4–6 more wanted). */
  lookbook: [
    { src: "/images/zowis/lookbook-01.jpeg", alt: "Two models in matching red dresses with oversized bow detailing and ruffled peplum skirts, against a warm stone backdrop.", ratio: "1/1" },
    { src: "/images/zowis/lookbook-08.jpeg", alt: "Two models on a carved wooden bench, one in a burgundy mini dress with a red floral strap, the other in a mint dress with a green floral strap.", ratio: "4/5" },
  ] as { src: string; alt: string; ratio: "4/5" | "1/1" }[],

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
