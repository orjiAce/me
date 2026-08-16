import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import type { Project } from "@/content/types";
import { formatMonthYear, formatRange, numberWord } from "@/lib/dates";
import { displayName } from "@/lib/accent";
import { cn } from "@/lib/cn";
import { AppIcon } from "./AppIcon";
import { Cover } from "./Cover";
import { Disclosure } from "./Disclosure";

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
  /** About-page compact variant (§10.5.2): title + meta only, everywhere. */
  dense?: boolean;
  /** §15: heading levels never skip — h2 under a page h1, h3 under a section h2. */
  headingLevel?: 2 | 3;
};

const TRACK_ACCENT: Record<Project["track"], string> = {
  engineering: "bg-signal",
  founder: "bg-plum",
  "open-source": "bg-signal",
};

/** Amendment v3 §4: a store link earns a small mono LIVE marker. */
export const isLiveOnStores = (project: Project): boolean =>
  Boolean(project.links?.some((l) => /App Store|Google Play/.test(l.label)));

/**
 * The page a row navigates to, or null if it has none.
 *
 * `caseStudy` means an MDX body at content/case-studies/<slug>.mdx. Zowis
 * is the one project with a bespoke page instead of an MDX body, and a row
 * whose page exists should navigate to it rather than expand in place.
 */
export function pageHref(project: Project): string | null {
  if (project.caseStudy) return `/work/${project.slug}`;
  if (project.slug === "zowis") return "/zowis";
  return null;
}

/**
 * §9.3: spine-only entries get expandable detail in place. A row is
 * expandable when it has no page of its own and has something worth
 * showing — never both behaviours on one row.
 */
export function spineDetail(project: Project) {
  if (pageHref(project)) return null;
  const highlights = project.highlights ?? [];
  const metrics = project.metrics ?? [];
  const stack = project.stack ?? [];
  if (!highlights.length && !metrics.length && !stack.length) return null;
  return { highlights, metrics, stack };
}

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
 * One engagement docked to the spine — §7.2/§7.3.
 *
 * A row does exactly one thing. Rows with a page of their own navigate to
 * it, carrying an arrow; rows without one expand in place through a native
 * <details> disclosure, carrying a chevron. The affordance differs before
 * the click so a visitor never has to guess which rows do something.
 */
