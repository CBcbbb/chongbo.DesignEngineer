"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { Chart, Empty, Swatch, type ChartKind } from "./charts";
import {
  fitOf,
  missingRoles,
  absentRoles,
  ROLES,
  SAMPLE,
  STREAMS,
  suggest,
  totals,
  type Confidences,
  type Mapping,
  type RoleKey,
  type Stream,
} from "./data";
import "./any-data.css";
import "./demo.css";

const Tick = () => (
  <svg viewBox="0 0 12 12" aria-hidden="true">
    <path d="m2.5 6.2 2.3 2.3 4.7-5" />
  </svg>
);

const KINDS = [
  ["bar", "Bar"],
  ["donut", "Donut"],
  ["treemap", "Treemap"],
  ["table", "Table"],
] as const;

function start(stream: Stream) {
  return stream.fields
    ? suggest(stream.fields)
    : { mapping: { category: "", value: "", period: "" } as Mapping, confs: { category: null, value: null, period: null } as Confidences };
}

/**
 * The work: the store's preview panel, rebuilt on invented data and laid out as a component inspector. The preview on
 * the left (chart type, the chart, the rows as they arrive); the settings on the right (the data source, ranked by
 * fit, and one field per role of the contract). Native radios and selects, so it works fully by keyboard.
 */
