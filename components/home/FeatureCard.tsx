import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/content/types";
import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/cn";

/**
 * Featured project card (ProjectCardFeature, §10.1.5). Cover images are
 * ⚠ NEEDS INPUT, so the edge-case #1 fallback renders: a mist panel at
 * 16/10 with the name in the display face. Hover: lift shadow, cover
 * scale, arrow translate (§5.6) — all CSS, nothing hover-only.
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
      className={cn(
        "group block rounded-lg border border-hairline p-5 no-underline",
        "transition-shadow duration-[var(--dur-fast)] hover:shadow-lift",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="flex aspect-[16/10] items-center justify-center overflow-hidden rounded-md border border-hairline bg-mist"
      >
        <span className="font-display text-h3 font-semibold text-slate transition-transform duration-[var(--dur-slow)] group-hover:scale-[1.03]">
          {project.name}
        </span>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <Tag track={project.track} />
        {topMetric && (
          <span className="mono-label text-slate">
            {topMetric.value}{" "}
            <span className="normal-case">{topMetric.label}</span>
          </span>
        )}
      </div>

      <h3 className="mt-3 font-sans text-lead font-medium text-ink">
        {project.name}
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
