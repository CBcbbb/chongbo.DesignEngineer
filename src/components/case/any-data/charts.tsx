"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { fmt, type Datum, type RoleKey } from "./data";

/*
 * Three charts on one contract (totals by category). Drawn in SVG at the width they're given, so text stays at its
 * real size; one scale per chart; text in ink tokens, never in a series colour. Each chart has a hidden table for
 * screen readers and a hover tooltip.
 */

export type ChartKind = "bar" | "donut" | "treemap";

function useWidth<T extends HTMLElement>(): [React.RefObject<T | null>, number] {
  const ref = useRef<T>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.round(e!.contentRect.width)));
    ro.observe(el);
    setW(Math.round(el.getBoundingClientRect().width));
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

const trunc = (s: string, n: number) => {
  const m = Math.max(4, Math.floor(n));
  return s.length > m ? s.slice(0, m - 1) + "…" : s;
};
function niceMax(v: number) {
  const p = Math.pow(10, Math.floor(Math.log10(Math.max(v, 1))));
  for (const m of [1, 2, 2.5, 5, 10]) if (m * p >= v) return m * p;
  return 10 * p;
}

type Tip = { k: string; v: number; x: number; y: number } | null;
type MarkProps = { onTip: (d: Datum, e: React.PointerEvent) => void };

