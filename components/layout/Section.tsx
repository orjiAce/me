import { cn } from "@/lib/cn";
import { Container } from "./Container";

type SectionProps = {
  /** `mist` renders the full-bleed alternate panel. Never two mist in a row (§5.3). */
  tone?: "paper" | "mist";
  /**
   * §5.1 redirect item 2: mist panels carry a diagonal paper → tinted
   * wash. Alternate the accent between consecutive panels so they
   * differ subtly. Degrades to flat mist if gradients fail.
   */
  wash?: "signal" | "plum";
  /** `none` opts out of the vertical rhythm for custom sections like the hero. */
  spacing?: "default" | "none";
  className?: string;
  containerClassName?: string;
  "aria-label"?: string;
  children: React.ReactNode;
};

/** Full-bleed section with the container inside — §5.3 section rhythm. */
export function Section({
  tone = "paper",
  wash,
  spacing = "default",
  className,
  containerClassName,
  children,
  ...rest
}: SectionProps) {
  const washed = tone === "mist" && wash !== undefined;
  return (
    <section
      className={cn(
        tone === "mist" && (washed ? "wash-panel" : "bg-mist"),
        spacing === "default" &&
          "py-[var(--section-y-sm)] md:py-[var(--section-y-md)] lg:py-[var(--section-y-lg)]",
        className,
      )}
      style={
        washed
          ? ({ "--wash": `var(--color-${wash})` } as React.CSSProperties)
          : undefined
      }
      {...rest}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
