"use client";

// the project's styles and the invented customers' faces, wherever its evidence is shown (case file or printed sheet)
import "@fontsource-variable/archivo";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/ibm-plex-sans";
import "@fontsource-variable/inter";
import "./design-system.css";

import { useState } from "react";
import { Ratio } from "./Colours";
import { CUSTOMERS, setCustomer, useSeenAs } from "./store";
import { ratio, styleOf, theme, type Mode } from "./tokens";

/*
 * Try it: the system rebuilt as one screen of an invented product, wearing the customer the case file is "seen as".
 * The reader switches the brand, light and dark, and the contrast labels (an annotation layer over the screen, never
 * part of it). The screen is a picture of the product: its fields and buttons are drawn, not live.
 */

function Warn() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M8 2.5 14 13H2z" strokeLinejoin="round" />
      <path d="M8 6.5v3M8 11.3v.2" strokeLinecap="round" />
    </svg>
  );
}

export function TryIt() {
  const { state, customer: c } = useSeenAs();
  const [mode, setMode] = useState<Mode>("light");
  const [show, setShow] = useState(false);
  const t = theme(c.colour, mode);
  const r = (a: string, b: string) => (
    <span data-r="">
      <Ratio r={ratio(t[a]!, t[b]!)} />
    </span>
  );
  return (
    <div className="tp">
      <div className="tp-controls">
        <div className="tp-left">
          <div className="ds-seg" role="radiogroup" aria-label="Customer">
            {CUSTOMERS.map((k) => (
              <label key={k.id}>
                <input type="radio" name="ds-tp-customer" value={k.id} checked={state.id === k.id} onChange={() => setCustomer(k.id)} />
                <i className="ds-dot" style={{ background: k.colour }} />
                {k.name}
              </label>
            ))}
          </div>
        </div>
        <div className="tp-right">
          <div className="ds-seg" role="radiogroup" aria-label="Mode">
            {(["light", "dark"] satisfies Mode[]).map((m) => (
              <label key={m}>
                <input type="radio" name="ds-tp-mode" value={m} checked={mode === m} onChange={() => setMode(m)} />
                {m === "light" ? "Light" : "Dark"}
              </label>
            ))}
          </div>
          <label className="ds-check">
            <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} /> Show text contrast
          </label>
        </div>
      </div>
      <div
        className={`tp-app ui${show ? " show-ratios" : ""}`}
        style={{ ...styleOf(t), "--font": c.font, "--r": c.r, "--btn-r": c.btn, colorScheme: mode }}
      >
        <div className="tp-head">
          <span className="tp-logo" aria-hidden="true">
            {c.mark}
          </span>
          <b>Deliveries</b>
          <nav className="tp-tabs" aria-label="Example navigation">
            <span className="is-on">
              Today
              {r("--primary-container-fg", "--primary-container")}
            </span>
            <span>Routes</span>
            <span>Drivers</span>
            <span>Reports</span>
          </nav>
          <span className="tp-user" aria-hidden="true" />
        </div>
        <div className="tp-body">
          <section className="tp-card" aria-label="Today's runs">
            <div className="tp-actions">
              <h3>Today&apos;s runs</h3>
              <div>
                <span className="ui-btn is-outline">Export</span>
                <span className="ui-btn is-primary">
                  New run
                  {r("--primary-fg", "--primary")}
                </span>
              </div>
            </div>
            <div className="tp-filters">
              <div className="ui-field">
                <span className="ui-input is-placeholder">Search runs</span>
              </div>
              <div className="ui-field">
                <span className="ui-select is-static">All depots</span>
              </div>
            </div>
            <ul className="tp-rows">
              <li>
                <b>Run 4821</b>
                <span className="ui-badge r-success">
                  Delivered
                  {r("--success-container-fg", "--success-container")}
                </span>
                <small>14 stops · North depot</small>
              </li>
              <li>
                <b>Run 4822</b>
                <span className="ui-badge r-warning">Delayed</span>
                <small>9 stops · Harbour depot</small>
              </li>
              <li>
                <b>Run 4823</b>
                <span className="ui-badge r-info">On the road</span>
                <small>11 stops · North depot</small>
              </li>
              <li>
                <b>Run 4824</b>
                <span className="ui-badge r-destructive">Failed</span>
                <small>3 stops · Harbour depot</small>
              </li>
            </ul>
            <div className="tp-actions">
              <div className="ui-pages" aria-label="Pages">
                <span className="is-on">1</span>
                <span>2</span>
                <span>3</span>
                <span>…</span>
                <span>10</span>
              </div>
            </div>
          </section>
          <section className="tp-card" aria-label="Driver">
            <h3>Run 4822</h3>
            <p>
              Two stops are behind schedule.
              {r("--muted-fg", "--card")}
            </p>
            <div className="ui-alert r-warning" role="note">
              <Warn />
              <span>
                <strong>Delayed</strong> by 25 minutes at Harbour depot.
              </span>
            </div>
            <div className="ui-field">
              <span>
                Note for the driver <b>*</b>
              </span>
              <small>Shown on their phone at the next stop.</small>
              <span className="ui-input is-error is-placeholder">Write a note</span>
              <small className="ui-err">A note is required.</small>
            </div>
            <div className="tp-actions">
              <div>
                <span className="ui-btn is-ghost">Cancel</span>
                <span className="ui-btn is-primary">Send</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
