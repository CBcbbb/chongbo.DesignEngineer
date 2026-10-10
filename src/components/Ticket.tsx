import Link from "next/link";
import type { ReactNode } from "react";
import { cardKey, type CardIndex } from "@/lib/cards";
import type { AskResponse } from "@/lib/ask/schema";
import { askHref, caseHref, SIGNAL_SHORT } from "@/lib/site";

type Shell = { id?: string; className?: string; labelledBy: string; children: ReactNode };

function TicketShell({ id, className = "", labelledBy, children }: Shell) {
  return (
    <article id={id} className={`ticket torn ${className}`} aria-labelledby={labelledBy} tabIndex={-1}>
      {children}
    </article>
  );
}

export type AskLinkProps = { q: string; className?: string; children: ReactNode };
/** Rendered as a plain link to /ask so it works without JavaScript; the machine intercepts clicks. */
export function AskLink({ q, className, children }: AskLinkProps) {
  return (
    <a href={askHref(q)} data-q={q} className={className}>
      {children}
    </a>
  );
}

export function WelcomeTicket({ tries }: { tries: { label: string; q: string; project: string }[] }) {
  return (
    <TicketShell id="ticket" labelledBy="welcome-title">
      <div className="t-head">
        <span>No. 000</span>
        <span>Welcome</span>
      </div>
      <p className="t-num" aria-hidden="true">
        Hi.
      </p>
      <p className="t-reply" id="welcome-title">
        I&rsquo;m Chongbo, a design engineer in London. Tell me what your team cares about and I&rsquo;ll print the
        work that answers it.
      </p>
      <hr className="t-rule" />
      <div className="t-label">Try asking</div>
      <ul className="t-also">
        {tries.map((t) => (
          <li key={t.q}>
            <AskLink q={t.q}>
              {t.label} <span>{t.project}</span>
            </AskLink>
          </li>
        ))}
      </ul>
    </TicketShell>
  );
}

export function BlankTicket() {
  return <div className="ticket torn ticket-blank" aria-hidden="true" />;
}

type AnswerProps = {
  result: AskResponse;
  question: string;
  cards: CardIndex;
  number: number;
  time?: string;
  id?: string;
  headingId?: string;
};

export function AnswerTicket({ result, question, cards, number, time, id = "ticket", headingId = "ans-title" }: AnswerProps) {
  const [first, ...rest] = result.picks.map((p) => cards[cardKey(p.project, p.section)]).filter((c) => c !== undefined);
  if (!first) return null;
  const no = `No. ${String(number).padStart(3, "0")}${time ? ` · ${time}` : ""}`;
  return (
    <TicketShell id={id} labelledBy={headingId}>
      <div className="t-head">
        <span>{no}</span>
        <span className="stamp">Matched · {SIGNAL_SHORT[result.matched]}</span>
      </div>
      <p className="t-num">
        {first.number}
        <small>{first.projectTitle}</small>
      </p>
      <p className="t-reply">{result.reply}</p>
      <hr className="t-rule" />
      <div className="t-label">From the case file</div>
      <h2 className="t-title" id={headingId}>
        {first.title}
      </h2>
      <p className="t-body">{first.body}</p>
      <ul className="tags" aria-label="Topics">
        {first.tags.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <div className="t-cta">
        <Link className="t-link" href={caseHref(first.project, first.section)}>
          Open the case file<span className="sr-only">: {first.projectTitle}</span>
        </Link>
        <span className="t-label" aria-hidden="true">
          {first.project}/{first.section}
        </span>
      </div>
      {rest.length > 0 && (
        <>
          <hr className="t-rule" />
          <div className="t-label">Also answers this</div>
          <ul className="t-also">
            {rest.map((c) => (
              <li key={`${c.project}${c.section}`}>
                <Link href={caseHref(c.project, c.section)}>
                  {c.title} <span>{c.projectTitle}</span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
      <hr className="t-rule" />
      <div className="t-label">You asked</div>
      <p className="t-body t-asked">{question}</p>
    </TicketShell>
  );
}

export function ErrorTicket({ message, question, id = "ticket" }: { message: string; question?: string; id?: string }) {
  return (
    <TicketShell id={id} labelledBy="err-title" className="ticket-error">
      <div className="t-head">
        <span>No. ———</span>
        <span className="stamp">Paused</span>
      </div>
      <p className="t-num" aria-hidden="true">
        Hold on.
      </p>
      <h2 className="t-reply" id="err-title">
        {message}
      </h2>
      <div className="t-cta">
        <Link className="t-link" href="/#tray">
          Browse the tray
        </Link>
        {question && (
          <a className="t-link" href={askHref(question)}>
            Try this question again
          </a>
        )}
      </div>
    </TicketShell>
  );
}
