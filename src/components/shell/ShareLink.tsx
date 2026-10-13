"use client";

import { useRef, useState } from "react";

const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";
const OUT = "cubic-bezier(0.16, 1, 0.3, 1)";
const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * "Share this print" (docs/case-studies/ux-proposals.md, 04): the link to this print, built from the topics the
 * printer understood (never the visitor's own words, so a pasted job description stays out of the address).
 * Touch screens open the share sheet; elsewhere the link is copied and the label is knocked into "Link copied", like
 * the hammer's letters. If both are refused, the link is shown, selected, to copy by hand.
 */
export function ShareLink({ topics }: { topics: readonly string[] }) {
  const [label, setLabel] = useState("Share this print");
  const [manual, setManual] = useState("");
  const labelRef = useRef<HTMLSpanElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);

  if (!topics.length) return null;
  const href = () => `${window.location.origin}/ask?topics=${topics.map(encodeURIComponent).join(",")}`;

  const knock = () => {
    if (reduce()) return;
    labelRef.current?.querySelectorAll("i").forEach((l, i) =>
      l.animate(
        [
          { translate: "0 0", rotate: "0deg" },
          { translate: `${rnd(-1.2, 1.2)}px ${rnd(-3, -1)}px`, rotate: `${rnd(-6, 6)}deg`, offset: 0.3 },
          { translate: "0 0", rotate: "0deg" },
        ],
        { duration: 460, delay: i * 14, easing: SPRING },
      ),
    );
  };

  const say = (s: string) => {
    setLabel(s);
    requestAnimationFrame(knock);
    setTimeout(() => setLabel("Share this print"), 1800);
  };

  const share = async () => {
    const url = href();
    if (window.matchMedia("(hover: none)").matches && typeof navigator.share === "function") {
      try {
        await navigator.share({ url, title: document.title });
        return;
      } catch (e) {
        if ((e as DOMException)?.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      say("Link copied");
    } catch {
      setManual(url);
    }
  };

  const draw = () => {
    if (reduce()) return;
    iconRef.current?.querySelectorAll<SVGPathElement>(".out, .head").forEach((p, i) =>
      p.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 320, delay: i * 160, easing: OUT, fill: "backwards" }),
    );
  };

  return (
    <span className="share-wrap">
      <button type="button" className="share" onClick={share} onPointerEnter={(e) => e.pointerType !== "touch" && draw()}>
        <svg ref={iconRef} className="share-ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M4.2 13.6c-.1 2.3 0 4.4.2 6.3 5.1.3 10.2.2 15.3-.1.2-2 .2-4.1.1-6.2" />
          <path className="out" pathLength={1} d="M12 15.2c.1-3.4.2-6.9.1-10.3" />
          <path className="head" pathLength={1} d="M8.6 8.2c1.2-1.2 2.3-2.4 3.4-3.7 1.2 1.2 2.3 2.5 3.4 3.8" />
        </svg>
        <span ref={labelRef} className="share-label" aria-hidden="true">
          {[...label].map((c, i) => (
            <i key={`${label}-${i}`}>{c === " " ? " " : c}</i>
          ))}
        </span>
        <span className="sr-only">Share this print</span>
      </button>
      <span className="sr-only" aria-live="polite">
        {label === "Share this print" ? "" : label}
      </span>
      {manual && (
        <input
          className="share-manual"
          readOnly
          value={manual}
          aria-label="Link to this print"
          ref={(el) => {
            el?.focus();
            el?.select();
          }}
        />
      )}
    </span>
  );
}
