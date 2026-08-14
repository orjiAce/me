import { z } from "zod";

/**
 * Contact form schema — §12.1.1. One schema, validated client-side (RHF
 * resolver) and server-side (route handler). The honeypot and timing
 * challenge ride alongside the user fields but are not user-visible.
 */

export const PROJECT_TYPES = [
  "Contract role",
  "Product build",
  "Consultation",
  "Zowis",
  "Other",
] as const;

export const BUDGET_RANGES = [
  "Under $10k",
  "$10k – $25k",
  "$25k – $50k",
  "$50k+",
  "Not sure yet",
] as const;

export const contactFieldsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Your name is required.")
    .max(100, "Keep the name under 100 characters."),
  email: z.email("That email doesn't look right."),
  company: z.string().trim().max(120, "Keep the company under 120 characters.").optional(),
  projectType: z.enum(PROJECT_TYPES, "Pick a project type."),
  budget: z.enum(BUDGET_RANGES).optional(),
  message: z
    .string()
    .trim()
    .min(10, "Tell me a little more — at least 10 characters.")
    .max(4000, "Keep the message under 4,000 characters."),
});

export const contactSubmissionSchema = contactFieldsSchema.extend({
  /** Honeypot — humans never see it, so it must arrive empty (§12.1.2). */
  website: z.string().optional(),
  /** HMAC-signed mount timestamp for the timing check (§12.1.2). */
  challenge: z
    .object({ ts: z.number(), sig: z.string() })
    .optional(),
});

export type ContactFields = z.infer<typeof contactFieldsSchema>;
export type ContactSubmission = z.infer<typeof contactSubmissionSchema>;
