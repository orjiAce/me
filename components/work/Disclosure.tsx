"use client";

import { useEffect, useRef } from "react";

/**
 * Native <details> disclosure with an explicit `aria-expanded` on the
 * summary.
 *
 * Why <details> rather than a button + useState: §11.6's rule is that with
 * JS off, nothing is ever hidden. A JS-only disclosure would bury the
 * stack and highlights of every spine-only project behind a script — and
 * those rows have no case-study page to fall back to. <details> opens
 * without JS, and brings native keyboard support (Enter/Space) and native
 * disclosure semantics with it.
 *
 * The one thing it does not give us is a literal `aria-expanded`
 * attribute. Browsers expose the state natively, but older screen readers
 * are inconsistent about it, so this syncs the attribute on toggle. With
 * JS off the attribute is simply absent and the native semantics stand.
 */
export function Disclosure({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const details = ref.current;
    const summary = details?.querySelector("summary");
    if (!details || !summary) return;

    const sync = () =>
      summary.setAttribute("aria-expanded", String(details.open));
    sync();
    details.addEventListener("toggle", sync);
    return () => details.removeEventListener("toggle", sync);
  }, []);

  return (
    <details ref={ref} className={className}>
      {children}
    </details>
  );
}
