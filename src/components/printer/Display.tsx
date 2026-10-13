"use client";

import { useLayoutEffect, useRef } from "react";

/**
 * The printer's dot-matrix display: two lines of live text over the photographed glass (the render ships it blank),
 * a status dot and, while printing, a four-part progress bar. Decorative: what it says is also announced in the
 * printer's live region, so it is hidden from assistive technology.
 *
 * A new line is wiped on left to right, as a dot-matrix screen redraws (180ms, 9 steps). A line wider than the
 * screen runs once as a ticker and rests on its start. Counters (`instant`) change without the wipe.
 */
export type DisplayState = { l1: string; l2?: string; seg?: number; instant?: boolean };

const reduce = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Line({ text, instant, className }: { text: string; instant?: boolean; className: string }) {
  const box = useRef<HTMLSpanElement>(null);
  const span = useRef<HTMLSpanElement>(null);
  const first = useRef(true);
  useLayoutEffect(() => {
    const el = span.current;
    const wrap = box.current;
    if (!el || !wrap) return;
    el.getAnimations().forEach((a) => a.cancel());
    if (first.current) {
      first.current = false;
      return;
    }
    if (reduce() || instant || !text) return;
    el.animate([{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)" }], { duration: 180, easing: "steps(9, end)" });
    const over = el.scrollWidth - wrap.clientWidth;
    if (over > 2)
      el.animate(
        [{ translate: "0 0" }, { translate: "0 0", offset: 0.25 }, { translate: `${-over}px 0`, offset: 0.8 }, { translate: `${-over}px 0` }],
        { duration: 900 + over * 22, delay: 200, easing: "linear" },
      );
  }, [text, instant]);
  return (
    <span ref={box} className={className}>
      <span ref={span}>{text}</span>
    </span>
  );
}

export function Display({ l1, l2 = "", seg = -1, instant }: DisplayState) {
  return (
    <div className="disp" aria-hidden="true">
      <div className="disp-in">
        <span className="disp-row">
          <Line className="disp-l1" text={l1} />
          <i className="disp-dot" />
        </span>
        <Line className="disp-l2" text={l2} instant={instant} />
        {seg >= 0 && (
          <span className="disp-bar">
            {[0, 1, 2, 3].map((i) => (
              <i key={i} className={i <= seg ? "on" : undefined} />
            ))}
          </span>
        )}
      </div>
    </div>
  );
}
