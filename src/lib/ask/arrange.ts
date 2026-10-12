/**
 * The printer's rules for which ranked cards are printed, shared by the model and the fallback.
 * Whoever ranks (Claude or the keyword scorer) only says which cards answer the ask and how well; this decides the deck:
 *
 *   1. One sheet per card: the same project + section never twice. No limit per project.
 *   2. A requested count: "2 projects" keeps the two strongest projects' cards; "2 examples" keeps two cards.
 *   3. Spread by capability: when several capabilities were asked for, each gets its best card before any gets a
 *      second. One capability: the best cards for it, wherever they are.
 *   4. At most six, never padded: only ranked cards are printed.
 *   5. Cards from one project sit together (in the order of each project's best card), so they read as a group.
 */
import type { Signal } from "@content/schema";
import type { RequestedCount } from "./count";
import { MAX_SHEETS } from "./schema";

export type Ranked = { project: string; section: string; signal: Signal };

const key = (r: Ranked) => `${r.project}#${r.section}`;

export function arrange<T extends Ranked>(ranked: readonly T[], asked: readonly Signal[], count: RequestedCount | null = null): T[] {
  const seen = new Set<string>();
  let pool = ranked.filter((r) => !seen.has(key(r)) && seen.add(key(r)));

  if (count?.unit === "projects") {
    const keep = [...new Set(pool.map((r) => r.project))].slice(0, count.n);
    pool = pool.filter((r) => keep.includes(r.project));
  }
  const limit = count?.unit === "cards" ? Math.min(count.n, MAX_SHEETS) : MAX_SHEETS;

  // Lanes: the asked capabilities in order, then any other capability a card was ranked for.
  const lanes = [...new Set([...asked.filter((s) => pool.some((r) => r.signal === s)), ...pool.map((r) => r.signal)])];
  let picked: T[];
  if (lanes.length <= 1) {
    picked = pool.slice(0, limit);
  } else {
    const queues = lanes.map((s) => pool.filter((r) => r.signal === s));
    picked = [];
    while (picked.length < limit && queues.some((q) => q.length)) {
      for (const q of queues) {
        const next = q.shift();
        if (next) picked.push(next);
        if (picked.length >= limit) break;
      }
    }
  }

  const projectOrder = [...new Set(picked.map((r) => r.project))];
  return picked
    .map((r, i) => ({ r, i }))
    .sort((a, b) => projectOrder.indexOf(a.r.project) - projectOrder.indexOf(b.r.project) || a.i - b.i)
    .map(({ r }) => r);
}

/** Capabilities asked for that the printed cards answer, in asked order (for the results title). */
export function answered(asked: readonly Signal[], cards: readonly Ranked[]): Signal[] {
  return asked.filter((s) => cards.some((c) => c.signal === s));
}
