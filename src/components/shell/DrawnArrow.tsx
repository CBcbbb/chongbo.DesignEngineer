"use client";

import { useEffect, useRef } from "react";

/*
 * The shell's one arrow (docs/case-studies/ux-proposals.md, 07): hand-drawn, one stroke weight, round ends, a
 * different line each time. It belongs to its link or button (the nearest `a`, `button` or `[data-arrow-host]`) and
 * acts on that host's hover and keyboard focus:
 *   grow  – a stub at rest; draws out towards the host's `[data-arrow-to]` (the next case file's name), stopping
 *           about 85% of the way: a wave, a bow or, now and then, a small loop
 *   nudge – a stub at rest; draws out to the arrow's own width ("Read it in context")
 *   out   – a short stub turned up and out (links that leave the site); draws a little further
 *   still – drawn once, never moves (the deck bar's buttons)
 * Plain Web Animations API. With reduced motion the arrow is drawn in full at once. The shell only: case-file cards
 * keep their own controls (playbook §7).
 */

export type ArrowKind = "grow" | "nudge" | "out" | "still";

const NS = "http://www.w3.org/2000/svg";
const OUT = "cubic-bezier(0.16, 1, 0.3, 1)";
const DRAW = "cubic-bezier(0.3, 0.75, 0.25, 1)";
const STUB: Record<ArrowKind, number> = { grow: 28, nudge: 16, out: 12, still: 0 };
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const reduce = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** The line, from x=2 to x=L, centred on the box's middle. 0: a wave, 1: a bow, 2: a small loop near the start. */
function line(v: number, L: number, H: number, long: boolean): string {
  const m = H / 2;
  const amp = clamp(L * 0.034, 1.2, long ? 17 : 2.6);
  if (v === 1) return `M2 ${m + 1.2} C ${L * 0.3} ${m - amp * 1.5}, ${L * 0.7} ${m - amp * 1.3}, ${L} ${m - 0.4}`;
  if (v === 2) {
    const x = Math.min(L * 0.28, 120);
    const t = L - x;
    return (
      `M2 ${m + 2} C ${x * 0.5} ${m + 3}, ${x - 8} ${m + 5}, ${x + 10} ${m - 1}` +
      ` C ${x + 24} ${m - 12}, ${x + 14} ${m - 31}, ${x + 2} ${m - 25}` +
      ` C ${x - 9} ${m - 19}, ${x - 5} ${m + 7}, ${x + 16} ${m + 7}` +
      ` C ${x + t * 0.35} ${m + 7}, ${x + t * 0.7} ${m - amp * 0.8}, ${L} ${m}`
    );
  }
  return `M2 ${m + 1} C ${L * 0.2} ${m - amp}, ${L * 0.38} ${m + amp}, ${L * 0.58} ${m + 0.2} S ${L * 0.88} ${m - amp * 0.7}, ${L} ${m - 0.4}`;
}

/** Two uneven strokes at a point on the path, following the line's direction there. */
function head(path: SVGPathElement, at: number, size: number): string {
  const tip = path.getPointAtLength(at);
  const back = path.getPointAtLength(Math.max(0, at - 7));
  const a = Math.atan2(tip.y - back.y, tip.x - back.x);
  const c = Math.cos(a);
  const s = Math.sin(a);
  const P = (dx: number, dy: number) => `${(tip.x + (dx * c - dy * s) * size).toFixed(2)} ${(tip.y + (dx * s + dy * c) * size).toFixed(2)}`;
  return `M${P(-9.6, -6.4)} Q ${P(-4, -2.4)} ${P(0.6, 0)} Q ${P(-4.6, 2.9)} ${P(-8.8, 6.8)}`;
}

