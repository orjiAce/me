import type { Project } from "../content/types";

/**
 * Date helpers for the chronology — range formatting, overlap detection,
 * lane assignment (§7.2) and content validation (edge cases #30/#31).
 *
 * Semantics: ranges are inclusive at month granularity. Two engagements
 * that share a calendar month were both running in that month, so they
 * count as concurrent; ranges in adjacent months do not overlap. An
 * `end` of null means the engagement is open ("PRESENT").
 */

export type YearMonth = { year: number; month: number };

/** Anything with a resolved date range — the shape the spine consumes. */
export type DatedRange = {
  slug: string;
  name: string;
  start: string;
  end: string | null;
};

const YEAR_MONTH_RE = /^(\d{4})-(0[1-9]|1[0-2])$/;

export function parseYearMonth(value: string, context?: string): YearMonth {
  const match = YEAR_MONTH_RE.exec(value);
  if (!match) {
    throw new Error(
      `Malformed date "${value}"${context ? ` on "${context}"` : ""} — expected ISO 'YYYY-MM'.`,
    );
  }
  return { year: Number(match[1]), month: Number(match[2]) };
}

/** Months since year 0 — a totally ordered integer for comparisons. */
function monthIndex(value: string, context?: string): number {
  const { year, month } = parseYearMonth(value, context);
  return year * 12 + (month - 1);
}

const OPEN_END = Number.POSITIVE_INFINITY;

function endIndex(end: string | null, context?: string): number {
  return end === null ? OPEN_END : monthIndex(end, context);
}

export function compareYearMonth(a: string, b: string): number {
  return monthIndex(a) - monthIndex(b);
}

/** `10.2025 — 07.2026`, or `07.2026 — PRESENT` for an open range (§7.2). */
export function formatRange(start: string, end: string | null): string {
  const part = (value: string) => {
    const { year, month } = parseYearMonth(value);
    return `${String(month).padStart(2, "0")}.${year}`;
  };
  return `${part(start)} — ${end === null ? "PRESENT" : part(end)}`;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

/** Human month form used alongside `<time datetime>`: "Jul 2026" (§7.3). */
export function formatMonthYear(value: string): string {
  const { year, month } = parseYearMonth(value);
  return `${MONTHS[month - 1]} ${year}`;
}

export function rangesOverlap(a: DatedRange, b: DatedRange): boolean {
  return (
    monthIndex(a.start, a.slug) <= endIndex(b.end, b.slug) &&
    monthIndex(b.start, b.slug) <= endIndex(a.end, a.slug)
  );
}

/** Codepoint string compare — locale-independent so builds are reproducible. */
function byText(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * Spine order (§7.2): start desc, then end desc (open range counts as the
 * latest possible end), then name asc. Pure — returns a new array.
 */
export function sortByStartDesc<T extends DatedRange>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const byStart = monthIndex(b.start, b.slug) - monthIndex(a.start, a.slug);
    if (byStart !== 0) return byStart;
    const byEnd = endIndex(b.end, b.slug) - endIndex(a.end, a.slug);
    if (byEnd !== 0) return byEnd;
    return byText(a.name, b.name) || byText(a.slug, b.slug);
  });
}

/** Chronological order used internally by the sweep algorithms. */
function sortByStartAsc<T extends DatedRange>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const byStart = monthIndex(a.start, a.slug) - monthIndex(b.start, b.slug);
    if (byStart !== 0) return byStart;
    const byEnd = endIndex(a.end, a.slug) - endIndex(b.end, b.slug);
    if (byEnd !== 0) return byEnd;
    return byText(a.name, b.name) || byText(a.slug, b.slug);
  });
}

/**
 * Interval-graph colouring (§7.2): greedy over entries in chronological
 * order, assigning each the lowest lane whose previous occupant has ended.
 * Optimal for interval graphs, generalises to N lanes (edge case #6), and
 * deterministic because the sweep order is fully tie-broken.
 */
export function assignLanes<T extends DatedRange>(items: T[]): Map<string, number> {
  const lanes: number[] = []; // per lane: end index of its latest occupant
  const assignment = new Map<string, number>();

  for (const item of sortByStartAsc(items)) {
    const start = monthIndex(item.start, item.slug);
    let lane = lanes.findIndex((lastEnd) => lastEnd < start);
    if (lane === -1) {
      lane = lanes.length;
      lanes.push(-Infinity);
    }
    lanes[lane] = endIndex(item.end, item.slug);
    assignment.set(item.slug, lane);
  }

  return assignment;
}

/**
 * Connected components of the overlap graph, via a chronological sweep:
 * an entry starting at or before the running cluster's furthest end is
 * (transitively) concurrent with it. Each cluster is returned in
 * chronological order; clusters of one are entries with no overlap.
 */
export function overlapClusters<T extends DatedRange>(items: T[]): T[][] {
  const clusters: T[][] = [];
  let current: T[] = [];
  let furthestEnd = -Infinity;

  for (const item of sortByStartAsc(items)) {
    const start = monthIndex(item.start, item.slug);
    if (current.length > 0 && start > furthestEnd) {
      clusters.push(current);
      current = [];
      furthestEnd = -Infinity;
    }
    current.push(item);
    furthestEnd = Math.max(furthestEnd, endIndex(item.end, item.slug));
  }
  if (current.length > 0) clusters.push(current);

  return clusters;
}

/** The other members of an entry's overlap cluster, for the mobile "⇄ concurrent with" line. */
export function concurrentWith<T extends DatedRange>(items: T[], slug: string): T[] {
  const target = items.find((item) => item.slug === slug);
  if (!target) return [];
  return items.filter(
    (item) => item.slug !== slug && rangesOverlap(item, target),
  );
}

/**
 * Build-time content assertions (edge cases #30 and #31). Throws with the
 * offending slug named. Called at module scope by content/projects.ts and
 * by scripts/check-content.ts, so a bad content file can never build.
 */
export function validateProjects(projects: Project[]): void {
  const seen = new Set<string>();
  for (const project of projects) {
    if (seen.has(project.slug)) {
      throw new Error(
        `Duplicate project slug "${project.slug}" in content/projects.ts — slugs must be unique.`,
      );
    }
    seen.add(project.slug);

    if (project.start === null) {
      if (project.end !== null) {
        throw new Error(
          `Project "${project.slug}" has an end date but no start date — undated projects must have both null.`,
        );
      }
      continue;
    }

    parseYearMonth(project.start, project.slug);
    if (project.end !== null) {
      parseYearMonth(project.end, project.slug);
      if (compareYearMonth(project.end, project.start) < 0) {
        throw new Error(
          `Project "${project.slug}" ends (${project.end}) before it starts (${project.start}).`,
        );
      }
    }
  }
}
