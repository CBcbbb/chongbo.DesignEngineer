import { SIGNALS, type Signal } from "@content";
import { findEntry } from "./catalogue";
import { MATCHED_KEYS, MAX_PICKS, REASON_MAX, REPLY_MAX, type Matched, type Pick } from "./schema";

type RawPick = { project?: unknown; section?: unknown; reason?: unknown };

function clip(text: string, max: number): string {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length <= max ? t : `${t.slice(0, max - 1).trimEnd()}…`;
}

/** Keep only picks that point at real cards, drop duplicates, cap at three, clip reasons. */
export function sanitizePicks(raw: unknown): Pick[] {
  if (!Array.isArray(raw)) return [];
  const out: Pick[] = [];
  const seen = new Set<string>();
  for (const item of raw as RawPick[]) {
    if (out.length >= MAX_PICKS) break;
    if (!item || typeof item.project !== "string" || typeof item.section !== "string") continue;
    const project = item.project.trim();
    const section = item.section.trim();
    const key = `${project}#${section}`;
    if (seen.has(key) || !findEntry(project, section)) continue;
    seen.add(key);
    const reason = typeof item.reason === "string" && item.reason.trim() ? clip(item.reason, REASON_MAX) : "";
    out.push({ project, section, reason: reason || "Answers your question." });
  }
  return out;
}

export function sanitizeMatched(raw: unknown, firstPick: Pick): Matched {
  if (typeof raw === "string" && (MATCHED_KEYS as string[]).includes(raw)) return raw as Matched;
  const entry = findEntry(firstPick.project, firstPick.section);
  const sig = entry?.section.signals[0];
  return sig && sig in SIGNALS ? (sig as Signal) : "start-here";
}

/** A usable reply is one sentence-ish of plain text within the length limit. */
export function sanitizeReply(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const text = raw.replace(/\s+/g, " ").trim();
  if (!text || text.length > REPLY_MAX) return null;
  if (/[<>]|https?:\/\//i.test(text)) return null;
  return text;
}
