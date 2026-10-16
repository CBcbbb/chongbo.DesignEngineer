"use client";

import { useEffect } from "react";
import { track, whenAnalyticsReady } from "@/lib/analytics";

/** The server-rendered /ask list uses the same event names as the home-page printer. No brief text is passed. */
export function AskAnalytics({ cards, asked, source, briefChars, startHere }: {
  cards: string[];
  asked: string[];
  source: string;
  briefChars: number;
  startHere: boolean;
}) {
  useEffect(() => {
    const stopReady = whenAnalyticsReady(() => track("printed", {
      cards, asked, source, brief_chars: briefChars, start_here: startHere, ok: true, from: "/ask",
    }));
    if (typeof IntersectionObserver === "undefined") return stopReady;

    const visible = new Set<string>();
    const since = new Map<string, number>();
    const send = (card: string) => {
      const started = since.get(card);
      since.delete(card);
      if (started === undefined) return;
      const ms = performance.now() - started;
      if (ms >= 1500) track("sheet_viewed", {
        card, index: cards.indexOf(card) + 1, of: cards.length, seconds: Math.round(ms / 100) / 10, from: "/ask",
      });
    };
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const card = (entry.target as HTMLElement).dataset.sheet;
        if (!card) continue;
        // A tall sheet on a phone cannot show half its height: half a viewport also counts.
        const enoughHeight = Math.min(entry.boundingClientRect.height, window.innerHeight) * 0.5;
        if (entry.isIntersecting && entry.intersectionRect.height >= enoughHeight) {
          visible.add(card);
          if (document.visibilityState === "visible" && !since.has(card)) since.set(card, performance.now());
        } else {
          visible.delete(card);
          send(card);
        }
      }
    }, { threshold: Array.from({ length: 21 }, (_, i) => i / 20) });
    document.querySelectorAll<HTMLElement>(".sheet-list [data-sheet]").forEach((el) => observer.observe(el));
    const visibility = () => {
      if (document.visibilityState === "hidden") [...since.keys()].forEach(send);
      else for (const card of visible) since.set(card, performance.now());
    };
    const leave = () => [...since.keys()].forEach(send);
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("pagehide", leave);
    return () => {
      stopReady();
      leave();
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("pagehide", leave);
    };
  }, [cards, asked, source, briefChars, startHere]);
  return null;
}
