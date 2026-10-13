"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";

type Card = {
  src: string;
  width: number;
  height: number;
  title: string;
};

/**
 * A workshop's role cards as a hand of cards. When the hand comes into view, the cards are dealt from a stack into a
 * fan (once; with reduced motion they are simply fanned). The reader picks a card by pointing at it, clicking it, or
 * with the arrow keys: it lifts and straightens, and its role's name is set under the hand as live text. The cards'
 * own words stay on the pictures; the case file names the roles only.
 */
export function CardDeck({
  label,
  cards,
  start,
}: {
  label: string;
  cards: Card[];
  start?: number;
}) {
  const [on, setOn] = useState(start ?? Math.floor(cards.length / 2));
  const [stacked, setStacked] = useState(false);
  const [dealing, setDealing] = useState(false);
  const hand = useRef<HTMLDivElement>(null);
  const btns = useRef<(HTMLButtonElement | null)[]>([]);

  // Deal once, the first time the hand is properly in view.
  useEffect(() => {
    const el = hand.current;
    if (
      !el ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    )
      return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.85 && r.bottom > 0) return; // already on screen: stay fanned
    setStacked(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        io.disconnect();
        setDealing(true);
        setStacked(false);
        window.setTimeout(() => setDealing(false), 1400);
      },
      { threshold: 0.55 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const pick = (i: number, focus = false) => {
    const n = (i + cards.length) % cards.length;
    setOn(n);
    if (focus) btns.current[n]?.focus();
  };
  const onKey = (e: KeyboardEvent) => {
    const k = e.key;
    if (k === "ArrowRight" || k === "ArrowDown") pick(on + 1, true);
    else if (k === "ArrowLeft" || k === "ArrowUp") pick(on - 1, true);
    else if (k === "Home") pick(0, true);
    else if (k === "End") pick(cards.length - 1, true);
    else return;
    e.preventDefault();
  };
  const mid = (cards.length - 1) / 2;
  const ar = cards[0] ? cards[0].height / cards[0].width : 1.66;

  return (
    <figure
      className="cf-figure cf-deck"
      style={{ "--n": cards.length, "--ar": ar } as CSSProperties}
    >
      <div className="cf-deck-in">
        <div
          ref={hand}
          className={`cf-deck-hand${stacked ? " is-stacked" : ""}${dealing ? " is-dealing" : ""}`}
          role="radiogroup"
          aria-label={label}
          onKeyDown={onKey}
        >
          {cards.map((c, i) => (
            <button
              key={c.title}
              ref={(b) => {
                btns.current[i] = b;
              }}
              type="button"
              role="radio"
              aria-checked={i === on}
              tabIndex={i === on ? 0 : -1}
              className="cf-deck-card"
              style={
                {
                  "--i": i,
                  "--o": i - mid,
                  "--o2": (i - mid) * (i - mid),
                } as CSSProperties
              }
              onClick={() => pick(i)}
              onPointerEnter={(e) => {
                if (e.pointerType === "mouse") pick(i);
              }}
            >
              <Image
                src={c.src}
                alt=""
                width={c.width}
                height={c.height}
                sizes="200px"
                quality={90}
              />
              <span className="sr-only">{c.title}</span>
            </button>
          ))}
        </div>
        <div className="cf-deck-read" aria-live="polite">
          {cards.map((c, i) => (
            <p
              key={c.title}
              data-on={i === on || undefined}
              aria-hidden={i !== on}
            >
              <span className="cf-deck-count" aria-hidden="true">
                {String(i + 1).padStart(2, "0")} /{" "}
                {String(cards.length).padStart(2, "0")}
              </span>
              <strong>{c.title}</strong>
            </p>
          ))}
        </div>
      </div>
    </figure>
  );
}
