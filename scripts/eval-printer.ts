/**
 * Runs the printer's eval set (tests/eval/cases.ts) against the live model and prints a table:
 * pass or fail per case, latency, tokens and cost. Needs ANTHROPIC_API_KEY in .env.local. Costs real money (about
 * $0.004 a request on Sonnet at low effort), so it is not part of `npm test`.
 *
 *   npm run eval:printer                     the model in model.ts, once per case
 *   RUNS=3 npm run eval:printer              three runs per case
 *   MODEL=claude-haiku-5-5 EFFORT=medium npm run eval:printer    compare another model or effort
 */
import Anthropic from "@anthropic-ai/sdk";
import { askModel, MODEL, MODEL_EFFORT, type ParseClient } from "@/lib/ask/model";
import { CASES } from "../tests/eval/cases";

/** $ per million tokens: input, output, cache read, cache write (5 minutes). */
const PRICES: Record<string, [number, number, number, number]> = {
  "claude-sonnet-5-5": [2, 10, 0.2, 2.5],
  "claude-haiku-5-5": [0.1, 0.5, 0.01, 0.125],
  "claude-opus-5-5": [4, 20, 0.2, 5],
};

type Usage = { input_tokens: number; output_tokens: number; cache_read_input_tokens?: number | null; cache_creation_input_tokens?: number | null };

const model = process.env.MODEL ?? MODEL;
const effort = process.env.EFFORT ?? MODEL_EFFORT;
const runs = Number(process.env.RUNS ?? 1);
const sdk = new Anthropic();

let failures = 0;
let total = 0;
const rows: string[] = [];
for (const c of CASES) {
  for (let i = 0; i < runs; i++) {
    let usage: Usage | undefined;
    const client: ParseClient = {
      messages: {
        parse: async (params, options) => {
          const p = { ...params, model, output_config: { ...params.output_config, effort: effort as typeof MODEL_EFFORT } };
          const message = await sdk.messages.parse(p, options);
          usage = message.usage;
          return message as never;
        },
      },
    };
    const t0 = Date.now();
    const r = await askModel({ brief: c.brief, topics: [] }, { client, timeoutMs: 30_000 });
    const ms = Date.now() - t0;
    const [pi, po, pr, pw] = PRICES[model] ?? [0, 0, 0, 0];
    const cost = usage
      ? (usage.input_tokens * pi + usage.output_tokens * po + (usage.cache_read_input_tokens ?? 0) * pr + (usage.cache_creation_input_tokens ?? 0) * pw) / 1e6
      : 0;
    const problems = r ? c.check(r) : ["model gave up (the site would fall back)"];
    total++;
    if (problems.length) failures++;
    rows.push(
      [
        problems.length ? "FAIL" : "pass",
        c.id.padEnd(16),
        `${(ms / 1000).toFixed(1)}s`.padStart(6),
        `$${cost.toFixed(4)}`,
        r ? r.sheets.map((s) => `${s.project.split("-")[0]}#${s.section}`).join(", ") : "-",
        r?.missing.length ? `missing: ${r.missing.join("; ")}` : "",
        problems.join("; "),
      ].join("  "),
    );
  }
}

console.log(`\n${model}, effort ${effort}, ${runs} run(s) per case\n`);
for (const row of rows) console.log(row);
console.log(`\n${total - failures} of ${total} passed`);
process.exitCode = failures ? 1 : 0;
