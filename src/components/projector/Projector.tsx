"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";
import { AskErrorSchema, AskResponseSchema, BRIEF_MAX, type AskResponse } from "@/lib/ask/schema";
import { cardKey, type CardIndex, type SheetCard } from "@/lib/cards";
import { SIGNAL_SHORT, missingLine, pad2, provenanceLine } from "@/lib/printed";
import { BLANK_HINT, ERRORS, STATUS, beamPlacement, firstSentence, quoteCard, storyPose } from "@/lib/projector";

/*
 * The projector. Four stages, each a behaviour of the machine rather than a screen:
 *   1. Request  – a card from the hand flies into the magazine (or you write on the blank one); the lamp turns green.
 *   2. Thinking – the red button: the card drops into the gate, the room goes dark and we move in on the machine. The
 *                 lens lights, the beam finds the wall, and a list of steps follows the real request (never a fake
 *                 progress bar) while the light on the wall is still out of focus.
 *   3. Browsing – the light comes into focus as a row of story cards, one per section chosen: the one in the light is
 *                 sharp, the others turn away into the dark. Open a card and it becomes the full slide.
 *   4. Again    – change the card: the lights come up, we step back, and the card comes back out.
 * Plain Web Animations API, no library. With reduced motion everything happens at once (the room still darkens).
 */

type Props = {
  cards: CardIndex;
  /** Server-rendered evidence for each section, keyed by cardKey: the open slide shows it. */
  media: Record<string, ReactNode>;
  /** A picture for each section's story card, where one exists, keyed by cardKey. */
  thumbs: Record<string, string>;
  /** Sections whose evidence takes the open slide's full width (text above it), by cardKey. */
  wide: string[];
  /** The printed cards, as a recruiter would ask. */
  questions: string[];
  name: string;
  location: string;
};

type Phase = "light" | "dark";
type Stage = "think" | "show";
/** Which card is the request: a printed card by index, the blank card, or none. */
type Choice = number | "blank" | null;

type Slide = SheetCard & { why: string };
type Result = { line: string; quote: string; slides: Slide[]; missing: string; provenance: string };
type Outcome = { ok: true; data: AskResponse } | { ok: false; message: string };

/** What the machine is doing while the room is dark, in order. The first two follow the request; the rest follow the answer. */
const STEPS = ["Reading your card", "Finding the work that answers it", "Choosing the sections to show", "Projecting"];

