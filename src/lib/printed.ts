/**
 * Printed to order: the eight skills cards and the wording around a print.
 * Shared by the home page client, the /ask page and the unit tests, so it stays free of server-only code.
 */
import type { Signal } from "@content/schema";

export type Topic = { id: string; label: string; signals: Signal[] };

/** The skills cards, in order. Each maps to the content signals it stands for, the first weighing most. */
export const TOPICS: Topic[] = [
  { id: "a11y", label: "Accessibility", signals: ["accessibility"] },
  { id: "systems", label: "Design systems", signals: ["design-systems", "cross-platform"] },
  { id: "front", label: "Front‑end", signals: ["design-eng-gap", "seo-performance", "reusable-components"] },
  { id: "motion", label: "Motion", signals: ["motion-interaction", "prototyping"] },
  { id: "brand", label: "Web and brand", signals: ["brand-storytelling", "conversion", "typography"] },
  { id: "ai", label: "AI tools", signals: ["ai-tools"] },
  { id: "research", label: "Research", signals: ["research"] },
  { id: "data", label: "Data", signals: ["data"] },
];

export const topicById = (id: string): Topic | undefined => TOPICS.find((t) => t.id === id);

/** Chosen cards, in the order chosen, as the signal keys the ask API accepts (no duplicates). */
export function topicsToSignals(ids: readonly string[]): Signal[] {
  const out: Signal[] = [];
  for (const id of ids) for (const s of topicById(id)?.signals ?? []) if (!out.includes(s)) out.push(s);
  return out;
}

/** Typed on the paper while it is empty. */
export const EXAMPLES = [
  "A design engineer for our marketing website, strong in React and motion",
  "Someone to own our design system across web and mobile",
  "Accessibility and data visualisation for a research tool",
  "Paste a job description",
];

/** Shown on the paper, still, once a skills card is picked. */
export const PICKED_HINT = "Add a line about the role, or press the red button.";

export const NUM = ["No", "One", "Two", "Three", "Four", "Five", "Six"];

/** Short labels for signals, used in titles, stamps and chips. The long names live in content SIGNALS. */
export const SIGNAL_SHORT: Record<Signal | "start-here", string> = {
  "end-to-end": "End to end",
  "design-systems": "Design systems",
  "cross-platform": "Cross-platform",
  "design-eng-gap": "Design–engineering",
  accessibility: "Accessibility",
  "seo-performance": "SEO and performance",
  "publishing-workflow": "Publishing",
  "reusable-components": "Reusable components",
  "brand-storytelling": "Brand",
  conversion: "Conversion",
  "motion-interaction": "Motion",
  typography: "Typography",
  data: "Data",
  "data-architecture": "Data architecture",
  prototyping: "Prototyping",
  "ai-tools": "AI tools",
  research: "Research",
  judgement: "Judgement",
  "start-here": "Start here",
};

/**
 * The results title is what was asked for, never a count: the sheets underneath are the answer.
 *  - nothing understood, so the machine chose: "Where to start."
 *  - skills cards picked (no words): the cards' own names, "Front‑end · Motion"
 *  - words typed: what the machine understood, as short signal labels, "Brand · Motion · SEO and performance"
 */
export function resultTitle(opts: { asked: readonly Signal[]; startHere: boolean; picked?: readonly string[] }): string {
  if (opts.startHere) return "Where to start.";
  if (opts.picked?.length) return opts.picked.slice(0, 4).join(" · ");
  if (!opts.asked.length) return "Where to start.";
  return opts.asked.slice(0, 3).map((k) => SIGNAL_SHORT[k]).join(" · ");
}

/** The skills cards a list of signal keys came from (the no-JavaScript page), in card order. */
export function topicsToLabels(signals: readonly string[]): string[] {
  return TOPICS.filter((t) => t.signals.every((s) => signals.includes(s))).map((t) => t.label);
}

/** Under the results title: who chose the sheets, so the reader knows the words are mine. */
export function provenanceLine(source: "model" | "fallback", count: number): string {
  if (!count) return "";
  return source === "model" ? "Chosen by Claude from my case files. The words are mine." : "Matched by keyword from my case files.";
}

/**
 * Where each printed card sits within its project's run: cards from one project are printed together, so a run of
 * three reads "1 of 3", "2 of 3", "3 of 3" beside the project's name. A lone card has no position, and neither does a
 * print from one project only: the sheet counter already says it.
 */
export function projectRuns(cards: readonly { project: string }[]): ({ at: number; of: number } | null)[] {
  return cards.map((c, i) => {
    const of = cards.filter((x) => x.project === c.project).length;
    return of > 1 && of < cards.length ? { at: cards.slice(0, i + 1).filter((x) => x.project === c.project).length, of } : null;
  });
}

/** "Three sheets" or "Four sheets from two projects", for the paper's checklist. */
export function printedCount(cards: readonly { project: string }[]): string {
  const n = cards.length;
  const p = new Set(cards.map((c) => c.project)).size;
  const sheets = `${NUM[n] ?? n} ${n === 1 ? "sheet" : "sheets"}`;
  return p > 1 ? `${sheets} from ${(NUM[p] ?? String(p)).toLowerCase()} projects` : sheets;
}

export function missingLine(missing: readonly string[]): string {
  return missing.length ? `No work to show yet for ${missing.join(", ")}.` : "";
}

/** The brief quoted under the title, cut at 90 characters. */
export function quoteBrief(brief: string): string {
  const t = brief.trim();
  if (!t) return "";
  return `“${t.slice(0, 90)}${t.length > 90 ? "…" : ""}”`;
}

export const pad2 = (n: number) => String(n).padStart(2, "0");
