"use client";

import { ROLES, type Confidences, type Mapping, type RoleKey, type Stream } from "./data";
import { Swatch } from "./charts";

/**
 * One dropdown per role, the way you pick a chart's axes. Each suggestion says how sure it is with three dots and a
 * word (exact, known, close), never colour alone.
 */
export function Roles({
  id,
  stream,
  mapping,
  confs,
  disabled = false,
  row = false,
  onPick,
}: {
  id: string;
  stream: Stream;
  mapping: Mapping;
  confs: Confidences;
  disabled?: boolean;
  row?: boolean;
  onPick: (role: RoleKey, field: string) => void;
}) {
  const fields = stream.fields ?? [];
  return (
    <ul className={`ad-roles${row ? " is-row" : ""}`}>
      {ROLES.map((r) => {
        const sel = mapping[r.key];
        const f = fields.find((x) => x.name === sel);
        const wrongType = !!f && f.type !== r.type;
        const conf = confs[r.key];
        const selId = `${id}-${r.key}`;
        let note = "";
        if (!stream.fields) note = "This stream has no rows yet, so its fields are unknown.";
        else if (wrongType) note = `Needs a ${r.type} field.`;
        else if (!sel) note = r.required ? "Required" : "Optional";
        return (
          <li key={r.key} className="ad-role" data-role={r.key}>
            <div className="ad-role-top">
              <label className="ad-role-name" htmlFor={selId}>
                <Swatch role={r.key} />
                {r.key}
              </label>
              <span className="ad-role-type">
                {r.type}
                {r.required ? " · required" : ""}
              </span>
            </div>
            <div className="ad-select" data-role={r.key}>
              <select id={selId} value={sel} disabled={disabled || !stream.fields} onChange={(e) => onPick(r.key, e.target.value)}>
                <option value="">{r.required ? "Choose a field" : "None"}</option>
                {fields.map((x) => (
                  <option key={x.name} value={x.name}>
                    {x.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="ad-role-top">
              <span className={`ad-role-note${wrongType || (!sel && r.required && stream.fields) ? " is-warn" : ""}`}>{note}</span>
              {sel && conf && (
                <span className="ad-conf" data-c={conf}>
                  <i aria-hidden="true">
                    <b />
                    <b />
                    <b />
                  </i>
                  {conf === "manual" ? "your choice" : conf}
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
