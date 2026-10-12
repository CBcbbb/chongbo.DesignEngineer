"use client";

import { useId, useState, type ReactNode } from "react";
import { Chart, Empty, Swatch } from "./charts";
import { fmt, missingRoles, ROLES, SAMPLE, streamById, suggest, totals, type Confidence, type Mapping, type RoleKey, type Stream } from "./data";
import "./any-data.css";
import "./cards.css";
import "./compositions.css";

/*
 * The case file's evidence, one module per card. One visual language throughout: a contract role is a colour
 * (violet category, orange value, green period), always with its name beside it, and a field that plays a role
 * carries that role's colour wherever it appears. Each piece of evidence has one edge; the card is the canvas.
 */

/** Which role each field plays, from the shared matcher (so this card agrees with the panel). */
function rolesOf(mapping: Mapping): Record<string, RoleKey> {
  const out: Record<string, RoleKey> = {};
  for (const r of ROLES) if (mapping[r.key]) out[mapping[r.key]] = r.key;
  return out;
}

/* ---------- 01.1 three streams, one meaning: the same colours land in different places ---------- */
export function Shapes() {
  const ids = ["courier", "north", "partner"] as const;
  return (
    <div className="ad ac-shapes">
      <ul className="ac-key" aria-label="What each field means">
        {ROLES.map((r) => (
          <li key={r.key}>
            <Swatch role={r.key} />
            {r.key}
          </li>
        ))}
        <li className="is-none">
          <i aria-hidden="true" />
          no role
        </li>
      </ul>
      {ids.map((id) => {
        const s = streamById(id);
        const { mapping } = suggest(s.fields!);
        const role = rolesOf(mapping);
        const missing = ROLES.filter((r) => r.required && !mapping[r.key]);
        return (
          <section key={id} className="ac-strip" aria-label={s.name}>
            <header>
              <p className="ac-strip-name">{s.name}</p>
              <p className="ac-strip-rows">{fmt(s.rows)} rows</p>
            </header>
            <dl>
              {s.fields!.map((f, i) => (
                <div key={f.name} className="ac-cell" data-role={role[f.name]}>
                  <dt>
                    {f.name}
                    {role[f.name] && <span className="sr-only"> ({role[f.name]})</span>}
                  </dt>
                  <dd>{String(s.data[0]![i])}</dd>
                </div>
              ))}
              {missing.map((r) => (
                <div key={r.key} className="ac-cell is-missing" data-role={r.key}>
                  <dt>no {r.key}</dt>
                  <dd>no {r.type} field</dd>
                </div>
              ))}
            </dl>
          </section>
        );
      })}
    </div>
  );
}

/* ---------- 01.2 one contract, four components on it; the code behind it one tab away ---------- */
const CONTRACT_CODE = `// A contract names the roles a component draws,
// not the fields a stream happens to have.
export const totalsByCategory = defineContract({
  id: "totals-by-category",
  key: "category",
  roles: {
    category: { type: "text",   required: true },
    value:    { type: "number", required: true },
    period:   { type: "date",   required: false },
  },
});

// Bar, pie, treemap and waterfall
// all declare the same contract.
export const BarChart = component({
  contract: totalsByCategory,
  settings: { sort: "desc" },
});`;

const SAMPLE_V = SAMPLE.data.map((r) => Number(r[1]));
const seq = (i: number) => `var(--ad-seq-${i + 1})`;

