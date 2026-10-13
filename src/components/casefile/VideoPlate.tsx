"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { onPrint } from "@/lib/print";
import { BrowserFrame } from "./Frame";

/** Pauses every other video and audio element on the page, so only one thing plays at a time. */
export function pauseOthers(self: HTMLMediaElement) {
  document.querySelectorAll<HTMLMediaElement>("video, audio").forEach((m) => {
    if (m !== self && !m.paused) m.pause();
  });
}

const clock = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;

/** Play and pause as one shape: the two halves of the triangle slide apart into two bars. */
function PlayMorph({ playing }: { playing: boolean }) {
  return <span className={`cf-morph${playing ? " is-pause" : ""}`} aria-hidden="true" />;
}

/**
 * A recording of the product, whole, in a browser window (playbook §6). It plays once when it comes into view;
 * with reduced motion it rests on its first frame until the reader presses play. Controls are serious and complete
 * (playbook §7): the whole screen plays and pauses, and the window's toolbar holds a scrubber and the time, so
 * nothing adds height. The recordings have no sound, so there is no sound control.
 */
export function VideoPlate({
  src,
  webm,
  posterSet,
  label,
  url,
  ratio,
  seconds,
}: {
  src: string;
  /** A VP9 version for browsers without H.264 (some Chromium builds). */
  webm?: string;
  /** The poster as an image srcset (blocks.tsx). A poster can't be lazy-loaded or given a srcset, so the plate sets it
   * itself: once it is within a screen of view, at the width it is shown at. */
  posterSet?: string;
  label: string;
  url: string;
  ratio: number;
  /** Length, shown before the recording has loaded. */
  seconds?: number;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(seconds ?? 0);
  const [poster, setPoster] = useState<string>();
  const total = duration || 1;

  useEffect(() => {
    const v = ref.current;
    if (!v || !posterSet) return;
    const candidates = posterSet
      .split(", ")
      .map((c) => {
        const i = c.lastIndexOf(" ");
        return { url: c.slice(0, i), w: parseInt(c.slice(i + 1), 10) };
      })
      .sort((a, b) => a.w - b.w);
    const choose = () => {
      const need = v.clientWidth * (window.devicePixelRatio || 1);
      setPoster((candidates.find((c) => c.w >= need) ?? candidates.at(-1))?.url);
    };
    // a printed sheet shows its card at once; a case page waits until the plate is near; a printout needs them all
    if (v.closest(".s-card") || !("IntersectionObserver" in window)) {
      choose();
      return;
    }
    const io = new IntersectionObserver(([e]) => e?.isIntersecting && load(), { rootMargin: "100% 0px" });
    // before printing, the poster is in the page at once (lib/print.ts)
    const offPrint = onPrint(() => flushSync(load));
    const stop = () => {
      io.disconnect();
      offPrint();
    };
    function load() {
      stop();
      choose();
    }
    io.observe(v);
    return stop;
  }, [posterSet]);

  // The metadata may load before hydration, so read the length directly as well as on the event.
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const read = () => {
      if (Number.isFinite(v.duration) && v.duration > 0) setDuration(v.duration);
    };
    read();
    v.addEventListener("durationchange", read);
    return () => v.removeEventListener("durationchange", read);
  }, []);

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
    if (v.paused) {
      if (v.ended) v.currentTime = 0;
      void v.play().catch(() => {});
    } else v.pause();
  };

  const seek = (t: number) => {
    const v = ref.current;
    setTime(t);
    if (!v) return;
    if (v.readyState >= 1) v.currentTime = t;
    else {
      v.addEventListener("loadedmetadata", () => (v.currentTime = t), { once: true });
      v.preload = "auto";
      v.load();
    }
  };

  return (
    <figure className={`cf-figure cf-rec${playing ? " is-playing" : ""}`}>
      <BrowserFrame
        url={url}
        ratio={ratio}
        bar={
          <span className="cf-rec-bar">
            <span className="cf-track">
              <span className="cf-track-bar" aria-hidden="true">
                <i style={{ transform: `scaleX(${Math.min(1, time / total)})` }} />
              </span>
              <input
                type="range"
                min={0}
                max={total}
                step={0.1}
                value={Math.min(time, total)}
                aria-label="Position in the recording"
                aria-valuetext={`${clock(time)} of ${clock(total)}`}
                onChange={(e) => seek(Number(e.currentTarget.value))}
              />
            </span>
            <span className="cf-clock">
              {clock(time)}
              <i> / {clock(duration)}</i>
            </span>
          </span>
        }
      >
        <video
          ref={ref}
          poster={poster}
          muted
          playsInline
          preload="metadata"
          tabIndex={-1}
          aria-label={label}
          onPlay={(e) => {
            pauseOthers(e.currentTarget);
            setPlaying(true);
          }}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        >
          {webm && <source src={webm} type="video/webm" />}
          <source src={src} type="video/mp4" />
        </video>
        {/* The one play control: the whole screen, with the button at its centre. */}
        <button type="button" className="cf-screen" aria-label={playing ? "Pause the recording" : "Play the recording"} onClick={toggle}>
          <span className="cf-bigplay">
            <PlayMorph playing={playing} />
          </span>
        </button>
      </BrowserFrame>
    </figure>
  );
}
