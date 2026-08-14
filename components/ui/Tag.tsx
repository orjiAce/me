import type { Project } from "@/content/types";
import { accentLabel, accentVars } from "@/lib/accent";

/**
 * Project tag — §5.1 (M7.5): border and text carry the project's one
 * hue — its domain, or its track accent when no domain exists (Zowis,
 * LingoBase). The label names the same axis the colour encodes, so
 * colour is never the only signal (§15).
 */
export function Tag({ project }: { project: Pick<Project, "track" | "domain"> }) {
  return (
    <span
      className="mono-label inline-flex items-center rounded-pill border px-3 py-1"
      style={{
        ...accentVars(project),
        color: "var(--accent)",
        borderColor: "var(--accent)",
      }}
    >
      {accentLabel(project)}
    </span>
  );
}
