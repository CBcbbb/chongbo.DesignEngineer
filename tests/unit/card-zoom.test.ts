import { describe, expect, it } from "vitest";
import { ARTBOARD, CARD_ZOOM_SCRIPT, cardZoom } from "@/lib/card-zoom";

describe("card zoom", () => {
  it("is 1 when the artboard and the sheet's frame fit the screen", () => {
    expect(cardZoom(ARTBOARD.h + ARTBOARD.frame, 1200)).toBe(1);
    expect(cardZoom(1080, 1600)).toBe(1);
  });
  it("fits a shorter screen exactly", () => {
    expect(cardZoom(700, 1200)).toBeCloseTo((700 - ARTBOARD.frame) / ARTBOARD.h, 3);
  });
  it("fits a narrow column", () => {
    expect(cardZoom(900, 760)).toBeCloseTo(760 / ARTBOARD.w, 3);
  });
  it("never goes below the floor, so text stays readable", () => {
    expect(cardZoom(400, 400)).toBe(ARTBOARD.min);
  });
  it("inlines the same numbers it computes with", () => {
    expect(CARD_ZOOM_SCRIPT).toContain(JSON.stringify(ARTBOARD));
    expect(() => new Function(CARD_ZOOM_SCRIPT)).not.toThrow();
  });
});
