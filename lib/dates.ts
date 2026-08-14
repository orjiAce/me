import type { Project } from "../content/types";

/**
 * Date helpers for the chronology — range formatting, overlap detection,
 * lane assignment and spine layout (§7.2), and content validation (edge
 * cases #30/#31).
 *
 * Semantics: ranges are inclusive at month granularity. Two engagements
 * that share a calendar month were both running in that month, so they
 * count as concurrent (Lenbi ends 07.2026, RightNowMD starts 07.2026 —
 * real, owner-confirmed concurrency); ranges in adjacent months do not
 * overlap. An `end` of null means the engagement is open ("PRESENT").
 * `endUnknown` (edge case #4) means the end month was never recorded:
 * the range renders with a trailing dash, is never treated as open, and
 * only its start month counts toward overlap — the minimal extent that
 * is actually known. No date is ever invented.
 */

export type YearMonth = { year: number; month: number };

/** Anything with a resolved date range — the shape the spine consumes. */
export type DatedRange = {
  slug: string;
  name: string;
  start: string;
  end: string | null;
  endUnknown?: boolean;
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

/** Last month an entry is known to be active, as a comparable index. */
function extentEnd(range: DatedRange): number {
  if (range.endUnknown) return monthIndex(range.start, range.slug);
  return range.end === null ? OPEN_END : monthIndex(range.end, range.slug);
}

export function compareYearMonth(a: string, b: string): number {
  return monthIndex(a) - monthIndex(b);
}

/**
 * `10.2025 — 07.2026`; `07.2026 — PRESENT` for an open range; and for an
 * unknown end month (edge case #4) `02.2024 —` with the dash trailing and
 * no "present" label.
 */
export function formatRange(
  start: string,
  end: string | null,
  endUnknown = false,
): string {
  const part = (value: string) => {
    const { year, month } = parseYearMonth(value);
    return `${String(month).padStart(2, "0")}.${year}`;
  };
  if (endUnknown) return `${part(start)} —`;
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

/** Uppercase number word for spine headers: 6 → "SIX" (§7.2). */
export function numberWord(n: number): string {
  const words = [
    "ZERO", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX",
    "SEVEN", "EIGHT", "NINE", "TEN", "ELEVEN", "TWELVE",
  ];
  return words[n] ?? String(n);
}

export function rangesOverlap(a: DatedRange, b: DatedRange): boolean {
  return (
    monthIndex(a.start, a.slug) <= extentEnd(b) &&
    monthIndex(b.start, b.slug) <= extentEnd(a)
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
    const byEnd = extentEnd(b) - extentEnd(a);
    if (byEnd !== 0) return byEnd;
    return byText(a.name, b.name) || byText(a.slug, b.slug);
  });
}

/** Chronological order used internally by the sweep algorithms. */
function sortByStartAsc<T extends DatedRange>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const byStart = monthIndex(a.start, a.slug) - monthIndex(b.start, b.slug);
    if (byStart !== 0) return byStart;
    const byEnd = extentEnd(a) - extentEnd(b);
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
    lanes[lane] = extentEnd(item);
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
    furthestEnd = Math.max(furthestEnd, extentEnd(item));
  }
  if (current.length > 0) clusters.push(current);

  return clusters;
}

/** The other members of an entry's overlap cluster, for the "⇄ concurrent with" line. */
export function concurrentWith<T extends DatedRange>(items: T[], slug: string): T[] {
  const target = items.find((item) => item.slug === slug);
  if (!target) return [];
  return items.filter(
    (item) => item.slug !== slug && rangesOverlap(item, target),
  );
}

/**
 * Concurrency runs — the building block of the spine layout. A run is a
 * maximal window of months in which at least two engagements are active
 * *throughout* (density never drops below 2 inside the window). Members
 * are every entry active at any point in the window; each is genuinely
 * concurrent with another member, because density ≥ 2 wherever it touches
 * the window. `peak` is the maximum simultaneous count, and `peakYears`
 * the calendar years in which that peak occurs — the header year of a
 * bracketed group.
 */
