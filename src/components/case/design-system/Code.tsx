"use client";

// the project's styles and the invented customers' faces, wherever its evidence is shown (case file or printed sheet)
import "@fontsource-variable/archivo";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/ibm-plex-sans";
import "@fontsource-variable/inter";
import "./design-system.css";

import { useRef, useState } from "react";
import { Pi } from "./Products";
import { SCALES, styleOf, theme, type Mode } from "./tokens";

/*
 * 02.2: one editor window, like an AI code editor: the source on the left (the shared tokens, one product's globals,
 * two components), a browser pane on the right with what it renders, light or dark. Choosing a component's file
 * lights up the parts it draws. Every value is the invented brand's.
 */

const FILES: Record<string, { part: "all" | "btn" | "badge"; src: string }> = {
  "tokens.css": {
    part: "all",
    src: `/* shared package: the foundation */
:root {
  --brand-50:  oklch(0.97 0.014 268);
  --brand-200: oklch(0.82 0.089 268);
  --brand-600: oklch(0.5 0.2 268);
  --brand-700: oklch(0.44 0.17 268);

  /* roles: for components */
  --primary: var(--brand-600);
  --primary-foreground: oklch(0.985 0 0);
  --ring: var(--brand-200);
  --success-text: var(--green-600);
  --warning-text: var(--amber-700);
}

.dark {
  /* text steps re-tuned, not inverted */
  --brand-600: oklch(0.76 0.122 268);
  --primary: oklch(0.5 0.2 268);
}`,
  },
  "globals.css": {
    part: "all",
    src: `/* Manifest: this product's own layer */
@import "@shared/tokens.css";

:root {
  /* only what this product needs */
  --radius: 1rem;
  --sidebar: oklch(0.985 0 0);
  --menu-highlight: color-mix(in oklch, var(--primary) 12%, white);
}

.dark {
  --sidebar: oklch(0.21 0.006 286);
}`,
  },
  "button.tsx": {
    part: "btn",
    src: `import { cva } from "class-variance-authority"

export const buttonVariants = cva(
  ["inline-flex items-center rounded-md",
   "text-sm font-medium",
   "focus-visible:ring-[3px] ring-ring"],
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        outline: "border bg-background",
        ghost: "hover:bg-accent",
        destructive: "bg-destructive text-white",
      },
    },
    defaultVariants: { variant: "default" },
  },
)`,
  },
  "badge.tsx": {
    part: "badge",
    src: `import { cva } from "class-variance-authority"

// a badge takes a role; the role picks the colours
export const badgeVariants = cva(
  "rounded-full border px-2 text-xs font-medium",
  {
    variants: {
      role: {
        success: "bg-success-container text-success-text",
        warning: "bg-warning-container text-warning-text",
        danger:  "bg-danger-container text-danger-text",
        info:    "bg-info-container text-info-text",
        primary: "bg-primary-container text-primary-text",
      },
    },
  },
)

<Badge role="success">Delivered</Badge>`,
  },
};
const NAMES = Object.keys(FILES);

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const RX_CODE = /(\/\*[\s\S]*?\*\/|\/\/[^\n]*)|("[^"\n]*")|(oklch\([^)]*\))|(--[\w-]+)|\b(import|from|export|const)\b|(<\/?[A-Z][\w.]*|\/?>)|(\b[\w-]+(?=:\s))/g;
/** A small highlighter for the four files above; OKLCH values get a swatch. Input is constant source, escaped. */
function hl(src: string) {
  let out = "";
  let last = 0;
  let m: RegExpExecArray | null;
  RX_CODE.lastIndex = 0;
  while ((m = RX_CODE.exec(src))) {
    out += esc(src.slice(last, m.index));
    const t = m[0];
    if (m[1]) out += `<span class="c">${esc(t)}</span>`;
    else if (m[2]) out += `<span class="s">${esc(t)}</span>`;
    else if (m[3]) out += `<i class="sw" style="background:${t}"></i><span class="n">${esc(t)}</span>`;
    else if (m[4]) out += `<span class="v">${esc(t)}</span>`;
    else if (m[5]) out += `<span class="k">${esc(t)}</span>`;
    else if (m[6]) out += `<span class="t">${esc(t)}</span>`;
    else out += `<span class="p">${esc(t)}</span>`;
    last = m.index + t.length;
  }
  out += esc(src.slice(last));
  return out
    .split("\n")
    .map((l) => `<span class="ln">${l || " "}</span>`)
    .join("");
}
const HL = Object.fromEntries(NAMES.map((n) => [n, hl(FILES[n]!.src)]));

