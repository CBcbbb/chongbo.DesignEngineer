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
import { BEAM, BEAM_REAR, BLANK_HINT, ERRORS, MAGAZINE, STATUS, beamPlacement, firstSentence, joinReels, quoteCard, readyLine, stepsFor, storyPose } from "@/lib/projector";

/*
 * The projector. Four stages, each a behaviour of the machine rather than a screen:
 *   1. Request  – cards from the hand fly into the magazine, up to three, each behind the last (or you write on the
 *                 blank one); press one that is in to take it out. The lamp turns green.
 *   2. Thinking – the red button: the card drops into the gate, the room goes dark and we move in on the machine. The
 *                 lens lights, the beam finds the wall, and a list of steps follows the real request (never a fake
 *                 progress bar) while the light on the wall is still out of focus.
 *   3. Browsing – a cut through the dark to behind the machine, looking at the wall with it; the light comes into
 *                 focus as a row of story cards, one per section chosen: the one in the light is
 *                 sharp, the others turn away into the dark. Open a card and it becomes the full slide. With several
 *                 cards, each card's stories follow the last's, and the heading changes to that card's answer.
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

/** A story on the wall: which card (reel) brought it up, and the later cards it also answers. */
type Slide = SheetCard & { why: string; reel: number; also: number[] };
/** One card's answer. */
type Reel = { no: string; line: string; quote: string; missing: string; provenance: string };
type Result = { reels: Reel[]; slides: Slide[] };
type Outcome = { ok: true; data: AskResponse } | { ok: false; message: string };


const OUT = "cubic-bezier(0.16, 1, 0.3, 1)";
const INOUT = "cubic-bezier(0.65, 0, 0.35, 1)";
const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";
/** The camera: gathers speed, then a long settle. */
const CAMERA = "cubic-bezier(0.3, 0, 0.08, 1)";
/** A camera-like move: eases in a little, then settles long. */
const GLIDE = "cubic-bezier(0.22, 0.8, 0.2, 1)";
/** A clip-path inset that shows only the part of `box` covered by `card`, with the card's rounded corners. */
function cardInset(card: DOMRect, box: DOMRect): string {
  const t = card.top - box.top;
  const l = card.left - box.left;
  const r = box.right - card.right;
  const b = box.bottom - card.bottom;
  return `inset(${t}px ${r}px ${b}px ${l}px round 12px)`;
}
/** Said when turning the row takes you on to another card's stories: which card, and its answer. */
function reelChange(r: Result, from: number, to: number): string {
  const a = r.slides[from]?.reel;
  const b = r.slides[to]?.reel;
  if (b === undefined || a === b) return "";
  return `Card ${b + 1}: ${r.reels[b]!.line} `;
}
/** Everything the dark room shows, fetched and decoded while you choose a card, so nothing pops in mid-move. */
const DARK_ROOM = [
  "/projector/machine-34-off.webp",
  "/projector/machine-34-on.webp",
  "/projector/machine-rear.webp",
  "/projector/beam.webp",
  "/projector/beam-rear.webp",
  "/projector/dust-34-a.webp",
  "/projector/dust-34-b.webp",
  "/projector/dust-rear-a.webp",
  "/projector/dust-rear-b.webp",
  "/projector/story.webp",
  "/projector/story-glow.webp",
  "/projector/slide.webp",
];
/** The paper card's proportions (public/projector/card.webp). */
const CARD_RATIO = 900 / 499;
/** The magazine's card positions, as translateY of a slot card (anchored to the magazine's front lip); each card
 * further back stands DEPTH higher and a little smaller. */
const POS = { above: -8, seated: 52, out: -70 } as const;
const DEPTH = 17;
const slotAt = (y: number, d: number) => `translateY(${y - d * DEPTH}%) scale(${1 - d * 0.04})`;
/** A card's key, for the magazine and the hand. */
const cardId = (c: Choice) => String(c);
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

