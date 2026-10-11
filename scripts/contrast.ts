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

/** Case-file template (case-file.css): the reading surface follows the theme. */
function casePairs(t: Record<string, string>, theme: string): Pair[] {
  const T = (k: string) => {
    const v = t[k];
    if (!v) throw new Error(`Missing token --${k}`);
    return v;
  };
  return [
    { fg: T("case-ink"), bg: T("case-bg"), where: `${theme}: case file headings`, min: TEXT },
    { fg: T("case-body"), bg: T("case-bg"), where: `${theme}: case file body`, min: TEXT },
    { fg: T("case-dim"), bg: T("case-bg"), where: `${theme}: case file labels, captions, rail`, min: TEXT },
    { fg: T("case-ink"), bg: T("case-inset"), where: `${theme}: keycaps, next case file`, min: TEXT },
    { fg: T("case-dim"), bg: T("case-inset"), where: `${theme}: labels on inset`, min: TEXT },
    { fg: T("case-dim"), bg: T("case-bg"), where: `${theme}: control borders (segmented control, buttons)`, min: LARGE },
    { fg: T("case-on-red"), bg: T("case-red"), where: `${theme}: primary action (open the live platform)`, min: TEXT },
    ...surfacePairs(T, theme, "default"),
  ];
}

/** The colour field (cover, part openers) and the project's dark (motion, results): every text on them. */
function surfacePairs(T: (k: string) => string, theme: string, n: string): Pair[] {
  return [
    { fg: T("on-field"), bg: T("field"), where: `${theme} ${n}: text on the colour field (cover, openers)`, min: TEXT },
    { fg: T("on-field-2"), bg: T("field"), where: `${theme} ${n}: labels on the colour field`, min: TEXT },
    { fg: T("field"), bg: T("on-field"), where: `${theme} ${n}: chips and buttons on the field`, min: TEXT },
    { fg: T("on-dark"), bg: T("dark"), where: `${theme} ${n}: headings on the dark sheet`, min: TEXT },
    { fg: T("on-dark-body"), bg: T("dark"), where: `${theme} ${n}: body on the dark sheet`, min: TEXT },
    { fg: T("on-dark-2"), bg: T("dark"), where: `${theme} ${n}: labels and captions on the dark sheet`, min: TEXT },
    { fg: T("accent-on-dark"), bg: T("dark"), where: `${theme} ${n}: index, tags on the dark sheet`, min: TEXT },
    { fg: T("on-dark"), bg: T("dark-inset"), where: `${theme} ${n}: keycaps on the dark sheet`, min: TEXT },
    { fg: T("accent"), bg: T("studio"), where: `${theme} ${n}: part numbers and marker in the contents`, min: TEXT },
  ];
}

