/** Mono uppercase label with a leading rule — §6. */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mono-label flex items-center gap-3 text-slate">
      <span aria-hidden="true" className="h-px w-8 bg-hairline" />
      {children}
    </p>
  );
}
