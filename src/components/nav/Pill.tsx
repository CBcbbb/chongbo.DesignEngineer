"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, type FocusEvent, type PointerEvent as ReactPointerEvent } from "react";

/*
 * The shell's own links (nav, the browse link): a word with a small drawn icon that does what the word
 * means on hover and on keyboard focus:
 *   work  – a hammer knocks the letters about; they spring back
 *   about – the eyes look at the pointer
 *   all   – the asterisk turns
 *   back  – a hand-drawn line draws out to the left and, on leaving, draws back (unused for now)
 * A little randomness each time, short (≤ 0.6 s), nothing changes layout, and with
 * "reduce motion" everything stands still. Plain Web Animations API: no library.
 * Case files don't use these (playbook §7): their controls stay serious.
 */

export type PillKind = "work" | "about" | "all" | "back";

type Props = {
  kind: PillKind;
  href: string;
  label: string;
  current?: boolean;
  className?: string;
};

const reduce = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";
const OUT = "cubic-bezier(0.16, 1, 0.3, 1)";

/** Three hand-drawn return lines; one is picked at random each time. */
const BACK_LINES = [
  { line: "M2 12 C-7 8.5, -17 15, -29 10.6", head: "M-23 5.6 L-30 10.6 L-22.4 15.6" },
  { line: "M2 12.4 C-5 15.2, -16 7.4, -29 11.4", head: "M-23 6.4 L-30 11.4 L-22.6 16.6" },
  { line: "M2 11.2 C-9 9.4, -13 14.6, -29 12", head: "M-23 7 L-30 12 L-22.6 17.2" },
];

