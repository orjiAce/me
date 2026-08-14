/** Skip-to-content link — first in tab order, visible on focus (§15). */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-paper focus:px-4 focus:py-2 focus:text-ink"
    >
      Skip to content
    </a>
  );
}
