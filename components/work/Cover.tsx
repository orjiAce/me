"use client";

import Image from "next/image";
import { useState } from "react";
import type { Project } from "@/content/types";
import { cn } from "@/lib/cn";

const RATIO_CLASS: Record<string, string> = {
  "2/1": "aspect-[2/1]",
  "16/9": "aspect-video",
  "16/10": "aspect-[16/10]",
  "3/2": "aspect-[3/2]",
  "4/3": "aspect-[4/3]",
  "4/5": "aspect-[4/5]",
  "1/1": "aspect-square",
};

/**
 * Project cover — §14/§17. Renders the real screenshot via next/image
 * (lazy, AVIF/WebP, ratio-correct so zero CLS); without one — or if the
 * image fails at runtime (edge case #29) — the neutral mist placeholder
 * of edge case #1 renders instead. Never a broken-image icon.
 */
export function Cover({
  cover,
  name,
  sizes,
  className,
  imageClassName,
  textClassName = "text-h3",
}: {
  cover?: Project["cover"];
  name: string;
  /** next/image responsive sizes hint — match the rendered column width. */
  sizes: string;
  className?: string;
  imageClassName?: string;
  textClassName?: string;
}) {
  const [failed, setFailed] = useState(false);
  const ratio = RATIO_CLASS[cover?.ratio ?? "16/10"];

  if (!cover || failed) {
    return (
      <div
        aria-hidden="true"
        className={cn(
          "flex items-center justify-center overflow-hidden rounded-md border border-hairline bg-mist",
          ratio,
          className,
        )}
      >
        <span
          className={cn(
            "font-display font-semibold text-slate",
            textClassName,
            imageClassName,
          )}
        >
          {name}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md border border-hairline bg-mist",
        ratio,
        className,
      )}
    >
      <Image
        src={cover.src}
        alt={cover.alt}
        fill
        sizes={sizes}
        className={cn("object-cover", imageClassName)}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
