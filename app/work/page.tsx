import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { SpineTimeline } from "@/components/work/SpineTimeline";
import { TrackFilter, type FilterValue } from "@/components/work/TrackFilter";
import { FilterStatus } from "@/components/work/FilterStatus";
import { ProjectCard } from "@/components/work/ProjectCard";
import { spineProjects, undatedWork } from "@/content/projects";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Seventeen shipped products since 2019, delivered as concurrent remote contracts — the full chronology, overlaps included.",
};

const TRACKS: FilterValue[] = ["all", "engineering", "founder", "open-source"];

/**
 * Work index — §10.2. The filter is URL state (`?track=`), read on the
 * server so it works with JS disabled, shareable, and survives refresh.
 * An unknown value normalises to /work rather than 404ing (edge case #10).
 */
export default async function WorkPage({
  searchParams,
}: {
  searchParams: Promise<{ track?: string | string[] }>;
}) {
  const { track: raw } = await searchParams;
  if (raw !== undefined && !TRACKS.includes(raw as FilterValue)) {
    redirect("/work");
  }
  const track = (raw as FilterValue | undefined) ?? "all";

  const dated =
    track === "all"
      ? spineProjects
      : spineProjects.filter((p) => p.track === track);
  const undated =
    track === "all"
      ? undatedWork
      : undatedWork.filter((p) => p.track === track);
  const shown = dated.length + undated.length;
  const total = spineProjects.length + undatedWork.length;

  return (
    <Section>
      <h1 className="text-h1">Work</h1>
      <p className="measure mt-4 text-lead text-graphite">
        Seventeen shipped products since 2019, for teams in Nigeria, the US,
        Canada, the UK and Dubai.
      </p>
      <p className="mono-label mt-3 text-slate">
        Contracts ran concurrently. The lanes below show real overlap.
      </p>

      <div className="mt-10">
        <TrackFilter active={track} />
        <FilterStatus shown={shown} total={total} />
      </div>

      {shown === 0 ? (
        <p className="mt-14 text-graphite">
          No projects on this track yet.{" "}
          <Link href="/work" className="text-signal underline">
            Show all work
          </Link>
        </p>
      ) : (
        <>
          {dated.length > 0 && (
            <div className="mt-14 md:mt-20">
              <SpineTimeline projects={dated} headingLevel={2} />
            </div>
          )}

          {undated.length > 0 && (
            <div className="mt-16">
              <h2 className="mono-label text-slate">
                Founder track — dates pending
              </h2>
              <div className="mt-4 grid gap-[var(--grid-gap)] md:grid-cols-2">
                {undated.map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </Section>
  );
}
