import type { Project } from "@/content/types";
import { cn } from "@/lib/cn";
import { isLiveOnStores } from "./SpineEntry";

/**
 * Static project card for work that cannot dock to the spine yet — the
 * undated founder projects (§9.4: Zowis and LingoBase founding/start
 * months are ⚠ NEEDS INPUT). No invented dates, no links until a case
 * study exists (edge case #3).
 */
export function ProjectCard({ project }: { project: Project }) {
  const isFounder = project.track === "founder";
  return (
    <article className="rounded-lg border border-hairline p-6">
      <p
        className={cn(
          "mono-label",
          isFounder ? "text-plum" : "text-signal",
        )}
      >
        {isFounder ? "Founder" : "Engineering"}
        {project.status === "active" && (
          <span className="normal-case text-slate"> · Active — dates pending</span>
        )}
        {isLiveOnStores(project) && <span className="text-success"> · Live</span>}
      </p>
      <h3 className="mt-2 font-sans text-lead font-medium text-ink">
        {project.name}
      </h3>
      <p className="measure mt-2 text-sm text-graphite">{project.summary}</p>
      {project.stack.length > 0 && (
        <p className="mono-label mt-4 text-slate">
          <span className="normal-case">{project.stack.join(" · ")}</span>
        </p>
      )}
    </article>
  );
}
