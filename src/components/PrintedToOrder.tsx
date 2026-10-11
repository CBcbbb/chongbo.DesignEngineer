"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { SIGNALS } from "@content/schema";
import { AskErrorSchema, AskResponseSchema, BRIEF_MAX, RATE_LIMIT_MESSAGE, type AskResponse } from "@/lib/ask/schema";
import { cardKey, type CardIndex, type SheetCard } from "@/lib/cards";
import { EXAMPLES, NUM, PICKED_HINT, TOPICS, missingLine, pad2, provenanceLine, quoteBrief, resultTitle, topicById, topicsToSignals } from "@/lib/printed";
import { Pill } from "./nav/Pill";
import { Sheet } from "./Sheet";

type Props = {
  cards: CardIndex;
  /** Server-rendered media for each section (MediaSlot, compact), keyed by cardKey. */
  media: Record<string, ReactNode>;
  /** id of the page h1, which names the paper form. */
  labelledBy: string;
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

export function PrintedToOrder({ cards, media, labelledBy }: Props) {
  const [brief, setBrief] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [focused, setFocused] = useState(false);
  const [busy, setBusy] = useState(false);
  const [steps, setSteps] = useState<string[] | null>(null);
  const [stepAt, setStepAt] = useState(-1);
  const [ghost, setGhost] = useState(EXAMPLES[0]!);
  const [result, setResult] = useState<Result | null>(null);
  const [cur, setCur] = useState(0);
  const [live, setLive] = useState("");

  const busyRef = useRef(false);
  const curRef = useRef(0);
  const introRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const outfeedRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const machineRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const sheetRefs = useRef<(HTMLElement | null)[]>([]);

  const deckCards = useMemo(() => result?.cards ?? [], [result]);
  const deckN = deckCards.length;

  // ---------- typed examples on the paper; a still hint once a skill is picked ----------
  const anyPicked = picked.length > 0;
  const ghostText = anyPicked ? PICKED_HINT : ghost;
  useEffect(() => {
    if (anyPicked || prefersReduced()) return;
    let ex = 0;
    let i = EXAMPLES[0]!.length;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const s = EXAMPLES[ex % EXAMPLES.length]!;
      if (i < s.length) {
        i++;
        setGhost(s.slice(0, i));
        timer = setTimeout(tick, 55);
      } else {
        timer = setTimeout(() => {
          ex++;
          i = 0;
          setGhost("");
          tick();
        }, 1800);
      }
    };
    timer = setTimeout(tick, 0);
    return () => clearTimeout(timer);
  }, [anyPicked]);

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
        : `${NUM[sheets.length] ?? sheets.length} ${sheets.length === 1 ? "project" : "projects"}`;
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

    const topicLabel = ids.length === 1 && !text.trim() ? topicById(ids[0]!)?.label : undefined;
    const r: Result = outcome.ok
      ? {
          title: resultTitle({ count: sheets.length, startHere, topicLabel }),
          asked: quoteBrief(text),
          cards: sheets,
          missing: missingLine(outcome.data.missing),
          provenance: provenanceLine(outcome.data.source, sheets.length),
        }
      : { title: outcome.message, asked: quoteBrief(text), cards: [], missing: "", provenance: "", error: true };
    introRef.current = true;
    curRef.current = 0;
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

  // ---------- the deck: sheets overlap left to right; the current one opens out and sits on top ----------
  const deckGeom = useCallback(() => {
    const wrapW = deckRef.current?.clientWidth || 1000;
    const W = Math.min(340, wrapW - 44);
    const step = Math.max(14, Math.min(96, (wrapW - 2 * W) / Math.max(1, deckN - 1)));
    const total = (deckN - 1) * step + W + (deckN > 1 ? W - step : 0);
    return { W, step, wrapW, left: Math.max(0, (wrapW - total) / 2) };
  }, [deckN]);

  const layoutDeck = useCallback(
    (drag = 0, intro = false) => {
      const deck = deckRef.current;
      if (!deck || !deckN) return;
      const g = deckGeom();
      const current = curRef.current;
      const reduce = prefersReduced();
      let h = 0;
      sheetRefs.current.slice(0, deckN).forEach((c, i) => {
        if (!c) return;
        const fromCur = i - current;
        let x = g.left + i * g.step + (i > current ? g.W - g.step : 0) + drag;
        // Keep the peeking edges on screen on narrow phones.
        if (i > current) x = Math.min(x, g.wrapW - 26 - (deckN - 1 - i) * 8 + drag);
        const rot = i === current ? 0 : (fromCur < 0 ? -1.2 : 1.2) * Math.min(1, Math.abs(fromCur));
        const y = i === current ? -10 : 0;
        c.style.setProperty("--w", `${g.W}px`);
        c.style.zIndex = String(i <= current ? 10 + i : 10 + deckN - (i - current));
        const to = `translate(${x}px, ${y}px) rotate(${rot}deg)`;
        if (intro && !reduce) {
          c.style.transition = "none";
          c.style.transform = `translate(${g.left + i * 6}px, -60px) rotate(0)`;
          void c.offsetWidth;
          c.style.transition = "";
          setTimeout(() => {
            c.style.transform = to;
          }, 80 + 90 * i);
        } else c.style.transform = to;
        h = Math.max(h, c.offsetHeight);
      });
      deck.style.height = `${h + 30}px`;
    },
    [deckGeom, deckN],
  );

  // A new print: lay out with the intro, then move focus to the title and bring the results into view.
  useLayoutEffect(() => {
    if (!result) return;
    if (introRef.current) {
      introRef.current = false;
      layoutDeck(0, true);
      titleRef.current?.focus({ preventScroll: true });
      resultsRef.current?.scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth", block: "start" });
    }
  }, [result, layoutDeck]);

  useLayoutEffect(() => {
    curRef.current = cur;
    layoutDeck();
  }, [cur, layoutDeck]);

  useEffect(() => {
    if (!deckN) return;
    const onResize = () => layoutDeck();
    window.addEventListener("resize", onResize);
    // Geist arriving can change sheet heights.
    void document.fonts?.ready.then(onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [deckN, layoutDeck]);

  const goDeck = useCallback(
    (i: number) => {
      if (!deckN) return;
      const n = Math.max(0, Math.min(deckN - 1, i));
      curRef.current = n;
      setCur(n);
      layoutDeck();
      setLive(`Sheet ${n + 1} of ${deckN}: ${deckCards[n]?.title ?? ""}`);
    },
    [deckN, deckCards, layoutDeck],
  );

  // Drag or swipe the deck; a click on a peeking sheet brings it to the top.
  useEffect(() => {
    const deck = deckRef.current;
    if (!deck || !deckN) return;
    let dd: { x: number; moved: boolean } | null = null;
    const down = (e: PointerEvent) => {
      if ((e.target as Element).closest(".full")) return;
      dd = { x: e.clientX, moved: false };
    };
    const move = (e: PointerEvent) => {
      if (!dd) return;
      const dx = e.clientX - dd.x;
      if (Math.abs(dx) > 6) {
        dd.moved = true;
        deck.classList.add("dragging");
        layoutDeck(dx * 0.6);
      }
    };
    const up = (e: PointerEvent) => {
      if (!dd) return;
      const dx = e.clientX - dd.x;
      const moved = dd.moved;
      dd = null;
      deck.classList.remove("dragging");
      if (moved) {
        const g = deckGeom();
        const n = Math.round(-dx / Math.max(60, g.step + 20));
        goDeck(curRef.current + (n || (Math.abs(dx) > 40 ? (dx < 0 ? 1 : -1) : 0)));
        return;
      }
      const c = (e.target as Element).closest<HTMLElement>(".sheet");
      if (c && !c.classList.contains("cur")) goDeck(Number(c.dataset.i));
    };
    deck.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      deck.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [deckN, deckGeom, goDeck, layoutDeck]);

  const onDeckKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goDeck(curRef.current + 1);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goDeck(curRef.current - 1);
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
        <ul className="topics">
          {TOPICS.map((t, i) => (
            <li key={t.id}>
              <button
                type="button"
                className="topic"
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
            <div className="paper" ref={paperRef}>
              <div className={`field${brief || focused ? " on" : ""}`} hidden={working}>
                <label htmlFor="brief" className="sr-only">
                  Describe the role or paste a job description.
                </label>
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
                <div className="ghost" aria-hidden="true">
                  {ghostText}
                </div>
              </div>
              <input type="hidden" name="topics" value={topicsToSignals(picked).join(",")} />
              <div className="chips" aria-label="Selected skills" role="group" hidden={working || !picked.length}>
                {picked.map((id) => {
                  const label = topicById(id)?.label ?? id;
                  return (
                    <button key={id} type="button" aria-label={`Remove ${label}`} onClick={() => toggle(id)}>
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
          {deckN > 0 && (
            <>
              <div
                className="deck"
                ref={deckRef}
                tabIndex={0}
                role="region"
                aria-roledescription="carousel"
                aria-label="Printed sheets"
                onKeyDown={onDeckKey}
              >
                {deckCards.map((card, i) => (
                  <article
                    key={card.project}
                    ref={(el) => {
                      sheetRefs.current[i] = el;
                    }}
                    className={`sheet${i === cur ? " cur" : ""}`}
                    data-i={i}
                    aria-roledescription="slide"
                    aria-labelledby={`sh-${i}`}
                    aria-hidden={i !== cur}
                  >
                    <Sheet
                      card={card}
                      index={i}
                      total={deckN}
                      current={i === cur}
                      headingId={`sh-${i}`}
                      media={card.hasMedia ? media[cardKey(card.project, card.section)] : undefined}
                    />
                  </article>
                ))}
              </div>
              <div className="deckbar">
                <button type="button" aria-label="Previous sheet" disabled={cur === 0} onClick={() => goDeck(cur - 1)}>
                  ←
                </button>
                <span>
                  {pad2(cur + 1)} / {pad2(deckN)}
                </span>
                <button type="button" aria-label="Next sheet" disabled={cur === deckN - 1} onClick={() => goDeck(cur + 1)}>
                  →
                </button>
              </div>
            </>
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
