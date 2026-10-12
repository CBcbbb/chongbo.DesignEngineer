"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { SIGNALS } from "@content/schema";
import { AskErrorSchema, AskResponseSchema, BRIEF_MAX, RATE_LIMIT_MESSAGE, type AskResponse } from "@/lib/ask/schema";
import { cardKey, printedTitleId, type CardIndex, type SheetCard } from "@/lib/cards";
import { EXAMPLES, PICKED_HINT, TOPICS, missingLine, pad2, printedCount, projectRuns, provenanceLine, quoteBrief, resultTitle, topicById, topicsToSignals, type Topic } from "@/lib/printed";
import { Pill } from "./nav/Pill";
import { Sheet } from "./Sheet";

type Props = {
  cards: CardIndex;
  /** Server-rendered media for each section (MediaSlot, compact), keyed by cardKey. */
  media: Record<string, ReactNode>;
  /** Whole case-file cards, keyed by cardKey, for the projects that have them. */
  whole?: Record<string, ReactNode>;
  /** id of the page h1, which names the paper form. */
  labelledBy: string;
  /** The skills cards to offer: those some shown project has work for (default: all). */
  topics?: Topic[];
};

type Result = { title: string; asked: string; cards: SheetCard[]; missing: string; provenance: string; error?: boolean };

/** Per step of the paper's checklist. Four steps plus the feed: under two seconds, long enough to read. */
const STEP_MS = 320;
const FEED_MS = 600;

const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, prefersReduced() ? 0 : ms));
const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";
/** The empty paper swaps its example every so often, with a fade rather than a typewriter, so it reads as a hint, not output. */
const EXAMPLE_MS = 3800;

type Outcome = { ok: true; data: AskResponse } | { ok: false; message: string };

async function ask(brief: string, topics: string[]): Promise<Outcome> {
  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brief: brief.slice(0, BRIEF_MAX), topics }),
    });
    const json: unknown = await res.json().catch(() => null);
    if (res.ok) {
      const parsed = AskResponseSchema.safeParse(json);
      if (parsed.success) return { ok: true, data: parsed.data };
      return { ok: false, message: "Something jammed. Try again, or browse all work." };
    }
    if (res.status === 429) return { ok: false, message: RATE_LIMIT_MESSAGE };
    const err = AskErrorSchema.safeParse(json);
    return { ok: false, message: err.success ? err.data.message : "Something jammed. Try again, or browse all work." };
  } catch {
    return { ok: false, message: "The printer is offline. Check your connection and try again." };
  }
}

