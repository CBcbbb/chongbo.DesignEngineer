/**
 * Scoring for the /ask eval harness. Pure functions, so tests/unit can check them offline.
 *
 *   precision = printed cards that are `must` or `ok` / printed cards
 *   recall    = `must` cards printed / min(must, six)       (the printer never prints more than six)
 *   top       = whether the first printed card is a `must` card
 */
import { MAX_SHEETS } from "@/lib/ask/schema";
import type { CardId, JdFixture } from "./jds";

export type Printed = { sheets: { project: string; section: string }[]; missing: string[] };

export type Score = {
  printed: CardId[];
  hits: CardId[];
  /** Printed cards that are neither `must` nor `ok`. */
  stray: CardId[];
  /** `must` cards not printed. */
  absent: CardId[];
  precision: number;
  recall: number;
  top: boolean;
  /** Problems with the missing labels, in plain words. */
  missing: string[];
};

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

export function score(fixture: Pick<JdFixture, "must" | "ok" | "missing">, out: Printed): Score {
  const printed = out.sheets.map((s) => `${s.project}#${s.section}` as CardId);
  const must = new Set(fixture.must);
  const fine = new Set([...fixture.must, ...fixture.ok]);
  const hits = printed.filter((c) => must.has(c));
  const stray = printed.filter((c) => !fine.has(c));
  const absent = fixture.must.filter((c) => !printed.includes(c));
  const wanted = Math.min(must.size, MAX_SHEETS);

  const labels = out.missing.map(norm);
  const missing = [
    ...(fixture.missing?.expect ?? []).filter((m) => !labels.includes(norm(m))).map((m) => `not reported missing: ${m}`),
    ...(fixture.missing?.never ?? []).filter((m) => labels.some((l) => l.includes(norm(m)))).map((m) => `wrongly missing: ${m}`),
  ];

  return {
    printed,
    hits,
    stray,
    absent,
    precision: printed.length ? (printed.length - stray.length) / printed.length : 0,
    recall: wanted ? Math.min(1, hits.length / wanted) : 1,
    top: printed.length > 0 && must.has(printed[0]!),
    missing,
  };
}

export const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);

/** Nearest-rank percentile, for latency. */
export function percentile(xs: number[], p: number): number {
  if (!xs.length) return 0;
  const sorted = [...xs].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1))]!;
}
