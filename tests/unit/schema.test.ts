import { describe, expect, it } from "vitest";
import { AskRequestSchema, AskResponseSchema, SIGNAL_KEYS, withLegacy } from "@/lib/ask/schema";

describe("AskRequestSchema", () => {
  it("accepts a brief, topics or both, trimming and de-duplicating", () => {
    expect(AskRequestSchema.parse({ brief: "  accessibility  " })).toEqual({ brief: "accessibility", topics: [] });
    expect(AskRequestSchema.parse({ topics: ["data", "data", "research"] })).toEqual({ brief: "", topics: ["data", "research"] });
    expect(AskRequestSchema.parse({ brief: "x", topics: ["accessibility"] }).topics).toEqual(["accessibility"]);
    expect(AskRequestSchema.safeParse({ brief: "x".repeat(4000) }).success).toBe(true);
  });

  it("maps the legacy question field to the brief", () => {
    expect(AskRequestSchema.parse({ question: "  hi  " })).toEqual({ brief: "hi", topics: [] });
    expect(AskRequestSchema.parse({ question: "old", brief: "new" }).brief).toBe("new");
  });

  it("needs at least one of brief or topics", () => {
    expect(AskRequestSchema.safeParse({}).success).toBe(false);
    expect(AskRequestSchema.safeParse({ brief: "   " }).success).toBe(false);
    expect(AskRequestSchema.safeParse({ question: "" }).success).toBe(false);
    expect(AskRequestSchema.safeParse({ brief: "", topics: [] }).success).toBe(false);
  });

  it("rejects too long, too many, unknown topics and wrong types", () => {
    expect(AskRequestSchema.safeParse({ brief: "x".repeat(4001) }).success).toBe(false);
    expect(AskRequestSchema.safeParse({ topics: ["vibes"] }).success).toBe(false);
    expect(
      AskRequestSchema.safeParse({
        topics: [...SIGNAL_KEYS, "data"],
      }).success,
    ).toBe(false);
    // Every signal at once is allowed (all eight skills cards chosen).
    expect(AskRequestSchema.safeParse({ topics: [...SIGNAL_KEYS] }).success).toBe(true);
    expect(AskRequestSchema.safeParse({ brief: 42 }).success).toBe(false);
    expect(AskRequestSchema.safeParse({ question: 42 }).success).toBe(false);
    expect(AskRequestSchema.safeParse("accessibility").success).toBe(false);
    expect(AskRequestSchema.safeParse(null).success).toBe(false);
  });
});

describe("AskResponseSchema", () => {
  const sheet = { project: "hhcd-data-platform", section: "dual-view", signal: "accessibility" as const, reason: "Accessible table view." };
  const ok = withLegacy({ asked: ["accessibility"], sheets: [sheet], missing: [], line: "One project shows accessibility.", source: "model" });

  it("accepts a valid response with legacy fields derived", () => {
    expect(AskResponseSchema.safeParse(ok).success).toBe(true);
    expect(ok.reply).toBe(ok.line);
    expect(ok.picks).toEqual([{ project: sheet.project, section: sheet.section, reason: sheet.reason }]);
    expect(ok.matched).toBe("accessibility");
  });

  it("enforces limits", () => {
    const other = { ...sheet, project: "components-for-any-data", section: "takeaway" };
    expect(AskResponseSchema.safeParse({ ...ok, line: "x".repeat(91) }).success).toBe(false);
    expect(AskResponseSchema.safeParse({ ...ok, asked: [] }).success).toBe(false);
    expect(AskResponseSchema.safeParse({ ...ok, asked: ["vibes"] }).success).toBe(false);
    expect(AskResponseSchema.safeParse({ ...ok, sheets: [] }).success).toBe(false);
    expect(AskResponseSchema.safeParse({ ...ok, sheets: Array(6).fill(sheet) }).success).toBe(false);
    expect(AskResponseSchema.safeParse({ ...ok, sheets: [sheet, { ...sheet, section: "keyboard" }] }).success).toBe(false);
    expect(AskResponseSchema.safeParse({ ...ok, sheets: [sheet, other] }).success).toBe(true);
    expect(AskResponseSchema.safeParse({ ...ok, sheets: [{ ...sheet, reason: "x".repeat(91) }] }).success).toBe(false);
    expect(AskResponseSchema.safeParse({ ...ok, sheets: [{ ...sheet, signal: "vibes" }] }).success).toBe(false);
    expect(AskResponseSchema.safeParse({ ...ok, missing: Array(7).fill("x") }).success).toBe(false);
    expect(AskResponseSchema.safeParse({ ...ok, source: "magic" }).success).toBe(false);
  });

  it("accepts start-here as the legacy matched key", () => {
    expect(AskResponseSchema.safeParse(withLegacy(ok, { startHere: true })).success).toBe(true);
  });
});
