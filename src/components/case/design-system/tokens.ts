/**
 * One Design System, Three Products, Any Brand: the tokens and the rule every piece of evidence is drawn from.
 *
 * The brand is invented (docs/case-studies/design-system/tokens.json, generated with the real system's fixed lightness
 * per step, so every text pairing passes 4.5:1). The lightness chart uses the real system's lightness values, which
 * carry no brand. Confidentiality (playbook §9): nothing here names the employer, its products or its customers.
 */

export type Mode = "light" | "dark";
export type Hue = "brand" | "blue" | "green" | "red" | "purple" | "amber";
export type Step = "50" | "200" | "500" | "600" | "700";

export const SCALES: Record<Mode, Record<Hue, Record<Step, string>>> = {
  light: {
    brand: { "50": "#f1f5ff", "200": "#abc3ff", "500": "#5b81ff", "600": "#3453d3", "700": "#2c45ae" },
    blue: { "50": "#eff6ff", "200": "#9cc7ff", "500": "#1f8aff", "600": "#0061be", "700": "#0051a0" },
    green: { "50": "#e8fbea", "200": "#92d89c", "500": "#00a943", "600": "#00782d", "700": "#006425" },
    red: { "50": "#fff2f0", "200": "#ffaba3", "500": "#ed4a49", "600": "#bb061e", "700": "#9b0f1b" },
    purple: { "50": "#f9f2ff", "200": "#dab0fa", "500": "#b161e5", "600": "#8632b6", "700": "#6f2c96" },
    amber: { "50": "#fff3e4", "200": "#ffce8a", "500": "#eba000", "600": "#956300", "700": "#7e5400" },
  },
  dark: {
    brand: { "50": "#0c142d", "200": "#233056", "500": "#5379fd", "600": "#90aeff", "700": "#b4c9ff" },
    blue: { "50": "#05162c", "200": "#183356", "500": "#0c84fa", "600": "#79b4ff", "700": "#a7ceff" },
    green: { "50": "#031c08", "200": "#153c1d", "500": "#00a240", "600": "#6dc97d", "700": "#a3dbaa" },
    red: { "50": "#290b0a", "200": "#512320", "500": "#e64343", "600": "#fe8b83", "700": "#ffb5ae" },
    purple: { "50": "#1d0f27", "200": "#3e284d", "500": "#ab5ade", "600": "#cc97f3", "700": "#ddbbf7" },
    amber: { "50": "#211300", "200": "#472d00", "500": "#c38400", "600": "#e7af5c", "700": "#f4c98e" },
  },
};

type Neutral = Record<"background" | "card" | "foreground" | "muted" | "muted-foreground" | "border" | "input", string>;
export const NEUTRAL: Record<Mode, Neutral> = {
  light: { background: "#ffffff", card: "#ffffff", foreground: "#09090b", muted: "#f4f4f5", "muted-foreground": "#71717b", border: "#e4e4e7", input: "#f4f4f5" },
  dark: { background: "#09090b", card: "#18181b", foreground: "#fafafa", muted: "#27272a", "muted-foreground": "#9f9fa9", border: "#2d2d31", input: "#1f1f23" },
};

/** Each hue, its name and the role components ask for. */
export const HUES: [Hue, string, string][] = [
  ["brand", "Brand", "primary"],
  ["blue", "Blue", "info"],
  ["green", "Green", "success"],
  ["red", "Red", "destructive"],
  ["purple", "Purple", "categorical"],
  ["amber", "Amber", "warning"],
];
/** Each step and its one job. */
export const STEPS: [Step, string][] = [
  ["50", "Surface"],
  ["200", "Border"],
  ["500", "Charts, icons"],
  ["600", "Text on white"],
  ["700", "Text on a tint"],
];
/** The real system's OKLCH lightness per step (light mode). Hue-free, so safe to show. */
export const REAL_L: Record<Step, Partial<Record<Hue, number>>> = {
  "50": { brand: 0.97, blue: 0.97, green: 0.97, red: 0.97, purple: 0.97, amber: 0.97 },
  "200": { brand: 0.82, blue: 0.82, green: 0.82, red: 0.82, purple: 0.82, amber: 0.88 },
  "500": { blue: 0.623, green: 0.64, red: 0.65, purple: 0.63, amber: 0.76 },
  "600": { brand: 0.5, blue: 0.5, green: 0.5, red: 0.52, purple: 0.5, amber: 0.54 },
  "700": { brand: 0.44, blue: 0.44, green: 0.44, red: 0.45, purple: 0.44, amber: 0.48 },
};

