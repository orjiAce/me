import { profile } from "@/content/profile";
import { packages } from "@/content/packages";
import { projects, spineProjects } from "@/content/projects";
import { formatRange } from "@/lib/dates";
import { displayName } from "@/lib/accent";
import { siteUrl } from "@/lib/site";

/**
 * /llms.txt — amendment v5 §4.5. A plain-text summary for AI search, which
 * increasingly answers "React Native contractor" style queries directly.
 *
 * Generated from content/ rather than hand-written, so it cannot drift out
 * of sync with the site. Every claim here already appears on a page.
 */
export const dynamic = "force-static";

export function GET() {
  const caseStudies = projects.filter(
    (p) => p.caseStudy && p.start !== null && p.status !== "archived",
  );

  const shipped = profile.stats.find((s) => s.label === "Products shipped");
  const since = profile.stats.find((s) => s.label === "Shipping since");

  const lines = [
    `# ${profile.name} (${profile.alias})`,
    "",
    "> React Native developer and lead mobile engineer.",
    `> Based in ${profile.location}, ${profile.timezone}, working remotely.`,
    "",
    `${shipped?.value ?? ""} products shipped since ${since?.value ?? ""}, most as the lead`,
    "mobile engineer and often as the only one. Also the founder of Zowis",
    "Fashion Limited, whose commerce and logistics infrastructure he built.",
    "",
    `Availability: ${profile.availability.note} (${profile.availability.preferredLength}).`,
    `Contact: ${profile.email}`,
    "",
    "## Specialisms",
    "",
    "- React Native and TypeScript, Expo and bare CLI",
    "- Real-time video and streaming: WebRTC, Dolby Millicast, native iOS Picture-in-Picture",
    "- Payments and fintech: Stripe Connect and Identity, Paystack, Plaid, wallets, KYC",
    "- Native modules in Swift and Kotlin where no SDK exists",
    "- AI in production: Anthropic API and Google Gemini",
    "- Store delivery: EAS builds, over-the-air updates, App Store and Google Play review",
    "",
    "## Pages",
    "",
    `- ${siteUrl}/ — overview`,
    `- ${siteUrl}/work — full chronology, ${spineProjects.length} dated projects`,
    `- ${siteUrl}/about — background, stack and ways of working`,
    `- ${siteUrl}/zowis — Zowis Fashion Limited, the founder track`,
    `- ${siteUrl}/lab — open-source packages`,
    `- ${siteUrl}/contact — contact form`,
    "",
    "## Case studies",
    "",
    ...caseStudies.map(
      (p) =>
        `- ${siteUrl}/work/${p.slug} — ${displayName(p)}, ${p.role}, ` +
        `${formatRange(p.start!, p.end, p.endUnknown)}. ${p.summary}`,
    ),
    "",
    "## Open source",
    "",
    ...packages.map((pkg) => `- ${pkg.npm} — ${pkg.name}: ${pkg.description}`),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
