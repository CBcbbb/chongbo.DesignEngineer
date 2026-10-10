/**
 * Deterministic fallback: answers without a model.
 *
 * Scores every section card against the question using
 *   1. synonyms for each content signal (weighted by the signal's position on the card),
 *   2. project names and places mentioned in the question,
 *   3. plain word overlap with the card's title and body.
 * Everything is driven by content/, so a new project is matched without code changes.
 */
import { SIGNALS, type Signal } from "@content";
import { catalogue, type CatalogueEntry } from "./catalogue";
import { MAX_PICKS, REASON_MAX, type AskResponse, type Matched, type Pick } from "./schema";

/**
 * Synonyms per signal. A term matches at the start of a word ("access" matches "accessible").
 * A trailing "!" means whole word only ("ai!" does not match "aim").
 */
export const KEYS: Record<Signal, string[]> = {
  accessibility: ["access", "a11y", "wcag", "screen reader", "screenreader", "keyboard", "inclusiv", "contrast", "disab", "assistive", "aria!", "blind", "low vision", "colour blind", "color blind"],
  "design-systems": ["design system", "token", "component librar", "figma", "consisten", "style guide", "styleguide", "theming", "theme", "variables"],
  "cross-platform": ["platform", "multiple product", "product line", "several product", "many product", "scale", "scaling", "cross platform", "multi brand", "ios!", "android", "web and mobile"],
  "design-eng-gap": ["engineer", "handoff", "hand off", "developer", "dev!", "devs!", "front end", "frontend", "code", "coding", "bridge", "gap", "react", "typescript", "implement", "between design"],
  "end-to-end": ["end to end", "ship", "from scratch", "solo", "alone", "own!", "ownership", "deliver", "launch", "built", "build", "zero to one", "idea to", "whole thing", "full stack", "fullstack"],
  "seo-performance": ["seo!", "performance", "fast", "search engine", "lighthouse", "speed", "web vitals", "metadata", "static", "discoverab"],
  "publishing-workflow": ["cms!", "publish", "content", "template", "workflow", "editor", "admin"],
  "reusable-components": ["reusab", "reuse", "component", "modular", "pattern librar", "building block"],
  "brand-storytelling": ["brand", "marketing", "story", "stories", "storytell", "landing", "campaign", "editorial", "narrative", "consumer", "website", "web site", "web!"],
  conversion: ["conversion", "convert", "growth", "ab test", "a b test", "split test", "experiment", "click", "tap through", "sales", "revenue", "funnel", "engagement"],
  "motion-interaction": ["motion", "animat", "interaction", "micro", "delight", "polish", "detail", "feel", "transition", "craft", "playful", "tactile"],
  typography: ["typograph", "type!", "typeface", "font", "layout", "visual design", "hierarchy", "grid", "colour", "color"],
  data: ["data", "visualis", "visualiz", "chart", "graph", "dashboard", "d3!", "network", "table", "spreadsheet", "messy"],
  prototyping: ["prototyp", "explor", "invent", "new interaction", "test idea", "early", "concept", "sketch", "iterat"],
  "ai-tools": ["ai!", "llm", "claude", "gpt", "chatgpt", "model", "cursor", "agent", "copilot", "machine learning", "artificial intelligence", "vibe"],
  research: ["research", "user!", "users", "usability", "testing", "interview", "insight", "observ", "student", "people", "empath"],
  judgement: ["decision", "trade off", "tradeoff", "why!", "approach", "think", "judgement", "judgment", "process", "prioriti", "choose", "choice", "opinion", "hard part"],
};

/** First-person replies per matched signal. Each is one factual sentence, at most 160 characters. */
export const REPLY: Record<Matched, string> = {
  accessibility: "Accessibility shaped this from the first sketch, not the last sprint.",
  "design-systems": "I run a design system that ships as a code package across five product lines.",
  "cross-platform": "One shared token layer keeps five product lines consistent; each app retunes only what it needs.",
  "design-eng-gap": "This is the problem I like most: the space between the design and the code.",
  "end-to-end": "I take work from the first question to the shipped thing, often on my own.",
  "seo-performance": "Every page is static HTML with real metadata, so it can be found and shared.",
  "publishing-workflow": "Content is written once and shown in more than one way.",
  "reusable-components": "I build components once so the next story, season or customer needs no redesign.",
  "brand-storytelling": "Brand work that had to earn a tap, shipped in the Nike app.",
  conversion: "The stories were working; the products weren't. This closed the gap.",
  "motion-interaction": "I use motion only where it pays off.",
  typography: "Hierarchy first, decoration never.",
  data: "My data work starts with the model, long before the chart.",
  prototyping: "I prototype in whatever is fastest: Figma, code or AI tools.",
  "ai-tools": "I build with AI coding tools daily, and this site uses a model to choose its answers.",
  research: "Here's a decision I changed after watching real people use the thing.",
  judgement: "Here's a trade-off I made, and why.",
  "start-here": "Good question. Here's where I'd start: three pieces that show how I work.",
};

/** Names and places in a question that point at one project. */
const PROJECT_HINTS: Record<string, string[]> = {
  "hhcd-data-platform": ["hhcd", "helen hamlyn", "hamlyn", "royal college", "rca!", "archive", "brunel"],
  "component-store": ["component store", "logistics", "current role", "current job", "day job"],
  "nike-athletes-closet": ["nike", "athletes closet", "athlete", "agency", "sportswear", "fashion"],
  "this-site": ["this site", "this website", "this portfolio", "portfolio", "ticket", "printer", "built this", "build this", "made this", "work here"],
  wildecho: ["wildecho", "wild echo", "wildlife", "tourist", "sound", "listening"],
};

