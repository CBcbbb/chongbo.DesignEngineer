"use client";

import { useState } from "react";
import { Axes, Chart, Empty, Swatch } from "./charts";
import { missingRoles, SAMPLE, streamById, suggest, totals, type Mapping, type Stream } from "./data";
import { Roles } from "./Roles";
import "./any-data.css";

/* ---------- 01.1 a template is a layout of components; each slot's data is still a question ---------- */
export function Templates() {
  const slots: [string, string, string?][] = [
    ["Filter bar", "reads the page", "w3"],
    ["Metric card", "?"],
    ["Metric card", "?"],
    ["Metric card", "?"],
    ["Bar chart", "?", "w2 h2"],
    ["Request form", "asks the user", "h2"],
    ["Sortable table", "?", "w3"],
  ];
  return (
    <div className="ad ad-tpl">
      <div
        className="ad-panel ad-tpl-page"
        role="img"
        aria-label="A template: a page layout with slots for a filter bar, metric cards, a bar chart, a request form and a table. The data each slot shows is still unknown."
      >
        <div className="ad-tpl-tabs" aria-hidden="true">
          <span>My templates</span>
          <span>Shared templates</span>
          <span className="is-on">Store</span>
        </div>
        <div className="ad-tpl-grid" aria-hidden="true">
          {slots.map(([name, q, cls], i) => (
            <div key={i} className={`ad-slot ${cls ?? ""}`}>
              <b>{name}</b>
              {name === "Bar chart" && (
                <div className="ad-slot-art">
                  {[90, 62, 48, 30, 18].map((h) => (
                    <i key={h} style={{ height: `${h}%` }} />
                  ))}
                </div>
              )}
              <span className="ad-q">{q === "?" ? <>data: <em>?</em></> : q}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="ad-panel ad-shelf" aria-hidden="true">
        <p className="ad-label">Components</p>
        {[
          ["Bar chart", "Charts"],
          ["Metric card", "Cards"],
          ["Sortable table", "Tables"],
          ["Filter bar", "Forms and search"],
          ["Request form", "Forms and search"],
        ].map(([n, t]) => (
          <div key={n} className="ad-shelf-item">
            <span className="ad-thumb" />
            <div>
              <b>{n}</b>
              <span>{t}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- 01.2 one component; sample data, or a stream ---------- */
export function SampleData() {
  const [src, setSrc] = useState<"sample" | "courier" | "partner">("sample");
  const s: Stream = src === "sample" ? SAMPLE : streamById(src);
  const { mapping } = suggest(s.fields!);
  const missing = missingRoles(s, mapping);
  return (
    <div className="ad ad-panel ad-one">
      <div className="ad-pv-head">
        <h4>Bar chart</h4>
        <span className={`ad-tag ${src === "sample" ? "is-sample" : "is-live"}`}>{src === "sample" ? "Sample" : s.name}</span>
      </div>
      <div className="ad-seg" role="group" aria-label="Data source">
        {(
          [
            ["sample", "Sample"],
            ["courier", "courier_app.deliveries"],
            ["partner", "partner_carrier.feed"],
          ] as const
        ).map(([k, l]) => (
          <button key={k} type="button" aria-pressed={src === k} onClick={() => setSrc(k)}>
            {l}
          </button>
        ))}
      </div>
      <div aria-live="polite">{missing.length ? <Empty missing={missing} /> : <Chart kind="bar" data={totals(s, mapping)} ratio={0.52} min={200} max={260} />}</div>
      <Axes mapping={mapping} />
    </div>
  );
}

/* ---------- 01.3 the store, filtered by what each component needs ---------- */
type Kind = "stream" | "page" | "input" | "static";
const KIND: Record<Kind, string> = { stream: "Connects to a stream", page: "Reads the page", input: "Asks the user", static: "Static" };
const COMPONENTS: { name: string; kind: Kind; fields: string[]; art: string }[] = [
  { name: "Bar chart", kind: "stream", fields: ["category", "value", "period"], art: "bars" },
  { name: "Sortable table", kind: "stream", fields: ["any fields"], art: "table" },
  { name: "Filter chips", kind: "page", fields: ["page filters"], art: "chips" },
  { name: "Search bar", kind: "page", fields: ["page search"], art: "search" },
  { name: "Request form", kind: "input", fields: ["date", "notes"], art: "form" },
  { name: "Alert callout", kind: "static", fields: [], art: "alert" },
];
function Art({ art }: { art: string }) {
  if (art === "bars")
    return (
      <div className="ad-art">
        {[92, 66, 50, 30].map((h) => (
          <i key={h} style={{ width: "18%", height: `${h}%` }} />
        ))}
      </div>
    );
  if (art === "tree")
    return (
      <div className="ad-art is-tree">
        <i style={{ gridRow: "span 2" }} />
        <i />
        <i />
      </div>
    );
  if (art === "table")
    return (
      <div className="ad-art is-col">
        <i style={{ height: 7 }} />
        <i style={{ height: 4, opacity: 0.6 }} />
        <i style={{ height: 4, opacity: 0.6 }} />
        <i style={{ height: 4, opacity: 0.6 }} />
      </div>
    );
  if (art === "chips")
    return (
      <div className="ad-art is-mid">
        {[28, 22, 30].map((w) => (
          <i key={w} style={{ width: `${w}%`, height: 16, borderRadius: 9 }} />
        ))}
      </div>
    );
  if (art === "form")
    return (
      <div className="ad-art is-col is-form">
        <i style={{ height: 10, width: "70%" }} />
        <i style={{ height: 10 }} />
        <i style={{ height: 10, width: "40%" }} />
      </div>
    );
  return (
    <div className="ad-art is-mid">
      <i style={{ width: "100%", height: art === "search" ? 20 : 24, borderRadius: 6, opacity: 0.6 }} />
    </div>
  );
}
export function Store() {
  const [k, setK] = useState<Kind | "all">("all");
  const [q, setQ] = useState("");
  const shown = COMPONENTS.filter((c) => (k === "all" || c.kind === k) && (!q || `${c.name} ${c.fields.join(" ")}`.toLowerCase().includes(q.toLowerCase().trim())));
  return (
    <div className="ad ad-panel ad-store">
      <div className="ad-store-side" role="group" aria-label="Filter by data">
        <p className="ad-label">Data</p>
        <button type="button" aria-pressed={k === "all"} onClick={() => setK("all")}>
          All
        </button>
        {(Object.keys(KIND) as Kind[]).map((x) => (
          <button key={x} type="button" aria-pressed={k === x} onClick={() => setK(x)}>
            <span className={`ad-kind k-${x}`} aria-hidden="true" />
            {KIND[x]}
          </button>
        ))}
      </div>
      <div className="ad-store-main">
        <label className="ad-search">
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="7" cy="7" r="4.5" />
            <path d="m10.5 10.5 3 3" />
          </svg>
          <span className="sr-only">Search components or fields</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search components or fields, e.g. date" autoComplete="off" />
        </label>
        <ul className="ad-store-grid" aria-live="polite">
          {shown.map((c) => (
            <li key={c.name} className="ad-comp">
              <div className="ad-comp-art" aria-hidden="true">
                <Art art={c.art} />
              </div>
              <div className="ad-comp-body">
                <b>{c.name}</b>
                <span className="ad-comp-kind">
                  <span className={`ad-kind k-${c.kind}`} aria-hidden="true" />
                  {KIND[c.kind]}
                </span>
                <span className="ad-comp-fields">{c.fields.length ? c.fields.join(" · ") : "no data"}</span>
              </div>
            </li>
          ))}
        </ul>
        {shown.length === 0 && (
          <p className="ad-store-empty">
            No component matches. Try a field name such as <code>value</code>.
          </p>
        )}
      </div>
    </div>
  );
}

/* ---------- 02.2 one mapping, three charts ---------- */
export function Trio() {
  const d = totals(streamById("courier"), { category: "town", value: "parcels", period: "" });
  return (
    <div className="ad ad-trio">
      <p className="ad-trio-map">
        <span>
          <Swatch role="category" />
          category ← <b>town</b>
        </span>
        <span>
          <Swatch role="value" />
          value ← <b>parcels</b>
        </span>
        <span>mapped once · courier_app.deliveries</span>
      </p>
      <div className="ad-trio-row">
        {(
          [
            ["Bar chart", "bar", 0.72],
            ["Donut", "donut", 0.62],
            ["Treemap", "treemap", 0.72],
          ] as const
        ).map(([t, k, r]) => (
          <div key={k} className="ad-panel">
            <h4>{t}</h4>
            <Chart kind={k} data={d} ratio={r} min={150} max={240} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- 02.3 the layers, one row each; what feeds in sits to the right ---------- */
export function Pipeline() {
  const d = totals(streamById("courier"), { category: "town", value: "parcels", period: "" }).slice(0, 4);
  return (
    <ol className="ad ad-pipe">
      <li>
        <div className="ad-pipe-step">
          <span className="ad-pipe-k">Producer</span>
          <span className="ad-pipe-t">Raw events, in its own format</span>
        </div>
        <div className="ad-panel ad-pipe-ex">
          <span className="ad-dim">{'{"evt":"delivered","payload":'}</span>
          {'{"town":"Leeds","parcels":"128"}'}
          <span className="ad-dim">{"}"}</span>
        </div>
      </li>
      <li>
        <div className="ad-pipe-step">
          <span className="ad-pipe-k">Adapter</span>
          <span className="ad-pipe-t">Flat rows. The one layer that knows the format</span>
        </div>
        <div className="ad-panel ad-pipe-ex">
          <span>
            town <span className="ad-dim">Leeds</span>
          </span>
          <span>
            parcels <span className="ad-dim">128</span>
          </span>
          <span>
            delivered_on <span className="ad-dim">2026-09-28</span>
          </span>
        </div>
      </li>
      <li>
        <div className="ad-pipe-step">
          <span className="ad-pipe-k">Binding</span>
          <span className="ad-pipe-t">One slot&apos;s fields, mapped onto roles</span>
        </div>
        <div className="ad-panel ad-pipe-ex">
          <span>
            <Swatch role="category" />
            category ← town
          </span>
          <span>
            <Swatch role="value" />
            value ← parcels
          </span>
          <span>
            <Swatch role="period" />
            period ← delivered_on
          </span>
        </div>
      </li>
      <li>
        <div className="ad-pipe-step">
          <span className="ad-pipe-k">Contract</span>
          <span className="ad-pipe-t">Roles, types, what&apos;s required</span>
        </div>
        <div className="ad-panel ad-pipe-ex">
          <span>
            <Swatch role="category" />
            category <span className="ad-dim">text · required</span>
          </span>
          <span>
            <Swatch role="value" />
            value <span className="ad-dim">number · required</span>
          </span>
          <span>
            <Swatch role="period" />
            period <span className="ad-dim">date</span>
          </span>
        </div>
        <div className="ad-feed">
          <b>Sample</b>Fits the same contract, so it stands in until a stream is connected
        </div>
      </li>
      <li>
        <div className="ad-pipe-step">
          <span className="ad-pipe-k">Component</span>
          <span className="ad-pipe-t">Draws roles, never fields</span>
        </div>
        <div className="ad-panel ad-pipe-chart">
          <Chart kind="bar" data={d} ratio={0.36} min={92} max={100} />
        </div>
        <div className="ad-feed">
          <b>Settings</b>Sort, labels, colours. Never data
        </div>
      </li>
    </ol>
  );
}

/* ---------- 03.1 the picker, before and after ---------- */
const TickSvg = () => (
  <svg viewBox="0 0 12 12" aria-hidden="true">
    <path d="m2.5 6.2 2.3 2.3 4.7-5" />
  </svg>
);
export function Picker() {
  const [v, setV] = useState<"before" | "after">("after");
  return (
    <div className="ad ad-pk-compare">
      <fieldset className="ad-switch">
        <legend className="sr-only">Stream picker</legend>
        {(["before", "after"] as const).map((x) => (
          <label key={x}>
            <input type="radio" name="ad-pk-ba" value={x} checked={v === x} onChange={() => setV(x)} />
            {x === "before" ? "Before" : "After"}
          </label>
        ))}
      </fieldset>
      {/* both lists share one place, so the panel keeps its size whichever is shown */}
      <div className="ad-stack">
        <div className="ad-panel ad-pk-panel" data-hidden={v !== "before"} inert={v !== "before"} aria-hidden={v !== "before"}>
          <div className="ad-pk-head">
            <h4>Choose a stream</h4>
            <span className="ad-label">74 streams · by rows</span>
          </div>
          <ul className="ad-pk-list">
            {[
              ["scanner_heartbeat.raw", "412,880"],
              ["gate_events.all", "96,214"],
              ["north_depot.scans", "26,708"],
              ["audit_log.users", "18,302"],
              ["finance.invoices", "9,120"],
              ["telematics.positions", "7,455"],
              ["courier_app.deliveries", "1,840"],
              ["partner_carrier.feed", "412"],
            ].map(([n, c]) => (
              <li key={n}>
                <span className="ad-pk-name">{n}</span>
                <span className="ad-n">{c}</span>
              </li>
            ))}
            <li>
              <span className="ad-more">66 more, in row order</span>
            </li>
          </ul>
        </div>
        <div className="ad-panel ad-pk-panel" data-hidden={v !== "after"} inert={v !== "after"} aria-hidden={v !== "after"}>
          <div className="ad-pk-head">
            <h4>Streams for Bar chart</h4>
            <span className="ad-label">by fit</span>
          </div>
          <p className="ad-label">Fits</p>
          <ul className="ad-pk-list">
            {["courier_app.deliveries", "north_depot.scans"].map((n) => (
              <li key={n}>
                <span className="ad-pk-name">{n}</span>
                <span className="ad-fit is-fits">
                  <TickSvg />
                  Fits
                </span>
              </li>
            ))}
          </ul>
          <p className="ad-label">Partly fits</p>
          <ul className="ad-pk-list">
            <li>
              <span className="ad-pk-name">partner_carrier.feed</span>
              <span className="ad-fit">1 of 2 fields</span>
            </li>
          </ul>
          <p className="ad-label">Other · 71</p>
          <div className="ad-fake-search">
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <circle cx="7" cy="7" r="4.5" />
              <path d="m10.5 10.5 3 3" />
            </svg>
            Search all streams
          </div>
          <ul className="ad-pk-list">
            <li>
              <span className="ad-pk-name">yard_sensors.raw</span>
              <span className="ad-fit">Unknown</span>
            </li>
            <li>
              <span className="ad-more">70 more</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ---------- 03.2 one endpoint, two phases behind it ---------- */
export function Phases() {
  const [ph, setPh] = useState<1 | 2>(1);
  return (
    <div className="ad ad-srv-wrap">
      <fieldset className="ad-switch">
        <legend className="sr-only">Phase</legend>
        {([1, 2] as const).map((x) => (
          <label key={x}>
            <input type="radio" name="ad-phase" value={x} checked={ph === x} onChange={() => setPh(x)} />
            Phase {x}
          </label>
        ))}
      </fieldset>
      <div className="ad-srv">
        <div className="ad-panel ad-srv-node">
          <span className="ad-label">Picker</span>
          <h4>Which streams fit Bar chart?</h4>
          <span className="ad-mono">category · value required</span>
        </div>
        <div className="ad-srv-mid">
          <span className="ad-srv-arrow" aria-hidden="true" />
          <div className="ad-panel ad-srv-node is-mid">
            <span className="ad-label">One endpoint</span>
            <h4>Fit</h4>
            <span className="ad-mono">paged · searchable · private streams filtered</span>
          </div>
          <span className="ad-srv-arrow" aria-hidden="true" />
        </div>
        <div className="ad-srv-phases">
          {(
            [
              [1, "The newest entry", "Its field names, from a read the platform already makes. No extra load."],
              [2, "A stored field profile", "Fields, types and fill rate per stream, and an index from field to streams. Same cost for 50 streams or 5,000."],
            ] as const
          ).map(([n, t, p]) => (
            <div key={n} className="ad-panel ad-phase" data-on={ph === n}>
              <span className="ad-label">
                Phase {n}
                {ph === n && <b>Shown</b>}
              </span>
              <h4>{t}</h4>
              <p>{p}</p>
            </div>
          ))}
        </div>
      </div>
      <p className="ad-srv-note">Same response either way: Fits · Partly fits · Other</p>
    </div>
  );
}

/* ---------- 03.3 each role picked like an axis, beside the chart ---------- */
export function AxisPickers() {
  const s = streamById("north");
  const [st, setSt] = useState(() => suggest(s.fields!));
  const missing = missingRoles(s, st.mapping);
  return (
    <div className="ad ad-panel ad-axis">
      <div>
        <p className="ad-label">Fields · north_depot.scans</p>
        <h4>Bar chart</h4>
        <Roles
          id="ad-axis"
          stream={s}
          mapping={st.mapping}
          confs={st.confs}
          onPick={(role, field) => setSt((x) => ({ mapping: { ...x.mapping, [role]: field } as Mapping, confs: { ...x.confs, [role]: "manual" } }))}
        />
      </div>
      <div aria-live="polite">
        {missing.length ? <Empty missing={missing} /> : <Chart kind="bar" data={totals(s, st.mapping)} ratio={0.45} min={180} max={280} />}
        <Axes mapping={st.mapping} />
      </div>
    </div>
  );
}
