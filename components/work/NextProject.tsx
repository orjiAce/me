import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import type { Project } from "@/content/types";
import { formatRange } from "@/lib/dates";

/**
 * Full-width band linking to the chronologically adjacent case study —
 * §10.3.8. The arrow translates on hover (§5.6); the whole band is the
 * link, named by the project title.
 */
export function NextProject({ project }: { project: Project & { start: string } }) {
  return (
    <div className="bg-mist">
      <Container>
        <Link
          href={`/work/${project.slug}`}
          className="group flex min-h-44 flex-col justify-center gap-2 py-14 no-underline"
        >
          <span className="mono-label text-slate">
            Next project ·{" "}
            <span className="normal-case">
              {formatRange(project.start, project.end, project.endUnknown)}
            </span>
          </span>
          <span className="flex items-center gap-4 font-display text-h2 font-semibold text-ink">
            {project.name}
            <ArrowRight
              aria-hidden="true"
              className="size-8 transition-transform duration-[var(--dur-fast)] group-hover:translate-x-1"
            />
          </span>
        </Link>
      </Container>
    </div>
  );
}