/* ---------- colour maths: OKLab / OKLCH ↔ sRGB, WCAG 2 contrast ---------- */
type V3 = [number, number, number];
type Lch = { l: number; c: number; h: number };
const toLin = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const toGam = (v: number) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);
function hexToRgb(hex: string): V3 {
  let h = hex.replace("#", "");
  if (h.length === 3) h = [...h].map((x) => x + x).join("");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as V3;
}
const rgbToHex = (rgb: number[]) =>
  "#" + rgb.map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, "0")).join("");
function rgbToOklab(rgb: V3): V3 {
  const [r, g, b] = rgb.map(toLin) as V3;
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}
function oklabToLin([L, a, b]: V3): V3 {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}
const lch = (lab: V3): Lch => ({ l: lab[0], c: Math.hypot(lab[1], lab[2]), h: ((Math.atan2(lab[2], lab[1]) * 180) / Math.PI + 360) % 360 });
const lab = ({ l, c, h }: Lch): V3 => [l, c * Math.cos((h * Math.PI) / 180), c * Math.sin((h * Math.PI) / 180)];
const inside = (v: V3) => v.every((x) => x >= -1e-4 && x <= 1 + 1e-4);
function inGamut(c: Lch): Lch {
  if (inside(oklabToLin(lab(c)))) return c;
  let lo = 0;
  let hi = c.c;
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2;
    if (inside(oklabToLin(lab({ ...c, c: mid })))) lo = mid;
    else hi = mid;
  }
  return { ...c, c: lo };
}
const hexToLch = (h: string) => lch(rgbToOklab(hexToRgb(h)));
const lchToHex = (c: Lch) => rgbToHex(oklabToLin(lab(inGamut(c))).map(toGam));
function lum(h: string) {
  const [r, g, b] = hexToRgb(h).map(toLin) as V3;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
/** WCAG 2 contrast ratio between two colours. */
export function ratio(a: string, b: string) {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p) as [number, number];
  return (x + 0.05) / (y + 0.05);
}
/** Mix in OKLab: `t` of a, the rest b. */
export function mix(a: string, b: string, t: number) {
  const A = rgbToOklab(hexToRgb(a));
  const B = rgbToOklab(hexToRgb(b));
  return rgbToHex(oklabToLin(A.map((v, i) => v * t + B[i]! * (1 - t)) as V3).map(toGam));
}

/* ---------- the rule: the customer chooses the hue, the system chooses the lightness ---------- */
const AA = 4.6; // a little over 4.5, so values still pass after rounding
const NEAR_WHITE = "#fafafa";
const NEAR_BLACK = "#09090b";
function readableOn(brand: Lch, surfaces: string[], dir: "darker" | "lighter") {
  const ok = (l: number) => surfaces.every((s) => ratio(lchToHex({ ...brand, l }), s) >= AA);
  if (ok(brand.l)) return lchToHex(brand);
  let good = dir === "darker" ? 0 : 1;
  let bad = brand.l;
  for (let i = 0; i < 24; i++) {
    const mid = (good + bad) / 2;
    if (ok(mid)) good = mid;
    else bad = mid;
  }
  return lchToHex({ ...brand, l: good });
}
const pickOn = (fill: string) =>
  ratio(NEAR_WHITE, fill) >= AA || ratio(NEAR_WHITE, fill) >= ratio(NEAR_BLACK, fill) ? NEAR_WHITE : NEAR_BLACK;

export type Theme = Record<string, string>;

/** Every token a panel needs, for one colour, one mode and one rule (`passed`: the first version, colour as given). */
export function theme(hex: string, mode: Mode, rule: "derived" | "passed" = "derived"): Theme {
  const n = NEUTRAL[mode];
  const s = SCALES[mode];
  const dark = mode === "dark";
  const b = hexToLch(hex);
  const t: Theme = {
    "--bg": n.background,
    "--card": n.card,
    "--fg": n.foreground,
    "--muted": n.muted,
    "--muted-fg": n["muted-foreground"],
    "--border": n.border,
    "--input": n.border,
    "--input-bg": n.input,
    "--primary": hex,
  };
  if (rule === "derived") {
    const cont = lchToHex({ l: dark ? 0.2 : 0.97, c: Math.min(b.c, dark ? 0.05 : 0.03), h: b.h });
    Object.assign(t, {
      "--primary-fg": pickOn(hex),
      "--primary-text": readableOn(b, [n.background, n.card], dark ? "lighter" : "darker"),
      "--primary-container": cont,
      "--primary-container-fg": readableOn(b, [cont], dark ? "lighter" : "darker"),
      "--primary-border": lchToHex({ l: dark ? 0.32 : 0.82, c: Math.min(b.c, dark ? 0.07 : 0.11), h: b.h }),
    });
  } else {
    Object.assign(t, {
      "--primary-fg": NEAR_WHITE,
      "--primary-text": hex,
      "--primary-container": mix(hex, n.background, 0.18),
      "--primary-container-fg": hex,
      "--primary-border": mix(hex, n.border, 0.35),
    });
  }
  t["--ring"] = t["--primary-text"]!;
  const roles: Record<string, Hue> = { success: "green", warning: "amber", destructive: "red", info: "blue", categorical: "purple" };
  for (const [role, hue] of Object.entries(roles)) {
    t[`--${role}`] = s[hue]["500"];
    t[`--${role}-container`] = s[hue]["50"];
    t[`--${role}-container-fg`] = s[hue]["700"];
    t[`--${role}-border`] = s[hue]["200"];
    t[`--${role}-text`] = s[hue]["600"];
  }
  t["--destructive"] = s.red["600"];
  return t;
}

