import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/content/types";
import { Tag } from "@/components/ui/Tag";
import { accentVars, duotone } from "@/lib/accent";
import { cn } from "@/lib/cn";

/**
 * Featured project card (ProjectCardFeature, §10.1.5). No real cover
 * images exist yet, so the M7.5 duotone gradient block in the project's
 * one hue is the primary visual (§5.1, edge case #1). Hover: lift
 * shadow, accent border, cover scale, arrow translate (§5.6) — all CSS.
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
      style={accentVars(project)}
      className={cn(
        "group block rounded-lg border border-hairline p-5 no-underline",
        "transition-[box-shadow,border-color] duration-[var(--dur-fast)]",
        "hover:border-(--accent) hover:shadow-lift",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="flex aspect-[16/10] items-center justify-center overflow-hidden rounded-md"
        style={{ background: duotone }}
      >
        <span className="font-display text-h3 font-semibold text-paper transition-transform duration-[var(--dur-slow)] group-hover:scale-[1.03]">
          {project.name}
        </span>
      </div>

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
