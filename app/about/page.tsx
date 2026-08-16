import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Cover } from "@/components/work/Cover";
import { SpineTimeline } from "@/components/work/SpineTimeline";
import {
  bioBlocks,
  certifications,
  concurrencyNote,
  education,
  stackGroups,
  waysOfWorking,
} from "@/content/about";
import { profile } from "@/content/profile";
import { spineProjects, undatedWork } from "@/content/projects";
import { JsonLd } from "@/components/seo/JsonLd";
import { personNode, PERSON_ID } from "@/lib/structured-data";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Joseph 'Ace' Orji — lead mobile engineer shipping React Native products since 2019, and founder of Zowis Fashion Limited.",
};

/** Backtick spans in the owner's copy render as inline code. */
function BioText({ text }: { text: string }) {
  const parts = text.split("`");
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <code key={i} className="font-mono text-[0.9em] text-ink">
            {part}
          </code>
        ) : (
          part
        ),
      )}
    </>
  );
}

/**
 * About — §10.5, bio from the owner-supplied about-copy.md. The
 * chronology reuses the Spine in its compact variant over the dated
 * record, captioned by the copy's concurrency paragraph; undated work
 * and §9.5 education render as quiet rows at the year granularity they
 * were supplied in — no invented months.
 */
export default function AboutPage() {
  return (
    <>
      {/* §16 as amended (v5 §4.2) — ProfilePage wrapping the shared Person */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          url: `${siteUrl}/about`,
          mainEntity: personNode(),
          about: { "@id": PERSON_ID },
        }}
      />

      {/* 1 — Portrait + bio — ambient hero wash (§5.1 redirect, rollout) */}
      <Section
        spacing="none"
        className="wash-hero pt-[var(--section-y-sm)] md:pt-[var(--section-y-md)]"
      >
        <div className="grid gap-10 md:grid-cols-12">
          <Cover
            cover={{
              src: "/images/profile/ace.jpeg",
              alt: "Portrait of Joseph \u2018Ace\u2019 Orji",
              ratio: "4/5",
            }}
            name="Ace"
            sizes="(min-width: 768px) 33vw, 100vw"
            className="rounded-lg md:col-span-4"
            textClassName="text-h2"
          />
          <div className="md:col-span-8">
            <h1 className="text-h1">Ace</h1>
            <div className="mt-6 flex flex-col gap-5">
              {bioBlocks.map((block, i) => (
                <div key={block.heading ?? i} className="flex flex-col gap-5">
                  {block.heading && (
                    <h2 className="mt-4 font-display text-h3 font-semibold text-ink">
                      {block.heading}
                    </h2>
                  )}
                  {block.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 32)} className="measure text-body">
                      <BioText text={paragraph} />
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* 2 — Full chronology: compact spine + undated + education */}
      <Section aria-label="Chronology">
        <Eyebrow>The chronology</Eyebrow>
        <h2 className="mt-4 text-h2">2014 to now</h2>
        {/* The copy's concurrency paragraph — the caption for the spine. */}
        <p className="measure mt-5 text-body">{concurrencyNote}</p>
        <div className="mt-12">
          <SpineTimeline
            projects={spineProjects}
            variant="compact"
            ariaLabel="Career chronology, most recent first"
          />
        </div>

        <div className="mt-14">
          <h3 className="mono-label text-slate">Dates pending</h3>
          <ul className="mt-3 flex flex-col gap-1.5">
            {undatedWork.map((p) => (
              <li key={p.slug} className="text-sm text-graphite">
                <span className="font-medium text-ink">{p.name}</span>
                <span className="mono-label text-slate"> · {p.track}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-14">
          <h3 className="mono-label text-slate">Education</h3>
          <ul className="mt-3 flex flex-col divide-y divide-hairline">
            {education.map((row) => (
              <li
                key={row.institution}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3"
              >
                <span className="text-sm text-ink">{row.institution}</span>
                <span className="text-sm text-graphite">{row.award}</span>
                <span className="mono-label text-slate">{row.years}</span>
              </li>
            ))}
          </ul>
          <p className="mono-label mt-6 text-slate">
            Certifications ·{" "}
            <span className="normal-case">{certifications.join(" · ")}</span>
          </p>
        </div>
      </Section>

      {/* 3 — Stack, grouped columns (§10.5.3) — signal panel wash */}
      <Section tone="mist" wash="signal" aria-label="Stack">
        <Eyebrow>Stack</Eyebrow>
        <h2 className="mt-4 text-h2">Everything here shipped in a real project</h2>
        <dl className="mt-10 grid gap-x-[var(--grid-gap)] gap-y-8 md:grid-cols-2 lg:grid-cols-3">
          {stackGroups.map((group) => (
            <div key={group.label}>
              <dt className="mono-label text-signal">{group.label}</dt>
              <dd className="mt-2 text-sm text-graphite">{group.items}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* 4 — Ways of working */}
      <Section aria-label="Ways of working">
        <Eyebrow>Ways of working</Eyebrow>
        <div className="mt-10 grid gap-[var(--grid-gap)] sm:grid-cols-2 lg:grid-cols-4">
          {waysOfWorking.map((way) => (
            <div key={way.label}>
              <h3 className="mono-label text-slate">{way.label}</h3>
              <p className="mt-2 text-sm text-graphite">{way.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 5 — CTA — plum panel wash, alternating with the stack panel */}
      <Section tone="mist" wash="plum" aria-label="Contact">
        <h2 className="text-h2">Working on something mobile?</h2>
        <p className="mt-4 inline-flex items-center gap-2.5 text-sm text-graphite">
          <span aria-hidden="true" className="size-2 rounded-pill bg-success" />
          {profile.availability.note} · {profile.availability.preferredLength}
        </p>
        <p className="mt-6">
          <Link
            href="/contact"
            className="group inline-flex min-h-11 items-center gap-2 rounded-pill bg-ink px-6 text-sm font-medium text-paper no-underline transition-colors duration-[var(--dur-fast)] hover:bg-signal"
          >
            Start a conversation
            <ArrowRight
              aria-hidden="true"
              size={16}
              className="transition-transform duration-[var(--dur-fast)] group-hover:translate-x-1"
            />
          </Link>
        </p>
      </Section>
    </>
  );
}
