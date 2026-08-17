import type { Metadata } from "next";
import { Section } from "@/components/layout/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { isProvided } from "@/content/profile";
import { zowis } from "@/content/zowis";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Cover } from "@/components/work/Cover";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Zowis Fashion Limited",
  description:
    "Women's fashion, designed and sold through its own e-commerce. Founded, built and run end to end by Ace Orji.",
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
        <Image
          src={zowis.logo.src}
          alt={zowis.logo.alt}
          width={zowis.logo.width}
          height={zowis.logo.height}
          priority
          className="h-10 w-auto md:h-12"
        />
        <h1 className="mt-6 text-h1">Zowis Fashion Limited</h1>
        <p className="measure mt-4 text-lead text-graphite">{zowis.positioning}</p>
        {isProvided(zowis.foundedYear) && (
          <p className="mono-label mt-3 text-slate">Founded {zowis.foundedYear}</p>
        )}

        {/* The store is the point of the page — the link sits at the top. */}
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          {isProvided(zowis.storeUrl) && (
            <a
              href={zowis.storeUrl}
              rel="noopener noreferrer"
              target="_blank"
              className="group inline-flex min-h-11 items-center gap-2 rounded-pill bg-plum px-6 text-sm font-medium text-paper no-underline transition-colors duration-[var(--dur-fast)] hover:bg-ink"
            >
              Shop the collection
              <ArrowRight
                aria-hidden="true"
                size={16}
                className="transition-transform duration-[var(--dur-fast)] group-hover:translate-x-1"
              />
            </a>
          )}
          <ul className="mono-label flex flex-wrap gap-5">
            {zowis.socials.map((social) => (
              <li key={social.href}>
                <a
                  href={social.href}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="text-slate no-underline transition-colors duration-[var(--dur-fast)] hover:text-plum"
                >
                  {social.label} <span className="normal-case">{social.handle}</span> ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
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
        <div className="mt-8 grid gap-[var(--grid-gap)] sm:grid-cols-2 md:grid-cols-3">
          {zowis.lookbook.map((image) => (
            <Cover
              key={image.src}
              cover={image}
              name="Zowis"
              sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="rounded-lg"
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

    </>
  );
}
