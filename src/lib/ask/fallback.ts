/**
 * Deterministic fallback: answers without a model.
 *
 *   1. Understand: score the brief against synonyms for each content signal; chosen topics come first.
 *   2. Rank: every card that answers an asked capability, across all projects (the capability among
 *      its first two signals, the first weighing most; then word overlap with the brief, then decisions
 *      before problem statements). arrange() spreads them by capability and prints at most six.
 *   3. Be honest: capabilities with no matching work, and common asks the work never mentions
 *      (A/B testing, native mobile, …), are reported as missing.
 * Everything is driven by content/, so a new project or section is matched without code changes.
 */
import { projects, SIGNALS, type Project, type Section, type Signal } from "@content";
import { answered, arrange } from "./arrange";
import { catalogue, findEntry } from "./catalogue";
import { requestedCount } from "./count";
import {
  ASKED_MAX,
  LINE_MAX,
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
  // Not "website": a marketing website is a brand ask, and SEO only when they say so.
  "seo-performance": ["seo!", "performance", "fast", "search engine", "lighthouse", "speed", "web vitals", "metadata", "static", "discoverab"],
  "publishing-workflow": ["cms!", "publish", "content", "template", "workflow", "editor", "admin"],
  "reusable-components": ["reusab", "reuse", "component", "modular", "pattern librar", "building block"],
  "brand-storytelling": ["brand", "marketing", "story", "stories", "storytell", "landing", "campaign", "editorial", "narrative", "consumer", "website", "web site", "web!"],
  conversion: ["conversion", "convert", "growth", "ab test", "a b test", "split test", "experiment", "click", "tap through", "sales", "revenue", "funnel", "engagement"],
  "motion-interaction": ["motion", "animat", "interaction", "micro", "delight", "polish", "detail", "feel", "transition", "craft", "playful", "tactile"],
  typography: ["typograph", "type!", "typeface", "font", "layout", "visual design", "hierarchy", "grid", "colour", "color"],
  "data-architecture": ["api!", "apis", "back end", "backend", "server", "schema", "data contract", "data layer", "data model", "architecture", "full stack", "fullstack", "endpoint", "integration"],
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
  "data-architecture": "data architecture and APIs",
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
  { label: "databases", pattern: /\b(databases?|sql|postgres(ql)?|mysql|mongo(db)?)\b/ },
  { label: "analytics", pattern: /\b(analytics|amplitude|mixpanel)\b/ },
];

/** Names and places in a brief that point at one project. */
const PROJECT_HINTS: Record<string, string[]> = {
  "hhcd-data-platform": ["hhcd", "helen hamlyn", "hamlyn", "royal college", "rca!", "archive", "brunel"],
  "components-for-any-data": ["component library", "components", "own data", "data contracts", "logistics", "current role", "current job", "day job"],
  "nike-athletes-closet": ["nike", "athletes closet", "athlete", "agency", "sportswear", "fashion"],
  "this-site": ["this site", "this website", "this portfolio", "portfolio", "ticket", "printer", "built this", "build this", "made this", "work here"],
  wildecho: ["wildecho", "wild echo", "wildlife", "tourist", "sound", "listening"],
};

