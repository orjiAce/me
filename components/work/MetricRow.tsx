import type { Project } from "@/content/types";

/**
 * Proof metrics row — §10.3.5. Callers must omit this entirely when a
 * project has no metrics (edge case #2): never zeros, never "N/A".
 */
export function MetricRow({
  metrics,
}: {
  metrics: NonNullable<Project["metrics"]>;
}) {
  return (
    <dl className="flex flex-wrap gap-x-10 gap-y-6">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="border-l border-hairline pl-5 first:border-l-0 first:pl-0"
        >
          <dd className="font-display text-h3 font-semibold text-ink">
            {metric.value}
          </dd>
          <dt className="mono-label mt-1 text-slate">
            {metric.label}
            {metric.note && <span className="normal-case"> — {metric.note}</span>}
          </dt>
        </div>
      ))}
    </dl>
  );
}
