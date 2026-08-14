import { ImageResponse } from "next/og";
import { loadBricolage, OG_SIZE } from "@/lib/og";

/**
 * Site-default OG card — §12.5. White background, display face headline,
 * mono-ish meta, signal rule down the left edge, wordmark bottom-left.
 * Bricolage is fetched as a TTF buffer (verified working in the Edge
 * runtime); on any font failure the card renders with next/og's
 * built-in face rather than failing.
 */
export const runtime = "edge";
export const alt = "Ace Orji — Lead Mobile Engineer · React Native & TypeScript";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const bricolage = await loadBricolage();

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
        <div style={{ width: 16, height: "100%", background: "#1B3BE8" }} />
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
                fontSize: 92,
                fontWeight: 700,
                lineHeight: 1.02,
                letterSpacing: "-0.03em",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span>Seventeen apps in production.</span>
              <span>Two npm packages.</span>
              <span style={{ color: "#7A2E4E" }}>One fashion label.</span>
            </div>
            <div
              style={{
                marginTop: 40,
                fontSize: 28,
                color: "#4E545C",
                display: "flex",
              }}
            >
              Lead Mobile Engineer · React Native &amp; TypeScript · Abuja, UTC+1
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
