import { describe, expect, it } from "vitest";
import {
  earlierWork,
  featuredProjects,
  projects,
  spineProjects,
} from "./projects";
import { validateProjects } from "../lib/dates";
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
  });

  it("features exactly one project per track on home (§10.1.5)", () => {
    expect(featuredProjects.map((p) => p.slug).sort()).toEqual([
      "jifu360",
      "rightnowmd",
      "zowis",
    ]);
  });

  it("keeps UWA archived and off the spine and out of earlier work", () => {
    const uwa = projects.find((p) => p.slug === "uwa");
    expect(uwa?.status).toBe("archived");
    expect(spineProjects.some((p) => p.slug === "uwa")).toBe(false);
    expect(earlierWork.some((p) => p.slug === "uwa")).toBe(false);
  });

  it("puts only the four §9.3-dated engagements on the spine", () => {
    expect(spineProjects.map((p) => p.slug).sort()).toEqual([
      "jifu360",
      "lenbi",
      "rightnowmd",
      "sinimax",
    ]);
  });

  it("never fabricates dates — undated projects are all null/null", () => {
    for (const p of earlierWork) {
      expect(p.start).toBeNull();
      expect(p.end).toBeNull();
    }
  });

  it("caps summaries at 160 characters when provided (§9.1)", () => {
    for (const p of projects) {
      if (isProvided(p.summary)) {
        expect(p.summary.length, `${p.slug} summary too long`).toBeLessThanOrEqual(160);
      }
    }
  });

  it("has no caseStudy flags without MDX bodies (Milestone 4 flips these)", () => {
    expect(projects.every((p) => p.caseStudy === false)).toBe(true);
  });
});
