import { NextResponse } from "next/server";
import { answerQuestion } from "@/lib/ask/answer";
import { askLimiter, clientKey } from "@/lib/ask/rate-limit";
import { AskRequestSchema, RATE_LIMIT_MESSAGE, type AskError } from "@/lib/ask/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 4096;
const noStore = { "Cache-Control": "no-store" };

function error(status: number, body: AskError, headers: Record<string, string> = {}) {
  return NextResponse.json(body, { status, headers: { ...noStore, ...headers } });
}

export async function POST(request: Request) {
  const limit = await askLimiter.limit(clientKey(request.headers));
  if (!limit.ok) {
    return error(
      429,
      { error: "rate_limited", message: RATE_LIMIT_MESSAGE, retryAfter: limit.retryAfterSec },
      { "Retry-After": String(limit.retryAfterSec) },
    );
  }

  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_BODY_BYTES) {
    return error(413, { error: "too_large", message: "That question is too long." });
  }

  let body: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) return error(413, { error: "too_large", message: "That question is too long." });
    body = JSON.parse(text);
  } catch {
    return error(400, { error: "invalid", message: "Send JSON like {\"question\": \"...\"}." });
  }

  const parsed = AskRequestSchema.safeParse(body);
  if (!parsed.success) {
    return error(400, { error: "invalid", message: parsed.error.issues[0]?.message ?? "Ask a question first." });
  }

  try {
    const result = await answerQuestion(parsed.data.question);
    return NextResponse.json(result, { headers: noStore });
  } catch {
    return error(500, { error: "server", message: "Something jammed. Try again, or browse the tray below." });
  }
}
