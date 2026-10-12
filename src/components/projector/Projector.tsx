"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";
import { AskErrorSchema, AskResponseSchema, BRIEF_MAX, type AskResponse } from "@/lib/ask/schema";
import { cardKey, type CardIndex, type SheetCard } from "@/lib/cards";
import { SIGNAL_SHORT, missingLine, pad2, provenanceLine } from "@/lib/printed";
import { BLANK_HINT, ERRORS, STATUS, beamPolygon, quoteCard, type Point } from "@/lib/projector";

/*
 * The projector. Four stages, each a behaviour of the machine rather than a screen:
 *   1. Request    – a card from the hand flies into the magazine (or you write on the blank one); the lamp turns green.
 *   2. Reading    – the red button: the machine takes a knock, the card drops into the gate, the lamp turns amber and
 *                   the status line follows the real request, never a fake progress bar.
 *   3. Projecting – the room goes dark, the machine steps back, the lens lights and the work is projected on the wall,
 *                   one slide per project.
 *   4. Again      – change the card: the lights come up and the card comes back out.
 * Plain Web Animations API, no library. With reduced motion everything happens at once (the room still darkens).
 */

type Props = {
  cards: CardIndex;
  /** Server-rendered evidence for each section that shows on a slide, keyed by cardKey. */
  media: Record<string, ReactNode>;
  /** The printed cards, as a recruiter would ask. */
  questions: string[];
  name: string;
  location: string;
};

type Phase = "light" | "reading" | "dark";
/** Which card is the request: a printed card by index, the blank card, or none. */
type Choice = number | "blank" | null;

type Slide = SheetCard & { why: string };
type Result = { line: string; quote: string; slides: Slide[]; missing: string; provenance: string };
type Beam = { points: string; from: Point; to: Point; w: number; h: number };
type Outcome = { ok: true; data: AskResponse } | { ok: false; message: string };

const OUT = "cubic-bezier(0.16, 1, 0.3, 1)";
const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";
/** The paper card's proportions (public/projector/card.webp). */
const CARD_RATIO = 900 / 499;
/** The magazine's card positions, as translateY of the slot card (anchored to the magazine's front lip). */
const POS = { above: "-8%", seated: "52%", out: "-70%" } as const;
const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, reduced() ? 0 : ms));
const rnd = (a: number, b: number) => a + Math.random() * (b - a);
/** Run an animation unless motion is reduced; resolves when it ends either way. */
function play(el: Element | null | undefined, frames: Keyframe[], opts: KeyframeAnimationOptions): Promise<void> {
  if (!el || reduced()) return Promise.resolve();
  return el
    .animate(frames, opts)
    .finished.then(() => undefined)
    .catch(() => undefined);
}

async function ask(brief: string): Promise<Outcome> {
  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brief: brief.slice(0, BRIEF_MAX) }),
    });
    const json: unknown = await res.json().catch(() => null);
    if (res.ok) {
      const parsed = AskResponseSchema.safeParse(json);
      return parsed.success ? { ok: true, data: parsed.data } : { ok: false, message: ERRORS.jammed };
    }
    if (res.status === 429) return { ok: false, message: ERRORS.rateLimited };
    const err = AskErrorSchema.safeParse(json);
    return { ok: false, message: err.success && err.data.error === "invalid" ? err.data.message : ERRORS.jammed };
  } catch {
    return { ok: false, message: ERRORS.offline };
  }
}

/** A card's face: the question, and its number in the corner. Used in the hand, in flight and in the magazine. */
function Face({ text, no, typed }: { text: string; no: string; typed?: boolean }) {
  return (
    <>
      <span className={typed ? "pj-q pj-q-typed" : "pj-q"}>{text}</span>
      <span className="pj-no" aria-hidden="true">
        {no}
      </span>
    </>
  );
}

