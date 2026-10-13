"use client";

// the project's styles and the invented customers' faces, wherever its evidence is shown (case file or printed sheet)
import "@fontsource-variable/archivo";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/ibm-plex-sans";
import "@fontsource-variable/inter";
import "./design-system.css";

import { useRef, useState } from "react";
import { HUES, NEUTRAL, ratio, REAL_L, SCALES, STEPS, styleOf, theme, type Hue, type Mode, type Step } from "./tokens";

/* ---------- 03.1: a wall of the scales: six roles, five steps, each step with one job ---------- */
export function Wall() {
  const L = SCALES.light;
  const cell = (h: Hue, st: Step) => {
    const c = L[h][st];
    if (st === "600")
      return (
        <div key={st} className="ds-wall-c" role="cell" style={{ background: c, color: "#fff" }}>
          <small>on white</small>
          <span>{ratio(c, "#ffffff").toFixed(1)}</span>
        </div>
      );
    if (st === "700")
      return (
        <div key={st} className="ds-wall-c" role="cell" style={{ background: c, color: L[h]["50"] }}>
          <small>on its 50</small>
          <span>{ratio(c, L[h]["50"]).toFixed(1)}</span>
        </div>
      );
    return (
      <div key={st} className="ds-wall-c" role="cell" style={{ background: c }}>
        <span className="sr-only">
          {h} {st}
        </span>
      </div>
    );
  };
  return (
    <div className="ds-wall" tabIndex={0} role="region" aria-label="The scales, by role and step">
      <div className="ds-wall-grid" role="table" aria-label="Six roles, five steps, each step with one job">
        <div role="row" className="ds-wall-row">
          <div className="ds-wall-h" role="columnheader">
            <span className="sr-only">Role</span>
          </div>
          {STEPS.map(([st, job]) => (
            <div key={st} className="ds-wall-h" role="columnheader">
              <b>{job}</b>
              {st}
            </div>
          ))}
        </div>
        {HUES.map(([h, name, role]) => (
          <div key={h} role="row" className="ds-wall-row">
            <div className="ds-wall-role" role="rowheader">
              <b>{role}</b>
              <span>{name.toLowerCase()}</span>
            </div>
            {STEPS.map(([st]) => cell(h, st))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- 03.2: one OKLCH value read part by part, the lightness of each step on six hues, and the figures ---------- */
function LightChart() {
  const W = 760;
  const left = 150;
  const right = 20;
  const rowH = 35;
  const top = 10;
  const x0 = 0.4;
  const x1 = 1.0;
  const Hh = top + STEPS.length * rowH + 34;
  const X = (l: number) => left + ((l - x0) / (x1 - x0)) * (W - left - right);
  const order: Hue[] = ["brand", "blue", "green", "red", "purple", "amber"];
  const yA = top + STEPS.length * rowH + 8;
  return (
    <svg
      viewBox={`0 0 ${W} ${Hh}`}
      role="img"
      aria-label="Lightness of each step on six hues. Text on white sits between 0.50 and 0.54; text on a tint between 0.44 and 0.48."
    >
      {STEPS.map(([st, job], i) => {
        const y = top + i * rowH + rowH / 2;
        const ls = Object.values(REAL_L[st]);
        const mn = Math.min(...ls);
        const mx = Math.max(...ls);
        const hs = order.filter((h) => REAL_L[st][h] != null);
        // only the text steps are held to one lightness: they are the claim; the other steps are drawn faint, free
        const isText = st === "600" || st === "700";
        return (
          <g key={st} className={isText ? "is-text" : "is-free"}>
            <text className="row-l" x="0" y={y + 4}>
              {job}
            </text>
            <text className="lbl" x={left - 12} y={y + 4} textAnchor="end">
              {st}
            </text>
            <line className="ax" x1={left} x2={W - right} y1={y} y2={y} />
            <rect className="band" x={X(mn) - 11} y={y - 15} width={X(mx) - X(mn) + 22} height="30" rx="15" />
            {hs.map((h, j) => {
              const dy = (j - (hs.length - 1) / 2) * 4.4;
              return (
                <circle key={h} cx={X(REAL_L[st][h]!).toFixed(1)} cy={(y + dy).toFixed(1)} r="6.5" fill={SCALES.light[h][st]}>
                  <title>{`${h} ${st}: L ${REAL_L[st][h]}`}</title>
                </circle>
              );
            })}
          </g>
        );
      })}
      {[0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0].map((v) => (
        <g key={v} className="tick">
          <line className="ax" x1={X(v)} x2={X(v)} y1={yA - 4} y2={yA + 2} />
          <text x={X(v)} y={yA + 18} textAnchor="middle">
            {v.toFixed(1)}
          </text>
        </g>
      ))}
      <text className="lbl" x="0" y={yA + 18}>
        OKLCH lightness
      </text>
    </svg>
  );
}

export function Lightness() {
  return (
    <div className="ds-light">
      <div className="ds-oklch" role="group" aria-label="Two text colours, read part by part">
        <div className="ok-row">
          <i style={{ background: "oklch(0.5 0.2 268)" }} aria-hidden="true" />
          <code>
            oklch(<b className="l">0.50</b> <b className="c">0.20</b> <b className="h">268</b>)
          </code>
          <span>
            Brand text on white <em>6.3:1</em>
          </span>
        </div>
        <div className="ok-row">
          <i style={{ background: "oklch(0.5 0.145 148)" }} aria-hidden="true" />
          <code>
            oklch(<b className="l">0.50</b> <b className="c">0.145</b> <b className="h">148</b>)
          </code>
          <span>
            Green text on white <em>5.6:1</em>
          </span>
        </div>
        <div className="ok-key">
          <span className="l">L lightness, the same</span>
          <span className="c">C chroma</span>
          <span className="h">H hue</span>
        </div>
      </div>
      <div className="ds-light-chart" tabIndex={0} role="region" aria-label="Lightness by step">
        <LightChart />
      </div>
      <ul className="ds-metrics">
        <li>
          <b>30/30</b>
          <span>text pairings pass WCAG AA</span>
        </li>
        <li>
          <b>5.16:1</b>
          <span>lowest: amber text on white</span>
        </li>
      </ul>
    </div>
  );
}

/* ---------- 03.3: one specimen, light and dark, split by a divider the reader drags (or moves with the arrow keys) ---------- */
function SplitLayer({ mode }: { mode: Mode }) {
  const S = SCALES[mode];
  const bg = NEUTRAL[mode].card;
  return (
    <div className={`ds-split-layer is-${mode}`} aria-hidden={mode === "dark" ? true : undefined}>
      <div className="ds-split-h">
        <span>{mode === "light" ? "Light" : "Dark"}</span>
        <span>border · text · text on a tint</span>
      </div>
      {HUES.map(([h, name]) => (
        <div key={h} className="ds-split-row">
          <span>{name}</span>
          <i className="is-border" style={{ "--c": S[h]["200"] } as React.CSSProperties}>
            <span className="sr-only">border</span>
          </i>
          <i style={{ color: S[h]["600"] }}>
            Aa <small>{ratio(S[h]["600"], bg).toFixed(1)}</small>
          </i>
          <i style={{ background: S[h]["50"], color: S[h]["700"] }}>
            Aa <small>{ratio(S[h]["700"], S[h]["50"]).toFixed(1)}</small>
          </i>
        </div>
      ))}
    </div>
  );
}

export function Split() {
  const [v, setV] = useState(50);
  const [dragging, setDragging] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const set = (n: number) => setV(Math.max(0, Math.min(100, n)));
  const fromX = (x: number) => {
    const r = stage.current?.getBoundingClientRect();
    if (r) set(((x - r.left) / r.width) * 100);
  };
  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 20 : 5;
    const next = ({ ArrowLeft: v - step, ArrowDown: v - step, ArrowRight: v + step, ArrowUp: v + step, Home: 0, End: 100 } as Record<string, number>)[e.key];
    if (next != null) {
      e.preventDefault();
      set(next);
    }
  };
  return (
    <div className="ds-split">
      <div
        ref={stage}
        className={`ds-split-stage${dragging ? " is-dragging" : ""}`}
        style={{ "--split": `${v}%` } as React.CSSProperties}
        onPointerDown={(e) => {
          setDragging(true);
          e.currentTarget.setPointerCapture(e.pointerId);
          fromX(e.clientX);
        }}
        onPointerMove={(e) => {
          if (dragging) fromX(e.clientX);
        }}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
      >
        <SplitLayer mode="light" />
        <SplitLayer mode="dark" />
        <span className="ds-split-handle" />
        <span
          className="ds-split-grip"
          role="slider"
          tabIndex={0}
          aria-label="Move between the light and dark versions of the same specimen"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(v)}
          aria-valuetext={v < 5 ? "All dark" : v > 95 ? "All light" : `${Math.round(v)}% light`}
          onKeyDown={onKey}
        >
          <b aria-hidden="true">‹</b>Light · Dark<b aria-hidden="true">›</b>
        </span>
      </div>
    </div>
  );
}

/* ---------- 03.4: a customer's colour, passed through as given or derived by the rule, light and dark ---------- */
export function Ratio({ r }: { r: number }) {
  const ok = r >= 4.5;
  return (
    <span className={`ds-ratio ${ok ? "is-pass" : "is-fail"}`} title={`Text contrast ${r.toFixed(2)}:1, ${ok ? "passes" : "fails"} AA`}>
      <i>Aa</i>
      {r.toFixed(2)}:1<b aria-label={ok ? "passes" : "fails"}>{ok ? "✓" : "✕"}</b>
    </span>
  );
}

const COLOURS = { yellow: ["Pale yellow", "#fff29a"], navy: ["Navy", "#1d2b5c"] } as const;
type ColourKey = keyof typeof COLOURS;

export function CustomerColour() {
  const [colour, setColour] = useState<ColourKey>("yellow");
  const [rule, setRule] = useState<"passed" | "derived">("derived");
  const hex = COLOURS[colour][1];
  return (
    <div className="cc">
      <div className="cc-top">
        <div className="ds-seg" role="radiogroup" aria-label="Customer colour">
          {(Object.keys(COLOURS) as ColourKey[]).map((k) => (
            <label key={k}>
              <input type="radio" name="ds-cc-colour" value={k} checked={colour === k} onChange={() => setColour(k)} />
              <span className="tp-swatch" style={{ background: COLOURS[k][1] }} />
              {COLOURS[k][0]}
            </label>
          ))}
        </div>
        <div className="ds-seg" role="radiogroup" aria-label="Rule">
          {(
            [
              ["passed", "Passed through"],
              ["derived", "Derived"],
            ] as const
          ).map(([k, label]) => (
            <label key={k}>
              <input type="radio" name="ds-cc-rule" value={k} checked={rule === k} onChange={() => setRule(k)} />
              {label}
            </label>
          ))}
        </div>
      </div>
      <div className="cc-modes">
        {(["light", "dark"] as Mode[]).map((mode) => {
          const t = theme(hex, mode, rule);
          return (
            <div key={mode} className="cc-pane ui" style={{ ...styleOf(t), colorScheme: mode }}>
              <span className="ds-label">{mode === "light" ? "Light" : "Dark"}</span>
              <div className="cc-line">
                <span className="ui-btn is-primary">New run</span>
                <Ratio r={ratio(t["--primary-fg"]!, t["--primary"]!)} />
              </div>
              <div className="cc-line">
                <span className="ui-brandtext">Text in the brand colour</span>
                <Ratio r={ratio(t["--primary-text"]!, t["--card"]!)} />
              </div>
              <div className="cc-line">
                <span className="ui-badge r-primary">Today</span>
                <Ratio r={ratio(t["--primary-container-fg"]!, t["--primary-container"]!)} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
