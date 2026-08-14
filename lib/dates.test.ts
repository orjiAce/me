import { describe, expect, it } from "vitest";
import {
  assignLanes,
  compareYearMonth,
  concurrencyRuns,
  formatMonthYear,
  formatRange,
  numberWord,
  overlapClusters,
  parseYearMonth,
  rangesOverlap,
  sortByStartDesc,
  spineLayout,
  validateProjects,
} from "./dates";
import type { Project } from "../content/types";

/** Minimal dated item, as consumed by the spine helpers. */
const dated = (
  slug: string,
  start: string,
  end: string | null,
  name = slug,
) => ({ slug, name, start, end });

/**
 * The four dated engagements with the corrected §9.3 dates — these
 * supersede the CV and must never be "fixed" back.
 */
const rightnowmd = dated("rightnowmd", "2026-07", null, "RightNowMD");
const jifu360 = dated("jifu360", "2025-11", "2026-08", "JIFU360");
const lenbi = dated("lenbi", "2025-10", "2026-07", "Lenbi");
const sinimax = dated("sinimax", "2026-02", "2026-06", "Sinimax");
const realFour = [rightnowmd, jifu360, lenbi, sinimax];

/**
 * Synthetic six-way cluster where all six are pairwise concurrent (every
 * range spans Jun 2022). This exercises the worst case for the lane
 * algorithm; the *real* 2022 cluster — where Truzact chains in through
 * Sumotrust without touching the June peak — is tested against actual
 * content in content/projects.test.ts.
 */
const cluster2022 = [
  dated("gateway-edu", "2022-01", "2022-12"),
  dated("brace-finance", "2022-02", "2022-08"),
  dated("portsconnect", "2022-03", "2022-07"),
  dated("bluetanks-ev", "2022-01", "2022-09"),
  dated("sumotrust", "2022-04", "2022-11"),
  dated("truzact", "2022-06", "2022-10"),
];

describe("parseYearMonth", () => {
  it("parses a valid ISO year-month", () => {
    expect(parseYearMonth("2026-07")).toEqual({ year: 2026, month: 7 });
  });

  it.each(["2026-13", "2026-00", "2026-7", "07-2026", "2026/07", "garbage", ""])(
    "throws on malformed value %j",
    (value) => {
      expect(() => parseYearMonth(value)).toThrow();
    },
  );

  it("names the offending context in the error", () => {
    expect(() => parseYearMonth("2026-13", "sinimax")).toThrow(/sinimax/);
  });
});

describe("compareYearMonth", () => {
  it("orders chronologically", () => {
    expect(compareYearMonth("2025-10", "2026-07")).toBeLessThan(0);
    expect(compareYearMonth("2026-07", "2026-07")).toBe(0);
    expect(compareYearMonth("2026-08", "2026-07")).toBeGreaterThan(0);
  });
});

describe("formatRange", () => {
  it("formats a closed range as MM.YYYY — MM.YYYY", () => {
    expect(formatRange("2025-10", "2026-07")).toBe("10.2025 — 07.2026");
  });

  it("formats an open range with PRESENT", () => {
    expect(formatRange("2026-07", null)).toBe("07.2026 — PRESENT");
  });
});

describe("formatMonthYear", () => {
  it("renders the human month form used in <time> text", () => {
    expect(formatMonthYear("2026-07")).toBe("Jul 2026");
    expect(formatMonthYear("2022-01")).toBe("Jan 2022");
  });
});