export function PrintedToOrder({ cards, media, whole = {}, labelledBy, topics = TOPICS }: Props) {
  const [brief, setBrief] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [focused, setFocused] = useState(false);
  const [busy, setBusy] = useState(false);
  const [steps, setSteps] = useState<string[] | null>(null);
  const [stepAt, setStepAt] = useState(-1);
  const [example, setExample] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [cur, setCur] = useState(0);
  const [live, setLive] = useState("");

  const busyRef = useRef(false);
  const introRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const outfeedRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const stripRef = useRef<HTMLOListElement>(null);
  const machineRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);

  // ---------- examples on the paper, one at a time; a still hint once a skill is picked ----------
  const anyPicked = picked.length > 0;
  const ghostText = anyPicked ? PICKED_HINT : EXAMPLES[example % EXAMPLES.length]!;
  useEffect(() => {
    if (anyPicked || focused || brief || prefersReduced()) return;
    const t = setInterval(() => setExample((e) => e + 1), EXAMPLE_MS);
    return () => clearInterval(t);
  }, [anyPicked, focused, brief]);

  // The sheet grows with its chips; the machine moves down to keep clear of the cards above.
  useEffect(() => {
    const paper = paperRef.current;
    const stage = stageRef.current;
    if (!paper || !stage || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => stage.style.setProperty("--pm", `${paper.offsetHeight}px`));
    ro.observe(paper);
    return () => ro.disconnect();
  }, []);

  // ---------- skills cards ----------
  const toggle = (id: string, el?: HTMLElement | null) => {
    if (busyRef.current) return;
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
    // A card picked up gets a small random tilt and settles; the layout never moves.
    if (el && !prefersReduced())
      el.animate([{ rotate: "0deg" }, { rotate: `${rnd(-2.4, 2.4)}deg`, offset: 0.35 }, { rotate: "0deg" }], { duration: 480, easing: SPRING });
  };

  /** The button goes down and the whole machine takes the knock, a little differently each time. */
  const thunk = () => {
    const m = machineRef.current;
    if (!m || prefersReduced()) return;
    m.animate(
      [
        { translate: "0 0", rotate: "0deg" },
        { translate: `0 ${rnd(1.5, 3)}px`, rotate: `${rnd(-0.25, 0.25)}deg`, offset: 0.3 },
        { translate: "0 0", rotate: "0deg" },
      ],
      { duration: 420, easing: SPRING },
    );
  };

  // ---------- printing ----------
  const run = useCallback(async () => {
    if (busyRef.current) return;
    const text = brief;
    const ids = [...picked];
    if (!text.trim() && !ids.length) {
      textareaRef.current?.focus();
      return;
    }
    busyRef.current = true;
    setBusy(true);
    thunk();
    const pending = ask(text, topicsToSignals(ids));
    const labels = ids.map((id) => topicById(id)?.label ?? id);
    const list = [
      `Reading ${text.trim().length > 200 ? "the job description" : "your request"}`,
      labels.length ? labels.join(", ") : "Looking for a match",
      "Choosing where to start",
      "Printing",
    ];
    setSteps(list);
    setStepAt(0);
    setLive("Printing.");

    const [, outcome] = await Promise.all([sleep(STEP_MS), pending]);
    const startHere = outcome.ok && outcome.data.matched === "start-here";
    const sheets = outcome.ok
      ? outcome.data.sheets.map((s) => cards[cardKey(s.project, s.section)]).filter((c): c is SheetCard => Boolean(c))
      : [];
    const next = [...list];
    if (!labels.length && outcome.ok && !startHere) next[1] = outcome.data.asked.slice(0, 2).map((s) => SIGNALS[s]).join(", ");
    next[2] = !outcome.ok
      ? "Paper jam"
      : startHere || !sheets.length
        ? "Choosing where to start"
        : printedCount(sheets);
    setSteps(next);
    for (let i = 1; i <= 4; i++) {
      setStepAt(i);
      if (i < 4) await sleep(STEP_MS);
    }

    const feed = outfeedRef.current;
    if (feed) {
      feed.classList.remove("go");
      void feed.offsetWidth;
      feed.classList.add("go");
    }
    await sleep(FEED_MS);

    const r: Result = outcome.ok
      ? {
          // Cards picked without words: the title is what was picked. Words typed: what the machine understood.
          title: resultTitle({ asked: outcome.data.asked, startHere, picked: labels }),
          asked: quoteBrief(text),
          cards: sheets,
          missing: missingLine(outcome.data.missing),
          provenance: provenanceLine(outcome.data.source, sheets.length),
        }
      : { title: outcome.message, asked: quoteBrief(text), cards: [], missing: "", provenance: "", error: true };
    introRef.current = true;
    setCur(0);
    setResult(r);
    setLive(r.title);
    setTimeout(() => feed?.classList.remove("go"), prefersReduced() ? 0 : 400);

    setSteps(null);
    setStepAt(-1);
    setBrief("");
    setPicked([]);
    busyRef.current = false;
    setBusy(false);
  }, [brief, picked, cards]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void run();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
    if (e.key === "Escape") setBrief("");
  };

  // A new print: move focus to the title and bring the results into view.
  useLayoutEffect(() => {
    if (!result || !introRef.current) return;
    introRef.current = false;
    if (stripRef.current) stripRef.current.scrollLeft = 0;
    // The paper is back to its empty size in this same render: let the machine settle before measuring the scroll,
    // or it settles a moment later and the results title slides up past the top of the screen.
    const paper = paperRef.current;
    if (paper) stageRef.current?.style.setProperty("--pm", `${paper.offsetHeight}px`);
    titleRef.current?.focus({ preventScroll: true });
    resultsRef.current?.scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth", block: "start" });
  }, [result]);

  // The sheets sit side by side on wide screens: arrows, keys and swiping move along the strip; the counter follows the scroll.
  const n = result?.cards.length ?? 0;
  const runs = projectRuns(result?.cards ?? []);
  const goSheet = useCallback(
    (i: number) => {
      const strip = stripRef.current;
      if (!strip || !n) return;
      const k = Math.max(0, Math.min(n - 1, i));
      const el = strip.children[k] as HTMLElement | undefined;
      el?.scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth", inline: "start", block: "nearest" });
      setCur(k);
      setLive(`Sheet ${k + 1} of ${n}: ${result?.cards[k]?.title ?? ""}`);
    },
    [n, result],
  );
  const onStripScroll = () => {
    const strip = stripRef.current;
    if (!strip || !n) return;
    const items = Array.from(strip.children) as HTMLElement[];
    const x = strip.scrollLeft;
    let best = 0;
    items.forEach((el, i) => {
      if (Math.abs(el.offsetLeft - x) < Math.abs(items[best]!.offsetLeft - x)) best = i;
    });
    setCur(best);
  };
  const onStripKey = (e: KeyboardEvent<HTMLOListElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goSheet(cur + 1);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goSheet(cur - 1);
    }
  };

  const again = () => {
    setResult(null);
    setLive("");
    window.scrollTo({ top: 0, behavior: prefersReduced() ? "auto" : "smooth" });
    textareaRef.current?.focus({ preventScroll: true });
  };

  // ---------- render ----------
  const working = steps !== null;
  const ready = Boolean(brief.trim() || picked.length) && !busy;
  const size = working || brief.length > 120 || picked.length ? "full" : focused || brief ? "focus" : "idle";

  return (
    <>
      <section className="skills" aria-labelledby="skills-title">
        <h2 className="sr-only" id="skills-title">
          Skills
        </h2>
        <ul className="topics" style={{ "--topics": topics.length } as CSSProperties}>
          {topics.map((t, i) => (
            <li key={t.id}>
              <button
                type="button"
                className="topic"
                data-topic={t.id}
                aria-pressed={picked.includes(t.id)}
                onClick={(e) => toggle(t.id, e.currentTarget)}
              >
                <small aria-hidden="true">{pad2(i + 1)}</small>
                <b>{t.label}</b>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <div className="stage" ref={stageRef}>
        <div ref={machineRef} className={`machine${ready ? " ready" : ""}`} data-state={working ? "working" : ready ? "ready" : "idle"}>
          <form
            ref={formRef}
            id="order"
            className="paperbox"
            data-size={size}
            action="/ask"
            method="get"
            autoComplete="off"
            aria-labelledby={labelledBy}
            onSubmit={onSubmit}
          >
            <div
              className="paper"
              ref={paperRef}
              onClick={(e) => {
                // The whole sheet is the form: a click anywhere on it puts the caret in the field.
                if (working || (e.target as HTMLElement).closest("button, textarea")) return;
                textareaRef.current?.focus();
              }}
            >
              <div className="paper-head" hidden={working}>
                <label htmlFor="brief">Your brief</label>
                <span aria-hidden="true">{brief.trim() || picked.length ? "↵ to print" : ""}</span>
              </div>
              <div className={`field${brief ? " has-text" : ""}${focused ? " on" : ""}`} hidden={working}>
                <textarea
                  ref={textareaRef}
                  id="brief"
                  name="brief"
                  maxLength={BRIEF_MAX}
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onKeyDown={onKeyDown}
                />
                <div className="ghost" aria-hidden="true" key={anyPicked ? "picked" : example}>
                  {ghostText}
                </div>
              </div>
              <input type="hidden" name="topics" value={topicsToSignals(picked).join(",")} />
              <div className="chips" aria-label="Selected skills" role="group" hidden={working}>
                {picked.map((id) => {
                  const label = topicById(id)?.label ?? id;
                  const n = topics.findIndex((t) => t.id === id);
                  return (
                    <button key={id} type="button" data-topic={id} aria-label={`Remove ${label}`} onClick={(e) => toggle(id, e.currentTarget)}>
                      {n >= 0 && <small aria-hidden="true">{pad2(n + 1)}</small>}
                      {label}
                    </button>
                  );
                })}
              </div>
              {steps && (
                <ul className="steps" aria-hidden="true">
                  {steps.map((s, i) => (
                    <li key={i} className={i < stepAt ? "done" : i === stepAt ? "now" : undefined}>
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </form>
          <Image src="/printer.webp" alt="" width={1100} height={494} priority draggable={false} sizes="(min-width: 800px) 760px, 100vw" />
          <div className="plate" aria-hidden="true">
            <span>CHONGBO NING</span>
            <span>DESIGN ENGINEER</span>
          </div>
          <span className="led" aria-hidden="true" />
          <button className="pk" type="submit" form="order" aria-label="Print" aria-busy={busy || undefined} />
          <span className="pk-label" aria-hidden="true">
            Print
          </span>
          <div className="outfeed" ref={outfeedRef} aria-hidden="true">
            <i />
          </div>
        </div>
      </div>

      <div className="alt" hidden={Boolean(result)}>
        <Pill kind="all" href="/work" label="Or browse all work" />
      </div>

      {result && (
        <section className="results" ref={resultsRef} aria-labelledby="r-title">
          <div className="rhead">
            <div>
              <h2 id="r-title" ref={titleRef} tabIndex={-1}>
                {result.title}
              </h2>
              {result.asked && <p>{result.asked}</p>}
            </div>
            {result.provenance && <p className="provenance">{result.provenance}</p>}
          </div>
          {result.cards.length > 0 && (
            <ol
              className="sheets"
              ref={stripRef}
              aria-label="Printed sheets"
              tabIndex={0}
              onScroll={onStripScroll}
              onKeyDown={onStripKey}
            >
              {result.cards.map((card, i) => (
                <li
                  key={cardKey(card.project, card.section)}
                  className={`sheet${whole[cardKey(card.project, card.section)] ? " has-card" : ""}`}
                  style={{ animationDelay: `${80 + 110 * i}ms` }}
                >
                  <article aria-labelledby={whole[cardKey(card.project, card.section)] ? printedTitleId(card.project, card.section) : `sh-${i}`}>
                    <Sheet
                      card={card}
                      index={i}
                      total={result.cards.length}
                      headingId={`sh-${i}`}
                      run={runs[i]}
                      media={card.hasMedia ? media[cardKey(card.project, card.section)] : undefined}
                      whole={whole[cardKey(card.project, card.section)]}
                    />
                  </article>
                </li>
              ))}
            </ol>
          )}
          {n > 1 && (
            <div className="deckbar">
              <button type="button" aria-label="Previous sheet" disabled={cur === 0} onClick={() => goSheet(cur - 1)}>
                ←
              </button>
              <span>
                {pad2(cur + 1)} / {pad2(n)}
              </span>
              <button type="button" aria-label="Next sheet" disabled={cur === n - 1} onClick={() => goSheet(cur + 1)}>
                →
              </button>
            </div>
          )}
          {result.missing && <p className="missing">{result.missing}</p>}
          <div className="again">
            <button type="button" onClick={again}>
              New request
            </button>
          </div>
        </section>
      )}
      <p className="sr-only" role="status" aria-live="polite">
        {live}
      </p>
    </>
  );
}