function Bar({ data, w, h, onTip }: { data: Datum[]; w: number; h: number } & MarkProps) {
  const L = 40, R = 6, T = 18, B = 28;
  const max = niceMax(Math.max(...data.map((d) => d.v)));
  const iw = w - L - R, ih = h - T - B;
  const step = iw / data.length, bw = Math.min(56, step * 0.58);
  const y = (v: number) => T + ih - (v / max) * ih;
  return (
    <>
      {[0, 1, 2].map((i) => {
        const v = (max / 2) * i;
        return (
          <g key={i}>
            <line className={i ? "ad-grid" : "ad-base"} x1={L} x2={w - R} y1={y(v)} y2={y(v)} />
            <text x={L - 8} y={y(v) + 4} textAnchor="end" fontSize="12">
              {fmt(v)}
            </text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const x = L + step * i + (step - bw) / 2, yy = y(d.v), hh = T + ih - yy, r = Math.min(4, hh);
        return (
          <g key={d.k}>
            <path
              className="ad-mark"
              fill="var(--ad-viz)"
              onPointerMove={(e) => onTip(d, e)}
              d={`M${x},${T + ih} V${yy + r} Q${x},${yy} ${x + r},${yy} H${x + bw - r} Q${x + bw},${yy} ${x + bw},${yy + r} V${T + ih} Z`}
            />
            <text x={x + bw / 2} y={h - 8} textAnchor="middle" fontSize="12">
              {trunc(d.k, step / 6.6)}
            </text>
            {i === 0 && (
              <text className="ad-t-ink" x={x + bw / 2} y={yy - 6} textAnchor="middle" fontSize="13">
                {fmt(d.v)}
              </text>
            )}
          </g>
        );
      })}
    </>
  );
}

function Donut({ data, w, h, onTip }: { data: Datum[]; w: number; h: number } & MarkProps) {
  const R = Math.min(h / 2 - 10, w * 0.22), cx = R + 8, cy = h / 2, r = R * 0.6;
  const sum = data.reduce((s, d) => s + d.v, 0);
  const p = (rad: number, a: number) => `${cx + rad * Math.cos(a)},${cy + rad * Math.sin(a)}`;
  const starts = data.reduce<number[]>((acc, d, i) => acc.concat((acc[i] ?? -Math.PI / 2) + (d.v / sum) * Math.PI * 2), [-Math.PI / 2]);
  const lx = cx + R + 22, rowH = Math.min(26, (h - 16) / data.length);
  const ly0 = cy - (rowH * data.length) / 2 + rowH / 2;
  const room = Math.floor((w - lx - 18 - 44) / 6.8);
  return (
    <>
      {data.map((d, i) => {
        const a0 = starts[i]!, a1 = starts[i + 1]!;
        const large = a1 - a0 > Math.PI ? 1 : 0;
        const path = `M${p(R, a0)} A${R},${R} 0 ${large} 1 ${p(R, a1)} L${p(r, a1)} A${r},${r} 0 ${large} 0 ${p(r, a0)} Z`;
        return <path key={d.k} className="ad-mark" fill={`var(--ad-seq-${Math.min(i + 1, 5)})`} stroke="var(--ad-bg)" strokeWidth="2" d={path} onPointerMove={(e) => onTip(d, e)} />;
      })}
      <text className="ad-t-ink" x={cx} y={cy + 3} textAnchor="middle" fontSize="20">
        {fmt(sum)}
      </text>
      <text x={cx} y={cy + 20} textAnchor="middle" fontSize="12">
        total
      </text>
      {data.map((d, i) => {
        const yy = ly0 + i * rowH;
        return (
          <g key={d.k}>
            <rect x={lx} y={yy - 5} width="10" height="10" rx="3" fill={`var(--ad-seq-${Math.min(i + 1, 5)})`} />
            <text className="ad-t-ink" x={lx + 18} y={yy + 4} fontSize="13">
              {trunc(d.k, room)}
            </text>
            <text x={w - 4} y={yy + 4} fontSize="13" textAnchor="end">
              {fmt(d.v)}
            </text>
          </g>
        );
      })}
    </>
  );
}

type Cellr = Datum & { i: number; x: number; y: number; w: number; h: number };
function squarify(items: Datum[], W: number, H: number): Cellr[] {
  const total = items.reduce((s, d) => s + d.v, 0);
  const scale = (W * H) / total;
  const nodes = items.map((d, i) => ({ ...d, i, a: d.v * scale }));
  const out: Cellr[] = [];
  let rx = 0, ry = 0, rw = W, rh = H;
  let row: typeof nodes = [];
  const worst = (rw2: typeof nodes, side: number) => {
    const s = rw2.reduce((t, d) => t + d.a, 0);
    const mx = Math.max(...rw2.map((d) => d.a)), mn = Math.min(...rw2.map((d) => d.a));
    return Math.max((side * side * mx) / (s * s), (s * s) / (side * side * mn));
  };
  const layout = (rw2: typeof nodes) => {
    const s = rw2.reduce((t, d) => t + d.a, 0);
    if (rw >= rh) {
      const cw = s / rh;
      let yy = ry;
      for (const d of rw2) { const ch = d.a / cw; out.push({ ...d, x: rx, y: yy, w: cw, h: ch }); yy += ch; }
      rx += cw; rw -= cw;
    } else {
      const ch = s / rw;
      let xx = rx;
      for (const d of rw2) { const cw = d.a / ch; out.push({ ...d, x: xx, y: ry, w: cw, h: ch }); xx += cw; }
      ry += ch; rh -= ch;
    }
  };
  for (const n of nodes) {
    const side = Math.min(rw, rh);
    if (!row.length || worst(row.concat(n), side) <= worst(row, side)) row.push(n);
    else { layout(row); row = [n]; }
  }
  if (row.length) layout(row);
  return out;
}

function Treemap({ data, w, h, onTip }: { data: Datum[]; w: number; h: number } & MarkProps) {
  return (
    <>
      {squarify(data, w, h).map((c) => {
        const g = 1.5, x = c.x + g, y = c.y + g, cw = Math.max(0, c.w - 2 * g), ch = Math.max(0, c.h - 2 * g);
        const s = Math.min(c.i + 1, 5);
        return (
          <g key={c.k}>
            <rect className="ad-mark" x={x} y={y} width={cw} height={ch} rx="4" fill={`var(--ad-seq-${s})`} onPointerMove={(e) => onTip(c, e)} />
            {cw > 64 && ch > 40 && (
              <>
                <text x={x + 10} y={y + 21} fontSize="13" style={{ fill: `var(--ad-seq-t-${s})`, fontWeight: 500 }}>
                  {trunc(c.k, cw / 7.6)}
                </text>
                <text x={x + 10} y={y + 38} fontSize="13" style={{ fill: `var(--ad-seq-t-${s})` }}>
                  {fmt(c.v)}
                </text>
              </>
            )}
          </g>
        );
      })}
    </>
  );
}

const DRAW = { bar: Bar, donut: Donut, treemap: Treemap };
const NAMES = { bar: "Bar chart", donut: "Donut", treemap: "Treemap" };

/** A chart at its container's width. `ratio` sets the height from the width, within `min` and `max`. */
export function Chart({
  kind,
  data,
  ratio = 0.5,
  min = 200,
  max = 300,
  label,
  table = false,
}: {
  kind: ChartKind;
  data: Datum[];
  ratio?: number;
  min?: number;
  max?: number;
  label?: string;
  /** Show the values as a visible table instead of the drawing, for anyone who wants exact numbers without hovering. */
  table?: boolean;
}) {
  const [ref, w] = useWidth<HTMLDivElement>();
  const [tip, setTip] = useState<Tip>(null);
  const h = Math.round(Math.max(min, Math.min(max, w * ratio)));
  const Draw = DRAW[kind];
  const name = label ?? NAMES[kind];
  const onTip = (d: Datum, e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    setTip({ ...d, x: e.clientX - r.left, y: e.clientY - r.top });
  };
  if (table)
    return (
      <div className="ad-chart is-table" ref={ref} style={{ minHeight: min }}>
        <div className="ad-rows-wrap">
          <table className="ad-table">
            <caption className="sr-only">{label ?? "Totals by category"}</caption>
            <thead>
              <tr>
                <th scope="col">Category</th>
                <th scope="col" className="is-num">
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.k}>
                  <td>{d.k}</td>
                  <td className="is-num">{fmt(d.v)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  return (
    <div className="ad-chart" ref={ref} onPointerLeave={() => setTip(null)}>
      {w > 0 && (
        <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} role="img" aria-label={`${name}: ${data.map((d) => `${d.k} ${fmt(d.v)}`).join(", ")}`}>
          <Draw data={data} w={w} h={h} onTip={onTip} />
        </svg>
      )}
      {w === 0 && <div style={{ height: min }} />}
      <table className="sr-only">
        <caption>{name}</caption>
        <thead>
          <tr>
            <th scope="col">Category</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.k}>
              <td>{d.k}</td>
              <td>{fmt(d.v)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {tip && (
        <div className="ad-tip" style={{ left: tip.x, top: tip.y }} aria-hidden="true">
          {tip.k}
          <span>{fmt(tip.v)}</span>
        </div>
      )}
    </div>
  );
}

/** Nothing to draw: the chart never fills a gap with made-up data. */
export function Empty({ missing }: { missing: RoleKey[] }) {
  return (
    <div className="ad-empty">
      <div>
        <strong>Nothing to draw yet</strong>
        Choose a field for {missing.map((m, i) => (
          <span key={m}>
            {i > 0 && " and "}
            <b>{m}</b>
          </span>
        ))}
        . The chart never fills a gap with made-up data.
      </div>
    </div>
  );
}

export function Swatch({ role }: { role: RoleKey }) {
  return <i className="ad-sw" data-role={role} aria-hidden="true" />;
}

export function Axes({ mapping, roles = ["category", "value", "period"] }: { mapping: Record<RoleKey, string>; roles?: RoleKey[] }): ReactNode {
  return (
    <p className="ad-axes">
      {roles
        .filter((r) => r !== "period" || mapping.period)
        .map((r) => (
          <span key={r}>
            <Swatch role={r} />
            {r} ← <b>{mapping[r] || "none"}</b>
          </span>
        ))}
    </p>
  );
}
