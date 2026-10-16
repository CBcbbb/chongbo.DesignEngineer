"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent, type KeyboardEvent } from "react";
import { AskErrorSchema, AskResponseSchema, BRIEF_MAX, RATE_LIMIT_MESSAGE } from "@/lib/ask/schema";
import { markPattern } from "@/lib/ask/keys";
import type { CardIndex, SheetCard } from "@/lib/cards";
import { BROWSE_ALL, EXAMPLES, JAM_LINE, NUM, PICKED_HINT, SIGNAL_SHORT, TOPICS, cardKey, missingLine, notUnderstoodLine, pad2, projectRuns, provenanceLine, quoteBrief, resultTitle, topicsToSignals, type Topic } from "@/lib/printed";
import { Pill } from "./nav/Pill";
import { track } from "@/lib/analytics";
import { DrawnArrow } from "./shell/DrawnArrow";
import type { PrintedCard } from "./PrintedCard";
import { printCards } from "./print-cards";
import { Sheet } from "./Sheet";
import { Display, type DisplayState } from "./printer/Display";
import { curatedAnswer, type CuratedSelection, type PrintAnswer } from "@/lib/curated";

type Props = {
  cards: CardIndex;
  contactEmail: string;
  /** id of the page h1, which names the paper form. */
  labelledBy: string;
  /** The skills cards to offer: those some shown project has work for (default: all). */
  topics?: Topic[];
  selection?: CuratedSelection;
};

type Result = {
  title: string;
  asked: string;
  cards: SheetCard[];
  /** The printed cards, as their case pages render them, keyed by cardKey: fetched for this print only (`printCards`). */
  printed: Record<string, PrintedCard>;
  missing: string;
  provenance: string;
  byModel?: boolean;
  /** Nothing in the request named a role or a skill: the three places to start, and a line saying why. */
  notUnderstood?: string;
  error?: boolean;
};

/*
 * The analysis, on the display (approved in docs/design/visual-motion-assembled.html):
 *   read (the request passes the reading light into the slot) → wait (only while the answer is out) →
 *   understand (each capability locks in) → search (the count of cards rolls down) → print.
 * The answer and the printed cards are fetched as soon as the key is pressed, so the steps never add to a slow answer;
 * the read step's pass into the slot is the floor.
 */
const READ_DELAY = 240;
const PASS_MS = 1600;
const LEAF_MS = 110;
const LOCK_MS = 380;
const COUNT_STEPS = 9;
const FEED_MS = 900;
const FLIGHT_MS = 840;
/** A sheet is never scaled below this to fit a short window: the card's type stays comfortable to read. */
const MIN_SCALE = 0.85;
/** Room kept under the sheet, so its foot doesn't touch the window's edge. */
const FOOT_ROOM = 16;

const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, prefersReduced() ? 0 : ms));
const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";

/** A damped spring sampled into CSS linear(), so moving parts land with weight. Falls back to a stock overshoot. */
function spring(k: number, c: number): { easing: string; duration: number } {
  let x = 0;
  let v = 0;
  const pts = [0];
  const dt = 1 / 60;
  for (let i = 0; i < 240; i++) {
    v += (-k * (x - 1) - c * v) * dt;
    x += v * dt;
    pts.push(+x.toFixed(4));
    if (Math.abs(x - 1) < 0.001 && Math.abs(v) < 0.01) break;
  }
  pts[pts.length - 1] = 1;
  const duration = Math.round((pts.length - 1) * dt * 1000);
  const ok = typeof CSS !== "undefined" && CSS.supports?.("animation-timing-function", "linear(0, 1)");
  return { easing: ok ? `linear(${pts.join(",")})` : "cubic-bezier(0.34, 1.4, 0.64, 1)", duration };
}
const KEY_UP = spring(420, 16);
const SHEET_BACK = spring(210, 22);
const DEAL = spring(170, 21);

const MARKS = markPattern();
const esc = (t: string) => t.replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]!);
/** The request as the printer reads it: the visitor's words, with the ones it recognises marked. */
function markedHtml(text: string): string {
  let i = 0;
  return esc(text).replace(MARKS, (w) => `<mark style="--i:${i++}">${w}</mark>`);
}
const say = (n: number) => (NUM[n] ?? String(n)).toUpperCase();

