"use client";

// the project's styles and the invented customers' faces, wherever its evidence is shown (case file or printed sheet)
import "@fontsource-variable/archivo";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/ibm-plex-sans";
import "@fontsource-variable/inter";
import "./design-system.css";

import Image from "next/image";
import { useState } from "react";
import { SCALES, type Mode } from "./tokens";

/*
 * 02.1: the library, shown in a design tool's window: its components on the left, the review frame on the canvas,
 * the variables with their two modes on the right. The frame is Chongbo's export of the library rebuilt on the
 * invented brand (both modes side by side in one file; the window shows one half).
 */

const VARS: [string, (m: Mode) => string][] = [
  ["role/primary/fill", () => SCALES.light.brand["600"]],
  ["role/primary/text", (m) => SCALES[m].brand["600"]],
  ["role/success/text", (m) => SCALES[m].green["600"]],
  ["role/warning/text", (m) => SCALES[m].amber["700"]],
  ["role/destructive/text", (m) => SCALES[m].red["600"]],
];
const COMPONENTS: [string, number][] = [
  ["Button", 12],
  ["Text input", 4],
  ["Badge", 5],
  ["Alert", 4],
  ["Pagination item", 3],
];

export function FigmaLibrary() {
  const [mode, setMode] = useState<Mode>("light");
  const name = mode === "light" ? "Light" : "Dark";
  return (
    <div className="ds-fx">
      <div className="fx-win">
        <div className="fx-bar">
          <span className="fx-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="fx-file">Design system · rebuilt on an invented brand</span>
          <span className="fx-pages" aria-hidden="true">
            <b>Components</b>
            <span>Colours</span>
          </span>
        </div>
        <div className="fx-body">
          <div className="fx-layers" role="group" aria-label="Components in the library">
            <small>Components</small>
            <ul>
              {COMPONENTS.map(([c, n]) => (
                <li key={c}>
                  <em aria-hidden="true" />
                  {c}
                  <span>{n}</span>
                </li>
              ))}
            </ul>
            <small>Variants and states, with every colour bound to a variable.</small>
          </div>
          <div className="fx-canvas">
            <figure className="fx-frame">
              <figcaption>Review · {name}</figcaption>
              <div className="fx-img" data-mode={mode}>
                <Image
                  src="/assets/design-system/figma-components.webp"
                  width={2936}
                  height={894}
                  quality={90}
                  sizes="(min-width: 1180px) 1240px, 200vw"
                  alt={`The Figma library's components in the ${mode} mode: buttons, inputs with focus and error, badges, alerts and pagination.`}
                />
              </div>
            </figure>
          </div>
          <div className="fx-vars" role="group" aria-label="Variables">
            <small>Variables</small>
            <div className="fx-modes" role="radiogroup" aria-label="Mode">
              {(["light", "dark"] as Mode[]).map((m) => (
                <label key={m}>
                  <input type="radio" name="ds-fx-mode" value={m} checked={mode === m} onChange={() => setMode(m)} />
                  {m === "light" ? "Light" : "Dark"}
                </label>
              ))}
            </div>
            <ul>
              {VARS.map(([n, f]) => (
                <li key={n}>
                  <i style={{ background: f(mode) }} aria-hidden="true" />
                  <span>{n}</span>
                  <code>{f(mode).toUpperCase()}</code>
                </li>
              ))}
            </ul>
            <small>Collections</small>
            <p className="fx-coll">
              Colour · Light
              <br />
              Colour · Dark
              <br />
              Radius
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
