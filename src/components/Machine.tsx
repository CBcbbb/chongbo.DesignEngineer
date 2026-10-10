"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import type { CardIndex } from "@/lib/cards";
import { AskResponseSchema, AskErrorSchema, QUESTION_MAX, RATE_LIMIT_MESSAGE, type AskResponse } from "@/lib/ask/schema";
import { AnswerTicket, BlankTicket, ErrorTicket } from "./Ticket";

type Printed =
  | { kind: "welcome" }
  | { kind: "blank" }
  | { kind: "answer"; result: AskResponse; question: string; number: number; time: string }
  | { kind: "error"; message: string; question: string }
  | { kind: "none" };

type Props = {
  cards: CardIndex;
  /** Server-rendered welcome ticket, so the first paint needs no JavaScript. */
  welcome: ReactNode;
  chips: { label: string; q: string }[];
};

const LIP = 18; // px of blank paper showing while the machine thinks
const MIN_WAIT = 400; // ms, so the motion reads even when the answer is instant

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Machine({ cards, welcome, chips }: Props) {
  const [printed, setPrinted] = useState<Printed>({ kind: "welcome" });
  const [thinking, setThinking] = useState(false);
  const [done, setDone] = useState<"welcome" | "true" | "false">("welcome");
  const [status, setStatus] = useState("");
  const busy = useRef(false);
  const count = useRef(0);
  const pendingPrint = useRef<null | (() => void)>(null);

  const feedRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const setFeed = (height: string, transition = "none") => {
    const feed = feedRef.current;
    if (!feed) return;
    feed.style.transition = transition;
    feed.style.height = height;
  };

  /** The current ticket falls away from the slot. Resolves once the slot is clear enough to print again. */
  const tearOff = useCallback(async () => {
    const feed = feedRef.current;
    if (!feed || !feed.firstElementChild || feed.offsetHeight === 0) return;
    const reduce = prefersReduced();
    const r = feed.getBoundingClientRect();
    const clone = feed.cloneNode(true) as HTMLElement;
    clone.removeAttribute("id");
    clone.classList.add("falling");
    clone.setAttribute("aria-hidden", "true");
    clone.setAttribute("inert", "");
    clone.querySelectorAll("[id]").forEach((n) => n.removeAttribute("id"));
    Object.assign(clone.style, {
      left: `${r.left}px`,
      top: `${r.top}px`,
      width: `${r.width}px`,
      height: `${r.height}px`,
      transition: reduce ? "opacity .15s" : "",
      animation: "none",
    });
    document.body.appendChild(clone);
    setFeed("0px");
    setPrinted({ kind: "none" });
    setDone("false");
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const tilt = Math.random() < 0.5 ? -9 : 8;
        clone.style.transform = reduce ? "" : `translateY(${Math.round(window.innerHeight * 0.55)}px) rotate(${tilt}deg)`;
        clone.style.opacity = "0";
      }),
    );
    window.setTimeout(() => clone.remove(), 760);
    await sleep(reduce ? 0 : 260);
  }, []);

  /** Step the paper out to its full height, like a thermal printer. */
  const print = useCallback(() => {
    const feed = feedRef.current;
    const ticket = feed?.querySelector<HTMLElement>(".ticket");
    if (!feed || !ticket) return Promise.resolve<HTMLElement | null>(null);
    const reduce = prefersReduced();
    const h = ticket.scrollHeight;
    const from = feed.offsetHeight;
    const steps = Math.max(10, Math.round((h - from) / 22));
    const dur = reduce ? 0 : Math.min(1.5, 0.45 + h / 900);
    setFeed(`${from}px`);
    void feed.offsetHeight;
    setFeed(`${h}px`, dur ? `height ${dur}s steps(${steps}, end)` : "none");
    return new Promise<HTMLElement>((resolve) => {
      window.setTimeout(() => {
        setFeed("auto");
        resolve(ticket);
      }, dur * 1000 + 30);
    });
  }, []);

  // Runs after React has rendered the new ticket into the feed.
  useLayoutEffect(() => {
    const run = pendingPrint.current;
    if (run) {
      pendingPrint.current = null;
      run();
    }
  }, [printed]);

  const ask = useCallback(
    async (raw: string) => {
      const q = raw.trim().slice(0, QUESTION_MAX);
      if (!q || busy.current) return;
      busy.current = true;
      if (inputRef.current) inputRef.current.value = q;
      const reduce = prefersReduced();

      await tearOff();

      // Thinking: LED blinks and a lip of blank paper inches at the slot.
      setThinking(true);
      setStatus("Finding the right card…");
      setPrinted({ kind: "blank" });
      setFeed("0px");
      requestAnimationFrame(() => setFeed(`${LIP}px`, reduce ? "none" : "height .25s steps(3, end)"));

      let next: Printed;
      try {
        const [res] = await Promise.all([
          fetch("/api/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: q }),
          }),
          sleep(reduce ? 0 : MIN_WAIT),
        ]);
        const json: unknown = await res.json().catch(() => null);
        const ok = AskResponseSchema.safeParse(json);
        if (res.ok && ok.success) {
          count.current += 1;
          const time = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
          next = { kind: "answer", result: ok.data, question: q, number: count.current, time };
        } else {
          const err = AskErrorSchema.safeParse(json);
          next = {
            kind: "error",
            question: q,
            message: res.status === 429 ? RATE_LIMIT_MESSAGE : err.success ? err.data.message : "Something jammed. Try again in a moment.",
          };
        }
      } catch {
        next = { kind: "error", question: q, message: "I couldn't reach the printer. Check your connection and try again." };
      }

      setThinking(false);
      pendingPrint.current = async () => {
        const ticket = await print();
        setDone("true");
        busy.current = false;
        if (next.kind === "answer") {
          const n = next.result.picks.length;
          setStatus(`${next.result.reply} ${n} ${n === 1 ? "card" : "cards"}.`);
        } else if (next.kind === "error") {
          setStatus(next.message);
        }
        if (ticket) {
          ticket.focus({ preventScroll: true });
          const top = ticket.getBoundingClientRect().top;
          if (top > window.innerHeight * 0.7 || top < 0) {
            window.scrollBy({ top: top - 120, behavior: reduce ? "auto" : "smooth" });
          }
        }
      };
      setPrinted(next);
    },
    [print, tearOff],
  );

  // Suggested questions are plain links to /ask (they work without JavaScript); here they print in place.
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-q]");
      if (!link || !root.contains(link)) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      void ask(link.dataset.q ?? "");
    };
    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }, [ask]);

  const tearAndReset = async () => {
    if (busy.current) return;
    await tearOff();
    setStatus("Ready for your next question.");
    inputRef.current?.focus();
  };

  // Clean up any falling clones if the page unmounts mid-animation.
  useEffect(() => () => document.querySelectorAll(".falling").forEach((n) => n.remove()), []);

  return (
    <div className="contents" ref={rootRef}>
      <div className="machine" data-state={thinking ? "thinking" : "idle"}>
        <div className="machine-body">
          <div className="plate">
            <span className="plate-label">Ask Chongbo</span>
            <span className="plate-label">
              <i className="led" aria-hidden="true" />
              <span>{thinking ? "Printing" : "Ready"}</span>
            </span>
          </div>
          <form
            ref={formRef}
            className="ask"
            action="/ask"
            method="get"
            role="search"
            aria-label="Ask about Chongbo's work"
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault();
              void ask(inputRef.current?.value ?? "");
            }}
          >
            <label htmlFor="q" className="sr-only">
              Ask a question about Chongbo&rsquo;s work
            </label>
            <input
              ref={inputRef}
              id="q"
              name="q"
              type="text"
              required
              maxLength={QUESTION_MAX}
              enterKeyHint="send"
              placeholder="What matters most to your team?"
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  e.currentTarget.value = "";
                }
              }}
            />
            <button className="key" type="submit" aria-disabled={thinking || undefined}>
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

      <div className="out" data-done={done}>
        <div className="feed" ref={feedRef} data-phase={thinking ? "thinking" : "idle"}>
          {printed.kind === "welcome" && welcome}
          {printed.kind === "blank" && <BlankTicket />}
          {printed.kind === "answer" && (
            <AnswerTicket
              result={printed.result}
              question={printed.question}
              cards={cards}
              number={printed.number}
              time={printed.time}
            />
          )}
          {printed.kind === "error" && <ErrorTicket message={printed.message} question={printed.question} />}
        </div>
      </div>

      <div className="below">
        <p className="status" role="status" aria-live="polite">
          {status}
        </p>
        <ul className="chips" aria-label="Suggested questions">
          {chips.map((c) => (
            <li key={c.q}>
              <a className="chip" href={`/ask?q=${encodeURIComponent(c.q)}`} data-q={c.q}>
                {c.label}
              </a>
            </li>
          ))}
        </ul>
        {done === "true" && (
          <button className="tear" type="button" onClick={tearAndReset}>
            Tear off and ask again
          </button>
        )}
      </div>
    </div>
  );
}
