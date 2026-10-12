import { projects, SIGNALS } from "@content";
import { TOPICS, type Topic } from "./printed";
import { caseHref } from "./site";

/** The slice of a section a printed sheet needs. Passed to the client instead of the whole content tree. */
export type SheetCard = {
  project: string;
  projectTitle: string;
  section: string;
  title: string;
  body: string[];
  /** The section's first two signals, as plain labels. */
  tags: string[];
  href: string;
  hasMedia: boolean;
};

export type CardIndex = Record<string, SheetCard>;

export const cardKey = (project: string, section: string) => `${project}#${section}`;

/** The id of a printed case-file card's own heading, which names its sheet. */
export const printedTitleId = (project: string, section: string) => `print-${project}-${section}-title`;

export function buildCardIndex(): CardIndex {
  const index: CardIndex = {};
  for (const p of projects) {
    for (const s of p.sections) {
      index[cardKey(p.slug, s.id)] = {
        project: p.slug,
        projectTitle: p.title,
        section: s.id,
        title: s.title,
        body: s.body,
        tags: s.signals.slice(0, 2).map((sig) => SIGNALS[sig]),
        href: caseHref(p.slug, s.id),
        hasMedia: Boolean(s.media),
      };
    }
  }
  return index;
}

/** The skills cards some shown project has work for. A card whose only work is in a hidden project isn't offered. */
export function shownTopics(): Topic[] {
  const shown = new Set(projects.flatMap((p) => p.sections.flatMap((s) => s.signals)));
  return TOPICS.filter((t) => t.signals.some((s) => shown.has(s)));
}
