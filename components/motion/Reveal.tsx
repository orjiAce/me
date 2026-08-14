"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/**
 * Scroll reveal — §11.2: opacity 0→1, translateY 16px→0, 620ms, once,
 * threshold 0.2. IntersectionObserver + CSS per the §11 decision; the
 * hidden initial state exists only under `html.js` with motion allowed,
 * so JS-off and reduced-motion users always see final state. `delay` is
 * a stagger index, capped at 6 children (§11.2) — pass 0–5.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // No IO → no hidden state, ever. Content beats choreography.
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-in");
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("reveal", className)}
      style={{ "--reveal-delay": Math.min(delay, 5) } as CSSProperties}
    >
      {children}
    </div>
  );
}
