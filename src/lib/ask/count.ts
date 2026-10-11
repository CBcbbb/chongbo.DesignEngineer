import { MAX_SHEETS } from "./schema";

const WORDS: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5 };

/**
 * How many projects the visitor asked for, if they said ("give me 2 design systems projects", "show me three
 * examples"). A number up to three words before project / example / case study, within the sheet limit.
 */
export function requestedCount(brief: string): number | null {
  const m = brief
    .toLowerCase()
    .match(/\b([1-5]|one|two|three|four|five)\b(?:\W+[a-z-]+){0,3}?\W+(projects?|examples?|case ?stud(?:y|ies)|pieces?|works?)\b/);
  if (!m) return null;
  const n = WORDS[m[1]!] ?? Number(m[1]);
  return n >= 1 && n <= MAX_SHEETS ? n : null;
}
