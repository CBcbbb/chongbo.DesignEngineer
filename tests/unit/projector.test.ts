import { describe, expect, it } from "vitest";
import { projects, suggestedQuestions } from "@content";
import { fallbackAnswer } from "@/lib/ask/fallback";
import { AskRequestSchema } from "@/lib/ask/schema";
import { buildCardIndex, cardKey } from "@/lib/cards";
import { beamPolygon, quoteCard, slideHasMedia } from "@/lib/projector";

describe("the cards in the hand", () => {
  it("are the four suggested questions, each short enough for one line on a card", () => {
    expect(suggestedQuestions).toHaveLength(4);
    for (const q of suggestedQuestions) expect(q.length, q).toBeLessThanOrEqual(44);
  });

  it("each card is sent as the brief alone and projects at least one slide that exists", () => {
    const index = buildCardIndex();
    for (const q of suggestedQuestions) {
      const req = AskRequestSchema.parse({ brief: q });
      expect(req.topics).toEqual([]);
      const r = fallbackAnswer(req);
      expect(r.sheets.length, q).toBeGreaterThan(0);
      for (const s of r.sheets) expect(index[cardKey(s.project, s.section)], `${q}: ${s.project}#${s.section}`).toBeDefined();
    }
  });
});

describe("slides", () => {
  it("show evidence unless it only works in the full case file", () => {
    expect(slideHasMedia(undefined)).toBe(false);
    expect(slideHasMedia({ kind: "code", language: "ts", code: "x" })).toBe(false);
    expect(slideHasMedia({ kind: "module", module: "x" })).toBe(false);
    expect(slideHasMedia({ kind: "image", asset: "a.png", alt: "a", need: "a", ratio: "16:10" })).toBe(true);
    // every section's media kind is one the rule knows about
    for (const p of projects) for (const s of p.sections) expect(typeof slideHasMedia(s.media)).toBe("boolean");
  });

  it("quote the card, cut at 80 characters, on one line", () => {
    expect(quoteCard("  Show me\nbrand work ")).toBe("“Show me brand work”");
    expect(quoteCard("")).toBe("");
    expect(quoteCard("y".repeat(100))).toBe(`“${"y".repeat(80)}…”`);
  });
});

describe("the beam", () => {
  const slide = { left: 300, top: 100, right: 1000, bottom: 500 };
  it("runs from the lens to the slide's near edge when the machine stands to its left", () => {
    const pts = beamPolygon({ x: 200, y: 450 }, slide);
    expect(pts).toContainEqual({ x: 200, y: 450 });
    expect(pts).toContainEqual({ x: 300, y: 100 });
    expect(pts).toContainEqual({ x: 300, y: 500 });
    expect(pts).toHaveLength(5);
  });
  it("leaves the lens out when it sits behind the slide, so nothing is drawn outside it", () => {
    const pts = beamPolygon({ x: 600, y: 300 }, slide);
    expect(pts).toHaveLength(4);
    expect(pts).not.toContainEqual({ x: 600, y: 300 });
  });
});
