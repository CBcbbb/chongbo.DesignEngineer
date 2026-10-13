import { MAX_SHEETS } from "./schema";

const WORDS: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };

/**
 * A number the visitor asked for.
 *  - "projects" ("give me 2 design systems projects", "three case studies"): that many projects, each with every card
 *    of it that answers the ask. They named projects, so two cards from one project would read as one answer short.
 *  - "cards" ("show me three examples", "two pieces of work"): that many cards, wherever they are.
 */
export type RequestedCount = { n: number; unit: "projects" | "cards" };

/**
 * Counts are read in a short ask only. A pasted job description's numbers ("include 2-3 case studies", "lead 2
 * projects at a time") are about the job, not about what to print. Same length as the home page's one-line input.
 */
export const COUNT_BRIEF_MAX = 300;

/** A number up to three words before project / case study / example / piece / card, within the sheet limit. */
export function requestedCount(brief: string): RequestedCount | null {
  if (brief.length > COUNT_BRIEF_MAX) return null;
  const m = brief
    .toLowerCase()
    .match(/\b([1-6]|one|two|three|four|five|six)\b(?:\W+[a-z-]+){0,3}?\W+(projects?|case ?stud(?:y|ies)|examples?|pieces?|works?|cards?)\b/);
  if (!m) return null;
  const n = WORDS[m[1]!] ?? Number(m[1]);
  if (n < 1 || n > MAX_SHEETS) return null;
  return { n, unit: /^(project|case)/.test(m[2]!) ? "projects" : "cards" };
}
