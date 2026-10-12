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
export const BLANK_HINT = "Write your own question, or paste a job description.";

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
