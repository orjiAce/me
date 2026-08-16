import Link from "next/link";
import type { Project } from "@/content/types";
import { projects } from "@/content/projects";
import { DOMAIN_LABEL, displayName } from "@/lib/accent";

/**
 * Related case studies sharing a domain — amendment v5 §4.5.
 *
 * Before this, the only path between case studies was NextProject, which
 * is chronological and gives every page exactly one outbound internal
 * link. This adds two or three more on a topical axis.
 *
 * Only projects with a live case study (an MDX body, edge case #3) are
 * eligible, so a link is never generated to a 404. Renders nothing when a
 * project has no domain, or when nothing else shares it.
 */
export function RelatedWork({ project }: { project: Project }) {
  if (!project.domain) return null;

  const related = projects
    .filter(
      (p) =>
        p.slug !== project.slug &&
        p.domain === project.domain &&
        p.caseStudy &&
        p.start !== null &&
        p.status !== "archived",
    )
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <nav aria-label="Related work" className="mt-16 border-t border-hairline pt-8">
      <h2 className="mono-label text-slate">
        More in {DOMAIN_LABEL[project.domain]}
      </h2>
      <ul className="mt-4 flex flex-col gap-2">
        {related.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/work/${p.slug}`}
              className="text-sm font-medium text-ink no-underline hover:underline"
            >
              {displayName(p)}
            </Link>
            <span className="measure mt-0.5 block text-sm text-graphite">
              {p.summary}
            </span>
          </li>
        ))}
      </ul>
    </nav>
  );
}
