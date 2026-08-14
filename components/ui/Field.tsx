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

export const inputClassName =
  "w-full rounded-md bg-fog px-4 py-3 text-body text-ink placeholder:text-slate";
