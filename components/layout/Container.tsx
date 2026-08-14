import { cn } from "@/lib/cn";

type ContainerProps = {
  className?: string;
  /** e.g. the §5.1 accent variables on a case-study page. */
  style?: React.CSSProperties;
  children: React.ReactNode;
};

/** Max-width wrapper with the responsive gutters from §5.3. */
export function Container({ className, style, children }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[var(--container)]",
        "px-[var(--gutter-sm)] md:px-[var(--gutter-md)] xl:px-[var(--gutter-lg)]",
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}
