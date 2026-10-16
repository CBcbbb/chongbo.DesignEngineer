import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { AskAnalytics } from "@/components/AskAnalytics";
import { printedCards } from "@/components/PrintedCard";
import { Sheet } from "@/components/Sheet";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { HomeLink } from "@/components/nav/HomeLink";
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
import { projects, type Signal } from "@content";
import { buildCardIndex, cardKey, type SheetCard } from "@/lib/cards";
import { BROWSE_ALL, missingLine, notUnderstoodLine, projectRuns, provenanceLine, quoteBrief, resultTitle, topicsToLabels } from "@/lib/printed";

export const metadata: Metadata = {
  title: "Your answer",
  description: "Projects printed to order from Chongbo Ning's portfolio.",
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

  let result: AskResponse | null = null;
  let error: string | null = null;
  if (parsed.success) {
    const limit = await askLimiter.limit(clientKey(await headers()));
    if (limit.ok) result = await answerAsk(parsed.data);
    else error = RATE_LIMIT_MESSAGE;
  }

  const index = buildCardIndex();
  const sheets = (result?.sheets ?? [])
    .map((s) => index[cardKey(s.project, s.section)])
    .filter((c): c is SheetCard => Boolean(c));
  // only the cards this answer prints
  const printed = printedCards(projects, new Set(sheets.map((c) => cardKey(c.project, c.section))));
  const runs = projectRuns(sheets);
  const picked = !brief.trim() ? topicsToLabels(topics) : [];
  const title = result ? resultTitle({ asked: result.asked, startHere: result.matched === "start-here", picked }) : (error ?? "What are you looking for?");

  return (
    <div className="wrap">
      <SiteHeader />
      <main id="main" tabIndex={-1} className="pb-10">
        <p className="eyebrow">Printed to order</p>
        {result ? (
          <section className="results" aria-labelledby="r-title">
            <AskAnalytics cards={sheets.map((c) => cardKey(c.project, c.section))} asked={result.asked} source={result.source} brief={brief} topics={topics} startHere={result.matched === "start-here"} />
            <div className="rhead">
              <div>
                <h1 id="r-title">{title}</h1>
                {result.matched === "start-here" && brief.trim() ? (
                  <p className="not-found">{notUnderstoodLine(brief)}</p>
                ) : (
                  brief.trim() && <p>{quoteBrief(brief)}</p>
                )}
                <p className="provenance">
                  {provenanceLine(result.source, sheets.length)}
                  {result.source === "model" && sheets.length > 0 && (
                    <>
                      {" "}
                      <Link href="/work">{BROWSE_ALL}</Link>
                    </>
                  )}
                </p>
              </div>
            </div>
            <h2 id="sheets-title" className="sr-only">
              Printed sheets
            </h2>
            <ol className="sheet-list" aria-labelledby="sheets-title">
              {sheets.map((c, i) => {
                const pc = printed[cardKey(c.project, c.section)];
                return (
                  <li key={cardKey(c.project, c.section)} className="sheet" data-sheet={cardKey(c.project, c.section)}>
                    <article className="s-paper" aria-labelledby={pc?.headingId ?? `sh-${i}`}>
                      <Sheet card={c} index={i} total={sheets.length} headingId={`sh-${i}`} as="h2" run={runs[i]} printed={pc?.node} />
                    </article>
                  </li>
                );
              })}
            </ol>
            {result.missing.length > 0 && <p className="missing">{missingLine(result.missing)}</p>}
            <div className="again">
              <HomeLink>New request</HomeLink>
            </div>
          </section>
        ) : (
          <>
            <h1 className="home-h1">{title}</h1>
            <form className="ask-form" action="/ask" method="get">
              <label htmlFor="brief" className="sr-only">
                Describe the role or paste a job description.
              </label>
              <textarea id="brief" name="brief" maxLength={BRIEF_MAX} defaultValue={brief} required />
              <button type="submit">Print</button>
            </form>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