const BRAND = SCALES.light.brand["600"];
const PANE: Record<Mode, React.CSSProperties> = {
  light: styleOf({ ...theme(BRAND, "light"), "--destructive-fg": "#fafafa" }),
  dark: styleOf({ ...theme(BRAND, "dark"), "--primary-fg": "#fafafa", "--destructive-text": SCALES.dark.red["600"], "--destructive-fg": "#09090b" }),
};

export function InCode() {
  const [file, setFile] = useState(NAMES[0]!);
  const [mode, setMode] = useState<Mode>("light");
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const j = e.key === "ArrowRight" ? (i + 1) % NAMES.length : e.key === "ArrowLeft" ? (i + NAMES.length - 1) % NAMES.length : -1;
    if (j < 0) return;
    e.preventDefault();
    setFile(NAMES[j]!);
    tabs.current[j]?.focus();
  };
  return (
    <div className="ds-f2c">
      {/* no title bar: the window's one slim bar is its tabs and address (playbook §6: no fake window buttons) */}
      <div className="ide fx-win is-dark" role="group" aria-label="The system in code: its source files and what they render">
        <div className="ide-body">
          <div className="ds-f2c-editor">
            <div className="ds-f2c-tabs" role="tablist" aria-label="Source files">
              {NAMES.map((n, i) => (
                <button
                  key={n}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`ds-f2c-tab-${i}`}
                  aria-selected={file === n}
                  aria-controls="ds-f2c-src"
                  tabIndex={file === n ? 0 : -1}
                  onClick={() => setFile(n)}
                  onKeyDown={(e) => onKey(e, i)}
                >
                  {n}
                </button>
              ))}
            </div>
            <pre
              className="ds-f2c-src"
              id="ds-f2c-src"
              role="tabpanel"
              aria-labelledby={`ds-f2c-tab-${NAMES.indexOf(file)}`}
              tabIndex={0}
            >
              <code dangerouslySetInnerHTML={{ __html: HL[file]! }} />
            </pre>
          </div>
          <div className="ds-f2c-out ide-browser" data-mode={mode} data-part={FILES[file]!.part} role="group" aria-label="What this code renders, in a browser">
            <div className="ide-url">
              <span className="ide-nav" aria-hidden="true">
                <Pi n="chev" />
                <Pi n="chev" />
                <svg className="pi" viewBox="0 0 24 24">
                  <path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v5h-5" />
                </svg>
              </span>
              <span className="ide-addr">localhost:3000/preview</span>
              <span className="fx-seg" role="radiogroup" aria-label="Preview mode">
                {(["light", "dark"] as Mode[]).map((m) => (
                  <label key={m}>
                    <input type="radio" name="ds-pv-mode" value={m} checked={mode === m} onChange={() => setMode(m)} />
                    {m === "light" ? "Light" : "Dark"}
                  </label>
                ))}
              </span>
            </div>
            <div className="ds-f2c-pane ui" style={PANE[mode]}>
              <div className="ds-f2c-row" data-part="btn">
                <span className="ui-btn is-primary">Settings</span>
                <span className="ui-btn is-outline">Settings</span>
                <span className="ui-btn is-ghost">Settings</span>
                <span className="ui-btn is-destructive">Settings</span>
              </div>
              <div className="ds-f2c-row" data-part="btn">
                <span className="ui-input is-focus">Placeholder text</span>
              </div>
              <div className="ds-f2c-row" data-part="badge">
                <span className="ui-badge r-success">Delivered</span>
                <span className="ui-badge r-warning">Delayed</span>
                <span className="ui-badge r-destructive">Failed</span>
                <span className="ui-badge r-info">On the road</span>
                <span className="ui-badge r-primary">Today</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
