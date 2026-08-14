"use client";

import { useEffect, useRef } from "react";

/**
 * The spine's vertical rule with its scroll-linked accent fill — the only
 * scroll-linked animation on the site (§7.2, §11.3).
 *
 * Implemented as a plain rAF-batched scroll listener, not motion —
 * decision recorded 2026-08-14 (§11/§14): importing motion for one
 * scaleY put the home route 20 kB over its first-load budget. Progress
 * matches the previous motion offsets: fill starts when the rule's top
 * crosses 75% of the viewport and completes when its bottom does.
 *
 * Decorative: the list beside it carries the content. Under reduced
 * motion, or with JS off, only the static hairline renders.
 */
export function SpineRule() {
  const ruleRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rule = ruleRef.current;
    const fill = fillRef.current;
    if (!rule || !fill) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = rule.getBoundingClientRect();
      const anchor = window.innerHeight * 0.75;
      const progress = Math.min(1, Math.max(0, (anchor - rect.top) / rect.height));
      fill.style.transform = `scaleY(${progress})`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ruleRef}
      aria-hidden="true"
      className="absolute inset-y-0 w-px bg-hairline"
      style={{ left: "var(--spine-x)" }}
    >
      <div
        ref={fillRef}
        className="absolute inset-0 origin-top bg-signal"
        style={{ transform: "scaleY(0)" }}
      />
    </div>
  );
}