export function Pill({ kind, href, label, current, className }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const hits = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const over = useRef(false);

  // ---- work: the hammer ----
  const knock = useCallback((hard: boolean) => {
    const el = ref.current;
    if (!el) return;
    el.querySelectorAll<HTMLElement>(".pill-letter").forEach((l, i) => {
      const k = hard ? 2.2 : 1;
      l.animate(
        [
          { translate: "0 0", rotate: "0deg" },
          { translate: `${rnd(-1.4, 1.4) * k}px ${rnd(-3.2, -0.8) * k}px`, rotate: `${rnd(-6, 6) * k}deg`, offset: 0.3 },
          { translate: "0 0", rotate: "0deg" },
        ],
        { duration: hard ? 600 : 460, easing: SPRING, delay: i * 14 },
      );
    });
  }, []);

  const strike = useCallback(function strikeOnce() {
    const el = ref.current;
    const hammer = el?.querySelector<SVGGElement>(".ico-hammer");
    if (!el || !hammer || !over.current) return;
    hits.current += 1;
    const hard = hits.current % 5 === 0;
    const lift = rnd(-30, -22);
    hammer.animate(
      [{ rotate: "0deg" }, { rotate: `${lift}deg`, offset: 0.4 }, { rotate: `${rnd(8, 14)}deg`, offset: 0.62 }, { rotate: "0deg" }],
      { duration: 380, easing: "ease-in-out" },
    );
    setTimeout(() => knock(hard), 190);
    if (hits.current < 6) timer.current = setTimeout(strikeOnce, 400);
  }, [knock]);

  // ---- about: the eyes ----
  const look = useCallback((x: number, y: number, force = false) => {
    const el = ref.current;
    if (!el) return;
    const eyes = el.querySelectorAll<SVGCircleElement>(".ico-pupil");
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.hypot(dx, dy);
    if (!force && dist > 220) {
      eyes.forEach((p) => p.animate([{ translate: "0 0" }], { duration: 300, easing: OUT, fill: "forwards" }));
      return;
    }
    const m = Math.min(1, dist / 90) * 1.8;
    const a = Math.atan2(dy, dx);
    const tx = (Math.cos(a) * m).toFixed(2);
    const ty = (Math.sin(a) * m * 0.9).toFixed(2);
    eyes.forEach((p) => p.animate([{ translate: `${tx}px ${ty}px` }], { duration: 120, easing: OUT, fill: "forwards" }));
  }, []);

  useEffect(() => {
    if (kind !== "about" || reduce()) return;
    let raf = 0;
    let last: PointerEvent | null = null;
    const move = (e: PointerEvent) => {
      last = e;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (last) look(last.clientX, last.clientY);
      });
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [kind, look]);

  const blink = useCallback(() => {
    ref.current?.querySelectorAll<SVGElement>(".ico-lid").forEach((lid, i) => {
      lid.animate([{ transform: "scaleY(1)" }, { transform: "scaleY(0.08)", offset: 0.5 }, { transform: "scaleY(1)" }], {
        duration: 200,
        delay: i * 25,
        easing: "ease-in-out",
      });
    });
  }, []);

  /** Keyboard focus: a glance left, right, centre. */
  const glance = useCallback(() => {
    const dir = Math.random() < 0.5 ? -1 : 1;
    ref.current?.querySelectorAll<SVGCircleElement>(".ico-pupil").forEach((p) => {
      p.animate(
        [
          { translate: "0 0" },
          { translate: `${1.7 * dir}px 0.2px`, offset: 0.3 },
          { translate: `${-1.7 * dir}px 0.2px`, offset: 0.7 },
          { translate: "0 0" },
        ],
        { duration: 600, easing: "ease-in-out" },
      );
    });
  }, []);

  // ---- all: the asterisk ----
  const turn = useCallback(() => {
    const star = ref.current?.querySelector<SVGGElement>(".ico-star");
    if (!star) return;
    const dir = Math.random() < 0.5 ? -1 : 1;
    star.animate([{ rotate: "0deg" }, { rotate: `${dir * (180 + rnd(-24, 24))}deg` }], { duration: 560, easing: SPRING });
  }, []);

  // ---- back: the drawn line ----
  const draw = useCallback((out: boolean) => {
    const el = ref.current;
    const line = el?.querySelector<SVGPathElement>(".ico-back-line");
    const head = el?.querySelector<SVGPathElement>(".ico-back-head");
    if (!el || !line || !head) return;
    if (out) {
      const v = BACK_LINES[Math.floor(Math.random() * BACK_LINES.length)]!;
      line.setAttribute("d", v.line);
      head.setAttribute("d", v.head);
      const L = line.getTotalLength();
      const H = head.getTotalLength();
      line.style.strokeDasharray = `${L}`;
      head.style.strokeDasharray = `${H}`;
      line.animate([{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration: 360, easing: OUT, fill: "forwards" });
      head.animate([{ strokeDashoffset: H }, { strokeDashoffset: 0 }], { duration: 200, delay: 260, easing: OUT, fill: "forwards" });
    } else {
      const L = line.getTotalLength();
      const H = head.getTotalLength();
      head.animate([{ strokeDashoffset: 0 }, { strokeDashoffset: H }], { duration: 140, easing: "ease-in", fill: "forwards" });
      line.animate([{ strokeDashoffset: 0 }, { strokeDashoffset: L }], { duration: 260, delay: 60, easing: "ease-in", fill: "forwards" });
    }
  }, []);

  // ---- wiring ----
  const enter = useCallback(() => {
    if (reduce()) return;
    over.current = true;
    hits.current = 0;
    if (kind === "work") {
      if (timer.current) clearTimeout(timer.current);
      strike();
    } else if (kind === "about") blink();
    else if (kind === "all") turn();
    else draw(true);
  }, [kind, strike, blink, turn, draw]);

  const leave = useCallback(() => {
    over.current = false;
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    if (reduce()) return;
    if (kind === "back") draw(false);
  }, [kind, draw]);

  const onFocus = (e: FocusEvent<HTMLAnchorElement>) => {
    if (!e.currentTarget.matches(":focus-visible")) return;
    if (kind === "about") {
      if (!reduce()) {
        blink();
        glance();
      }
      return;
    }
    enter();
  };

  const press = (e: ReactPointerEvent<HTMLAnchorElement>) => {
    if (reduce()) return;
    e.currentTarget.animate([{ scale: "1" }, { scale: "0.965", offset: 0.4 }, { scale: "1" }], { duration: 220, easing: OUT });
  };

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  return (
    <Link
      ref={ref}
      href={href}
      className={`pill pill-${kind}${className ? ` ${className}` : ""}`}
      aria-current={current ? "page" : undefined}
      onPointerEnter={enter}
      onPointerLeave={leave}
      onPointerDown={press}
      onFocus={onFocus}
      onBlur={leave}
    >
      <Icon kind={kind} />
      <span className="pill-label" aria-hidden="true">
        {[...label].map((ch, i) => (
          <span key={i} className={ch === " " ? "pill-space" : "pill-letter"}>
            {ch === " " ? " " : ch}
          </span>
        ))}
      </span>
      <span className="sr-only">{label}</span>
    </Link>
  );
}

/** Hand-drawn icons: one stroke weight, slightly uneven lines, round ends. */
function Icon({ kind }: { kind: PillKind }) {
  switch (kind) {
    case "work":
      return (
        <svg className="pill-ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <g className="ico-hammer">
            <path d="M4.4 19.7c2.6-3.3 5.5-6.4 8.7-9.3" />
            <path d="M13.4 3.6c2.2 2.1 4.4 4.3 6.5 6.5-1.1 1-2.1 2-3.2 3.1-2.2-2.1-4.3-4.3-6.4-6.5 1-1.1 2-2.1 3.1-3.1z" />
          </g>
        </svg>
      );
    case "about":
      return (
        <svg className="pill-ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <g className="ico-lid" style={{ transformOrigin: "7px 12px" }}>
            <path d="M7 6.4c2.1.1 3.5 2.7 3.4 5.8-.1 3-1.6 5.5-3.6 5.4-2-.1-3.4-2.7-3.3-5.7.1-3 1.5-5.6 3.5-5.5z" />
          </g>
          <g className="ico-lid" style={{ transformOrigin: "17.2px 12px" }}>
            <path d="M17.2 6.2c2.1.1 3.5 2.7 3.4 5.8-.1 3-1.6 5.5-3.6 5.4-2-.1-3.4-2.7-3.3-5.7.1-3 1.5-5.6 3.5-5.5z" />
          </g>
          <circle className="ico-pupil" cx="7.1" cy="12.1" r="1.75" />
          <circle className="ico-pupil" cx="17.2" cy="11.9" r="1.75" />
        </svg>
      );
    case "all":
      return (
        <svg className="pill-ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <g className="ico-star" style={{ transformOrigin: "12px 12px" }}>
            <path d="M12 3.6c.2 5.6.1 11.2-.2 16.8" />
            <path d="M4.7 7.9c4.8 2.9 9.7 5.5 14.6 8.2" />
            <path d="M4.5 16.3c4.9-2.9 9.8-5.6 14.8-8.3" />
          </g>
        </svg>
      );
    case "back":
      return (
        <>
          <svg className="pill-ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M19 12.2c-4.4-.3-8.8-.2-13.2.1" />
            <path d="M10.2 7.6c-1.6 1.4-3.1 3-4.4 4.7 1.4 1.5 2.9 3 4.6 4.3" />
          </svg>
          <svg className="pill-ico-line" viewBox="-32 0 36 24" aria-hidden="true" focusable="false">
            <path className="ico-back-line" d={BACK_LINES[0]!.line} />
            <path className="ico-back-head" d={BACK_LINES[0]!.head} />
          </svg>
        </>
      );
  }
}

/** The header's Work link. */
export function WorkPill({ current }: { current?: boolean }) {
  return <Pill kind="work" href="/work" label="Work" current={current} />;
}
