"use client";

// the project's styles and the invented customers' faces, wherever its evidence is shown (case file or printed sheet)
import "@fontsource-variable/archivo";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/ibm-plex-sans";
import "@fontsource-variable/inter";
import "./design-system.css";

import { useSyncExternalStore } from "react";
import { CUSTOMERS, DEFAULT_CUSTOMER, setCustomer, setOwnColour, useSeenAs, type Customer } from "./store";
import { pagePalette } from "./tokens";

const HINT_KEY = "ds-seen-tried";
/* the nudge on the next brand, until the reader tries any option (remembered in this browser where it can be) */
let triedHere = false;
const hintSubs = new Set<() => void>();
function readHint() {
  if (triedHere) return false;
  try {
    return localStorage.getItem(HINT_KEY) !== "1";
  } catch {
    return true;
  }
}
function markTried() {
  triedHere = true;
  try {
    localStorage.setItem(HINT_KEY, "1");
  } catch {}
  hintSubs.forEach((fn) => fn());
}
const useHint = () =>
  useSyncExternalStore(
    (fn) => {
      hintSubs.add(fn);
      return () => hintSubs.delete(fn);
    },
    readHint,
    () => false,
  );
const vars = (o: Record<string, string>) =>
  Object.entries(o)
    .map(([k, v]) => `--${k}:${v}`)
    .join(";");

/** The case file's palette for one customer: the same rule as the scales, applied to their colour. */
function paletteCss(c: Customer) {
  const { L, D } = pagePalette(c.colour);
  const face = c.font;
  const extra = `--sans:${face}, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;--ds-btn-font:${face};--ds-btn-r:${c.btn};--ds-title-font:${face};--ds-title-weight:${c.weight};--ds-title-track:${c.track}`;
  const sel = '[data-palette="design-system"]';
  return `${sel}{${vars(L)};${extra}}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]) ${sel}{${vars(D)}}}
:root[data-theme="dark"] ${sel}{${vars(D)}}`;
}

/**
 * "Seen as" on the cover: the whole case file wears one customer's brand. The default (the courier's yellow, the
 * colour that broke the first version) is in case-palettes.css; any other choice writes its palette here. The last
 * option takes any colour of the reader's own and runs the same rule.
 */
export function SeenAs() {
  const { state, customer } = useSeenAs();
  const hint = useHint();
  const tried = markTried;
  const pick = (id: string) => {
    tried();
    setCustomer(id);
  };
  const own = state.id === "own";
  return (
    <div className="ds-seen" role="radiogroup" aria-label="See this case file in a customer's brand">
      {customer.id !== DEFAULT_CUSTOMER.id && <style dangerouslySetInnerHTML={{ __html: paletteCss(customer) }} />}
      <span>Seen as</span>
      {CUSTOMERS.map((c, i) => (
        <label
          key={c.id}
          className={hint && i === 1 ? "is-hint" : undefined}
          style={{ fontFamily: c.font, fontWeight: c.weight === 700 ? 600 : 500, ...(hint && i === 1 ? ({ "--hint": c.colour } as React.CSSProperties) : {}) }}
        >
          <input type="radio" name="ds-seen" value={c.id} checked={state.id === c.id} onChange={() => pick(c.id)} />
          <i className="ds-dot" style={{ background: c.colour }} />
          {c.name}
        </label>
      ))}
      <i className="ds-or" aria-hidden="true" />
      <label className="ds-seen-own" style={{ "--own": state.own }}>
        <input type="radio" name="ds-seen" value="own" checked={own} onChange={() => pick("own")} aria-label="Or your own colour" />
        <i className="ds-rainbow" aria-hidden="true" />
        <span className="ds-own-t">{own ? "Your own" : "Or your own"}</span>
        {own && <span className="ds-own-hex">{state.own.toUpperCase()}</span>}
        <input
          type="color"
          value={state.own}
          aria-label="Pick your own brand colour"
          onClick={() => {
            tried();
            if (!own) setCustomer("own");
          }}
          onChange={(e) => setOwnColour(e.target.value)}
        />
      </label>
    </div>
  );
}

/* ---------- cover art: the overview's build, small. The foundation, three products, two clients above each;
   the current brand is the solid one ---------- */
const OX = 80;
const OY = 118;
const P = (x: number, y: number, z: number): [number, number] => [OX + (x - y) * 0.433, OY + (x + y) * 0.25 - z * 0.5];
const pts = (a: [number, number][]) => a.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
const quad = (cx: number, cy: number, hx: number, hy: number, z: number) =>
  pts([P(cx - hx, cy - hy, z), P(cx + hx, cy - hy, z), P(cx + hx, cy + hy, z), P(cx - hx, cy + hy, z)]);
const PC: [number, number][] = [
  [15, 105],
  [225, 135],
  [375, 75],
];
const H = 45;
const SLOTS: [number, number][] = [
  [0, 1],
  [0, -1],
  [1, 1],
  [1, -1],
  [2, 1],
  [2, -1],
];
const WHICH: Record<string, string> = { courier: "0,1", grocer: "0,-1", bank: "1,1" };
const ORDER = [0, 1, 2].sort((a, b) => PC[a]![0] + PC[a]![1] - (PC[b]![0] + PC[b]![1]));

export function CoverLayers() {
  const { customer } = useSeenAs();
  const mine = WHICH[customer.id];
  return (
    <div className="ds-cover-layers" aria-hidden="true">
      <svg viewBox="-6 -10 304 270">
        <polygon className="cl-base" points={quad(195, 75, 195, 75, 0)} />
        {ORDER.map((p) => {
          const [x, y] = PC[p]!;
          const a1 = P(x, y, 0);
          const a2 = P(x, y, 108);
          return (
            <g key={p}>
              <line className="cl-pin" x1={a1[0]} y1={a1[1]} x2={a2[0]} y2={a2[1]} />
              <polygon className={`cl-prod${!mine && p === 0 ? " is-on" : ""}`} points={quad(x, y, H, H, 108)} />
              {SLOTS.filter(([q]) => q === p).map(([, side]) => {
                const cx = x - side * 30;
                const on = mine === `${p},${side}`;
                const b1 = P(cx, y, 108);
                const b2 = P(cx, y, 196);
                return (
                  <g key={side}>
                    <line className={`cl-pin${on ? " is-on" : ""}`} x1={b1[0]} y1={b1[1]} x2={b2[0]} y2={b2[1]} />
                    <polygon className={`cl-cli${on ? " is-on" : ""}`} points={quad(cx, y, 15, 45, 196)} />
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
