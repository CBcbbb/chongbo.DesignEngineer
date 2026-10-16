import type { PostHog } from "posthog-js";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { setAnalytics, track, whenAnalyticsReady } from "@/lib/analytics";

beforeEach(() => vi.stubGlobal("window", new EventTarget()));
afterEach(() => vi.unstubAllGlobals());

it("sends server-rendered results once analytics finishes loading, with no repeated callbacks", () => {
  const capture = vi.fn();
  const stop = whenAnalyticsReady(() => track("printed", { cards: ["nike-athletes-closet#graphic-system"] }));
  expect(capture).not.toHaveBeenCalled();
  setAnalytics({ capture } as unknown as PostHog);
  setAnalytics({ capture } as unknown as PostHog);
  expect(capture).toHaveBeenCalledExactlyOnceWith("printed", { cards: ["nike-athletes-closet#graphic-system"] });
  stop();
});

it("runs immediately when already loaded and cancels callbacks for pages left before loading", () => {
  const cancelled = vi.fn();
  whenAnalyticsReady(cancelled)();
  setAnalytics({ capture: vi.fn() } as unknown as PostHog);
  expect(cancelled).not.toHaveBeenCalled();
  const ready = vi.fn();
  whenAnalyticsReady(ready);
  expect(ready).toHaveBeenCalledOnce();
});
