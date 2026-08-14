import type { TimelineEntry } from "./types";
import { spineProjects } from "./projects";
import { sortByStartDesc } from "../lib/dates";

/**
 * Non-project life/career events for the About chronology (§10.5).
 *
 * ⚠ NEEDS INPUT — nothing can be listed without dates:
 *   - Zowis Fashion incorporation month
 *   - First npm package publish month(s)
 *   - Education entry, if wanted
 *   - Career start month (first shipped app)
 */
export const milestones: TimelineEntry[] = [];

/** Project starts + milestones, most recent first — the About spine feed. */
export function fullTimeline(): TimelineEntry[] {
  const fromProjects: TimelineEntry[] = spineProjects.map((p) => ({
    date: p.start,
    title: p.name,
    track: p.track,
    note: p.role,
  }));
  const all = [...fromProjects, ...milestones];
  return sortByStartDesc(
    all.map((entry) => ({
      slug: entry.title,
      name: entry.title,
      start: entry.date,
      end: null,
      entry,
    })),
  ).map((wrapped) => wrapped.entry);
}
