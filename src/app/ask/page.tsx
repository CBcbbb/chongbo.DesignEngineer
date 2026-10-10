import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { AnswerTicket, ErrorTicket } from "@/components/Ticket";
import { answerQuestion } from "@/lib/ask/answer";
import { askLimiter, clientKey } from "@/lib/ask/rate-limit";
import { AskRequestSchema, QUESTION_MAX, RATE_LIMIT_MESSAGE, type AskResponse } from "@/lib/ask/schema";
import { buildCardIndex } from "@/lib/cards";

export const metadata: Metadata = {
  title: "Your answer",
  description: "A printed answer from Chongbo Ning's portfolio.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/ask" },
};

type Props = { searchParams: Promise<{ q?: string | string[] }> };

export default async function AskPage({ searchParams }: Props) {
  const { q: rawQ } = await searchParams;
  const q = (Array.isArray(rawQ) ? rawQ[0] : rawQ)?.slice(0, QUESTION_MAX) ?? "";
  const parsed = AskRequestSchema.safeParse({ question: q });

  let result: AskResponse | null = null;
  let error: string | null = null;
  if (parsed.success) {
    const limit = await askLimiter.limit(clientKey(await headers()));
    if (limit.ok) result = await answerQuestion(parsed.data.question);
    else error = RATE_LIMIT_MESSAGE;
  }
  const time = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" });

  return (
    <div className="wrap">
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <section className="stage" aria-labelledby="ask-title">
          <h1 id="ask-title" className="sr-only">
            {parsed.success ? `Answer to: ${parsed.data.question}` : "Ask Chongbo a question"}
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
                <label htmlFor="q" className="sr-only">
                  Ask a question about Chongbo&rsquo;s work
                </label>
                <input
                  id="q"
                  name="q"
                  type="text"
                  required
                  maxLength={QUESTION_MAX}
                  defaultValue={q}
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
              {result && parsed.success ? (
                <AnswerTicket result={result} question={parsed.data.question} cards={buildCardIndex()} number={1} time={time} />
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
                {result.reply} {result.picks.length} {result.picks.length === 1 ? "card" : "cards"}.
              </p>
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
