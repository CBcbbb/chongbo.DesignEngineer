import "server-only";
import { fallbackAnswer } from "./fallback";
import { askModel } from "./model";
import { modelDailyCap } from "./rate-limit";
import type { AskResponse } from "./schema";

/** Shared by POST /api/ask and the /ask page. Model first when configured, keyword fallback otherwise. */
export async function answerQuestion(question: string): Promise<AskResponse> {
  if (process.env.ANTHROPIC_API_KEY && modelDailyCap.take()) {
    const result = await askModel(question);
    if (result) return result;
  }
  return fallbackAnswer(question);
}
