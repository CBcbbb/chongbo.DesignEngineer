"use client";

import { useCallback, useEffect, useRef, type ReactNode, type RefObject } from "react";
import type { Capability } from "@content";

/*
 * Micro-interactions for the block library (playbook §7, "Interaction and motion"). Text and icons both take
 * part in a hover, with a little randomness each time, so no two hovers look the same. Focus triggers the same
 * as hover, nothing loops, nothing takes longer than 0.7s, and all of it stands still with reduced motion.
 * First built in Nike's NikeClient.tsx (Wobble, ChipIcon); moved here when HHCD became the second project to need them.
 */

const still = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const rand = (min: number, max: number) => min + Math.random() * (max - min);

/** Runs `on` when the nearest link, button or label is hovered or focused, and `off` when it is left. */
export function useHost(ref: RefObject<Element | null>, on: (host: HTMLElement) => void, off?: (host: HTMLElement) => void) {
  useEffect(() => {
    const host = ref.current?.closest<HTMLElement>("a, button, label");
    if (!host || still()) return;
    const focusable = host.matches("label") ? host.querySelector("input") ?? host : host;
    const enter = () => on(host);
    const leave = () => off?.(host);
    host.addEventListener("pointerenter", enter);
    focusable.addEventListener("focus", enter);
    host.addEventListener("pointerleave", leave);
    focusable.addEventListener("blur", leave);
    return () => {
      host.removeEventListener("pointerenter", enter);
      focusable.removeEventListener("focus", enter);
      host.removeEventListener("pointerleave", leave);
      focusable.removeEventListener("blur", leave);
    };
  }, [ref, on, off]);
}

/** Moves each matching child by a random amount, then lets it spring back. */
function useJolt(ref: RefObject<Element | null>, selector: string, range: { r: number; x: number; y: number }) {
  const timer = useRef(0);
  const on = useCallback(() => {
    const parts = ref.current?.querySelectorAll<HTMLElement | SVGElement>(selector);
    if (!parts) return;
    const set = (r: () => string, x: () => string, y: () => string) =>
      parts.forEach((p) => {
        p.style.setProperty("--r", r());
        p.style.setProperty("--x", x());
        p.style.setProperty("--y", y());
      });
    set(
      () => `${rand(-range.r, range.r).toFixed(1)}deg`,
      () => `${rand(-range.x, range.x).toFixed(1)}px`,
      () => `${rand(-range.y, range.y * 0.75).toFixed(1)}px`,
    );
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => set(() => "0deg", () => "0px", () => "0px"), 240);
  }, [ref, selector, range.r, range.x, range.y]);
  useHost(ref, on);
}

const LETTERS = { r: 16, x: 0, y: 4 };

