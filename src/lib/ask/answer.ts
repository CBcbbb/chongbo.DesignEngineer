import "server-only";
import { requestedCount } from "./count";
import { fallbackAnswer, lineFor } from "./fallback";
import { askModel } from "./model";
import { modelDailyCap } from "./rate-limit";
import { withLegacy, type AskRequest, type AskResponse } from "./schema";

/**
 * Shared by POST /api/ask and the /ask page.
 * A brief goes to the model first when configured. Topics alone need no reading, so they are
 * answered deterministically (exactly the projects that show each topic). The fallback answers the rest.
 */
export async function answerAsk(req: AskRequest): Promise<AskResponse> {
  if (req.brief && process.env.ANTHROPIC_API_KEY && modelDailyCap.take()) {
    const result = await askModel(req);
    if (result) return limitTo(result, req.brief);
  }
  return limitTo(fallbackAnswer(req), req.brief);
}

/** A visitor who asks for a number of projects gets that many (the strongest), and a line that counts them. */
function limitTo(res: AskResponse, brief: string): AskResponse {
  const n = requestedCount(brief);
  if (!n || res.sheets.length <= n) return res;
  const sheets = res.sheets.slice(0, n);
  return withLegacy({ asked: res.asked, sheets, missing: res.missing, line: lineFor(res.asked, sheets, res.missing), source: res.source });
}