const OUT = "cubic-bezier(0.16, 1, 0.3, 1)";
const INOUT = "cubic-bezier(0.65, 0, 0.35, 1)";
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
/** Animate an element from where it was (`first`) to where it is now: the FLIP technique. */
function flip(el: HTMLElement | null, first: DOMRect | undefined, duration: number, easing = INOUT): Promise<void> {
  if (!el || !first || reduced()) return Promise.resolve();
  const last = el.getBoundingClientRect();
  if (!last.width) return Promise.resolve();
  return play(
    el,
    [
      { transformOrigin: "0 0", transform: `translate(${first.left - last.left}px, ${first.top - last.top}px) scale(${first.width / last.width})` },
      { transformOrigin: "0 0", transform: "none" },
    ],
    { duration, easing },
  );
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

/** A card's face: the question in its top band, and its number. Used in the file, in flight and in the magazine. */
function Face({ text, no, typed }: { text: string; no: string; typed?: boolean }) {
  return (
    <>
      <span className={typed ? "pj-q pj-q-typed" : "pj-q"}>
        <span>{text}</span>
      </span>
      <span className="pj-no" aria-hidden="true">
        {no}
      </span>
    </>
  );
}

export function Projector({ cards, media, thumbs, wide, questions, name, location }: Props) {
  const [phase, setPhase] = useState<Phase>("light");
  const [stage, setStage] = useState<Stage>("think");
  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState<Choice>(null);
  /** The card that is physically in the magazine (it can differ from `choice` while the blank one is being written). */
  const [inMag, setInMag] = useState<Choice>(null);
  /** The card whose place in the hand is empty: it is in the magazine, or on its way there. */
  const [away, setAway] = useState<Choice>(null);
  const [brief, setBrief] = useState("");
  const [status, setStatus] = useState<string>(STATUS.idle);
  const [fault, setFault] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  /** The story card in the light, and whether it is open as the full slide. */
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const [drag, setDrag] = useState(0);
  const [beam, setBeam] = useState<CSSProperties | null>(null);
  const [live, setLive] = useState("");

  const busy = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const handRef = useRef<HTMLFormElement>(null);
  const allRef = useRef<HTMLAnchorElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const machineRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const magRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLSpanElement>(null);
  const wallRef = useRef<HTMLElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const aimRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const openRef = useRef<HTMLElement>(null);
  const beamRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const openTitleRef = useRef<HTMLHeadingElement>(null);
  const blankRef = useRef<HTMLTextAreaElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const storyRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const press = useRef<{ x: number; y: number; id: number; moved: boolean } | null>(null);

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
    fly.className = "pj-card pj-fly";
    fly.setAttribute("aria-hidden", "true");
    const q = document.createElement("span");
    q.className = typed ? "pj-q pj-q-typed" : "pj-q";
    const qt = document.createElement("span");
    qt.textContent = text;
    q.append(qt);
    const n = document.createElement("span");
    n.className = "pj-no";
    n.textContent = no;
    fly.append(q, n);
    const bh = b.width / CARD_RATIO;
    Object.assign(fly.style, { left: "0px", top: "0px", width: `${a.width}px`, height: `${a.height}px` });
    document.body.appendChild(fly);
    const lift = Math.min(150, Math.abs(b.top - a.top) * 0.3 + 48);
    const tilt = rnd(-5, 5);
    const midW = (a.width + b.width) / 2;
    await fly
      .animate(
        [
          { transform: `translate(${a.left}px, ${a.top}px) rotate(0deg)`, width: `${a.width}px`, height: `${a.height}px`, borderRadius: "12px" },
          {
            transform: `translate(${(a.left + b.left) / 2}px, ${Math.min(a.top, b.top) - lift}px) rotate(${tilt}deg)`,
            width: `${midW}px`,
            height: `${midW / CARD_RATIO}px`,
            offset: 0.5,
          },
          { transform: `translate(${b.left}px, ${b.top}px) rotate(0deg)`, width: `${b.width}px`, height: `${bh}px`, borderRadius: `${b.width * 0.028}px` },
        ],
        { duration: 720, easing: "cubic-bezier(0.45, 0, 0.2, 1)", fill: "forwards" },
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

  // ---------- the beam: the photograph of the light, from the lens to whatever is lit on the wall ----------
  const aim = useCallback(() => {
    const lens = lensRef.current?.getBoundingClientRect();
    const target = (open ? openRef.current : aimRef.current)?.getBoundingClientRect();
    if (!lens || !target || !lens.width || !target.width) return;
    const p = beamPlacement(
      { x: lens.left + lens.width * 0.42, y: lens.top + lens.height / 2 },
      { x: target.left + target.width / 2, y: target.top + target.height / 2 },
      target.height * 0.92,
    );
    setBeam({ left: p.left, top: p.top, width: p.width, transformOrigin: p.origin, transform: p.transform });
  }, [open]);

  useLayoutEffect(() => {
    if (phase !== "dark") return;
    const onResize = () => aim();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [phase, aim]);

  /** Bring the lights up again: the wall goes, we step back from the machine, and the hand comes back. */
  const lightsUp = useCallback(async () => {
    rootRef.current?.removeAttribute("data-lens");
    await play(wallRef.current, [{ opacity: 1 }, { opacity: 0 }], { duration: 280, easing: "ease-in", fill: "forwards" });
    const first = stageRef.current?.getBoundingClientRect();
    flushSync(() => {
      setPhase("light");
      setResult(null);
      setBeam(null);
      setOpen(false);
      setDrag(0);
      setStage("think");
    });
    window.scrollTo({ top: 0, behavior: "instant" });
    void play(introRef.current, [{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], {
      duration: 520,
      delay: 380,
      easing: OUT,
      fill: "backwards",
    });
    void play(handRef.current, [{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "none" }], {
      duration: 560,
      delay: 460,
      easing: OUT,
      fill: "backwards",
    });
    void play(allRef.current, [{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: 600, fill: "backwards" });
    await flip(stageRef.current, first, 950);
  }, []);

  // ---------- 2. thinking, then 3. browsing ----------
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
      await sleep(100);
    }

    // The button goes in, the card drops into the gate, and the question is on its way.
    knock(1.3);
    const t0 = performance.now();
    const pending = ask(text);
    setLive(STEPS[0]!);
    if (slotRef.current) slotRef.current.dataset.pos = "gate";
    await Promise.all(
      [introRef.current, handRef.current, allRef.current].map((el) =>
        play(el, [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(-10px)" }], {
          duration: 340,
          delay: 120,
          easing: "ease-in",
          fill: "forwards",
        }),
      ),
    );

    // The room goes dark and we move in on the machine.
    const first = stageRef.current?.getBoundingClientRect();
    flushSync(() => {
      setStep(0);
      setStage("think");
      setResult(null);
      setOpen(false);
      setActive(0);
      setPhase("dark");
    });
    window.scrollTo({ top: 0, behavior: "instant" });
    [introRef.current, handRef.current, allRef.current].forEach((el) => el?.getAnimations().forEach((x) => x.cancel()));
    const moving = flip(stageRef.current, first, 1150);
    const lensOn = sleep(520).then(() => rootRef.current?.setAttribute("data-lens", "on"));
    const second = setTimeout(() => setStep((s) => Math.max(s, 1)), reduced() ? 0 : 1100);
    await Promise.all([moving, lensOn]);
    aim();
    rootRef.current?.setAttribute("data-beam", "on");
    void play(beamRef.current, [{ clipPath: "inset(0 88% 0 0)", opacity: 0.2 }, { clipPath: "inset(0 0 0 0)", opacity: 1 }], {
      duration: 720,
      easing: OUT,
    });

    const outcome = await pending;
    const elapsed = performance.now() - t0;
    await sleep(Math.max(0, 1900 - elapsed));
    clearTimeout(second);

    if (!outcome.ok) {
      setLive(outcome.message);
      await lightsUp();
      if (slotRef.current) slotRef.current.dataset.pos = "seated";
      setStatus(outcome.message);
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
      await lightsUp();
      if (slotRef.current) slotRef.current.dataset.pos = "seated";
      setStatus(ERRORS.jammed);
      setFault(true);
      busy.current = false;
      return;
    }

    // The answer: the last two steps, then the light comes into focus as the story cards.
    setStep(2);
    await sleep(420);
    setStep(3);
    await sleep(380);
    const r: Result = {
      line: outcome.data.line,
      quote: quoteCard(text),
      slides,
      missing: missingLine(outcome.data.missing),
      provenance: provenanceLine(outcome.data.source, slides.length),
    };
    flushSync(() => {
      setResult(r);
      setActive(0);
      setStage("show");
    });
    aim();
    void play(
      rowRef.current,
      [
        { filter: "blur(18px)", opacity: 0.35, transform: "scale(1.04)" },
        { filter: "blur(6px)", opacity: 0.8, offset: 0.55 },
        { filter: "blur(0)", opacity: 1, transform: "none" },
      ],
      { duration: 900, easing: OUT },
    );
    storyRefs.current.forEach((el, i) =>
      play(el?.querySelector(".pj-story-face"), [{ opacity: 0 }, { opacity: 1 }], { duration: 500, delay: 420 + i * 90, fill: "backwards" }),
    );
    titleRef.current?.focus({ preventScroll: true });
    const s0 = slides[0]!;
    setLive(`${r.line} Story 1 of ${slides.length}: ${s0.title}, ${s0.projectTitle}.`);
    busy.current = false;
  }, [phase, choice, brief, BLANK, textOf, knock, inMag, eject, flyIn, seat, cards, aim, lightsUp]);

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

  // ---------- browsing ----------
  const slides = result?.slides ?? [];
  const n = slides.length;

  /** Turn the row so another card is in the light. */
  const move = useCallback(
    (k: number) => {
      if (!result) return;
      const j = Math.max(0, Math.min(n - 1, k));
      setDrag(0);
      if (j === active) return;
      setActive(j);
      const s = result.slides[j]!;
      setLive(`Story ${j + 1} of ${n}: ${s.title}, ${s.projectTitle}.`);
    },
    [result, n, active],
  );

  // the beam follows the card in the light, and the open slide
  useLayoutEffect(() => {
    if (phase === "dark" && stage === "show") aim();
  }, [phase, stage, active, open, aim]);

  /** Open the card in the light as the full slide: it grows out of the card. */
  const openStory = useCallback(async () => {
    if (!result || open || busy.current) return;
    busy.current = true;
    const from = storyRefs.current[active]?.getBoundingClientRect();
    flushSync(() => setOpen(true));
    const el = openRef.current;
    if (el && from && !reduced()) {
      const to = el.getBoundingClientRect();
      await play(
        el,
        [
          {
            transformOrigin: "0 0",
            transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`,
            opacity: 0.3,
          },
          { transformOrigin: "0 0", transform: "none", opacity: 1 },
        ],
        { duration: 560, easing: OUT },
      );
    }
    openTitleRef.current?.focus({ preventScroll: true });
    const s = result.slides[active]!;
    setLive(`Open: ${s.title}, ${s.projectTitle}.`);
    busy.current = false;
  }, [result, open, active]);

  const closeStory = useCallback(async () => {
    if (!open || busy.current) return;
    busy.current = true;
    const el = openRef.current;
    const to = storyRefs.current[active]?.getBoundingClientRect();
    if (el && to && !reduced()) {
      const from = el.getBoundingClientRect();
      await play(
        el,
        [
          { transformOrigin: "0 0", transform: "none", opacity: 1 },
          {
            transformOrigin: "0 0",
            transform: `translate(${to.left - from.left}px, ${to.top - from.top}px) scale(${to.width / from.width}, ${to.height / from.height})`,
            opacity: 0,
          },
        ],
        { duration: 380, easing: "cubic-bezier(0.4, 0, 0.6, 1)", fill: "forwards" },
      );
    }
    flushSync(() => setOpen(false));
    storyRefs.current[active]?.focus({ preventScroll: true });
    busy.current = false;
  }, [open, active]);

  /** With a slide open, the next story replaces it: the light dips, the slide changes, the light comes back. */
  const step2 = useCallback(
    async (k: number) => {
      if (!result || busy.current) return;
      const j = Math.max(0, Math.min(n - 1, k));
      if (j === active) return;
      busy.current = true;
      const dir = j > active ? 1 : -1;
      knock(0.4);
      await play(openRef.current, [{ opacity: 1 }, { opacity: 0.06 }], { duration: 150, easing: "ease-in", fill: "forwards" });
      flushSync(() => setActive(j));
      openRef.current?.getAnimations().forEach((x) => x.cancel());
      const s = result.slides[j]!;
      setLive(`Story ${j + 1} of ${n}: ${s.title}, ${s.projectTitle}.`);
      await play(
        openRef.current,
        [
          { opacity: 0.1, transform: `translateX(${dir * 16}px)` },
          { opacity: 0.85, offset: 0.45 },
          { opacity: 0.62, offset: 0.6 },
          { opacity: 1, transform: "none" },
        ],
        { duration: 360, easing: OUT },
      );
      openTitleRef.current?.focus({ preventScroll: true });
      busy.current = false;
    },
    [result, n, active, knock],
  );

  const go = useCallback((k: number) => (open ? void step2(k) : move(k)), [open, step2, move]);

  // Keys in the dark room: arrows move along the stories, Enter opens, Escape closes, then brings the lights up.
  const againRef = useRef<() => void>(() => undefined);
  useEffect(() => {
    if (phase !== "dark" || stage !== "show") return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest("textarea, input, video, [data-module]")) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        go(active + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(active - 1);
      } else if (e.key === "Escape") {
        if (open) void closeStory();
        else againRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, stage, go, active, open, closeStory]);

  // Dragging the row with a finger or the pointer: the cards follow, and let go past a tenth of a card to turn.
  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (open || e.button !== 0) return;
    press.current = { x: e.clientX, y: e.clientY, id: e.pointerId, moved: false };
  };
  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const p = press.current;
    if (!p) return;
    const dx = e.clientX - p.x;
    if (!p.moved && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(e.clientY - p.y)) {
      p.moved = true;
      e.currentTarget.setPointerCapture(p.id);
    }
    if (p.moved) {
      const w = storyRefs.current[active]?.offsetWidth ?? 300;
      setDrag(Math.max(-1.3, Math.min(1.3, dx / (w * 0.9))));
    }
  };
  const onUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const p = press.current;
    press.current = null;
    if (!p?.moved) return;
    const w = storyRefs.current[active]?.offsetWidth ?? 300;
    const dx = e.clientX - p.x;
    if (Math.abs(dx) > w * 0.12) move(active + (dx < 0 ? 1 : -1));
    else setDrag(0);
  };

  // ---------- 4. again ----------
  const again = useCallback(async () => {
    if (busy.current || phase !== "dark") return;
    busy.current = true;
    const back = inMag;
    await lightsUp();
    setChoice(null);
    setStatus(STATUS.idle);
    if (slotRef.current) slotRef.current.dataset.pos = "seated";
    if (back !== null) await eject(back);
    setLive("The lights are up. Choose a card.");
    const focusEl = back === "blank" || back === null ? blankRef.current : (cardRefs.current[back] as HTMLElement | null);
    focusEl?.focus({ preventScroll: true });
    busy.current = false;
  }, [phase, inMag, eject, lightsUp]);
  useEffect(() => {
    againRef.current = () => void again();
  }, [again]);

  // ---------- render ----------
  const loadedText = inMag === null ? "" : inMag === "blank" ? brief.trim() : (questions[inMag] ?? "");
  const lamp = fault ? "fault" : phase === "dark" ? "on" : choice !== null ? "ready" : "off";
  const cur = slides[active];
  const curMedia = cur ? media[cardKey(cur.project, cur.section)] : undefined;
  const curTags = cur ? cur.tags.filter((t) => !t.toLowerCase().startsWith(cur.why.toLowerCase())) : [];

  return (
    <div className="pj" ref={rootRef} data-phase={phase} data-stage={stage} data-ready={choice !== null || undefined}>
      <div className="pj-bg" aria-hidden="true">
        <i className="pj-bg-light" />
        <i className="pj-bg-dark" />
      </div>

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
        ref={handRef}
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
              onClick={() => blankRef.current?.focus()}
            >
              <span className="pj-q pj-q-blank" aria-hidden="true">
                <span className="pj-plus">+</span>
                <span>Write your own question</span>
              </span>
              <span className="pj-no" aria-hidden="true">
                {pad2(BLANK + 1)}
              </span>
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
                placeholder={BLANK_HINT}
                onChange={(e) => onBrief(e.target.value)}
                onKeyDown={onBlankKey}
              />
            </div>
          </li>
        </ol>
      </form>

      <Link className="pj-all" href="/work" ref={allRef} inert={phase !== "light"}>
        Browse all work<span aria-hidden="true"> →</span>
      </Link>

      {/* The machine. Overlays are placed in % of the photograph. In the dark it is the close foreground. */}
      <div className="pj-stage" ref={stageRef}>
        <div className="pj-machine" ref={machineRef} data-lamp={lamp}>
          <div className="pj-mag" ref={magRef} aria-hidden="true">
            <div className="pj-card pj-slotcard" ref={slotRef} data-pos="seated" hidden={inMag === null}>
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
            sizes="(min-width: 1000px) 1000px, 100vw"
          />
          <Image
            className="pj-photo pj-photo-on"
            src="/projector/machine-on.webp"
            alt=""
            width={1488}
            height={764}
            draggable={false}
            sizes="(min-width: 1000px) 1000px, 100vw"
          />
          <div className="pj-plate" aria-hidden="true">
            <span>{name.toUpperCase()}</span>
            <span>DESIGN ENGINEER</span>
          </div>
          <span className="pj-lamp" aria-hidden="true" />
          <span className="pj-lens" ref={lensRef} aria-hidden="true" />
          <button className="pj-go" type="submit" form="pj-form" aria-label="Project" disabled={phase === "dark"} />
          <span className="pj-go-label" aria-hidden="true">
            Project
          </span>
        </div>
        <p className={`pj-status${fault ? " is-fault" : ""}`} aria-hidden="true">
          {status}
        </p>
        <p className="pj-note">Claude chooses which sections of my case files to project. It never writes them.</p>
      </div>

      {/* 2–3. The dark room: the beam, the steps, the wall */}
      {phase === "dark" && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- placed and turned per frame, not a content image */}
          <img className="pj-beam" ref={beamRef} src="/projector/beam.webp" alt="" aria-hidden="true" style={beam ?? { opacity: 0 }} />
          <section className="pj-wall" ref={wallRef} aria-labelledby={result ? "r-title" : undefined} aria-label={result ? undefined : "Projecting"} data-open={open || undefined}>
            <header className="pj-wallhead">
              <ol className="pj-steps" aria-hidden="true" data-done={stage === "show" || undefined}>
                {STEPS.map((s, i) => (
                  <li key={s} data-state={i < step ? "done" : i === step ? "now" : "todo"}>
                    {s}
                    {i === step && i < STEPS.length - 1 ? "…" : ""}
                  </li>
                ))}
              </ol>
              {result && (
                <div className="pj-answer">
                  <p className="pj-eyebrow">Selected for your card</p>
                  <h2 id="r-title" ref={titleRef} tabIndex={-1}>
                    {result.line}
                  </h2>
                  <p className="pj-quote">
                    <span className="sr-only">You asked: </span>
                    {result.quote}
                  </p>
                  {result.missing && <p className="pj-missing">{result.missing}</p>}
                  {result.provenance && <p className="pj-prov">{result.provenance}</p>}
                </div>
              )}
              {result && (
                <p className="pj-count" aria-hidden="true">
                  {n} {n === 1 ? "story" : "stories"}
                </p>
              )}
            </header>

            <div className="pj-area" ref={areaRef}>
              {/* where the card in the light stands: the beam aims here */}
              <div className="pj-aim" ref={aimRef} aria-hidden="true" />
              {stage === "think" && <div className="pj-patch" aria-hidden="true" />}
              {result && (
                <div
                  className="pj-row"
                  ref={rowRef}
                  role="region"
                  aria-roledescription="carousel"
                  aria-label="Projected work"
                  inert={open}
                  onPointerDown={onDown}
                  onPointerMove={onMove}
                  onPointerUp={onUp}
                  onPointerCancel={() => {
                    press.current = null;
                    setDrag(0);
                  }}
                  data-dragging={drag !== 0 || undefined}
                >
                  {slides.map((s, i) => {
                    const pose = storyPose(i, active, drag);
                    const on = i === active;
                    const pic = thumbs[cardKey(s.project, s.section)];
                    return (
                      <button
                        key={`${s.project}#${s.section}`}
                        ref={(el) => {
                          storyRefs.current[i] = el;
                        }}
                        type="button"
                        className="pj-story"
                        data-current={on || undefined}
                        aria-roledescription="slide"
                        aria-label={`${i + 1} of ${n}: ${s.title}, ${s.projectTitle}.${on ? " Open" : ""}`}
                        aria-hidden={pose.opacity === 0 || undefined}
                        tabIndex={on ? 0 : -1}
                        style={
                          {
                            "--rel": pose.rel,
                            "--scale": pose.scale,
                            "--rot": `${pose.rotate}deg`,
                            "--o": pose.opacity,
                            "--b": pose.bright,
                            zIndex: pose.z,
                          } as CSSProperties
                        }
                        onClick={() => {
                          if (press.current?.moved) return;
                          if (on) void openStory();
                          else move(i);
                        }}
                      >
                        <span className="pj-story-glow" aria-hidden="true" />
                        <span className="pj-story-face">
                          <span className="pj-story-top">
                            <span>
                              {pad2(i + 1)} / {pad2(n)}
                            </span>
                            <span className="pj-why">{s.why}</span>
                          </span>
                          {pic ? (
                            <span className="pj-story-pic">
                              <Image src={pic} alt="" fill sizes="320px" />
                            </span>
                          ) : (
                            <span className="pj-story-excerpt">{firstSentence(s.body)}</span>
                          )}
                          <span className="pj-story-title">{s.title}</span>
                          <span className="pj-story-proj">{s.projectTitle}</span>
                          <span className="pj-story-open" aria-hidden="true">
                            Open <span>→</span>
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* the card in the light, open as the full slide */}
              {open && cur && (
                <article
                  className={`pj-slide pj-open${curMedia ? (wide.includes(cardKey(cur.project, cur.section)) ? " is-stack" : "") : " is-text"}`}
                  ref={openRef}
                  data-current
                  aria-labelledby="pj-open-title"
                >
                  <div className="pj-slide-top">
                    <button type="button" className="pj-back" onClick={() => void closeStory()}>
                      <span aria-hidden="true">← </span>Back to the selection
                    </button>
                    <span>
                      {pad2(active + 1)} / {pad2(n)} · {cur.projectTitle}
                    </span>
                  </div>
                  <div className="pj-slide-scroll">
                    <div className="pj-slide-main">
                      <div className="pj-slide-text">
                        <p className="pj-why pj-why-open">
                          <span className="sr-only">Chosen for </span>
                          {cur.why}
                        </p>
                        <h3 className="pj-slide-title" id="pj-open-title" ref={openTitleRef} tabIndex={-1}>
                          {cur.title}
                        </h3>
                        {cur.body.map((p) => (
                          <p key={p.slice(0, 40)}>{p}</p>
                        ))}
                        {curTags.length > 0 && (
                          <ul className="pj-tags" aria-label="Also shows">
                            {curTags.map((t) => (
                              <li key={t}>{t}</li>
                            ))}
                          </ul>
                        )}
                        <div className="pj-slide-actions">
                          <Link className="pj-full" href={cur.href}>
                            Open full project<span className="sr-only">: {cur.projectTitle}, {cur.title}</span>
                            <span aria-hidden="true"> →</span>
                          </Link>
                          {active < n - 1 && (
                            <button type="button" className="pj-next" onClick={() => void step2(active + 1)}>
                              Next story<span aria-hidden="true"> →</span>
                            </button>
                          )}
                        </div>
                      </div>
                      {curMedia && <div className="pj-slide-media">{curMedia}</div>}
                    </div>
                  </div>
                </article>
              )}
            </div>

            {result && (
              <footer className="pj-foot">
                {n > 1 && (
                  <div className="pj-pager">
                    <button type="button" className="pj-arrow" aria-label={open ? "Previous story" : "Previous slide"} disabled={active === 0} onClick={() => go(active - 1)}>
                      <span aria-hidden="true">←</span>
                    </button>
                    <ol className="pj-dots" aria-label="Stories">
                      {slides.map((s, i) => (
                        <li key={`${s.project}#${s.section}`}>
                          <button type="button" aria-current={i === active || undefined} title={s.title} onClick={() => go(i)}>
                            <span className="sr-only">
                              {i + 1}: {s.title}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ol>
                    <button type="button" className="pj-arrow" aria-label={open ? "Next story" : "Next slide"} disabled={active === n - 1} onClick={() => go(active + 1)}>
                      <span aria-hidden="true">→</span>
                    </button>
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
              </footer>
            )}
          </section>
        </>
      )}

      <p className="sr-only" role="status" aria-live="polite">
        {live}
      </p>
    </div>
  );
}