export type ConcurrencyRun<T extends DatedRange> = {
  members: T[]; // chronological order
  peak: number;
  peakYears: number[];
};

export function concurrencyRuns<T extends DatedRange>(items: T[]): ConcurrencyRun<T>[] {
  if (items.length < 2) return [];

  // Clamp open ends to the horizon: the last month anything is known to
  // be active. Density beyond it is constant, so nothing is lost.
  let horizon = -Infinity;
  for (const item of items) {
    horizon = Math.max(horizon, monthIndex(item.start, item.slug));
    const end = extentEnd(item);
    if (end !== OPEN_END) horizon = Math.max(horizon, end);
  }
  const clamp = (end: number) => Math.min(end, horizon);

  // Month-granular density via +1/−1 events.
  const delta = new Map<number, number>();
  for (const item of items) {
    const start = monthIndex(item.start, item.slug);
    const end = clamp(extentEnd(item));
    delta.set(start, (delta.get(start) ?? 0) + 1);
    delta.set(end + 1, (delta.get(end + 1) ?? 0) - 1);
  }
  const points = [...delta.keys()].sort((a, b) => a - b);

  // Sweep for maximal density ≥ 2 windows.
  const runs: ConcurrencyRun<T>[] = [];
  let density = 0;
  let windowStart: number | null = null;
  let windowEnd = -Infinity;

  const closeWindow = (from: number, to: number) => {
    const members = sortByStartAsc(items).filter((item) => {
      const s = monthIndex(item.start, item.slug);
      return s <= to && clamp(extentEnd(item)) >= from;
    });
    // Peak density and its months, within this window only.
    let running = 0;
    let peak = 0;
    const peakMonths: number[] = [];
    for (let i = 0; i < points.length; i += 1) {
      const point = points[i]!;
      running += delta.get(point) ?? 0;
      const segStart = Math.max(point, from);
      const segEnd = Math.min((points[i + 1] ?? to + 1) - 1, to);
      if (segStart > segEnd) continue;
      if (running > peak) {
        peak = running;
        peakMonths.length = 0;
      }
      if (running === peak) {
        for (let m = segStart; m <= segEnd; m += 1) peakMonths.push(m);
      }
    }
    const peakYears = [...new Set(peakMonths.map((m) => Math.floor(m / 12)))].sort(
      (a, b) => a - b,
    );
    runs.push({ members, peak, peakYears });
  };

  for (const point of points) {
    const wasDense = density >= 2;
    density += delta.get(point) ?? 0;
    if (density >= 2 && windowStart === null) {
      windowStart = point;
    } else if (wasDense && density < 2 && windowStart !== null) {
      windowEnd = point - 1;
      closeWindow(windowStart, windowEnd);
      windowStart = null;
    }
  }
  // Density returns to 0 at the final event point, so every window closes.
  return runs;
}

/**
 * Spine layout (§7.2, edge case #6). Lane assignment generalises to N; up
 * to `laneCap` (four) lanes render as horizontal offsets. Where a run of
 * concurrency peaks beyond the cap — the real 2022 maximum of five
 * simultaneous engagements inside the six-strong cluster — offsetting
 * cannot work at any viewport, so the run's members collapse into one
 * bracketed group sharing a node, headed e.g. `2022 — SIX CONCURRENT
 * ENGAGEMENTS`. Lanes are then recomputed without the grouped entries, so
 * the remainder is guaranteed to fit the cap.
 */
export type SpineItem<T extends DatedRange> =
  | {
      kind: "entry";
      item: T;
      lane: number;
      /** Bracket segment when this row is part of a contiguous concurrent cluster. */
      bracket: { size: number; pos: "start" | "middle" | "end" } | null;
    }
  | { kind: "group"; items: T[]; yearLabel: string };

export type SpineLayout<T extends DatedRange> = {
  items: SpineItem<T>[]; // start desc — DOM order (§7.3)
  laneCount: number; // lanes used by ungrouped entries (≤ laneCap)
};

