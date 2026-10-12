"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

/**
 * Scales its content down, never up, to fit the box it is given. On a printed sheet of fixed height the evidence
 * (a table, a pair of phones, a recording) keeps its shape and proportions and simply prints smaller; where the box
 * is unconstrained (a column on a phone, the /ask list) nothing changes.
 */
export function FitMedia({ children }: { children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const b = box.current;
    const c = inner.current;
    if (!b || !c || typeof ResizeObserver === "undefined") return;
    const fit = () => {
      const w = b.clientWidth;
      const h = b.clientHeight;
      const cw = c.offsetWidth;
      const ch = c.offsetHeight;
      if (!w || !h || !cw || !ch) return;
      const s = Math.min(1, w / cw, h / ch);
      c.style.transform = s < 0.999 ? `scale(${s})` : "";
    };
    const ro = new ResizeObserver(fit);
    ro.observe(b);
    ro.observe(c);
    fit();
    return () => ro.disconnect();
  }, []);

  return (
    <div className="fit" ref={box}>
      <div className="fit-in" ref={inner}>
        {children}
      </div>
    </div>
  );
}
