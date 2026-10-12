import Link from "next/link";
import type { ReactNode } from "react";
import type { SheetCard } from "@/lib/cards";
import { pad2 } from "@/lib/printed";

type Props = {
  card: SheetCard;
  index: number;
  total: number;
  media?: ReactNode;
  /** Deck only: whether this is the sheet on top. Others are inert to the keyboard and screen readers. */
  current?: boolean;
  headingId: string;
  as?: "h2" | "h3";
  /** This card's place among its project's cards in the print ("2 of 3"), when there are several. */
  run?: { at: number; of: number } | null;
};

/**
 * One printed sheet: a section of a case file, printed as the card it is there. The index above, the claim on the
 * left, the reasoning on the right, the evidence underneath at full width. Used by the home results and the /ask list.
 */
export function Sheet({ card, index, total, media, current = true, headingId, as: H = "h3", run }: Props) {
  return (
    <>
      <div className="s-top">
        <span className="s-proj">
          {card.projectTitle}
          {run && <span className="s-run"> · {run.at} of {run.of}</span>}
        </span>
        <span>
          {pad2(index + 1)} / {pad2(total)}
        </span>
      </div>
      <div className="s-head">
        <H id={headingId} className="sheet-title">
          {card.title}
        </H>
        <div className="s-body">
          {card.body.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </div>
      </div>
      {media && <div className="s-media">{media}</div>}
      <div className="s-foot">
        <span className="s-from">Case file: {card.projectTitle}</span>
        <Link className="full" href={card.href} tabIndex={current ? 0 : -1}>
          Read it in context<span className="sr-only">: {card.projectTitle}, {card.title}</span>
          <span aria-hidden="true">&nbsp;→</span>
        </Link>
      </div>
    </>
  );
}
