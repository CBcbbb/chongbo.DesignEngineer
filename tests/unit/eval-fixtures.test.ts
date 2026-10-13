import { describe, expect, it } from "vitest";
import { HIDDEN } from "@content";
import { findEntry } from "@/lib/ask/catalogue";
import { JDS, type Family } from "../eval/jds";
import { percentile, score } from "../eval/score";

/** The eval harness's fixtures and scoring (npm run eval:ask). The live runs are not part of npm test; these checks are. */
describe("eval fixtures", () => {
  it("has 15 to 20 JDs covering every role family, each id once", () => {
    expect(JDS.length).toBeGreaterThanOrEqual(15);
    expect(JDS.length).toBeLessThanOrEqual(20);
    expect(new Set(JDS.map((f) => f.id)).size).toBe(JDS.length);
    const families: Family[] = ["design-engineer", "product-designer", "design-systems", "accessibility", "data-visualisation", "brand-web"];
    for (const fam of families) expect(JDS.some((f) => f.family === fam), fam).toBe(true);
  });

  it("expects only cards that exist on shown projects, each in one list", () => {
    for (const f of JDS) {
      expect(f.must.length, f.id).toBeGreaterThan(0);
      for (const id of [...f.must, ...f.ok]) {
        const [project, section] = id.split("#") as [string, string];
        expect(HIDDEN.has(project), `${f.id}: ${id} is hidden`).toBe(false);
        expect(findEntry(project, section), `${f.id}: ${id} does not exist`).toBeDefined();
      }
      expect(f.must.filter((id) => f.ok.includes(id)), f.id).toEqual([]);
      expect(new Set(f.ok).size, f.id).toBe(f.ok.length);
    }
  });

  it("never names the employer", () => {
    for (const f of JDS) expect(f.jd, f.id).not.toMatch(/tigris/i);
  });
});

describe("eval scoring", () => {
  const fixture = { must: ["a#1", "a#2", "b#1"] as const, ok: ["b#2"] as const };
  const f = { must: [...fixture.must], ok: [...fixture.ok] } as Parameters<typeof score>[0];
  const sheets = (...ids: string[]) => ids.map((id) => ({ project: id.split("#")[0]!, section: id.split("#")[1]! }));

  it("counts ok cards as fine, others against precision, and recall over must", () => {
    const s = score(f, { sheets: sheets("a#1", "b#2", "c#9", "b#1"), missing: [] });
    expect(s.precision).toBe(0.75);
    expect(s.recall).toBeCloseTo(2 / 3);
    expect(s.top).toBe(true);
    expect(s.stray).toEqual(["c#9"]);
    expect(s.absent).toEqual(["a#2"]);
  });

  it("caps recall at the printer's six cards", () => {
    const must = Array.from({ length: 9 }, (_, i) => `p#${i}` as const);
    const s = score({ must, ok: [] }, { sheets: sheets(...must.slice(0, 6)), missing: [] });
    expect(s.recall).toBe(1);
  });

  it("scores an empty print as zero and checks missing labels both ways", () => {
    const s = score({ ...f, missing: { expect: ["Kotlin"], never: ["React"] } }, { sheets: [], missing: ["React marketing sites"] });
    expect(s.precision).toBe(0);
    expect(s.top).toBe(false);
    expect(s.missing).toEqual(["not reported missing: Kotlin", "wrongly missing: React"]);
  });

  it("takes nearest-rank percentiles", () => {
    expect(percentile([5, 1, 3, 2, 4], 50)).toBe(3);
    expect(percentile([5, 1, 3, 2, 4], 95)).toBe(5);
    expect(percentile([], 50)).toBe(0);
  });
});
