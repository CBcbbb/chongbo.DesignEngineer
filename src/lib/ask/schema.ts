/**
 * Request/response contract for the ask feature.
 * Imported by the API route, the /ask page and the client, so it must stay free of server-only code.
 */
import { z } from "zod";
import { SIGNALS, type Signal } from "@content/schema";

export const QUESTION_MAX = 300;
export const REPLY_MAX = 160;
export const REASON_MAX = 90;
export const MAX_PICKS = 3;

export const MATCHED_KEYS = ["start-here", ...(Object.keys(SIGNALS) as Signal[])] as [
  Signal | "start-here",
  ...(Signal | "start-here")[],
];
export type Matched = Signal | "start-here";

export const AskRequestSchema = z.object({
  question: z
    .string()
    .trim()
    .min(1, "Ask a question first.")
    .max(QUESTION_MAX, `Keep it under ${QUESTION_MAX} characters.`),
});

export const PickSchema = z.object({
  project: z.string().min(1),
  section: z.string().min(1),
  reason: z.string().max(REASON_MAX),
});

export const AskResponseSchema = z.object({
  reply: z.string().min(1).max(REPLY_MAX),
  picks: z.array(PickSchema).min(1).max(MAX_PICKS),
  matched: z.enum(MATCHED_KEYS),
  source: z.enum(["model", "fallback"]),
});

export const AskErrorSchema = z.object({
  error: z.enum(["rate_limited", "invalid", "too_large", "server"]),
  message: z.string(),
  retryAfter: z.number().optional(),
});

export type AskRequest = z.infer<typeof AskRequestSchema>;
export type Pick = z.infer<typeof PickSchema>;
export type AskResponse = z.infer<typeof AskResponseSchema>;
export type AskError = z.infer<typeof AskErrorSchema>;

export const RATE_LIMIT_MESSAGE =
  "The printer needs a moment to cool down. Try again in a minute, or browse the tray below.";
