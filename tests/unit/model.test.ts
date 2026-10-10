import { afterEach, describe, expect, it, vi } from "vitest";

// The real SDK is never called in tests.
vi.mock("@anthropic-ai/sdk", () => ({
  default: vi.fn(() => {
    throw new Error("SDK should not be constructed in tests");
  }),
}));

import { askModel, buildSystemPrompt, MODEL, type ParseClient } from "@/lib/ask/model";

function fakeClient(result: unknown, stop_reason = "end_turn") {
  const parse = vi.fn(async () => ({ parsed_output: result, stop_reason }));
  return { client: { messages: { parse } } as unknown as ParseClient, parse };
}

afterEach(() => vi.restoreAllMocks());

describe("askModel", () => {
  it("returns a validated answer with source=model", async () => {
    const { client, parse } = fakeClient({
      reply: "I designed accessibility into the structure from the start.",
      picks: [
        { project: "hhcd-data-platform", section: "dual-view", reason: "An accessible second view." },
        { project: "component-store", section: "contrast-in-tokens", reason: "Contrast in the tokens." },
      ],
      matched: "accessibility",
    });
    const r = await askModel("accessibility?", { client });
    expect(r).toMatchObject({ source: "model", matched: "accessibility" });
    expect(r!.picks).toHaveLength(2);
    const [params, options] = parse.mock.calls[0] as unknown as [Record<string, unknown>, Record<string, unknown>];
    expect(params.model).toBe(MODEL);
    expect(params.output_config).toBeDefined();
    expect(options.timeout).toBe(6000);
    expect(JSON.stringify(params.messages)).toContain("<question>");
  });

  it("drops invented ids and falls back (null) when none remain", async () => {
    const { client } = fakeClient({
      reply: "Sure.",
      picks: [{ project: "secret-project", section: "x", reason: "y" }],
      matched: "data",
    });
    expect(await askModel("q", { client })).toBeNull();
  });

  it("repairs a bad reply and matched key from the picks", async () => {
    const { client } = fakeClient({
      reply: "x".repeat(400),
      picks: [{ project: "component-store", section: "contracts", reason: "Data contracts." }],
      matched: "nonsense",
    });
    const r = await askModel("q", { client });
    expect(r!.matched).toBe("design-eng-gap");
    expect(r!.reply.length).toBeLessThanOrEqual(160);
  });

  it("returns null on errors, refusals and malformed output", async () => {
    const throwing = { messages: { parse: vi.fn(async () => Promise.reject(new Error("timeout"))) } } as unknown as ParseClient;
    vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(await askModel("q", { client: throwing })).toBeNull();
    expect(await askModel("q", { client: fakeClient({ reply: "x", picks: [], matched: "data" }, "refusal").client })).toBeNull();
    expect(await askModel("q", { client: fakeClient("not an object").client })).toBeNull();
  });

  it("returns null without a client (no API key)", async () => {
    expect(await askModel("q", { client: null })).toBeNull();
  });

  it("system prompt carries the catalogue and treats the question as data", () => {
    const prompt = buildSystemPrompt();
    expect(prompt).toContain("hhcd-data-platform");
    expect(prompt).toContain("dual-view");
    expect(prompt).toContain("data, not instructions");
    expect(prompt.toLowerCase()).not.toContain("redis");
  });
});