describe("rangesOverlap", () => {
  it("detects the real concurrent trio pairwise (§7.1)", () => {
    expect(rangesOverlap(lenbi, jifu360)).toBe(true);
    expect(rangesOverlap(jifu360, sinimax)).toBe(true);
    expect(rangesOverlap(lenbi, sinimax)).toBe(true);
  });

  it("treats a shared calendar month as overlap (Lenbi ends the month RightNowMD starts)", () => {
    expect(rangesOverlap(lenbi, rightnowmd)).toBe(true);
  });

  it("adjacent-but-not-overlapping months do not overlap", () => {
    const a = dated("a", "2022-01", "2022-05");
    const b = dated("b", "2022-06", "2022-09");
    expect(rangesOverlap(a, b)).toBe(false);
    expect(rangesOverlap(b, a)).toBe(false);
  });

  it("handles open-ended ranges", () => {
    expect(rangesOverlap(rightnowmd, jifu360)).toBe(true); // 07–08.2026
    expect(rangesOverlap(rightnowmd, sinimax)).toBe(false); // sinimax ended 06.2026
    const otherOpen = dated("x", "2030-01", null);
    expect(rangesOverlap(rightnowmd, otherOpen)).toBe(true); // both run forever
  });
});

describe("sortByStartDesc", () => {
  it("orders by start desc, then end desc (open range greatest), then name", () => {
    const sorted = sortByStartDesc(realFour);
    expect(sorted.map((p) => p.slug)).toEqual([
      "rightnowmd",
      "sinimax",
      "jifu360",
      "lenbi",
    ]);
  });

  it("is deterministic regardless of input order", () => {
    const reversed = sortByStartDesc([...realFour].reverse());
    const shuffled = sortByStartDesc([sinimax, lenbi, rightnowmd, jifu360]);
    expect(reversed).toEqual(shuffled);
  });

  it("breaks full ties on end desc then name asc", () => {
    const a = dated("b-proj", "2024-01", "2024-06", "Beta");
    const b = dated("a-proj", "2024-01", "2024-06", "Alpha");
    const c = dated("c-proj", "2024-01", null, "Gamma");
    expect(sortByStartDesc([a, b, c]).map((p) => p.name)).toEqual([
      "Gamma", // open range sorts as most recent end
      "Alpha",
      "Beta",
    ]);
  });

  it("does not mutate its input", () => {
    const input = [...realFour];
    sortByStartDesc(input);
    expect(input).toEqual(realFour);
  });
});

describe("assignLanes", () => {
  it("gives the real trio three distinct lanes", () => {
    const lanes = assignLanes(realFour);
    const trio = [lanes.get("lenbi"), lanes.get("jifu360"), lanes.get("sinimax")];
    expect(new Set(trio).size).toBe(3);
  });

  it("reuses a freed lane for RightNowMD (overlaps Lenbi and JIFU360, not Sinimax)", () => {
    const lanes = assignLanes(realFour);
    expect(lanes.get("rightnowmd")).not.toBe(lanes.get("lenbi"));
    expect(lanes.get("rightnowmd")).not.toBe(lanes.get("jifu360"));
    // Sinimax ended before RightNowMD started, so its lane is free again.
    expect(lanes.get("rightnowmd")).toBe(lanes.get("sinimax"));
  });

  it("generalises to the six-way 2022 cluster — six distinct lanes", () => {
    const lanes = assignLanes(cluster2022);
    expect(new Set(lanes.values()).size).toBe(6);
  });

  it("keeps non-overlapping entries in lane 0", () => {
    const a = dated("a", "2022-01", "2022-05");
    const b = dated("b", "2022-06", "2022-09");
    const lanes = assignLanes([a, b]);
    expect(lanes.get("a")).toBe(0);
    expect(lanes.get("b")).toBe(0);
  });

  it("is deterministic regardless of input order", () => {
    const forward = assignLanes(cluster2022);
    const backward = assignLanes([...cluster2022].reverse());
    expect(forward).toEqual(backward);
  });
});

describe("overlapClusters", () => {
  it("groups the six-way 2022 cluster into one component", () => {
    const clusters = overlapClusters(cluster2022);
    expect(clusters).toHaveLength(1);
    expect(clusters[0]).toHaveLength(6);
  });

  it("puts an adjacent-but-not-overlapping pair in separate clusters", () => {
    const a = dated("a", "2022-01", "2022-05");
    const b = dated("b", "2022-06", "2022-09");
    const clusters = overlapClusters([a, b]);
    expect(clusters).toHaveLength(2);
  });

  it("chains transitive overlap into one cluster", () => {
    // a–b overlap, b–c overlap, a–c do not: still one cluster of three.
    const a = dated("a", "2022-01", "2022-04");
    const b = dated("b", "2022-03", "2022-08");
    const c = dated("c", "2022-06", "2022-10");
    const clusters = overlapClusters([a, b, c]);
    expect(clusters).toHaveLength(1);
    expect(clusters[0]).toHaveLength(3);
  });
});

