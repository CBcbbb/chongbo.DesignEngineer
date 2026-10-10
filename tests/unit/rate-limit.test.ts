import { describe, expect, it } from "vitest";
import { clientKey, DailyCap, MemorySlidingWindowLimiter } from "@/lib/ask/rate-limit";

describe("MemorySlidingWindowLimiter", () => {
  it("allows max hits per window, then blocks with a retry time", async () => {
    let now = 0;
    const rl = new MemorySlidingWindowLimiter({ max: 3, windowMs: 60_000, now: () => now });
    for (let i = 0; i < 3; i++) expect((await rl.limit("a")).ok).toBe(true);
    const blocked = await rl.limit("a");
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfterSec).toBe(60);
    now = 30_000;
    expect((await rl.limit("a")).ok).toBe(false);
    expect((await rl.limit("b")).ok).toBe(true); // keys are independent
  });

  it("slides: frees capacity as old hits leave the window", async () => {
    let now = 0;
    const rl = new MemorySlidingWindowLimiter({ max: 2, windowMs: 1000, now: () => now });
    await rl.limit("a");
    now = 500;
    await rl.limit("a");
    now = 900;
    expect((await rl.limit("a")).ok).toBe(false);
    now = 1001;
    expect((await rl.limit("a")).ok).toBe(true);
  });

  it("evicts the oldest keys beyond maxKeys", async () => {
    const rl = new MemorySlidingWindowLimiter({ max: 1, windowMs: 60_000, maxKeys: 2 });
    await rl.limit("a");
    await rl.limit("b");
    await rl.limit("c");
    expect((await rl.limit("a")).ok).toBe(true); // "a" was evicted, so it starts fresh
  });
});

describe("DailyCap", () => {
  it("caps per UTC day and resets at midnight", () => {
    let now = Date.UTC(2026, 0, 1, 23, 0);
    const cap = new DailyCap(2, () => now);
    expect(cap.take()).toBe(true);
    expect(cap.take()).toBe(true);
    expect(cap.take()).toBe(false);
    now = Date.UTC(2026, 0, 2, 0, 1);
    expect(cap.take()).toBe(true);
  });
});

describe("clientKey", () => {
  it("uses the first forwarded address", () => {
    expect(clientKey(new Headers({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" }))).toBe("1.2.3.4");
    expect(clientKey(new Headers({ "x-real-ip": "9.9.9.9" }))).toBe("9.9.9.9");
    expect(clientKey(new Headers())).toBe("anonymous");
  });
});
