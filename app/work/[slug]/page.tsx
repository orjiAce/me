import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { MetricRow } from "@/components/work/MetricRow";
import { NextProject } from "@/components/work/NextProject";
import { projects, projectBySlug, spineProjects } from "@/content/projects";
import { formatMonthYear, formatRange, sortByStartDesc } from "@/lib/dates";

/**
 * Case study — §10.3. Pages exist only for projects with an MDX body
 * (edge case #3); any other slug 404s (edge case #11) via
 * dynamicParams = false.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return projects
    .filter((p) => p.caseStudy)
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) return {};
  return { title: project.name, description: project.summary };
}

const STATUS_LABEL: Record<string, string> = {
  active: "Active",
  completed: "Completed",
  "on-hold": "Engagement paused by client",
  archived: "Archived",
};

/** The chronologically adjacent case study, wrapping — §10.3.8. */
function nextCaseStudy(slug: string) {
  const ordered = sortByStartDesc(
    spineProjects.filter((p) => p.caseStudy),
  );
  const index = ordered.findIndex((p) => p.slug === slug);
  return ordered[(index + 1) % ordered.length]!;
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project || !project.caseStudy || project.start === null) notFound();

  const { default: Body } = await import(
    `../../../content/case-studies/${slug}.mdx`
  );

  const facts: { label: string; value: React.ReactNode }[] = [
    { label: "Role", value: project.role },
    {
      label: "Window",
      value: (
        <span className="font-mono">
          {formatRange(project.start, project.end, project.endUnknown)}
        </span>
      ),
    },
    { label: "Track", value: project.track === "founder" ? "Founder" : "Engineering" },
    { label: "Stack", value: project.stack.join(" · ") },
    ...(project.links?.length
      ? [
          {
            label: "Links",
            value: (
              <span className="flex flex-col gap-1">
                {project.links.map((link) => (
                  <a key={link.href} href={link.href} rel="noopener noreferrer">
                    {link.label}
                  </a>
                ))}
              </span>
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      <Container className="py-[var(--section-y-sm)] md:py-[var(--section-y-md)]">
        <nav aria-label="Breadcrumb" className="mono-label text-slate">
          <Link href="/work" className="no-underline hover:text-ink">
            Work
          </Link>{" "}
          / <span aria-current="page">{project.name}</span>
        </nav>

        <header className="mt-8">
          <h1 className="text-h1">{project.name}</h1>
          <p className="mt-4 text-lead text-graphite">
            {[project.role, project.org, project.location]
              .filter(Boolean)
              .join(" · ")}
          </p>
          <p className="mono-label mt-2 text-slate">
            <time dateTime={project.start} title={formatMonthYear(project.start)}>
              {formatRange(project.start, project.end, project.endUnknown)}
            </time>
            {" · "}
            {STATUS_LABEL[project.status]}
          </p>
        </header>

        <div className="mt-12 gap-[var(--grid-gap)] lg:grid lg:grid-cols-12">
          <div className="lg:col-span-8">
            {/* Cover — reserved for a real project screenshot; until it
                exists, the neutral edge-case #1 mist placeholder. Colour
                never owns the image area (§5.1 redirect). */}
            <div
              aria-hidden="true"
              className="flex aspect-[16/10] items-center justify-center rounded-lg border border-hairline bg-mist"
            >
              <span className="font-display text-h2 font-semibold text-slate">
                {project.name}
              </span>
            </div>

            {project.metrics && project.metrics.length > 0 && (
              <div className="mt-12">
                <MetricRow metrics={project.metrics} />
              </div>
            )}

            <div className="prose mt-12">
              <Body />
            </div>
          </div>

          {/* Fact rail — sticky on lg+, inline card on mobile (§10.3.3). */}
          <aside className="mt-12 lg:col-span-4 lg:mt-0">
            <dl className="rounded-lg border border-hairline p-6 lg:sticky lg:top-24">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="border-t border-hairline py-4 first:border-t-0 first:pt-0 last:pb-0"
                >
                  <dt className="mono-label text-slate">{fact.label}</dt>
                  <dd className="mt-1 text-sm text-graphite">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </Container>

      <NextProject project={nextCaseStudy(slug)} />
    </>
  );
}
