/**
 * Proof-strip stat — §6. Milestone 5 renders the final value statically;
 * the once-only odometer animation (with the reduced-motion bypass baked
 * into §11.6) is wired in the motion pass, M8.
 */
export function Counter({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-h2 font-semibold text-ink">{value}</p>
      <p className="mono-label mt-1 text-slate">{label}</p>
    </div>
  );
}