function MiniBar() {
  return (
    <svg viewBox="0 0 120 72" aria-hidden="true">
      <line x1="0" x2="120" y1="71.5" y2="71.5" className="ac-mini-base" />
      {SAMPLE_V.map((v, i) => (
        <rect key={i} x={6 + i * 23} y={71 - (v / 50) * 64} width="16" height={(v / 50) * 64} rx="2" fill={seq(i)} />
      ))}
    </svg>
  );
}
function MiniPie() {
  const sum = SAMPLE_V.reduce((a, b) => a + b, 0);
  const R = 34, cx = 60, cy = 36;
  const starts = SAMPLE_V.reduce<number[]>((acc, v, i) => acc.concat(acc[i]! + (v / sum) * Math.PI * 2), [-Math.PI / 2]);
  return (
    <svg viewBox="0 0 120 72" aria-hidden="true">
      {SAMPLE_V.map((_, i) => {
        const a0 = starts[i]!, a1 = starts[i + 1]!;
        const d = `M${cx},${cy} L${cx + R * Math.cos(a0)},${cy + R * Math.sin(a0)} A${R},${R} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${cx + R * Math.cos(a1)},${cy + R * Math.sin(a1)} Z`;
        return <path key={i} d={d} fill={seq(i)} className="ac-mini-slice" />;
      })}
    </svg>
  );
}
function MiniTree() {
  // the sample's five values (48, 36, 29, 18, 11), laid out by hand in proportion
  const cells = [
    [0, 0, 41, 72],
    [42, 0, 78, 34],
    [42, 35, 38, 37],
    [81, 35, 39, 22],
    [81, 58, 39, 14],
  ];
  return (
    <svg viewBox="0 0 120 72" aria-hidden="true">
      {cells.map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx="2" fill={seq(i)} />
      ))}
    </svg>
  );
}
function MiniWaterfall() {
  const total = SAMPLE_V.reduce((a, b) => a + b, 0);
  const k = 64 / total;
  const runs = SAMPLE_V.reduce<number[]>((acc, v, i) => acc.concat(acc[i]! + v), [0]);
  return (
    <svg viewBox="0 0 120 72" aria-hidden="true">
      <line x1="0" x2="120" y1="71.5" y2="71.5" className="ac-mini-base" />
      {SAMPLE_V.map((v, i) => (
        <rect key={i} x={4 + i * 19} y={71 - runs[i + 1]! * k} width="14" height={v * k} rx="2" fill={seq(i)} />
      ))}
      <rect x={101} y={71 - total * k} width="14" height={total * k} rx="2" className="ac-mini-total" />
    </svg>
  );
}
const MINIS = [
  ["Bar", MiniBar],
  ["Pie", MiniPie],
  ["Treemap", MiniTree],
  ["Waterfall", MiniWaterfall],
] as const;