/** Strong defaults when nothing matches. */
export const DEFAULT_PICKS: Pick[] = [
  { project: "hhcd-data-platform", section: "dual-view", reason: "Accessibility and data, designed and built end to end." },
  { project: "component-store", section: "contracts", reason: "Closing a gap between design and engineering with data contracts." },
  { project: "nike-athletes-closet", section: "system", reason: "A reusable layout system that shipped in the Nike app." },
];

const STOPWORDS = new Set(
  "about above after again also always an and any are around because been before being between both but can could did does doing done each even ever every from have having here how into its just like made make many more most much must need only other our ours over really same should show some such tell than that the their them then there these they thing things this those through very want was way well were what when where which while who whom why will with work would you your yours me my mine us we".split(" "),
);

export function normalise(text: string): string {
  return ` ${text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()} `;
}

function termRegex(term: string): RegExp {
  const whole = term.endsWith("!");
  const body = normalise(whole ? term.slice(0, -1) : term).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${body}${whole ? "\\b" : ""}`, "g");
}

const KEY_REGEX = Object.fromEntries(
  (Object.keys(KEYS) as Signal[]).map((sig) => [sig, KEYS[sig].map(termRegex)]),
) as Record<Signal, RegExp[]>;
const HINT_REGEX = Object.fromEntries(
  Object.entries(PROJECT_HINTS).map(([slug, terms]) => [slug, terms.map(termRegex)]),
) as Record<string, RegExp[]>;

function count(text: string, patterns: RegExp[]): number {
  let n = 0;
  for (const re of patterns) {
    re.lastIndex = 0;
    const m = text.match(re);
    if (m) n += m.length;
  }
  return n;
}

function stem(word: string): string {
  return word.replace(/(ing|ed|es|s)$/, "");
}

export function signalHits(question: string): Partial<Record<Signal, number>> {
  const q = normalise(question);
  const hits: Partial<Record<Signal, number>> = {};
  for (const sig of Object.keys(KEY_REGEX) as Signal[]) {
    const n = count(q, KEY_REGEX[sig]);
    if (n) hits[sig] = n;
  }
  return hits;
}

export type Scored = { entry: CatalogueEntry; score: number; order: number };

export function scoreSections(question: string): Scored[] {
  const q = normalise(question);
  const hits = signalHits(question);
  const projectBoost: Record<string, number> = {};
  for (const [slug, res] of Object.entries(HINT_REGEX)) {
    const n = count(q, res);
    if (n) projectBoost[slug] = n;
  }
  const words = [...new Set(q.trim().split(" "))].filter((w) => w.length >= 4 && !STOPWORDS.has(w)).map(stem);

  return catalogue.map((entry, order) => {
    let score = 0;
    entry.section.signals.forEach((sig, i) => {
      const h = hits[sig];
      if (h) score += h * (i === 0 ? 3 : 1.5);
    });
    const boost = projectBoost[entry.project.slug];
    if (boost) score += 2.5 * boost + (entry.section.kind === "problem" || entry.section.kind === "decision" ? 0.5 : 0);
    for (const w of words) {
      if (w.length < 4) continue;
      if (entry.titleText.includes(w)) score += 1;
      else if (entry.text.includes(w)) score += 0.4;
    }
    // Earlier work only wins when it is clearly the better answer.
    if (entry.project.tier === "earlier" && !boost) score *= 0.6;
    return { entry, score, order };
  });
}

function truncate(text: string, max: number): string {
  return text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;
}

function reasonFor(entry: CatalogueEntry, hits: Partial<Record<Signal, number>>): string {
  const sig = entry.section.signals.find((s) => hits[s]) ?? entry.section.signals[0];
  const label = sig ? SIGNALS[sig] : "How I work";
  return truncate(`${label}, from ${entry.project.title}.`, REASON_MAX);
}

export function fallbackAnswer(question: string): AskResponse {
  const hits = signalHits(question);
  const scored = scoreSections(question)
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || a.order - b.order);

  if (!scored.length) {
    return { reply: REPLY["start-here"], picks: DEFAULT_PICKS, matched: "start-here", source: "fallback" };
  }

  // Greedy pick with a gentle penalty for repeating a project, so answers show range.
  const picks: Scored[] = [];
  const pool = [...scored];
  const top = scored[0]!.score;
  while (picks.length < MAX_PICKS && pool.length) {
    let bestIdx = 0;
    let best = -Infinity;
    pool.forEach((s, i) => {
      const repeats = picks.filter((p) => p.entry.project.slug === s.entry.project.slug).length;
      const adjusted = s.score * Math.pow(0.8, repeats);
      if (adjusted > best) {
        best = adjusted;
        bestIdx = i;
      }
    });
    const [chosen] = pool.splice(bestIdx, 1);
    if (!chosen) break;
    if (picks.length && chosen.score < top * 0.3) break;
    picks.push(chosen);
  }

  const first = picks[0]!.entry;
  const ranked = (Object.entries(hits) as [Signal, number][]).sort((a, b) => b[1] - a[1]).map(([s]) => s);
  const matched: Matched = ranked.find((s) => first.section.signals.includes(s)) ?? first.section.signals[0] ?? "start-here";

  return {
    reply: REPLY[matched],
    picks: picks.map((p) => ({ project: p.entry.project.slug, section: p.entry.section.id, reason: reasonFor(p.entry, hits) })),
    matched,
    source: "fallback",
  };
}
