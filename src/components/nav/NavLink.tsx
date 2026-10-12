"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, type FocusEvent, type PointerEvent as ReactPointerEvent } from "react";

/*
 * The header's two links, plain words with a small drawn icon that does what the word means, on hover and on
 * keyboard focus:
 *   work  – a stack of slides: the front one is lifted and dropped back, as if you were looking through them
 *   about – a pair of eyes that follow the pointer; they blink on hover and glance about on keyboard focus
 * A little randomness each time, at most 0.6 s, nothing moves the layout, and with "reduce motion" they stand still.
 * Plain Web Animations API. Case files don't use these (playbook §7): their controls stay serious.
 */

type Kind = "work" | "about";

const reduce = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";
const OUT = "cubic-bezier(0.16, 1, 0.3, 1)";

export function NavLink({ kind, href, label, current }: { kind: Kind; href: string; label: string; current?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);

  // ---- work: look through the slides ----
  const riffle = useCallback(() => {
    const el = ref.current;
    const front = el?.querySelector<SVGGElement>(".ico-front");
    const mid = el?.querySelector<SVGGElement>(".ico-mid");
    if (!front || !mid) return;
    const tilt = rnd(-14, -8);
    front.animate(
      [
        { translate: "0 0", rotate: "0deg" },
        { translate: `${rnd(-1, 1).toFixed(2)}px -6px`, rotate: `${tilt}deg`, offset: 0.4 },
        { translate: "0 0", rotate: "0deg" },
      ],
      { duration: 520, easing: SPRING },
    );
    mid.animate(
      [
        { translate: "0 0", rotate: "0deg" },
        { translate: "0 -2.5px", rotate: `${(tilt / 3).toFixed(2)}deg`, offset: 0.5 },
        { translate: "0 0", rotate: "0deg" },
      ],
      { duration: 520, delay: 60, easing: SPRING },
    );
  }, []);

  // ---- about: the eyes ----
  const look = useCallback((x: number, y: number) => {
    const el = ref.current;
    if (!el) return;
    const eyes = el.querySelectorAll<SVGCircleElement>(".ico-pupil");
    const r = el.getBoundingClientRect();
    const dx = x - (r.left + r.width / 2);
    const dy = y - (r.top + r.height / 2);
    const dist = Math.hypot(dx, dy);
    if (dist > 220) {
      eyes.forEach((p) => p.animate([{ translate: "0 0" }], { duration: 300, easing: OUT, fill: "forwards" }));
      return;
    }
    const m = Math.min(1, dist / 90) * 1.8;
    const a = Math.atan2(dy, dx);
    const t = `${(Math.cos(a) * m).toFixed(2)}px ${(Math.sin(a) * m * 0.9).toFixed(2)}px`;
    eyes.forEach((p) => p.animate([{ translate: t }], { duration: 120, easing: OUT, fill: "forwards" }));
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

  const enter = () => {
    if (reduce()) return;
    if (kind === "work") riffle();
    else blink();
  };
  const onFocus = (e: FocusEvent<HTMLAnchorElement>) => {
    if (reduce() || !e.currentTarget.matches(":focus-visible")) return;
    if (kind === "work") riffle();
    else {
      blink();
      glance();
    }
  };
  const press = (e: ReactPointerEvent<HTMLAnchorElement>) => {
    if (reduce()) return;
    e.currentTarget.animate([{ scale: "1" }, { scale: "0.965", offset: 0.4 }, { scale: "1" }], { duration: 220, easing: OUT });
  };

  return (
    <Link
      ref={ref}
      href={href}
      className={`navlink navlink-${kind}`}
      aria-current={current ? "page" : undefined}
      onPointerEnter={enter}
      onPointerDown={press}
      onFocus={onFocus}
    >
      <Icon kind={kind} />
      <span>{label}</span>
    </Link>
  );
}

/** Drawn icons: one stroke weight, slightly uneven lines, round ends. */
function Icon({ kind }: { kind: Kind }) {
  if (kind === "work")
    return (
      <svg className="navlink-ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <g>
          <path d="M8.6 4.6c3.6-.2 7.3-.2 10.9.1.5 0 .8.4.8.9-.1 2.6-.1 5.2 0 7.8" />
        </g>
        <g className="ico-mid" style={{ transformOrigin: "12px 19px" }}>
          <path d="M6.2 7.4c3.7-.2 7.5-.2 11.2.1.5 0 .8.4.8.9-.1 2.7-.1 5.4 0 8" />
        </g>
        <g className="ico-front" style={{ transformOrigin: "9px 20px" }}>
          <path
            d="M3.6 10.6c.1-.6.5-.9 1-.9 3.6-.1 7.2-.1 10.8 0 .6 0 1 .4 1 1 .1 2.7.1 5.4 0 8.1 0 .6-.4 1-1 1-3.6.1-7.2.1-10.8 0-.6 0-1-.4-1-1-.1-2.7-.1-5.5 0-8.2z"
          />
          <path d="M6.6 16.2c1.2-1.4 2.2-2.5 3.1-2.4.9.1 1.2 1.3 2.2 1.4.8.1 1.4-.6 2-1.3" />
        </g>
      </svg>
    );
  return (
    <svg className="navlink-ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
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
}
