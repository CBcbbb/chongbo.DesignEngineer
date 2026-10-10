import { expect, it } from "vitest";
import Anthropic from "@anthropic-ai/sdk";
import { askModel, MODEL, type ParseClient } from "@/lib/ask/model";

// Exercises the real SDK request/parse path against a fake transport (no network, no key).
it("sends structured-output params through the SDK and parses the reply", async () => {
  let sent: Record<string, unknown> = {};
  const fakeFetch = async (_url: RequestInfo | URL, init?: RequestInit) => {
    sent = JSON.parse(String(init?.body));
    const out = {
      asked: ["accessibility"],
      missing: [],
      sheets: [{ project: "hhcd-data-platform", section: "dual-view", signal: "accessibility", reason: "An accessible table view." }],
      line: "One project shows accessibility.",
    };
    return new Response(
      JSON.stringify({
        id: "msg_test",
        type: "message",
        role: "assistant",
        model: MODEL,
        content: [{ type: "text", text: JSON.stringify(out) }],
        stop_reason: "end_turn",
        stop_sequence: null,
        usage: { input_tokens: 1, output_tokens: 1 },
      }),
      { status: 200, headers: { "content-type": "application/json" } },
    );
  };
  const client = new Anthropic({ apiKey: "test-key", fetch: fakeFetch as typeof fetch });
  const r = await askModel("accessibility", { client: client as unknown as ParseClient });
  expect(sent.model).toBe("claude-haiku-5-5");
  expect((sent.output_config as { format: { type: string } }).format.type).toBe("json_schema");
  expect(r).toMatchObject({ source: "model", asked: ["accessibility"], matched: "accessibility", line: "One project shows accessibility." });
  expect(JSON.stringify(sent.messages)).toContain("<brief>");
});
