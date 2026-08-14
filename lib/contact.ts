import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { contactSubmissionSchema, type ContactFields } from "./schema";

/**
 * Contact processing — §12.1, pure of transport so every §17 failure row
 * (12–16) is unit-testable. The route handler wires real deps; tests
 * inject fakes. Flow order is the spec's: validate → honeypot → timing →
 * Turnstile → rate limit → sanitise → dedupe → send.
 */

export type ContactResult = {
  status: 200 | 400 | 403 | 422 | 429 | 502 | 503;
  body: {
    ok: boolean;
    error?: string;
    fields?: Record<string, string>;
    retryAfterSeconds?: number;
  };
  retryAfterSeconds?: number;
};

export type SanitizedContact = ContactFields & { ip: string };

export type ContactDeps = {
  /** Sends notification + auto-ack. Throws on provider outage (row 16). */
  sendEmails: (input: SanitizedContact) => Promise<void>;
  /** False when RESEND_API_KEY is missing — degraded mode returns 503. */
  emailConfigured: boolean;
  /** Null when Turnstile is not configured — check is skipped and logged (row 15). */
  verifyTurnstile: ((token: string, ip: string) => Promise<boolean>) | null;
  formSecret: string;
  now: () => number;
  log: (message: string) => void;
};

const MIN_FILL_MS = 2500;
const CHALLENGE_MAX_AGE_MS = 2 * 60 * 60 * 1000;

export function signChallenge(ts: number, secret: string): string {
  return createHmac("sha256", secret).update(String(ts)).digest("hex");
}

export function issueChallenge(secret: string, now: number) {
  return { ts: now, sig: signChallenge(now, secret) };
}

function challengeValid(
  challenge: { ts: number; sig: string },
  secret: string,
): boolean {
  const expected = signChallenge(challenge.ts, secret);
  const a = Buffer.from(challenge.sig);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Strip HTML and cap lengths before templating into email (§12.1.4). */
function sanitize(value: string, max: number): string {
  return value.replace(/<[^>]*>/g, "").slice(0, max).trim();
}

/** Sliding-window per-IP rate limit: 3 / 10 min, 20 / day (§12.1.3). */
export class RateLimiter {
  private hits = new Map<string, number[]>();

  check(ip: string, now: number): { allowed: boolean; retryAfterSeconds: number } {
    const tenMin = 10 * 60 * 1000;
    const day = 24 * 60 * 60 * 1000;
    const kept = (this.hits.get(ip) ?? []).filter((t) => now - t < day);
    const lastTen = kept.filter((t) => now - t < tenMin);

    if (lastTen.length >= 3) {
      const oldest = Math.min(...lastTen);
      return { allowed: false, retryAfterSeconds: Math.ceil((oldest + tenMin - now) / 1000) };
    }
    if (kept.length >= 20) {
      const oldest = Math.min(...kept);
      return { allowed: false, retryAfterSeconds: Math.ceil((oldest + day - now) / 1000) };
    }
    kept.push(now);
    this.hits.set(ip, kept);
    return { allowed: true, retryAfterSeconds: 0 };
  }
}

/** 60s dedupe on (email + message hash) — row 14. Registered only after a successful send. */
export class Deduper {
  private seen = new Map<string, number>();

  private key(email: string, message: string): string {
    return createHash("sha256").update(`${email}\n${message}`).digest("hex");
  }

  isDuplicate(email: string, message: string, now: number): boolean {
    const at = this.seen.get(this.key(email, message));
    return at !== undefined && now - at < 60_000;
  }

  register(email: string, message: string, now: number): void {
    this.seen.set(this.key(email, message), now);
    // Opportunistic cleanup.
    for (const [k, t] of this.seen) {
      if (now - t >= 60_000) this.seen.delete(k);
    }
  }
}

export async function processContact(
  raw: unknown,
  ip: string,
  turnstileToken: string | null,
  deps: ContactDeps,
  rateLimiter: RateLimiter,
  deduper: Deduper,
): Promise<ContactResult> {
  const now = deps.now();

  // 1 — Validate (422 + field errors).
  const parsed = contactSubmissionSchema.safeParse(raw);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fields[key]) fields[key] = issue.message;
    }
    return { status: 422, body: { ok: false, error: "validation", fields } };
  }
  const data = parsed.data;

  // 2 — Honeypot: fake success; never tell bots they failed (§12.1.2).
  if (data.website && data.website.length > 0) {
    deps.log("contact: honeypot tripped — returning fake success");
    return { status: 200, body: { ok: true } };
  }

  // 3 — Timing: signed mount timestamp; reject sub-2.5s fills.
  if (data.challenge) {
    if (!challengeValid(data.challenge, deps.formSecret)) {
      return { status: 400, body: { ok: false, error: "bad_request" } };
    }
    const age = now - data.challenge.ts;
    if (age < MIN_FILL_MS || age > CHALLENGE_MAX_AGE_MS) {
      deps.log(`contact: timing check rejected (age ${age}ms)`);
      return { status: 400, body: { ok: false, error: "bad_request" } };
    }
  } else {
    deps.log("contact: no timing challenge supplied — degraded, relying on honeypot + rate limit");
  }

  // 4 — Turnstile, only when configured; degrade openly otherwise (row 15).
  if (deps.verifyTurnstile) {
    const passed = turnstileToken
      ? await deps.verifyTurnstile(turnstileToken, ip)
      : false;
    if (!passed) {
      return { status: 403, body: { ok: false, error: "verification_failed" } };
    }
  } else {
    deps.log("contact: Turnstile not configured — degraded, relying on honeypot + timing + rate limit");
  }

  // 5 — Rate limit (429 + Retry-After, row 13).
  const rate = rateLimiter.check(ip, now);
  if (!rate.allowed) {
    return {
      status: 429,
      body: { ok: false, error: "rate_limited", retryAfterSeconds: rate.retryAfterSeconds },
      retryAfterSeconds: rate.retryAfterSeconds,
    };
  }

  // 6 — Sanitise.
  const clean: SanitizedContact = {
    name: sanitize(data.name, 100),
    email: data.email,
    company: data.company ? sanitize(data.company, 120) : undefined,
    projectType: data.projectType,
    budget: data.budget,
    message: sanitize(data.message, 4000),
    ip,
  };

  // 7 — Dedupe (row 14): a repeat inside 60s succeeds without re-sending.
  if (deduper.isDuplicate(clean.email, clean.message, now)) {
    deps.log("contact: duplicate within 60s — acknowledged without re-send");
    return { status: 200, body: { ok: true } };
  }

  // 8 — Degraded mode: no email channel configured (README/§19).
  if (!deps.emailConfigured) {
    deps.log("contact: RESEND_API_KEY missing — email channel unavailable");
    return { status: 503, body: { ok: false, error: "email_unavailable" } };
  }

  // 9 — Send; provider outage is a 502 with the mailto fallback client-side (row 16).
  try {
    await deps.sendEmails(clean);
  } catch (error) {
    deps.log(
      `contact: send failed — ${error instanceof Error ? error.message : "unknown"}`,
    );
    return { status: 502, body: { ok: false, error: "email_failed" } };
  }

  deduper.register(clean.email, clean.message, now);
  return { status: 200, body: { ok: true } };
}
