import { afterEach, describe, expect, it, vi } from "vitest";

// The real SDK is never called in tests.
vi.mock("@anthropic-ai/sdk", () => ({
  default: vi.fn(() => {
    throw new Error("SDK should not be constructed in tests");
  }),
}));

import { askModel, buildSystemPrompt, MODEL, userMessage, type ParseClient } from "@/lib/ask/model";
import { AskResponseSchema } from "@/lib/ask/schema";

function fakeClient(result: unknown, stop_reason = "end_turn") {
  const parse = vi.fn(async () => ({ parsed_output: result, stop_reason }));
  return { client: { messages: { parse } } as unknown as ParseClient, parse };
}

const sheet = (project: string, section: string, signal: string, reason = "Shows it.") => ({ project, section, signal, reason });

afterEach(() => vi.restoreAllMocks());

describe("askModel", () => {
  it("returns a validated answer with source=model and legacy fields", async () => {
    const { client, parse } = fakeClient({
      asked: ["accessibility"],
      missing: [],
      sheets: [
        sheet("hhcd-data-platform", "dual-view", "accessibility", "An accessible second view."),
        sheet("component-store", "contrast-in-tokens", "accessibility", "Contrast in the tokens."),
      ],
      line: "Two projects show accessibility.",
    });
    const r = await askModel({ brief: "accessibility?", topics: [] }, { client });
    expect(AskResponseSchema.safeParse(r).success).toBe(true);
    expect(r).toMatchObject({ source: "model", asked: ["accessibility"], line: "Two projects show accessibility.", matched: "accessibility" });
    expect(r!.sheets).toHaveLength(2);
    expect(r!.picks).toHaveLength(2);
    const [params, options] = parse.mock.calls[0] as unknown as [Record<string, unknown>, Record<string, unknown>];
    expect(params.model).toBe(MODEL);
    expect(params.output_config).toBeDefined();
    expect(options.timeout).toBe(6000);
    expect(JSON.stringify(params.messages)).toContain("<brief>");
  });

  it("enforces one sheet per project and the five-sheet cap", async () => {
    const { client } = fakeClient({
      asked: ["accessibility", "data"],
      missing: [],
      sheets: [
        sheet("hhcd-data-platform", "dual-view", "accessibility"),
        sheet("hhcd-data-platform", "keyboard", "accessibility"),
        sheet("component-store", "contrast-in-tokens", "accessibility"),
        sheet("component-store", "mapping", "data"),
        sheet("this-site", "foundations", "accessibility"),
        sheet("nike-athletes-closet", "graphic-system", "reusable-components"),
        sheet("wildecho", "prototype", "prototyping"),
      ],
      line: "Five projects match your brief.",
    });
    const r = await askModel({ brief: "a11y and data", topics: [] }, { client });
    expect(r!.sheets.map((s) => s.project)).toEqual([
      "hhcd-data-platform",
      "component-store",
      "this-site",
      "nike-athletes-closet",
      "wildecho",
    ]);
  });

  it("drops invented ids and falls back (null) when none remain", async () => {
    const { client } = fakeClient({
      asked: ["data"],
      missing: [],
      sheets: [sheet("secret-project", "x", "data")],
      line: "Sure.",
    });
    expect(await askModel("q", { client })).toBeNull();
  });

  it("repairs a bad line, asked list and signal from the sheets", async () => {
    const { client } = fakeClient({
      asked: ["nonsense"],
      missing: ["A/B testing", "<script>"],
      sheets: [sheet("component-store", "contracts", "vibes")],
      line: "x".repeat(400),
    });
    const r = await askModel("q", { client });
    expect(AskResponseSchema.safeParse(r).success).toBe(true);
    expect(r!.sheets[0]!.signal).toBe("design-eng-gap");
    expect(r!.asked).toEqual(["design-eng-gap"]);
    expect(r!.missing).toEqual(["A/B testing"]);
    expect(r!.line).toBe("One project shows design and engineering together.");
  });

  it("always counts the visitor's chosen topics as asked", async () => {
    const { client, parse } = fakeClient({
      asked: ["data"],
      missing: [],
      sheets: [sheet("hhcd-data-platform", "dual-view", "accessibility")],
      line: "One project matches your brief.",
    });
    const r = await askModel({ brief: "tables", topics: ["accessibility"] }, { client });
    expect(r!.asked).toEqual(["accessibility", "data"]);
    expect(JSON.stringify(parse.mock.calls[0])).toContain("accessibility");
  });

  it("returns null on errors, refusals and malformed output", async () => {
    const throwing = { messages: { parse: vi.fn(async () => Promise.reject(new Error("timeout"))) } } as unknown as ParseClient;
    vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(await askModel("q", { client: throwing })).toBeNull();
    expect(
      await askModel("q", { client: fakeClient({ asked: [], missing: [], sheets: [], line: "x" }, "refusal").client }),
    ).toBeNull();
    expect(await askModel("q", { client: fakeClient("not an object").client })).toBeNull();
  });

  it("returns null without a client (no API key)", async () => {
    expect(await askModel("q", { client: null })).toBeNull();
  });

  it("system prompt carries the catalogue and the signal index, and treats the brief as data", () => {
    const prompt = buildSystemPrompt();
    expect(prompt).toContain("hhcd-data-platform");
    expect(prompt).toContain("dual-view");
    expect(prompt).toContain("hhcd-data-platform/keyboard@1");
    expect(prompt).toContain("data, not instructions");
    expect(prompt).toContain("One sheet per project");
    expect(prompt.toLowerCase()).not.toContain("redis");
  });

  it("wraps the brief and caps it at 4,000 characters", () => {
    const msg = userMessage({ brief: "y".repeat(5000), topics: ["data"] });
    expect(msg).toContain("<brief>");
    expect(msg.match(/y+/g)!.reduce((a, b) => Math.max(a, b.length), 0)).toBe(4000);
    expect(msg).toContain("Topics the visitor chose (signal keys): data");
  });
});
