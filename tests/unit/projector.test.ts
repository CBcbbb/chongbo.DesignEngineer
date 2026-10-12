import { describe, expect, it } from "vitest";
import { projects, suggestedQuestions } from "@content";
import { fallbackAnswer } from "@/lib/ask/fallback";
import { AskRequestSchema } from "@/lib/ask/schema";
import { buildCardIndex, cardKey } from "@/lib/cards";
import { BEAM, beamPlacement, beamPolygon, firstSentence, quoteCard, slideHasMedia, storyPose, thumbCandidates } from "@/lib/projector";

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

describe("the row of story cards", () => {
  it("lights the active card and turns the others away, out of the light two places off", () => {
    const on = storyPose(1, 1);
    expect(on).toMatchObject({ rel: 0, scale: 1, rotate: -0, opacity: 1 });
    const right = storyPose(2, 1);
    expect(right.rotate).toBeLessThan(0);
    expect(right.opacity).toBeLessThan(1);
    expect(storyPose(0, 1).rotate).toBeGreaterThan(0);
    expect(storyPose(4, 1).opacity).toBe(0);
    // dragging half a card moves every pose by half a place
    expect(storyPose(1, 1, -0.5).rel).toBe(-0.5);
  });

  it("finds a picture for a card from its evidence, and an excerpt when there is none", () => {
    expect(thumbCandidates({ kind: "video", asset: "a.mp4", alt: "", need: "", ratio: "16:10", poster: "a.jpg" })).toEqual(["a.jpg"]);
    expect(thumbCandidates({ kind: "code", language: "ts", code: "" })).toEqual([]);
    expect(firstSentence(["One thing. Then another."])).toBe("One thing.");
    expect(firstSentence(["No full stop"])).toBe("No full stop");
  });
});

describe("the beam photograph", () => {
  it("puts its apex on the lens", () => {
    const lens = { x: 400, y: 700 };
    const p = beamPlacement(lens, { x: 900, y: 400 }, 400);
    const s = p.width / BEAM.w;
    expect(p.left + BEAM.apex.x * s).toBeCloseTo(lens.x);
    expect(p.top + BEAM.apex.y * s).toBeCloseTo(lens.y);
    // its length is the distance from the lens to the target
    expect(Math.hypot(BEAM.end.x - BEAM.apex.x, BEAM.end.y - BEAM.apex.y) * s).toBeCloseTo(Math.hypot(500, 300));
  });
});
