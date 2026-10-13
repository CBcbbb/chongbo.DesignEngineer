import { describe, expect, it } from "vitest";
import { projects, SIGNALS } from "@content";
import { fallbackAnswer } from "@/lib/ask/fallback";
import { AskRequestSchema } from "@/lib/ask/schema";
import { shownTopics } from "@/lib/cards";
import { missingLine, printedCount, projectRuns, provenanceLine, quoteBrief, resultTitle, TOPICS, topicsToLabels, topicsToSignals } from "@/lib/printed";

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
    for (const t of TOPICS) {
      expect(t.signals.length, t.id).toBeGreaterThan(0);
      for (const s of t.signals) expect(Object.keys(SIGNALS), t.id).toContain(s);
    }
    // Only cards some shown project has work for are offered; the rest wait for their project to come back.
    const shown = new Set(projects.flatMap((p) => p.sections.flatMap((s) => s.signals)));
    const offered = shownTopics();
    expect(offered.length).toBeGreaterThan(0);
    for (const t of offered) expect(t.signals.some((s) => shown.has(s)), t.id).toBe(true);
    for (const t of TOPICS.filter((x) => !offered.includes(x))) expect(t.signals.some((s) => shown.has(s)), t.id).toBe(false);
  });

  it("turns chosen cards into de-duplicated signals, first card first", () => {
    expect(topicsToSignals(["a11y"])).toEqual(["accessibility"]);
    expect(topicsToSignals(["systems", "a11y"])).toEqual(["design-systems", "cross-platform", "accessibility"]);
    expect(topicsToSignals(["a11y", "a11y", "nope"])).toEqual(["accessibility"]);
  });

  it("every combination the cards can send is a valid API request", () => {
    const all = topicsToSignals(TOPICS.map((t) => t.id));
    const offered = shownTopics();
    expect(AskRequestSchema.safeParse({ topics: all }).success).toBe(true);
    for (const t of offered) {
      const req = AskRequestSchema.parse({ topics: topicsToSignals([t.id]) });
      const r = fallbackAnswer(req);
      expect(r.sheets.length, t.id).toBeGreaterThan(0);
      // The printed sheets show what the card stands for.
      expect(r.sheets.every((s) => t.signals.includes(s.signal)), t.id).toBe(true);
    }
  });
});

describe("wording", () => {
  it("titles the results with what was asked, never a count", () => {
    expect(resultTitle({ asked: ["accessibility"], startHere: false })).toBe("Accessibility");
    expect(resultTitle({ asked: ["brand-storytelling", "motion-interaction", "seo-performance", "data"], startHere: false })).toBe(
      "Brand · Motion · SEO and performance",
    );
    expect(resultTitle({ asked: ["design-eng-gap", "seo-performance"], startHere: false, picked: ["Front‑end", "Motion"] })).toBe("Front‑end · Motion");
    expect(resultTitle({ asked: [], startHere: false })).toBe("Where to start.");
    expect(resultTitle({ asked: ["accessibility"], startHere: true })).toBe("Where to start.");
  });

  it("names missing capabilities and quotes the brief", () => {
    expect(missingLine([])).toBe("");
    expect(missingLine(["A/B testing", "Swift"])).toBe("No work to show yet for A/B testing, Swift.");
    expect(quoteBrief("  hi ")).toBe("“hi”");
    expect(quoteBrief("x".repeat(100))).toBe(`“${"x".repeat(90)}…”`);
  });

  it("labels a project's run of cards and counts what was printed", () => {
    const cards = [{ project: "hhcd" }, { project: "hhcd" }, { project: "hhcd" }, { project: "nike" }];
    expect(projectRuns(cards)).toEqual([{ at: 1, of: 3 }, { at: 2, of: 3 }, { at: 3, of: 3 }, null]);
    expect(printedCount(cards)).toBe("Four sheets from two projects");
    expect(printedCount(cards.slice(0, 3))).toBe("Three sheets");
    // One project only: the sheet counter says it already.
    expect(projectRuns(cards.slice(0, 3))).toEqual([null, null, null]);
    expect(provenanceLine("model", 4)).toBe("Picked by AI from my case files, so it may miss something.");
    expect(provenanceLine("fallback", 4)).toBe("Picked from my case files.");
  });
});

describe("topicsToLabels", () => {
  it("names a skills card from its lead signal alone, as shared links give it", () => {
    expect(topicsToLabels(["accessibility", "design-systems"])).toEqual(["Accessibility", "Design systems"]);
    expect(topicsToLabels(["design-systems", "cross-platform"])).toEqual(["Design systems"]);
    expect(topicsToLabels(["cross-platform"])).toEqual([]);
  });
});