export function SpineEntry({
  project,
  lane = 0,
  bracket = null,
  concurrentNames = [],
  grouped = false,
  compact = false,
  dense = false,
  headingLevel = 3,
}: SpineEntryProps) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const meta = [project.role, project.org, project.location].filter(
    (part): part is string => Boolean(part) && part !== "⚠ NEEDS INPUT",
  );

  const href = pageHref(project);
  // The About page's dense variant is a bare chronology — no disclosures.
  const detail = dense ? null : spineDetail(project);
  const panelId = `spine-detail-${project.slug}`;

  const decorations = !grouped && (
    <>
      <span
        className={cn("spine-node", TRACK_ACCENT[project.track])}
        aria-hidden="true"
      />
      {bracket && (
        <span className="spine-bracket" data-pos={bracket.pos} aria-hidden="true" />
      )}
    </>
  );

  const concurrentLabel = bracket?.pos === "start" && (
    <span className="mono-label mt-1 hidden text-signal md:block">
      Concurrent ×{bracket.size}
    </span>
  );

  /* Inside <summary> only phrasing content is valid, so the meta and
     summary lines render as block-display spans there and as paragraphs
     everywhere else. */
  const Line = detail ? "span" : "p";

  const metaLine = (
    <Line
      className={cn(
        "mono-label mt-1 w-fit text-slate",
        detail ? "block" : "relative z-10",
      )}
    >
      <DateRange project={project} />
      {meta.length > 0 && <span className="normal-case"> · {meta.join(" · ")}</span>}
      {project.status === "on-hold" && (
        <span className="normal-case"> · Engagement paused by client</span>
      )}
      {isLiveOnStores(project) && <span className="text-success"> · Live</span>}
    </Line>
  );

  const summaryLine = !dense && (
    <Line
      className={cn(
        "measure mt-2 w-fit text-sm text-graphite",
        "line-clamp-2 md:line-clamp-none", // row 32: mobile scroll budget
        detail ? "block" : "relative z-10",
        compact && "hidden md:block",
      )}
    >
      {project.summary}
    </Line>
  );

  const heading = (
    <Heading
      className={cn(
        "flex items-center gap-2.5 font-sans font-medium text-ink",
        dense ? "text-body" : "text-lead",
      )}
    >
      <AppIcon project={project} placement="spine" />
      {href ? (
        /*
         * §7.2: the whole row is the click target, the title the accessible
         * name — a stretched ::after overlay. Text blocks sit at z-10 so
         * they stay selectable (edge case #25).
         */
        <Link
          href={href}
          className="group/link inline-flex items-center gap-2 no-underline after:absolute after:inset-0 hover:underline"
        >
          {displayName(project)}
          <ArrowRight
            aria-hidden="true"
            size={16}
            className="text-slate transition-transform duration-[var(--dur-fast)] group-hover/link:translate-x-1"
          />
        </Link>
      ) : (
        <>
          {displayName(project)}
          {detail && (
            <ChevronDown
              aria-hidden="true"
              size={16}
              className="spine-chevron text-slate transition-transform duration-[var(--dur-fast)]"
            />
          )}
        </>
      )}
    </Heading>
  );

  const concurrentNamesLine = !dense && !grouped && concurrentNames.length > 0 && (
    <p className="mono-label mt-2 text-slate md:hidden">
      ⇄ concurrent with{" "}
      <span className="normal-case">
        {concurrentNames[0]}
        {concurrentNames.length > 1 && ` +${concurrentNames.length - 1}`}
      </span>
    </p>
  );

  return (
    <article
      /* Grouped rows still need their own containing block: the stretched
         ::after overlay resolves against the nearest positioned ancestor,
         and without this it escapes to the group wrapper — where the last
         row's overlay covers the whole cluster and swallows every click. */
      className={cn(grouped ? "relative" : "spine-row")}
      style={grouped ? undefined : ({ "--lane": lane } as CSSProperties)}
    >
      {decorations}

      {detail ? (
        <Disclosure className="spine-details">
          <summary className="spine-summary" aria-controls={panelId}>
            {heading}
            {concurrentLabel}
            {metaLine}
            {summaryLine}
          </summary>
          <div id={panelId} className="mt-4 border-l border-hairline pl-5">
            {project.cover && (
              <Cover
                cover={project.cover}
                name={displayName(project)}
                sizes="(min-width: 768px) 40vw, 90vw"
                className="mb-5 max-w-lg rounded-md"
              />
            )}

            {detail.metrics.length > 0 && (
              <dl className="flex flex-wrap gap-x-8 gap-y-3">
                {detail.metrics.map((metric) => (
                  <div key={metric.label}>
                    <dd className="font-display text-lead font-semibold text-ink">
                      {metric.value}
                    </dd>
                    <dt className="mono-label mt-0.5 text-slate">
                      {metric.label}
                      {metric.note && (
                        <span className="normal-case"> — {metric.note}</span>
                      )}
                    </dt>
                  </div>
                ))}
              </dl>
            )}

            {detail.highlights.length > 0 && (
              <ul
                className={cn(
                  "measure flex list-disc flex-col gap-2 pl-4 text-sm text-graphite",
                  detail.metrics.length > 0 && "mt-5",
                )}
              >
                {detail.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            )}

            {detail.stack.length > 0 && (
              <p className="mono-label mt-5 text-slate">
                <span className="normal-case">{detail.stack.join(" · ")}</span>
              </p>
            )}
          </div>
        </Disclosure>
      ) : (
        <>
          {heading}
          {/* Below the title so the node aligns with every row's title line. */}
          {concurrentLabel}
          {metaLine}
          {summaryLine}
        </>
      )}

      {concurrentNamesLine}
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
  dense = false,
  headingLevel = 3,
}: {
  projects: DatedProject[];
  yearLabel: string;
  dense?: boolean;
  headingLevel?: 2 | 3;
}) {
  return (
    <div className="spine-row" style={{ "--lane": 0 } as CSSProperties}>
      <span className="spine-node bg-signal" aria-hidden="true" />
      <p className="mono-label text-signal">
        {yearLabel} — {numberWord(projects.length)} concurrent engagements
      </p>
      <ol className="mt-4 divide-y divide-hairline rounded-lg border border-hairline px-5 md:px-6">
        {projects.map((project) => (
          <li key={project.slug} className={dense ? "py-3" : "py-5"}>
            <SpineEntry
              project={project}
              grouped
              dense={dense}
              compact
              headingLevel={headingLevel}
            />
          </li>
        ))}
      </ol>
    </div>
  );
}
