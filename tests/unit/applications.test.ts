import { describe, expect, it } from "vitest";
import { applications, applicationSelection } from "@content/applications";
import { buildCardIndex, cardKey, shownTopics } from "@/lib/cards";
import { curatedAnswer } from "@/lib/curated";
import { attributionRef } from "@/lib/analytics";
import sitemap from "@/app/sitemap";

describe("application selections", () => {
  it("prints the five approved public cards in order, identified as a human selection", () => {
    const selection = applicationSelection("granola")!;
    const answer = curatedAnswer(selection, buildCardIndex())!;
    expect(selection.label).toBe("Picked for Granola");
    expect(answer.source).toBe("curated");
    expect(answer.missing).toEqual([]);
    expect(answer.sheets.map((sheet) => cardKey(sheet.project, sheet.section))).toEqual([
      "design-system#three-layers", "design-system#figma-library", "design-system#in-code",
      "nike-athletes-closet#graphic-system", "hhcd-data-platform#contrast",
    ]);
    for (const application of Object.values(applications)) {
      expect(shownTopics().some((topic) => topic.id === application.replacesTopic)).toBe(true);
    }
    expect(sitemap().some(({ url }) => url.includes("/for/"))).toBe(false);
  });

  it("does not resolve unknown or inherited company names", () => {
    for (const name of ["unknown-company", "constructor", "toString", "__proto__"]) {
      expect(applicationSelection(name)).toBeNull();
    }
  });

  it("rejects invalid selections instead of silently printing different cards", () => {
    const selection = applicationSelection("granola")!;
    const index = buildCardIndex();
    for (const cards of [[], ["unknown#card"], ["this-site#printer"], [selection.cards[0]!, selection.cards[0]!], Object.keys(index).slice(0, 7)]) {
      expect(curatedAnswer({ ...selection, cards }, index)).toBeNull();
    }
  });
});

describe("application attribution", () => {
  it("reads the clean path, with explicit test attribution taking priority", () => {
    expect(attributionRef("", "/for/granola")).toBe("granola");
    expect(attributionRef("?ref=test", "/for/granola")).toBe("test");
    expect(attributionRef("?utm_source=mail", "/for/granola")).toBe("mail");
    expect(attributionRef("", "/")).toBe("");
    expect(attributionRef("", "/work/design-system")).toBe("");
    expect(attributionRef("?ref=" + "x".repeat(80), "/for/granola")).toHaveLength(60);
  });
});
