import "server-only";
import { fallbackAnswer } from "./fallback";
import { askModel } from "./model";
import { modelDailyCap } from "./rate-limit";
import type { AskRequest, AskResponse } from "./schema";

/**
 * Shared by POST /api/ask and the /ask page.
 * A brief goes to the model first when configured. Topics alone need no reading, so they are
 * answered deterministically. The fallback answers the rest. Both print through arrange() (count, spread, six).
 */
export async function answerAsk(req: AskRequest): Promise<AskResponse> {
  if (req.brief && process.env.ANTHROPIC_API_KEY && modelDailyCap.take()) {
    const result = await askModel(req);
    if (result) return result;
  }
  return fallbackAnswer(req);
}
