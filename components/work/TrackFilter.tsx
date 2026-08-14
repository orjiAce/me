import Link from "next/link";
import { cn } from "@/lib/cn";
import type { Track } from "@/content/types";

export type FilterValue = Track | "all";

const PILLS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "engineering", label: "Engineering" },
  { value: "founder", label: "Founder" },
  { value: "open-source", label: "Open source" },
];

/** Active pill: track accent border + 8% tint fill (§10.2). */
const ACTIVE: Record<FilterValue, string> = {
  all: "border-ink text-ink bg-mist",
  engineering: "border-signal text-signal bg-signal-sub",
  founder: "border-plum text-plum bg-plum-sub",
  "open-source": "border-signal text-signal bg-signal-sub",
};

/**
 * URL-driven track filter — §10.2. Plain links so it works with JS
 * disabled; with JS, Next soft-navigates and `scroll={false}` holds the
 * scroll position. Link navigation pushes history, so the back button
 * restores the previous filter (edge cases #26/#27).
 */
export function TrackFilter({ active }: { active: FilterValue }) {
  return (
    <nav aria-label="Filter projects by track" className="flex flex-wrap gap-2">
      {PILLS.map((pill) => {
        const isActive = pill.value === active;
        return (
          <Link
            key={pill.value}
            href={pill.value === "all" ? "/work" : `/work?track=${pill.value}`}
            scroll={false}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "inline-flex min-h-11 items-center rounded-pill border px-5 text-sm no-underline",
              "transition-colors duration-[var(--dur-fast)]",
              isActive
                ? ACTIVE[pill.value]
                : "border-hairline text-graphite hover:border-slate hover:text-ink",
            )}
          >
            {pill.label}
          </Link>
        );
      })}
    </nav>
  );
}
