import { Section } from "@/components/layout/Section";
import { profile } from "@/content/profile";

/**
 * Milestone 1 placeholder — a static render of the hero copy (§10.1) plus a
 * type-scale specimen so the foundation can be reviewed at every breakpoint.
 * The real home page (marquee, spine preview, capabilities, …) is Milestone 5,
 * and the hero gains its TextReveal animation in the motion pass (M8).
 */
export default function HomePage() {
  return (
    <>
      <Section
        spacing="none"
        className="flex min-h-[88svh] flex-col pt-[var(--section-y-sm)] md:pt-[var(--section-y-md)]"
      >
        <p className="mono-label text-slate">
          Lead mobile engineer — Abuja, Nigeria — UTC+1
        </p>

        <h1 className="text-display mt-8 font-bold">
          Twelve apps in production
          <span className="text-signal">.</span>
          <br />
          Two npm packages
          <span className="text-signal">.</span>
          <br />
          <span className="text-plum">One fashion label.</span>
        </h1>

        <p className="measure mt-10 text-lead">
          I&rsquo;m Ace. I lead mobile builds in React Native and TypeScript for
          teams in Lagos, Toronto, Dubai and San Francisco — and I run Zowis
          Fashion, my own brand, on infrastructure I built myself.
        </p>

        <p className="mt-8 inline-flex items-center gap-2.5 text-sm text-graphite">
          <span
            aria-hidden="true"
            className="size-2 rounded-pill bg-success"
          />
          Open to remote contracts · {profile.availability.preferredLength}
        </p>
      </Section>

      {/* Temporary foundation check — removed when Milestone 5 builds the real home. */}
      <Section tone="mist" aria-label="Type scale specimen">
        <p className="mono-label text-slate">Milestone 1 — type &amp; spacing check</p>
        <div className="mt-10 flex flex-col gap-8">
          <div>
            <p className="mono-label text-slate">display</p>
            <p className="text-display font-display font-bold text-ink">Career spine</p>
          </div>
          <div>
            <p className="mono-label text-slate">h1</p>
            <p className="font-display text-h1 font-semibold text-ink">Work index</p>
          </div>
          <div>
            <p className="mono-label text-slate">h2</p>
            <p className="font-display text-h2 font-semibold text-ink">Selected work</p>
          </div>
          <div>
            <p className="mono-label text-slate">h3</p>
            <p className="text-h3 font-medium text-ink">Card title</p>
          </div>
          <div>
            <p className="mono-label text-slate">lead / body / sm / meta</p>
            <p className="measure text-lead text-graphite">
              Lead paragraph size, capped at a 68-character measure.
            </p>
            <p className="measure mt-2 text-body text-graphite">
              Body copy at 17px with 1.65 leading.
            </p>
            <p className="mt-2 text-sm text-graphite">Small text at 15px.</p>
            <p className="mono-label mt-2 text-slate">10.2025 — 07.2026</p>
          </div>
        </div>
      </Section>
    </>
  );
}
