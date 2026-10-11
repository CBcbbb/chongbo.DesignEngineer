"use client";

import Image from "next/image";
import { useState } from "react";

type Side = { src: string; width: number; height: number; alt: string; label: string };

/**
 * Two views of one screen, full width at the card's foot, switched by a button that shows the product's shortcut as
 * keycaps. The button switches the picture only; it never takes over the shortcut (Ctrl + E belongs to the browser).
 * Both pictures share one box, sized to the taller, so nothing moves when the view changes.
 */
export function ViewToggle({ keys, a, b }: { keys: string[]; a: Side; b: Side }) {
  const [side, setSide] = useState<"a" | "b">("a");
  const next = side === "a" ? b : a;
  const ratio = Math.min(a.width / a.height, b.width / b.height);
  return (
    <figure className="cf-figure cf-toggle">
      <div className="cf-toggle-bar">
        <button type="button" className="cf-toggle-btn" onClick={() => setSide(side === "a" ? "b" : "a")}>
          <span className="cf-toggle-keys" aria-hidden="true">
            {keys.map((k, i) => (
              <span key={k} className="cf-toggle-key-wrap">
                {i > 0 && <span className="plus">+</span>}
                <kbd>{k}</kbd>
              </span>
            ))}
          </span>
          <span>Show the {next.label.toLowerCase()}</span>
        </button>
        <p className="cf-toggle-state" aria-live="polite">
          {side === "a" ? a.label : b.label} view
        </p>
      </div>
      <div className="cf-bleed">
        <div className="cf-toggle-stack" style={{ aspectRatio: `${ratio}` }}>
          {([a, b] as const).map((s, i) => {
            const k = i === 0 ? "a" : "b";
            return (
              <div key={k} className="cf-layer" data-hidden={side !== k} aria-hidden={side !== k}>
                <Image src={s.src} alt={s.alt} width={s.width} height={s.height} quality={90} sizes="(min-width: 1100px) 860px, 100vw" />
              </div>
            );
          })}
        </div>
      </div>
    </figure>
  );
}
