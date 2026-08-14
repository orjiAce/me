import { describe, expect, it, vi } from "vitest";
import {
  Deduper,
  issueChallenge,
  processContact,
  RateLimiter,
  type ContactDeps,
} from "./contact";

/**
 * §17 rows 12–16, demonstrated server-side. Row 12 (network failure) is
 * a client concern — the form's catch path — but every server behaviour
 * it depends on (stable error codes, no lost state) is covered here.
 */

const SECRET = "test-secret";
const T0 = 1_755_000_000_000;

const validBody = (over: Record<string, unknown> = {}) => ({
  name: "Test Person",
  email: "test@example.com",
  projectType: "Contract role",
  message: "A perfectly reasonable project inquiry.",
  challenge: issueChallenge(SECRET, T0),
  ...over,
});

function makeDeps(over: Partial<ContactDeps> = {}): ContactDeps {
  return {
    sendEmails: vi.fn().mockResolvedValue(undefined),
    emailConfigured: true,
    verifyTurnstile: null,
    formSecret: SECRET,
    now: () => T0 + 10_000, // 10s after mount — passes the timing check
    log: vi.fn(),
    ...over,
  };
}

const run = (
  body: unknown,
  deps: ContactDeps,
  rl = new RateLimiter(),
  dd = new Deduper(),
  ip = "203.0.113.7",
) => processContact(body, ip, null, deps, rl, dd);

describe("validation (422)", () => {
  it("returns field errors and sends nothing", async () => {
    const deps = makeDeps();
    const result = await run(validBody({ email: "not-an-email", message: "hi" }), deps);
    expect(result.status).toBe(422);
    expect(result.body.fields).toMatchObject({
      email: expect.any(String),
      message: expect.any(String),
    });
    expect(deps.sendEmails).not.toHaveBeenCalled();
  });
});

describe("honeypot (§12.1.2)", () => {
  it("returns a fake 200 success and sends nothing", async () => {
    const deps = makeDeps();
    const result = await run(validBody({ website: "https://spam.example" }), deps);
    expect(result.status).toBe(200);
    expect(result.body.ok).toBe(true);
    expect(deps.sendEmails).not.toHaveBeenCalled();
  });
});

describe("timing check (§12.1.2)", () => {
  it("rejects a sub-2.5s fill", async () => {
    const deps = makeDeps({ now: () => T0 + 1000 });
    const result = await run(validBody(), deps);
    expect(result.status).toBe(400);
    expect(deps.sendEmails).not.toHaveBeenCalled();
  });

  it("rejects a tampered signature", async () => {
    const deps = makeDeps();
    const result = await run(
      validBody({ challenge: { ts: T0, sig: "f".repeat(64) } }),
      deps,
    );
    expect(result.status).toBe(400);
  });

  it("degrades without a challenge — logged, not blocked", async () => {
    const deps = makeDeps();
    const result = await run(validBody({ challenge: undefined }), deps);
    expect(result.status).toBe(200);
    expect(deps.log).toHaveBeenCalledWith(
      expect.stringContaining("no timing challenge"),
    );
  });
});

describe("Turnstile (row 15)", () => {
  it("skips and logs when not configured — honeypot + timing + rate limit remain", async () => {
    const deps = makeDeps({ verifyTurnstile: null });
    const result = await run(validBody(), deps);
    expect(result.status).toBe(200);
    expect(deps.log).toHaveBeenCalledWith(
      expect.stringContaining("Turnstile not configured"),
    );
  });

  it("rejects when configured and the token fails", async () => {
    const deps = makeDeps({ verifyTurnstile: vi.fn().mockResolvedValue(false) });
    const result = await run(validBody(), deps);
    expect(result.status).toBe(403);
    expect(deps.sendEmails).not.toHaveBeenCalled();
  });
});

describe("rate limit (row 13)", () => {
  it("allows 3 in 10 minutes, then 429 with a retry window", async () => {
    const deps = makeDeps();
    const rl = new RateLimiter();
    const dd = new Deduper();
    for (let i = 0; i < 3; i += 1) {
      const result = await run(validBody({ message: `Message number ${i} long enough.` }), deps, rl, dd);
      expect(result.status).toBe(200);
    }
    const fourth = await run(validBody({ message: "Fourth message, still long enough." }), deps, rl, dd);
    expect(fourth.status).toBe(429);
    expect(fourth.retryAfterSeconds).toBeGreaterThan(0);
    expect(fourth.retryAfterSeconds).toBeLessThanOrEqual(600);
  });

  it("keeps separate IPs separate", async () => {
    const deps = makeDeps();
    const rl = new RateLimiter();
    for (const ip of ["203.0.113.1", "203.0.113.2", "203.0.113.3"]) {
      for (let i = 0; i < 3; i += 1) {
        const result = await processContact(
          validBody({ message: `From ${ip} number ${i}, long enough.` }),
          ip, null, deps, rl, new Deduper(),
        );
        expect(result.status).toBe(200);
      }
    }
  });
});

describe("dedupe (row 14)", () => {
  it("acknowledges an identical resubmit within 60s without re-sending", async () => {
    const deps = makeDeps();
    const rl = new RateLimiter();
    const dd = new Deduper();
    await run(validBody(), deps, rl, dd);
    const second = await run(validBody(), deps, rl, dd);
    expect(second.status).toBe(200);
    expect(deps.sendEmails).toHaveBeenCalledTimes(1);
  });

  it("does not dedupe a failed send — retry goes through", async () => {
    const sendEmails = vi
      .fn()
      .mockRejectedValueOnce(new Error("outage"))
      .mockResolvedValueOnce(undefined);
    const deps = makeDeps({ sendEmails });
    const rl = new RateLimiter();
    const dd = new Deduper();
    const first = await run(validBody(), deps, rl, dd);
    expect(first.status).toBe(502);
    const retry = await run(validBody(), deps, rl, dd);
    expect(retry.status).toBe(200);
    expect(sendEmails).toHaveBeenCalledTimes(2);
  });
});

describe("degraded mode and outage (rows 12/16)", () => {
  it("returns 503 email_unavailable when no key is configured", async () => {
    const deps = makeDeps({ emailConfigured: false });
    const result = await run(validBody(), deps);
    expect(result.status).toBe(503);
    expect(result.body.error).toBe("email_unavailable");
  });

  it("returns 502 email_failed on a provider outage, with the failure logged", async () => {
    const deps = makeDeps({
      sendEmails: vi.fn().mockRejectedValue(new Error("Resend down")),
    });
    const result = await run(validBody(), deps);
    expect(result.status).toBe(502);
    expect(result.body.error).toBe("email_failed");
    expect(deps.log).toHaveBeenCalledWith(expect.stringContaining("send failed"));
  });

  it("strips HTML from templated fields before sending", async () => {
    const sendEmails = vi.fn().mockResolvedValue(undefined);
    const deps = makeDeps({ sendEmails });
    await run(
      validBody({ message: "Hello <script>alert(1)</script> there, long enough." }),
      deps,
    );
    expect(sendEmails).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.not.stringContaining("<script>") }),
    );
  });
});
