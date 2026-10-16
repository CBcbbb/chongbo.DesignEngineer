"use client";

import { useEffect, useRef } from "react";
import { analyticsContext, beginAnalyticsRequest, track } from "@/lib/analytics";
import { observeVisibleTime } from "@/lib/visible-time";

/** Opening a shared result is distinguishable from submitting a new question to the home printer. */
export function AskAnalytics({ cards, asked, source, brief, topics, startHere }: {
  cards: string[];
  asked: string[];
  source: string;
  brief: string;
  topics: string[];
  startHere: boolean;
}) {
  const request = useRef<{ signature: string; id: string } | null>(null);
  useEffect(() => {
    const signature = JSON.stringify([cards, asked, source, brief, topics, startHere]);
    if (request.current?.signature !== signature) {
      const id = beginAnalyticsRequest();
      request.current = { signature, id };
      track("request_opened", { request_id: id, brief, brief_chars: brief.length, topics, input_origin: "url" });
      track("printed", {
        request_id: id, cards, asked, source, brief_chars: brief.length, start_here: startHere,
        ok: true, from: "/ask", input_origin: "url",
      });
    }
    const context = { ...analyticsContext(), request_id: request.current.id, from: "/ask" };
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".sheet-list [data-sheet]"));
    return observeVisibleTime(elements, (element, seconds) => {
      const card = element.dataset.sheet!;
      track("sheet_viewed", { ...context, card, index: cards.indexOf(card) + 1, of: cards.length, seconds });
    });
  }, [cards, asked, source, brief, topics, startHere]);
  return null;
}
