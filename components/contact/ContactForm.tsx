"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Toast from "@radix-ui/react-toast";
import {
  BUDGET_RANGES,
  contactFieldsSchema,
  PROJECT_TYPES,
  type ContactFields,
} from "@/lib/schema";
import { Field, FieldSet, inputClassName } from "@/components/ui/Field";
import { WhatsAppLink } from "./WhatsAppLink";
import { profile } from "@/content/profile";
import { cn } from "@/lib/cn";

type Challenge = { ts: number; sig: string };

type ServerError =
  | { kind: "rate"; retryAfterSeconds: number }
  | { kind: "verify" }
  | { kind: "unavailable" }
  | { kind: "generic" };

/** v5 §3 — the counter appears only once the message has some length. */
const COUNT_FROM = 100;
const MESSAGE_MAX = 4000;

/**
 * Contact form — §10.7 / §12.1, reworked per amendment v5 §3. Every §17
 * row 12–16 state is still handled: inline validation on blur (never on
 * keystroke); every field locked while the submit is in flight; success
 * replaces the form; every failure shows an inline error, a toast, and
 * both direct channels — mailto carrying the typed message, and WhatsApp
 * — so the user's text is never lost (RHF keeps field state through
 * failures).
 */
export function ContactForm() {
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactFields>({
    resolver: zodResolver(contactFieldsSchema),
    mode: "onBlur",
  });

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [succeeded, setSucceeded] = useState(false);
  const [serverError, setServerError] = useState<ServerError | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  // Signed mount timestamp for the timing check. If this fetch fails the
  // submission still works — the server logs the degradation (§12.1).
  useEffect(() => {
    fetch("/api/contact")
      .then((res) => (res.ok ? res.json() : null))
      .then((json: Challenge | null) => setChallenge(json))
      .catch(() => setChallenge(null));
  }, []);

  const message = watch("message") ?? "";
  const mailtoHref = `mailto:${profile.email}?subject=${encodeURIComponent(
    "Project inquiry",
  )}&body=${encodeURIComponent(message)}`;

  const fail = (error: ServerError) => {
    setServerError(error);
    setToastOpen(true);
  };

  const onSubmit = async (values: ContactFields) => {
    setServerError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          website: honeypot,
          challenge: challenge ?? undefined,
        }),
      });

      if (res.ok) {
        setSucceeded(true);
        return;
      }
      if (res.status === 422) {
        const json = (await res.json()) as { fields?: Record<string, string> };
        for (const [field, messageText] of Object.entries(json.fields ?? {})) {
          setError(field as keyof ContactFields, { message: messageText });
        }
        return;
      }
      if (res.status === 429) {
        const retry = Number(res.headers.get("Retry-After") ?? 600);
        fail({ kind: "rate", retryAfterSeconds: retry });
        return;
      }
      if (res.status === 403) {
        fail({ kind: "verify" });
        return;
      }
      if (res.status === 503) {
        fail({ kind: "unavailable" });
        return;
      }
      fail({ kind: "generic" });
    } catch {
      // Network failure — row 12. Typed text stays in the fields.
      fail({ kind: "generic" });
    }
  };

  if (succeeded) {
    return (
      <div className="rounded-lg border border-hairline p-8">
        <p className="font-display text-h3 font-semibold text-ink">
          Message sent.
        </p>
        {/* v5 §3: no response-time promise — owner-confirmed 2026-08-16. */}
        <p className="measure mt-3 text-body">
          It landed in my inbox and you&rsquo;ll get an acknowledgement by
          email. I&rsquo;ll reply to {watch("email")}.
        </p>
      </div>
    );
  }

  const errorCopy: Record<ServerError["kind"], string> = {
    rate: `Too many messages from this connection. Try again in ${Math.ceil(
      (serverError?.kind === "rate" ? serverError.retryAfterSeconds : 600) / 60,
    )} minutes, or use a direct channel below.`,
    verify: "Verification didn't pass. Use a direct channel below instead.",
    unavailable:
      "The form's email channel isn't available right now. Your message is preserved. Send it directly below.",
    generic:
      "That didn't send. Your message is still here, so try again or use a direct channel below.",
  };

  const overLimit = message.length > MESSAGE_MAX;

  return (
    <Toast.Provider swipeDirection="right" duration={6000}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* v5 §3 — every field locked while the submit is in flight. */}
        <fieldset disabled={isSubmitting} className="flex flex-col gap-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Field label="Name" htmlFor="name" error={errors.name?.message}>
              <input
                id="name"
                type="text"
                autoComplete="name"
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={errors.name ? "name-error" : undefined}
                className={inputClassName}
                {...register("name")}
              />
            </Field>

            <Field label="Email" htmlFor="email" error={errors.email?.message}>
              <input
                id="email"
                type="email"
                autoComplete="email"
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={inputClassName}
                {...register("email")}
              />
            </Field>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Field
              label="Company"
              htmlFor="company"
              optional
              error={errors.company?.message}
            >
              <input
                id="company"
                type="text"
                autoComplete="organization"
                aria-invalid={errors.company ? true : undefined}
                aria-describedby={errors.company ? "company-error" : undefined}
                className={inputClassName}
                {...register("company")}
              />
            </Field>

            <Field
              label="Budget range"
              htmlFor="budget"
              optional
              error={errors.budget?.message}
            >
              <select
                id="budget"
                className={inputClassName}
                defaultValue=""
                {...register("budget", {
                  setValueAs: (v) => (v === "" ? undefined : v),
                })}
              >
                <option value="">Prefer not to say</option>
                {BUDGET_RANGES.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {/* v5 §3 — five options is a set you scan, not a set you open. */}
          <FieldSet
            legend="Project type"
            error={errors.projectType?.message}
            describedBy="projectType-error"
          >
            <div className="flex flex-wrap gap-2">
              {PROJECT_TYPES.map((type) => (
                <label
                  key={type}
                  className={cn(
                    "inline-flex min-h-11 cursor-pointer items-center rounded-pill border px-5 text-sm",
                    "border-hairline text-graphite transition-colors duration-[var(--dur-fast)]",
                    "hover:border-slate hover:text-ink",
                    "has-[:checked]:border-signal has-[:checked]:bg-signal-sub has-[:checked]:text-signal",
                    "has-[:focus-visible]:outline has-[:focus-visible]:outline-2",
                    "has-[:focus-visible]:outline-offset-[3px] has-[:focus-visible]:outline-focus",
                  )}
                >
                  <input
                    type="radio"
                    value={type}
                    className="sr-only"
                    aria-invalid={errors.projectType ? true : undefined}
                    {...register("projectType")}
                  />
                  {type}
                </label>
              ))}
            </div>
          </FieldSet>

          <Field label="Message" htmlFor="message" error={errors.message?.message}>
            <textarea
              id="message"
              rows={6}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={cn(
                errors.message ? "message-error" : "",
                message.length > COUNT_FROM ? "message-count" : "",
              ).trim() || undefined}
              className={inputClassName}
              {...register("message")}
            />
            {/* v5 §3 — appears past 100 characters, danger at the limit.
                Deliberately not a live region: announcing on every
                keystroke would make the field unusable with a screen
                reader. It is linked by aria-describedby instead. */}
            {message.length > COUNT_FROM && (
              <p
                id="message-count"
                className={cn(
                  "mono-label mt-1.5 text-right",
                  overLimit ? "text-danger" : "text-slate",
                )}
              >
                {message.length.toLocaleString("en-US")} /{" "}
                {MESSAGE_MAX.toLocaleString("en-US")}
              </p>
            )}
          </Field>

          {/* Honeypot — off-screen, skipped by tab order and screen readers (§12.1.2). */}
          <div
            aria-hidden="true"
            className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
          >
            <label htmlFor="website">Website</label>
            <input
              id="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(event) => setHoneypot(event.target.value)}
            />
          </div>

          {serverError && (
            <div
              role="alert"
              className="rounded-md border border-danger/40 bg-fog px-4 py-3 text-sm text-ink"
            >
              <p>{errorCopy[serverError.kind]}</p>
              {/* v5 §3 — both direct channels, with the typed text carried
                  into the mailto so nothing has to be retyped. */}
              <p className="mt-3 flex flex-wrap items-center gap-3">
                <a
                  href={mailtoHref}
                  className="font-medium text-signal underline"
                >
                  {profile.email}
                </a>
                <WhatsAppLink />
              </p>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="inline-flex min-h-11 items-center gap-2 rounded-pill bg-ink px-6 text-sm font-medium text-paper transition-colors duration-[var(--dur-fast)] hover:bg-signal disabled:opacity-60"
            >
              {isSubmitting && (
                <span
                  aria-hidden="true"
                  className="size-3.5 animate-spin rounded-full border-2 border-paper/40 border-t-paper"
                />
              )}
              {isSubmitting ? "Sending…" : "Send message"}
            </button>
          </div>
        </fieldset>
      </form>

      <Toast.Root
        open={toastOpen}
        onOpenChange={setToastOpen}
        className="rounded-md border border-hairline bg-paper px-4 py-3 shadow-lift"
      >
        <Toast.Title className="text-sm font-medium text-ink">
          Message not sent
        </Toast.Title>
        <Toast.Description className="mt-1 text-sm text-graphite">
          Your text is preserved. Retry, or use a direct channel.
        </Toast.Description>
      </Toast.Root>
      <Toast.Viewport className="fixed bottom-6 right-6 z-50 w-80 max-w-[calc(100vw-2rem)]" />
    </Toast.Provider>
  );
}
