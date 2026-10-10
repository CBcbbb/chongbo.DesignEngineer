/**
 * WCAG contrast check for every text/background pairing the site actually uses.
 * Reads light and dark values from src/app/tokens.css, so a token change is checked automatically.
 * Run: npm run contrast
 */
import fs from "node:fs";
import path from "node:path";

const css = fs.readFileSync(path.join(process.cwd(), "src/app/tokens.css"), "utf8");

function block(selector: RegExp): Record<string, string> {
  const m = css.match(selector);
  if (!m) throw new Error(`Token block not found: ${selector}`);
  const out: Record<string, string> = {};
  for (const [, name, value] of m[1]!.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-f]{3,8})\s*;/gi)) out[name!] = value!.toLowerCase();
  return out;
}

const light = block(/^:root\s*\{([\s\S]*?)\n\}/m);
const dark = { ...light, ...block(/:root\[data-theme="dark"\]\s*\{([\s\S]*?)\n\}/) };

function lum(hex: string): number {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? [...h].map((c) => c + c).join("") : h.slice(0, 6);
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}
export function ratio(a: string, b: string): number {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x! + 0.05) / (y! + 0.05);
}

type Pair = { fg: string; bg: string; where: string; min: number };
const TEXT = 4.5;
const LARGE = 3; // large text and UI component boundaries / focus rings

// Fixed surfaces that are not tokens (see components.css).
const INSET = "#f3f3ef"; // diagrams and media placeholders
const CODE_BG = "#1f1f1d";
const TAG_INK = "#3a3a36"; // case-file tags (components.css)

function pairs(t: Record<string, string>, theme: string): Pair[] {
  const T = (k: string) => {
    const v = t[k];
    if (!v) throw new Error(`Missing token --${k}`);
    return v;
  };
  return [
    // studio (theme-dependent)
    { fg: T("ink"), bg: T("studio"), where: `${theme}: body text on studio`, min: TEXT },
    { fg: T("ink"), bg: T("studio-hi"), where: `${theme}: text on studio highlight / chips`, min: TEXT },
    { fg: T("ink-2"), bg: T("studio"), where: `${theme}: secondary text on studio`, min: TEXT },
    { fg: T("ink-2"), bg: T("studio-hi"), where: `${theme}: secondary text on studio highlight`, min: TEXT },
    { fg: T("studio"), bg: T("ink"), where: `${theme}: New request button and skip link`, min: TEXT },
    { fg: T("ink"), bg: T("studio"), where: `${theme}: deck arrows and counter`, min: TEXT },
    { fg: T("focus"), bg: T("studio"), where: `${theme}: focus ring on studio`, min: LARGE },
    // paper (same in both themes: it is an object)
    { fg: T("paper-ink"), bg: T("paper"), where: `${theme}: ticket text`, min: TEXT },
    { fg: T("paper-body"), bg: T("paper"), where: `${theme}: ticket body`, min: TEXT },
    { fg: T("paper-dim"), bg: T("paper"), where: `${theme}: ticket mono labels`, min: TEXT },
    { fg: T("stamp"), bg: T("paper"), where: `${theme}: Matched stamp and diagram accents`, min: TEXT },
    { fg: TAG_INK, bg: T("paper"), where: `${theme}: case-file signal tags`, min: TEXT },
    { fg: T("paper-tag"), bg: T("paper"), where: `${theme}: sheet signal tags`, min: TEXT },
    { fg: T("paper-ghost"), bg: T("paper"), where: `${theme}: typed examples on the paper`, min: TEXT },
    { fg: T("red"), bg: T("paper"), where: `${theme}: caret and selected-card dot on paper`, min: LARGE },
    { fg: T("paper-ink"), bg: T("paper-current"), where: `${theme}: current part in the rail`, min: TEXT },
    { fg: T("paper-dim"), bg: T("paper-current"), where: `${theme}: current part number in the rail`, min: TEXT },
    { fg: T("paper-ink"), bg: T("paper"), where: `${theme}: focus ring on paper`, min: LARGE },
    { fg: T("paper-dim"), bg: INSET, where: `${theme}: diagram labels / placeholder text`, min: TEXT },
    { fg: T("paper-body"), bg: INSET, where: `${theme}: diagram body`, min: TEXT },
    { fg: T("stamp"), bg: INSET, where: `${theme}: diagram contract labels`, min: TEXT },
    // code
    { fg: "#ecece8", bg: CODE_BG, where: `${theme}: code text`, min: TEXT },
    { fg: "#a6a6a0", bg: CODE_BG, where: `${theme}: code comments`, min: TEXT },
    { fg: "#ffb4a6", bg: CODE_BG, where: `${theme}: code properties`, min: TEXT },
  ];
}

const all = [...pairs(light, "light"), ...pairs(dark, "dark")];
let failed = 0;
for (const p of all) {
  const r = ratio(p.fg, p.bg);
  const ok = r >= p.min;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${r.toFixed(2).padStart(5)}:1  (min ${p.min})  ${p.fg} on ${p.bg}  ${p.where}`);
}
console.log(`\n${all.length - failed}/${all.length} pairs pass WCAG AA.`);
if (failed) process.exit(1);
