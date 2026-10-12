/*
 * Components for Any Data: the invented streams, the contract and the one matcher that the picker and the panel
 * share. Every value here is invented for the case file; nothing comes from the employer's product or customers.
 */

export type FieldType = "text" | "number" | "date";
export type Field = { name: string; type: FieldType };
export type Cell = string | number;
export type Stream = { id: string; name: string; rows: number; fields: Field[] | null; data: Cell[][] };
export type RoleKey = "category" | "value" | "period";
export type Role = { key: RoleKey; type: FieldType; required: boolean };
export type Confidence = "exact" | "known" | "close" | "manual";
export type Mapping = Record<RoleKey, string>;
export type Confidences = Record<RoleKey, Confidence | null>;
export type Fit = { group: "fits" | "partly" | "other"; label: string };
export type Datum = { k: string; v: number };

export const ROLES: Role[] = [
  { key: "category", type: "text", required: true },
  { key: "value", type: "number", required: true },
  { key: "period", type: "date", required: false },
];

export const STREAMS: Stream[] = [
  {
    id: "courier",
    name: "courier_app.deliveries",
    rows: 1840,
    fields: [
      { name: "town", type: "text" },
      { name: "parcels", type: "number" },
      { name: "delivered_on", type: "date" },
      { name: "driver_id", type: "text" },
    ],
    data: [
      ["Leeds", 128, "2026-09-28", "D-104"],
      ["Bristol", 102, "2026-09-28", "D-221"],
      ["Glasgow", 87, "2026-09-28", "D-318"],
      ["Leeds", 96, "2026-09-29", "D-104"],
      ["Cardiff", 64, "2026-09-29", "D-410"],
      ["Bristol", 88, "2026-09-29", "D-221"],
      ["Norwich", 41, "2026-09-29", "D-512"],
      ["Glasgow", 73, "2026-09-30", "D-318"],
      ["Leeds", 140, "2026-09-30", "D-107"],
      ["Cardiff", 58, "2026-09-30", "D-410"],
    ],
  },
  {
    id: "north",
    name: "north_depot.scans",
    rows: 26708,
    fields: [
      { name: "scan_id", type: "text" },
      { name: "site", type: "text" },
      { name: "qty", type: "number" },
      { name: "eta_ts", type: "date" },
    ],
    data: [
      ["S-88120", "York", 34, 1790583600],
      ["S-88121", "Wakefield", 51, 1790587200],
      ["S-88122", "Harrogate", 22, 1790590800],
      ["S-88123", "Leeds North", 47, 1790594400],
      ["S-88124", "York", 29, 1790670000],
      ["S-88125", "Selby", 12, 1790673600],
      ["S-88126", "Wakefield", 38, 1790677200],
      ["S-88127", "Leeds North", 41, 1790680800],
    ],
  },
  {
    id: "partner",
    name: "partner_carrier.feed",
    rows: 412,
    fields: [
      { name: "Ref", type: "text" },
      { name: "City", type: "text" },
      { name: "ArrDate", type: "date" },
      { name: "Status", type: "text" },
    ],
    data: [
      ["PC-2231", "Dundee", "30/09/2026", "Arrived"],
      ["PC-2232", "Perth", "30/09/2026", "In transit"],
      ["PC-2233", "Dundee", "01/10/2026", "Arrived"],
    ],
  },
  {
    id: "invoices",
    name: "finance.invoices",
    rows: 9120,
    fields: [
      { name: "invoice_no", type: "text" },
      { name: "amount", type: "number" },
      { name: "ccy", type: "text" },
      { name: "issued", type: "date" },
    ],
    data: [
      ["INV-5521", 1240.5, "GBP", "2026-09-28"],
      ["INV-5522", 880, "GBP", "2026-09-28"],
      ["INV-5523", 2310, "EUR", "2026-09-29"],
    ],
  },
  { id: "yard", name: "yard_sensors.raw", rows: 0, fields: null, data: [] },
];

export const SAMPLE: Stream = {
  id: "sample",
  name: "Sample",
  rows: 5,
  fields: [
    { name: "category", type: "text" },
    { name: "value", type: "number" },
    { name: "period", type: "date" },
  ],
  data: [
    ["Category A", 48, "2026-01-01"],
    ["Category B", 36, "2026-01-01"],
    ["Category C", 29, "2026-01-01"],
    ["Category D", 18, "2026-01-01"],
    ["Category E", 11, "2026-01-01"],
  ],
};

export const streamById = (id: string) => STREAMS.find((s) => s.id === id)!;

