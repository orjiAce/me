import type { Project } from "@/content/types";
import { Tag } from "@/components/ui/Tag";
import { AppIcon } from "./AppIcon";
import { isLiveOnStores } from "./SpineEntry";

/**
 * Static project card for work that cannot dock to the spine yet — the
 * undated founder projects (§9.4: Zowis and LingoBase founding/start
 * months are ⚠ NEEDS INPUT). No invented dates, no links until a case
 * study exists (edge case #3). Colour appears only as the tag pill
 * (§5.1 redirect).
 */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="rounded-lg border border-hairline p-6">
      <p className="flex flex-wrap items-center gap-2">
        <Tag project={project} />
        {project.status === "active" && (
          <span className="mono-label text-slate">
            <span className="normal-case">Active — dates pending</span>
          </span>
        )}
        {isLiveOnStores(project) && (
          <span className="mono-label text-success">Live</span>
        )}
      </p>
      <h3 className="mt-2 flex items-center gap-3 font-sans text-lead font-medium text-ink">
        <AppIcon project={project} placement="card" />
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
