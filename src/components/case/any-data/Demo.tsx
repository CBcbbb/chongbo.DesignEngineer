"use client";

import { useRef, useState } from "react";
import { Chart, Empty, type ChartKind } from "./charts";
import {
  fitOf,
  missingRoles,
  parseCSV,
  ROLES,
  SAMPLE,
  STREAMS,
  suggest,
  totals,
  type Confidences,
  type Mapping,
  type Stream,
} from "./data";
import { Roles } from "./Roles";
import "./any-data.css";

const Tick = () => (
  <svg viewBox="0 0 12 12" aria-hidden="true">
    <path d="m2.5 6.2 2.3 2.3 4.7-5" />
  </svg>
);

function start(stream: Stream) {
  return stream.fields ? suggest(stream.fields) : { mapping: { category: "", value: "", period: "" } as Mapping, confs: { category: null, value: null, period: null } as Confidences };
}

/**
 * The work: the store's preview panel, rebuilt on invented data. Pick a stream (ranked by fit), see each role's
 * suggested field, change it, switch charts on the same contract; the rows underneath show which column became what.
 */
export function Demo() {
  const [extra, setExtra] = useState<Stream[]>([]);
  const [src, setSrc] = useState<"sample" | "stream">("stream");
  const [streamId, setStreamId] = useState("courier");
  const [kind, setKind] = useState<ChartKind | "table">("bar");
  const [showOther, setShowOther] = useState(false);
  const [state, setState] = useState(() => start(STREAMS[0]!));
  const [drag, setDrag] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const all = STREAMS.concat(extra);
  const stream = src === "sample" ? SAMPLE : all.find((s) => s.id === streamId)!;
  const mapping: Mapping = src === "sample" ? { category: "category", value: "value", period: "period" } : state.mapping;
  const confs: Confidences = src === "sample" ? { category: "exact", value: "exact", period: "exact" } : state.confs;
  const missing = stream.fields ? missingRoles(stream, mapping) : (["category", "value"] as const).slice();

  const pick = (id: string, list = all) => {
    const s = list.find((x) => x.id === id)!;
    setSrc("stream");
    setStreamId(id);
    setState(start(s));
    requestAnimationFrame(() => pickerRef.current?.querySelector<HTMLButtonElement>(`[data-stream="${id}"]`)?.focus());
  };
  const reset = () => {
    setExtra([]);
    setSrc("stream");
    setStreamId("courier");
    setKind("bar");
    setShowOther(false);
    setState(start(STREAMS[0]!));
  };
  const read = (file: File) => {
    const r = new FileReader();
    r.onload = () => {
      const s = parseCSV(file.name, String(r.result), `csv${extra.length + 1}`);
      if (!s) return;
      const list = all.concat(s);
      setExtra((e) => e.concat(s));
      pick(s.id, list);
    };
    r.readAsText(file);
  };

  const groups = { fits: [] as Stream[], partly: [] as Stream[], other: [] as Stream[] };
  for (const s of all) groups[fitOf(s).group].push(s);
  const otherOpen = showOther || (src === "stream" && groups.other.some((s) => s.id === streamId));
  const row = (s: Stream) => {
    const f = fitOf(s);
    return (
      <button key={s.id} type="button" className="ad-pk-row" data-stream={s.id} aria-pressed={src === "stream" && s.id === streamId} onClick={() => pick(s.id)}>
        <span className="ad-pk-name">{s.name}</span>
        <span className="ad-pk-meta">{s.rows ? `${s.rows.toLocaleString("en-GB")} rows` : "No rows yet"}</span>
        <span className={`ad-fit${f.group === "fits" ? " is-fits" : ""}`}>
          {f.group === "fits" && <Tick />}
          {f.label}
        </span>
      </button>
    );
  };
  const roleOf = (name: string) => ROLES.find((r) => mapping[r.key] === name);

  return (
    <div className="ad ad-panel ad-demo">
      <section className="ad-col is-data" aria-labelledby="ad-d-src">
        <p className="ad-label" id="ad-d-src">
          Data
        </p>
        <div className="ad-seg" role="group" aria-label="Data source">
          <button type="button" aria-pressed={src === "sample"} onClick={() => setSrc("sample")}>
            Sample
          </button>
          <button type="button" aria-pressed={src === "stream"} onClick={() => setSrc("stream")}>
            My stream
          </button>
        </div>
        <div className="ad-picker" ref={pickerRef}>
          {groups.fits.length > 0 && (
            <div className="ad-pk-group">
              <p className="ad-label">Fits</p>
              {groups.fits.map(row)}
            </div>
          )}
          {groups.partly.length > 0 && (
            <div className="ad-pk-group">
              <p className="ad-label">Partly fits</p>
              {groups.partly.map(row)}
            </div>
          )}
          {groups.other.length > 0 && (
            <div className="ad-pk-group">
              <p className="ad-label">Other</p>
              {otherOpen ? (
                groups.other.map(row)
              ) : (
                <button
                  type="button"
                  className="ad-pk-more"
                  onClick={() => {
                    setShowOther(true);
                    requestAnimationFrame(() => pickerRef.current?.querySelector<HTMLButtonElement>(`[data-stream="${groups.other[0]!.id}"]`)?.focus());
                  }}
                >
                  Show {groups.other.length} more
                </button>
              )}
            </div>
          )}
        </div>
        <label
          className={`ad-file${drag ? " is-drag" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            const f = e.dataTransfer.files[0];
            if (f) read(f);
          }}
        >
          <strong>Try a CSV of your own</strong>
          <span>Read in your browser. Nothing is uploaded.</span>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) read(f);
              e.target.value = "";
            }}
          />
        </label>
      </section>

      <section className="ad-col is-preview" aria-labelledby="ad-d-pv">
        <div className="ad-pv-head">
          <p className="ad-label" id="ad-d-pv">
            Preview
          </p>
          <span className={`ad-tag ${src === "sample" ? "is-sample" : "is-live"}`}>{src === "sample" ? "Sample" : stream.name}</span>
        </div>
        <div className="ad-seg" role="group" aria-label="Chart">
          {(["bar", "donut", "treemap", "table"] as const).map((k) => (
            <button key={k} type="button" aria-pressed={kind === k} onClick={() => setKind(k)}>
              {k === "bar" ? "Bar" : k === "donut" ? "Donut" : k === "treemap" ? "Treemap" : "Table"}
            </button>
          ))}
        </div>
        <div aria-live="polite">{missing.length ? <Empty missing={missing} /> : <Chart kind={kind === "table" ? "bar" : kind} table={kind === "table"} data={totals(stream, mapping)} ratio={0.5} min={220} max={300} />}</div>
      </section>

      <section className="ad-col is-fields" aria-labelledby="ad-d-fields">
        <p className="ad-label" id="ad-d-fields">
          Fields
        </p>
        <p className="ad-contract">
          <b>Totals by category</b> <span>· the contract these three charts share</span>
        </p>
        <Roles
          id="ad-demo"
          row
          stream={stream}
          mapping={mapping}
          confs={confs}
          disabled={src === "sample"}
          onPick={(role, field) => setState((s) => ({ mapping: { ...s.mapping, [role]: field }, confs: { ...s.confs, [role]: "manual" } }))}
        />
      </section>

      <div className="ad-rows">
        <div className="ad-rows-cap">
          <p className="ad-label">Rows as they arrive</p>
          <p>{!stream.fields ? "" : src === "sample" ? "Sample rows fit the contract exactly." : `First 3 of ${stream.rows.toLocaleString("en-GB")}`}</p>
        </div>
        <div className="ad-rows-wrap" tabIndex={0} role="region" aria-label="First rows of the selected stream">
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
      </div>
      <div className="ad-demo-foot">
        <p>
          Try <code>north_depot.scans</code>: same meaning, different field names.
        </p>
        <button type="button" className="ad-reset" onClick={reset}>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3 8a5 5 0 1 0 1.6-3.7M3 2.5v2.8h2.8" />
          </svg>
          Reset
        </button>
      </div>
    </div>
  );
}
