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

export const NUM = ["No", "One", "Two", "Three", "Four", "Five"];
const num = (n: number) => NUM[n] ?? String(n);

/**
 * The results title.
 *  - nothing matched, so the printer chose: "Here are three places to start."
 *  - one card and no words: "Three projects show accessibility."
 *  - anything else: "Four projects match your brief."
 */
export function resultTitle(opts: { count: number; startHere: boolean; topicLabel?: string }): string {
  const { count, startHere, topicLabel } = opts;
  if (startHere) return `Here are ${num(count).toLowerCase()} ${count === 1 ? "place" : "places"} to start.`;
  if (topicLabel) return `${num(count)} ${count === 1 ? "project shows" : "projects show"} ${topicLabel.toLowerCase()}.`;
  return `${num(count)} ${count === 1 ? "project matches" : "projects match"} your brief.`;
}

/** Under the results title: who chose the sheets, so the reader knows the words are mine. */
export function provenanceLine(source: "model" | "fallback", count: number): string {
  if (!count) return "";
  const per = count === 1 ? "" : ", one section per project";
  return source === "model" ? `Chosen by Claude from my case files${per}. The words are mine.` : `Matched by keyword from my case files${per}.`;
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
