import { describe, expect, it } from "vitest";
import { sanitizeAsked, sanitizeMissing, sanitizeSheets } from "@/lib/ask/sanitize";

describe("sanitizeSheets", () => {
  it("drops unknown and hidden ids and repeated cards; keeps several cards from one project, in order", () => {
    const sheets = sanitizeSheets([
      { project: "hhcd-data-platform", section: "dual-view", signal: "accessibility", reason: "a" },
      { project: "hhcd-data-platform", section: "keyboard", signal: "accessibility", reason: "second from same project" },
      { project: "hhcd-data-platform", section: "dual-view", signal: "accessibility", reason: "same card again" },
      { project: "made-up", section: "problem", signal: "data", reason: "b" },
      { project: "components-for-any-data", section: "nope", signal: "data", reason: "c" },
      { project: "components-for-any-data", section: "contract", signal: "design-eng-gap", reason: "d" },
      { project: "nike-athletes-closet", section: "graphic-system", signal: "reusable-components", reason: "e" },
      // Hidden projects (content/index.ts) are not in the catalogue, so they're unknown ids too.
      { project: "this-site", section: "idea", signal: "ai-tools", reason: "f" },
      { project: "wildecho", section: "prototype", signal: "prototyping", reason: "g" },
    ]);
    expect(sheets.map((s) => `${s.project}#${s.section}`)).toEqual([
      "hhcd-data-platform#dual-view",
      "hhcd-data-platform#keyboard",
      "components-for-any-data#contract",
      "nike-athletes-closet#graphic-system",
    ]);
  });

  it("keeps each card once and at most ten ranked cards", () => {
    const one = { project: "hhcd-data-platform", section: "dual-view", signal: "accessibility", reason: "x" };
    expect(sanitizeSheets(Array(9).fill(one))).toHaveLength(1);
    const hhcd = ["brief", "no-borders", "sample-data", "workshop", "four-types", "dual-view", "taken-up", "arrangements", "guide", "keyboard", "narrow-screens", "contrast"];
    expect(sanitizeSheets(hhcd.map((section) => ({ project: "hhcd-data-platform", section, signal: "x" })))).toHaveLength(10);
  });

  it("repairs a signal the section does not carry, preferring an asked one", () => {
    const [a] = sanitizeSheets([{ project: "hhcd-data-platform", section: "dual-view", signal: "conversion", reason: "x" }], ["data"]);
    expect(a!.signal).toBe("data");
    const [b] = sanitizeSheets([{ project: "hhcd-data-platform", section: "dual-view", signal: "hacked", reason: "x" }]);
    expect(b!.signal).toBe("accessibility");
  });

  it("handles junk input", () => {
    expect(sanitizeSheets(null)).toEqual([]);
    expect(sanitizeSheets("x")).toEqual([]);
    expect(sanitizeSheets([null, 1, { project: 2 }])).toEqual([]);
  });

  it("clips long reasons and fills missing or unsafe ones", () => {
    const [a, b, c] = sanitizeSheets([
      { project: "hhcd-data-platform", section: "dual-view", signal: "accessibility", reason: "x".repeat(200) },
      { project: "components-for-any-data", section: "contract", signal: "design-eng-gap" },
      { project: "nike-athletes-closet", section: "graphic-system", signal: "reusable-components", reason: "<b>see https://evil.example</b>" },
    ]);
    expect(a!.reason.length).toBeLessThanOrEqual(90);
    expect(b!.reason).toBeTruthy();
    expect(c!.reason).not.toMatch(/evil|</);
  });
});

describe("sanitizeAsked / sanitizeMissing", () => {
  it("keeps known signal keys only, in order, without duplicates, at most six", () => {
    expect(sanitizeAsked(["accessibility", "vibes", "data", "accessibility"])).toEqual(["accessibility", "data"]);
    expect(sanitizeAsked(["toString", "__proto__"])).toEqual([]);
    expect(sanitizeAsked("accessibility")).toEqual([]);
    const many = ["end-to-end", "design-systems", "cross-platform", "design-eng-gap", "accessibility", "data", "research"];
    expect(sanitizeAsked(many)).toHaveLength(6);
  });

  it("keeps short plain missing labels", () => {
    expect(sanitizeMissing(["A/B testing", "a/b testing", " Kotlin. ", "", 3, "x".repeat(41), "<script>", "http://x.y"])).toEqual([
      "A/B testing",
      "Kotlin",
    ]);
    expect(sanitizeMissing(null)).toEqual([]);
  });
});
