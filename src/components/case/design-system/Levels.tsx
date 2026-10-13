"use client";

// the project's styles and the invented customers' faces, wherever its evidence is shown (case file or printed sheet)
import "@fontsource-variable/archivo";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/ibm-plex-sans";
import "@fontsource-variable/inter";
import "./design-system.css";

import { useMemo } from "react";
import { useSeenAs } from "./store";
import { mix } from "./tokens";

/*
 * 01.3: an exploded build, like a model kit. A base plate (the shared package); three products lifted off it, each
 * sitting on a different part of it and overhanging its edge by one stud, because each adds parts of its own (hatched);
 * two clients lifted off each product, and users above them, always inside their product. Dashed outlines are seats,
 * dashed lines drop each part back into place. The client the case file is "seen as" is drawn solid.
 * Drawn as a string: every value is generated here, nothing comes from the reader.
 */

const C30 = 0.866;
const S30 = 0.5;
const OX = 250;
const OY = 326;
type Pt = [number, number];
type Rect = [number, number, number, number];
const P = (x: number, y: number, z: number): Pt => [OX + (x - y) * C30, OY + (x + y) * S30 - z];
const f1 = (n: number) => n.toFixed(1);
const pts = (a: Pt[]) => a.map(([x, y]) => `${f1(x)},${f1(y)}`).join(" ");
const shade = (hex: string, t: number) => mix("#000000", hex, t);
const box = (x0: number, y0: number, x1: number, y1: number, z: number, h: number, cls: string, col?: string) => {
  const f = col ? `style="--t:${col};--l:${shade(col, 0.16)};--r:${shade(col, 0.32)}"` : "";
  return `<g class="ob ${cls}" ${f}>
    <polygon class="r" points="${pts([P(x1, y0, z), P(x1, y1, z), P(x1, y1, z - h), P(x1, y0, z - h)])}"/>
    <polygon class="l" points="${pts([P(x0, y1, z), P(x1, y1, z), P(x1, y1, z - h), P(x0, y1, z - h)])}"/>
    <polygon class="t" points="${pts([P(x0, y0, z), P(x1, y0, z), P(x1, y1, z), P(x0, y1, z)])}"/></g>`;
};
const quad = (x0: number, y0: number, x1: number, y1: number, z: number) => pts([P(x0, y0, z), P(x1, y0, z), P(x1, y1, z), P(x0, y1, z)]);
const RX = 1.2247;
const RY = 0.7071;
const stud = (x: number, y: number, z: number, r: number, h: number, cls = "", style = "") => {
  const [X, Y] = P(x, y, z);
  const Yt = Y - h;
  return `<g class="os ${cls}" ${style}><path class="s" d="M${f1(X - r * RX)} ${f1(Y)} A${f1(r * RX)} ${f1(r * RY)} 0 0 0 ${f1(X + r * RX)} ${f1(Y)} L${f1(X + r * RX)} ${f1(Yt)} L${f1(X - r * RX)} ${f1(Yt)} Z"/><ellipse class="c" cx="${f1(X)}" cy="${f1(Yt)}" rx="${f1(r * RX)}" ry="${f1(r * RY)}"/></g>`;
};
const studs = (x0: number, y0: number, x1: number, y1: number, z: number, step: number, r: number, h: number, cls: string) => {
  const out: Pt[] = [];
  const nx = Math.round((x1 - x0) / step);
  const ny = Math.round((y1 - y0) / step);
  const sx = (x1 - x0) / nx;
  const sy = (y1 - y0) / ny;
  for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) out.push([x0 + sx * (i + 0.5), y0 + sy * (j + 0.5)]);
  out.sort((a, b) => a[0] + a[1] - (b[0] + b[1]));
  return out.map(([x, y]) => stud(x, y, z, r, h, cls)).join("");
};
const seat = (r: Rect, z: number, on: boolean) => `<polygon class="seat${on ? " is-on" : ""}" points="${quad(...r, z)}"/>`;
const line = (a: Pt, b: Pt, cls: string, style = "") =>
  `<line class="${cls}" ${style ? `style="${style}"` : ""} x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(b[0])}" y2="${f1(b[1])}"/>`;
