import Image from "next/image";
import type { Project } from "@/content/types";
import { cn } from "@/lib/cn";

/** The three sanctioned placements (amendment v5 §1) and their sizes. */
const PLACEMENT = {
  /** Work index and home cards: 40px mobile, 48px desktop. */
  card: { px: 48, className: "inline-flex size-10 md:size-12" },
  /** Case-study header, above the project name. */
  header: { px: 64, className: "flex size-16" },
  /** Spine rows, between the node and the title. Hidden below 768px
   *  where the row is already tight. */
  spine: { px: 28, className: "hidden size-7 md:inline-flex" },
} as const;

/**
 * App icon — amendment v5 §1. An app icon is not a cover image and never
 * renders in the cover slot, as a background, above 64px, or in the OG
 * card.
 *
 * Treatment: the 22% iOS squircle approximation rather than --radius-md
 * (app icons carry their own convention, and the site token reads wrong
 * at this size), plus a 1px hairline ring. The ring is load-bearing —
 * several of these icons are white or near-white and dissolve into the
 * paper ground without it. It is drawn as an overlay rather than an
 * inset box-shadow because a replaced element paints its bitmap over an
 * inset shadow, which would hide the ring on exactly the white icons
 * that need it.
 *
 * No icon → render nothing (edge case: never a monogram or placeholder).
 * Decorative in all three placements: the project name is adjacent and
 * visible, so the icon adds nothing a screen reader needs.
 */
export function AppIcon({
  project,
  placement,
  className,
}: {
  project: Pick<Project, "icon">;
  placement: keyof typeof PLACEMENT;
  className?: string;
}) {
  if (!project.icon) return null;
  const { px, className: sizeClass } = PLACEMENT[placement];

  return (
    <span
      className={cn(
        "relative shrink-0 overflow-hidden rounded-[22%]",
        sizeClass,
        className,
      )}
    >
      <Image
        src={project.icon.src}
        alt=""
        width={px}
        height={px}
        quality={90}
        className="size-full object-cover"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[22%] border border-hairline"
      />
    </span>
  );
}
