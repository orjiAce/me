/**
 * Form field wrapper — §6/§15: a real <label>, error text linked via
 * aria-describedby by the caller. Inputs get the fog fill from §5.1.
 */
export function Field({
  label,
  htmlFor,
  optional = false,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-ink">
        {label}
        {optional && <span className="text-slate"> (optional)</span>}
      </label>
      <div className="mt-1.5">{children}</div>
      {error && (
        <p id={`${htmlFor}-error`} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Grouped-control wrapper — a real <fieldset>/<legend> for the project-type
 * pill group (v5 §3), where a single <label> would have nothing to point
 * at. Same error affordance as Field.
 */
export function FieldSet({
  legend,
  error,
  describedBy,
  children,
}: {
  legend: string;
  error?: string;
  describedBy?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset aria-describedby={error ? describedBy : undefined}>
      <legend className="block text-sm font-medium text-ink">{legend}</legend>
      <div className="mt-1.5">{children}</div>
      {error && (
        <p id={describedBy} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </fieldset>
  );
}

export const inputClassName =
  "w-full rounded-md bg-fog px-4 py-3 text-body text-ink placeholder:text-slate";