/** Per-project palettes (case-palettes.css): every pairing a palette is used in, in both themes. */
const palCss = fs.readFileSync(path.join(process.cwd(), "src/app/case-palettes.css"), "utf8");
function palBlock(re: RegExp): Record<string, string> {
  const m = palCss.match(re);
  if (!m) return {};
  const out: Record<string, string> = {};
  for (const [, name, value] of m[1]!.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-f]{3,8})\s*;/gi)) out[name!] = value!.toLowerCase();
  return out;
}
function palettePairs(): Pair[] {
  const names = [...new Set([...palCss.matchAll(/^\[data-palette="([a-z0-9-]+)"\]\s*\{/gm)].map((m) => m[1]!))];
  const out: Pair[] = [];
  for (const n of names) {
    const lightPal = palBlock(new RegExp(`^\\[data-palette="${n}"\\]\\s*\\{([\\s\\S]*?)\\n\\}`, "m"));
    const darkPal = { ...lightPal, ...palBlock(new RegExp(`:root\\[data-theme="dark"\\] \\[data-palette="${n}"\\]\\s*\\{([\\s\\S]*?)\\n\\}`)) };
    for (const [theme, base, pal] of [
      ["light", light, lightPal],
      ["dark", dark, darkPal],
    ] as const) {
      const P = (k: string) => {
        const v = pal[k] ?? base[k];
        if (!v) throw new Error(`Missing palette token --${k} (${n})`);
        return v;
      };
      const bg = P("case-bg");
      out.push(
        { fg: P("accent"), bg, where: `${theme} ${n}: accent (links, numbers, rail marker)`, min: TEXT },
        { fg: P("accent"), bg: P("accent-tint"), where: `${theme} ${n}: accent on tint`, min: TEXT },
        { fg: P("on-accent"), bg: P("accent-strong"), where: `${theme} ${n}: filled chip text`, min: TEXT },
        { fg: P("case-body"), bg: P("accent-tint"), where: `${theme} ${n}: body on "Printed for" tint`, min: TEXT },
        { fg: P("case-dim"), bg: P("accent-2"), where: `${theme} ${n}: labels on the media field`, min: TEXT },
        { fg: P("case-ink"), bg: P("accent-2"), where: `${theme} ${n}: stepper text on the field`, min: TEXT },
      );
      out.push(...surfacePairs(P, theme, n));
      for (const t of ["people", "partners", "projects", "methods"]) {
        if (pal[`type-${t}-on-dark`]) out.push({ fg: P(`type-${t}-on-dark`), bg: P("dark"), where: `${theme} ${n}: ${t} numbers on the dark sheet`, min: TEXT });
      }
      if (pal["mark-people-on-dark"]) out.push({ fg: P("mark-people-on-dark"), bg: P("dark"), where: `${theme} ${n}: people shape on the dark sheet`, min: LARGE });
      for (const t of ["people", "partners", "projects", "methods"]) {
        if (pal[`type-${t}`]) out.push({ fg: P(`type-${t}`), bg, where: `${theme} ${n}: ${t} numbers and labels`, min: TEXT });
        if (pal[`mark-${t}`]) out.push({ fg: P(`mark-${t}`), bg, where: `${theme} ${n}: ${t} shape`, min: LARGE });
      }
    }
  }
  return out;
}

/** HHCD's cover and work sheet in dark mode (case-palettes.css: they turn ink; the product keeps its white screen). */
const hhcdDarkCover: Pair[] = [
  { fg: "#f2f1f4", bg: "#1c1b21", where: "dark hhcd: cover title and text", min: TEXT },
  { fg: "#aeacb8", bg: "#1c1b21", where: "dark hhcd: cover labels", min: TEXT },
  { fg: "#1c1b21", bg: "#f2f1f4", where: "dark hhcd: Open the live platform button", min: TEXT },
  { fg: "#8d89d6", bg: "#1c1b21", where: "dark hhcd: people mark on the cover", min: LARGE },
  { fg: "#dc2680", bg: "#1c1b21", where: "dark hhcd: partners mark on the cover", min: LARGE },
  { fg: "#148d66", bg: "#1c1b21", where: "dark hhcd: methods mark on the cover", min: LARGE },
  { fg: "#aeacb8", bg: "#2a2930", where: "dark hhcd: recording length in the toolbar", min: TEXT },
  { fg: "#f2f1f4", bg: "#2a2930", where: "dark hhcd: recording time in the toolbar", min: TEXT },
  { fg: "#f2f1f4", bg: "#2a2930", where: "dark hhcd: scrubber thumb on the toolbar", min: 3 },
  { fg: "#f2f1f4", bg: "#1c1b21", where: "dark hhcd: capability label text", min: TEXT },
  { fg: "#aeacb8", bg: "#1c1b21", where: "dark hhcd: address in the browser frame", min: TEXT },
];

/** The browser frame round the product (case-file.css), the same in every project in light mode. */
const browserFrame: Pair[] = [
  { fg: "#5b5966", bg: "#ffffff", where: "browser frame: address", min: TEXT },
  { fg: "#5b5966", bg: "#f1f0f3", where: "browser frame: toolbar", min: TEXT },
  { fg: "#22212a", bg: "#f1f0f3", where: "browser frame: recording time", min: TEXT },
  { fg: "#22212a", bg: "#f1f0f3", where: "browser frame: scrubber thumb", min: 3 },
  { fg: "#ffffff", bg: "#22212a", where: "recording: play button glyph", min: LARGE },
  { fg: "#ffffff", bg: "#3a3946", where: "recording: play button glyph, hovered", min: LARGE },
  { fg: "#22212a", bg: "#ffffff", where: "light hhcd: capability label text", min: TEXT },
  { fg: "#22212a", bg: "#ffffff", where: "recording: focus ring on the screen", min: 3 },
];

const all = [
  ...hhcdDarkCover,
  ...browserFrame,
  ...pairs(light, "light"),
  ...pairs(dark, "dark"),
  ...casePairs(light, "light"),
  ...casePairs(dark, "dark"),
  ...palettePairs(),
];
let failed = 0;
for (const p of all) {
  const r = ratio(p.fg, p.bg);
  const ok = r >= p.min;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${r.toFixed(2).padStart(5)}:1  (min ${p.min})  ${p.fg} on ${p.bg}  ${p.where}`);
}
console.log(`\n${all.length - failed}/${all.length} pairs pass WCAG AA.`);
if (failed) process.exit(1);
