import { cn } from "@/lib/cn";
import { Container } from "./Container";

type SectionProps = {
  /** `mist` renders the full-bleed alternate panel. Never two mist in a row (§5.3). */
  tone?: "paper" | "mist";
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
  spacing = "default",
  className,
  containerClassName,
  children,
  ...rest
}: SectionProps) {
  return (
    <section
      className={cn(
        tone === "mist" && "bg-mist",
        spacing === "default" &&
          "py-[var(--section-y-sm)] md:py-[var(--section-y-md)] lg:py-[var(--section-y-lg)]",
        className,
      )}
      {...rest}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