const guides = ([x0, y0, x1, y1]: Rect, zFrom: number, zTo: number, on: boolean, col?: string) =>
  ([[x1, y0], [x1, y1], [x0, y1]] as Pt[]).map(([x, y]) => line(P(x, y, zFrom), P(x, y, zTo), `guide${on ? " is-on" : ""}`, on && col ? `stroke:${col}` : "")).join("");

/* users as chess pieces: each keeps the client's brand and changes one thing of its own */
const ell = (X: number, Y: number, r: number, cls: string) => `<ellipse class="${cls}" cx="${f1(X)}" cy="${f1(Y)}" rx="${f1(r * RX)}" ry="${f1(r * RY)}"/>`;
const frustum = (X: number, Yb: number, r1: number, Yt: number, r2: number, cls: string) =>
  `<path class="${cls}" d="M${f1(X - r1 * RX)} ${f1(Yb)} A${f1(r1 * RX)} ${f1(r1 * RY)} 0 0 0 ${f1(X + r1 * RX)} ${f1(Yb)} L${f1(X + r2 * RX)} ${f1(Yt)} A${f1(r2 * RX)} ${f1(r2 * RY)} 0 0 1 ${f1(X - r2 * RX)} ${f1(Yt)} Z"/>${ell(X, Yt, r2, cls)}`;
type PieceKind = "pawn" | "rook" | "bishop";
const piece = (kind: PieceKind, x: number, y: number, z: number, tone: string) => {
  const [X, Y] = P(x, y, z);
  let s =
    `<g class="pc ${tone}" transform="translate(${f1(X)} ${f1(Y)}) scale(1.3) translate(${f1(-X)} ${f1(-Y)})">` +
    frustum(X, Y, 7.2, Y - 3.2, 7.2, "pc-b") +
    frustum(X, Y - 3.2, 6.2, Y - 5, 5.6, "pc-b");
  if (kind === "pawn") {
    s += frustum(X, Y - 5, 4.8, Y - 16, 2.6, "pc-b") + frustum(X, Y - 16, 4.2, Y - 17.8, 4.2, "pc-a") + `<circle class="pc-a" cx="${f1(X)}" cy="${f1(Y - 22.6)}" r="5.4"/>`;
  } else if (kind === "rook") {
    s += frustum(X, Y - 5, 5.2, Y - 19, 4.4, "pc-b") + frustum(X, Y - 19, 6.4, Y - 25, 6.4, "pc-a") + ell(X, Y - 25, 4.2, "pc-in");
    [-0.55, 0.55].forEach((t) => {
      s += `<rect class="pc-notch" x="${f1(X + t * 6.4 * RX - 1.4)}" y="${f1(Y - 25 + Math.sqrt(1 - t * t) * 6.4 * RY - 0.5)}" width="2.8" height="3.4"/>`;
    });
  } else {
    s += frustum(X, Y - 5, 4.6, Y - 17, 2.2, "pc-b") + frustum(X, Y - 17, 3.8, Y - 18.6, 3.8, "pc-a") + `<ellipse class="pc-a" cx="${f1(X)}" cy="${f1(Y - 25.4)}" rx="5" ry="7.4"/>`;
    s += `<line class="pc-slit" x1="${f1(X - 1)}" y1="${f1(Y - 28.6)}" x2="${f1(X + 3.6)}" y2="${f1(Y - 24.2)}"/><circle class="pc-a" cx="${f1(X)}" cy="${f1(Y - 34.4)}" r="1.9"/>`;
  }
  return s + `</g>`;
};

/* plan, on one stud grid (U = one stud): a 13 × 5 base plate; three 3 × 3 products, each on a different part of it and
   overhanging a different edge by exactly one stud; clients are 1 × 3 bricks on a product's outer columns */
