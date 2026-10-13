/**
 * The /ask eval harness: runs every job description in tests/eval/jds.ts through the keyword fallback and, when
 * ANTHROPIC_API_KEY is set, through the live model, and reports per fixture: precision, recall, whether the first card
 * is right, the missing labels, latency, tokens and cost. Not part of `npm test`: the model path costs real money
 * (about half a US cent a request on Sonnet at low effort, with the prompt cached).
 *
 *   npm run eval:ask                            fallback, plus the model when a key is in .env.local
 *   PATHS=fallback npm run eval:ask             the fallback only (free, offline)
 *   RUNS=3 npm run eval:ask                     three model runs per fixture (the model is not deterministic)
 *   ONLY=de-ai,pd-b2b npm run eval:ask          some fixtures only
 *   MODEL=claude-haiku-5-5 EFFORT=medium npm run eval:ask    compare another model or effort
 *
 * The full results, card by card, are written to .eval/ (not committed). Rows marked * are scored against
 * expectations Chongbo hasn't reviewed yet.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { fallbackAnswer } from "@/lib/ask/fallback";
import { askModel, MODEL, MODEL_EFFORT } from "@/lib/ask/model";
import type { AskResponse } from "@/lib/ask/schema";
import { JDS, type JdFixture } from "../tests/eval/jds";
import { mean, percentile, score, type Score } from "../tests/eval/score";
import { costOf, meteredClient, type Usage } from "./eval-meter";

const model = process.env.MODEL ?? MODEL;
const effort = process.env.EFFORT ?? MODEL_EFFORT;
const runs = Math.max(1, Number(process.env.RUNS ?? 1));
const only = process.env.ONLY?.split(",").map((s) => s.trim()).filter(Boolean);
const paths = (process.env.PATHS ?? "fallback,model").split(",").map((s) => s.trim());
const hasKey = Boolean(process.env.ANTHROPIC_API_KEY);
const runModel = paths.includes("model") && hasKey;
const runFallback = paths.includes("fallback");

type Row = {
  fixture: string;
  family: string;
  reviewed: boolean;
  path: "fallback" | "model";
  run: number;
  ms: number;
  /** The model path returned nothing: the site would have printed the fallback's answer instead. */
  gaveUp: boolean;
  usage?: Usage;
  cost: number;
  asked: string[];
  missing: string[];
  line: string;
  score: Score;
};

const fixtures: JdFixture[] = only ? JDS.filter((f) => only.includes(f.id)) : JDS;
if (!fixtures.length) throw new Error(`No fixtures match ONLY=${process.env.ONLY}`);

const empty: AskResponse["sheets"] = [];
function row(f: JdFixture, path: Row["path"], run: number, ms: number, r: AskResponse | null, usage?: Usage): Row {
  return {
    fixture: f.id,
    family: f.family,
    reviewed: f.reviewed,
    path,
    run,
    ms,
    gaveUp: !r,
    usage,
    cost: path === "model" ? costOf(model, usage) : 0,
    asked: r?.asked ?? [],
    missing: r?.missing ?? [],
    line: r?.line ?? "",
    score: score(f, { sheets: r?.sheets ?? empty, missing: r?.missing ?? [] }),
  };
}

const rows: Row[] = [];
const meter = runModel ? meteredClient(model, effort) : null;
for (const f of fixtures) {
  if (runFallback) {
    const t0 = performance.now();
    const r = fallbackAnswer({ brief: f.jd, topics: [] });
    rows.push(row(f, "fallback", 1, performance.now() - t0, r));
  }
  if (meter) {
    for (let run = 1; run <= runs; run++) {
      meter.reset();
      const t0 = performance.now();
      const r = await askModel({ brief: f.jd, topics: [] }, { client: meter.client, timeoutMs: 30_000 });
      rows.push(row(f, "model", run, performance.now() - t0, r, meter.last()));
    }
  }
}

const pct = (x: number) => `${Math.round(x * 100)}%`.padStart(4);
const short = (id: string) => id.replace("hhcd-data-platform#", "hh:").replace("components-for-any-data#", "cad:").replace("design-system#", "ds:").replace("nike-athletes-closet#", "nk:");
const time = (ms: number) => (ms < 1000 ? `${ms.toFixed(ms < 10 ? 1 : 0)}ms` : `${(ms / 1000).toFixed(1)}s`).padStart(7);

for (const path of ["fallback", "model"] as const) {
  const set = rows.filter((r) => r.path === path);
  if (!set.length) continue;
  console.log(`\n${path === "model" ? `${model}, effort ${effort}, ${runs} run(s) per fixture` : "Keyword fallback"}\n`);
  console.log(["fixture".padEnd(17), "  P  ", "  R  ", "top", "   time", path === "model" ? "  tokens in/out/cached    cost" : "", "printed · not printed (must) · stray · missing"].join(" "));
  for (const r of set) {
    const tokens = r.usage ? `${r.usage.input_tokens}/${r.usage.output_tokens}/${r.usage.cache_read_input_tokens ?? 0}`.padEnd(20) : "".padEnd(20);
    console.log(
      [
        `${r.fixture}${r.reviewed ? "" : "*"}${runs > 1 && path === "model" ? `#${r.run}` : ""}`.padEnd(17),
        r.gaveUp ? " gave up (site falls back)" : `${pct(r.score.precision)} ${pct(r.score.recall)}  ${r.score.top ? "yes" : " no"}`,
        time(r.ms),
        path === "model" ? `  ${tokens} $${r.cost.toFixed(4)}` : "",
        r.gaveUp
          ? ""
          : [
              r.score.printed.map(short).join(" "),
              r.score.absent.length ? `· absent ${r.score.absent.map(short).join(" ")}` : "",
              r.score.stray.length ? `· stray ${r.score.stray.map(short).join(" ")}` : "",
              r.missing.length ? `· missing "${r.missing.join("; ")}"` : "",
              r.score.missing.length ? `· ${r.score.missing.join("; ")}` : "",
            ]
              .filter(Boolean)
              .join(" "),
      ].join(" "),
    );
  }
  const answered = set.filter((r) => !r.gaveUp);
  const ms = set.map((r) => r.ms);
  console.log(
    `\n  mean precision ${pct(mean(answered.map((r) => r.score.precision)))}, mean recall ${pct(mean(answered.map((r) => r.score.recall)))}, ` +
      `first card right ${answered.filter((r) => r.score.top).length}/${answered.length}, missing-label problems ${answered.filter((r) => r.score.missing.length).length}` +
      (path === "model" ? `, gave up ${set.length - answered.length}/${set.length}` : ""),
  );
  console.log(
    `  latency p50 ${time(percentile(ms, 50)).trim()}, p95 ${time(percentile(ms, 95)).trim()}, max ${time(Math.max(...ms)).trim()}` +
      (path === "model" ? `; cost $${set.reduce((a, r) => a + r.cost, 0).toFixed(4)} in all, $${mean(set.map((r) => r.cost)).toFixed(4)} a request` : ""),
  );
}

if (paths.includes("model") && !hasKey) console.log("\nNo ANTHROPIC_API_KEY: the model path was skipped. Put a key in .env.local to run it.");
if (fixtures.some((f) => !f.reviewed)) console.log("* expectations not yet reviewed by Chongbo");

mkdirSync(".eval", { recursive: true });
const file = `.eval/ask-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
writeFileSync(file, JSON.stringify({ model, effort, runs, rows }, null, 2));
console.log(`\nFull results: ${file}`);
