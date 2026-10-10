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
};

/** One printed sheet: a project's best matching section. Used by the home deck and the /ask list. */
export function Sheet({ card, index, total, media, current = true, headingId, as: H = "h3" }: Props) {
  return (
    <>
      <div className="s-top">
        <span className="s-proj">{card.projectTitle}</span>
        <span>
          {pad2(index + 1)} / {pad2(total)}
        </span>
      </div>
      <H id={headingId} className="sheet-title">
        {card.title}
      </H>
      {card.body.map((p) => (
        <p key={p.slice(0, 40)}>{p}</p>
      ))}
      {media && <div className="s-media">{media}</div>}
      <div className="s-foot">
        <ul className="tags" aria-label="Shows">
          {card.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <Link className="full" href={card.href} tabIndex={current ? 0 : -1}>
          Full project<span className="sr-only">: {card.projectTitle}</span>
          <span aria-hidden="true">&nbsp;→</span>
        </Link>
      </div>
    </>
  );
}