export function Projector({ cards, media, questions, name, location }: Props) {
  const [phase, setPhase] = useState<Phase>("light");
  const [choice, setChoice] = useState<Choice>(null);
  /** The card that is physically in the magazine (it can differ from `choice` while the blank one is being written). */
  const [inMag, setInMag] = useState<Choice>(null);
  /** The card whose place in the hand is empty: it is in the magazine, or on its way there. */
  const [away, setAway] = useState<Choice>(null);
  const [brief, setBrief] = useState("");
  const [status, setStatus] = useState<string>(STATUS.idle);
  const [fault, setFault] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [cur, setCur] = useState(0);
  const [beam, setBeam] = useState<Beam | null>(null);
  const [live, setLive] = useState("");

  const busy = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const handRef = useRef<HTMLFormElement>(null);
  const formRef = handRef;
  const stageRef = useRef<HTMLDivElement>(null);
  const machineRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const magRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLSpanElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const wallRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const blankRef = useRef<HTMLTextAreaElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const swipe = useRef<{ x: number; y: number } | null>(null);

  const BLANK = questions.length;
  const textOf = useCallback((c: Choice) => (c === "blank" ? brief.trim() : c === null ? "" : (questions[c] ?? "")), [brief, questions]);
  const noOf = (c: Choice) => pad2((c === "blank" || c === null ? BLANK : c) + 1);

  // ---------- review switch: ?type=serif shows the display type in Instrument Serif ----------
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("type");
    if (t === "serif" && rootRef.current) rootRef.current.dataset.type = "serif";
  }, []);

  // ---------- the room: the whole page dims with it (header and footer read these tokens) ----------
  useEffect(() => {
    const html = document.documentElement;
    if (phase === "dark") html.dataset.room = "dark";
    else delete html.dataset.room;
    return () => {
      delete html.dataset.room;
    };
  }, [phase]);

  // ---------- small physical moments ----------
  const knock = useCallback((strength = 1) => {
    void play(
      machineRef.current,
      [
        { translate: "0 0", rotate: "0deg" },
        { translate: `0 ${rnd(1.5, 2.8) * strength}px`, rotate: `${rnd(-0.22, 0.22) * strength}deg`, offset: 0.3 },
        { translate: "0 0", rotate: "0deg" },
      ],
      { duration: 420, easing: SPRING },
    );
  }, []);


  /** A card leaves the hand and flies to just above the magazine. */
  const flyIn = useCallback(async (from: HTMLElement, text: string, no: string, typed: boolean) => {
    if (reduced()) return;
    // On a phone the machine can be out of view (above the hand): bring it in first, so the card is seen going in.
    const mag0 = machineRef.current?.getBoundingClientRect();
    if (mag0 && (mag0.top < 0 || mag0.bottom > window.innerHeight)) {
      machineRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
      await sleep(420);
    }
    const a = from.getBoundingClientRect();
    // Just above the magazine: the end of every flight.
    const m = magRef.current?.getBoundingClientRect();
    const h = m ? m.width / CARD_RATIO : 0;
    const b = m ? { left: m.left, top: m.bottom - h * 1.08, width: m.width } : null;
    if (!b || !a.width) return;
    const fly = document.createElement("div");
    fly.className = `pj-card pj-fly${typed ? " pj-fly-typed" : ""}`;
    fly.setAttribute("aria-hidden", "true");
    const q = document.createElement("span");
    q.className = typed ? "pj-q pj-q-typed" : "pj-q";
    q.textContent = text;
    const n = document.createElement("span");
    n.className = "pj-no";
    n.textContent = no;
    fly.append(q, n);
    Object.assign(fly.style, { left: `${a.left}px`, top: `${a.top}px`, width: `${a.width}px`, height: `${a.height}px` });
    document.body.appendChild(fly);
    const s = b.width / a.width;
    const dx = b.left - a.left;
    const dy = b.top - a.top;
    const lift = Math.min(150, Math.abs(dy) * 0.3 + 48);
    const tilt = rnd(-6, 6);
    await fly
      .animate(
        [
          { transform: "translate(0, 0) scale(1) rotate(0deg)" },
          { transform: `translate(${dx * 0.5}px, ${Math.min(dy, 0) * 0.5 - lift}px) scale(${(1 + s) / 2}) rotate(${tilt}deg)`, offset: 0.5 },
          { transform: `translate(${dx}px, ${dy}px) scale(${s}) rotate(0deg)` },
        ],
        { duration: 700, easing: "cubic-bezier(0.45, 0, 0.2, 1)", fill: "forwards" },
      )
      .finished.catch(() => undefined);
    fly.remove();
  }, []);

  /** The card shown in the magazine drops into its slot with a small knock. Call right after it is rendered. */
  const seat = useCallback(async () => {
    const slot = slotRef.current;
    slot?.getAnimations().forEach((x) => x.cancel());
    await play(slot, [{ transform: `translateY(${POS.above})` }, { transform: `translateY(${POS.seated})` }], {
      duration: 240,
      easing: "cubic-bezier(0.5, 0, 0.75, 0)",
    });
    knock(0.6);
  }, [knock]);

  /** The card in the magazine rises out of it. The state is cleared by the caller. */
  const lift = useCallback(async () => {
    await play(
      slotRef.current,
      [
        { transform: `translateY(${POS.seated})`, opacity: 1 },
        { transform: `translateY(${POS.out})`, opacity: 0 },
      ],
      { duration: 300, easing: OUT, fill: "forwards" },
    );
  }, []);

  /** A card comes back to its place in the hand. */
  const dropBack = useCallback(
    (c: Choice) => {
      if (c === null) return;
      void play(cardRefs.current[c === "blank" ? BLANK : c], [{ transform: "translateY(-16px)", opacity: 0 }, { transform: "none", opacity: 1 }], {
        duration: 440,
        easing: SPRING,
      });
    },
    [BLANK],
  );

  /** Take the card out of the magazine and put it back in the hand. */
  const eject = useCallback(
    async (c: Choice) => {
      await lift();
      flushSync(() => {
        setInMag(null);
        setAway(null);
      });
      slotRef.current?.getAnimations().forEach((x) => x.cancel());
      dropBack(c);
    },
    [lift, dropBack],
  );

  // ---------- 1. request ----------
  /** A card on its way into the magazine: pressing the button meanwhile waits for it to land. */
  const landing = useRef<Promise<void> | null>(null);

  const loadCard = useCallback(
    async (i: number) => {
      setFault(false);
      const prev = inMag;
      const el = cardRefs.current[i];
      setChoice(i);
      setStatus(STATUS.ready);
      setLive(`Card in the projector: ${questions[i]}`);
      // The card leaves the hand at once (its place stays empty); the one in the magazine comes back out meanwhile.
      const rising = prev !== null ? lift() : Promise.resolve();
      flushSync(() => setAway(i));
      if (prev !== null) dropBack(prev);
      await Promise.all([el ? flyIn(el, questions[i] ?? "", pad2(i + 1), false) : Promise.resolve(), rising]);
      flushSync(() => setInMag(i));
      await seat();
    },
    [inMag, questions, lift, dropBack, flyIn, seat],
  );

  const load = (i: number) => {
    if (busy.current || phase !== "light" || inMag === i) return;
    busy.current = true;
    landing.current = loadCard(i).finally(() => {
      busy.current = false;
      landing.current = null;
    });
  };

  const onBrief = (v: string) => {
    setBrief(v);
    setFault(false);
    if (v.trim()) {
      if (typeof inMag === "number" && !busy.current) void eject(inMag);
      if (choice !== "blank") {
        setChoice("blank");
        setStatus(STATUS.ready);
      }
    } else if (choice === "blank") {
      setChoice(null);
      setStatus(STATUS.idle);
    }
  };

  // ---------- the beam: from the lens to the whole slide, measured, so it holds at every size ----------
  const measure = useCallback(() => {
    const root = rootRef.current;
    const lens = lensRef.current;
    const screen = screenRef.current;
    if (!root || !lens || !screen) return;
    const R = root.getBoundingClientRect();
    const L = lens.getBoundingClientRect();
    const S = screen.getBoundingClientRect();
    const from = { x: L.left + L.width / 2 - R.left, y: L.top + L.height / 2 - R.top };
    const box = { left: S.left - R.left + 6, top: S.top - R.top + 6, right: S.right - R.left - 6, bottom: S.bottom - R.top - 6 };
    const pts = beamPolygon(from, box);
    setBeam({
      points: pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" "),
      from,
      to: { x: (box.left + box.right) / 2, y: (box.top + box.bottom) / 2 },
      w: R.width,
      h: R.height,
    });
  }, []);

  useLayoutEffect(() => {
    if (phase !== "dark" || !result) return;
    const root = rootRef.current;
    if (!root || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(root);
    return () => ro.disconnect();
  }, [phase, result, measure]);

  // ---------- 2. reading, then 3. projecting ----------
  const project = useCallback(async () => {
    if (landing.current) await landing.current;
    if (busy.current || phase !== "light") return;
    let c: Choice = choice;
    if (c === null && brief.trim()) c = "blank";
    if (c === null) {
      setStatus(STATUS.idle);
      blankRef.current?.focus();
      void play(cardRefs.current[BLANK], [{ translate: "0 0" }, { translate: "-5px 0" }, { translate: "4px 0" }, { translate: "0 0" }], {
        duration: 320,
        easing: "ease-in-out",
      });
      return;
    }
    const text = textOf(c);
    if (!text) return;
    busy.current = true;
    setFault(false);

    // The blank card goes in now: it was written in the hand.
    if (c === "blank" && inMag !== "blank") {
      if (inMag !== null) await eject(inMag);
      const el = cardRefs.current[BLANK];
      flushSync(() => setAway("blank"));
      if (el) await flyIn(el, text, pad2(BLANK + 1), true);
      flushSync(() => setInMag("blank"));
      await seat();
      await sleep(120);
    }

    knock(1.3);
    flushSync(() => setPhase("reading"));
    setStatus(STATUS.reading);
    setLive(STATUS.reading);
    const pending = ask(text);
    const later = setTimeout(() => setStatus(STATUS.finding), reduced() ? 0 : 750);
    const [outcome] = await Promise.all([pending, sleep(950)]);
    clearTimeout(later);

    if (!outcome.ok) {
      setPhase("light");
      setStatus(outcome.message);
      setLive(outcome.message);
      setFault(true);
      busy.current = false;
      return;
    }

    const slides: Slide[] = outcome.data.sheets
      .map((s) => {
        const card = cards[cardKey(s.project, s.section)];
        return card ? { ...card, why: SIGNAL_SHORT[s.signal] } : null;
      })
      .filter((s): s is Slide => Boolean(s));
    if (!slides.length) {
      setPhase("light");
      setStatus(ERRORS.jammed);
      setFault(true);
      busy.current = false;
      return;
    }
    const r: Result = {
      line: outcome.data.line,
      quote: quoteCard(text),
      slides,
      missing: missingLine(outcome.data.missing),
      provenance: provenanceLine(outcome.data.source, slides.length),
    };

    // 3. The copy and the hand step out of the light, then the room goes dark and the machine steps back.
    await Promise.all(
      [introRef.current, handRef.current, rootRef.current?.querySelector(".pj-all")].map((el) =>
        play(el, [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(-8px)" }], { duration: 320, easing: "ease-in", fill: "forwards" }),
      ),
    );
    const first = stageRef.current?.getBoundingClientRect();
    flushSync(() => {
      setResult(r);
      setCur(0);
      setPhase("dark");
    });
    window.scrollTo({ top: 0, behavior: "instant" });
    const stage = stageRef.current;
    const last = stage?.getBoundingClientRect();
    [introRef.current, handRef.current].forEach((el) => el?.getAnimations().forEach((a) => a.cancel()));
    if (stage && first && last && !reduced()) {
      const sx = first.width / last.width;
      await stage
        .animate(
          [
            { transformOrigin: "0 0", transform: `translate(${first.left - last.left}px, ${first.top - last.top}px) scale(${sx})` },
            { transformOrigin: "0 0", transform: "none" },
          ],
          { duration: 900, easing: OUT },
        )
        .finished.catch(() => undefined);
    }
    // The lens lights, the beam reaches the wall, the slide flickers on.
    measure();
    rootRef.current?.setAttribute("data-lens", "on");
    await play(wallRef.current, [{ opacity: 0 }, { opacity: 1 }], { duration: 420, easing: "ease-out" });
    void play(
      screenRef.current,
      [{ opacity: 0 }, { opacity: 0.55, offset: 0.25 }, { opacity: 0.2, offset: 0.45 }, { opacity: 0.9, offset: 0.7 }, { opacity: 1 }],
      { duration: 520, easing: "steps(6, end)" },
    );
    titleRef.current?.focus({ preventScroll: true });
    setLive(`${r.line} Slide 1 of ${slides.length}: ${slides[0]!.projectTitle}, ${slides[0]!.title}.`);
    busy.current = false;
  }, [phase, choice, brief, BLANK, textOf, knock, inMag, eject, flyIn, seat, cards, measure]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void project();
  };

  const onBlankKey = (e: ReactKeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void project();
    }
    if (e.key === "Escape") onBrief("");
  };

  // ---------- the slides ----------
  const n = result?.slides.length ?? 0;
  const show = useCallback(
    async (i: number) => {
      if (!result || busy.current) return;
      const k = Math.max(0, Math.min(n - 1, i));
      if (k === cur) return;
      busy.current = true;
      const dir = k > cur ? 1 : -1;
      // The carousel advances: the light dips, the next slide drops into the gate.
      knock(0.5);
      await play(screenRef.current, [{ opacity: 1 }, { opacity: 0.08 }], { duration: 140, easing: "ease-in", fill: "forwards" });
      flushSync(() => setCur(k));
      screenRef.current?.getAnimations().forEach((a) => a.cancel());
      const s = result.slides[k]!;
      setLive(`Slide ${k + 1} of ${n}: ${s.projectTitle}, ${s.title}.`);
      await play(
        screenRef.current,
        [
          { opacity: 0.1, transform: `translateX(${dir * 14}px)` },
          { opacity: 0.85, offset: 0.45 },
          { opacity: 0.6, offset: 0.6 },
          { opacity: 1, transform: "translateX(0)" },
        ],
        { duration: 340, easing: OUT },
      );
      busy.current = false;
    },
    [result, n, cur, knock],
  );

  // Keys in the dark room: arrows move along the slides, Escape brings the lights up.
  const againRef = useRef<() => void>(() => undefined);
  useEffect(() => {
    if (phase !== "dark") return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest("textarea, input, video")) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        void show(cur + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        void show(cur - 1);
      } else if (e.key === "Escape") againRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, show, cur]);

  const onDown = (e: ReactPointerEvent) => {
    if (e.pointerType === "mouse") return;
    swipe.current = { x: e.clientX, y: e.clientY };
  };
  const onUp = (e: ReactPointerEvent) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(e.clientY - s.y) * 1.4) void show(cur + (dx < 0 ? 1 : -1));
  };

  // ---------- 4. again ----------
  const again = useCallback(async () => {
    if (busy.current || phase !== "dark") return;
    busy.current = true;
    const back = inMag;
    rootRef.current?.removeAttribute("data-lens");
    await play(wallRef.current, [{ opacity: 1 }, { opacity: 0 }], { duration: 260, easing: "ease-in", fill: "forwards" });
    const first = stageRef.current?.getBoundingClientRect();
    flushSync(() => {
      setResult(null);
      setBeam(null);
      setPhase("light");
      setChoice(null);
      setStatus(STATUS.idle);
    });
    window.scrollTo({ top: 0, behavior: "instant" });
    const stage = stageRef.current;
    const last = stage?.getBoundingClientRect();
    void play(introRef.current, [{ opacity: 0 }, { opacity: 1 }], { duration: 500, delay: 250, easing: "ease-out", fill: "backwards" });
    void play(handRef.current, [{ opacity: 0 }, { opacity: 1 }], { duration: 500, delay: 350, easing: "ease-out", fill: "backwards" });
    if (stage && first && last && !reduced()) {
      const sx = first.width / last.width;
      await stage
        .animate(
          [
            { transformOrigin: "0 0", transform: `translate(${first.left - last.left}px, ${first.top - last.top}px) scale(${sx})` },
            { transformOrigin: "0 0", transform: "none" },
          ],
          { duration: 800, easing: OUT },
        )
        .finished.catch(() => undefined);
    }
    if (back !== null) await eject(back);
    setLive("The lights are up. Choose a card.");
    const focusEl = back === "blank" || back === null ? blankRef.current : (cardRefs.current[back] as HTMLElement | null);
    focusEl?.focus({ preventScroll: true });
    busy.current = false;
  }, [phase, inMag, eject]);
  useEffect(() => {
    againRef.current = () => void again();
  }, [again]);

  // ---------- render ----------
  const loadedText = inMag === null ? "" : inMag === "blank" ? brief.trim() : (questions[inMag] ?? "");
  const lamp = fault ? "fault" : phase === "reading" ? "busy" : phase === "dark" ? "on" : choice !== null ? "ready" : "off";
  const slotPos = phase === "light" ? "seated" : "gate";
  const slides = result?.slides ?? [];

  return (
    <div className="pj" ref={rootRef} data-phase={phase} data-ready={choice !== null || undefined}>
      <div className="pj-bg" aria-hidden="true">
        <i className="pj-bg-light" />
        <i className="pj-bg-dark" />
      </div>

      {phase === "dark" && beam && (
        <svg className="pj-beam" aria-hidden="true" width={beam.w} height={beam.h} viewBox={`0 0 ${beam.w} ${beam.h}`}>
          <defs>
            <linearGradient id="pj-beam-g" gradientUnits="userSpaceOnUse" x1={beam.from.x} y1={beam.from.y} x2={beam.to.x} y2={beam.to.y}>
              <stop offset="0" style={{ stopColor: "var(--light-hot)", stopOpacity: 0.85 }} />
              <stop offset="0.14" style={{ stopColor: "var(--light)", stopOpacity: 0.4 }} />
              <stop offset="1" style={{ stopColor: "var(--light)", stopOpacity: 0.06 }} />
            </linearGradient>
            <filter id="pj-soft" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="9" />
            </filter>
          </defs>
          <polygon points={beam.points} fill="url(#pj-beam-g)" filter="url(#pj-soft)" />
        </svg>
      )}

      {/* 1. The request */}
      <div className="pj-intro" ref={introRef}>
        <h1 id="pj-title" className="pj-h1">
          Ask me anything about my work.
        </h1>
        <p className="pj-lede">
          <b>
            I&apos;m {name}, a design engineer in {location}.
          </b>{" "}
          Put a card in the projector, or write your own, and the work that answers it is projected, one slide per project.
        </p>
      </div>

      <form
        className="pj-hand"
        ref={formRef}
        id="pj-form"
        action="/ask"
        method="get"
        autoComplete="off"
        aria-labelledby="pj-hand-label"
        onSubmit={onSubmit}
        inert={phase !== "light"}
      >
        <p className="pj-hand-label" id="pj-hand-label">
          Pick a card, or write on the blank one
        </p>
        <ol className="pj-stack">
          {questions.map((q, i) => (
            <li key={q} style={{ ["--i" as string]: i }} data-out={away === i || undefined}>
              <button
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                type="submit"
                name="brief"
                value={q}
                className="pj-card"
                aria-pressed={choice === i}
                onClick={(e) => {
                  e.preventDefault();
                  load(i);
                }}
              >
                <Face text={q} no={pad2(i + 1)} />
              </button>
            </li>
          ))}
          <li style={{ ["--i" as string]: questions.length }} data-out={away === "blank" || undefined}>
            <div
              className={`pj-card pj-blank${brief ? " has-text" : ""}`}
              ref={(el) => {
                cardRefs.current[BLANK] = el;
              }}
            >
              <label htmlFor="brief" className="sr-only">
                Write your own question, or paste a job description.
              </label>
              <textarea
                ref={blankRef}
                id="brief"
                name="brief"
                maxLength={BRIEF_MAX}
                value={brief}
                spellCheck
                onChange={(e) => onBrief(e.target.value)}
                onKeyDown={onBlankKey}
              />
              <span className="pj-hint" aria-hidden="true">
                {BLANK_HINT}
              </span>
              <span className="pj-no" aria-hidden="true">
                {pad2(BLANK + 1)}
              </span>
            </div>
          </li>
        </ol>
      </form>

      <Link className="pj-all" href="/work" inert={phase !== "light"}>
        Browse all work<span aria-hidden="true"> →</span>
      </Link>

      {/* The machine. Overlays are placed in % of the photograph. */}
      <div className="pj-stage" ref={stageRef}>
        <div className="pj-machine" ref={machineRef} data-lamp={lamp}>
          <div className="pj-mag" ref={magRef} aria-hidden="true">
            <div className="pj-card pj-slotcard" ref={slotRef} data-pos={slotPos} hidden={inMag === null}>
              <Face text={loadedText} no={noOf(inMag)} typed={inMag === "blank"} />
            </div>
          </div>
          <Image
            className="pj-photo"
            src="/projector/machine.webp"
            alt=""
            width={1488}
            height={764}
            priority
            draggable={false}
            sizes="(min-width: 1000px) 720px, 100vw"
          />
          <div className="pj-plate" aria-hidden="true">
            <span>{name.toUpperCase()}</span>
            <span>DESIGN ENGINEER</span>
          </div>
          <span className="pj-lamp" aria-hidden="true" />
          <span className="pj-lens" ref={lensRef} aria-hidden="true" />
          <button
            className="pj-go"
            type="submit"
            form="pj-form"
            aria-label="Project"
            aria-busy={phase === "reading" || undefined}
            disabled={phase === "dark"}
          />
          <span className="pj-go-label" aria-hidden="true">
            Project
          </span>
        </div>
        <p className={`pj-status${fault ? " is-fault" : ""}`} aria-hidden="true">
          {phase === "dark" ? "Projecting" : status}
        </p>
        <p className="pj-note">Claude chooses which sections of my case files to project. It never writes them.</p>
      </div>

      {/* 3. The wall */}
      {result && (
        <section className="pj-wall" ref={wallRef} aria-labelledby="r-title">
          <header className="pj-wallhead">
            <h2 id="r-title" ref={titleRef} tabIndex={-1}>
              {result.line}
            </h2>
            <p className="pj-quote">
              <span className="sr-only">You asked: </span>
              {result.quote}
            </p>
          </header>
          <div
            className="pj-screen"
            ref={screenRef}
            role="region"
            aria-roledescription="carousel"
            aria-label="Projected work"
            onPointerDown={onDown}
            onPointerUp={onUp}
            onPointerCancel={() => (swipe.current = null)}
          >
            {slides.map((s, i) => {
              const m = media[cardKey(s.project, s.section)];
              const on = i === cur;
              const tags = s.tags.filter((t) => !t.toLowerCase().startsWith(s.why.toLowerCase()));
              return (
                <article
                  key={`${s.project}#${s.section}`}
                  className={`pj-slide${m ? "" : " is-text"}`}
                  data-current={on || undefined}
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${n}: ${s.projectTitle}`}
                  aria-hidden={!on || undefined}
                  inert={!on}
                >
                  <div className="pj-slide-top">
                    <span>
                      {pad2(i + 1)} / {pad2(n)} · {s.projectTitle}
                    </span>
                    <span className="pj-why">
                      <span className="sr-only">Chosen for </span>
                      {s.why}
                    </span>
                  </div>
                  <div className="pj-slide-main">
                    <div className="pj-slide-text">
                      <h3 className="pj-slide-title">{s.title}</h3>
                      {s.body.map((p) => (
                        <p key={p.slice(0, 40)}>{p}</p>
                      ))}
                      {tags.length > 0 && (
                        <ul className="pj-tags" aria-label="Also shows">
                          {tags.map((t) => (
                            <li key={t}>{t}</li>
                          ))}
                        </ul>
                      )}
                      <Link className="pj-full" href={s.href}>
                        Full project<span className="sr-only">: {s.projectTitle}, {s.title}</span>
                        <span aria-hidden="true"> →</span>
                      </Link>
                    </div>
                    {m && <div className="pj-slide-media">{m}</div>}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="pj-under">
            <div className="pj-controls">
              {n > 1 && (
                <div className="pj-pager">
                  <button type="button" className="pj-arrow" aria-label="Previous slide" disabled={cur === 0} onClick={() => void show(cur - 1)}>
                    <span aria-hidden="true">←</span>
                  </button>
                  <span className="pj-count" aria-hidden="true">
                    {pad2(cur + 1)} / {pad2(n)}
                  </span>
                  <button type="button" className="pj-arrow" aria-label="Next slide" disabled={cur === n - 1} onClick={() => void show(cur + 1)}>
                    <span aria-hidden="true">→</span>
                  </button>
                  <ol className="pj-dots" aria-label="Slides">
                    {slides.map((s, i) => (
                      <li key={`${s.project}#${s.section}`}>
                        <button type="button" aria-current={i === cur || undefined} title={s.projectTitle} onClick={() => void show(i)}>
                          <span className="sr-only">
                            {i + 1}: {s.projectTitle}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              <div className="pj-again">
                <button type="button" className="pj-btn pj-btn-on" onClick={() => void again()}>
                  Change the card
                </button>
                <Link className="pj-btn" href="/work">
                  All work
                </Link>
              </div>
            </div>
            {result.missing && <p className="pj-missing">{result.missing}</p>}
            {result.provenance && <p className="pj-prov">{result.provenance}</p>}
          </div>
        </section>
      )}

      <p className="sr-only" role="status" aria-live="polite">
        {live}
      </p>
    </div>
  );
}
