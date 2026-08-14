import type { Project } from "@/content/types";
import {
  concurrentWith,
  parseYearMonth,
  spineLayout,
  type SpineItem,
} from "@/lib/dates";
import { SpineEntry, SpineGroup } from "./SpineEntry";
import { SpineRule } from "./SpineRule";

type DatedProject = Project & { start: string };

type SpineTimelineProps = {
  projects: DatedProject[];
  ariaLabel?: string;
  /** `compact` (§10.5.2): title + meta rows, tighter rhythm — the About chronology. */
  variant?: "full" | "compact";
};

/** The year a spine item docks at: its start, or its newest member's start. */
function itemYear(item: SpineItem<DatedProject>): number {
  const start = item.kind === "entry" ? item.item.start : item.items[0]!.start;
  return parseYearMonth(start).year;
}

/**
 * The Career Spine — §7. A continuous rule with an accent scroll fill,
 * engagements docked as nodes, concurrent engagements in parallel lanes
 * (bracketed groups beyond four), and sticky year markers down the rail.
 * The DOM is a single ordered list, most recent first, regardless of the
 * visual lanes (§7.3, edge case #33); rule, nodes, ticks, brackets and
 * year markers are decorative.
 */
export function SpineTimeline({
  projects,
  ariaLabel = "Work history, most recent first",
  variant = "full",
}: SpineTimelineProps) {
  if (projects.length === 0) return null;
  const dense = variant === "compact";

  const layout = spineLayout(projects);
  const years = layout.items.map(itemYear);
  const newest = Math.max(...years);
  const oldest = Math.min(...years);

  // Every year from newest to oldest gets a rail marker, including years
  // with no new engagement (§10.2) — long contracts run through them.
  const rows: React.ReactNode[] = [];
  for (let year = newest; year >= oldest; year -= 1) {
    rows.push(
      <li
        key={`year-${year}`}
        role="presentation"
        aria-hidden="true"
        className="spine-year"
      >
        <span className="mono-label text-slate">{year}</span>
      </li>,
    );
    for (const item of layout.items.filter((i) => itemYear(i) === year)) {
      if (item.kind === "group") {
        rows.push(
          <li key={`group-${item.items[0]!.slug}`}>
            <SpineGroup
              projects={item.items}
              yearLabel={item.yearLabel}
              dense={dense}
            />
          </li>,
        );
      } else {
        const { item: project, lane, bracket } = item;
        rows.push(
          <li key={project.slug}>
            <SpineEntry
              project={project}
              lane={lane}
              bracket={bracket}
              concurrentNames={concurrentWith(projects, project.slug).map(
                (p) => p.name,
              )}
              compact={parseYearMonth(project.start).year < 2022}
              dense={dense}
            />
          </li>,
        );
      }
    }
  }

  return (
    <div
      className="spine-wrap"
      style={dense ? ({ "--spine-gap": "2rem" } as React.CSSProperties) : undefined}
    >
      <SpineRule />
      <ol aria-label={ariaLabel} className={dense ? "space-y-8" : "space-y-12"}>
        {rows}
      </ol>
    </div>
  );
}
