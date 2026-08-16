import type { Metadata } from "next";
import { Section } from "@/components/layout/Section";
import { ContactForm } from "@/components/contact/ContactForm";
import { WhatsAppLink } from "@/components/contact/WhatsAppLink";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a conversation about a mobile build. Remote contract engagements, 3–6 months preferred.",
};

/**
 * Contact — §10.7. Static shell, dynamic POST. Response-time promise and
 * Cal.com embed are ⚠ NEEDS INPUT (§21) and omitted until supplied.
 * Without JS the form degrades to the mailto path (edge case #19).
 */
export default function ContactPage() {
  return (
    <Section className="wash-hero">
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h1 className="text-h1">Let&rsquo;s talk</h1>
          <p className="mt-6 inline-flex items-center gap-2.5 text-sm text-graphite">
            <span aria-hidden="true" className="size-2 rounded-pill bg-success" />
            {profile.availability.note} · {profile.availability.preferredLength}
          </p>
          <p className="mono-label mt-4 text-slate">
            {profile.location} · {profile.timezone}
          </p>
          <p className="mt-8">
            <a
              href={`mailto:${profile.email}`}
              className="font-display text-h3 font-medium text-signal no-underline hover:underline"
            >
              {profile.email}
            </a>
          </p>
          <p className="mt-6">
            <WhatsAppLink />
          </p>
          <p className="mono-label mt-6 flex gap-5">
            {profile.socials.map((social) => (
              <a
                key={social.href}
                href={social.href}
                rel="noopener noreferrer"
                className="text-slate no-underline hover:text-ink"
              >
                {social.label} ↗
              </a>
            ))}
          </p>
        </div>

        <div className="lg:col-span-7">
          <ContactForm />
          <noscript>
            <p className="mt-6 text-sm text-graphite">
              The form needs JavaScript. Email me instead:{" "}
              <a href={`mailto:${profile.email}`} className="text-signal underline">
                {profile.email}
              </a>
            </p>
          </noscript>
        </div>
      </div>
    </Section>
  );
}
