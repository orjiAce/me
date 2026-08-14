/**
 * npm weekly-download fetcher — §12.3. Server-side only, 2s hard timeout,
 * 6h ISR. Returns null on any failure so callers render the card without
 * the number — never 0, never NaN, never a stuck spinner (edge case #18).
 */
export async function weeklyDownloads(pkg: string): Promise<number | null> {
  try {
    const res = await fetch(
      `https://api.npmjs.org/downloads/point/last-week/${encodeURIComponent(pkg)}`,
      { next: { revalidate: 21600 }, signal: AbortSignal.timeout(2000) },
    );
    if (!res.ok) return null;
    const json: unknown = await res.json();
    const downloads = (json as { downloads?: unknown }).downloads;
    return typeof downloads === "number" && downloads > 0 ? downloads : null;
  } catch {
    return null;
  }
}