const U = 30;
const BASE: Rect = [0, 0, 13 * U, 5 * U];
const PRODS = ([[-1, 2], [6, 3], [11, 1]] as Pt[]).map(([ax, ay]) => ({ r: [ax * U, ay * U, (ax + 3) * U, (ay + 3) * U] as Rect }));
type Client = { id: string; name: string; colour: string; product: number; col: number; user?: PieceKind };
const CLIENTS: Client[] = [
  { id: "courier", name: "Courier", colour: "#f2c94c", product: 0, col: 0, user: "pawn" },
  { id: "grocer", name: "Grocer", colour: "#3a9a4a", product: 0, col: 2 },
  { id: "bank", name: "Bank", colour: "#3651b0", product: 1, col: 0, user: "rook" },
  { id: "florist", name: "Florist", colour: "#e85d9a", product: 1, col: 2 },
  { id: "bakery", name: "Bakery", colour: "#d06a33", product: 2, col: 0 },
  { id: "studio", name: "Studio", colour: "#8a68f5", product: 2, col: 2, user: "bishop" },
];
const CX = U / 2;
const CY = 1.5 * U;
const Z = { base: 0, product: 105, client: 180, user: 292 };
const T = { base: 12, product: 10, client: 18 };
const cliC = (k: Client): Pt => {
  const r = PRODS[k.product]!.r;
  return [r[0] + (k.col + 0.5) * U, r[1] + 1.5 * U];
};
const USERS = [-U, 0, U];
const TONE: Record<PieceKind, string> = { pawn: "is-brand", rook: "is-dark", bishop: "is-own" };
const ORDER = [0, 1, 2].sort((a, b) => PRODS[a]!.r[0] + PRODS[a]!.r[1] - (PRODS[b]!.r[0] + PRODS[b]!.r[1]));
/** The part of a product past the base's edge: what it adds on its own. */
const own = ([x0, y0, x1, y1]: Rect): Rect[] => {
  const [bx0, by0, bx1, by1] = BASE;
  const out: Rect[] = [];
  if (x0 < bx0) out.push([x0, y0, bx0, y1]);
  if (x1 > bx1) out.push([bx1, y0, x1, y1]);
  const ax0 = Math.max(x0, bx0);
  const ax1 = Math.min(x1, bx1);
  if (y0 < by0) out.push([ax0, y0, ax1, by0]);
  if (y1 > by1) out.push([ax0, by1, ax1, y1]);
  return out;
};