type Outcome = { ok: true; data: PrintAnswer } | { ok: false; message: string; kind?: "limit" | "offline" };

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
    if (res.status === 429) return { ok: false, message: RATE_LIMIT_MESSAGE, kind: "limit" };
    const err = AskErrorSchema.safeParse(json);
    return { ok: false, message: err.success ? err.data.message : "Something jammed. Try again, or browse all work." };
  } catch {
    return { ok: false, message: "The printer is offline. Check your connection and try again.", kind: "offline" };
  }
}

export function PrintedToOrder({ cards, contactEmail, labelledBy, topics = TOPICS, selection }: Props) {
  const [brief, setBrief] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [focused, setFocused] = useState(false);
  const [busy, setBusy] = useState(false);
  /** While the request is read: the visitor's words with the recognised ones marked. */
  const [reading, setReading] = useState<string | null>(null);
  const [disp, setDisp] = useState<DisplayState>({ l1: "Chongbo Ning", l2: "Design engineer" });
  const [jam, setJam] = useState<null | { message: string; kind?: "limit" | "offline" }>(null);
  const [ghost, setGhost] = useState(EXAMPLES[0]!);
  const [result, setResult] = useState<Result | null>(null);
  const [cur, setCur] = useState(0);
  const [live, setLive] = useState("");

  const busyRef = useRef(false);
  const abortRef = useRef(false);
  const restRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
  const lightRef = useRef<HTMLSpanElement>(null);
  const keyRef = useRef<HTMLButtonElement>(null);

  const projectNames = useMemo(() => [...new Set(Object.values(cards).map((c) => c.projectTitle))], [cards]);
  const total = useMemo(() => Object.keys(cards).length, [cards]);

  // ---------- typed examples on the paper: twice round, then they rest on the last one; a still hint once a skill is picked ----------
  const anyPicked = picked.length > 0;
  const curatedPicked = Boolean(selection && picked.includes(selection.id));
  const ghostText = curatedPicked ? "Print my picks, or write your own request." : anyPicked ? PICKED_HINT : ghost;
  useEffect(() => {
    if (anyPicked) return;
    if (prefersReduced()) {
      // no typing: the last example, still
      const t = setTimeout(() => setGhost(EXAMPLES[EXAMPLES.length - 1]!), 0);
      return () => clearTimeout(t);
    }
    let ex = 0;
    let i = EXAMPLES[0]!.length;
    let rounds = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const s = EXAMPLES[ex % EXAMPLES.length]!;
      if (i < s.length) {
        i++;
        setGhost(s.slice(0, i));
        timer = setTimeout(tick, 55);
        return;
      }
      if (ex % EXAMPLES.length === EXAMPLES.length - 1 && ++rounds >= 2) return;
      timer = setTimeout(() => {
        ex++;
        i = 0;
        setGhost("");
        tick();
      }, 1800);
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

  // ---------- the display at rest: the name, or Ready once there is something to print ----------
  const ready = Boolean(brief.trim() || picked.length) && !busy;
  const [restTick, setRestTick] = useState(0);
  useEffect(() => {
    // a "Printed" or "Stopped" line, or a jam, holds the display until it ends
    if (busy || jam || restRef.current) return;
    setDisp(ready ? { l1: "Ready", l2: "Press print" } : { l1: "Chongbo Ning", l2: "Design engineer" });
  }, [ready, busy, jam, restTick]);
  /** Show a line for a while, then hand the display back to the resting state. */
  const rest = (d: DisplayState, ms: number) => {
    setDisp(d);
    if (restRef.current) clearTimeout(restRef.current);
    restRef.current = setTimeout(() => {
      restRef.current = null;
      setRestTick((t) => t + 1);
    }, ms);
  };
  useEffect(
    () => () => {
      if (restRef.current) clearTimeout(restRef.current);
    },
    [],
  );

  // ---------- skills cards ----------
  const toggle = (id: string, el?: HTMLElement | null) => {
    if (busyRef.current) return;
    track("skill_toggled", { skill: topics.find((t) => t.id === id)?.label ?? id, on: !picked.includes(id) });
    setPicked((p) => {
      if (p.includes(id)) return p.filter((x) => x !== id);
      if (id === selection?.id) return [id];
      return [...p.filter((x) => x !== selection?.id), id];
    });
    // A card picked up gets a small random tilt and settles; the layout never moves.
    if (el && !prefersReduced())
      el.animate([{ rotate: "0deg" }, { rotate: `${rnd(-2.4, 2.4)}deg`, offset: 0.35 }, { rotate: "0deg" }], { duration: 480, easing: SPRING });
  };

  // ---------- the key and the machine ----------
  const keyDown = () => {
    if (prefersReduced()) return;
    keyRef.current?.animate([{ translate: "-50% -50%" }, { translate: "-50% calc(-50% + 4%)" }], { duration: 60, easing: "ease-out", fill: "forwards" });
  };
  const keyUp = () => {
    if (prefersReduced()) return;
    keyRef.current?.animate([{ translate: "-50% calc(-50% + 4%)" }, { translate: "-50% -50%" }], { duration: KEY_UP.duration, easing: KEY_UP.easing, fill: "forwards" });
  };
  /** The machine takes the knock, a little differently each time. */
  const thunk = () => {
    const m = machineRef.current;
    if (!m || prefersReduced()) return;
    m.animate(
      [
        { translate: "0 0", rotate: "0deg" },
        { translate: `0 ${rnd(1, 2)}px`, rotate: `${rnd(-0.2, 0.2)}deg`, offset: 0.3 },
        { translate: "0 0", rotate: "0deg" },
      ],
      { duration: 380, easing: SPRING },
    );
  };
  const shake = (dx: number, ms: number, steps: number) => {
    const m = machineRef.current;
    if (!m || prefersReduced()) return Promise.resolve();
    const frames = steps > 4
      ? [{ translate: "0 0" }, { translate: `${dx}px 0` }, { translate: `${-dx}px 0` }, { translate: "0 0", offset: 0.5 }, { translate: `${dx * 0.8}px 0` }, { translate: `${-dx * 0.8}px 0` }, { translate: "0 0" }]
      : [{ translate: "0 0" }, { translate: `${dx}px 0` }, { translate: `${-dx}px 0` }, { translate: "0 0" }];
    return m.animate(frames, { duration: ms, easing: `steps(${steps})` }).finished.then(() => undefined, () => undefined);
  };
  const hum = (on: boolean): Animation | null => {
    const m = machineRef.current;
    if (!on || !m || prefersReduced()) return null;
    return m.animate([{ translate: "0 0" }, { translate: "0.4px 0" }, { translate: "-0.3px 0.2px" }, { translate: "0 0" }], { duration: 120, iterations: Infinity, easing: "steps(4)" });
  };

  /** A fresh sheet rises out of the top slot (or the same one comes back, when a print is stopped or jams). */
  const paperBack = async (fromCurrent: boolean) => {
    const p = paperRef.current;
    if (!p) return;
    const from = fromCurrent ? getComputedStyle(p).translate : "0 104%";
    p.getAnimations().forEach((a) => a.cancel());
    if (prefersReduced()) return;
    await p
      .animate([{ translate: from && from !== "none" ? from : "0 104%" }, { translate: "0 0" }], { duration: SHEET_BACK.duration, easing: SHEET_BACK.easing })
      .finished.catch(() => undefined);
  };

  // ---------- printing ----------
  const run = useCallback(async () => {
    // a second press while printing stops it
    if (busyRef.current) {
      abortRef.current = true;
      return;
    }
    const curated = selection && picked.includes(selection.id) ? selection : null;
    const text = curated ? "" : brief;
    const ids = [...picked];
    if (!text.trim() && !ids.length) {
      textareaRef.current?.focus();
      return;
    }
    busyRef.current = true;
    abortRef.current = false;
    if (restRef.current) {
      clearTimeout(restRef.current);
      restRef.current = null;
    }
    setBusy(true);
    setJam(null);
    thunk();
    const answer: { o?: Outcome } = {};
    if (curated) {
      const data = curatedAnswer(curated, cards);
      answer.o = data ? { ok: true, data } : { ok: false, message: "Something jammed. Try again, or browse all work." };
    } else void ask(text, topicsToSignals(ids)).then((o) => (answer.o = o));
    const labels = ids.map((id) => topics.find((t) => t.id === id)?.label ?? id);
    const stopped = () => abortRef.current;

    // 1. read: the request passes the reading light into the slot; the words the printer knows are marked
    setReading(text.trim() ? markedHtml(text.trim()) : "");
    setDisp({ l1: curated ? "Loading my picks" : text.trim().length > 200 ? "Reading the job description" : "Reading your request", seg: 0 });
    setLive("Printing.");
    await sleep(READ_DELAY);
    const light = lightRef.current;
    const flicker = light && !prefersReduced() ? light.animate([{ opacity: 0.65 }, { opacity: 1 }, { opacity: 0.8 }], { duration: 240, iterations: Infinity }) : null;
    if (light) light.style.opacity = "1";
    const paper = paperRef.current;
    const pass =
      paper && !prefersReduced()
        ? paper.animate([{ translate: "0 0" }, { translate: "0 6px", offset: 0.08 }, { translate: "0 8px", offset: 0.14 }, { translate: "0 104%" }], {
            duration: PASS_MS,
            easing: "cubic-bezier(0.5, 0, 0.35, 1)",
            fill: "forwards",
          })
        : null;
    const lightOff = () => {
      flicker?.cancel();
      if (light) light.style.opacity = "0";
    };
    const stop = async () => {
      lightOff();
      pass?.pause();
      setDisp({ l1: "Stopped", l2: "Your request is back" });
      await paperBack(true);
      setReading(null);
      finish();
      rest({ l1: "Stopped", l2: "Your request is back" }, 2200);
    };
    const finish = () => {
      busyRef.current = false;
      abortRef.current = false;
      setBusy(false);
    };
    for (let t = 0; t < PASS_MS; t += 100) {
      if (stopped()) return stop();
      await sleep(100);
    }
    lightOff();

    // 2. wait: only while the answer is still out, the second line leafs through the case files
    let n = 0;
    while (!answer.o) {
      if (stopped()) return stop();
      setDisp({ l1: "Reading your request", l2: projectNames[n++ % projectNames.length], seg: 0, instant: true });
      await new Promise((r) => setTimeout(r, LEAF_MS));
    }
    const o = answer.o;

    // a failed print: the paper jams, the request comes back, and there's a way out
    if (!o.ok) {
      track("printed", { skills: labels, brief_chars: text.trim().length, ok: false, source: null, asked: [], cards: [], start_here: false });
      setJam({ message: o.message, kind: o.kind });
      await shake(1.5, 240, 4);
      setDisp({ l1: "Paper jam", l2: "Try again in a moment" });
      await paperBack(true);
      setReading(null);
      setLive(o.kind ? o.message : `${JAM_LINE.before}${JAM_LINE.all}${JAM_LINE.or}${JAM_LINE.email}${JAM_LINE.after}`);
      finish();
      return;
    }

    const data = o.data;
    const startHere = data.matched === "start-here";
    const sheets = data.sheets.map((s) => cards[cardKey(s.project, s.section)]).filter((c): c is SheetCard => Boolean(c));
    // what was asked for and what printed; a brief's words are never sent, only how long it was
    track("printed", {
      skills: labels,
      brief_chars: text.trim().length,
      ok: true,
      source: data.source,
      asked: data.asked,
      cards: sheets.map((c) => cardKey(c.project, c.section)),
      start_here: startHere,
    });
    // The chosen cards are rendered on the server while the display runs. If that fails, a sheet falls back to its words.
    const printing: Promise<Record<string, PrintedCard>> = sheets.length
      ? printCards(sheets.map((c) => cardKey(c.project, c.section))).catch(() => ({}))
      : Promise.resolve({});
    const projects = new Set(sheets.map((c) => c.project)).size;

    if (curated) {
      setDisp({ l1: curated.label, l2: `${say(sheets.length)} sheets selected`, seg: 2 });
      await sleep(380);
      if (stopped()) return stop();
      setDisp({ l1: curated.label, l2: "Printing", seg: 3 });
    } else if (startHere) {
      // 3'. nothing understood: a hiccup, not a jam. The machine shudders twice and says why, then prints where to start.
      await shake(1.2, 420, 6);
      setDisp({ l1: "No role or skill found", l2: "In your request", seg: 1 });
      await sleep(900);
      if (stopped()) return stop();
      setDisp({ l1: "Printing where to start", l2: `${say(sheets.length)} sheets`, seg: 3 });
    } else {
      // 3. understand: each capability locks in
      const asked = labels.length ? labels : data.asked.slice(0, 2).map((sig) => SIGNAL_SHORT[sig]);
      let got = "";
      for (const a of asked) {
        got = got ? `${got}, ${a}` : a;
        setDisp({ l1: got, l2: "Understood", seg: 1 });
        await sleep(LOCK_MS);
        if (stopped()) return stop();
      }
      // 4. search: every card, then the cards that carry what was asked, then the ones chosen
      const match = Object.values(cards).filter((c) => c.signals.some((sig) => data.asked.includes(sig))).length || sheets.length;
      setDisp({ l1: got, l2: `Searching ${total} cards`, seg: 2 });
      await sleep(300);
      for (let i = 1; i <= COUNT_STEPS; i++) {
        setDisp({ l1: got, l2: `${Math.round(total - ((total - match) * i) / COUNT_STEPS)} cards match`, seg: 2, instant: true });
        await sleep(40);
        if (stopped()) return stop();
      }
      await sleep(380);
      setDisp({ l1: got, l2: `Choosing ${say(sheets.length).toLowerCase()}`, seg: 2 });
      await sleep(420);
      if (stopped()) return stop();
      // 5. print
      setDisp({
        l1: `${say(sheets.length)} ${sheets.length === 1 ? "sheet" : "sheets"} from ${say(projects).toLowerCase()} ${projects === 1 ? "project" : "projects"}`,
        l2: "Printing",
        seg: 3,
      });
    }
    const hummer = hum(true);
    const [printed] = await Promise.all([printing, sleep(360)]);
    hummer?.cancel();

    const r: Result = {
      // Cards picked without words: the title is what was picked. Words typed: what the machine understood.
      title: resultTitle({ asked: data.asked, startHere, picked: labels }),
      asked: startHere ? "" : quoteBrief(text),
      cards: sheets,
      printed,
      missing: missingLine(data.missing),
      provenance: data.source === "curated" ? `Picked by me for ${curated!.company}.` : provenanceLine(data.source, sheets.length),
      byModel: data.source === "model",
      notUnderstood: startHere && text.trim() ? notUnderstoodLine(text) : undefined,
    };
    introRef.current = true;
    setCur(0);
    setResult(r);
    setLive(r.notUnderstood ? `${r.title} ${r.notUnderstood}` : r.title);

    setReading(null);
    setBrief("");
    setPicked([]);
    await paperBack(false);
    const done: DisplayState = {
      l1: `Printed: ${say(sheets.length).toLowerCase()} ${sheets.length === 1 ? "sheet" : "sheets"}`,
      l2: startHere ? "Where to start" : `From ${say(projects).toLowerCase()} ${projects === 1 ? "project" : "projects"}`,
    };
    finish();
    rest(done, 3200);
  }, [brief, picked, cards, projectNames, total, selection, topics]);

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

  // ---------- a new print: out of the front slot, picked up, carried into the strip; the others dealt from under it ----------
  useLayoutEffect(() => {
    if (!result || !introRef.current) return;
    introRef.current = false;
    const strip = stripRef.current;
    const results = resultsRef.current;
    if (strip) strip.scrollLeft = 0;
    // A hidden element can't hold focus, so the title takes it as the results appear.
    const focusTitle = () => titleRef.current?.focus({ preventScroll: true });
    const items = strip ? (Array.from(strip.children) as HTMLElement[]) : [];
    const first = items[0];
    const out = outfeedRef.current;
    if (prefersReduced() || !first || !out || !results) {
      focusTitle();
      results?.scrollIntoView({ behavior: "auto", block: "start" });
      return;
    }
    const paperEl = first.querySelector<HTMLElement>(".s-paper");
    if (!paperEl) {
      focusTitle();
      results.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    let cancelled = false;
    // the results wait for the sheet: they appear as it is picked up
    results.style.visibility = "hidden";
    items.forEach((li) => (li.style.visibility = "hidden"));
    const fullW = paperEl.getBoundingClientRect().width;
    const fullH = paperEl.getBoundingClientRect().height;
    // the copy that comes out of the slot: the real first sheet, scaled to the slot's width
    const slot = out.getBoundingClientRect();
    const k = (slot.width * 0.94) / fullW;
    const feeder = document.createElement("div");
    feeder.className = "feed-sheet";
    feeder.setAttribute("aria-hidden", "true");
    // a picture of the sheet: its links can't be reached while it travels
    feeder.inert = true;
    feeder.style.cssText = `left:3%;width:${fullW * k}px;height:${fullH * k}px`;
    const inner = paperEl.cloneNode(true) as HTMLElement;
    inner.removeAttribute("id");
    inner.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
    inner.style.cssText = `width:${fullW}px;transform:scale(${k});transform-origin:0 0;margin:0`;
    feeder.appendChild(inner);
    out.appendChild(feeder);
    const run = async () => {
      // a thermal printer feeds in visible steps
      await feeder.animate([{ translate: "0 -101%" }, { translate: "0 -3%" }], { duration: FEED_MS, easing: "steps(16, end)", fill: "forwards" }).finished.catch(() => undefined);
      await sleep(200);
      if (cancelled) return;
      const from = feeder.getBoundingClientRect();
      const to = first.getBoundingClientRect();
      const sx = from.left + scrollX;
      const sy = from.top + scrollY;
      const tx = to.left + scrollX;
      const ty = to.top + scrollY;
      const fly = document.createElement("div");
      fly.className = "fly-sheet";
      fly.setAttribute("aria-hidden", "true");
      fly.inert = true;
      inner.style.transform = "none";
      fly.appendChild(inner);
      document.body.appendChild(fly);
      feeder.remove();
      results.style.visibility = "";
      const tilt = rnd(-1.6, 1.6);
      const flight = fly.animate(
        [
          { transform: `translate(${sx}px, ${sy}px) scale(${k}) rotate(0deg)` },
          { transform: `translate(${(sx + tx) / 2}px, ${(sy + ty) / 2 - 30}px) scale(${(k + 1) / 2 + 0.06}) rotate(${tilt}deg)`, offset: 0.45 },
          { transform: `translate(${tx}px, ${ty}px) scale(1) rotate(0deg)` },
        ],
        { duration: FLIGHT_MS, easing: "cubic-bezier(0.3, 0.7, 0.1, 1)", fill: "forwards" },
      );
      // the page scrolls with the sheet, so the title ends at the top
      const margin = parseFloat(getComputedStyle(results).scrollMarginTop) || 0;
      const target = Math.min(results.getBoundingClientRect().top + scrollY - margin, document.documentElement.scrollHeight - innerHeight);
      const y0 = scrollY;
      const t0 = performance.now();
      const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
      await new Promise<void>((res) => {
        const step = (now: number) => {
          const p = Math.min(1, (now - t0) / FLIGHT_MS);
          window.scrollTo(0, y0 + (target - y0) * ease(p));
          if (p < 1 && !cancelled) requestAnimationFrame(step);
          else res();
        };
        requestAnimationFrame(step);
      });
      await flight.finished.catch(() => undefined);
      if (cancelled) return;
      first.style.visibility = "";
      fly.remove();
      items.forEach((li) => (li.style.visibility = ""));
      // once every sheet can be reached, the title takes focus (the live region has already announced it)
      focusTitle();
      items.slice(1).forEach((li, i) => {
        li.style.zIndex = String(items.length - i);
        const dx = li.offsetLeft - first.offsetLeft;
        // The paper moves, not the list item: the item is the strip's snap point, and Chrome keeps the snap points it
        // measured mid-animation (every one at the first sheet), so a moved item left the strip stuck after a swipe.
        const paper = li.querySelector<HTMLElement>(".s-paper") ?? li;
        paper.animate([{ translate: `${-dx}px 0` }, { translate: "0 0" }], { duration: DEAL.duration, easing: DEAL.easing, delay: 90 * i, fill: "backwards" });
      });
      first.style.zIndex = String(items.length + 1);
    };
    void run();
    return () => {
      cancelled = true;
      feeder.remove();
      document.querySelectorAll(".fly-sheet").forEach((el) => el.remove());
      results.style.visibility = "";
      items.forEach((li) => (li.style.visibility = ""));
    };
  }, [result]);

  // Each sheet is the case page's card at its own size. Where the window is too short for the whole sheet under the
  // results title, the sheet is scaled down evenly (never below MIN_SCALE), so the card keeps its proportions.
  useLayoutEffect(() => {
    const strip = stripRef.current;
    const results = resultsRef.current;
    if (!result || !strip || !results) return;
    const fit = () => {
      const doc = document.documentElement;
      // the case page's column is measured without the scrollbar; so is the card here
      doc.style.setProperty("--doc-w", `${doc.clientWidth}px`);
      const papers = Array.from(strip.querySelectorAll<HTMLElement>(".s-paper"));
      if (!papers.length) return;
      if (window.innerWidth < 761) {
        strip.style.removeProperty("--s");
        strip.style.removeProperty("--sheet-h");
        return;
      }
      const h = Math.max(...papers.map((el) => el.offsetHeight));
      const above = papers[0]!.parentElement!.getBoundingClientRect().top - results.getBoundingClientRect().top;
      const margin = parseFloat(getComputedStyle(results).scrollMarginTop) || 0;
      const room = window.innerHeight - margin - above - FOOT_ROOM;
      // rounded down, so the sheet never ends a fraction of a pixel past the window
      const scale = Math.max(MIN_SCALE, Math.min(1, Math.floor((room / h) * 1000) / 1000));
      strip.style.setProperty("--s", String(scale));
      strip.style.setProperty("--sheet-h", `${h}px`);
    };
    fit();
    const ro = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(fit);
    strip.querySelectorAll(".s-paper").forEach((el) => ro?.observe(el));
    window.addEventListener("resize", fit);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, [result]);

  // Which sheet is at the front of the strip, once it has stayed there a moment (not each one swiped past).
  useEffect(() => {
    const c = result?.cards[cur];
    if (!c) return;
    const t = setTimeout(() => track("sheet_viewed", { card: cardKey(c.project, c.section), index: cur + 1, of: result!.cards.length }), 800);
    return () => clearTimeout(t);
  }, [cur, result]);

  // The sheets sit side by side on wide screens: arrows, keys and swiping move along the strip; the counter follows the scroll.
  const n = result?.cards.length ?? 0;
  const runs = projectRuns(result?.cards ?? []);
  const goSheet = useCallback(
    (i: number) => {
      const strip = stripRef.current;
      if (!strip || !n) return;
      const k = Math.max(0, Math.min(n - 1, i));
      const el = strip.children[k] as HTMLElement | undefined;
      const first = strip.children[0] as HTMLElement | undefined;
      // along the strip only: the page itself stays where it is, with the title over the sheet
      if (el && first) strip.scrollTo({ left: el.offsetLeft - first.offsetLeft, behavior: prefersReduced() ? "auto" : "smooth" });
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
  const working = busy;
  const size = working || brief.length > 120 || picked.length ? "full" : focused || brief ? "focus" : "idle";
  const state = working ? "working" : ready ? "ready" : "idle";

  return (
    <>
      <section className="skills" aria-labelledby="skills-title">
        <h2 className="sr-only" id="skills-title">
          Skills
        </h2>
        <ul className="topics" style={{ "--topics": topics.length } as CSSProperties}>
          {topics.map((t, i) => {
            const brand = t.id === selection?.id ? selection.brand : undefined;
            return (
              <li key={t.id}>
                <button
                  type="button"
                  className={`topic${brand ? " topic--application" : ""}`}
                  style={brand ? { "--topic-border": brand.color } as CSSProperties : undefined}
                  aria-pressed={picked.includes(t.id)}
                  onClick={(e) => toggle(t.id, e.currentTarget)}
                >
                  <small aria-hidden="true">{pad2(i + 1)}</small>
                  <b className={brand ? "topic-brand" : undefined}>
                    {brand && selection ? (
                      <>
                        <span>Picked for</span>
                        <Image {...brand.logo} alt={selection.company} unoptimized />
                      </>
                    ) : t.label}
                  </b>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="stage" ref={stageRef}>
        <div ref={machineRef} className={`machine${ready ? " ready" : ""}${jam ? " jammed" : ""}`} data-state={state}>
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
              <div className={`field${(!curatedPicked && brief) || focused ? " on" : ""}`} hidden={reading !== null}>
                <label htmlFor="brief" className="sr-only">
                  Describe the role or paste a job description.
                </label>
                <textarea
                  ref={textareaRef}
                  id="brief"
                  name="brief"
                  maxLength={BRIEF_MAX}
                  value={curatedPicked ? "" : brief}
                  onChange={(e) => {
                    setBrief(e.target.value);
                    setPicked((p) => p.filter((id) => id !== selection?.id));
                  }}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onKeyDown={onKeyDown}
                />
                <div className="ghost" aria-hidden="true">
                  {ghostText}
                </div>
              </div>
              {reading !== null && reading !== "" && (
                // the request as the printer reads it (the same words; the ones it recognises marked)
                <div className="read" aria-hidden="true" dangerouslySetInnerHTML={{ __html: reading }} />
              )}
              <input type="hidden" name="topics" value={topicsToSignals(picked).join(",")} />
              <div className="chips" aria-label="Selected skills" role="group" hidden={!picked.length}>
                {picked.map((id) => {
                  const label = topics.find((t) => t.id === id)?.label ?? id;
                  return (
                    <button key={id} type="button" aria-label={`Remove ${label}`} disabled={working} onClick={() => toggle(id)}>
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </form>
          {/* The machine is lit by the room: the day render in light mode, the lamp-lit one in dark mode; the jam replaces both. */}
          <Image className="photo photo-day" src="/shell/printer.webp" alt="" width={1979} height={595} priority draggable={false} sizes="(min-width: 800px) 760px, 100vw" />
          <Image className="photo photo-night" src="/shell/printer-night.webp" alt="" width={1979} height={595} draggable={false} sizes="(min-width: 800px) 760px, 100vw" />
          {jam && (
            <>
              <Image className="photo photo-day photo-jam" src="/shell/printer-jam.webp" alt="" width={1979} height={595} draggable={false} sizes="(min-width: 800px) 760px, 100vw" />
              <Image className="photo photo-night photo-jam" src="/shell/printer-jam-night.webp" alt="" width={1979} height={595} draggable={false} sizes="(min-width: 800px) 760px, 100vw" />
            </>
          )}
          <span className="slot-light" ref={lightRef} aria-hidden="true" />
          <Display {...disp} />
          <span className="halo" aria-hidden="true" />
          <span className="socket" aria-hidden="true" />
          <button
            ref={keyRef}
            className="key"
            type="submit"
            form="order"
            aria-label={working ? "Stop printing" : "Print"}
            aria-busy={working || undefined}
            onPointerDown={keyDown}
            onPointerUp={keyUp}
            onPointerLeave={(e) => e.buttons && keyUp()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                keyDown();
                setTimeout(keyUp, 110);
              }
            }}
            onClick={(e) => {
              // while printing, the key stops the print instead of submitting the form again
              if (busyRef.current) {
                e.preventDefault();
                abortRef.current = true;
              }
            }}
          >
            {/* the key's two faces swap with the theme in CSS; tiny, so plain images */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="key-day" src="/shell/printer-key.webp" alt="" draggable={false} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="key-night" src="/shell/printer-night-key.webp" alt="" draggable={false} loading="lazy" />
          </button>
          <span className="engrave" aria-hidden="true">
            Print
          </span>
          <div className="outfeed" ref={outfeedRef} aria-hidden="true" />
        </div>
      </div>

      {jam && (
        <p className="jam-note">
          {jam.kind ? (
            jam.message
          ) : (
            <>
              {JAM_LINE.before}
              <Link href="/work">{JAM_LINE.all}</Link>
              {JAM_LINE.or}
              <a href={`mailto:${contactEmail}`}>{JAM_LINE.email}</a>
              {JAM_LINE.after}
            </>
          )}
        </p>
      )}

      <div className="alt" hidden={Boolean(result || jam)}>
        <Pill kind="all" href="/work" label="Or browse all work" />
      </div>

      {result && (
        <section className="results" ref={resultsRef} aria-labelledby="r-title">
          <div className="rhead">
            <div>
              <h2 id="r-title" ref={titleRef} tabIndex={-1}>
                {result.title}
              </h2>
              {result.notUnderstood && <p className="not-found">{result.notUnderstood}</p>}
              {result.asked && <p>{result.asked}</p>}
              {result.provenance && (
                <p className="provenance">
                  {result.provenance}
                  {result.byModel && (
                    <>
                      {" "}
                      <Link href="/work">{BROWSE_ALL}</Link>
                    </>
                  )}
                </p>
              )}
            </div>
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
              {result.cards.map((card, i) => {
                const pc = result.printed[cardKey(card.project, card.section)];
                return (
                  <li key={cardKey(card.project, card.section)} className="sheet">
                    <article className="s-paper" aria-labelledby={pc?.headingId ?? `sh-${i}`}>
                      <Sheet card={card} index={i} total={result.cards.length} headingId={`sh-${i}`} run={runs[i]} printed={pc?.node} />
                    </article>
                  </li>
                );
              })}
            </ol>
          )}
          {n > 1 && (
            <div className="deckbar">
              <button type="button" aria-label="Previous sheet" disabled={cur === 0} onClick={() => goSheet(cur - 1)}>
                <DrawnArrow kind="still" className="ga-back" />
              </button>
              <span>
                {pad2(cur + 1)} / {pad2(n)}
              </span>
              <button type="button" aria-label="Next sheet" disabled={cur === n - 1} onClick={() => goSheet(cur + 1)}>
                <DrawnArrow kind="still" />
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
