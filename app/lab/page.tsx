import type { Metadata } from "next";
import { Section } from "@/components/layout/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CopyButton } from "@/components/ui/CopyButton";
import { Tag } from "@/components/ui/Tag";
import { packages } from "@/content/packages";
import { isProvided } from "@/content/profile";
import { projectBySlug } from "@/content/projects";
import { weeklyDownloads } from "@/lib/npm";

export const metadata: Metadata = {
  title: "Lab",
  description:
    "Open-source React Native packages with live download counts, and LingoBase — a translation API in development.",
};

/** §8: npm counts revalidate every 6h. */
export const revalidate = 21600;

/**
 * Lab — §10.6. Two packages and one side project is what exists; a short
 * honest page reads better than a padded one. Repo links render only
 * when the URLs are supplied (⚠ §21) — never guessed. Star counts need
 * those repo URLs, so they wait too.
 */
export default async function LabPage() {
  const downloads = await Promise.allSettled(
    packages.map((pkg) => weeklyDownloads(pkg.name)),
  );
  const downloadFor = (i: number) => {
    const result = downloads[i];
    return result?.status === "fulfilled" ? result.value : null;
  };

  const lingobase = projectBySlug("lingobase")!;

  return (
    <Section>
      <h1 className="text-h1">Lab</h1>
      <p className="measure mt-4 text-lead text-graphite">
        Open-source packages and what I&rsquo;m building for myself.
      </p>

      <div className="mt-14">
        <Eyebrow>npm packages</Eyebrow>
        <div className="mt-8 grid gap-[var(--grid-gap)] md:grid-cols-2">
          {packages.map((pkg, i) => {
            const weekly = downloadFor(i);
            return (
              <article
                key={pkg.name}
                className="rounded-lg border border-hairline p-6"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="font-mono text-sm font-medium text-ink">
                    {pkg.name}
                  </h2>
                  {weekly !== null && (
                    <span className="mono-label text-slate">
                      {weekly.toLocaleString("en-US")}
                      <span className="normal-case"> downloads/wk</span>
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm text-graphite">{pkg.description}</p>
                <div className="mt-5 flex items-center justify-between gap-2 rounded-md bg-fog px-4 py-1.5">
                  <code className="font-mono text-meta text-graphite">
                    {pkg.install}
                  </code>
                  <CopyButton text={pkg.install} />
                </div>
                <p className="mono-label mt-4 flex gap-5">
                  <a
                    href={pkg.npm}
                    rel="noopener noreferrer"
                    className="text-signal no-underline hover:underline"
                  >
                    npm ↗
                  </a>
                  {isProvided(pkg.repo) && (
                    <a
                      href={pkg.repo}
                      rel="noopener noreferrer"
                      className="text-signal no-underline hover:underline"
                    >
                      Repository ↗
                    </a>
                  )}
                </p>
              </article>
            );
          })}
        </div>
      </div>

      <div className="mt-16">
        <Eyebrow>In development</Eyebrow>
        <article className="mt-8 max-w-2xl rounded-lg border border-hairline p-6">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-sans text-lead font-medium text-ink">
              {lingobase.name}
            </h2>
            <Tag project={lingobase} />
            <span className="mono-label rounded-pill border border-hairline px-3 py-1 text-slate">
              In development
            </span>
          </div>
          <p className="measure mt-3 text-sm text-graphite">
            {lingobase.summary}
          </p>
          <p className="mono-label mt-4 text-slate">
            <span className="normal-case">{lingobase.stack.join(" · ")}</span>
          </p>
        </article>
      </div>
    </Section>
  );
}
