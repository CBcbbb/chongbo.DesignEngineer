import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { MediaSlot } from "@/components/media/MediaSlot";
import { Sheet } from "@/components/Sheet";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
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
import { getProject, type Signal } from "@content";
import { buildCardIndex, cardKey, type SheetCard } from "@/lib/cards";
import { missingLine, provenanceLine, quoteBrief, resultTitle } from "@/lib/printed";

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
  const title = result ? resultTitle({ asked: result.asked, startHere: result.matched === "start-here" }) : (error ?? "What skills are you looking for?");

  return (
    <div className="wrap">
      <SiteHeader />
      <main id="main" tabIndex={-1} className="pb-10">
        <p className="eyebrow">Printed to order</p>
        {result ? (
          <section className="results" aria-labelledby="r-title">
            <div className="rhead">
              <div>
                <h1 id="r-title">{title}</h1>
                {brief.trim() && <p>{quoteBrief(brief)}</p>}
              </div>
              <p className="provenance">{provenanceLine(result.source, sheets.length)}</p>
            </div>
            <ol className="sheet-list" aria-label="Printed sheets">
              {sheets.map((c, i) => {
                const section = getProject(c.project)?.sections.find((s) => s.id === c.section);
                return (
                  <li key={c.project} className="sheet">
                    <article aria-labelledby={`sh-${i}`}>
                      <Sheet
                        card={c}
                        index={i}
                        total={sheets.length}
                        headingId={`sh-${i}`}
                        as="h2"
                        media={section?.media ? <MediaSlot media={section.media} compact /> : undefined}
                      />
                    </article>
                  </li>
                );
              })}
            </ol>
            {result.missing.length > 0 && <p className="missing">{missingLine(result.missing)}</p>}
            <div className="again">
              <Link href="/">New request</Link>
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
