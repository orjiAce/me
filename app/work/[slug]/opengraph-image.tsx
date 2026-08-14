import { ImageResponse } from "next/og";
import { projectBySlug } from "@/content/projects";
import { formatRange } from "@/lib/dates";
import { loadBricolage, OG_SIZE } from "@/lib/og";

/**
 * Per-case-study OG card — §12.5. Same grammar as the site default:
 * white ground, display-face project name, mono-style role and range,
 * track-accent rule down the left edge, wordmark bottom-left. Bricolage
 * verified in the Edge runtime; falls back to the built-in face.
 */
export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = "image/png";

// No generateStaticParams here: the Edge runtime cannot statically
// generate, so the eight cards render on demand and are cached by the
// platform. The page route itself stays SSG.

export async function generateImageMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const project = projectBySlug(params.slug);
  return [
    {
      id: "og",
      alt: `${project?.name ?? "Case study"} — Ace Orji`,
      size: OG_SIZE,
      contentType: "image/png",
    },
  ];
}

export default async function OpenGraphImage({
  params,
}: {
  params: { slug: string };
}) {
  const project = projectBySlug(params.slug);
  const bricolage = await loadBricolage();
  const accent = project?.track === "founder" ? "#7A2E4E" : "#1B3BE8";
  const range =
    project?.start != null
      ? formatRange(project.start, project.end, project.endUnknown)
      : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#FFFFFF",
          color: "#0C0D10",
        }}
      >
        <div style={{ width: 16, height: "100%", background: accent }} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "72px 80px",
            flex: 1,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontFamily: bricolage ? "Bricolage" : undefined,
                fontSize: 110,
                fontWeight: 700,
                lineHeight: 1.0,
                letterSpacing: "-0.03em",
                display: "flex",
              }}
            >
              {project?.name ?? "Work"}
            </div>
            <div
              style={{
                marginTop: 36,
                fontSize: 30,
                color: "#4E545C",
                display: "flex",
              }}
            >
              {[project?.role, range].filter(Boolean).join("  ·  ")}
            </div>
          </div>
          <div
            style={{
              fontFamily: bricolage ? "Bricolage" : undefined,
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              display: "flex",
            }}
          >
            ACE ORJI
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: bricolage
        ? [{ name: "Bricolage", data: bricolage, weight: 700, style: "normal" }]
        : undefined,
    },
  );
}
