"use client";

import { useEffect, useRef, useState } from "react";

const OUT = "cubic-bezier(0.16, 1, 0.3, 1)";
const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Three hand-drawn signature strokes; one is picked at random each time. */
const SIGS = ["M2 6 C 30 3.4, 64 8.6, 98 4.6", "M2 4.6 C 34 8.6, 60 2.2, 98 6.2", "M2 7 C 22 4.4, 70 7.6, 98 3.6"];

/**
 * The footer's note about AI. On hover (and keyboard focus) a red line is drawn under the claim like a signature,
 * and drawn back on leaving. On touch screens it is drawn once as the footer comes into view.
 */
export function FooterNote({ lead, claim }: { lead: string; claim: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const host = ref.current;
    const p = pathRef.current;
    if (!host || !p) return;
    const sign = () => {
      if (reduce()) return;
      p.setAttribute("d", SIGS[Math.floor(Math.random() * SIGS.length)]!);
      p.animate([{ strokeDashoffset: 1.6 }, { strokeDashoffset: 0 }], { duration: 450, easing: OUT, fill: "forwards" });
    };
    const unsign = () => {
      if (reduce()) return;
      p.animate([{ strokeDashoffset: 0 }, { strokeDashoffset: 1.6 }], { duration: 260, easing: "ease-in", fill: "forwards" });
    };
    const enter = (e: PointerEvent) => e.pointerType !== "touch" && sign();
    const leave = (e: PointerEvent) => e.pointerType !== "touch" && unsign();
    host.addEventListener("pointerenter", enter);
    host.addEventListener("pointerleave", leave);
    let io: IntersectionObserver | null = null;
    if (window.matchMedia("(hover: none)").matches && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        ([e]) => {
          if (!e?.isIntersecting) return;
          io?.disconnect();
          setTimeout(sign, 300);
        },
        { threshold: 0.8 },
      );
      io.observe(host);
    }
    return () => {
      host.removeEventListener("pointerenter", enter);
      host.removeEventListener("pointerleave", leave);
      io?.disconnect();
    };
  }, []);

  return (
    <p ref={ref} className="ft-note">
      {lead}{" "}
      <b className="ft-claim">
        {claim}
        <svg className="ft-sig" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path ref={pathRef} pathLength={1} d={SIGS[0]} />
        </svg>
      </b>
    </p>
  );
}

/**
 * Copy the email address: a small slip prints up out of the button saying "Copied", in the printer's stepped
 * motion, and feeds back down. If the clipboard is refused, the address itself is selected instead.
 */
export function CopyEmail({ email }: { email: string }) {
  const slip = useRef<HTMLSpanElement>(null);
  const [said, setSaid] = useState("");

  const done = () => {
    setSaid("Copied");
    setTimeout(() => setSaid(""), 1900);
    const el = slip.current;
    if (!el) return;
    el.getAnimations().forEach((a) => a.cancel());
    if (reduce()) {
      el.animate([{ clipPath: "inset(0 0 0 0)" }, { clipPath: "inset(0 0 0 0)" }], { duration: 1400 });
      return;
    }
    el.animate(
      [{ clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0 0 0 0)", offset: 0.25 }, { clipPath: "inset(0 0 0 0)", offset: 0.82 }, { clipPath: "inset(100% 0 0 0)" }],
      { duration: 1900, easing: "steps(18, end)" },
    );
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      done();
    } catch {
      const a = document.querySelector<HTMLElement>(".ft-mail a");
      if (a) window.getSelection()?.selectAllChildren(a);
    }
  };

  return (
    <button type="button" className="ft-copy" onClick={copy} aria-label="Copy email address">
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path className="ft-copy-back" d="M8.6 7.7c-.1-1.3 0-2.7.1-4 3.6-.2 7.2-.2 10.8 0 .2 3.7.2 7.4 0 11.1-1.3.1-2.6.1-3.9 0" />
        <path d="M4.6 8.8c3.7-.2 7.3-.2 11 0 .2 3.8.2 7.6 0 11.4-3.7.2-7.3.2-11 0-.2-3.8-.2-7.6 0-11.4z" />
      </svg>
      <span ref={slip} className="ft-slip" aria-hidden="true">
        Copied
      </span>
      <span className="sr-only" aria-live="polite">
        {said}
      </span>
    </button>
  );
}
