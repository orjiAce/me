import type { Project } from "@/content/types";
import { accentLabel, accentVars } from "@/lib/accent";
import { isLiveOnStores } from "./SpineEntry";

/**
 * Static project card for work that cannot dock to the spine yet — the
 * undated founder projects (§9.4: Zowis and LingoBase founding/start
 * months are ⚠ NEEDS INPUT). No invented dates, no links until a case
 * study exists (edge case #3). Label carries the project's one hue
 * (§5.1 M7.5) — for these two, the track accent.
 */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="rounded-lg border border-hairline p-6" style={accentVars(project)}>
      <p className="mono-label" style={{ color: "var(--accent)" }}>
        {accentLabel(project)}
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
