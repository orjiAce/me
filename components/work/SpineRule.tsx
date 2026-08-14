"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll } from "motion/react";

/**
 * The spine's vertical rule with its scroll-linked accent fill — the only
 * scroll-linked animation on the site (§7.2, §11.3). Decorative: the list
 * beside it carries the content. Under reduced motion (or with JS off)
 * only the static hairline renders. Positioned by the .spine-wrap
 * coordinate system in globals.css.
 */
export function SpineRule() {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.75", "end 0.75"],
  });

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="absolute inset-y-0 w-px bg-hairline"
      style={{ left: "var(--spine-x)" }}
    >
      {!reducedMotion && (
        <motion.div
          className="absolute inset-0 origin-top bg-signal"
          style={{ scaleY: scrollYProgress }}
        />
      )}
    </div>
  );
}