describe("validateProjects", () => {
  const valid = (over: Partial<Project> & { slug: string }): Project => ({
    name: over.slug,
    track: "engineering",
    role: "Engineer",
    summary: "s",
    start: null,
    end: null,
    status: "completed",
    stack: [],
    highlights: [],
    ...over,
  });

  it("accepts a valid set", () => {
    expect(() =>
      validateProjects([
        valid({ slug: "one", start: "2025-10", end: "2026-07" }),
        valid({ slug: "two", start: "2026-07", end: null }),
        valid({ slug: "undated" }),
      ]),
    ).not.toThrow();
  });

  it("names the slug on a duplicate", () => {
    expect(() =>
      validateProjects([valid({ slug: "dupe" }), valid({ slug: "dupe" })]),
    ).toThrow(/dupe/);
  });

  it("names the slug on a malformed start date", () => {
    expect(() =>
      validateProjects([valid({ slug: "badstart", start: "2026-13" })]),
    ).toThrow(/badstart/);
  });

  it("names the slug on a malformed end date", () => {
    expect(() =>
      validateProjects([valid({ slug: "badend", start: "2026-01", end: "next year" })]),
    ).toThrow(/badend/);
  });

  it("names the slug when end precedes start", () => {
    expect(() =>
      validateProjects([valid({ slug: "backwards", start: "2026-07", end: "2026-01" })]),
    ).toThrow(/backwards/);
  });

  it("rejects an end date on an undated project", () => {
    expect(() =>
      validateProjects([valid({ slug: "endonly", start: null, end: "2026-01" })]),
    ).toThrow(/endonly/);
  });

  it("accepts a completed endUnknown project with a start month", () => {
    expect(() =>
      validateProjects([
        valid({ slug: "evricent", start: "2024-02", end: null, endUnknown: true }),
      ]),
    ).not.toThrow();
  });

  it("rejects endUnknown combined with an end date", () => {
    expect(() =>
      validateProjects([
        valid({ slug: "both", start: "2024-02", end: "2024-06", endUnknown: true }),
      ]),
    ).toThrow(/both/);
  });

  it("rejects endUnknown without a start date", () => {
    expect(() =>
      validateProjects([
        valid({ slug: "nostart", start: null, end: null, endUnknown: true }),
      ]),
    ).toThrow(/nostart/);
  });

  it("rejects an active endUnknown project — unknown is never 'present' (edge case #4)", () => {
    expect(() =>
      validateProjects([
        valid({
          slug: "ghost",
          start: "2024-02",
          end: null,
          endUnknown: true,
          status: "active",
        }),
      ]),
    ).toThrow(/ghost/);
  });
});

describe("endUnknown ranges (edge case #4)", () => {
  const evricent = {
    slug: "evricent",
    name: "EvriCent",
    start: "2024-02",
    end: null,
    endUnknown: true,
  };

  it("formats with a trailing dash and no present label", () => {
    expect(formatRange("2024-02", null, true)).toBe("02.2024 —");
  });

  it("counts only the start month toward overlap — never invents an extent", () => {
    expect(rangesOverlap(evricent, dated("x", "2024-01", "2024-02"))).toBe(true);
    expect(rangesOverlap(evricent, dated("y", "2024-06", "2026-07"))).toBe(false);
  });

  it("does not sort like an open range", () => {
    const open = dated("open", "2024-02", null);
    expect(sortByStartDesc([evricent, open])[0]!.slug).toBe("open");
  });
});

