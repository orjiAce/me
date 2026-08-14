"use client";

/**
 * Polite live region announcing filter results to screen readers —
 * §10.2 / §15. Visually hidden; the visible result is the list itself.
 */
export function FilterStatus({ shown, total }: { shown: number; total: number }) {
  return (
    <p aria-live="polite" className="sr-only">
      Showing {shown} of {total} projects.
    </p>
  );
}
