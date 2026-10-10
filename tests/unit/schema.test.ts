import { describe, expect, it } from "vitest";
import { AskRequestSchema, AskResponseSchema } from "@/lib/ask/schema";

describe("AskRequestSchema", () => {
  it("accepts 1–300 characters and trims", () => {
    expect(AskRequestSchema.parse({ question: "  hi  " }).question).toBe("hi");
    expect(AskRequestSchema.safeParse({ question: "x".repeat(300) }).success).toBe(true);
  });
  it("rejects empty, whitespace, too long and wrong types", () => {
    expect(AskRequestSchema.safeParse({ question: "" }).success).toBe(false);
    expect(AskRequestSchema.safeParse({ question: "   " }).success).toBe(false);
    expect(AskRequestSchema.safeParse({ question: "x".repeat(301) }).success).toBe(false);
    expect(AskRequestSchema.safeParse({ question: 42 }).success).toBe(false);
    expect(AskRequestSchema.safeParse({}).success).toBe(false);
  });
});

describe("AskResponseSchema", () => {
  const ok = {
    reply: "Accessibility shaped this from the first sketch.",
    picks: [{ project: "hhcd-data-platform", section: "dual-view", reason: "Accessible table view." }],
    matched: "accessibility",
    source: "model",
  };
  it("accepts a valid response", () => {
    expect(AskResponseSchema.safeParse(ok).success).toBe(true);
  });
  it("enforces limits", () => {
    expect(AskResponseSchema.safeParse({ ...ok, reply: "x".repeat(161) }).success).toBe(false);
    expect(AskResponseSchema.safeParse({ ...ok, picks: [] }).success).toBe(false);
    expect(AskResponseSchema.safeParse({ ...ok, picks: Array(4).fill(ok.picks[0]) }).success).toBe(false);
    expect(AskResponseSchema.safeParse({ ...ok, picks: [{ ...ok.picks[0], reason: "x".repeat(91) }] }).success).toBe(false);
    expect(AskResponseSchema.safeParse({ ...ok, matched: "vibes" }).success).toBe(false);
    expect(AskResponseSchema.safeParse({ ...ok, source: "magic" }).success).toBe(false);
  });
  it("accepts start-here", () => {
    expect(AskResponseSchema.safeParse({ ...ok, matched: "start-here" }).success).toBe(true);
  });
});
