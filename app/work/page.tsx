import type { Metadata } from "next";
import { Section } from "@/components/layout/Section";
import { SpineTimeline } from "@/components/work/SpineTimeline";
import { spineProjects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Sixteen shipped products since 2019, delivered as concurrent remote contracts — the full chronology, overlaps included.",
};

/**
 * Work index — §10.2. Milestone 3 ships the page header and the Spine;
 * the TrackFilter, undated founder projects and case-study links land in
 * Milestone 4.
 */
export default function WorkPage() {
  return (
    <Section>
      <h1 className="text-h1">Work</h1>
      <p className="measure mt-4 text-lead text-graphite">
        Sixteen shipped products since 2019, for teams in Nigeria, the US,
        Canada, the UK and Dubai.
      </p>
      <p className="mono-label mt-3 text-slate">
        Contracts ran concurrently. The lanes below show real overlap.
      </p>

      <div className="mt-14 md:mt-20">
        <SpineTimeline projects={spineProjects} />
      </div>
    </Section>
  );
}
