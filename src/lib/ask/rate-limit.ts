/**
 * Rate limiting behind a small interface so the in-memory version can be swapped
 * for a hosted store (Upstash Redis / Vercel KV) without touching callers. See README.
 *
 * In-memory limits are per server instance: good enough to stop casual abuse,
 * not a guarantee across serverless instances.
 */
export type LimitResult = { ok: boolean; remaining: number; retryAfterSec: number };

export interface RateLimiter {
  limit(key: string): Promise<LimitResult>;
}

type Clock = () => number;

/** Sliding-window log: at most `max` hits in any `windowMs`. */
export class MemorySlidingWindowLimiter implements RateLimiter {
  private hits = new Map<string, number[]>();
  constructor(
    private readonly opts: { max: number; windowMs: number; maxKeys?: number; now?: Clock },
  ) {}

  async limit(key: string): Promise<LimitResult> {
    const now = (this.opts.now ?? Date.now)();
    const from = now - this.opts.windowMs;
    const list = (this.hits.get(key) ?? []).filter((t) => t > from);
    if (list.length >= this.opts.max) {
      this.hits.set(key, list);
      const retryAfterSec = Math.max(1, Math.ceil((list[0]! + this.opts.windowMs - now) / 1000));
      return { ok: false, remaining: 0, retryAfterSec };
    }
    list.push(now);
    this.hits.delete(key); // re-insert to keep Map order = recency
    this.hits.set(key, list);
    this.evict();
    return { ok: true, remaining: this.opts.max - list.length, retryAfterSec: 0 };
  }

  private evict() {
    const maxKeys = this.opts.maxKeys ?? 10_000;
    while (this.hits.size > maxKeys) {
      const oldest = this.hits.keys().next().value;
      if (oldest === undefined) break;
      this.hits.delete(oldest);
    }
  }
}

/** Best-effort global daily budget for model calls. Resets at midnight UTC. */
export class DailyCap {
  private day = "";
  private used = 0;
  constructor(
    private readonly max: number,
    private readonly now: Clock = Date.now,
  ) {}

  take(): boolean {
    const today = new Date(this.now()).toISOString().slice(0, 10);
    if (today !== this.day) {
      this.day = today;
      this.used = 0;
    }
    if (this.used >= this.max) return false;
    this.used += 1;
    return true;
  }
}

function intFromEnv(name: string, fallback: number): number {
  const n = Number.parseInt(process.env[name] ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

/** Shared instances (module scope survives between requests on a warm instance). */
export const askLimiter: RateLimiter = new MemorySlidingWindowLimiter({
  max: intFromEnv("ASK_RATE_LIMIT", 12),
  windowMs: 60_000,
});
export const modelDailyCap = new DailyCap(intFromEnv("ASK_DAILY_CAP", 1500));

/** Best guess at the caller's IP. Used only as an in-memory key; never logged. */
export function clientKey(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return fwd || headers.get("x-real-ip") || "anonymous";
}
