/**
 * Printed to order: the eight skills cards and the wording around a print.
 * Shared by the home page client, the /ask page and the unit tests, so it stays free of server-only code.
 */
import type { Signal } from "@content/schema";

export type Topic = { id: string; label: string; signals: Signal[] };

/** A printed card's identifier, usable by the client without importing the project catalogue. */
export const cardKey = (project: string, section: string) => `${project}#${section}`;

/**
 * The skills cards, in order. Each maps to the content signals it stands for, the first weighing most. A card lists
 * only signals some shown project carries: a print made from cards alone never says something is missing
 * (tests/unit/printed.test.ts checks every card, alone and together).
 */
export const TOPICS: Topic[] = [
  { id: "a11y", label: "Accessibility", signals: ["accessibility"] },
  { id: "systems", label: "Design systems", signals: ["design-systems", "cross-platform"] },
  // No seo-performance: no shown project carries it, so the card printed "No work to show yet for SEO and performance".
  { id: "front", label: "Front‑end", signals: ["design-eng-gap", "reusable-components"] },
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

/**
 * The skills cards a list of signal keys came from (the no-JavaScript page, shared links), in card order. A card counts
 * when its lead signal is there, so `?topics=accessibility,design-systems` reads "Accessibility · Design systems"
 * without also naming the card's supporting signals.
 */
export function topicsToLabels(signals: readonly string[]): string[] {
  return TOPICS.filter((t) => signals.includes(t.signals[0]!)).map((t) => t.label);
}

/** Under the results title: who chose the sheets. When the AI chose them, the line says it may miss something and
 * is followed by a link to all the work (BROWSE_ALL). */
export function provenanceLine(source: "model" | "fallback", count: number): string {
  if (!count) return "";
  return source === "model" ? "Picked by AI from my case files, so it may miss something." : "Picked from my case files.";
}

/** The link after the AI's provenance line, to /work. */
export const BROWSE_ALL = "Browse all my work.";

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

/**
 * When a request names no role and no skill (a name, "hello", random letters), the printer still prints where to start,
 * and says why. A brief of one to three capitalised words reads as a name, so the reply says hello instead.
 * The brief is only echoed back here: never stored, never sent to analytics.
 */
export function notUnderstoodLine(brief: string): string {
  const b = brief.trim().replace(/\s+/g, " ");
  if (!b) return "";
  const name = /^[A-Z][a-z'’-]+(?: [A-Z][a-z'’-]+){0,2}$/.test(b) ? b.split(" ")[0] : "";
  const first = name ? `Nice to meet you, ${name}.` : `I couldn’t find a role or a skill in “${b.length > 60 ? `${b.slice(0, 60).trimEnd()}…` : b}”.`;
  return `${first} Here are three places to start. For a closer match, pick a skill above or describe the role, for example “design systems for a fintech app”.`;
}

/** After a failed print: the way out (the links are added where it is shown). */
export const JAM_LINE = { before: "Something jammed. Try again in a moment, ", all: "browse all work", or: ", or ", email: "email me", after: "." };
