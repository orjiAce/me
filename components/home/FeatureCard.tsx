import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/content/types";
import { Tag } from "@/components/ui/Tag";
import { Cover } from "@/components/work/Cover";
import { bloomVar, displayName } from "@/lib/accent";
import { cn } from "@/lib/cn";

/**
 * Featured project card (ProjectCardFeature, §10.1.5). Real screenshots
 * render via Cover at their own ratio (a tall phone capture stays 4/5,
 * never forced to 16/10); projects without one keep the edge-case #1
 * mist placeholder. Hover: lift shadow, cover scale, track-tint bloom.
 */
export function FeatureCard({
  project,
  href,
  className,
}: {
  project: Project;
  href: string;
  className?: string;
}) {
  const topMetric = project.metrics?.[0];

  return (
    <Link
      href={href}
      style={bloomVar(project)}
      className={cn(
        "card-bloom group block rounded-lg border border-hairline p-5 no-underline",
        "transition-shadow duration-[var(--dur-fast)] hover:shadow-lift",
        className,
      )}
    >
      <Cover
        cover={project.cover}
        name={displayName(project)}
        sizes="(min-width: 768px) 60vw, 100vw"
        imageClassName="transition-transform duration-[var(--dur-slow)] group-hover:scale-[1.03]"
      />

      <div className="mt-5 flex items-center justify-between gap-4">
        <Tag project={project} />
        {topMetric && (
          <span className="mono-label text-slate">
            {topMetric.value}{" "}
            <span className="normal-case">{topMetric.label}</span>
          </span>
        )}
      </div>

      <h3 className="mt-3 font-sans text-lead font-medium text-ink">
        {displayName(project)}
      </h3>
      <p className="mt-1 text-sm text-graphite">{project.summary}</p>

      <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-ink">
        {project.track === "founder" ? "Enter Zowis" : "Read the case study"}
        <ArrowRight
          aria-hidden="true"
          size={16}
          className="transition-transform duration-[var(--dur-fast)] group-hover:translate-x-1"
        />
      </span>
    </Link>
  );
}
