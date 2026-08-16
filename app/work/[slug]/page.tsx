import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { MetricRow } from "@/components/work/MetricRow";
import { NextProject } from "@/components/work/NextProject";
import { RelatedWork } from "@/components/work/RelatedWork";
import { Cover } from "@/components/work/Cover";
import { AppIcon } from "@/components/work/AppIcon";
import { projects, projectBySlug, spineProjects } from "@/content/projects";
import { formatMonthYear, formatRange, sortByStartDesc } from "@/lib/dates";
import { JsonLd } from "@/components/seo/JsonLd";
import { displayName } from "@/lib/accent";
import { siteUrl } from "@/lib/site";
import { softwareApplicationNode } from "@/lib/structured-data";

/**
 * Case study — §10.3. Pages exist only for projects with an MDX body
 * (edge case #3); any other slug 404s (edge case #11) through the
 * explicit notFound() below. dynamicParams stays default (true): with
 * `false`, the production server answers unknown slugs with Next's
 * built-in 404 body (NoFallbackError path) instead of the custom
 * not-found page — found by the M10 prod-build E2E suite.
 */
export function generateStaticParams() {
  // Dated case studies only: Leadership News is promoted to the tier but
  // its page stays a 404 until the owner supplies role and dates (v4 §0).
  return projects
    .filter((p) => p.caseStudy && p.start !== null && p.status !== "archived")
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
  return {
    title: displayName(project),
    description: project.summary,
    alternates: { canonical: `/work/${slug}` },
    openGraph: {
      title: `${displayName(project)} — Ace Orji`,
      description: project.summary,
      url: `/work/${slug}`,
    },
  };
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

  // v5 §4.1 — null unless the project has a live App Store / Play listing.
  const appNode = softwareApplicationNode(project);

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
      {/* §16 — BreadcrumbList + CreativeWork */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Work", item: `${siteUrl}/work` },
                { "@type": "ListItem", position: 2, name: displayName(project), item: `${siteUrl}/work/${slug}` },
              ],
            },
            {
              "@type": "CreativeWork",
              name: displayName(project),
              description: project.summary,
              author: { "@type": "Person", name: "Joseph Orji", alternateName: "Ace" },
              dateCreated: project.start,
              url: `${siteUrl}/work/${slug}`,
            },
            ...(appNode ? [appNode] : []),
          ],
        }}
      />
      <Container className="py-[var(--section-y-sm)] md:py-[var(--section-y-md)]">
        <nav aria-label="Breadcrumb" className="mono-label text-slate">
          <Link href="/work" className="no-underline hover:text-ink">
            Work
          </Link>{" "}
          / <span aria-current="page">{displayName(project)}</span>
        </nav>

        <header className="mt-8">
          <AppIcon project={project} placement="header" className="mb-5" />
          <h1 className="text-h1">{displayName(project)}</h1>
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
            {/* Cover — the real screenshot at its own ratio where one
                exists; the edge-case #1 mist placeholder otherwise. */}
            <Cover
              cover={project.cover}
              name={displayName(project)}
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="rounded-lg"
              textClassName="text-h2"
            />

            {project.metrics && project.metrics.length > 0 && (
              <div className="mt-12">
                <MetricRow metrics={project.metrics} />
              </div>
            )}

            <div className="prose mt-12">
              <Body />
            </div>

            {/* v5 §4.5 — topical internal links, alongside the chronological
                NextProject band below. */}
            <RelatedWork project={project} />
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
