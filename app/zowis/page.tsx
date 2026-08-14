import type { Metadata } from "next";
import { Section } from "@/components/layout/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { isProvided } from "@/content/profile";
import { zowis } from "@/content/zowis";

export const metadata: Metadata = {
  title: "Zowis Fashion Limited",
  description:
    "Women's fashion, designed and sold through its own e-commerce — founded, built and run end to end by Ace Orji.",
};

/**
 * Zowis brand page — §10.4. Plum accent throughout, white background,
 * same skeleton as the rest of the site. Founding date, lookbook images,
 * store URL and Instagram are ⚠ NEEDS INPUT: gaps render as edge-case #1
 * ratio panels or are omitted — nothing is stubbed or invented. The
 * §12.2 product feed and the store CTA band land when the store URL
 * exists.
 */
export default function ZowisPage() {
  return (
    <>
      {/* 1 — Hero — ambient wash in the brand's plum */}
      <Section
        spacing="none"
        className="wash-hero pt-[var(--section-y-sm)] md:pt-[var(--section-y-md)]"
        style={{ "--wash-hero": "var(--color-plum)" } as React.CSSProperties}
      >
        <p className="font-display text-h3 font-bold tracking-[-0.02em] text-plum">
          ZOWIS
        </p>
        <h1 className="mt-4 text-h1">Zowis Fashion Limited</h1>
        <p className="measure mt-4 text-lead text-graphite">{zowis.positioning}</p>
        {isProvided(zowis.foundedYear) && (
          <p className="mono-label mt-3 text-slate">Founded {zowis.foundedYear}</p>
        )}
      </Section>

      {/* 2 — Brand story */}
      <Section aria-label="Brand story">
        <div className="grid gap-10 md:grid-cols-2">
          {/* Portrait / atelier image ⚠ NEEDS INPUT — ratio panel, no stub photo. */}
          <div
            aria-hidden="true"
            className="flex aspect-[4/5] max-w-md items-center justify-center rounded-lg border border-hairline bg-mist"
          >
            <span className="font-display text-h3 font-semibold text-slate">
              Zowis
            </span>
          </div>
          <div className="flex flex-col justify-center gap-5">
            {zowis.story.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="measure text-body">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </Section>

      {/* 3 — Lookbook (⚠ images pending — ratio-correct panels, edge case #1) */}
      <Section tone="mist" wash="plum" aria-label="Lookbook">
        <Eyebrow>Lookbook</Eyebrow>
        {zowis.lookbook.length === 0 ? (
          <>
            <p className="mono-label mt-4 text-slate">Images pending</p>
            <div className="mt-8 grid grid-cols-2 gap-[var(--grid-gap)] md:grid-cols-3">
              {(["4/5", "1/1", "4/5", "1/1", "4/5", "1/1"] as const).map(
                (ratio, i) => (
                  <div
                    key={i}
                    aria-hidden="true"
                    className={
                      ratio === "4/5"
                        ? "aspect-[4/5] rounded-lg border border-hairline bg-plum-sub"
                        : "aspect-square rounded-lg border border-hairline bg-plum-sub"
                    }
                  />
                ),
              )}
            </div>
          </>
        ) : null}
      </Section>

      {/* 4 — Built and run in-house: the crossover section (§10.4.4) */}
      <Section aria-label="Built and run in-house">
        <Eyebrow>Built and run in-house</Eyebrow>
        <h2 className="mt-4 text-h2">The brand runs on my own stack</h2>
        <div className="mt-10 grid gap-[var(--grid-gap)] sm:grid-cols-2 lg:grid-cols-4">
          {zowis.builtInHouse.map((card) => (
            <div key={card.label} className="rounded-lg border border-hairline p-6">
              <p className="mono-label text-plum">{card.label}</p>
              <p className="mt-3 text-sm text-graphite">{card.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 5/6 — Product tiles + store/Instagram CTA band land with the
          store URL and handle (⚠ NEEDS INPUT, §21). */}
    </>
  );
}