export function Demo() {
  const uid = useId();
  const [srcId, setSrcId] = useState("courier");
  const [kind, setKind] = useState<ChartKind | "table">("bar");
  const [showOther, setShowOther] = useState(false);
  const [state, setState] = useState(() => start(STREAMS[0]!));
  const listRef = useRef<HTMLDivElement>(null);

  const all = STREAMS;
  const isSample = srcId === "sample";
  const stream = isSample ? SAMPLE : all.find((s) => s.id === srcId)!;
  const mapping: Mapping = isSample ? { category: "category", value: "value", period: "period" } : state.mapping;
  const missing = stream.fields ? missingRoles(stream, mapping) : (["category", "value"] as RoleKey[]);
  const absent = stream.fields ? absentRoles(stream) : [];

  const choose = (id: string, list: Stream[] = all) => {
    setSrcId(id);
    if (id !== "sample") setState(start(list.find((x) => x.id === id)!));
  };
  const reset = () => {
    setKind("bar");
    setShowOther(false);
    choose("courier", STREAMS);
  };

  const groups = { fits: [] as Stream[], partly: [] as Stream[], other: [] as Stream[] };
  for (const s of all) groups[fitOf(s).group].push(s);
  const otherOpen = showOther || groups.other.some((s) => s.id === srcId);
  const roleOf = (name: string) => ROLES.find((r) => mapping[r.key] === name);

  const option = (id: string, name: string, meta?: string, fit?: ReturnType<typeof fitOf>) => (
    <label key={id} className="dm-opt" data-on={srcId === id ? "" : undefined}>
      <input type="radio" name={`${uid}-src`} value={id} checked={srcId === id} onChange={() => choose(id)} />
      <span className="dm-opt-name">{name}</span>
      {meta && <span className="dm-opt-meta">{meta}</span>}
      {fit && (
        <span className={`dm-fit${fit.group === "fits" ? " is-fits" : ""}`}>
          {fit.group === "fits" && <Tick />}
          {fit.label}
        </span>
      )}
    </label>
  );
  const streamOption = (s: Stream) => option(s.id, s.name, s.rows ? `${s.rows.toLocaleString("en-GB")} rows` : "No rows yet", fitOf(s));
  const group = (key: string, label: string, items: ReactNode, action?: ReactNode) => (
    <div className="dm-group" role="group" aria-labelledby={`${uid}-g-${key}`}>
      <div className="dm-group-h">
        <p id={`${uid}-g-${key}`}>{label}</p>
        {action}
      </div>
      {items}
    </div>
  );
  const showMore = (
    <button
      type="button"
      className="dm-more"
      onClick={() => {
        setShowOther(true);
        requestAnimationFrame(() => listRef.current?.querySelector<HTMLInputElement>(`input[value="${groups.other[0]?.id}"]`)?.focus());
      }}
    >
      Show {groups.other.length} more
    </button>
  );

  return (
    <div className="dm-wrap">
      <p className="dm-flag">
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="8" cy="8" r="6.25" />
          <path d="M8 7.25v3.5M8 5.1v.05" />
        </svg>
        <span>
          <strong>Simplified rebuild.</strong> The product is confidential, so this uses mock data and is for demonstration only.
        </span>
      </p>
      <div className="ad dm">
        {/* ---------- preview ---------- */}
        <div className="dm-bar">
          <div className="dm-seg" role="group" aria-label="Chart type">
            {KINDS.map(([k, label]) => (
              <button key={k} type="button" aria-pressed={kind === k} onClick={() => setKind(k)}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="dm-canvas" aria-live="polite">
          {missing.length ? (
            <Empty
              missing={missing}
              stream={isSample ? undefined : stream.name}
              absent={isSample ? [] : absent}
              action={
                absent.length > 0 && groups.fits[0] ? (
                  <button type="button" className="dm-ghost is-act" onClick={() => choose(groups.fits[0]!.id)}>
                    Switch to {groups.fits[0].name}
                  </button>
                ) : undefined
              }
            />
          ) : (
            <Chart kind={kind === "table" ? "bar" : kind} table={kind === "table"} data={totals(stream, mapping)} ratio={0.56} min={250} max={300} />
          )}
          <p className="dm-tip">
            Try <code>north_depot.scans</code>: same meaning, different field names.
          </p>
        </div>

        <section className="dm-rows" aria-labelledby={`${uid}-rows`}>
          <div className="dm-sec-h">
            <h3 id={`${uid}-rows`}>Rows as they arrive</h3>
            <p>{stream.fields ? `First 3 of ${stream.rows.toLocaleString("en-GB")}` : ""}</p>
          </div>
          <div className="ad-rows-wrap" tabIndex={0} role="region" aria-label="First rows of the selected data">
            <table className="ad-table">
              {stream.fields ? (
                <>
                  <thead>
                    <tr>
                      {stream.fields.map((f) => {
                        const r = roleOf(f.name);
                        return (
                          <th key={f.name} scope="col" data-role={r?.key}>
                            <small>{r ? r.key : f.type}</small>
                            {f.name}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {stream.data.slice(0, 3).map((rowv, i) => (
                      <tr key={i}>
                        {rowv.map((v, j) => (
                          <td key={j} className={roleOf(stream.fields![j]!.name) ? "is-mapped" : undefined}>
                            {String(v)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </>
              ) : (
                <tbody>
                  <tr>
                    <td>No rows yet.</td>
                  </tr>
                </tbody>
              )}
            </table>
          </div>
        </section>

        {/* ---------- settings ---------- */}
        <aside className="dm-side" aria-label="Component settings">
          <section className="dm-sec" aria-labelledby={`${uid}-data`}>
            <div className="dm-sec-h">
              <h3 id={`${uid}-data`}>Data</h3>
              <button type="button" className="dm-ghost" onClick={reset}>
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M3 8a5 5 0 1 0 1.6-3.7M3 2.5v2.8h2.8" />
                </svg>
                Reset
              </button>
            </div>
            <div className="dm-list" ref={listRef} role="radiogroup" aria-labelledby={`${uid}-data`}>
              {option("sample", "Sample data")}
              {groups.fits.length > 0 && group("fits", "Fits", groups.fits.map(streamOption))}
              {groups.partly.length > 0 && group("partly", "Partly fits", groups.partly.map(streamOption))}
              {groups.other.length > 0 && group("other", "Other", otherOpen ? groups.other.map(streamOption) : null, otherOpen ? undefined : showMore)}
            </div>
          </section>

          <section className="dm-sec" aria-labelledby={`${uid}-fields`}>
            <div className="dm-sec-h">
              <h3 id={`${uid}-fields`}>Fields</h3>
            </div>
            <ul className="dm-fields">
              {ROLES.map((r) => {
                const fields = stream.fields ?? [];
                const sel = mapping[r.key];
                const selId = `${uid}-${r.key}`;
                const none = !!stream.fields && r.required && !fields.some((x) => x.type === r.type);
                const placeholder = !stream.fields ? "No fields yet" : none ? `No ${r.type} field` : r.required ? "Choose a field" : "None";
                return (
                  <li key={r.key} className="dm-field" data-role={r.key}>
                    <div className="dm-field-top">
                      <label htmlFor={selId}>
                        <Swatch role={r.key} />
                        {r.key}
                      </label>
                      {!r.required && <span className="dm-field-opt">optional</span>}
                    </div>
                    <span className="dm-sel-box">
                      <select
                        id={selId}
                        value={sel}
                        disabled={isSample || !stream.fields || none}
                        onChange={(e) => {
                          const v = e.target.value;
                          setState((s) => ({ mapping: { ...s.mapping, [r.key]: v }, confs: { ...s.confs, [r.key]: "manual" } }));
                        }}
                      >
                        <option value="">{placeholder}</option>
                        {fields.map((x) => (
                          <option key={x.name} value={x.name} disabled={x.type !== r.type}>
                            {x.type !== r.type ? `${x.name} (${x.type})` : x.name}
                          </option>
                        ))}
                      </select>
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