export function DrawnArrow({ kind, className }: { kind: ArrowKind; className?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const host = svg.parentElement?.closest<HTMLElement>("a, button, [data-arrow-host]");
    const shaft = document.createElementNS(NS, "path");
    const tipPath = document.createElementNS(NS, "path");
    const stubTip = document.createElementNS(NS, "path");
    svg.replaceChildren(shaft, tipPath, stubTip);

    const long = kind === "grow";
    const size = long ? 1.4 : 0.8;
    const st = { v: 0, out: false, total: 0, ht: 0, stub: STUB[kind] };

    const layout = () => {
      const w = svg.clientWidth || svg.getBoundingClientRect().width || 24;
      const H = svg.clientHeight || svg.getBoundingClientRect().height || 24;
      let L = Math.max(14, w - 6);
      const to = long ? host?.querySelector<HTMLElement>("[data-arrow-to]") : null;
      if (to) {
        const sr = svg.getBoundingClientRect();
        const k = sr.width / w || 1;
        const range = document.createRange();
        range.selectNodeContents(to);
        const rects = Array.from(range.getClientRects());
        // Only when the name sits on the arrow's row (on phones it wraps below and the arrow is hidden anyway).
        if (rects.length && rects[0]!.top < sr.bottom) L = Math.max(24, ((Math.min(...rects.map((r) => r.left)) - sr.left) / k - 20) * 0.85);
      }
      svg.setAttribute("viewBox", `0 0 ${Math.max(w, 24)} ${H}`);
      shaft.setAttribute("d", line(st.v, L, H, long));
      st.total = shaft.getTotalLength();
      tipPath.setAttribute("d", head(shaft, st.total, size));
      st.ht = tipPath.getTotalLength();
      shaft.style.strokeDasharray = `${st.total} ${st.total}`;
      tipPath.style.strokeDasharray = `${st.ht} ${st.ht}`;
      if (kind === "still" || (reduce() && st.out)) {
        shaft.style.strokeDashoffset = "0";
        tipPath.style.strokeDashoffset = "0";
        stubTip.setAttribute("d", "");
        return;
      }
      if (!st.out) {
        shaft.style.strokeDashoffset = String(Math.max(0, st.total - st.stub));
        tipPath.style.strokeDashoffset = String(st.ht);
        stubTip.setAttribute("d", st.stub ? head(shaft, st.stub, size * 0.9) : "");
        stubTip.style.opacity = "1";
      }
    };

    const draw = (out: boolean) => {
      if (kind === "still" || st.out === out) return;
      shaft.getAnimations().forEach((a) => a.cancel());
      tipPath.getAnimations().forEach((a) => a.cancel());
      if (out) {
        const choices = long && st.total > 160 ? [0, 1, 2] : [0, 1];
        let v = st.v;
        for (let i = 0; i < 3 && v === st.v; i++) v = choices[Math.floor(Math.random() * choices.length)]!;
        st.v = v;
        layout();
        st.out = true;
        stubTip.style.opacity = "0";
        if (reduce()) {
          shaft.style.strokeDashoffset = "0";
          tipPath.style.strokeDashoffset = "0";
          return;
        }
        shaft.style.strokeDashoffset = "0";
        tipPath.style.strokeDashoffset = "0";
        shaft.animate([{ strokeDashoffset: st.total - st.stub }, { strokeDashoffset: 0 }], { duration: long ? 700 : 300, easing: DRAW, fill: "backwards" });
        tipPath.animate([{ strokeDashoffset: st.ht }, { strokeDashoffset: 0 }], { duration: long ? 240 : 170, delay: long ? 600 : 220, easing: OUT, fill: "backwards" });
      } else {
        st.out = false;
        if (reduce()) {
          layout();
          return;
        }
        const rest = Math.max(0, st.total - st.stub);
        shaft.style.strokeDashoffset = String(rest);
        tipPath.style.strokeDashoffset = String(st.ht);
        tipPath.animate([{ strokeDashoffset: 0 }, { strokeDashoffset: st.ht }], { duration: 140, easing: "ease-in" });
        const back = shaft.animate([{ strokeDashoffset: 0 }, { strokeDashoffset: rest }], { duration: long ? 380 : 240, delay: 60, easing: "ease-in", fill: "backwards" });
        back.onfinish = () => {
          if (!st.out) layout();
        };
      }
    };

    layout();
    if (kind === "still" || !host) return;
    const enter = (e: PointerEvent) => e.pointerType !== "touch" && draw(true);
    const leave = (e: PointerEvent) => e.pointerType !== "touch" && draw(false);
    const focus = () => host.matches(":focus-visible") && draw(true);
    const blur = () => draw(false);
    host.addEventListener("pointerenter", enter);
    host.addEventListener("pointerleave", leave);
    host.addEventListener("focus", focus);
    host.addEventListener("blur", blur);
    const ro = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(() => !st.out && layout());
    ro?.observe(svg);
    if (host !== svg.parentElement) ro?.observe(host);
    document.fonts?.ready.then(() => !st.out && layout());
    return () => {
      host.removeEventListener("pointerenter", enter);
      host.removeEventListener("pointerleave", leave);
      host.removeEventListener("focus", focus);
      host.removeEventListener("blur", blur);
      ro?.disconnect();
    };
  }, [kind]);

  return <svg ref={ref} className={`ga ga-${kind}${className ? ` ${className}` : ""}`} aria-hidden="true" focusable="false" />;
}