export function spineLayout<T extends DatedRange>(
  items: T[],
  laneCap = 4,
): SpineLayout<T> {
  const runs = concurrencyRuns(items);

  // Runs beyond the lane cap become bracketed groups. Runs sharing a
  // member merge (a long engagement could span two dense windows).
  const groups: T[][] = [];
  for (const run of runs.filter((r) => r.peak > laneCap)) {
    const overlapping = groups.find((g) =>
      g.some((item) => run.members.some((m) => m.slug === item.slug)),
    );
    if (overlapping) {
      for (const m of run.members) {
        if (!overlapping.some((item) => item.slug === m.slug)) overlapping.push(m);
      }
    } else {
      groups.push([...run.members]);
    }
  }
  const groupYear = (members: T[]): string => {
    const run = runs.find(
      (r) => r.peak > laneCap && r.members.some((m) => members.some((g) => g.slug === m.slug)),
    );
    const years = run?.peakYears ?? [];
    if (years.length === 0) return "";
    return years.length === 1
      ? String(years[0])
      : `${years[0]}–${years[years.length - 1]}`;
  };

  const grouped = new Set(groups.flat().map((item) => item.slug));
  const ungrouped = items.filter((item) => !grouped.has(item.slug));
  const lanes = assignLanes(ungrouped);
  const laneCount = lanes.size === 0 ? 0 : Math.max(...lanes.values()) + 1;

  // Order: entries by the spine sort; a group sorts by its newest member.
  type Wrapper = { key: T; entry: T | null; group: T[] | null };
  const wrappers: Wrapper[] = [
    ...ungrouped.map((item) => ({ key: item, entry: item, group: null })),
    ...groups.map((group) => ({
      key: sortByStartDesc(group)[0]!,
      entry: null,
      group,
    })),
  ];
  const ordered = sortByStartDesc(wrappers.map((w) => w.key)).map(
    (key) => wrappers.find((w) => w.key.slug === key.slug)!,
  );

  // Bracket segments: clusters within the cap whose members (after group
  // extraction) are contiguous rows. Non-contiguous memberships — a long
  // engagement bridging past an unrelated row — degrade to no bracket.
  const rowOrder = ordered
    .filter((w) => w.entry !== null)
    .map((w) => w.entry!.slug);
  const bracketBySlug = new Map<string, { size: number; pos: "start" | "middle" | "end" }>();
  for (const run of runs.filter((r) => r.peak <= laneCap)) {
    const slugs = run.members
      .map((m) => m.slug)
      .filter((slug) => !grouped.has(slug));
    if (slugs.length < 2) continue;
    const rows = slugs
      .map((slug) => rowOrder.indexOf(slug))
      .sort((a, b) => a - b);
    const contiguous = rows.every(
      (row, i) => i === 0 || row === rows[i - 1]! + 1,
    );
    if (!contiguous) continue;
    if (slugs.some((slug) => bracketBySlug.has(slug))) continue;
    for (let i = 0; i < rows.length; i += 1) {
      bracketBySlug.set(rowOrder[rows[i]!]!, {
        size: slugs.length,
        pos: i === 0 ? "start" : i === rows.length - 1 ? "end" : "middle",
      });
    }
  }

  return {
    items: ordered.map((w) =>
      w.entry !== null
        ? {
            kind: "entry" as const,
            item: w.entry,
            lane: lanes.get(w.entry.slug) ?? 0,
            bracket: bracketBySlug.get(w.entry.slug) ?? null,
          }
        : {
            kind: "group" as const,
            items: sortByStartDesc(w.group!),
            yearLabel: groupYear(w.group!),
          },
    ),
    laneCount,
  };
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

    if (project.endUnknown) {
      if (project.start === null) {
        throw new Error(
          `Project "${project.slug}" is endUnknown but has no start date — endUnknown needs a known start.`,
        );
      }
      if (project.end !== null) {
        throw new Error(
          `Project "${project.slug}" sets both end and endUnknown — pick one.`,
        );
      }
      if (project.status === "active") {
        throw new Error(
          `Project "${project.slug}" is endUnknown but active — an unknown end is never "present" (edge case #4).`,
        );
      }
    }

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
