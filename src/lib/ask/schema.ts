/**
 * Request/response contract for the ask feature.
 * Imported by the API route, the /ask page and the client, so it must stay free of server-only code.
 *
 * The visitor asks for what they need to see (a brief, a pasted job description, or topic keys);
 * the machine prints one sheet per project that shows it, each sheet being that project's best section.
 */
import { z } from "zod";
import { SIGNALS, type Signal } from "@content/schema";

/** Length of the home page's one-line input (legacy `question`). */
export const QUESTION_MAX = 300;
export const BRIEF_MAX = 4000;
export const ASKED_MAX = 6;
export const MAX_SHEETS = 5;
export const LINE_MAX = 90;
export const REASON_MAX = 90;
export const MISSING_MAX = 6;
export const MISSING_LABEL_MAX = 40;
/** Legacy fields, derived from the new ones. */
export const REPLY_MAX = 160;
export const MAX_PICKS = MAX_SHEETS;

export const SIGNAL_KEYS = Object.keys(SIGNALS) as [Signal, ...Signal[]];
/** The home page's skills cards each stand for one to three signals, and all eight may be chosen. */
export const TOPICS_MAX = SIGNAL_KEYS.length;

export const MATCHED_KEYS = ["start-here", ...SIGNAL_KEYS] as [Signal | "start-here", ...(Signal | "start-here")[]];
export type Matched = Signal | "start-here";

const RequestShape = z.object({
  brief: z.string().trim().max(BRIEF_MAX, `Keep it under ${BRIEF_MAX} characters.`).optional(),
  topics: z.array(z.enum(SIGNAL_KEYS)).max(TOPICS_MAX, `Pick at most ${TOPICS_MAX} topics.`).optional(),
});

/** The old home page sends `{ question }`; treat it as the brief. */
function mapLegacy(raw: unknown): unknown {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return raw;
  const { question, ...rest } = raw as Record<string, unknown>;
  if (rest.brief === undefined && typeof question === "string") return { ...rest, brief: question };
  return rest;
}

export const AskRequestSchema = z.preprocess(
  mapLegacy,
  RequestShape.transform(({ brief, topics }) => ({ brief: brief ?? "", topics: [...new Set(topics ?? [])] })).refine(
    (r) => r.brief.length > 0 || r.topics.length > 0,
    { message: "Tell me what you need to see first." },
  ),
);

export const SheetSchema = z.object({
  project: z.string().min(1),
  section: z.string().min(1),
  signal: z.enum(SIGNAL_KEYS),
  reason: z.string().min(1).max(REASON_MAX),
});

/** Legacy pick, kept so the current home page keeps working. */
export const PickSchema = z.object({
  project: z.string().min(1),
  section: z.string().min(1),
  reason: z.string().max(REASON_MAX),
});

export const AskResponseSchema = z
  .object({
    /** Capabilities understood, as signal keys, most important first. */
    asked: z.array(z.enum(SIGNAL_KEYS)).min(1).max(ASKED_MAX),
    /** One per project, best first. */
    sheets: z.array(SheetSchema).min(1).max(MAX_SHEETS),
    /** Plain labels of requested things no work shows. */
    missing: z.array(z.string().min(1).max(MISSING_LABEL_MAX)).max(MISSING_MAX),
    line: z.string().min(1).max(LINE_MAX),
    source: z.enum(["model", "fallback"]),
    // Legacy fields, derived from the ones above.
    reply: z.string().min(1).max(REPLY_MAX),
    picks: z.array(PickSchema).min(1).max(MAX_PICKS),
    matched: z.enum(MATCHED_KEYS),
  })
  .refine((r) => new Set(r.sheets.map((s) => s.project)).size === r.sheets.length, {
    message: "One sheet per project.",
    path: ["sheets"],
  });

export const AskErrorSchema = z.object({
  error: z.enum(["rate_limited", "invalid", "too_large", "server"]),
  message: z.string(),
  retryAfter: z.number().optional(),
});

export type AskRequest = z.output<typeof AskRequestSchema>;
export type Sheet = z.infer<typeof SheetSchema>;
export type Pick = z.infer<typeof PickSchema>;
export type AskResponse = z.infer<typeof AskResponseSchema>;
export type AskError = z.infer<typeof AskErrorSchema>;
/** The new fields only; `withLegacy` adds the old ones. */
export type AskCore = Omit<AskResponse, "reply" | "picks" | "matched">;

/** Derive the old `reply`, `picks` and `matched` fields from the new ones. */
export function withLegacy(core: AskCore, opts: { startHere?: boolean } = {}): AskResponse {
  return {
    ...core,
    reply: core.line,
    picks: core.sheets.map(({ project, section, reason }) => ({ project, section, reason })),
    matched: opts.startHere ? "start-here" : core.asked[0]!,
  };
}

export const RATE_LIMIT_MESSAGE =
  "The printer needs a moment to cool down. Try again in a minute, or browse the tray below.";
