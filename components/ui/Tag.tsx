import type { Project } from "@/content/types";
import { accentLabel, accentVars } from "@/lib/accent";

/**
 * Project tag pill — §5.1 (M7.5 as redirected): the domain palette's
 * ONLY application. Tinted background, base-colour text (every pair
 * ≥4.6:1); track accent for projects without a domain (Zowis,
 * LingoBase). The label names the same axis the colour encodes, so
 * colour is never the only signal (§15).
 */
export function Tag({ project }: { project: Pick<Project, "track" | "domain"> }) {
  return (
    <span
      className="mono-label inline-flex items-center rounded-pill px-3 py-1"
      style={{
        ...accentVars(project),
        color: "var(--accent)",
        background: "var(--accent-sub)",
      }}
    >
      {accentLabel(project)}
    </span>
  );
}
