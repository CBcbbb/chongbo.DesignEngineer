import { projects, SIGNALS } from "@content";
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