function draw(activeId: string) {
  const act = CLIENTS.find((k) => k.id === activeId);
  const aP = act ? act.product : 0;
  let g = `<defs><pattern id="ov-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)"><line class="hx-l" x1="0" y1="0" x2="0" y2="5"/></pattern>
    <filter id="ov-blur" x="-10%" y="-10%" width="120%" height="140%"><feGaussianBlur stdDeviation="8"/></filter></defs>`;
  const [bx0, by0, bx1, by1] = BASE;
  g += `<polygon class="o-shadow" filter="url(#ov-blur)" points="${pts(([P(bx0, by0, -T.base), P(bx1, by0, -T.base), P(bx1, by1, -T.base), P(bx0, by1, -T.base)] as Pt[]).map(([x, y]) => [x + 4, y + 12] as Pt))}"/>`;
  g += box(bx0, by0, bx1, by1, Z.base, T.base, `o-base${act ? "" : " is-on"}`);
  g += studs(bx0, by0, bx1, by1, Z.base, U, 5.6, 3, "on-base");
  ORDER.forEach((p) => {
    g += seat(PRODS[p]!.r, Z.base, p === aP);
  });
  ORDER.forEach((p) => {
    const on = p === aP;
    const R = PRODS[p]!.r;
    g += guides(R, Z.product - T.product, Z.base, on);
    g += box(...R, Z.product, T.product, `o-prod${on ? " is-on" : ""}`);
    g += own(R)
      .map((r) => `<polygon class="o-own-t" points="${quad(...r, Z.product)}"/><polygon class="o-own" points="${quad(...r, Z.product)}"/>`)
      .join("");
    const ks = CLIENTS.filter((k) => k.product === p).sort((a, b) => cliC(a)[0] + cliC(a)[1] - (cliC(b)[0] + cliC(b)[1]));
    ks.forEach((k) => {
      const [cx, cy] = cliC(k);
      g += seat([cx - CX, cy - CY, cx + CX, cy + CY], Z.product, k === act);
    });
    g += studs(...R, Z.product, U, 5, 2.6, "on-prod");
    ks.forEach((k) => {
      const [cx, cy] = cliC(k);
      const kon = k === act;
      g += guides([cx - CX, cy - CY, cx + CX, cy + CY], Z.client - T.client, Z.product, kon, k.colour);
      g += box(cx - CX, cy - CY, cx + CX, cy + CY, Z.client, T.client, `o-cli${kon ? " is-on" : ""}`, k.colour);
      USERS.forEach((dy) => {
        g += stud(cx, cy + dy, Z.client, 5, 3, "on-cli", `style="--t:${k.colour};--l:${shade(k.colour, 0.22)}"`);
      });
      const mine = "#1c9a92"; // the bishop's user picked a colour of their own
      USERS.forEach((dy, i) => {
        const isPiece = !!k.user && i === 1;
        const gs = `guide${kon ? " is-on" : isPiece ? "" : " is-user"}`;
        g += line(P(cx, cy + dy, Z.client + 3), P(cx, cy + dy, isPiece ? Z.user : Z.user - 4), gs, kon ? `stroke:${k.colour}` : "");
        g +=
          isPiece && k.user
            ? `<g style="--brand:${k.colour};--own:${mine}">${piece(k.user, cx, cy + dy, Z.user, TONE[k.user])}</g>`
            : stud(cx, cy + dy, Z.user - 4, 5, 4, `o-user${kon ? " is-on" : ""}`);
      });
    });
  });
  if (act) {
    const [x, y] = cliC(act);
    const [X, Y] = P(x - CX, y + CY, Z.client - T.client / 2);
    g += line([X - 4, Y], [X - 24, Y], "o-leader") + `<circle class="o-tick" cx="${f1(X - 4)}" cy="${f1(Y)}" r="2"/><text class="o-callname" x="${f1(X - 30)}" y="${f1(Y + 5)}" text-anchor="end">${act.name}</text>`;
  }
  // callouts, numbered, to a legend on the right; anchored on the right-hand product. Its type is set so it reads at
  // 13px or more where the drawing is about 750px wide (playbook §6), so the legend starts a little further left
  const LX = 676;
  const kR = cliC(CLIENTS[5]!);
  const pr = PRODS[2]!.r;
  const [ux, uy] = P(kR[0], kR[1] - U, Z.user - 4);
  const rows: [number, string, string, Pt][] = [
    [4, "Users", "their own look", [ux + 8, uy - 4]],
    [3, "Clients", "colour, font, button shape", P(kR[0] + CX, kR[1] - CY, Z.client - T.client / 2)],
    [2, "Products", "its own parts, hatched", P(pr[2], pr[1], Z.product - T.product / 2)],
    [1, "Shared package", "sets every token", P(bx1, by1 - U / 2, -T.base / 2)],
  ];
  rows.forEach(([n, t, s2, [ax, ay]]) => {
    g += line([ax + 4, ay], [LX - 27, ay], "o-leader") + `<circle class="o-tick" cx="${f1(ax + 4)}" cy="${f1(ay)}" r="2.2"/>`;
    g += `<circle class="o-num" cx="${LX - 13}" cy="${f1(ay)}" r="13"/><text class="o-numt" x="${LX - 13}" y="${f1(ay + 5.5)}" text-anchor="middle">${n}</text>`;
    g += `<text class="o-ln" x="${LX + 9}" y="${f1(ay - 3)}">${t}</text><text class="o-ls" x="${LX + 9}" y="${f1(ay + 17)}">${s2}</text>`;
  });
  return g;
}

export function Levels() {
  const { customer } = useSeenAs();
  const svg = useMemo(() => draw(customer.id), [customer.id]);
  return (
    <div className="ds-layers2" tabIndex={0} role="region" aria-label="The levels, as a diagram">
      <svg
        viewBox="0 0 954 626"
        role="img"
        aria-label="An exploded build. A long base plate, the shared package; three products lifted above it, each on a different part of the plate and overhanging its edge a little; two clients above each product and users above each client, inside their product. Each level overrides only what it needs."
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}
