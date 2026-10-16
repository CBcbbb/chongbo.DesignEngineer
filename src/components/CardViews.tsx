"use client";

import { useEffect } from "react";
import { analyticsContext, track } from "@/lib/analytics";
import { observeVisibleTime } from "@/lib/visible-time";

/** Flush each visible interval on scroll, navigation or tab hiding, and resume on return. */
export function CardViews({ project }: { project: string }) {
  useEffect(() => {
    const context = { ...analyticsContext(), from: window.location.pathname };
    const elements = Array.from(document.querySelectorAll<HTMLElement>("main [data-card]"));
    return observeVisibleTime(elements, (element, seconds) => {
      track("case_card_viewed", { ...context, card: `${project}#${element.dataset.card}`, seconds });
    });
  }, [project]);
  return null;
}
