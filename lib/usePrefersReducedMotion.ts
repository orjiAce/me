"use client";

import { useEffect, useState } from "react";

/**
 * The JS half of the reduced-motion guard (§11.6). SSR and first paint
 * assume reduced motion (true), so no effect ever runs before the
 * preference is known — effects opt in, never out.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}