/** The camera move into the dark (see project()): the same path for both views, a short hand-over half-way. */
function travel(
  stage: HTMLElement | null,
  machine: HTMLElement | null,
  from: DOMRect | undefined,
  view: HTMLElement | null,
  duration: number,
): Promise<void> {
  if (!stage || !machine || !view || !from || reduced()) return Promise.resolve();
  const s = stage.getBoundingClientRect();
  const m = machine.getBoundingClientRect();
  const v = view.getBoundingClientRect();
  if (!m.width || !v.width) return Promise.resolve();
  const timing = { duration, easing: CAMERA };
  // the front view: its machine starts where it stood and ends drawn into the three-quarter view's box
  const origin = `${m.left - s.left}px ${m.top - s.top}px`;
  const at = (r: { left: number; top: number; width: number }) =>
    `translate(${r.left - m.left}px, ${r.top - m.top}px) scale(${r.width / m.width})`;
  void play(
    stage,
    [
      { transformOrigin: origin, transform: at(from), opacity: 1 },
      { opacity: 1, offset: 0.46 },
      { opacity: 0, offset: 0.6 },
      { transformOrigin: origin, transform: at(v), opacity: 0 },
    ],
    timing,
  );
  // the three-quarter view: starts drawn into the front view's box, ends in its own place
  return play(
    view,
    [
      { transformOrigin: "0 0", transform: `translate(${from.left - v.left}px, ${from.top - v.top}px) scale(${from.width / v.width})`, opacity: 0 },
      { opacity: 0, offset: 0.42 },
      { opacity: 1, offset: 0.56 },
      { transformOrigin: "0 0", transform: "none", opacity: 1 },
    ],
    timing,
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
  /** The cards in the magazine, front slot first: the order they are projected in. */
  const [mag, setMag] = useState<Choice[]>([]);
  /** The cards whose place in the hand is empty: in the magazine, or on their way there. */
  const [away, setAway] = useState<Choice[]>([]);
  /** The magazine as it is now, for a press that waited for a card to land (the render it came from is older). */
  const magNow = useRef<Choice[]>([]);
  useLayoutEffect(() => {
    magNow.current = mag;
  }, [mag]);
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
  /** How many cards went in this time (the steps' wording). */
  const [count, setCount] = useState(1);

  const busy = useRef(false);
  /** While a slide is opening, changing or closing: resolves when it is done, so a press meanwhile waits, not drops. */
  const motion = useRef<Promise<void> | null>(null);
  const activeRef = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const handRef = useRef<HTMLFormElement>(null);
  const allRef = useRef<HTMLAnchorElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const machineRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef(new Map<string, HTMLDivElement>());
  const slotOf = (c: Choice) => slotRefs.current.get(cardId(c)) ?? null;
  const magRef = useRef<HTMLDivElement>(null);
  const wallRef = useRef<HTMLElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const aimRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const openRef = useRef<HTMLElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);
  /** The dark room's camera: the three-quarter view while it thinks, the view from behind it while we browse. */
  const camRef = useRef<HTMLDivElement>(null);
  const view34Ref = useRef<HTMLDivElement>(null);
  const lens34Ref = useRef<HTMLSpanElement>(null);
  const lensRearRef = useRef<HTMLSpanElement>(null);
  const viewRef = useRef<"34" | "rear">("34");
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

  // ---------- the dark room's pictures, fetched and decoded once the page is idle ----------
  const warm = useRef<HTMLImageElement[]>([]);
  useEffect(() => {
    const go = () => {
      warm.current = DARK_ROOM.map((src) => {
        const img = new window.Image();
        img.src = src;
        void img.decode().catch(() => undefined);
        return img;
      });
    };
    const idle = typeof window.requestIdleCallback === "function";
    const id = idle ? window.requestIdleCallback(go, { timeout: 1500 }) : setTimeout(go, 800);
    return () => (idle ? window.cancelIdleCallback(id as number) : clearTimeout(id));
  }, []);

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


  /** A card leaves the hand and flies to just above its slot in the magazine (`depth`: how far back). */
  const flyIn = useCallback(async (from: HTMLElement, text: string, no: string, typed: boolean, depth = 0) => {
    if (reduced()) return;
    // On a phone the machine can be out of view (above the hand): bring it in first, so the card is seen going in.
    const mag0 = machineRef.current?.getBoundingClientRect();
    if (mag0 && (mag0.top < 0 || mag0.bottom > window.innerHeight)) {
      machineRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
      await sleep(420);
    }
    const a = from.getBoundingClientRect();
    // Just above the magazine: the end of every flight. A card further back is a little smaller and higher.
    const m = magRef.current?.getBoundingClientRect();
    const k = 1 - depth * 0.04;
    const w = m ? m.width * k : 0;
    const h = w / CARD_RATIO;
    const b = m ? { left: m.left + (m.width - w) / 2, top: m.bottom - h * 1.08 - (depth * DEPTH * h) / 100, width: w } : null;
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
        { duration: 520, easing: "cubic-bezier(0.3, 0, 0.1, 1)", fill: "forwards" },
      )
      .finished.catch(() => undefined);
    fly.remove();
  }, []);

  /** A card just shown in the magazine drops into its slot with a small knock. Call right after it is rendered. */
  const seat = useCallback(
    async (c: Choice, depth: number) => {
      const slot = slotOf(c);
      slot?.getAnimations().forEach((x) => x.cancel());
      await play(slot, [{ transform: slotAt(POS.above, depth) }, { transform: slotAt(POS.seated, depth) }], {
        duration: 160,
        easing: "cubic-bezier(0.5, 0, 0.75, 0)",
      });
      knock(0.6);
    },
    [knock],
  );

  /** A card rises out of the magazine. The state is cleared by the caller. */
  const lift = useCallback(async (c: Choice, depth: number) => {
    await play(
      slotOf(c),
      [
        { transform: slotAt(POS.seated, depth), opacity: 1 },
        { transform: slotAt(POS.out, depth), opacity: 0 },
      ],
      { duration: 220, easing: OUT, fill: "forwards" },
    );
  }, []);

  /** A card comes back to its place in the hand. */
  const dropBack = useCallback(
    (c: Choice) => {
      if (c === null) return;
      void play(cardRefs.current[c === "blank" ? BLANK : c], [{ transform: "translateY(-16px)", opacity: 0 }, { transform: "none", opacity: 1 }], {
        duration: 340,
        easing: SPRING,
      });
    },
    [BLANK],
  );

  /** Take cards out of the magazine and put them back in the hand; the ones behind move up into the gaps. */
  const eject = useCallback(
    async (out: Choice[], from: Choice[]) => {
      if (!out.length) return;
      await Promise.all(out.map((c) => lift(c, Math.max(0, from.indexOf(c)))));
      flushSync(() => {
        setMag((m) => m.filter((c) => !out.includes(c)));
        setAway((a) => a.filter((c) => !out.includes(c)));
      });
      out.forEach((c) => {
        slotOf(c)?.getAnimations().forEach((x) => x.cancel());
        dropBack(c);
      });
    },
    [lift, dropBack],
  );

  /** A card that can't go in: it gives a little shake where it is. */
  const refuse = useCallback((el: Element | null | undefined) => {
    void play(el, [{ translate: "0 0" }, { translate: "-5px 0" }, { translate: "4px 0" }, { translate: "0 0" }], {
      duration: 320,
      easing: "ease-in-out",
    });
  }, []);

  // ---------- 1. request ----------
  /** A card on its way into the magazine: pressing the button meanwhile waits for it to land. */
  const landing = useRef<Promise<void> | null>(null);

  const loadCard = useCallback(
    async (i: number) => {
      setFault(false);
      const el = cardRefs.current[i];
      // A card that is in already comes back out.
      if (mag.includes(i)) {
        setLive(`Taken out: ${questions[i]}`);
        const left = mag.length - 1 + (brief.trim() ? 1 : 0);
        setStatus(left ? readyLine(left) : STATUS.idle);
        await eject([i], mag);
        return;
      }
      if (mag.length >= MAGAZINE) {
        setStatus(STATUS.full);
        setLive(STATUS.full);
        refuse(el);
        return;
      }
      const depth = mag.length;
      setStatus(readyLine(depth + 1 + (brief.trim() ? 1 : 0)));
      setLive(`Card ${depth + 1} in the projector: ${questions[i]}`);
      // The card leaves the hand at once (its place stays empty) and flies to its slot, behind any already in.
      flushSync(() => setAway((a) => [...a, i]));
      if (el) await flyIn(el, questions[i] ?? "", pad2(i + 1), false, depth);
      flushSync(() => setMag((m) => [...m, i]));
      await seat(i, depth);
    },
    [mag, brief, questions, eject, refuse, flyIn, seat],
  );

  const load = (i: number) => {
    if (busy.current || phase !== "light") return;
    busy.current = true;
    landing.current = loadCard(i).finally(() => {
      busy.current = false;
      landing.current = null;
    });
  };

  const onBrief = (v: string) => {
    setBrief(v);
    setFault(false);
    const n = mag.length + (v.trim() ? 1 : 0);
    setStatus(n > MAGAZINE ? STATUS.full : n ? readyLine(n) : STATUS.idle);
  };

  // ---------- the beam: the photograph of the light, from the lens to whatever is lit on the wall ----------
  const aim = useCallback(() => {
    const rear = viewRef.current === "rear";
    const lens = (rear ? lensRearRef : lens34Ref).current?.getBoundingClientRect();
    const target = (openRef.current ?? aimRef.current)?.getBoundingClientRect();
    if (!lens || !target || !target.width) return;
    const p = beamPlacement(
      { x: lens.left + lens.width / 2, y: lens.top + lens.height / 2 },
      { x: target.left + target.width / 2, y: target.top + target.height / 2 },
      target.height * (rear ? 1.05 : 0.92),
      rear ? BEAM_REAR : BEAM,
    );
    setBeam({ transform: p.matrix });
  }, []);

  /** Aim again once the machine has finished moving (it drops away when a slide opens, and comes back), the light
   * gliding after it. */
  const follow = useCallback(
    (after: number) => {
      rootRef.current?.setAttribute("data-glide", "");
      aim();
      window.setTimeout(() => {
        aim();
        window.setTimeout(() => rootRef.current?.removeAttribute("data-glide"), 700);
      }, reduced() ? 0 : after);
    },
    [aim],
  );

  useLayoutEffect(() => {
    if (phase !== "dark") return;
    const onResize = () => aim();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [phase, aim]);

  /** Bring the lights up again: the wall goes, we step back from the machine, and the hand comes back. */
  const lightsUp = useCallback(async () => {
    rootRef.current?.removeAttribute("data-lens");
    rootRef.current?.removeAttribute("data-beam");
    await Promise.all(
      [wallRef.current, camRef.current].map((el) =>
        play(el, [{ opacity: 1 }, { opacity: 0 }], { duration: 220, easing: "ease-in", fill: "forwards" }),
      ),
    );
    const first = stageRef.current?.getBoundingClientRect();
    viewRef.current = "34";
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
      duration: 420,
      delay: 200,
      easing: OUT,
      fill: "backwards",
    });
    void play(handRef.current, [{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "none" }], {
      duration: 440,
      delay: 250,
      easing: OUT,
      fill: "backwards",
    });
    void play(allRef.current, [{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: 320, fill: "backwards" });
    // we step back out to the front of the machine, and it comes up out of the dark
    void play(stageRef.current, [{ opacity: 0 }, { opacity: 1 }], { duration: 450, easing: "ease-out" });
    await flip(stageRef.current, first, 700, CAMERA);
  }, []);

  // ---------- 2. thinking, then 3. browsing ----------
  const project = useCallback(async () => {
    if (landing.current) await landing.current;
    if (busy.current || phase !== "light") return;
    // The cards in the magazine, in order, and the blank card if it has been written on.
    const inMag = magNow.current;
    const list: Choice[] = [...inMag];
    if (brief.trim() && !list.includes("blank")) list.push("blank");
    if (!list.length) {
      setStatus(STATUS.idle);
      blankRef.current?.focus();
      refuse(cardRefs.current[BLANK]);
      return;
    }
    if (list.length > MAGAZINE) {
      setStatus(STATUS.full);
      setLive(STATUS.full);
      refuse(cardRefs.current[BLANK]);
      return;
    }
    const texts = list.map(textOf);
    if (texts.some((t) => !t)) return;
    busy.current = true;
    setFault(false);
    setCount(list.length);

    // The blank card goes in now, behind the others: it was written in the hand.
    if (list.includes("blank") && !inMag.includes("blank")) {
      const el = cardRefs.current[BLANK];
      const depth = inMag.length;
      flushSync(() => setAway((a) => [...a, "blank"]));
      if (el) await flyIn(el, brief.trim(), pad2(BLANK + 1), true, depth);
      flushSync(() => setMag((m) => [...m, "blank"]));
      await seat("blank", depth);
      await sleep(60);
    }

    // The button goes in, the card drops into the gate, and the question is on its way.
    knock(1.3);
    const t0 = performance.now();
    const pending = Promise.all(texts.map((t) => ask(t)));
    const steps = stepsFor(list.length);
    setLive(steps[0]!);
    const gate = slotOf(list[0]!);
    if (gate) gate.dataset.pos = "gate";
    await Promise.all(
      [introRef.current, handRef.current, allRef.current].map((el) =>
        play(el, [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(-8px)" }], {
          duration: 200,
          easing: "ease-in",
          fill: "forwards",
        }),
      ),
    );

    camRef.current?.getAnimations({ subtree: true }).forEach((x) => x.cancel());
    // The room goes dark and we move in and round the machine. One camera path carries both photographs: the front
    // view and the three-quarter view are drawn into the same moving rectangle, from where the machine stood to where
    // it ends, close at the bottom left. Half-way, at the fastest point of the move, one hands over to the other in a
    // fifth of a second (a cut on the action), so the change of angle reads as the camera going round, not a dissolve.
    const front = machineRef.current?.getBoundingClientRect();
    viewRef.current = "34";
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
    const MOVE = 950;
    const moving = travel(stageRef.current, machineRef.current, front, view34Ref.current, MOVE);
    // the lens lights and the light goes out to the wall while the camera is still settling, not after it stops
    const lensOn = sleep(MOVE * 0.55).then(() => rootRef.current?.setAttribute("data-lens", "on"));
    const second = setTimeout(() => setStep((s) => Math.max(s, 1)), reduced() ? 0 : 750);
    await Promise.all([sleep(MOVE * 0.7), lensOn]);
    aim();
    rootRef.current?.setAttribute("data-beam", "on");
    // the light reaches out from the lens: a soft edge running along the beam, not a hard wipe
    void play(beamRef.current, [{ "--reach": "0%" }, { "--reach": "125%" }], { duration: 650, easing: OUT });
    void moving.then(() => {
      // the last few pixels of the settle: the light follows the lens there
      rootRef.current?.setAttribute("data-glide", "");
      aim();
      setTimeout(() => rootRef.current?.removeAttribute("data-glide"), 450);
    });

    const outcomes = await pending;
    const elapsed = performance.now() - t0;
    // long enough to see it think, never padded once the answer is in hand beyond that
    await sleep(Math.max(0, 1300 - elapsed));
    clearTimeout(second);

    // Each card's answer is a reel; a card that jammed is named, and the others are still shown.
    const answered: { at: number; data: AskResponse; slides: Slide[] }[] = [];
    outcomes.forEach((o, at) => {
      if (!o.ok) return;
      const slides = o.data.sheets
        .map((sh) => {
          const card = cards[cardKey(sh.project, sh.section)];
          return card ? { ...card, why: SIGNAL_SHORT[sh.signal], reel: 0, also: [] as number[] } : null;
        })
        .filter((x): x is Slide => Boolean(x));
      if (slides.length) answered.push({ at, data: o.data, slides });
    });
    if (!answered.length) {
      const fail = outcomes.find((o): o is { ok: false; message: string } => !o.ok);
      const message = fail?.message ?? ERRORS.jammed;
      setLive(message);
      await lightsUp();
      if (gate) gate.dataset.pos = "seated";
      setStatus(message);
      setFault(true);
      busy.current = false;
      return;
    }
    const jammed = outcomes.map((o, at) => (o.ok ? -1 : at)).filter((at) => at >= 0);
    const reels: Reel[] = answered.map(({ at, data, slides }) => ({
      no: pad2((list[at] === "blank" ? BLANK : (list[at] as number)) + 1),
      line: data.line,
      quote: quoteCard(texts[at]!),
      missing: [missingLine(data.missing), jammed.length ? `${jammed.length === 1 ? "One card" : `${jammed.length} cards`} jammed; try ${jammed.length === 1 ? "it" : "them"} again on ${jammed.length === 1 ? "its" : "their"} own.` : ""].filter(Boolean).join(" "),
      provenance: provenanceLine(data.source, slides.length),
    }));
    const joined = joinReels(
      answered.map((a) => a.slides),
      (x) => cardKey(x.project, x.section),
    );
    const slides: Slide[] = joined.map(({ item, reel, also }) => ({ ...item, reel, also }));

    // The answer: the last two steps, then the light comes into focus as the story cards.
    setStep(2);
    await sleep(200);
    setStep(3);
    await sleep(180);

    // A cut through the dark: the three-quarter view goes, and we are behind the machine, looking at the wall.
    rootRef.current?.removeAttribute("data-beam");
    if (camRef.current) camRef.current.dataset.view = "cut";
    await sleep(200);
    viewRef.current = "rear";
    const r: Result = { reels, slides };
    flushSync(() => {
      setResult(r);
      setActive(0);
      setStage("show");
    });
    if (camRef.current) camRef.current.dataset.view = "rear";
    aim();
    setTimeout(() => rootRef.current?.setAttribute("data-beam", "on"), reduced() ? 0 : 140);
    // the light comes into focus: the soft patch goes as the sharp cards come (no animated blur: it repaints every frame)
    void play(rowRef.current, [{ opacity: 0, transform: "scale(1.035)" }, { opacity: 1, transform: "none" }], {
      duration: 520,
      easing: OUT,
    });
    storyRefs.current.forEach((el, i) =>
      play(el?.querySelector(".pj-story-face"), [{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: 160 + i * 60, fill: "backwards" }),
    );
    titleRef.current?.focus({ preventScroll: true });
    const s0 = slides[0]!;
    const cardsSaid = reels.length > 1 ? `${reels.length} cards. Card 1: ` : "";
    setLive(`${cardsSaid}${reels[0]!.line} Story 1 of ${slides.length}: ${s0.title}, ${s0.projectTitle}.`);
    busy.current = false;
  }, [phase, brief, BLANK, textOf, knock, refuse, flyIn, seat, cards, aim, lightsUp]);

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
      setLive(`${reelChange(result, active, j)}Story ${j + 1} of ${n}: ${s.title}, ${s.projectTitle}.`);
      if (s.reel !== result.slides[active]?.reel) knock(0.5);
    },
    [result, n, active, knock],
  );

  // the beam follows the card in the light, and the open slide
  useLayoutEffect(() => {
    if (phase === "dark" && stage === "show") aim();
  }, [phase, stage, active, open, aim]);

  useLayoutEffect(() => {
    activeRef.current = active;
  }, [active]);
  const begin = useCallback(() => {
    busy.current = true;
    let done = () => {};
    motion.current = new Promise<void>((r) => (done = r));
    return () => {
      busy.current = false;
      motion.current = null;
      done();
    };
  }, []);

  /** Open the card in the light as the full slide: it grows out of the card. */
  const openStory = useCallback(async () => {
    if (!result || open || busy.current) return;
    const end = begin();
    const from = storyRefs.current[active]?.getBoundingClientRect();
    rootRef.current?.setAttribute("data-glide", "");
    flushSync(() => setOpen(true));
    follow(600);
    const el = openRef.current;
    if (el && from && !reduced()) {
      // The slide opens out of the card's own rectangle: a growing window on it, so nothing is stretched, and its
      // words come up once there is room for them.
      const to = el.getBoundingClientRect();
      const inset = cardInset(from, to);
      await Promise.all([
        play(el, [{ clipPath: inset, opacity: 0.6 }, { clipPath: "inset(-90px round 14px)", opacity: 1 }], { duration: 440, easing: GLIDE }),
        ...[...el.children].map((c) => play(c, [{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 260, delay: 130, easing: OUT, fill: "backwards" })),
      ]);
    }
    openTitleRef.current?.focus({ preventScroll: true });
    const s = result.slides[active]!;
    setLive(`Open: ${s.title}, ${s.projectTitle}.`);
    end();
  }, [result, open, active, begin, follow]);

  const closeStory = useCallback(async () => {
    if (motion.current) await motion.current;
    if (!open || busy.current) return;
    const end = begin();
    const at = activeRef.current;
    const el = openRef.current;
    const to = storyRefs.current[at]?.getBoundingClientRect();
    rootRef.current?.setAttribute("data-glide", "");
    if (el && to && !reduced()) {
      // the reverse: the words go, the window closes down onto the card, and the card is back in the light
      const from = el.getBoundingClientRect();
      await Promise.all([...el.children].map((c) => play(c, [{ opacity: 1 }, { opacity: 0 }], { duration: 110, easing: "ease-in", fill: "forwards" })));
      wallRef.current?.removeAttribute("data-open");
      await play(el, [{ clipPath: "inset(-90px round 14px)", opacity: 1 }, { clipPath: cardInset(to, from), opacity: 0.4 }], {
        duration: 340,
        easing: GLIDE,
        fill: "forwards",
      });
    }
    flushSync(() => setOpen(false));
    follow(420);
    storyRefs.current[at]?.focus({ preventScroll: true });
    end();
  }, [open, begin, follow]);

  /** With a slide open, the next story replaces it: the light dips, the slide changes, the light comes back. */
  const step2 = useCallback(
    async (k: number) => {
      // a press while the slide is still moving is kept, not dropped
      if (motion.current) await motion.current;
      if (!result || busy.current) return;
      const j = Math.max(0, Math.min(n - 1, k));
      if (j === activeRef.current) return;
      const end = begin();
      const from = activeRef.current;
      rootRef.current?.setAttribute("data-glide", "");
      const dir = j > activeRef.current ? 1 : -1;
      knock(0.4);
      await play(openRef.current, [{ opacity: 1 }, { opacity: 0.06 }], { duration: 110, easing: "ease-in", fill: "forwards" });
      flushSync(() => setActive(j));
      openRef.current?.getAnimations().forEach((x) => x.cancel());
      const s = result.slides[j]!;
      setLive(`${reelChange(result, from, j)}Story ${j + 1} of ${n}: ${s.title}, ${s.projectTitle}.`);
      await play(
        openRef.current,
        [
          { opacity: 0.1, transform: `translateX(${dir * 16}px)` },
          { opacity: 0.85, offset: 0.45 },
          { opacity: 0.62, offset: 0.6 },
          { opacity: 1, transform: "none" },
        ],
        { duration: 280, easing: OUT },
      );
      openTitleRef.current?.focus({ preventScroll: true });
      rootRef.current?.removeAttribute("data-glide");
      end();
    },
    [result, n, knock, begin],
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
    const back = mag;
    await lightsUp();
    setStatus(brief.trim() && !back.includes("blank") ? readyLine(1) : STATUS.idle);
    back.forEach((c) => {
      const el = slotOf(c);
      if (el) el.dataset.pos = "seated";
    });
    await eject(back, back);
    setLive(back.length > 1 ? "The lights are up. The cards are back in the hand." : "The lights are up. Choose a card.");
    const f = back[0];
    const focusEl = f === "blank" || f === undefined || f === null ? blankRef.current : (cardRefs.current[f] as HTMLElement | null);
    focusEl?.focus({ preventScroll: true });
    busy.current = false;
  }, [phase, mag, brief, eject, lightsUp]);
  useEffect(() => {
    againRef.current = () => void again();
  }, [again]);

  // ---------- render ----------
  const ready = mag.length > 0 || brief.trim().length > 0;
  const lamp = fault ? "fault" : phase === "dark" ? "on" : ready ? "ready" : "off";
  const cur = slides[active];
  const reelNo = cur?.reel ?? 0;
  const reel = result?.reels[reelNo];
  const reels = result?.reels.length ?? 0;
  const curMedia = cur ? media[cardKey(cur.project, cur.section)] : undefined;
  const curTags = cur ? cur.tags.filter((t) => !t.toLowerCase().startsWith(cur.why.toLowerCase())) : [];

  return (
    <div className="pj" ref={rootRef} data-phase={phase} data-stage={stage} data-ready={ready || undefined}>
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
          Put a card in the projector (up to three), or write your own, and the work that answers each is projected, one slide per project.
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
          Pick up to three cards, or write your own
        </p>
        <ol className="pj-stack">
          {questions.map((q, i) => (
            <li key={q} style={{ ["--i" as string]: i }} data-out={away.includes(i) || undefined}>
              <button
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                type="submit"
                name="brief"
                value={q}
                className="pj-card"
                aria-pressed={mag.includes(i)}
                onClick={(e) => {
                  e.preventDefault();
                  load(i);
                }}
              >
                <Face text={q} no={pad2(i + 1)} />
              </button>
            </li>
          ))}
          <li style={{ ["--i" as string]: questions.length }} data-out={away.includes("blank") || undefined}>
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
            {/* the cards in the magazine: the first in the front slot, each one after it further back */}
            {mag.map((c, d) => (
              <div
                key={cardId(c)}
                className="pj-card pj-slotcard"
                ref={(el) => {
                  if (el) slotRefs.current.set(cardId(c), el);
                  else slotRefs.current.delete(cardId(c));
                }}
                data-pos="seated"
                style={{ ["--d" as string]: d, zIndex: MAGAZINE - d }}
              >
                <Face text={textOf(c)} no={noOf(c)} typed={c === "blank"} />
              </div>
            ))}
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
          <span className="pj-lens" aria-hidden="true" />
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
      {/* The camera in the dark: the machine close in the foreground, from the side while it thinks, from behind once
          the light is on the wall. Two photographs of each view's light, placed and turned in JS, with dust in it. */}
      <div className="pj-cam" ref={camRef} data-view={stage === "show" ? "rear" : "34"} aria-hidden="true">
        <div className="pj-view pj-view-34" ref={view34Ref}>
          {/* eslint-disable-next-line @next/next/no-img-element -- preloaded and decoded ahead (DARK_ROOM), so the same URL */}
          <img className="pj-shot" src="/projector/machine-34-off.webp" alt="" width={1620} height={775} draggable={false} decoding="sync" fetchPriority="low" />
          {/* eslint-disable-next-line @next/next/no-img-element -- as above */}
          <img className="pj-shot pj-shot-on" src="/projector/machine-34-on.webp" alt="" width={1620} height={775} draggable={false} decoding="sync" fetchPriority="low" />
          <span className="pj-anchor" ref={lens34Ref} />
        </div>
        <div className="pj-view pj-view-rear">
          {/* eslint-disable-next-line @next/next/no-img-element -- as above */}
          <img className="pj-shot" src="/projector/machine-rear.webp" alt="" width={1420} height={862} draggable={false} decoding="sync" fetchPriority="low" />
          <span className="pj-anchor" ref={lensRearRef} />
        </div>
      </div>
      <div className="pj-beam" ref={beamRef} data-view={stage === "show" ? "rear" : "34"} aria-hidden="true" style={beam ?? { opacity: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- placed and turned per frame, not a content image */}
        <img className="pj-beam-34" src="/projector/beam.webp" alt="" fetchPriority="low" />
        {/* eslint-disable-next-line @next/next/no-img-element -- placed and turned per frame, not a content image */}
        <img className="pj-beam-rear" src="/projector/beam-rear.webp" alt="" fetchPriority="low" />
      </div>
      {/* the dust: placed exactly as the light, but on its own, with no blending, so moving it costs nothing */}
      <div className="pj-beam pj-dustbox" data-view={stage === "show" ? "rear" : "34"} aria-hidden="true" style={beam ?? { opacity: 0 }}>
        {/* dust, already cut to each beam's shape, so it only ever floats in the light */}
        {(["34-a", "34-b", "rear-a", "rear-b"] as const).map((d) => (
          // eslint-disable-next-line @next/next/no-img-element -- as above
          <img key={d} className={`pj-dust pj-beam-${d.slice(0, -2)} pj-dust-${d.slice(-1)}`} src={`/projector/dust-${d}.webp`} alt="" fetchPriority="low" />
        ))}
      </div>
      {phase === "dark" && (
        <>
          <section className="pj-wall" ref={wallRef} aria-labelledby={result ? "r-title" : undefined} aria-label={result ? undefined : "Projecting"} data-open={open || undefined}>
            <header className="pj-wallhead">
              <ol className="pj-steps" aria-hidden="true" data-done={stage === "show" || undefined}>
                {stepsFor(count).map((s, i) => (
                  <li key={s} data-state={i < step ? "done" : i === step ? "now" : "todo"}>
                    {s}
                    {i === step && i < 3 ? "…" : ""}
                  </li>
                ))}
              </ol>
              {result && reel && (
                // one card's answer at a time: it changes as the row turns on to the next card's stories
                <div className="pj-answer" key={reelNo}>
                  <p className="pj-eyebrow">{reels > 1 ? `Card ${reelNo + 1} of ${reels} · No. ${reel.no}` : "Selected for your card"}</p>
                  <h2 id="r-title" ref={titleRef} tabIndex={-1}>
                    {reel.line}
                  </h2>
                  <p className="pj-quote">
                    <span className="sr-only">You asked: </span>
                    {reel.quote}
                  </p>
                  {reel.missing && <p className="pj-missing">{reel.missing}</p>}
                  {reel.provenance && <p className="pj-prov">{reel.provenance}</p>}
                </div>
              )}
              {result && (
                <p className="pj-count" aria-hidden="true">
                  {reels > 1 ? `${reels} cards · ` : ""}
                  {n} {n === 1 ? "story" : "stories"}
                </p>
              )}
            </header>

            <div className="pj-area" ref={areaRef}>
              {/* where the card in the light stands: the beam aims here */}
              <div className="pj-aim" ref={aimRef} aria-hidden="true" />
              <div className="pj-patch" aria-hidden="true" data-out={stage === "show" || undefined} />
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
                        key={`${s.project}#${s.section}#${s.reel}`}
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
                          {reels > 1 && (
                            <span className="pj-also">
                              {" "}
                              · card {[cur.reel, ...cur.also].map((r) => r + 1).sort().join(" and ")}
                            </span>
                          )}
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
                        <li key={`${s.project}#${s.section}#${s.reel}`} data-next-card={(i > 0 && slides[i - 1]!.reel !== s.reel) || undefined}>
                          <button type="button" aria-current={i === active || undefined} title={s.title} onClick={() => go(i)}>
                            <span className="sr-only">
                              {i + 1}: {s.title}
                              {reels > 1 ? ` (card ${s.reel + 1})` : ""}
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
