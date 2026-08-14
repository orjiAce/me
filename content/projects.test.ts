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

  it("keeps UWA archived, off the spine and out of the undated block", () => {
    const uwa = projects.find((p) => p.slug === "uwa");
    expect(uwa?.status).toBe("archived");
    expect(spineProjects.some((p) => p.slug === "uwa")).toBe(false);
    expect(undatedWork.some((p) => p.slug === "uwa")).toBe(false);
  });

  it("puts all fifteen dated engagements on the spine", () => {
    expect(spineProjects).toHaveLength(15);
    expect(undatedWork.map((p) => p.slug).sort()).toEqual(["lingobase", "zowis"]);
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

  it("has no caseStudy flags without MDX bodies (Milestone 4 flips these)", () => {
    expect(projects.every((p) => p.caseStudy === false)).toBe(true);
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
  const layout = spineLayout(spineProjects);

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

  it("keeps every other engagement laned within the four-lane cap", () => {
    const entries = layout.items.flatMap((i) => (i.kind === "entry" ? [i] : []));
    expect(entries).toHaveLength(9);
    expect(layout.laneCount).toBeLessThanOrEqual(4);
  });

  it("brackets the 2026 five as CONCURRENT ×5 (§7.1)", () => {
    const entries = layout.items.flatMap((i) => (i.kind === "entry" ? [i] : []));
    const five = entries.filter((e) => e.bracket?.size === 5);
    expect(five.map((e) => e.item.slug).sort()).toEqual([
      "jifu360",
      "lenbi",
      "onewallet-mfb",
      "rightnowmd",
      "sinimax",
    ]);
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
      "jifu360",
      "lenbi",
      "onewallet-mfb",
      "evricent",
      "delta-digital",
      "GROUP",
      "checkncommit",
      "crowdfacture",
    ]);
  });
});