/** Strong defaults when nothing in the brief is understood. */
export const DEFAULT_SHEETS: Sheet[] = [
  { project: "hhcd-data-platform", section: "arrangements", signal: "accessibility", reason: "An accessible data map, designed and built end to end." },
  { project: "components-for-any-data", section: "contract", signal: "design-eng-gap", reason: "Closing a gap between design and engineering with data contracts." },
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
/** A card answers a capability strongly when it is the card's first or second signal. */
const STRONG = 2;

function briefWords(brief: string): string[] {
  return [...new Set(normalise(brief).trim().split(" "))].filter((w) => w.length >= 4 && !STOPWORDS.has(w)).map(stem);
}

function overlapOf(project: Project, section: Section, words: string[]): number {
  const entry = findEntry(project.slug, section.id)!;
  let overlap = 0;
  for (const w of words) {
    if (entry.titleText.includes(w)) overlap += 1;
    else if (entry.text.includes(w)) overlap += 0.4;
  }
  return overlap;
}

/** On a tie, a decision or evidence shows more of the work than the problem statement. */
const KIND_RANK: Record<Section["kind"], number> = { decision: 0, evidence: 1, outcome: 2, role: 3, retrospective: 4, problem: 5 };

type Candidate = Sheet & { score: number; overlap: number; kind: number; order: number };

const byStrength = (a: Candidate, b: Candidate) =>
  b.score - a.score || b.overlap - a.overlap || a.kind - b.kind || a.order - b.order;

function truncate(text: string, max: number): string {
  return text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;
}

export function reasonFor(signal: Signal, section: Section): string {
  return truncate(`${SIGNALS[signal]}: ${section.title}.`, REASON_MAX);
}

/**
 * Every card that answers an asked capability, strongest first, across all projects.
 * A card answers a capability when that capability is its first or second signal; a capability with no such card
 * gets its single best tagged card. Each card is ranked for the asked capability it answers best.
 * arrange() then spreads the list by capability and prints at most six.
 */
export function rankCards(asked: Signal[], brief = "", named: Set<string> = new Set()): Sheet[] {
  const words = briefWords(brief);
  const strong: Candidate[] = [];
  const weakest = new Map<Signal, Candidate>();
  let order = 0;

  for (const project of projects) {
    const boost = named.has(project.slug) ? 3 : 0;
    const tier = project.tier === "earlier" && !named.has(project.slug) ? 0.6 : 1;
    for (const section of project.sections) {
      order++;
      const overlap = overlapOf(project, section, words);
      const base = { project: project.slug, section: section.id, overlap, kind: KIND_RANK[section.kind], order };
      let best: { signal: Signal; weight: number } | undefined;
      let others = 0;
      section.signals.forEach((sig, i) => {
        const r = asked.indexOf(sig);
        if (r < 0) return;
        const weight = positionWeight(i) * rankWeight(r);
        if (i < STRONG && (!best || weight > best.weight)) {
          if (best) others++;
          best = { signal: sig, weight };
        } else others++;
        // Remember each capability's best card at any position, in case nothing answers it strongly.
        const prev = weakest.get(sig);
        const cand: Candidate = { ...base, signal: sig, reason: reasonFor(sig, section), score: weight * tier + boost };
        if (!prev || byStrength(cand, prev) < 0) weakest.set(sig, cand);
      });
      if (!best) continue;
      // A card that also shows other asked capabilities is the stronger answer.
      const score = (best.weight + 0.25 * others) * tier + boost;
      strong.push({ ...base, signal: best.signal, reason: reasonFor(best.signal, section), score });
    }
  }

  for (const sig of asked) {
    if (strong.some((c) => c.signal === sig)) continue;
    const weak = weakest.get(sig);
    if (weak && !strong.some((c) => c.project === weak.project && c.section === weak.section)) strong.push({ ...weak, score: weak.score / 2 });
  }

  // A project named in the brief with no matching card still prints its best section.
  for (const slug of named) {
    if (strong.some((c) => c.project === slug)) continue;
    const project = projects.find((p) => p.slug === slug);
    if (!project) continue;
    const pick = project.sections
      .map((section, i) => ({ section, i, s: overlapOf(project, section, words) + (section.kind === "decision" || section.kind === "problem" ? 0.5 : 0) }))
      .reduce((a, b) => (b.s > a.s ? b : a));
    const signal = pick.section.signals[0];
    if (!signal) continue;
    strong.push({
      project: slug,
      section: pick.section.id,
      signal,
      reason: reasonFor(signal, pick.section),
      score: 3,
      overlap: pick.s,
      kind: KIND_RANK[pick.section.kind],
      order: pick.i,
    });
  }

  return strong.sort(byStrength).map(({ project, section, signal, reason }) => ({ project, section, signal, reason }));
}

/** Kept for callers that want the printed deck directly. */
export function pickSheets(asked: Signal[], brief = "", named: Set<string> = new Set()): Sheet[] {
  return arrange(rankCards(asked, brief, named), asked, requestedCount(brief));
}

const NUMBER_WORD = ["No", "One", "Two", "Three", "Four", "Five", "Six"];
const word = (n: number) => NUMBER_WORD[n] ?? String(n);

/**
 * One plain sentence about what was printed.
 *  - "Three cards show accessibility."   - "Four cards from two projects show design systems."
 *  - "Four cards from three projects match your brief."   - "No project shows Kotlin; here are three places to start."
 */
export function lineFor(asked: Signal[], sheets: Sheet[], missing: string[], startHere = false): string {
  const n = sheets.length;
  const p = new Set(sheets.map((s) => s.project)).size;
  let line: string;
  if (startHere) {
    const where = `${word(n).toLowerCase()} ${n === 1 ? "place" : "places"} to start`;
    line = missing.length ? `No project shows ${missing[0]}; here are ${where}.` : `Here are ${where}.`;
  } else {
    const cards = `${word(n)} ${n === 1 ? "card" : "cards"}${p > 1 ? ` from ${word(p).toLowerCase()} projects` : ""}`;
    const one = asked.length === 1 && sheets.every((s) => s.signal === asked[0]);
    line = one ? `${cards} ${n === 1 ? "shows" : "show"} ${LINE_LABEL[asked[0]!]}.` : `${cards} ${n === 1 ? "matches" : "match"} your brief.`;
  }
  return truncate(line, LINE_MAX);
}

/** Words that name people or organisations, never a skill: such labels are not "missing work". */
const NOT_A_SKILL = /\b(employers?|company|companies|customers?|clients?|salary|salaries|contact|address|prompt|instructions?|projects?)\b/;
/** Project names, shown or hidden (hidden ones aren't in `projects`, so they are listed here too). */
const NAMES = [...projects.flatMap((p) => [p.slug.replace(/-/g, " "), p.title]), "wildecho", "wild echo", "this site", "this website", "this portfolio", "hhcd", "helen hamlyn", "voice", "nike"]
  .map((t) => normalise(t).trim())
  .filter((t) => t.length >= 3);
const STACK = new Set(projects.flatMap((p) => p.stack.flatMap((s) => normalise(s).trim().split(" "))).filter((w) => w.length >= 2));

/**
 * The model's "missing" labels, checked before they are printed as "No work to show yet for …":
 *  - a common ask the content never mentions (A/B testing, Kotlin, databases) is kept;
 *  - a label naming a project (shown or hidden), a person or an organisation is dropped;
 *  - a label for a tool in a project's stack, or a capability some card shows, is dropped: the work shows it.
 * The fallback's own missing asks for the brief are added, so both paths say the same.
 */
export function verifyMissing(labels: string[], brief: string, asked: Signal[] = []): string[] {
  const out: string[] = [];
  for (const label of labels) {
    const q = normalise(label);
    const common = MISSING_ASKS.find((m) => m.pattern.test(q));
    if (common) {
      if (!common.pattern.test(CONTENT_TEXT)) out.push(common.label);
      continue;
    }
    if (NOT_A_SKILL.test(q) || NAMES.some((n) => q.includes(` ${n} `))) continue;
    if (q.trim().split(" ").some((w) => STACK.has(w))) continue;
    const hits = Object.keys(signalHits(label)) as Signal[];
    if (hits.some((s) => SHOWN.has(s))) continue;
    // "SEO", "SEO and performance optimisation": one capability, said one way.
    out.push(hits.length ? SIGNALS[hits[0]!] : label);
  }
  const unshown = asked.filter((s) => !SHOWN.has(s)).map((s) => SIGNALS[s]);
  const seen = new Set<string>();
  return [...detectMissing(brief), ...unshown, ...out]
    .filter((l) => !seen.has(l.toLowerCase()) && seen.add(l.toLowerCase()))
    .slice(0, MISSING_MAX);
}

/** Nothing asked for is shown: the strong defaults, said honestly. */
export function startHereAnswer(missing: string[], source: AskResponse["source"]): AskResponse {
  const asked = [...new Set(DEFAULT_SHEETS.map((s) => s.signal))];
  return withLegacy({ asked, sheets: DEFAULT_SHEETS, missing, line: lineFor(asked, DEFAULT_SHEETS, missing, true), source }, { startHere: true });
}

export function fallbackAnswer(input: string | Partial<AskRequest>): AskResponse {
  const { brief = "", topics = [] } = typeof input === "string" ? { brief: input } : input;
  const { asked, missing, named } = understand(brief, topics);
  const sheets = pickSheets(asked, brief, named);
  if (!sheets.length) return startHereAnswer(missing, "fallback");

  // A named project with no matching capability still printed a sheet; name what it shows.
  const shownAsked = answered(asked, sheets);
  const askedOut = shownAsked.length ? shownAsked : [...new Set(sheets.map((s) => s.signal))].slice(0, ASKED_MAX);
  return withLegacy({ asked: askedOut, sheets, missing, line: lineFor(askedOut, sheets, missing), source: "fallback" });
}
