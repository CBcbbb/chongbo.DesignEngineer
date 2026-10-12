import { describe, expect, it } from "vitest";
import type { Signal } from "@content";
import { answered, arrange, type Ranked } from "@/lib/ask/arrange";

const r = (project: string, section: string, signal: Signal): Ranked => ({ project, section, signal });
const keys = (xs: Ranked[]) => xs.map((x) => `${x.project}#${x.section}`);

describe("arrange", () => {
  it("one capability: the best cards wherever they are, no limit per project, at most six", () => {
    const ranked = ["a", "b", "c", "d", "e", "f", "g"].map((s) => r("hhcd", s, "accessibility"));
    expect(keys(arrange(ranked, ["accessibility"]))).toEqual(["a", "b", "c", "d", "e", "f"].map((s) => `hhcd#${s}`));
  });

  it("never prints the same card twice and never pads", () => {
    const ranked = [r("p", "a", "data"), r("p", "a", "data"), r("q", "b", "data")];
    expect(keys(arrange(ranked, ["data"]))).toEqual(["p#a", "q#b"]);
  });

  it("several capabilities: each gets its best card before any gets a second", () => {
    const ranked = [
      r("p", "a1", "accessibility"),
      r("p", "a2", "accessibility"),
      r("p", "a3", "accessibility"),
      r("q", "m1", "motion-interaction"),
      r("s", "d1", "design-systems"),
      r("q", "m2", "motion-interaction"),
    ];
    const out = arrange(ranked, ["design-systems", "accessibility", "motion-interaction"]);
    expect(new Set(out.map((x) => x.signal))).toEqual(new Set(["design-systems", "accessibility", "motion-interaction"]));
    expect(out).toHaveLength(6);
    // Only four slots: the three firsts, then the first asked capability's second.
    const four = arrange(ranked, ["accessibility", "design-systems", "motion-interaction"], { n: 4, unit: "cards" });
    expect(keys(four).sort()).toEqual(["p#a1", "p#a2", "q#m1", "s#d1"]);
  });

  it("keeps cards from one project together, projects in the order of their best card", () => {
    const ranked = [r("p", "a", "accessibility"), r("q", "b", "data"), r("p", "c", "accessibility"), r("q", "d", "data")];
    expect(keys(arrange(ranked, ["accessibility", "data"]))).toEqual(["p#a", "p#c", "q#b", "q#d"]);
  });

  it("honours a requested count of projects or of cards", () => {
    const ranked = [r("p", "a", "design-systems"), r("p", "b", "design-systems"), r("q", "c", "design-systems"), r("s", "d", "design-systems")];
    expect(keys(arrange(ranked, ["design-systems"], { n: 2, unit: "projects" }))).toEqual(["p#a", "p#b", "q#c"]);
    expect(keys(arrange(ranked, ["design-systems"], { n: 2, unit: "cards" }))).toEqual(["p#a", "p#b"]);
  });

  it("names only the asked capabilities the cards answer", () => {
    expect(answered(["accessibility", "data", "typography"], [r("p", "a", "data")])).toEqual(["data"]);
  });
});
