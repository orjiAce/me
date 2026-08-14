/**
 * Font loading for next/og (Edge runtime) — §12.5. Satori cannot read
 * woff2, and next/font's self-hosted files aren't reachable from the
 * Edge bundle, so the display face is fetched as a static TTF from
 * Google Fonts at render time and cached by the runtime. Any failure
 * returns null and the card renders with next/og's built-in fallback
 * face — the card must never 500 over typography.
 */
export async function loadBricolage(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700&display=swap",
      // A non-browser UA makes Google return TTF URLs instead of woff2.
      { headers: { "User-Agent": "curl/8" } },
    ).then((res) => (res.ok ? res.text() : null));
    if (!css) return null;
    const url = /src: url\((https:\/\/[^)]+\.ttf)\)/.exec(css)?.[1];
    if (!url) return null;
    const font = await fetch(url);
    if (!font.ok) return null;
    return await font.arrayBuffer();
  } catch {
    return null;
  }
}

export const OG_SIZE = { width: 1200, height: 630 };
