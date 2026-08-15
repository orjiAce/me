import type { Metadata } from "next";
import { Section } from "@/components/layout/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { isProvided } from "@/content/profile";
import { zowis } from "@/content/zowis";
import { ArrowRight } from "lucide-react";
import { Cover } from "@/components/work/Cover";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteUrl } from "@/lib/site";

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
      {/* §16 — Organization */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Zowis Fashion Limited",
          founder: { "@type": "Person", name: "Joseph Orji" },
          url: `${siteUrl}/zowis`,
        }}
      />

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

      {/* 1b — The storefront, full width (owner-supplied cover) */}
      <Section spacing="none" className="pt-12 md:pt-16">
        <Cover
          cover={{
            src: "/images/work/zowis/cover.png",
            alt: "The Zowis storefront at wearzowis.com — two models in red ruffled dresses beside the debut-collection headline 'A tasteful garment that truly celebrates your form.'",
            ratio: "16/10",
          }}
          name="Zowis"
          sizes="(min-width: 1280px) 1184px, 100vw"
          className="rounded-lg"
        />
      </Section>

      {/* 2 — Brand story */}
      <Section aria-label="Brand story">
        <div className="grid gap-10 md:grid-cols-2">
          <Cover
            cover={{ ...zowis.portrait, ratio: "4/5" }}
            name="Zowis"
            sizes="(min-width: 768px) 40vw, 100vw"
            className="max-w-md rounded-lg"
          />
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
        <p className="mono-label mt-4 text-slate">More images pending</p>
        <div className="mt-8 grid grid-cols-2 gap-[var(--grid-gap)] md:grid-cols-3">
          {zowis.lookbook.map((image) => (
            <Cover
              key={image.src}
              cover={image}
              name="Zowis"
              sizes="(min-width: 768px) 33vw, 50vw"
              className="rounded-lg"
            />
          ))}
          {(["4/5", "1/1", "4/5", "1/1"] as const).map((ratio, i) => (
            <div
              key={i}
              aria-hidden="true"
              className={
                ratio === "4/5"
                  ? "aspect-[4/5] rounded-lg border border-hairline bg-plum-sub"
                  : "aspect-square rounded-lg border border-hairline bg-plum-sub"
              }
            />
          ))}
        </div>
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

      {/* 6 — CTA band → the store (§10.4.6). Instagram still ⚠ NEEDS INPUT;
          product tiles wait on product imagery. */}
      {isProvided(zowis.storeUrl) && (
        <Section tone="mist" wash="plum" aria-label="Store">
          <h2 className="text-h2">Wear Zowis</h2>
          <p className="mt-6">
            <a
              href={zowis.storeUrl}
              rel="noopener noreferrer"
              className="group inline-flex min-h-11 items-center gap-2 rounded-pill bg-plum px-6 text-sm font-medium text-paper no-underline transition-colors duration-[var(--dur-fast)] hover:bg-ink"
            >
              Shop the collection
              <ArrowRight
                aria-hidden="true"
                size={16}
                className="transition-transform duration-[var(--dur-fast)] group-hover:translate-x-1"
              />
            </a>
          </p>
        </Section>
      )}
    </>
  );
}
