"use client";

import { useRef, useState } from "react";

const Play = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true">
    <path d="M6 4.5v11l9-5.5-9-5.5Z" fill="currentColor" />
  </svg>
);
const Replay = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M2.5 8a5.5 5.5 0 1 0 1.7-4" />
    <path d="M2.5 2.5v3h3" />
  </svg>
);
const Pause = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">
    <rect x="3.5" y="3" width="3" height="10" rx="1" />
    <rect x="9.5" y="3" width="3" height="10" rx="1" />
  </svg>
);

/**
 * A recording on its plate. It never plays by itself: the poster frame shows until the reader presses play,
 * which also respects reduced motion (playbook §6).
 */
export function VideoPlate({
  src,
  poster,
  label,
  caption,
  index,
  seconds,
}: {
  src: string;
  poster?: string;
  label: string;
  caption?: string;
  index: string;
  seconds?: number;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<"idle" | "playing" | "paused" | "ended">("idle");

  const play = () => {
    const v = ref.current;
    if (!v) return;
    if (state === "ended") v.currentTime = 0;
    void v.play();
  };
  const pause = () => ref.current?.pause();

  return (
    <figure className="cf-figure">
      <div className="cf-plate">
        <div className="cf-video cf-plate-shot">
          <video
            ref={ref}
            src={src}
            poster={poster}
            muted
            playsInline
            preload="none"
            aria-label={label}
            onPlay={() => setState("playing")}
            onPause={(e) => setState(e.currentTarget.ended ? "ended" : "paused")}
            onEnded={() => setState("ended")}
          />
          {state !== "playing" && (
            <button type="button" className="cf-play" onClick={play}>
              <span>
                {state === "ended" ? <Replay /> : <Play />}
                {state === "ended" ? "Play again" : state === "paused" ? "Resume" : "Play"}
                {seconds && state === "idle" ? <small>{seconds}s</small> : null}
              </span>
            </button>
          )}
        </div>
      </div>
      <div className="cf-video-bar">
        {caption ? (
          <figcaption className="cf-caption">
            <b>{index}</b>
            {caption}
          </figcaption>
        ) : (
          <span />
        )}
        {state === "playing" && (
          <button type="button" className="cf-ghost-btn" onClick={pause}>
            <Pause /> Pause
          </button>
        )}
      </div>
    </figure>
  );
}