export function Contract() {
  const [view, setView] = useState<"contract" | "code">("contract");
  const id = useId();
  return (
    <div className="ad ac-contract">
      <div className="ad-seg ac-tabs" role="group" aria-label="Show the contract as">
        {(["contract", "code"] as const).map((v) => (
          <button key={v} type="button" aria-pressed={view === v} aria-controls={id} onClick={() => setView(v)}>
            {v === "contract" ? "Contract" : "Code"}
          </button>
        ))}
      </div>
      <div id={id} className="ac-contract-stage">
        {view === "contract" ? (
          <div className="ac-spec-wrap">
            <div className="ac-spec">
              <p className="ac-spec-id">
                <span className="ad-label">Contract</span>
                totals-by-category
              </p>
              <ul>
                {ROLES.map((r) => (
                  <li key={r.key} data-role={r.key}>
                    <span className="ac-spec-role">
                      <Swatch role={r.key} />
                      {r.key}
                    </span>
                    <span className="ac-spec-type">{r.type}</span>
                    <span className={`ac-spec-req${r.required ? " is-req" : ""}`}>{r.required ? "required" : "optional"}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="ac-bus">
              <p className="ad-label">Declared by</p>
              <ul className="ac-uses" aria-label="Components on this contract, drawn with its sample data">
                {MINIS.map(([name, M]) => (
                  <li key={name}>
                    <M />
                    <span>{name}</span>
                  </li>
                ))}
              </ul>
              <p className="ac-sample">
                <span className="ad-tag is-sample">Sample data</span>
                fits the same contract
              </p>
            </div>
          </div>
        ) : (
          <pre className="ac-code" tabIndex={0} aria-label="The contract in TypeScript">
            <code>
              {CONTRACT_CODE.split("\n").map((l, i) => (
                <span key={i} className={l.trim().startsWith("//") ? "is-comment" : undefined}>
                  {l}
                  {"\n"}
                </span>
              ))}
            </code>
          </pre>
        )}
      </div>
    </div>
  );
}

/* ---------- 01.3 one record, left to right through five layers; each role is a lane from the adapter to the chart ---------- */
function PipeBars() {
  const d = totals(streamById("courier"), { category: "town", value: "parcels", period: "" }).slice(0, 5);
  const max = Math.max(...d.map((x) => x.v));
  return (
    <div className="ac-hbars" role="img" aria-label={`Bar chart: ${d.map((x) => `${x.k} ${fmt(x.v)}`).join(", ")}`}>
      {d.map((x) => (
        <div key={x.k}>
          <span className="ac-hbars-k">{x.k}</span>
          <span className="ac-hbars-track">
            <span className="ac-hbars-bar" style={{ width: `${(x.v / max) * 100}%` }} />
          </span>
          <span className="ac-hbars-v">{fmt(x.v)}</span>
        </div>
      ))}
    </div>
  );
}

const ROLE_KEYS: RoleKey[] = ["category", "value", "period"];
type Lane = [string, string];
type Layer = { k: string; job: string; lanes?: [Lane, Lane, Lane]; whole?: ReactNode };
const LAYERS: Layer[] = [
  {
    k: "Producer",
    job: "its own format",
    whole: (
      <pre className="ac-json" aria-label='{"evt":"delivered","payload":{"town":"Leeds","parcels":"128"}}'>
        <span className="ac-faint">{'{"evt": "delivered",\n "payload": {'}</span>
        {'\n   "town": "Leeds",\n   "parcels": "128"'}
        <span className="ac-faint">{"\n }}"}</span>
      </pre>
    ),
  },
  {
    k: "Adapter",
    job: "flat rows",
    lanes: [
      ["town", "Leeds"],
      ["parcels", "128"],
      ["delivered_on", "2026-09-28"],
    ],
  },
  {
    k: "Binding",
    job: "fields onto roles",
    lanes: [
      ["category", "← town"],
      ["value", "← parcels"],
      ["period", "← delivered_on"],
    ],
  },
  {
    k: "Contract",
    job: "roles and types",
    lanes: [
      ["category", "text · required"],
      ["value", "number · required"],
      ["period", "date"],
    ],
  },
  { k: "Component", job: "draws the roles", whole: <PipeBars /> },
];

export function Pipeline() {
  return (
    <div className="ad ac-pipe">
      <ol className="ac-flow">
        {LAYERS.map((l, li) => (
          <li key={l.k} className="ac-layer" style={{ gridColumn: li + 1 }}>
            <p className="ac-layer-h">
              <span className="ac-layer-n" aria-hidden="true">
                {li + 1}
              </span>
              <span className="ac-layer-k">{l.k}</span>
              <small>{l.job}</small>
            </p>
            {l.whole ? (
              <div className="ac-layer-whole">{l.whole}</div>
            ) : (
              l.lanes!.map(([key, val], i) => (
                <p key={key} className="ac-lane-cell" data-role={ROLE_KEYS[i]}>
                  <span className="ac-lane-key">{key}</span>
                  <span className="ac-lane-val">{val}</span>
                </p>
              ))
            )}
          </li>
        ))}
        {ROLE_KEYS.map((r, i) => (
          <li key={r} className="ac-lane" data-role={r} style={{ gridRow: i + 2 }} aria-hidden="true" />
        ))}
      </ol>
      <ul className="ac-inputs" aria-label="What each kind of component reads">
        {(
          [
            ["Charts", "a stream"],
            ["Filters, search", "the page"],
            ["Forms", "the user"],
          ] as const
        ).map(([c, src]) => (
          <li key={c}>
            <strong>{c}</strong>
            <span>read {src}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- 02.1 before and after: by row count, then by fit; one endpoint behind it ---------- */
const BY_ROWS: [string, number][] = [
  ["telematics.pings", 412_880],
  ["gate_cameras.events", 96_210],
  ["depot_b.scans", 26_708],
  ["finance.ledger", 9_120],
  ["driver_shifts.log", 4_455],
];
const Tick = () => (
  <svg viewBox="0 0 12 12" aria-hidden="true">
    <path d="M2.5 6.5 5 9l4.5-6" />
  </svg>
);

export function Fit() {
  return (
    <div className="ad ac-fit">
      <div className="ac-fit-cols">
        <section className="ac-fit-col is-before" aria-labelledby="ac-fit-a">
          <header>
            <p id="ac-fit-a" className="ad-label">
              First answer · by row count
            </p>
            <p className="ac-fit-big">
              74<span> streams, one list</span>
            </p>
          </header>
          <ol className="ac-fit-list">
            {BY_ROWS.map(([n, r]) => (
              <li key={n}>
                <span className="ac-fit-name">{n}</span>
                <span className="ac-fit-meta">{fmt(r)} rows</span>
              </li>
            ))}
            <li className="is-more">69 more</li>
          </ol>
        </section>
        <span className="ac-fit-turn" aria-hidden="true">
          →
        </span>
        <section className="ac-fit-col is-after" aria-labelledby="ac-fit-b">
          <header>
            <p id="ac-fit-b" className="ad-label">
              Grouped by fit
            </p>
          </header>
          <div className="ac-fit-group">
            <p className="ac-fit-g">Fits</p>
            <ol className="ac-fit-list">
              {["courier_b.deliveries", "depot_b.scans"].map((n) => (
                <li key={n}>
                  <span className="ac-fit-name">{n}</span>
                  <span className="ac-fit-meta is-good">
                    <Tick />
                    Fits
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="ac-fit-group">
            <p className="ac-fit-g">Partly fits</p>
            <ol className="ac-fit-list">
              {(
                [
                  ["returns.portal", 3],
                  ["driver_shifts.log", 2],
                ] as const
              ).map(([n, k]) => (
                <li key={n}>
                  <span className="ac-fit-name">{n}</span>
                  <span className="ac-fit-meta">
                    <i className="ac-fit-dots" aria-hidden="true">
                      {[0, 1, 2, 3, 4].map((d) => (
                        <b key={d} data-on={d < k ? "" : undefined} />
                      ))}
                    </i>
                    {k} of 5 fields
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="ac-fit-group">
            <p className="ac-fit-g">Other</p>
            <p className="ac-fit-search">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <circle cx="7" cy="7" r="4.5" />
                <path d="m10.5 10.5 3 3" />
              </svg>
              Search 70 more streams
            </p>
          </div>
        </section>
      </div>
      <ol className="ac-srv" aria-label="How fit is judged">
        <li>
          <span className="ad-label">Picker</span>
          <strong>Asks which streams fit</strong>
        </li>
        <li>
          <span className="ad-label">One endpoint</span>
          <strong>Fits · Partly fits · Other</strong>
        </li>
        <li>
          <span className="ad-label">Phase 1</span>
          <strong>The newest entry</strong>
          <span>Its field names, from a read the platform already makes.</span>
        </li>
        <li>
          <span className="ad-label">Phase 2</span>
          <strong>A stored field profile</strong>
          <span>Indexed by field: the same cost for 50 streams or 5,000.</span>
        </li>
      </ol>
    </div>
  );
}

/* ---------- 02.2 the fields picked on the chart itself, where its axes are ---------- */
function AxisSelect({
  role,
  stream,
  value,
  conf,
  onPick,
  id,
}: {
  role: RoleKey;
  stream: Stream;
  value: string;
  conf: Confidence | null;
  onPick: (f: string) => void;
  id: string;
}) {
  const r = ROLES.find((x) => x.key === role)!;
  return (
    <span className="ac-ax" data-role={role}>
      <label htmlFor={id} className="ac-ax-role">
        <Swatch role={role} />
        {role}
      </label>
      <span className="ac-ax-sel">
        <select id={id} value={value} onChange={(e) => onPick(e.target.value)}>
          <option value="">{r.required ? "Choose a field" : "None"}</option>
          {stream.fields!.map((f) => (
            <option key={f.name} value={f.name}>
              {f.name}
            </option>
          ))}
        </select>
      </span>
      {value && conf && (
        <span className="ad-conf" data-c={conf}>
          <i aria-hidden="true">
            <b />
            <b />
            <b />
          </i>
          {conf === "manual" ? "your choice" : conf}
        </span>
      )}
    </span>
  );
}

const AXIS_STREAMS = ["north", "courier", "partner"] as const;

export function AxisPickers() {
  const [sid, setSid] = useState<(typeof AXIS_STREAMS)[number]>("north");
  const s = streamById(sid);
  const [st, setSt] = useState(() => suggest(s.fields!));
  const choose = (id: (typeof AXIS_STREAMS)[number]) => {
    setSid(id);
    setSt(suggest(streamById(id).fields!));
  };
  const pick = (role: RoleKey) => (field: string) =>
    setSt((x) => ({ mapping: { ...x.mapping, [role]: field } as Mapping, confs: { ...x.confs, [role]: "manual" } }));
  const missing = missingRoles(s, st.mapping);
  const base = useId();
  const ax = (role: RoleKey) => (
    <AxisSelect role={role} id={`${base}-${role}`} stream={s} value={st.mapping[role]} conf={st.confs[role]} onPick={pick(role)} />
  );
  return (
    <div className="ad ac-axis">
      <div className="ad-seg ac-axis-streams" role="group" aria-label="Stream">
        {AXIS_STREAMS.map((id) => (
          <button key={id} type="button" aria-pressed={sid === id} onClick={() => choose(id)}>
            {streamById(id).name}
          </button>
        ))}
      </div>
      <div className="ad-panel ac-axis-card">
        <div className="ac-axis-head">
          <h4>Bar chart</h4>
          {ax("period")}
        </div>
        <div className="ac-axis-y">{ax("value")}</div>
        <div className="ac-axis-plot" aria-live="polite">
          {missing.length ? <Empty missing={missing} /> : <Chart kind="bar" data={totals(s, st.mapping)} ratio={0.34} min={170} max={240} />}
        </div>
        <div className="ac-axis-x">{ax("category")}</div>
      </div>
    </div>
  );
}
