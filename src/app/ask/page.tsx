import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { AnswerTicket, ErrorTicket } from "@/components/Ticket";
import { answerAsk } from "@/lib/ask/answer";
import { askLimiter, clientKey } from "@/lib/ask/rate-limit";
import {
  AskRequestSchema,
  BRIEF_MAX,
  RATE_LIMIT_MESSAGE,
  SIGNAL_KEYS,
  TOPICS_MAX,
  type AskResponse,
} from "@/lib/ask/schema";
import { SIGNALS, getProject, type Signal } from "@content";
import { buildCardIndex } from "@/lib/cards";
import { caseHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "Your answer",
  description: "A printed answer from Chongbo Ning's portfolio.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/ask" },
};

type Param = string | string[] | undefined;
type Props = { searchParams: Promise<{ q?: Param; brief?: Param; topics?: Param }> };

const first = (p: Param) => (Array.isArray(p) ? p[0] : p);

/** `?topics=accessibility,data`: known signal keys only, unknown ones ignored. */
function parseTopics(raw: Param): Signal[] {
  const keys = (first(raw) ?? "").split(",").map((t) => t.trim());
  return [...new Set(keys.filter((k): k is Signal => (SIGNAL_KEYS as string[]).includes(k)))].slice(0, TOPICS_MAX);
}

export default async function AskPage({ searchParams }: Props) {
  const params = await searchParams;
  // `?brief=` is the new name; `?q=` keeps old links and the home page's no-JavaScript form working.
  const brief = (first(params.brief) ?? first(params.q) ?? "").slice(0, BRIEF_MAX);
  const topics = parseTopics(params.topics);
  const parsed = AskRequestSchema.safeParse({ brief, topics });
  const asked = parsed.success ? parsed.data.brief || parsed.data.topics.map((t) => SIGNALS[t]).join(", ") : "";

  let result: AskResponse | null = null;
  let error: string | null = null;
  if (parsed.success) {
    const limit = await askLimiter.limit(clientKey(await headers()));
    if (limit.ok) result = await answerAsk(parsed.data);
    else error = RATE_LIMIT_MESSAGE;
  }
  const cards = buildCardIndex();
  const time = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" });

  return (
    <div className="wrap">
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <section className="stage" aria-labelledby="ask-title">
          <h1 id="ask-title" className="sr-only">
            {parsed.success ? `Printed for: ${asked}` : "Ask Chongbo for the work you need to see"}
          </h1>
          <div className="machine" data-state="idle">
            <div className="machine-body">
              <div className="plate">
                <span className="plate-label">Ask Chongbo</span>
                <span className="plate-label">
                  <i className="led" aria-hidden="true" />
                  <span>Ready</span>
                </span>
              </div>
              <form className="ask" action="/ask" method="get" role="search" aria-label="Ask about Chongbo's work">
                <label htmlFor="brief" className="sr-only">
                  What do you need to see? A capability, a few topics or a job description.
                </label>
                <input
                  id="brief"
                  name="brief"
                  type="text"
                  required
                  maxLength={BRIEF_MAX}
                  defaultValue={brief}
                  placeholder="What matters most to your team?"
                  autoComplete="off"
                />
                <button className="key" type="submit">
                  <span className="key-text">Print</span>
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    <path d="M8 3v10M3.5 8.5 8 13l4.5-4.5" />
                  </svg>
                </button>
              </form>
              <div className="slot" aria-hidden="true" />
            </div>
            <div className="feet" aria-hidden="true">
              <i />
              <i />
            </div>
          </div>
          <div className="out" data-done="true">
            <div className="feed">
              {result ? (
                // One printed sheet per project for now; the redesigned machine will replace this.
                result.sheets.map((sheet, i) => (
                  <AnswerTicket
                    key={sheet.project}
                    result={{ ...result, picks: [sheet], matched: sheet.signal, reply: i === 0 ? result.line : sheet.reason }}
                    question={asked}
                    cards={cards}
                    number={i + 1}
                    time={time}
                    id={i === 0 ? "ticket" : `ticket-${i + 1}`}
                    headingId={i === 0 ? "ans-title" : `ans-title-${i + 1}`}
                  />
                ))
              ) : error ? (
                <ErrorTicket message={error} />
              ) : (
                <ErrorTicket message="Type a question into the machine and press Print." />
              )}
            </div>
          </div>
          <div className="below">
            {result && (
              <p className="status">
                {result.line} {result.sheets.length} {result.sheets.length === 1 ? "sheet" : "sheets"}.
                {result.missing.length > 0 && <> Not shown in my work: {result.missing.join(", ")}.</>}
              </p>
            )}
            {result && (
              <ul className="status" aria-label="Printed sheets">
                {result.sheets.map((s) => (
                  <li key={s.project}>
                    <Link href={caseHref(s.project, s.section)}>
                      {getProject(s.project)?.title ?? s.project}
                    </Link>
                    : {s.reason}
                  </li>
                ))}
              </ul>
            )}
            <Link className="tear" href="/">
              Tear off and ask again
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