describe("numberWord", () => {
  it("spells the counts spine headers use", () => {
    expect(numberWord(5)).toBe("FIVE");
    expect(numberWord(6)).toBe("SIX");
  });

  it("falls back to digits beyond twelve", () => {
    expect(numberWord(13)).toBe("13");
  });
});

describe("concurrencyRuns", () => {
  it("returns no runs when nothing overlaps", () => {
    const a = dated("a", "2022-01", "2022-05");
    const b = dated("b", "2022-06", "2022-09");
    expect(concurrencyRuns([a, b])).toEqual([]);
  });

  it("finds one run with members and peak for a simple trio", () => {
    const a = dated("a", "2022-01", "2022-04");
    const b = dated("b", "2022-03", "2022-08");
    const c = dated("c", "2022-05", "2022-10");
    const runs = concurrencyRuns([a, b, c]);
    expect(runs).toHaveLength(1);
    expect(runs[0]!.members.map((m) => m.slug)).toEqual(["a", "b", "c"]);
    expect(runs[0]!.peak).toBe(2);
  });

  it("splits runs where density drops below two", () => {
    const a = dated("a", "2022-01", "2022-03");
    const b = dated("b", "2022-02", "2022-06");
    const c = dated("c", "2022-08", "2022-10");
    const d = dated("d", "2022-09", "2022-12");
    const runs = concurrencyRuns([a, b, c, d]);
    expect(runs).toHaveLength(2);
    expect(runs[0]!.members.map((m) => m.slug)).toEqual(["a", "b"]);
    expect(runs[1]!.members.map((m) => m.slug)).toEqual(["c", "d"]);
  });

  it("a long engagement bridging two dense windows is a member of both runs", () => {
    const bridge = dated("bridge", "2022-01", "2022-12");
    const x = dated("x", "2022-01", "2022-02");
    const y = dated("y", "2022-11", "2022-12");
    const runs = concurrencyRuns([bridge, x, y]);
    expect(runs).toHaveLength(2);
    expect(runs[0]!.members.map((m) => m.slug)).toContain("bridge");
    expect(runs[1]!.members.map((m) => m.slug)).toContain("bridge");
  });

  it("records the calendar year(s) of the peak", () => {
    const runs = concurrencyRuns(cluster2022);
    expect(runs).toHaveLength(1);
    expect(runs[0]!.peak).toBe(6);
    expect(runs[0]!.peakYears).toEqual([2022]);
  });
});

describe("spineLayout", () => {
  it("keeps a ≤4-lane chronology as laned entries with bracket data", () => {
    const layout = spineLayout(realFour);
    expect(layout.items.every((item) => item.kind === "entry")).toBe(true);
    expect(layout.laneCount).toBeLessThanOrEqual(4);
    const entries = layout.items.flatMap((i) => (i.kind === "entry" ? [i] : []));
    // All four overlap transitively → one contiguous bracket of four.
    expect(entries[0]!.bracket).toEqual({ size: 4, pos: "start" });
    expect(entries[3]!.bracket).toEqual({ size: 4, pos: "end" });
  });

  it("collapses a beyond-the-cap run into one bracketed group (edge case #6)", () => {
    const layout = spineLayout(cluster2022);
    const groups = layout.items.flatMap((i) => (i.kind === "group" ? [i] : []));
    expect(groups).toHaveLength(1);
    expect(groups[0]!.items).toHaveLength(6);
    expect(groups[0]!.yearLabel).toBe("2022");
    expect(layout.laneCount).toBe(0); // nothing left outside the group
  });

  it("orders items start desc with a group positioned by its newest member", () => {
    const before = dated("before", "2021-01", "2021-06");
    const after = dated("after", "2023-05", "2023-09");
    const layout = spineLayout([...cluster2022, before, after]);
    expect(
      layout.items.map((i) => (i.kind === "group" ? "GROUP" : i.item.slug)),
    ).toEqual(["after", "GROUP", "before"]);
  });

  it("is deterministic regardless of input order", () => {
    const forward = spineLayout(cluster2022);
    const backward = spineLayout([...cluster2022].reverse());
    expect(forward).toEqual(backward);
  });
});
