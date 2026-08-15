import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  featuredProjects,
  projects,
  spineProjects,
  undatedWork,
} from "./projects";
import {
  concurrentWith,
  spineLayout,
  validateProjects,
} from "../lib/dates";
import { isProvided } from "./profile";

describe("content integrity", () => {
  it("passes the build-time assertions", () => {
    expect(() => validateProjects(projects)).not.toThrow();
  });

  it("keeps the corrected §9.3 dates — these supersede the CV", () => {
    const bySlug = Object.fromEntries(projects.map((p) => [p.slug, p]));
    expect(bySlug["rightnowmd"]).toMatchObject({ start: "2026-07", end: null, status: "active" });
    expect(bySlug["jifu360"]).toMatchObject({ start: "2025-11", end: "2026-08", status: "completed" });
    expect(bySlug["lenbi"]).toMatchObject({ start: "2025-10", end: "2026-07", status: "completed" });
    expect(bySlug["sinimax"]).toMatchObject({ start: "2026-02", end: "2026-06", status: "on-hold" });
    expect(bySlug["onewallet-mfb"]).toMatchObject({ start: "2024-06", end: "2026-07" });
    // Amendment v3: UWA unarchived; Nexaflex dates owner-confirmed.
    expect(bySlug["uwa"]).toMatchObject({ start: "2024-06", end: "2026-07", status: "completed" });
    expect(bySlug["nexaflex"]).toMatchObject({ start: "2025-01", end: "2025-11", status: "completed" });
    // Supplied 2026-08-15: Leadership News dated; Zowis founded.
    expect(bySlug["leadership-news"]).toMatchObject({ start: "2025-11", end: "2026-05", status: "completed", role: "Lead Mobile Engineer" });
    expect(bySlug["zowis"]).toMatchObject({ start: "2025-11", end: null, status: "active" });
    expect(bySlug["gateway-edu"]).toMatchObject({ start: "2022-06", end: "2024-02" });
    expect(bySlug["brace-finance"]).toMatchObject({ start: "2022-06", end: "2023-01" });
    expect(bySlug["portsconnect"]).toMatchObject({ start: "2022-06", end: "2023-03" });
    expect(bySlug["bluetanks-ev"]).toMatchObject({ start: "2022-05", end: "2022-10" });
    expect(bySlug["sumotrust"]).toMatchObject({ start: "2022-01", end: "2023-02" });
    expect(bySlug["truzact"]).toMatchObject({ start: "2020-11", end: "2022-04" });
    expect(bySlug["crowdfacture"]).toMatchObject({ start: "2019-09", end: "2021-10" });
    expect(bySlug["checkncommit"]).toMatchObject({ start: "2019-10", end: "2020-08" });
  });

  it("never invents an end month for EvriCent or Delta Digital (edge case #4)", () => {
    const bySlug = Object.fromEntries(projects.map((p) => [p.slug, p]));
    expect(bySlug["evricent"]).toMatchObject({
      start: "2024-02", end: null, endUnknown: true, status: "completed",
    });
    expect(bySlug["delta-digital"]).toMatchObject({
      start: "2023-05", end: null, endUnknown: true, status: "completed",
    });
  });

  it("removes Quant Vertex entirely (owner correction 2026-08-14)", () => {
    expect(projects.some((p) => p.slug === "quant-vertex")).toBe(false);
  });

  it("features exactly JIFU360, RightNowMD and Zowis on home (§10.1.5)", () => {
    expect(featuredProjects.map((p) => p.slug).sort()).toEqual([
      "jifu360",
      "rightnowmd",
      "zowis",
    ]);
  });

  it("puts all nineteen dated entries on the spine — 18 contracts + Zowis", () => {
    expect(spineProjects).toHaveLength(19);
    expect(spineProjects.some((p) => p.slug === "leadership-news")).toBe(true);
    expect(spineProjects.some((p) => p.slug === "zowis")).toBe(true);
    expect(undatedWork.map((p) => p.slug)).toEqual(["lingobase"]);
  });

  it("renders store links as labelled text links on seven projects (amendment §4)", () => {
    const withLinks = projects
      .filter((p) => p.links?.some((l) => /App Store|Google Play/.test(l.label)))
      .map((p) => p.slug)
      .sort();
    expect(withLinks).toEqual([
      "bluetanks-ev",
      "jifu360",
      "leadership-news",
      "lenbi",
      "nexaflex",
      "onewallet-mfb",
      "uwa",
    ]);
  });

  it("assigns a domain to every engineering project and none to founder work (§5.1 M7.5)", () => {
    for (const p of projects) {
      if (p.track === "engineering") {
        expect(p.domain, `${p.slug} missing domain`).toBeDefined();
      } else {
        expect(p.domain, `${p.slug} should have no domain`).toBeUndefined();
      }
    }
  });

  it("matches the owner's final domain assignment (M7.5)", () => {
    const byDomain = (d: string) =>
      projects.filter((p) => p.domain === d).map((p) => p.slug).sort();
    expect(byDomain("fintech")).toEqual([
      "brace-finance", "crowdfacture", "delta-digital", "evricent",
      "nexaflex", "onewallet-mfb", "sumotrust", "truzact",
    ]);
    expect(byDomain("health")).toEqual(["rightnowmd"]);
    expect(byDomain("marketplace")).toEqual([
      "checkncommit", "lenbi", "portsconnect", "uwa",
    ]);
    expect(byDomain("mobility")).toEqual(["bluetanks-ev"]);
    expect(byDomain("media")).toEqual([
      "gateway-edu", "jifu360", "leadership-news", "sinimax",
    ]);
  });

  it("caps summaries at 160 characters when provided (§9.1)", () => {
    for (const p of projects) {
      if (isProvided(p.summary)) {
        expect(p.summary.length, `${p.slug} summary too long`).toBeLessThanOrEqual(160);
      }
    }
  });

  it("leads JIFU360's metrics with the third-party-verified 4.8/5 (§9.3)", () => {
    const jifu = projects.find((p) => p.slug === "jifu360");
    expect(jifu?.metrics?.[0]).toMatchObject({ value: "4.8/5" });
  });

  it("marks exactly the nine case studies (§9.3 as amended v4), each with an MDX body", () => {
    const flagged = projects.filter((p) => p.caseStudy).map((p) => p.slug);
    expect(flagged.sort()).toEqual([
      "bluetanks-ev",
      "jifu360",
      "leadership-news",
      "lenbi",
      "nexaflex",
      "onewallet-mfb",
      "rightnowmd",
      "sumotrust",
      "uwa",
    ]);
    for (const slug of flagged) {
      expect(
        existsSync(join(process.cwd(), "content", "case-studies", `${slug}.mdx`)),
        `missing MDX body for ${slug}`,
      ).toBe(true);
    }
  });
});

