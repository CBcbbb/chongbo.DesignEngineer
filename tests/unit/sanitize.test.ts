import { describe, expect, it } from "vitest";
import { sanitizeAsked, sanitizeLine, sanitizeMissing, sanitizeSheets } from "@/lib/ask/sanitize";

describe("sanitizeSheets", () => {
  it("drops unknown ids, keeps one sheet per project and at most five", () => {
    const sheets = sanitizeSheets([
      { project: "hhcd-data-platform", section: "dual-view", signal: "accessibility", reason: "a" },
      { project: "hhcd-data-platform", section: "keyboard", signal: "accessibility", reason: "second from same project" },
      { project: "made-up", section: "problem", signal: "data", reason: "b" },
      { project: "components-for-any-data", section: "nope", signal: "data", reason: "c" },
      { project: "components-for-any-data", section: "contract", signal: "design-eng-gap", reason: "d" },
      { project: "nike-athletes-closet", section: "graphic-system", signal: "reusable-components", reason: "e" },
      { project: "this-site", section: "idea", signal: "ai-tools", reason: "f" },
      { project: "wildecho", section: "prototype", signal: "prototyping", reason: "g" },
    ]);
    expect(sheets.map((s) => `${s.project}#${s.section}`)).toEqual([
      "hhcd-data-platform#dual-view",
      "components-for-any-data#contract",
      "nike-athletes-closet#graphic-system",
      "this-site#idea",
      "wildecho#prototype",
    ]);
  });

  it("caps at five", () => {
    const one = { project: "hhcd-data-platform", section: "dual-view", signal: "accessibility", reason: "x" };
    expect(sanitizeSheets(Array(9).fill(one))).toHaveLength(1);
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
      { project: "this-site", section: "idea", signal: "ai-tools", reason: "<b>see https://evil.example</b>" },
    ]);
    expect(a!.reason.length).toBeLessThanOrEqual(90);
    expect(b!.reason).toBeTruthy();
    expect(c!.reason).not.toMatch(/evil|</);
  });
});

describe("sanitizeAsked / sanitizeMissing / sanitizeLine", () => {
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

  it("rejects long, empty or markup lines", () => {
    expect(sanitizeLine("Three projects show accessibility.")).toBe("Three projects show accessibility.");
    expect(sanitizeLine("x".repeat(91))).toBeNull();
    expect(sanitizeLine("   ")).toBeNull();
    expect(sanitizeLine("<script>alert(1)</script>")).toBeNull();
    expect(sanitizeLine("See https://evil.example")).toBeNull();
  });
});
