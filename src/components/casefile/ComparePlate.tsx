"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BrowserFrame } from "./Frame";
import { Jolt, Wobble } from "./motion";

type Side = { src: string; width: number; height: number; alt: string; label: string };

/* The icons' parts jump at random on hover (`.j`), like entries settling into place. */
const FreeIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M5 4.6 10.5 4M4.6 5.3 7.2 10.6M11.3 5 8.8 10.5" strokeLinecap="round" />
    <circle className="j" cx="3.5" cy="4" r="1.6" />
    <circle className="j" cx="12" cy="3.5" r="1.6" />
    <circle className="j" cx="8" cy="12" r="1.6" />
  </svg>
);
const TypeIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" fill="currentColor">
    {[2.5, 6.2, 9.8, 13.5].map((x) => (
      <g key={x} className="j">
        {[3, 8, 13].map((y) => (
          <circle key={y} cx={x} cy={y} r="1.2" />
        ))}
      </g>
    ))}
  </svg>
);

/**
 * The signature module: one window, two arrangements. Choosing an arrangement plays the recorded move between them,
 * then rests on the screenshot. With reduced motion, or before the recording has loaded, it cross-fades.
 * Both arrangements share one frame, so the window keeps its size whichever is shown.
 */
export function ComparePlate({
  legend,
  url,
  a,
  b,
  video,
  index,
}: {
  legend: string;
  url: string;
  a: Side;
  b: Side;
  video?: { src: string; webm?: string; split: number };
  index: string;
}) {
  const [side, setSide] = useState<"a" | "b">("a");
  const [moving, setMoving] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);
  const stopAt = useRef<number>(0);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const warm = () => {
    const v = ref.current;
    if (v && v.preload !== "auto") {
      v.preload = "auto";
      v.load();
    }
  };

  const choose = (next: "a" | "b") => {
    if (next === side) return;
    setSide(next);
    const v = ref.current;
    if (!video || !v || reduced.current || v.readyState < 2) {
      setMoving(false);
      return;
    }
    const start = next === "b" ? 0.55 : video.split;
    stopAt.current = next === "b" ? video.split - 0.05 : v.duration - 0.05;
    v.currentTime = start;
    setMoving(true);
    void v.play().catch(() => setMoving(false));
  };

  const onTime = () => {
    const v = ref.current;
    if (v && moving && v.currentTime >= stopAt.current) {
      v.pause();
      setMoving(false);
    }
  };

  return (
    <figure className="cf-figure cf-compare">
      <fieldset className="cf-seg" onPointerEnter={warm} onFocus={warm}>
        <legend>{legend}</legend>
        {(["a", "b"] as const).map((k) => (
          <label key={k}>
            <input type="radio" name={`compare-${index}`} value={k} checked={side === k} onChange={() => choose(k)} />
            <Jolt>{k === "a" ? <FreeIcon /> : <TypeIcon />}</Jolt>
            <Wobble text={(k === "a" ? a : b).label} />
          </label>
        ))}
      </fieldset>
      <div className="cf-plate">
        <BrowserFrame url={url} ratio={a.width / a.height}>
          <div className="cf-stack">
            {([a, b] as const).map((s, i) => {
              const k = i === 0 ? "a" : "b";
              return (
                <div key={k} className="cf-layer" data-hidden={side !== k || moving} aria-hidden={side !== k}>
                  <Image src={s.src} alt={s.alt} width={s.width} height={s.height} quality={90} sizes="(min-width: 1100px) 860px, 100vw" />
                </div>
              );
            })}
            {video && (
              <div className="cf-layer" data-hidden={!moving} aria-hidden="true">
                <video
                  ref={ref}
                  muted
                  playsInline
                  preload="none"
                  onTimeUpdate={onTime}
                  onPause={() => setMoving(false)}
                  onEnded={() => setMoving(false)}
                  tabIndex={-1}
                >
                  {video.webm && <source src={video.webm} type="video/webm" />}
                  <source src={video.src} type="video/mp4" />
                </video>
              </div>
            )}
          </div>
        </BrowserFrame>
      </div>
    </figure>
  );
}
