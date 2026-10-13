"use client";

import { useEffect } from "react";
import { analyticsKey, track } from "@/lib/analytics";

/** A card counts as read once at least half of it has been on screen for this long. */
const MIN_MS = 1500;

/**
 * Case pages: how long each card is read (half or more of it on screen), sent as `case_card_viewed` when it leaves
 * the screen or the page is hidden. Does nothing without an analytics key.
 */
export function CardViews({ project }: { project: string }) {
  useEffect(() => {
    if (!analyticsKey() || typeof IntersectionObserver === "undefined") return;
    const since = new Map<string, number>();
    const send = (id: string) => {
      const t = since.get(id);
      since.delete(id);
      if (t === undefined) return;
      const ms = performance.now() - t;
      if (ms >= MIN_MS) track("case_card_viewed", { card: `${project}#${id}`, seconds: Math.round(ms / 100) / 10 });
    };
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = (e.target as HTMLElement).dataset.card;
          if (!id) continue;
          if (e.isIntersecting) since.set(id, performance.now());
          else send(id);
        }
      },
      { threshold: 0.5 },
    );
    document.querySelectorAll("main [data-card]").forEach((el) => io.observe(el));
    const flush = () => {
      if (document.visibilityState === "hidden") [...since.keys()].forEach(send);
    };
    document.addEventListener("visibilitychange", flush);
    return () => {
      [...since.keys()].forEach(send);
      io.disconnect();
      document.removeEventListener("visibilitychange", flush);
    };
  }, [project]);
  return null;
}
