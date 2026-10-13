/**
 * Shared by the eval scripts: a ParseClient that calls the real SDK with an overridable model and effort, and records
 * each request's token usage, so cost can be reported per case.
 */
import Anthropic from "@anthropic-ai/sdk";
import type { ParseClient } from "@/lib/ask/model";

/**
 * $ per million tokens: input, output, cache read, cache write (5 minutes).
 * From https://platform.claude.com/docs/en/about-claude/pricing (checked 13 Oct 2026). Haiku's rates are for prompts
 * up to 100k tokens, which the printer's prompt always is.
 */
export const PRICES: Record<string, [number, number, number, number]> = {
  "claude-sonnet-5-5": [2, 10, 0.1, 2.5],
  "claude-haiku-5-5": [0.1, 0.5, 0.01, 0.125],
  "claude-opus-5-5": [4, 20, 0.2, 5],
};

export type Usage = {
  input_tokens: number;
  output_tokens: number;
  cache_read_input_tokens?: number | null;
  cache_creation_input_tokens?: number | null;
};

export function costOf(model: string, usage: Usage | undefined): number {
  if (!usage) return 0;
  const [pi, po, pr, pw] = PRICES[model] ?? [0, 0, 0, 0];
  return (
    (usage.input_tokens * pi +
      usage.output_tokens * po +
      (usage.cache_read_input_tokens ?? 0) * pr +
      (usage.cache_creation_input_tokens ?? 0) * pw) /
    1e6
  );
}

/** A client for askModel() that uses `model` and `effort` and hands back the usage of its last request. */
export function meteredClient(model: string, effort: string): { client: ParseClient; last: () => Usage | undefined; reset: () => void } {
  const sdk = new Anthropic();
  let usage: Usage | undefined;
  const client: ParseClient = {
    messages: {
      parse: async (params, options) => {
        const p: Record<string, unknown> = { ...(params as Record<string, unknown>), model };
        p.output_config = { ...(p.output_config as object), effort };
        const message = await sdk.messages.parse(p as never, options);
        usage = message.usage as Usage;
        return message as never;
      },
    },
  };
  return { client, last: () => usage, reset: () => (usage = undefined) };
}
