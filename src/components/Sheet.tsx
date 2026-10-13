import Link from "next/link";
import type { ReactNode } from "react";
import type { SheetCard } from "@/lib/cards";
import { pad2 } from "@/lib/printed";
import { DrawnArrow } from "./shell/DrawnArrow";

type Props = {
  card: SheetCard;
  index: number;
  total: number;
  /** The case page's own card, in its project's shell (`printedCards`). */
  printed?: ReactNode;
  /** Used only when a card has no printed form: the id for its title. */
  headingId: string;
  as?: "h2" | "h3";
  /** This card's place among its project's cards in the print ("2 of 3"), when there are several. */
  run?: { at: number; of: number } | null;
};

/**
 * One printed sheet: the paper, a top line (the project, its place in the print), the case-file card itself, and a
 * foot linking to the card in its case file. The sheet never restyles the card: everything inside `.s-card` is the
 * case page's own markup and CSS. Used by the home results and the /ask list.
 */
export function Sheet({ card, index, total, printed, headingId, as: H = "h3", run }: Props) {
  return (
    <>
      <div className="s-top">
        <span className="s-proj">
          {card.projectTitle}
          {run && <span className="s-run"> · {run.at} of {run.of}</span>}
        </span>
        <span className="s-count">
          {pad2(index + 1)} / {pad2(total)}
        </span>
      </div>
      <div className="s-card">
        {printed ?? (
          <div className="s-plain">
            <H id={headingId} className="sheet-title">
              {card.title}
            </H>
            {card.body.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
        )}
      </div>
      <div className="s-foot">
        <span className="s-from">Case file: {card.projectTitle}</span>
        <Link className="full" href={card.href}>
          Read it in context<span className="sr-only">: {card.projectTitle}, {card.title}</span>
          <DrawnArrow kind="still" className="full-ga" />
        </Link>
      </div>
    </>
  );
}
