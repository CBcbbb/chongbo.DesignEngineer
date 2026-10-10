import { describe, expect, it } from "vitest";
import { sanitizeMatched, sanitizePicks, sanitizeReply } from "@/lib/ask/sanitize";

describe("sanitizePicks", () => {
  it("drops unknown ids, duplicates and anything past three", () => {
    const picks = sanitizePicks([
      { project: "hhcd-data-platform", section: "dual-view", reason: "a" },
      { project: "hhcd-data-platform", section: "dual-view", reason: "dup" },
      { project: "made-up", section: "problem", reason: "b" },
      { project: "component-store", section: "nope", reason: "c" },
      { project: "component-store", section: "contracts", reason: "d" },
      { project: "nike-athletes-closet", section: "system", reason: "e" },
      { project: "this-site", section: "idea", reason: "f" },
    ]);
    expect(picks.map((p) => `${p.project}#${p.section}`)).toEqual([
      "hhcd-data-platform#dual-view",
      "component-store#contracts",
      "nike-athletes-closet#system",
    ]);
  });
  it("handles junk input", () => {
    expect(sanitizePicks(null)).toEqual([]);
    expect(sanitizePicks("x")).toEqual([]);
    expect(sanitizePicks([null, 1, { project: 2 }])).toEqual([]);
  });
  it("clips long reasons and fills missing ones", () => {
    const [a, b] = sanitizePicks([
      { project: "hhcd-data-platform", section: "dual-view", reason: "x".repeat(200) },
      { project: "component-store", section: "contracts" },
    ]);
    expect(a!.reason.length).toBeLessThanOrEqual(90);
    expect(b!.reason).toBeTruthy();
  });
});

describe("sanitizeMatched / sanitizeReply", () => {
  const pick = { project: "hhcd-data-platform", section: "dual-view", reason: "" };
  it("keeps valid signals and derives one otherwise", () => {
    expect(sanitizeMatched("data", pick)).toBe("data");
    expect(sanitizeMatched("start-here", pick)).toBe("start-here");
    expect(sanitizeMatched("hacked", pick)).toBe("accessibility");
  });
  it("rejects long, empty or markup replies", () => {
    expect(sanitizeReply("Fine.")).toBe("Fine.");
    expect(sanitizeReply("x".repeat(161))).toBeNull();
    expect(sanitizeReply("   ")).toBeNull();
    expect(sanitizeReply("<script>alert(1)</script>")).toBeNull();
    expect(sanitizeReply("See https://evil.example")).toBeNull();
  });
});
