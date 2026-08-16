import { randomBytes, randomUUID } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import {
  Deduper,
  issueChallenge,
  processContact,
  RateLimiter,
  type ContactDeps,
  type SanitizedContact,
} from "@/lib/contact";
import { profile } from "@/content/profile";
import { siteUrl } from "@/lib/site";

/** §12.1 — Node runtime, never Edge. */
export const runtime = "nodejs";

// Module-scope state: in-memory LRU fallback per §12.1.3 (no Upstash env
// yet — the degradation is logged once at module init).
const rateLimiter = new RateLimiter();
const deduper = new Deduper();
if (!process.env.UPSTASH_REDIS_REST_URL) {
  console.warn(
    "contact: Upstash not configured — using in-memory rate limiting (resets on deploy)",
  );
}

// FORM_SECRET signs the timing challenge. Without one we generate an
// ephemeral secret per server start: challenges stay valid within a
// deploy, which is all the timing check needs. Logged as degradation.
const formSecret =
  process.env.FORM_SECRET ??
  (() => {
    console.warn("contact: FORM_SECRET missing — using an ephemeral secret");
    return randomBytes(32).toString("hex");
  })();

/**
 * v5 §3 — the from address must sit on the Resend-verified sending domain.
 * A mismatched domain (gmail.com being the classic) is accepted by the
 * form, then rejected by the provider at send time with nothing the
 * submitter can see: the failure is invisible until someone reads the
 * logs. Checked once at module init and logged loudly.
 */
function checkFromAddress(): void {
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!from) {
    console.warn(
      "contact: CONTACT_FROM_EMAIL unset — falling back to onboarding@resend.dev",
    );
    return;
  }
  const expected = new URL(siteUrl).hostname.replace(/^www\./, "");
  const domain = from.split("@")[1]?.toLowerCase();
  if (domain !== expected) {
    console.error(
      `contact: CONTACT_FROM_EMAIL is @${domain}, not the verified sending ` +
        `domain @${expected} — Resend will reject every send and the form ` +
        "will fail silently. Set it to an address on @" + expected + ".",
    );
  }
}
checkFromAddress();

function ip(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
  );
}

async function sendViaResend(input: SanitizedContact): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const to = process.env.CONTACT_TO_EMAIL ?? profile.email;
  const from = process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";

  const lines = [
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    input.company ? `Company: ${input.company}` : null,
    `Project type: ${input.projectType}`,
    input.budget ? `Budget: ${input.budget}` : null,
    "",
    input.message,
  ].filter((line): line is string => line !== null);

  // Notification to Ace — the source of truth. Throws on failure (row 16).
  const notification = await resend.emails.send({
    from,
    to,
    replyTo: input.email,
    subject: `Portfolio contact — ${input.name} (${input.projectType})`,
    text: lines.join("\n"),
  });
  if (notification.error) {
    throw new Error(notification.error.message);
  }

  // Auto-acknowledgement to the sender — best-effort only.
  const ack = await resend.emails.send({
    from,
    to: input.email,
    subject: "Got your message — Ace Orji",
    text: `Thanks for getting in touch. Your message arrived and I'll reply from ${to}.\n\n— Ace`,
  });
  if (ack.error) {
    console.warn(`contact: acknowledgement failed — ${ack.error.message}`);
  }
}

function buildDeps(requestId: string): ContactDeps {
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  return {
    sendEmails: sendViaResend,
    emailConfigured: Boolean(process.env.RESEND_API_KEY),
    verifyTurnstile: turnstileSecret
      ? async (token, remoteIp) => {
          const res = await fetch(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                secret: turnstileSecret,
                response: token,
                remoteip: remoteIp,
              }),
              signal: AbortSignal.timeout(5000),
            },
          );
          if (!res.ok) return false;
          const json = (await res.json()) as { success?: boolean };
          return json.success === true;
        }
      : null,
    formSecret,
    now: () => Date.now(),
    // §13: never log message bodies — process notes only, keyed by request id.
    log: (message) => console.warn(`[${requestId}] ${message}`),
  };
}

/** GET issues the signed timing challenge the form fetches on mount. */
export function GET() {
  return NextResponse.json(issueChallenge(formSecret, Date.now()));
}

export async function POST(request: NextRequest) {
  const requestId = randomUUID();
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "bad_request" },
      { status: 400 },
    );
  }

  const token =
    typeof (raw as { turnstileToken?: unknown })?.turnstileToken === "string"
      ? ((raw as { turnstileToken: string }).turnstileToken)
      : null;

  const result = await processContact(
    raw,
    ip(request),
    token,
    buildDeps(requestId),
    rateLimiter,
    deduper,
  );

  const headers = new Headers();
  if (result.retryAfterSeconds) {
    headers.set("Retry-After", String(result.retryAfterSeconds));
  }
  return NextResponse.json(result.body, { status: result.status, headers });
}
