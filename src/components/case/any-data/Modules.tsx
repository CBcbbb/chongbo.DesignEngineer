"use client";

import { useState } from "react";
import { Axes, Chart, Empty, Swatch } from "./charts";
import { missingRoles, streamById, suggest, totals, type Mapping } from "./data";
import { Roles } from "./Roles";
import "./any-data.css";

/* ---------- 01 the same meaning in three shapes: names, formats and missing fields all differ ---------- */
export function Shapes() {
  const ids = ["courier", "north", "partner"] as const;
  return (
    <div className="ad ad-shapes">
      {ids.map((id) => {
        const s = streamById(id);
        return (
          <div key={id} className="ad-panel ad-shape">
            <p className="ad-label">{s.name}</p>
            <div className="ad-rows-wrap" tabIndex={0} role="region" aria-label={`First row of ${s.name}`}>
              <table className="ad-table">
                <thead>
                  <tr>
                    {s.fields!.map((f) => (
                      <th key={f.name} scope="col">
                        {f.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {s.data[0]!.map((v, i) => (
                      <td key={i}>{String(v)}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
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
      </li>
      <li>
        <div className="ad-pipe-step">
          <span className="ad-pipe-k">Component</span>
        </div>
        <div className="ad-panel ad-pipe-chart">
          <Chart kind="bar" data={d} ratio={0.36} min={92} max={100} />
        </div>
      </li>
    </ol>
  );
}

/* ---------- 03.2 one endpoint, two phases behind it ---------- */
export function Phases() {
  return (
    <div className="ad ad-srv-wrap">
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
            <span className="ad-mono">Fits · Partly fits · Other</span>
          </div>
          <span className="ad-srv-arrow" aria-hidden="true" />
        </div>
        <div className="ad-srv-phases">
          {(
            [
              [1, "The newest entry", "Its field names, from a read the platform already makes. No extra load."],
              [2, "A stored field profile", "Fields, types and fill rate per stream, indexed by field. Same cost for 50 streams or 5,000."],
            ] as const
          ).map(([n, t, p]) => (
            <div key={n} className="ad-panel ad-phase">
              <span className="ad-label">Phase {n}</span>
              <h4>{t}</h4>
              <p>{p}</p>
            </div>
          ))}
        </div>
      </div>
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
