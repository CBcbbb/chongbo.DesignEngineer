"use client";

import { useEffect, useRef } from "react";

/**
 * Touch screens have no hover, so a cover's motion plays once as its host (the nearest `[data-play-host]`) comes
 * into view: the host gets `is-play` for a moment. Nothing happens with a pointer that hovers, or with reduced motion.
 */
export function PlayOnView() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const host = ref.current?.closest<HTMLElement>("[data-play-host]");
    if (!host || typeof IntersectionObserver === "undefined") return;
    if (!window.matchMedia("(hover: none)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: ReturnType<typeof setTimeout>;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        io.disconnect();
        timer = setTimeout(() => {
          host.classList.add("is-play");
          timer = setTimeout(() => host.classList.remove("is-play"), 1300);
        }, 300);
      },
      { threshold: 0.6 },
    );
    io.observe(host);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, []);
  return <span ref={ref} hidden />;
}
