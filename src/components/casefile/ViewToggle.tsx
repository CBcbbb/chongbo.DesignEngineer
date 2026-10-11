"use client";

import Image from "next/image";
import { useState } from "react";

type Side = { src: string; width: number; height: number; alt: string; label: string };
type Mode = { label: string; a: "works" | "hard"; b: "works" | "hard" };

const Tick = () => (
  <svg viewBox="0 0 12 12" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="m2.5 6.2 2.3 2.3 4.7-5" />
  </svg>
);
const Cross = () => (
  <svg viewBox="0 0 12 12" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M3.2 3.2l5.6 5.6M8.8 3.2 3.2 8.8" />
  </svg>
);
const Swap = () => (
  <svg viewBox="0 0 24 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 5h17M16 1.5 20 5l-4 3.5M21 11H4M8 7.5 4 11l4 3.5" />
  </svg>
);

/**
 * The dual view as an accessibility decision: the two views of the same data side by side, joined by the shortcut
 * that switches between them, and a choice of how the reader is using the platform. Each view then says whether it
 * works or is hard to use that way, so the reader sees why the table exists. A view that is hard to use steps back.
 */
export function ViewToggle({ keys, a, b, modes, index }: { keys: string[]; a: Side; b: Side; modes: Mode[]; index: string }) {
  const [m, setM] = useState(0);
  const mode = modes[m]!;
  const pane = (s: Side, state: "works" | "hard") => (
    <div className="cf-dual-pane" data-state={state}>
      <p className="cf-dual-head">
        <span className="cf-dual-name">{s.label}</span>
        <span className="cf-dual-state">
          <span className="cf-dual-mark">{state === "works" ? <Tick /> : <Cross />}</span>
          {state === "works" ? "Works" : "Hard to use"}
        </span>
      </p>
      <div className="cf-dual-shot">
        <Image src={s.src} alt={s.alt} width={s.width} height={s.height} quality={90} sizes="(min-width: 1100px) 420px, 100vw" />
      </div>
    </div>
  );
  return (
    <figure className="cf-figure cf-dual">
      <fieldset className="cf-dual-modes">
        <legend>Using the platform with</legend>
        <span className="cf-dual-modes-label" aria-hidden="true">
          Using it with
        </span>
        <span className="cf-dual-seg">
          {modes.map((md, i) => (
            <label key={md.label}>
              <input type="radio" name={`dual-${index}`} checked={m === i} onChange={() => setM(i)} />
              {md.label}
            </label>
          ))}
        </span>
      </fieldset>
      <div className="cf-dual-panes">
        {pane(a, mode.a)}
        <div className="cf-dual-join">
          <span className="sr-only">{keys.join(" + ")} switches between the two views.</span>
          <span className="cf-dual-keys" aria-hidden="true">
            {keys.map((k, i) => (
              <span key={k}>
                {i > 0 && <span className="plus">+</span>}
                <kbd>{k}</kbd>
              </span>
            ))}
          </span>
          <Swap />
        </div>
        {pane(b, mode.b)}
      </div>
      <p className="sr-only" aria-live="polite">
        With a {mode.label.toLowerCase()}: {a.label} {mode.a === "works" ? "works" : "is hard to use"}; {b.label}{" "}
        {mode.b === "works" ? "works" : "is hard to use"}.
      </p>
    </figure>
  );
}
