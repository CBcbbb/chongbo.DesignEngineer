/**
 * Deterministic fallback: answers without a model.
 *
 *   1. Understand: score the brief against synonyms for each content signal; chosen topics come first.
 *   2. Print: for every project with a section showing an asked capability, pick that project's
 *      single best section (signal match first, with the first-listed signal weighing most, then
 *      word overlap with the brief, then decisions before problem statements). At most five sheets,
 *      strongest first.
 *   3. Be honest: capabilities with no matching work, and common asks the work never mentions
 *      (A/B testing, native mobile, …), are reported as missing.
 * Everything is driven by content/, so a new project or section is matched without code changes.
 */
import { projects, SIGNALS, type Project, type Section, type Signal } from "@content";
import { catalogue, findEntry } from "./catalogue";
import {
  ASKED_MAX,
  LINE_MAX,
  MAX_SHEETS,
  MISSING_MAX,
  REASON_MAX,
  withLegacy,
  type AskRequest,
  type AskResponse,
  type Sheet,
} from "./schema";

/**
 * Synonyms per signal. A term matches at the start of a word ("access" matches "accessible").
 * A trailing "!" means whole word only ("ai!" does not match "aim").
 */
export const KEYS: Record<Signal, string[]> = {
  accessibility: ["access", "a11y", "wcag", "screen reader", "screenreader", "keyboard", "inclusiv", "contrast", "disab", "assistive", "aria!", "blind", "low vision", "colour blind", "color blind"],
  "design-systems": ["design system", "token", "component librar", "figma", "consisten", "style guide", "styleguide", "theming", "theme", "variables"],
  "cross-platform": ["platform", "multiple product", "product line", "several product", "many product", "scale", "scaling", "cross platform", "multi brand", "ios!", "android", "web and mobile"],
  "design-eng-gap": ["engineer", "handoff", "hand off", "developer", "dev!", "devs!", "front end", "frontend", "code", "coding", "bridge", "gap", "react", "typescript", "tailwind", "css!", "html!", "implement", "between design"],
  "end-to-end": ["end to end", "ship", "from scratch", "solo", "alone", "own!", "ownership", "deliver", "launch", "zero to one", "idea to", "whole thing", "full stack", "fullstack"],
  "seo-performance": ["seo!", "performance", "fast", "search engine", "lighthouse", "speed", "web vitals", "metadata", "static", "discoverab", "website", "web site", "web!"],
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

/** How each capability reads in "Three projects show …". */
export const LINE_LABEL: Record<Signal, string> = {
  "end-to-end": "end-to-end delivery",
  "design-systems": "design systems",
  "cross-platform": "consistency across platforms",
  "design-eng-gap": "design and engineering together",
  accessibility: "accessibility",
  "seo-performance": "SEO and performance",
  "publishing-workflow": "publishing workflows",
  "reusable-components": "reusable components",
  "brand-storytelling": "brand and storytelling",
  conversion: "conversion work",
  "motion-interaction": "motion and interaction",
  typography: "typography and layout",
  data: "data work",
  prototyping: "prototyping",
  "ai-tools": "work with AI tools",
  research: "research and testing",
  judgement: "judgement and trade-offs",
};

/**
 * Common asks the signals don't cover. Reported as missing when the brief mentions one
 * and no section, title or stack in content/ does. Patterns run on normalised text.
 */
export const MISSING_ASKS: { label: string; pattern: RegExp }[] = [
  { label: "A/B testing", pattern: /\b(a b|ab|split|multivariate) test/ },
  { label: "native iOS or Android", pattern: /\b(native (mobile|apps?|ios|android)|ios|android)\b/ },
  { label: "Swift", pattern: /\bswift(ui)?\b/ },
  { label: "Kotlin", pattern: /\b(kotlin|jetpack compose)\b/ },
  { label: "backend and databases", pattern: /\b(back ?end|databases?|sql|postgres(ql)?|mysql|mongo(db)?|server side)\b/ },
  { label: "analytics", pattern: /\b(analytics|amplitude|mixpanel)\b/ },
];

/** Names and places in a brief that point at one project. */
const PROJECT_HINTS: Record<string, string[]> = {
  "hhcd-data-platform": ["hhcd", "helen hamlyn", "hamlyn", "royal college", "rca!", "archive", "brunel"],
  "component-store": ["component store", "logistics", "current role", "current job", "day job"],
  "nike-athletes-closet": ["nike", "athletes closet", "athlete", "agency", "sportswear", "fashion"],
  "this-site": ["this site", "this website", "this portfolio", "portfolio", "ticket", "printer", "built this", "build this", "made this", "work here"],
  wildecho: ["wildecho", "wild echo", "wildlife", "tourist", "sound", "listening"],
};

/** Strong defaults when nothing in the brief is understood. */
export const DEFAULT_SHEETS: Sheet[] = [
  { project: "hhcd-data-platform", section: "arrangements", signal: "accessibility", reason: "An accessible data map, designed and built end to end." },
  { project: "component-store", section: "contracts", signal: "design-eng-gap", reason: "Closing a gap between design and engineering with data contracts." },
  { project: "nike-athletes-closet", section: "graphic-system", signal: "reusable-components", reason: "A reusable layout system that shipped in the Nike app." },
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

const SIGNAL_ORDER = Object.keys(SIGNALS) as Signal[];

export function signalHits(brief: string): Partial<Record<Signal, number>> {
  const q = normalise(brief);
  const hits: Partial<Record<Signal, number>> = {};
  for (const sig of SIGNAL_ORDER) {
    const n = count(q, KEY_REGEX[sig]);
    if (n) hits[sig] = n;
  }
  return hits;
}

/** Signals that at least one section shows. */
const SHOWN = new Set<Signal>(catalogue.flatMap((e) => e.section.signals));

/** Everything content/ says, normalised, for checking whether a missing ask is really missing. */
const CONTENT_TEXT = normalise(
  projects.map((p) => [p.title, p.oneLiner, p.stack.join(" "), ...p.sections.map((s) => `${s.title} ${s.body.join(" ")}`)].join(" ")).join(" "),
);

export function detectMissing(brief: string): string[] {
  const q = normalise(brief);
  return MISSING_ASKS.filter((m) => m.pattern.test(q) && !m.pattern.test(CONTENT_TEXT)).map((m) => m.label);
}

export type Understood = {
  /** Capabilities asked for that the work shows, most important first. */
  asked: Signal[];
  /** Plain labels of asks the work doesn't show. */
  missing: string[];
  /** Projects named in the brief. */
  named: Set<string>;
};

/** Turn a brief and chosen topics into the capabilities asked for. */
export function understand(brief: string, topics: Signal[] = []): Understood {
  const hits = signalHits(brief);
  const ranked = (Object.entries(hits) as [Signal, number][]).sort(
    (a, b) => b[1] - a[1] || SIGNAL_ORDER.indexOf(a[0]) - SIGNAL_ORDER.indexOf(b[0]),
  );
  // In a long brief, a stray single mention shouldn't count as an ask.
  const floor = Math.max(1, (ranked[0]?.[1] ?? 0) * 0.25);
  const fromBrief = ranked.filter(([, n]) => n >= floor).map(([s]) => s);
  const wanted = [...new Set([...topics, ...fromBrief])];

  const asked = wanted.filter((s) => SHOWN.has(s)).slice(0, ASKED_MAX);
  const missing = [...wanted.filter((s) => !SHOWN.has(s)).map((s) => SIGNALS[s]), ...detectMissing(brief)].slice(0, MISSING_MAX);

  const q = normalise(brief);
  const named = new Set(Object.entries(HINT_REGEX).filter(([, res]) => count(q, res) > 0).map(([slug]) => slug));
  return { asked, missing, named };
}

const POSITION_WEIGHT = [3, 2, 1.5, 1];
const positionWeight = (i: number) => POSITION_WEIGHT[Math.min(i, POSITION_WEIGHT.length - 1)]!;
/** The first capability asked for matters most. */
const rankWeight = (r: number) => 1 / (1 + 0.25 * r);

type Candidate = { section: Section; order: number; signalScore: number; overlap: number; signal: Signal | undefined };

function briefWords(brief: string): string[] {
  return [...new Set(normalise(brief).trim().split(" "))].filter((w) => w.length >= 4 && !STOPWORDS.has(w)).map(stem);
}

function scoreSection(project: Project, section: Section, order: number, asked: Signal[], words: string[]): Candidate {
  let signalScore = 0;
  let signal: Signal | undefined;
  let bestContribution = 0;
  section.signals.forEach((sig, i) => {
    const r = asked.indexOf(sig);
    if (r < 0) return;
    const contribution = positionWeight(i) * rankWeight(r);
    signalScore += contribution;
    if (contribution > bestContribution) {
      bestContribution = contribution;
      signal = sig;
    }
  });
  const entry = findEntry(project.slug, section.id)!;
  let overlap = 0;
  for (const w of words) {
    if (entry.titleText.includes(w)) overlap += 1;
    else if (entry.text.includes(w)) overlap += 0.4;
  }
  return { section, order, signalScore, overlap, signal };
}

/** On a tie, a decision or evidence shows more of the work than the problem statement. */
const KIND_RANK: Record<Section["kind"], number> = { decision: 0, evidence: 1, outcome: 2, role: 3, retrospective: 4, problem: 5 };

const better = (a: Candidate, b: Candidate) => {
  if (a.signalScore !== b.signalScore) return a.signalScore > b.signalScore;
  if (a.overlap !== b.overlap) return a.overlap > b.overlap;
  const ka = KIND_RANK[a.section.kind];
  const kb = KIND_RANK[b.section.kind];
  return ka !== kb ? ka < kb : a.order < b.order;
};

function truncate(text: string, max: number): string {
  return text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;
}

export function reasonFor(signal: Signal, section: Section): string {
  return truncate(`${SIGNALS[signal]}: ${section.title}.`, REASON_MAX);
}

/** One sheet per project that shows an asked capability, strongest first. */
export function pickSheets(asked: Signal[], brief = "", named: Set<string> = new Set()): Sheet[] {
  const words = briefWords(brief);
  const ranked: { sheet: Sheet; strength: number; overlap: number; order: number }[] = [];

  projects.forEach((project, projectOrder) => {
    const scored = project.sections.map((s, i) => scoreSection(project, s, i, asked, words));
    const matching = scored.filter((c) => c.signalScore > 0);
    const isNamed = named.has(project.slug);
    let best: Candidate | undefined;
    if (matching.length) {
      best = matching.reduce((a, b) => (better(b, a) ? b : a));
    } else if (isNamed) {
      // Named but no capability matched: its best section by overlap, preferring decisions.
      best = scored.reduce((a, b) => {
        const sa = a.overlap + (a.section.kind === "decision" || a.section.kind === "problem" ? 0.5 : 0);
        const sb = b.overlap + (b.section.kind === "decision" || b.section.kind === "problem" ? 0.5 : 0);
        return sb > sa ? b : a;
      });
    }
    if (!best) return;
    const signal = best.signal ?? best.section.signals[0];
    if (!signal) return;

    // A project that shows the capability in several sections is the stronger answer.
    let strength = best.signalScore + 0.25 * Math.max(0, matching.length - 1) + (isNamed ? 3 : 0);
    if (project.tier === "earlier" && !isNamed) strength *= 0.6;
    ranked.push({
      sheet: { project: project.slug, section: best.section.id, signal, reason: reasonFor(signal, best.section) },
      strength,
      overlap: best.overlap,
      order: projectOrder,
    });
  });

  return ranked
    .sort((a, b) => b.strength - a.strength || b.overlap - a.overlap || a.order - b.order)
    .slice(0, MAX_SHEETS)
    .map((r) => r.sheet);
}

const NUMBER_WORD = ["No", "One", "Two", "Three", "Four", "Five"];

/** One plain sentence about what was printed. */
export function lineFor(asked: Signal[], sheets: Sheet[], missing: string[], startHere = false): string {
  const n = sheets.length;
  const num = NUMBER_WORD[n] ?? String(n);
  let line: string;
  if (startHere) {
    const where = `${num.toLowerCase()} ${n === 1 ? "place" : "places"} to start`;
    line = missing.length ? `No project shows ${missing[0]}; here are ${where}.` : `Here are ${where}.`;
  } else if (asked.length === 1 && sheets.every((s) => s.signal === asked[0])) {
    line = `${num} ${n === 1 ? "project shows" : "projects show"} ${LINE_LABEL[asked[0]!]}.`;
  } else {
    line = `${num} ${n === 1 ? "project matches" : "projects match"} your brief.`;
  }
  return truncate(line, LINE_MAX);
}

export function fallbackAnswer(input: string | Partial<AskRequest>): AskResponse {
  const { brief = "", topics = [] } = typeof input === "string" ? { brief: input } : input;
  const { asked, missing, named } = understand(brief, topics);
  const sheets = pickSheets(asked, brief, named);

  if (!sheets.length) {
    const sheetsOut = DEFAULT_SHEETS;
    const askedOut = [...new Set(sheetsOut.map((s) => s.signal))];
    return withLegacy(
      { asked: askedOut, sheets: sheetsOut, missing, line: lineFor(askedOut, sheetsOut, missing, true), source: "fallback" },
      { startHere: true },
    );
  }

  // A named project with no matching capability still printed a sheet; name what it shows.
  const askedOut = asked.length ? asked : [...new Set(sheets.map((s) => s.signal))].slice(0, ASKED_MAX);
  return withLegacy({ asked: askedOut, sheets, missing, line: lineFor(askedOut, sheets, missing), source: "fallback" });
}
