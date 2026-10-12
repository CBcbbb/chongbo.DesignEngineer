import type { ReactNode } from "react";
import type { Project } from "@content";
import { Card, cardIndexes, caseUrl, paletteOf } from "@/components/casefile/CaseFile";
import { nikeCards } from "@/components/case/nike/NikeCase";
import { cardKey } from "@/lib/cards";

/** A printed card: the case page's own card in its project's shell, and the id of its heading. */
export type PrintedCard = { node: ReactNode; headingId: string };

/** Ids inside a printed card start with this, so cards from several projects can share a page. */
export const printPrefix = (slug: string) => `p-${slug}-`;

/**
 * Every card of every shown project, printed: the same component the case page renders, inside the same project
 * shell (palette, fonts, the sheets' container), so nothing outside the card restyles it. The printed sheet adds
 * only the paper, its top line and its foot (`Sheet`). Projects without a case-file layout print nothing here,
 * and their sheets fall back to the card's words.
 */
export function printedCards(projects: Project[]): Record<string, PrintedCard> {
  const out: Record<string, PrintedCard> = {};
  for (const project of projects) {
    const pre = printPrefix(project.slug);
    if (project.template === "case-file") {
      const idx = cardIndexes(project);
      const url = caseUrl(project);
      for (const s of project.sections) {
        out[cardKey(project.slug, s.id)] = {
          headingId: `${pre}${s.id}-title`,
          node: (
            <div className="cf" data-palette={paletteOf(project)}>
              <div className="cf-sheets">
                <Card section={s} idx={idx[s.id]!} url={url} idPrefix={pre} />
              </div>
            </div>
          ),
        };
      }
    } else if (project.slug === "nike-athletes-closet") {
      const cards = nikeCards(project, pre);
      for (const s of project.sections) {
        if (!cards[s.id]) continue;
        out[cardKey(project.slug, s.id)] = {
          headingId: `${pre}${s.id}-h`,
          node: (
            <div className="nk">
              <div className="nk-sheets">{cards[s.id]}</div>
            </div>
          ),
        };
      }
    }
  }
  return out;
}
