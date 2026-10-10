import { projects } from "@content";
import { projectNumber, SIGNAL_SHORT } from "./site";

/** The slice of a section a printed ticket needs. Passed to the client instead of the whole content tree. */
export type TicketCard = {
  project: string;
  projectTitle: string;
  number: string;
  section: string;
  title: string;
  body: string;
  tags: string[];
};

export type CardIndex = Record<string, TicketCard>;

export const cardKey = (project: string, section: string) => `${project}#${section}`;

export function buildCardIndex(): CardIndex {
  const index: CardIndex = {};
  for (const p of projects) {
    for (const s of p.sections) {
      index[cardKey(p.slug, s.id)] = {
        project: p.slug,
        projectTitle: p.title,
        number: projectNumber(p),
        section: s.id,
        title: s.title,
        body: s.body[0] ?? "",
        tags: s.signals.map((sig) => SIGNAL_SHORT[sig]),
      };
    }
  }
  return index;
}