/* aliases and industry terms, then a looser "close" guess */
const VOCAB: Record<RoleKey, { exact: string[]; known: string[]; close: RegExp }> = {
  category: {
    exact: ["category"],
    known: ["place", "town", "city", "site", "depot", "region", "location"],
    close: /(name|area|zone|loc|branch|store)/i,
  },
  value: {
    exact: ["value"],
    known: ["deliveries", "parcels", "qty", "quantity", "count", "items"],
    close: /(num|total|cnt|vol|units)/i,
  },
  period: {
    exact: ["period", "date", "day"],
    known: ["delivered_on", "delivery_date", "arrival_date"],
    close: /(date|_at$|_ts$|time|_on$|day|week|month)/i,
  },
};
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

/** For each role, the best field of the right type and how sure the match is. One matcher for the picker and the panel. */
export function suggest(fields: Field[]): { mapping: Mapping; confs: Confidences } {
  const used = new Set<string>();
  const mapping = { category: "", value: "", period: "" } as Mapping;
  const confs = { category: null, value: null, period: null } as Confidences;
  for (const r of ROLES) {
    const typed = fields.filter((f) => f.type === r.type && !used.has(f.name));
    const v = VOCAB[r.key];
    let hit = typed.find((f) => v.exact.map(norm).includes(norm(f.name)));
    let conf: Confidence | null = hit ? "exact" : null;
    if (!hit) {
      hit = typed.find((f) => v.known.map(norm).includes(norm(f.name)));
      if (hit) conf = "known";
    }
    if (!hit) {
      hit = typed.find((f) => v.close.test(f.name));
      if (hit) conf = "close";
    }
    if (hit) {
      used.add(hit.name);
      mapping[r.key] = hit.name;
      confs[r.key] = conf;
    }
  }
  return { mapping, confs };
}

export function fitOf(stream: Stream): Fit {
  if (!stream.fields) return { group: "other", label: "Unknown" };
  const { mapping } = suggest(stream.fields);
  const req = ROLES.filter((r) => r.required);
  const matched = req.filter((r) => mapping[r.key]).length;
  if (matched === req.length) return { group: "fits", label: "Fits" };
  if (matched > 0) return { group: "partly", label: `${matched} of ${req.length} fields` };
  return { group: "other", label: `0 of ${req.length} fields` };
}

/** Required roles that have no field of the right type. An empty list means the chart can draw. */
export function missingRoles(stream: Stream, mapping: Mapping): RoleKey[] {
  const fields = stream.fields ?? [];
  return ROLES.filter((r) => r.required)
    .filter((r) => {
      const f = fields.find((x) => x.name === mapping[r.key]);
      return !f || f.type !== r.type;
    })
    .map((r) => r.key);
}

/** Required roles the stream has no field of the right type for: no choice of field can fill them. */
export function absentRoles(stream: Stream): Role[] {
  const fields = stream.fields ?? [];
  return ROLES.filter((r) => r.required && !fields.some((f) => f.type === r.type));
}

/** Totals by category: the dataset every chart on the contract draws. At most six slices; the rest fold into "Other". */
export function totals(stream: Stream, mapping: Mapping): Datum[] {
  const f = stream.fields ?? [];
  const ci = f.findIndex((x) => x.name === mapping.category);
  const vi = f.findIndex((x) => x.name === mapping.value);
  if (ci < 0 || vi < 0) return [];
  const m = new Map<string, number>();
  for (const row of stream.data) {
    const n = Number(row[vi]);
    if (!Number.isFinite(n)) continue;
    const k = String(row[ci]);
    m.set(k, (m.get(k) ?? 0) + n);
  }
  let arr = [...m].map(([k, v]) => ({ k, v })).sort((a, b) => b.v - a.v);
  if (arr.length > 6) {
    const rest = arr.slice(5).reduce((s, d) => s + d.v, 0);
    arr = arr.slice(0, 5).concat({ k: "Other", v: rest });
  }
  return arr;
}

/** Reads a CSV in the browser. Types are guessed from the values: numbers, dates, or text. */
export function parseCSV(name: string, text: string, id: string): Stream | null {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return null;
  const split = (l: string) => l.split(",").map((x) => x.trim().replace(/^"|"$/g, ""));
  const head = split(lines[0]!);
  const rows = lines.slice(1, 2001).map(split);
  const fields: Field[] = head.map((h, i) => {
    const col = rows.map((r) => r[i]).filter((v): v is string => v !== undefined && v !== "");
    const isNum = col.length > 0 && col.every((v) => /^-?[\d,.]+$/.test(v));
    const isDate = !isNum && col.length > 0 && col.every((v) => /\d{1,4}[-/]\d{1,2}[-/]\d{1,4}/.test(v));
    return { name: h || `column_${i + 1}`, type: isNum ? "number" : isDate ? "date" : "text" };
  });
  const data = rows.map((r) => r.map((v, i) => (fields[i]?.type === "number" ? Number(String(v).replace(/,/g, "")) : v)));
  return { id, name, rows: rows.length, fields, data };
}

export const fmt = (n: number) => (Math.round(n * 10) / 10).toLocaleString("en-GB");
