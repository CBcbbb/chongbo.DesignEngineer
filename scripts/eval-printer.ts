/**
 * Runs the printer's eval set (tests/eval/cases.ts) against the live model and prints a table:
 * pass or fail per case, latency, tokens and cost. Needs ANTHROPIC_API_KEY in .env.local. Costs real money (about
 * $0.004 a request on Sonnet at low effort), so it is not part of `npm test`.
 *
 *   npm run eval:printer                     the model in model.ts, once per case
 *   RUNS=3 npm run eval:printer              three runs per case
 *   MODEL=claude-haiku-5-5 EFFORT=medium npm run eval:printer    compare another model or effort
 */
import { askModel, MODEL, MODEL_EFFORT } from "@/lib/ask/model";
import { CASES } from "../tests/eval/cases";
import { costOf, meteredClient } from "./eval-meter";

const model = process.env.MODEL ?? MODEL;
const effort = process.env.EFFORT ?? MODEL_EFFORT;
const runs = Number(process.env.RUNS ?? 1);
const meter = meteredClient(model, effort);

let failures = 0;
let total = 0;
const rows: string[] = [];
for (const c of CASES) {
  for (let i = 0; i < runs; i++) {
    meter.reset();
    const t0 = Date.now();
    const r = await askModel({ brief: c.brief, topics: [] }, { client: meter.client, timeoutMs: 30_000 });
    const ms = Date.now() - t0;
    const cost = costOf(model, meter.last());
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