/**
 * §7.1 / edge case #6, tested against the real content — not fixtures.
 * The spine layout must reproduce the two claims the site makes:
 * five overlapping engagements around 2026, and the six-strong 2022
 * cluster whose peak of five simultaneous lanes forces the bracketed
 * group rendering.
 */
describe("spine layout on the real chronology", () => {
  const layout = spineLayout(
    spineProjects.map((p) => (p.track === "founder" ? { ...p, docked: true } : p)),
  );

  it("collapses the 2022 six into one bracketed group headed 2022", () => {
    const groups = layout.items.flatMap((i) => (i.kind === "group" ? [i] : []));
    expect(groups).toHaveLength(1);
    expect(groups[0]!.yearLabel).toBe("2022");
    expect(groups[0]!.items.map((p) => p.slug).sort()).toEqual([
      "bluetanks-ev",
      "brace-finance",
      "gateway-edu",
      "portsconnect",
      "sumotrust",
      "truzact",
    ]);
  });

  it("keeps every contract laned within the six-lane step of the ladder", () => {
    const entries = layout.items.flatMap((i) => (i.kind === "entry" ? [i] : []));
    expect(entries).toHaveLength(13); // 12 contracts + docked Zowis
    expect(layout.laneCount).toBe(6); // 18px step; 14px seventh lane dormant
  });

  it("brackets the eight chained contracts — Zowis docks outside the count", () => {
    const entries = layout.items.flatMap((i) => (i.kind === "entry" ? [i] : []));
    const recent = entries.filter((e) => e.bracket?.size === 8);
    expect(recent.map((e) => e.item.slug).sort()).toEqual([
      "jifu360",
      "leadership-news",
      "lenbi",
      "nexaflex",
      "onewallet-mfb",
      "rightnowmd",
      "sinimax",
      "uwa",
    ]);
    const zowis = entries.find((e) => e.item.slug === "zowis")!;
    expect(zowis.item.docked).toBe(true);
    expect(zowis.lane).toBe(0);
    expect(zowis.bracket).toBeNull();
  });

  it("assigns deterministic lanes to the 2024–2026 cluster", () => {
    const lane = new Map(
      layout.items.flatMap((i) => (i.kind === "entry" ? [[i.item.slug, i.lane] as const] : [])),
    );
    expect(lane.get("onewallet-mfb")).toBe(0);
    expect(lane.get("uwa")).toBe(1);
    expect(lane.get("nexaflex")).toBe(2);
    expect(lane.get("lenbi")).toBe(3);
    expect(lane.get("leadership-news")).toBe(4);
    expect(lane.get("jifu360")).toBe(5);
    expect(lane.get("sinimax")).toBe(2); // Nexaflex's lane, freed after 11.2025
    expect(lane.get("rightnowmd")).toBe(2); // Sinimax's lane, freed after 06.2026
  });

  it("gives Nov 2025's six concurrent contracts six distinct lanes", () => {
    const lane = new Map(
      layout.items.flatMap((i) => (i.kind === "entry" ? [[i.item.slug, i.lane] as const] : [])),
    );
    const nov2025 = ["onewallet-mfb", "uwa", "nexaflex", "lenbi", "leadership-news", "jifu360"];
    expect(new Set(nov2025.map((slug) => lane.get(slug))).size).toBe(6);
    const jul2026 = ["onewallet-mfb", "uwa", "rightnowmd", "lenbi", "jifu360"];
    expect(new Set(jul2026.map((slug) => lane.get(slug))).size).toBe(5);
  });

  it("keeps Lenbi and RightNowMD concurrent — a shared July 2026 is real overlap", () => {
    const names = concurrentWith(spineProjects, "rightnowmd").map((p) => p.slug);
    expect(names).toContain("lenbi");
    expect(names).toContain("jifu360");
    expect(names).toContain("onewallet-mfb");
  });

  it("orders DOM items most-recent-first with the group between Delta Digital and CheckNCommit", () => {
    const order = layout.items.map((i) =>
      i.kind === "group" ? "GROUP" : i.item.slug,
    );
    expect(order).toEqual([
      "rightnowmd",
      "sinimax",
      "zowis", // docked founder row holds its chronological place
      "jifu360",
      "leadership-news",
      "lenbi",
      "nexaflex",
      "onewallet-mfb",
      "uwa",
      "evricent",
      "delta-digital",
      "GROUP",
      "checkncommit",
      "crowdfacture",
    ]);
  });
});
