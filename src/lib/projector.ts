/**
 * The projector: the home page's wording and the small pieces of geometry it needs.
 * Shared by the home page client, the /ask page and the unit tests, so it stays free of server-only code.
 */
import type { Media } from "@content/schema";

/** What the machine says on its status line, in the order it happens. */
export const STATUS = {
  idle: "Insert a card",
  ready: "Ready to project",
  reading: "Reading your card…",
  finding: "Finding the work that answers it…",
} as const;

/** Errors are said by the machine, in its own words, and never leave the room dark. */
export const ERRORS = {
  rateLimited: "The lamp needs a minute to cool down. Try again shortly, or browse all work.",
  jammed: "The slide jammed. Try again, or browse all work.",
  offline: "The projector can't reach the slides. Check your connection and try again.",
} as const;

/** The blank card's hint. It disappears as soon as you write. */
export const BLANK_HINT = "…or paste a job description";

/** The card's text quoted beside the wall's heading, cut at 80 characters. */
export function quoteCard(text: string): string {
  const t = text.trim().replace(/\s+/g, " ");
  if (!t) return "";
  return `“${t.slice(0, 80)}${t.length > 80 ? "…" : ""}”`;
}

/**
 * Whether a section's evidence shows on a slide. Mirrors MediaSlot's compact rules: code, a project's own
 * interactive module and image groups stay in the full case file, so those slides are text slides.
 */
export function slideHasMedia(media: Media | undefined): boolean {
  if (!media) return false;
  return media.kind !== "code" && media.kind !== "module" && media.kind !== "group";
}

export type Point = { x: number; y: number };
export type Box = { left: number; top: number; right: number; bottom: number };

/**
 * The cone of light from the lens to the slide: the convex hull of the lens point and the slide's four corners
 * (monotone chain), so the beam meets the whole slide whichever side of it the machine sits.
 */
export function beamPolygon(lens: Point, slide: Box): Point[] {
  const pts: Point[] = [
    lens,
    { x: slide.left, y: slide.top },
    { x: slide.right, y: slide.top },
    { x: slide.right, y: slide.bottom },
    { x: slide.left, y: slide.bottom },
  ].sort((a, b) => a.x - b.x || a.y - b.y);
  const cross = (o: Point, a: Point, b: Point) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const lower: Point[] = [];
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2]!, lower[lower.length - 1]!, p) <= 0) lower.pop();
    lower.push(p);
  }
  const upper: Point[] = [];
  for (const p of [...pts].reverse()) {
    while (upper.length >= 2 && cross(upper[upper.length - 2]!, upper[upper.length - 1]!, p) <= 0) upper.pop();
    upper.push(p);
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}

/**
 * Pictures that could stand for a section on its story card, best first (the caller keeps the first that exists):
 * an image, a video's poster, the first side of a comparison, the first image of a group.
 */
export function thumbCandidates(media: Media | undefined): string[] {
  if (!media) return [];
  switch (media.kind) {
    case "image":
      return [media.asset];
    case "video":
      return media.poster ? [media.poster] : [];
    case "compare":
    case "toggle":
      return [media.a.asset, media.b.asset];
    case "group":
      return media.items.map((i) => i.asset);
    default:
      return [];
  }
}

/** The first sentence of a section's body: the excerpt on a story card without a picture. */
export function firstSentence(body: readonly string[]): string {
  const t = (body[0] ?? "").trim();
  const m = t.match(/^.+?[.!?](?=\s|$)/);
  return m ? m[0] : t;
}

/**
 * Where each story card stands in the carousel, relative to the one in the light (`rel` 0). Cards either side turn
 * towards it, shrink and dim, and anything two or more places away is out of the light. `drag` is a fraction of a
 * place, while a finger or the pointer is moving the row.
 */
export function storyPose(i: number, active: number, drag = 0) {
  const rel = i - active + drag;
  const d = Math.abs(rel);
  const near = Math.max(0, 1 - Math.min(d, 1));
  return {
    rel,
    scale: 0.8 + 0.2 * near,
    rotate: -26 * Math.max(-1, Math.min(1, rel)),
    opacity: d >= 2.2 ? 0 : Math.max(0, 1 - 0.45 * d),
    bright: 0.62 + 0.38 * near,
    z: Math.round(20 - d * 5),
  };
}

/** The beam photograph (public/projector/beam.webp, 1536 × 1024): where the light leaves the lens, where it lands. */
export const BEAM = { w: 1536, apex: { x: 229, y: 691 }, end: { x: 1500, y: 430 }, endWidth: 307 } as const;

/**
 * Places the beam photograph so its apex sits on the lens and its far end covers the target (a box on the wall):
 * returns the image's left, top and width, and a transform about the apex.
 */
export function beamPlacement(lens: Point, target: Point, targetHeight: number) {
  const bx = BEAM.end.x - BEAM.apex.x;
  const by = BEAM.end.y - BEAM.apex.y;
  const base = Math.hypot(bx, by);
  const a0 = Math.atan2(by, bx);
  const dist = Math.hypot(target.x - lens.x, target.y - lens.y);
  const s = dist / base;
  const phi = Math.atan2(target.y - lens.y, target.x - lens.x);
  const k = Math.max(0.6, Math.min(3.2, targetHeight / (BEAM.endWidth * s)));
  return {
    left: lens.x - BEAM.apex.x * s,
    top: lens.y - BEAM.apex.y * s,
    width: BEAM.w * s,
    origin: `${BEAM.apex.x * s}px ${BEAM.apex.y * s}px`,
    transform: `rotate(${phi}rad) scale(1, ${k}) rotate(${-a0}rad)`,
  };
}