/* ---------- the page wears a brand: one colour in, the case file's palette out ---------- */
const INK = "#1c1b19";
const PAPER = "#fbfaf7";
const PAPER_D = "#1f1e1c";
const INSET_D = "#282624";
const pickPage = (f: string) => (ratio(NEAR_WHITE, f) >= AA ? NEAR_WHITE : INK);
const tone = (b: Lch, l: number, c: number) => lchToHex({ l, c: Math.min(b.c, c), h: b.h });
function secondOn(on: string, field: string) {
  for (const t of [0.74, 0.8, 0.86, 0.92]) {
    const m = mix(on, field, t);
    if (ratio(m, field) >= AA) return m;
  }
  return on;
}

/** The tint behind a row of choices on the field: as strong as it can be while text on it still passes. */
function pillOn(on: string, field: string) {
  for (const t of [0.1, 0.07, 0.05, 0.03]) {
    const m = mix(on, field, t);
    if (ratio(on, m) >= AA) return m;
  }
  return field;
}

/** The case file's palette tokens for one brand colour, light page and dark page. */
export function pagePalette(hex: string): { L: Theme; D: Theme } {
  const b = hexToLch(hex);
  const L: Theme = {};
  const D: Theme = {};
  L.field = hex;
  L["on-field"] = pickPage(hex);
  L["on-field-2"] = secondOn(L["on-field"], hex);
  L["ds-pill"] = pillOn(L["on-field"], hex);
  const pale = L["on-field"] === INK;
  L.accent = pale ? INK : readableOn(b, [PAPER, "#ffffff"], "darker");
  L["accent-strong"] = L.accent;
  L["on-accent"] = pale ? hex : pickOn(L.accent);
  L["ds-mark"] = hex;
  L["ds-mark-ink"] = pickPage(hex);
  L["accent-2"] = tone(b, 0.94, 0.05);
  L["accent-tint"] = tone(b, 0.975, 0.03);
  const dk = tone(b, 0.19, 0.016);
  Object.assign(L, {
    dark: dk,
    "on-dark": "#f5f3ee",
    "on-dark-body": "#d4d0c7",
    "on-dark-2": "#a29e95",
    "dark-rule": tone(b, 0.27, 0.016),
    "dark-line": tone(b, 0.42, 0.02),
    "dark-inset": tone(b, 0.23, 0.016),
  });
  L["accent-on-dark"] = ratio(hex, dk) >= AA ? hex : readableOn(b, [dk], "lighter");
  // dark page: fields deeper or lifted just enough to sit on the dark studio; text by the same rule
  const fd = b.l > 0.8 ? lchToHex({ ...b, l: 0.8 }) : b.l < 0.36 ? lchToHex({ ...b, l: 0.4 }) : hex;
  D.field = fd;
  D["on-field"] = pickPage(fd);
  D["on-field-2"] = secondOn(D["on-field"], fd);
  D["ds-pill"] = pillOn(D["on-field"], fd);
  D.accent = ratio(hex, PAPER_D) >= AA && ratio(hex, INSET_D) >= AA ? hex : readableOn(b, [PAPER_D, INSET_D], "lighter");
  D["accent-strong"] = D.accent;
  D["on-accent"] = pickOn(D.accent);
  D["ds-mark"] = D.accent;
  D["ds-mark-ink"] = pickPage(D.accent);
  D["accent-2"] = tone(b, 0.27, 0.04);
  D["accent-tint"] = tone(b, 0.25, 0.035);
  const dd = tone(b, 0.15, 0.014);
  Object.assign(D, { dark: dd, "dark-rule": tone(b, 0.23, 0.025), "dark-line": tone(b, 0.38, 0.03), "dark-inset": tone(b, 0.2, 0.025) });
  D["accent-on-dark"] = ratio(hex, dd) >= AA ? hex : readableOn(b, [dd], "lighter");
  return { L, D };
}

/** CSS custom properties from a token map, for a `style` prop. */
export function styleOf(t: Theme): React.CSSProperties {
  return t as unknown as React.CSSProperties;
}
