import type { CSSProperties } from "react";

/**
 * Line-by-line mask reveal for H1/H2 only — §11.1. Pure CSS animation:
 * runs once on load, needs no JS, and under reduced motion the lines
 * simply render in place (the animation styles never apply). Server
 * component — ships zero JS.
 */
export function TextReveal({ lines }: { lines: React.ReactNode[] }) {
  return (
    <>
      {lines.map((line, index) => (
        <span key={index} className="line-mask">
          <span
            className="line-rise"
            style={{ "--line": index } as CSSProperties}
          >
            {line}
          </span>
        </span>
      ))}
    </>
  );
}
