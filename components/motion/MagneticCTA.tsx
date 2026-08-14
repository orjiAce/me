"use client";

import { useEffect, useRef } from "react";

/**
 * Magnetic CTA — §6: the wrapped element leans toward the cursor.
 * Desktop pointers only, inert on touch and under reduced motion, and
 * inert without JS (it renders as a plain wrapper). Displacement is
 * bounded by the hover area (±15% of the distance to centre).
 */
export function MagneticCTA({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const move = (event: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate(${dx * 0.15}px, ${dy * 0.15}px)`;
    };
    const leave = () => {
      el.style.transform = "";
    };

    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <span ref={ref} className="magnetic">
      {children}
    </span>
  );
}
