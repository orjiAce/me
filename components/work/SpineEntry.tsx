import Link from "next/link";
import type { CSSProperties } from "react";
import type { Project } from "@/content/types";
import { formatMonthYear, formatRange, numberWord } from "@/lib/dates";
import { cn } from "@/lib/cn";

type DatedProject = Project & { start: string };

type SpineEntryProps = {
  project: DatedProject;
  /** Horizontal lane (0-based). Offsets apply ≥ md; mobile collapses to 0. */
  lane?: number;
  /** Contiguous concurrent-cluster segment this row belongs to, if any. */
  bracket?: { size: number; pos: "start" | "middle" | "end" } | null;
  /** Names of concurrently running engagements, for the mobile ⇄ line. */
  concurrentNames?: string[];
  /** Inside a bracketed group: no node, no lane, no bracket (§7.2). */
  grouped?: boolean;
  /** Pre-2022 mobile collapse: title, dates, one line only (edge case #32). */
  compact?: boolean;
};

const TRACK_ACCENT: Record<Project["track"], string> = {
  engineering: "bg-signal",
  founder: "bg-plum",
  "open-source": "bg-signal",
};

/** Amendment v3 §4: a store link earns a small mono LIVE marker. */
export const isLiveOnStores = (project: Project): boolean =>
  Boolean(project.links?.some((l) => /App Store|Google Play/.test(l.label)));

/** Mono date range: `10.2025 — 07.2026`, `07.2026 — PRESENT`, `02.2024 —` (§7.2). */
function DateRange({ project }: { project: DatedProject }) {
  const [startText] = formatRange(project.start, project.end).split(" — ");
  return (
    <>
      <time dateTime={project.start} title={formatMonthYear(project.start)}>
        {startText}
      </time>
      {" — "}
      {project.endUnknown ? null : project.end === null ? (
        <span className="inline-flex items-baseline gap-1.5 text-signal">
          PRESENT
          <span className="spine-present-dot" aria-hidden="true" />
        </span>
      ) : (
        <time dateTime={project.end} title={formatMonthYear(project.end)}>
          {formatRange(project.start, project.end).split(" — ")[1]}
        </time>
      )}
    </>
  );
}

/**
 * One engagement docked to the spine — §7.2/§7.3. The article is the
 * semantic unit; node, tick and bracket are decorative and aria-hidden.
 * Rows link to their case study only once an MDX body exists (edge case
 * #3) — until then the title renders as plain text.
 */
export function SpineEntry({
  project,
  lane = 0,
  bracket = null,
  concurrentNames = [],
  grouped = false,
  compact = false,
}: SpineEntryProps) {
  const meta = [project.role, project.org, project.location].filter(
    (part): part is string => Boolean(part) && part !== "⚠ NEEDS INPUT",
  );

  return (
    <article
      className={cn(!grouped && "spine-row")}
      style={grouped ? undefined : ({ "--lane": lane } as CSSProperties)}
    >
      {!grouped && (
        <>
          <span
            className={cn("spine-node", TRACK_ACCENT[project.track])}
            aria-hidden="true"
          />
          {bracket && (
            <span
              className="spine-bracket"
              data-pos={bracket.pos}
              aria-hidden="true"
            />
          )}
        </>
      )}

      {/*
       * §7.2: the whole row is the click target, the title the accessible
       * name — a stretched ::after overlay at z-0. Text blocks sit at z-10
       * so they stay selectable (edge case #25): clicks on text hit text,
       * clicks anywhere else on the row hit the link.
       */}
      <h3 className="font-sans text-lead font-medium text-ink">
        {project.caseStudy ? (
          <Link
            href={`/work/${project.slug}`}
            className="no-underline after:absolute after:inset-0 hover:underline"
          >
            {project.name}
          </Link>
        ) : (
          project.name
        )}
      </h3>

      {/* Below the title so the node aligns with every row's title line. */}
      {bracket?.pos === "start" && (
        <p className="mono-label mt-1 hidden text-signal md:block">
          Concurrent ×{bracket.size}
        </p>
      )}

      <p className="mono-label relative z-10 mt-1 w-fit text-slate">
        <DateRange project={project} />
        {meta.length > 0 && <span className="normal-case"> · {meta.join(" · ")}</span>}
        {project.status === "on-hold" && (
          <span className="normal-case"> · Engagement paused by client</span>
        )}
        {isLiveOnStores(project) && (
          <span className="text-success"> · Live</span>
        )}
      </p>

      <p
        className={cn(
          "measure relative z-10 mt-2 w-fit text-sm text-graphite",
          compact && "hidden md:block",
        )}
      >
        {project.summary}
      </p>

      {!grouped && concurrentNames.length > 0 && (
        <p className="mono-label mt-2 text-slate md:hidden">
          ⇄ concurrent with{" "}
          <span className="normal-case">{concurrentNames.join(", ")}</span>
        </p>
      )}
    </article>
  );
}

/**
 * A beyond-the-lane-cap cluster rendered as one bracketed group sharing a
 * node — the real 2022 six (§7.2, edge case #6).
 */
export function SpineGroup({
  projects,
  yearLabel,
}: {
  projects: DatedProject[];
  yearLabel: string;
}) {
  return (
    <div className="spine-row" style={{ "--lane": 0 } as CSSProperties}>
      <span className="spine-node bg-signal" aria-hidden="true" />
      <p className="mono-label text-signal">
        {yearLabel} — {numberWord(projects.length)} concurrent engagements
      </p>
      <ol className="mt-4 divide-y divide-hairline rounded-lg border border-hairline px-5 md:px-6">
        {projects.map((project) => (
          <li key={project.slug} className="py-5">
            <SpineEntry project={project} grouped />
          </li>
        ))}
      </ol>
    </div>
  );
}
