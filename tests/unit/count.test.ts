import { describe, expect, it } from "vitest";
import { requestedCount } from "@/lib/ask/count";

describe("requestedCount", () => {
  it("reads a number of projects the visitor asks for", () => {
    expect(requestedCount("give me 2 designsn syetms project")).toEqual({ n: 2, unit: "projects" });
    expect(requestedCount("give me 2 design systems projects")).toEqual({ n: 2, unit: "projects" });
    expect(requestedCount("one case study on motion")).toEqual({ n: 1, unit: "projects" });
  });
  it("reads a number of cards when they ask for examples or pieces", () => {
    expect(requestedCount("Show me three examples of accessibility work")).toEqual({ n: 3, unit: "cards" });
    expect(requestedCount("six pieces of work")).toEqual({ n: 6, unit: "cards" });
  });
  it("ignores numbers that aren't a count of projects, and counts past the sheet limit", () => {
    expect(requestedCount("WCAG 2.2 AA and 5 years of React")).toBeNull();
    expect(requestedCount("Design systems, accessibility")).toBeNull();
    expect(requestedCount("give me 9 projects")).toBeNull();
  });
});
