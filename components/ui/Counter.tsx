"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/**
 * Proof-strip stat — §6/§10.1.3. Counts up once, on first intersection,
 * via rAF (no library, per the §11 decision). SSR renders the final
 * value, so JS-off users and reduced-motion users only ever see it;
 * the count starts from the moment the strip enters the viewport.
 */
export function Counter({ value, label }: { value: string; label: string }) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLParagraphElement>(null);
  const [display, setDisplay] = useState(value);
  const ran = useRef(false);

  useEffect(() => {
    if (reduced || ran.current) return;
    const match = /^(\d+)(.*)$/.exec(value);
    if (!match) return; // non-numeric stat — stays static
    const target = Number(match[1]);
    const suffix = match[2] ?? "";
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || ran.current) return;
        ran.current = true;
        io.disconnect();
        const start = performance.now();
        const duration = 900;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - (1 - t) ** 3;
          setDisplay(`${Math.round(target * eased)}${suffix}`);
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, value]);

  return (
    <div>
      <p
        ref={ref}
        className="font-display text-h2 font-semibold text-ink tabular-nums"
      >
        {display}
      </p>
      <p className="mono-label mt-1 text-slate">{label}</p>
    </div>
  );
}
