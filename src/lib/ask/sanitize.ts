import { SIGNALS, type Signal } from "@content";
import { findEntry } from "./catalogue";
import { ASKED_MAX, MISSING_LABEL_MAX, MISSING_MAX, RANKED_MAX, REASON_MAX, type Sheet } from "./schema";

type RawSheet = { project?: unknown; section?: unknown; signal?: unknown; reason?: unknown };

function clip(text: string, max: number): string {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length <= max ? t : `${t.slice(0, max - 1).trimEnd()}…`;
}

const isSignal = (v: unknown): v is Signal => typeof v === "string" && Object.hasOwn(SIGNALS, v);
const hasMarkup = (t: string) => /[<>]|https?:\/\/|www\./i.test(t);

/** Known signal keys only, no duplicates, at most six, order kept. */
export function sanitizeAsked(raw: unknown): Signal[] {
  if (!Array.isArray(raw)) return [];
  const out: Signal[] = [];
  for (const item of raw as unknown[]) {
    const key = typeof item === "string" ? item.trim() : item;
    if (isSignal(key) && !out.includes(key)) out.push(key);
    if (out.length >= ASKED_MAX) break;
  }
  return out;
}

/**
 * Keep only sheets that point at real sections, each card once (the first wins), in order, at most ten.
 * Several cards from one project are fine; arrange() decides the deck.
 * A sheet's signal must be one its section carries and, when capabilities were asked for, one of them; otherwise it
 * is repaired from the asked list, and a card that carries none of them is dropped.
 */
export function sanitizeSheets(raw: unknown, asked: Signal[] = []): Sheet[] {
  if (!Array.isArray(raw)) return [];
  const out: Sheet[] = [];
  const seen = new Set<string>();
  for (const item of raw as RawSheet[]) {
    if (out.length >= RANKED_MAX) break;
    if (!item || typeof item.project !== "string" || typeof item.section !== "string") continue;
    const project = item.project.trim();
    const section = item.section.trim();
    const entry = findEntry(project, section);
    if (!entry || seen.has(`${project}#${section}`)) continue;
    const signals = entry.section.signals;
    const given = typeof item.signal === "string" ? item.signal.trim() : "";
    // A card prints for a capability only if its own tags carry it: the tags are Chongbo's claims, the model only ranks.
    const fits = (s: Signal) => !asked.length || asked.includes(s);
    const signal = isSignal(given) && signals.includes(given) && fits(given) ? given : (signals.find((s) => asked.includes(s)) ?? (asked.length ? undefined : signals[0]));
    if (!signal) continue;
    seen.add(`${project}#${section}`);
    const reason = typeof item.reason === "string" && item.reason.trim() && !hasMarkup(item.reason) ? clip(item.reason, REASON_MAX) : "";
    out.push({ project, section, signal, reason: reason || clip(`${SIGNALS[signal]}: ${entry.section.title}.`, REASON_MAX) });
  }
  return out;
}

/** Short plain labels, no markup, no duplicates (ignoring case), at most six. */
export function sanitizeMissing(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const item of raw) {
    if (typeof item !== "string") continue;
    const label = item.replace(/\s+/g, " ").trim().replace(/[.;,]+$/, "");
    if (!label || label.length > MISSING_LABEL_MAX || hasMarkup(label)) continue;
    const key = label.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(label);
    if (out.length >= MISSING_MAX) break;
  }
  return out;
}
