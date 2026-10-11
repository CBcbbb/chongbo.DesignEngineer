import { describe, expect, it } from "vitest";
import { requestedCount } from "@/lib/ask/count";

describe("requestedCount", () => {
  it("reads a number of projects the visitor asks for", () => {
    expect(requestedCount("give me 2 designsn syetms project")).toBe(2);
    expect(requestedCount("Show me three examples of accessibility work")).toBe(3);
    expect(requestedCount("one case study on motion")).toBe(1);
  });
  it("ignores numbers that aren't a count of projects, and counts past the sheet limit", () => {
    expect(requestedCount("WCAG 2.2 AA and 5 years of React")).toBeNull();
    expect(requestedCount("Design systems, accessibility")).toBeNull();
    expect(requestedCount("give me 9 projects")).toBeNull();
  });
});