/** Letters that get knocked about at random when their link or button is hovered, then spring back. */
export function Wobble({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useJolt(ref, "i", LETTERS);
  return (
    <span ref={ref} className="cf-wob">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(" ").map((word, w) => (
          <span key={w}>
            {w > 0 && " "}
            <span className="cf-word">
              {[...word].map((c, i) => (
                <i key={i}>{c}</i>
              ))}
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}

/* ---------- icons that act ---------- */

const SLOTS: [number, number][] = [
  [0, 0],
  [10, 0],
  [10, 10],
  [0, 10],
];

/**
 * The platform's four marks in a square. On each hover they trade places at random, the way the map rearranges
 * the same entries.
 */
function MarksIcon() {
  const ref = useRef<SVGSVGElement>(null);
  const order = useRef([0, 1, 2, 3]);
  const on = useCallback(() => {
    const marks = ref.current?.querySelectorAll<SVGGElement>(".m");
    if (!marks) return;
    let next = order.current;
    while (next.every((v, i) => v === order.current[i])) next = [...next].sort(() => Math.random() - 0.5);
    order.current = next;
    marks.forEach((m, i) => {
      const [x, y] = SLOTS[next[i]!]!;
      const [x0, y0] = SLOTS[i]!;
      m.style.setProperty("--x", `${x - x0}px`);
      m.style.setProperty("--y", `${y - y0}px`);
    });
  }, []);
  useHost(ref, on);
  return (
    <svg ref={ref} className="cf-ico cf-ico-marks" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <g className="m">
        <circle className="m-people" cx="7" cy="7" r="3.2" />
      </g>
      <g className="m">
        <rect className="m-projects" x="14.3" y="4.3" width="5.4" height="5.4" transform="rotate(45 17 7)" />
      </g>
      <g className="m">
        <path className="m-methods" d="M17 13.6 20.6 20h-7.2z" />
      </g>
      <g className="m">
        <rect className="m-partners" x="4" y="14" width="6" height="6" />
      </g>
    </svg>
  );
}

/** A keycap whose arrow points a new way each time it is pressed, as arrow keys move round the map. */
function KeyIcon() {
  const ref = useRef<SVGSVGElement>(null);
  const turn = useRef(0);
  const on = useCallback(() => {
    turn.current += [90, 180, 270][Math.floor(rand(0, 3))]!;
    ref.current?.style.setProperty("--turn", `${turn.current}deg`);
  }, []);
  useHost(ref, on);
  return (
    <svg ref={ref} className="cf-ico cf-ico-key" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <g className="cap">
        <rect x="3.5" y="3.5" width="17" height="15.5" rx="3.2" />
        <path className="arrow" d="M12 15.5V7.5m0 0-3.2 3.2M12 7.5l3.2 3.2" />
      </g>
      <path className="base" d="M5.5 21h13" />
    </svg>
  );
}

/** A dashed sketch that draws itself solid: from an idea to the built thing. */
function SketchIcon() {
  const ref = useRef<SVGSVGElement>(null);
  const on = useCallback(() => {
    ref.current?.style.setProperty("--from", rand(0.15, 0.85).toFixed(2));
  }, []);
  useHost(ref, on);
  return (
    <svg ref={ref} className="cf-ico cf-ico-sketch" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect className="dash" x="4" y="4" width="16" height="16" rx="2.5" />
      <rect className="solid" x="4" y="4" width="16" height="16" rx="2.5" pathLength={1} />
      <path className="tick" d="m8.6 12.2 2.4 2.4 4.6-5" pathLength={1} />
    </svg>
  );
}

/** One icon per capability, tied to what that capability's card shows. Capabilities without one show no icon. */
export function ChipIcon({ capability }: { capability: Capability }) {
  if (capability === "E") return <KeyIcon />;
  if (capability === "B") return <SketchIcon />;
  if (capability === "D") return <MarksIcon />;
  return null;
}

/** The arrow on an outward link: it flies off towards where the link goes and comes back from the other side. */
export function OutArrow() {
  return (
    <span className="cf-out" aria-hidden="true">
      <svg viewBox="0 0 16 16" focusable="false">
        <path d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10" />
      </svg>
    </span>
  );
}

/** Small parts of an icon (nodes, dots) that jump at random on hover and settle again. */
export function Jolt({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useJolt(ref, ".j", { r: 0, x: 2.2, y: 2.6 });
  return (
    <span ref={ref} className={`cf-jolt${className ? ` ${className}` : ""}`}>
      {children}
    </span>
  );
}

/** The four marks round a play button. Each hover brings them round from a new angle. */
export function PlayMarks() {
  const ref = useRef<HTMLSpanElement>(null);
  const turn = useRef(0);
  const on = useCallback(() => {
    turn.current += rand(70, 200);
    ref.current?.style.setProperty("--spin", `${turn.current.toFixed(0)}deg`);
  }, []);
  useHost(ref, on);
  return (
    <span ref={ref} className="cf-playmarks" aria-hidden="true">
      <i className="cf-mark cf-mark-people" />
      <i className="cf-mark cf-mark-projects" />
      <i className="cf-mark cf-mark-methods" />
      <i className="cf-mark cf-mark-partners" />
    </span>
  );
}
