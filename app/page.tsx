import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Counter } from "@/components/ui/Counter";
import { Marquee } from "@/components/ui/Marquee";
import { CopyButton } from "@/components/ui/CopyButton";
import { FeatureCard } from "@/components/home/FeatureCard";
import { MagneticCTA } from "@/components/motion/MagneticCTA";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { SpineTimeline } from "@/components/work/SpineTimeline";
import { capabilities } from "@/content/home";
import { packages } from "@/content/packages";
import { profile } from "@/content/profile";
import { projectBySlug, spineProjects } from "@/content/projects";
import { sortByStartDesc } from "@/lib/dates";
import { weeklyDownloads } from "@/lib/npm";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteUrl } from "@/lib/site";

/**
 * Home — §10.1, sections in fixed order. Static with 6h ISR (the lab
 * teaser's npm counts, §12.3). Hero TextReveal, Counter odometers, and
 * the magnetic CTA arrive in the motion pass (M8) — everything renders
 * complete without them.
 */
export default async function HomePage() {
  const downloads = await Promise.allSettled(
    packages.map((pkg) => weeklyDownloads(pkg.name)),
  );
  const downloadFor = (i: number) => {
    const result = downloads[i];
    return result?.status === "fulfilled" ? result.value : null;
  };

  // §10.1.5 — one card per argument: technical depth, current relevance,
  // ownership.
  const jifu = projectBySlug("jifu360")!;
  const rightnowmd = projectBySlug("rightnowmd")!;
  const zowis = projectBySlug("zowis")!;

  // §10.1.6 — 2024 → present, in the real Spine component.
  const preview = spineProjects.filter((p) => p.start >= "2024-01");

  // §10.1.4 — names derived from content, never hardcoded.
  const marqueeNames = [
    ...sortByStartDesc(spineProjects).map((p) => p.name),
    "Zowis",
  ];

  return (
    <>
      {/* §16 — Person */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: profile.name,
          alternateName: profile.alias,
          jobTitle: "Lead Mobile Engineer",
          worksFor: { "@type": "Organization", name: profile.company },
          knowsAbout: [
            "React Native",
            "TypeScript",
            "Expo",
            "Mobile architecture",
            "WebRTC",
            "Payments",
          ],
          sameAs: profile.socials.map((s) => s.href),
          email: `mailto:${profile.email}`,
          url: siteUrl,
        }}
      />

      {/* 2 — Hero (§10.1.2) — radial signal wash, top-right, ambient only. */}
      <Section
        spacing="none"
        className="wash-hero flex min-h-[88svh] flex-col pt-[var(--section-y-sm)] md:pt-[var(--section-y-md)]"
      >
        <Eyebrow>
          Lead mobile engineer — Abuja, Nigeria — UTC+1
        </Eyebrow>

        {/* §11.1: hero text reveal only — 3 line masks, 620ms + 80ms
            stagger = 780ms total orchestration, load-only. */}
        <h1 className="text-display mt-8 font-bold">
          <TextReveal
            lines={[
              <>
                Seventeen apps in production
                <span className="text-signal">.</span>
              </>,
              <>
                Two npm packages
                <span className="text-signal">.</span>
              </>,
              <span key="plum" className="text-plum">
                One fashion label.
              </span>,
            ]}
          />
        </h1>

        <p className="measure mt-10 text-lead">
          I&rsquo;m Ace. I lead mobile builds in React Native and TypeScript
          for teams in Lagos, Toronto, Dubai and San Francisco — and I run
          Zowis Fashion, my own brand, on infrastructure I built myself.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <MagneticCTA>
            <Link
              href="/work"
              className="group inline-flex min-h-11 items-center gap-2 rounded-pill bg-ink px-6 text-sm font-medium text-paper no-underline transition-colors duration-[var(--dur-fast)] hover:bg-signal"
            >
              See the work
              <ArrowRight
                aria-hidden="true"
                size={16}
                className="transition-transform duration-[var(--dur-fast)] group-hover:translate-x-1"
              />
            </Link>
          </MagneticCTA>
          {/* "Download CV" ghost button lands when the PDF is supplied (§21). */}
        </div>

        <p className="mt-8 inline-flex items-center gap-2.5 text-sm text-graphite">
          <span aria-hidden="true" className="size-2 rounded-pill bg-success" />
          {profile.availability.note} · {profile.availability.preferredLength}
        </p>
      </Section>

      {/* 3 — Proof strip (§10.1.3) — quiet signal-tinted panel wash. */}
      <Section tone="mist" wash="signal" aria-label="Proof in numbers">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:divide-x md:divide-hairline">
          {profile.stats.map((stat) => (
            <div key={stat.label} className="md:px-8 md:first:pl-0">
              <Counter value={stat.value} label={stat.label} />
            </div>
          ))}
        </div>
      </Section>

      {/* 4 — Client marquee (§10.1.4) — full bleed, outside the container */}
      <div className="py-14 md:py-20">
        <Marquee items={marqueeNames} />
      </div>

      {/* 5 — Selected work (§10.1.5) */}
      <Section aria-label="Selected work">
        <Eyebrow>Selected work</Eyebrow>
        <h2 className="mt-4 text-h2">
          Three arguments, one operator
        </h2>
        <div className="mt-10 grid gap-[var(--grid-gap)] md:grid-cols-12">
          <Reveal delay={0} className="md:col-span-7">
            <FeatureCard project={jifu} href="/work/jifu360" className="h-full" />
          </Reveal>
          <Reveal delay={1} className="md:col-span-5">
            <FeatureCard project={rightnowmd} href="/work/rightnowmd" className="h-full" />
          </Reveal>
          <Reveal delay={2} className="md:col-span-12">
            <FeatureCard project={zowis} href="/zowis" />
          </Reveal>
        </div>
      </Section>

      {/* 6 — Spine preview (§10.1.6) */}
      <Section aria-label="Recent chronology">
        <Eyebrow>The record</Eyebrow>
        <h2 className="mt-4 text-h2">
          Concurrent by design
        </h2>
        <p className="mono-label mt-3 text-slate">
          2024 — present. Five contracts ran in parallel at the peak.
        </p>
        <div className="mt-12 md:mt-16">
          <SpineTimeline
            projects={preview}
            ariaLabel="Recent work history, most recent first"
          />
        </div>
        <p className="mt-12">
          <Link
            href="/work"
            className="group inline-flex items-center gap-2 text-sm font-medium text-ink no-underline"
          >
            View all {spineProjects.length} projects, back to 2019
            <ArrowRight
              aria-hidden="true"
              size={16}
              className="transition-transform duration-[var(--dur-fast)] group-hover:translate-x-1"
            />
          </Link>
        </p>
      </Section>

      {/* 7 — Zowis crossover band (§10.1.7 / §5.1 redirect item 3): the one
          genuinely saturated moment on the site. Paper copy on the deep
          plum wash — every pairing ≥7:1. */}
      <section className="wash-plum" aria-label="Zowis Fashion Limited">
        <Container className="grid gap-10 py-[var(--section-y-sm)] md:grid-cols-2 md:py-[var(--section-y-md)]">
          {/* Lookbook image ⚠ NEEDS INPUT — ratio-correct placeholder, no fake photo. */}
          <div
            aria-hidden="true"
            className="flex aspect-[4/5] max-w-md items-center justify-center rounded-lg bg-plum-sub"
          >
            <span className="mono-label text-plum">Lookbook</span>
          </div>
          <div className="flex flex-col justify-center">
            <p className="mono-label flex items-center gap-3 text-plum-sub">
              <span aria-hidden="true" className="h-px w-8 bg-plum-sub/60" />
              Founder track
            </p>
            <h2 className="mt-4 font-display text-h2 font-semibold text-paper">
              Zowis Fashion Limited
            </h2>
            <p className="measure mt-5 text-body text-paper">
              A women&rsquo;s fashion brand run end to end — the label, the
              e-commerce, and the company behind them. I built its commerce
              backend on Supabase, wired GUO logistics for delivery, and set
              up the ads infrastructure it sells through. The same hands that
              ship client products run this one.
            </p>
            <p className="mono-label mt-6 text-plum-sub">
              E-commerce · Logistics integration · Brand operations
            </p>
            <p className="mt-8">
              <Link
                href="/zowis"
                className="group inline-flex items-center gap-2 text-sm font-medium text-paper no-underline"
              >
                Enter Zowis
                <ArrowRight
                  aria-hidden="true"
                  size={16}
                  className="transition-transform duration-[var(--dur-fast)] group-hover:translate-x-1"
                />
              </Link>
            </p>
          </div>
        </Container>
      </section>

      {/* 8 — Capabilities (§10.1.8) — plum-tinted panel: the quiet echo
          after the saturated band; alternates against the proof strip. */}
      <Section tone="mist" wash="plum" aria-label="Capabilities">
        <Eyebrow>What I do</Eyebrow>
        <div className="mt-10 grid gap-x-[var(--grid-gap)] gap-y-12 md:grid-cols-2">
          {capabilities.map((cap, i) => (
            <Reveal key={cap.index} delay={i}>
              <p className="mono-label text-signal">{cap.index}</p>
              <h3 className="mt-2 font-sans text-lead font-medium text-ink">
                {cap.title}
              </h3>
              <p className="measure mt-3 text-sm text-graphite">{cap.body}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 9 — Lab teaser (§10.1.9) */}
      <Section aria-label="Open source">
        <Eyebrow>Open source</Eyebrow>
        <div className="mt-10 grid gap-[var(--grid-gap)] md:grid-cols-2">
          {packages.map((pkg, i) => {
            const weekly = downloadFor(i);
            return (
              <div
                key={pkg.name}
                className="rounded-lg border border-hairline p-6"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-mono text-sm font-medium text-ink">
                    {pkg.name}
                  </h3>
                  {weekly !== null && (
                    <span className="mono-label text-slate">
                      {weekly.toLocaleString("en-US")}
                      <span className="normal-case">/wk</span>
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-graphite">{pkg.description}</p>
                <div className="mt-4 flex items-center justify-between gap-2 rounded-md bg-fog px-4 py-1.5">
                  <code className="font-mono text-meta text-graphite">
                    {pkg.install}
                  </code>
                  <CopyButton text={pkg.install} />
                </div>
                <p className="mt-3">
                  <a
                    href={pkg.npm}
                    rel="noopener noreferrer"
                    className="mono-label text-signal no-underline hover:underline"
                  >
                    npm ↗
                  </a>
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* 10 — Contact band (§10.1.10 / §5.1 redirect item 4): fuller
          signal wash, second-most saturated. Ink copy throughout. */}
      <Section className="wash-contact" aria-label="Contact">
        <h2 className="font-display text-h1 font-semibold text-ink">
          Have something to build?
        </h2>
        <p className="mt-6">
          <a
            href={`mailto:${profile.email}`}
            className="font-display text-h3 font-medium text-signal no-underline hover:underline"
          >
            {profile.email}
          </a>
        </p>
        <p className="mt-4 inline-flex items-center gap-2.5 text-sm text-graphite">
          <span aria-hidden="true" className="size-2 rounded-pill bg-success" />
          {profile.availability.note} · {profile.availability.preferredLength}
        </p>
        <p className="mt-8">
          <MagneticCTA>
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
          </MagneticCTA>
        </p>
      </Section>
    </>
  );
}
