import { describe, expect, it } from "vitest";
import { projects, SIGNALS } from "@content";
import { fallbackAnswer } from "@/lib/ask/fallback";
import { AskRequestSchema } from "@/lib/ask/schema";
import { missingLine, quoteBrief, resultTitle, TOPICS, topicsToSignals } from "@/lib/printed";

describe("skills cards", () => {
  it("has the eight approved cards in order", () => {
    expect(TOPICS.map((t) => t.label)).toEqual([
      "Accessibility",
      "Design systems",
      "Front‑end",
      "Motion",
      "Web and brand",
      "AI tools",
      "Research",
      "Data",
    ]);
  });

  it("maps every card to real signal keys that some project shows", () => {
    const shown = new Set(projects.flatMap((p) => p.sections.flatMap((s) => s.signals)));
    for (const t of TOPICS) {
      expect(t.signals.length, t.id).toBeGreaterThan(0);
      for (const s of t.signals) expect(Object.keys(SIGNALS), t.id).toContain(s);
      expect(t.signals.some((s) => shown.has(s)), t.id).toBe(true);
    }
  });

  it("turns chosen cards into de-duplicated signals, first card first", () => {
    expect(topicsToSignals(["a11y"])).toEqual(["accessibility"]);
    expect(topicsToSignals(["systems", "a11y"])).toEqual(["design-systems", "cross-platform", "accessibility"]);
    expect(topicsToSignals(["a11y", "a11y", "nope"])).toEqual(["accessibility"]);
  });

  it("every combination the cards can send is a valid API request", () => {
    const all = topicsToSignals(TOPICS.map((t) => t.id));
    expect(AskRequestSchema.safeParse({ topics: all }).success).toBe(true);
    for (const t of TOPICS) {
      const req = AskRequestSchema.parse({ topics: topicsToSignals([t.id]) });
      const r = fallbackAnswer(req);
      expect(r.sheets.length, t.id).toBeGreaterThan(0);
      // The printed sheets show what the card stands for.
      expect(r.sheets.every((s) => t.signals.includes(s.signal)), t.id).toBe(true);
    }
  });
});

describe("wording", () => {
  it("titles the results like the prototype", () => {
    expect(resultTitle({ count: 3, startHere: false, topicLabel: "Accessibility" })).toBe("Three projects show accessibility.");
    expect(resultTitle({ count: 1, startHere: false, topicLabel: "Data" })).toBe("One project shows data.");
    expect(resultTitle({ count: 4, startHere: false })).toBe("Four projects match your brief.");
    expect(resultTitle({ count: 3, startHere: true })).toBe("Here are three places to start.");
  });

  it("names missing capabilities and quotes the brief", () => {
    expect(missingLine([])).toBe("");
    expect(missingLine(["A/B testing", "Swift"])).toBe("No work to show yet for A/B testing, Swift.");
    expect(quoteBrief("  hi ")).toBe("“hi”");
    expect(quoteBrief("x".repeat(100))).toBe(`“${"x".repeat(90)}…”`);
  });
});
