"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserFrame } from "./Frame";
import { PlayMarks } from "./motion";

/** Pauses every other video and audio element on the page, so only one thing plays at a time. */
export function pauseOthers(self: HTMLMediaElement) {
  document.querySelectorAll<HTMLMediaElement>("video, audio").forEach((m) => {
    if (m !== self && !m.paused) m.pause();
  });
}

/** Play, pause and replay as one shape. */
function Glyph({ state }: { state: "idle" | "playing" | "paused" | "ended" }) {
  if (state === "playing")
    return (
      <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false" fill="currentColor">
        <rect x="5" y="4" width="3.4" height="12" rx="1" />
        <rect x="11.6" y="4" width="3.4" height="12" rx="1" />
      </svg>
    );
  if (state === "ended")
    return (
      <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 10a6 6 0 1 0 1.9-4.4" />
        <path d="M4 3.5v3.4h3.4" />
      </svg>
    );
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path d="M7 4.6v10.8l8.6-5.4L7 4.6Z" fill="currentColor" />
    </svg>
  );
}

/**
 * A recording of the product, whole, in a browser window (playbook §6). It plays once when it comes into view
 * and can be replayed; with reduced motion it rests on its first frame until the reader presses play.
 * The whole screen is the one play control; the progress line sits in the window's toolbar, so nothing adds height.
 * The recordings have no sound, so there is no sound control.
 */
export function VideoPlate({
  src,
  webm,
  poster,
  label,
  url,
  ratio,
}: {
  src: string;
  /** A VP9 version for browsers without H.264 (some Chromium builds). */
  webm?: string;
  poster?: string;
  label: string;
  url: string;
  ratio: number;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<"idle" | "playing" | "paused" | "ended">("idle");
  const [progress, setProgress] = useState(0);

  const play = () => {
    const v = ref.current;
    if (!v) return;
    if (v.ended) v.currentTime = 0;
    void v.play().catch(() => setState((s) => (s === "playing" ? "paused" : s)));
  };

  useEffect(() => {
    const v = ref.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        io.disconnect();
        if (v.paused && v.currentTime === 0) {
          v.preload = "auto";
          void v.play().catch(() => {});
        }
      },
      { threshold: 0.6 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) play();
    else v.pause();
  };

  const name = state === "playing" ? "Pause the recording" : state === "ended" ? "Play the recording again" : "Play the recording";

  return (
    <figure className="cf-figure cf-rec" data-state={state}>
      <BrowserFrame
        url={url}
        ratio={ratio}
        bar={
          <span className="cf-progress" aria-hidden="true">
            <i style={{ transform: `scaleX(${progress})` }} />
          </span>
        }
      >
        <video
          ref={ref}
          poster={poster}
          muted
          playsInline
          preload="none"
          tabIndex={-1}
          aria-label={label}
          onPlay={(e) => {
            pauseOthers(e.currentTarget);
            setState("playing");
          }}
          onPause={(e) => setState(e.currentTarget.ended ? "ended" : "paused")}
          onEnded={() => setState("ended")}
          onTimeUpdate={(e) => {
            const v = e.currentTarget;
            if (v.duration) setProgress(v.currentTime / v.duration);
          }}
        >
          {webm && <source src={webm} type="video/webm" />}
          <source src={src} type="video/mp4" />
        </video>
        <button type="button" className="cf-screen" aria-label={name} onClick={toggle}>
          <span className="cf-bigplay">
            <PlayMarks />
            <span className="cf-bigplay-btn">
              <Glyph state={state} />
            </span>
          </span>
        </button>
      </BrowserFrame>
    </figure>
  );
}
