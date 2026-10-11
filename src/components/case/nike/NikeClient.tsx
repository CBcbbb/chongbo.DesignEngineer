"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";

/* ---------------------------------------------------------------------------------------------
 * The recording. Moments are timed from the footage: the chapter list plays them in the player,
 * and a card's "See it at" opens the same moment as a clip beside the card, without scrolling away.
 * ------------------------------------------------------------------------------------------- */

export type Moment = { start: number; end: number; label: string; part?: string };
const PARTS_ORDER = ["Read", "Shop", "Return"];

/** A speaker; `off` adds the mute stroke. */
function Speaker({ off = false }: { off?: boolean }) {
  return (
    <svg className="nk-spk" viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" focusable="false">
      <path d="M3 7.5h3l4.5-3.5v12L6 12.5H3z" fill="currentColor" />
      {off ? (
        <path d="M13.5 7.5l4 5m0-5l-4 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      ) : (
        <>
          <path className="nk-w1" d="M13.5 7a4 4 0 0 1 0 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          <path className="nk-w2" d="M15.5 4.5a7 7 0 0 1 0 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        </>
      )}
    </svg>
  );
}

/** Small icons for the capability labels on the cover. */
export function ChipIcon({ kind }: { kind: "swoosh" | "heart" | "grid" }) {
  if (kind === "swoosh")
    return (
      <svg className="nk-ico nk-ico-swoosh" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M5.5 9.5c-3 4-1.5 7.5 3.5 6S18 10 22 6.5" />
      </svg>
    );
  if (kind === "heart")
    return (
      <svg className="nk-ico nk-ico-heart" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path className="nk-h" d="M12 19.5s-7-4.3-7-9.3A3.8 3.8 0 0 1 12 8a3.8 3.8 0 0 1 7 2.2c0 5-7 9.3-7 9.3z" />
      </svg>
    );
  return (
    <svg className="nk-ico nk-ico-grid" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect className="g1" x="4" y="4" width="6.5" height="6.5" rx="1.2" />
      <rect className="g2" x="13.5" y="4" width="6.5" height="6.5" rx="1.2" />
      <rect className="g3" x="13.5" y="13.5" width="6.5" height="6.5" rx="1.2" />
      <rect className="g4" x="4" y="13.5" width="6.5" height="6.5" rx="1.2" />
    </svg>
  );
}

/** Pauses every other video and audio element on the page, so only one thing plays at a time. */
function pauseOthers(self: HTMLMediaElement) {
  document.querySelectorAll<HTMLMediaElement>("video, audio").forEach((m) => {
    if (m !== self && !m.paused) m.pause();
  });
}

const clock = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;

/** Play and pause as one shape: the two halves of the triangle slide apart into two bars. */
function PlayMorph({ playing }: { playing: boolean }) {
  return <span className={`nk-morph${playing ? " is-pause" : ""}`} aria-hidden="true" />;
}

export function RecordingPlayer({ chapters, full }: { chapters: Moment[]; full: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const total = duration || 50;
  const current = chapters.find((c) => time >= c.start && time < c.end) ?? null;
  const within = current ? Math.min(1, Math.max(0, (time - current.start) / (current.end - current.start))) : 0;

  useEffect(() => {
    if (ref.current) ref.current.muted = muted;
  }, [muted]);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) void v.play().catch(() => {});
    else v.pause();
  };
  const jump = (t: number) => {
    const v = ref.current;
    if (!v) return;
    const go = () => {
      v.currentTime = t;
      void v.play().catch(() => {});
    };
    if (v.readyState >= 1) go();
    else {
      v.addEventListener("loadedmetadata", go, { once: true });
      v.load();
    }
  };

  return (
    <div className="nk-rec">
      <div className={`nk-phone${playing ? " is-playing" : ""}`}>
        <video
          ref={ref}
          src="/assets/nike/recording.mp4"
          poster="/assets/nike/recording-poster.jpg"
          width={750}
          height={1624}
          playsInline
          preload="metadata"
          aria-label="Screen recording of Athletes Closet in Nike's app"
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onPlay={(e) => {
            pauseOthers(e.currentTarget);
            setPlaying(true);
          }}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        />
        {/* The one play control: the whole screen, with the button at its centre. */}
        <button type="button" className="nk-screen" aria-label={playing ? "Pause recording" : "Play recording"} onClick={toggle}>
          <span className="nk-bigplay">
            <PlayMorph playing={playing} />
          </span>
        </button>
        {/* slim controls in the bezel under the screen */}
        <div className="nk-bezel">
          <span className="nk-track">
            <span className="nk-track-bar" aria-hidden="true">
              <i style={{ transform: `scaleX(${time / total})` }} />
            </span>
            <input
              type="range"
              min={0}
              max={total}
              step={0.1}
              value={time}
              aria-label="Position in the recording"
              aria-valuetext={`${clock(time)} of ${clock(total)}`}
              onChange={(e) => {
                const v = ref.current;
                const t = Number(e.currentTarget.value);
                setTime(t);
                if (v) v.currentTime = t;
              }}
            />
          </span>
          <span className="nk-clock">
            {clock(time)}
            <i> / {clock(total)}</i>
          </span>
          <button type="button" className={`nk-snd${playing && !muted ? " is-live" : ""}`} aria-label="Sound" aria-pressed={!muted} onClick={() => setMuted((m) => !m)}>
            <Speaker off={muted} />
          </button>
        </div>
      </div>
      <div className="nk-rec-side">
        <h2 id="rec-h">Screen recording</h2>
        <a className="nk-outlink" href={full} target="_blank" rel="noopener">
          Full quality on YouTube<span className="sr-only"> (opens in a new tab)</span> <span aria-hidden="true">↗</span>
        </a>
        {/* grouped by part, as the page is; each moment lights up only while it's on screen */}
        <div className="nk-chapters">
          {PARTS_ORDER.map((part) => (
            <section key={part} aria-label={`${part} moments`}>
              <h3>{part}</h3>
              <ol>
                {chapters
                  .filter((c) => c.part === part)
                  .map((c) => (
                    <li key={c.start}>
                      <button
                        type="button"
                        aria-current={current === c ? "true" : undefined}
                        style={current === c ? { ["--cp" as string]: String(within) } : undefined}
                        onClick={() => jump(c.start)}
                      >
                        <span className="nk-t">{clock(c.start)}</span>
                        {c.label}
                      </button>
                    </li>
                  ))}
              </ol>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

/** "See it at 0:24": opens that moment of the recording as a clip beside the card. */
export function SeekButton({ moment }: { moment: Moment }) {
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  // Only one clip open at a time.
  useEffect(() => {
    const other = (e: Event) => {
      if ((e as CustomEvent<number>).detail !== moment.start) setOpen(false);
    };
    window.addEventListener("nk-clip", other);
    return () => window.removeEventListener("nk-clip", other);
  }, [moment.start]);
  return (
    <>
      <button
        ref={btn}
        type="button"
        className="nk-seek"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          if (!open) window.dispatchEvent(new CustomEvent("nk-clip", { detail: moment.start }));
          setOpen((o) => !o);
        }}
      >
        <span className="nk-tri" aria-hidden="true" />
        See it at {clock(moment.start)}
        <span className="sr-only"> in the recording</span>
      </button>
      {open && (
        <Clip
          moment={moment}
          anchor={btn}
          onClose={(refocus) => {
            setOpen(false);
            if (refocus) btn.current?.focus({ preventScroll: true });
          }}
        />
      )}
    </>
  );
}

function Clip({ moment, anchor, onClose }: { moment: Moment; anchor: RefObject<HTMLButtonElement | null>; onClose: (refocus: boolean) => void }) {
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const shut = useRef<HTMLButtonElement>(null);
  const frame = useRef(0);
  // The clip only exists after a click, so the page is there to portal into.
  const [root] = useState<HTMLElement | null>(() => document.querySelector<HTMLElement>(".nk"));
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const span = moment.end - moment.start;

  // Sit under the button (or above it when there's no room), inside the window; close if the button scrolls away.
  useLayoutEffect(() => {
    const place = () => {
      const a = anchor.current?.getBoundingClientRect();
      const b = box.current;
      if (!a || !b) return;
      if (a.bottom < 0 || a.top > window.innerHeight) return onClose(false);
      const w = b.offsetWidth;
      const h = b.offsetHeight;
      const left = Math.min(Math.max(16, a.left), window.innerWidth - w - 16);
      let top = a.bottom + 10;
      if (top + h > window.innerHeight - 16) top = a.top - h - 10 >= 16 ? a.top - h - 10 : Math.max(16, window.innerHeight - h - 16);
      setPos({ top, left });
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, { passive: true });
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place);
    };
  }, [anchor, onClose, root]);

  const play = useCallback(() => {
    const v = video.current;
    if (!v) return;
    const go = () => {
      v.currentTime = moment.start;
      // The moments are short, and the recording moves fast: play them at three-quarter speed.
      v.defaultPlaybackRate = 0.75;
      v.playbackRate = 0.75;
      setDone(false);
      void v.play().catch(() => {});
    };
    if (v.readyState >= 1) go();
    else v.addEventListener("loadedmetadata", go, { once: true });
  }, [moment.start]);

  // Play the moment once, stopping on its last frame.
  useEffect(() => {
    if (!root) return;
    play();
    shut.current?.focus({ preventScroll: true });
    const tick = () => {
      const v = video.current;
      if (v && !v.paused) {
        setProgress(Math.min(1, Math.max(0, (v.currentTime - moment.start) / span)));
        if (v.currentTime >= moment.end) {
          v.pause();
          setDone(true);
        }
      }
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [root, play, moment.start, moment.end, span]);

  // Escape or a click outside closes it.
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose(true);
    };
    const away = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!box.current?.contains(t) && !anchor.current?.contains(t)) onClose(false);
    };
    document.addEventListener("keydown", key);
    document.addEventListener("pointerdown", away);
    return () => {
      document.removeEventListener("keydown", key);
      document.removeEventListener("pointerdown", away);
    };
  }, [anchor, onClose]);

  if (!root) return null;
  return createPortal(
    <div
      ref={box}
      className="nk-clip"
      role="dialog"
      aria-label={`${moment.label}, ${clock(moment.start)} to ${clock(moment.end)} in the recording`}
      style={pos ? { top: pos.top, left: pos.left } : { visibility: "hidden" }}
    >
      <div className="nk-clip-head">
        <span className="nk-clip-title">
          <b>{moment.label}</b>
          <i>
            {clock(moment.start)}–{clock(moment.end)}
          </i>
        </span>
        <button ref={shut} type="button" className="nk-clip-x" aria-label="Close the clip" onClick={() => onClose(true)}>
          <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>
      </div>
      <div className="nk-clip-screen">
        <video ref={video} src="/assets/nike/recording.mp4" playsInline preload="auto" onPlay={(e) => pauseOthers(e.currentTarget)} />
        {done && (
          <button type="button" className="nk-clip-again" onClick={play}>
            <span className="nk-tri" aria-hidden="true" />
            Play again
          </button>
        )}
      </div>
      <span className="nk-clip-bar" aria-hidden="true">
        <i style={{ transform: `scaleX(${progress})` }} />
      </span>
    </div>,
    root,
  );
}

/* ---------------------------------------------------------------------------------------------
 * Compare slider: two images of the same size, the top one clipped at the handle.
 * ------------------------------------------------------------------------------------------- */

export function Compare({
  label,
  under,
  over,
  labels,
  ratio,
}: {
  label: string;
  under: ReactNode;
  over: ReactNode;
  labels: [string, string];
  /** The images' own ratio, e.g. "333 / 500", so the slider can be sized by height without distorting them. */
  ratio: string;
}) {
  const [x, setX] = useState(50);
  return (
    <div className="nk-compare" style={{ ["--x" as string]: `${x}%`, aspectRatio: ratio }}>
      {under}
      <div className="nk-compare-top">{over}</div>
      <span className="nk-lab l" aria-hidden="true">
        {labels[0]}
      </span>
      <span className="nk-lab r" aria-hidden="true">
        {labels[1]}
      </span>
      <span className="nk-handle" aria-hidden="true" />
      <input type="range" min={0} max={100} value={x} aria-label={label} aria-valuetext={`${x}% ${labels[0].toLowerCase()}`} onChange={(e) => setX(Number(e.currentTarget.value))} />
    </div>
  );
}

/* ---------------------------------------------------------------------------------------------
 * Framing device switcher: one configuration at a time, with its layer name.
 * ------------------------------------------------------------------------------------------- */

export function Switcher({ options }: { options: { label: string; layer: string; image: ReactNode; tall?: boolean }[] }) {
  const [i, setI] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const move = (d: number) => {
    const n = (i + d + options.length) % options.length;
    setI(n);
    tabs.current[n]?.focus();
  };
  return (
    <div className="nk-spec nk-grid nk-box">
      <div className="nk-spec-list" role="tablist" aria-label="Framing device configurations">
        {options.map((o, k) => (
          <button
            key={o.layer}
            ref={(el) => {
              tabs.current[k] = el;
            }}
            type="button"
            role="tab"
            id={`fd-tab-${k}`}
            aria-selected={i === k}
            aria-controls="fd-panel"
            tabIndex={i === k ? 0 : -1}
            onClick={() => setI(k)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown" || e.key === "ArrowRight") {
                e.preventDefault();
                move(1);
              } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
                e.preventDefault();
                move(-1);
              }
            }}
          >
            <span className="nk-n">{k + 1}</span>
            {o.label}
          </button>
        ))}
      </div>
      <div className="nk-spec-view" role="tabpanel" id="fd-panel" aria-labelledby={`fd-tab-${i}`}>
        <span className="nk-layer">{options[i]!.layer}</span>
        <span className="nk-corner tl" aria-hidden="true" />
        <span className="nk-corner br" aria-hidden="true" />
        {options.map((o, k) => (
          <div key={o.layer} className={`nk-spec-img${o.tall ? " is-tall" : ""}`} hidden={i !== k}>
            {o.image}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------------------------
 * Voice teaser, played like a voice message: a play button on the bubble's record dot, a hint
 * above it until the first listen, and the screenshot's own waveform turning orange as it plays
 * (that is the progress).
 * ------------------------------------------------------------------------------------------- */

export function VoiceTeaser({ src, label, seconds }: { src: string; label: string; seconds: number }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [heard, setHeard] = useState(false);
  const [progress, setProgress] = useState(0);
  return (
    <>
      <span className="nk-vt-wave" aria-hidden="true">
        <i style={{ transform: `scaleX(${progress})` }} />
      </span>
      {!heard && (
        <span className="nk-vt-hint" aria-hidden="true">
          Tap to listen · 0:0{seconds}
        </span>
      )}
      <button
        type="button"
        className={`nk-vt${playing ? " is-playing" : ""}`}
        aria-label={playing ? `Pause ${label}` : `Play ${label}, ${seconds} seconds`}
        onClick={() => {
          const a = audio.current;
          if (!a) return;
          if (a.paused) {
            if (a.ended) a.currentTime = 0;
            void a.play().catch(() => {});
          } else a.pause();
        }}
      >
        <PlayMorph playing={playing} />
      </button>
      <audio
        ref={audio}
        src={src}
        preload="none"
        onPlay={(e) => {
          pauseOthers(e.currentTarget);
          setPlaying(true);
          setHeard(true);
        }}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setProgress(0);
        }}
        onTimeUpdate={(e) => {
          const a = e.currentTarget;
          if (a.duration) setProgress(a.currentTime / a.duration);
        }}
      />
    </>
  );
}

/* ---------------------------------------------------------------------------------------------
 * A strip of posters, swiped sideways: as large as the card allows, with the next one showing at
 * the edge. Previous / next buttons move one poster at a time for mouse and keyboard users.
 * ------------------------------------------------------------------------------------------- */

export function PosterStrip({ label, children }: { label: string; children: ReactNode[] }) {
  const track = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const update = useCallback(() => {
    const t = track.current;
    if (!t) return;
    setEdge({ start: t.scrollLeft < 4, end: t.scrollLeft + t.clientWidth > t.scrollWidth - 4 });
  }, []);
  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);
  const move = (dir: 1 | -1) => {
    const t = track.current;
    const item = t?.querySelector("li");
    if (!t || !item) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    t.scrollBy({ left: dir * (item.getBoundingClientRect().width + 16), behavior: reduce ? "auto" : "smooth" });
  };
  return (
    <div className="nk-strip">
      <ul ref={track} className="nk-strip-track" aria-label={label} onScroll={update} tabIndex={0}>
        {children.map((c, i) => (
          <li key={i}>{c}</li>
        ))}
      </ul>
      <div className="nk-strip-nav">
        <button type="button" aria-label="Previous poster" disabled={edge.start} onClick={() => move(-1)}>
          <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path d="M10 3L5 8l5 5" />
          </svg>
        </button>
        <button type="button" aria-label="Next poster" disabled={edge.end} onClick={() => move(1)}>
          <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path d="M6 3l5 5-5 5" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------------------------
 * Picture in picture: the shipped screens large, the wireframe as a labelled inset pinned to the
 * canvas's top-right corner and overhanging it. Pressing the inset swaps which one is large.
 * ------------------------------------------------------------------------------------------- */

type PipState = { label: string; image: ReactNode };

export function Pip({
  main,
  inset,
  ratio,
  insetRatio = ratio,
}: {
  main: PipState;
  inset: PipState;
  /** width / height of the main image: the canvas keeps this shape whichever image is large */
  ratio: number;
  /** width / height of the inset image: the inset keeps this shape whichever image is small */
  insetRatio?: number;
}) {
  const [swapped, setSwapped] = useState(false);
  const big = swapped ? inset : main;
  const small = swapped ? main : inset;
  return (
    <div className="nk-pip nk-box">
      <div className="nk-pip-main">
        <div className="nk-pip-canvas" style={{ ["--ar" as string]: String(ratio) }}>
          {big.image}
          <button
            type="button"
            className="nk-pip-inset"
            aria-label={`Show the ${small.label.toLowerCase()} large`}
            onClick={() => setSwapped((v) => !v)}
          >
            <span className="nk-pip-thumb" aria-hidden="true" style={{ ["--iar" as string]: String(insetRatio) }}>
              {small.image}
            </span>
            <span className="nk-pip-lbl" aria-hidden="true">
              {small.label} <span className="nk-pip-ico">⤢</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------------------------
 * The shoebox: a Lottie that loops while it's in view.
 * ------------------------------------------------------------------------------------------- */

export function GiftBox({ src, label }: { src: string; label: string }) {
  const box = useRef<HTMLDivElement>(null);
  const anim = useRef<import("lottie-web").AnimationItem | null>(null);
  const loading = useRef<Promise<import("lottie-web").AnimationItem> | null>(null);
  const visible = useRef(false);
  const held = useRef(false);
  const hold = useRef(0);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);

  const load = useCallback(() => {
    if (loading.current) return loading.current;
    loading.current = (async () => {
      const [{ default: lottie }, data] = await Promise.all([
        import("lottie-web/build/player/lottie_light"),
        fetch(src).then((r) => r.json()),
      ]);
      const a = lottie.loadAnimation({
        container: box.current!,
        renderer: "svg",
        loop: false,
        autoplay: false,
        animationData: data,
        rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
      });
      // Rest on the open box for a moment, then play again, for as long as it's in view.
      a.addEventListener("complete", () => {
        window.clearTimeout(hold.current);
        hold.current = window.setTimeout(() => {
          if (visible.current && !held.current) a.goToAndPlay(0, true);
        }, 1400);
      });
      await new Promise<void>((res) => a.addEventListener("DOMLoaded", () => res()));
      anim.current = a;
      setReady(true);
      return a;
    })();
    return loading.current;
  }, [src]);

  /* Plays on a loop while it's in view and stops when it scrolls away. With reduced motion it
     rests on the last frame. Clicking it, or the pause button keyboards reach, holds it still. */
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) held.current = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible.current = !!entry?.isIntersecting;
        void load().then((a) => {
          if (reduce) a.goToAndStop(a.totalFrames - 1, true);
          else if (visible.current && !held.current) a.play();
          else a.pause();
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(hold.current);
      anim.current?.destroy();
      anim.current = null;
      loading.current = null;
    };
  }, [load]);

  const toggle = () => {
    held.current = !held.current;
    setPaused(held.current);
    void load().then((a) => (held.current ? a.pause() : a.play()));
  };

  return (
    <div className="nk-stage nk-box" onClick={toggle}>
      <div className={`nk-lottie${ready ? " is-ready" : ""}`}>
        <div ref={box} className="nk-lottie-box" role="img" aria-label={label} />
      </div>
      <button
        type="button"
        className="nk-stage-pause"
        onClick={(e) => {
          e.stopPropagation();
          toggle();
        }}
      >
        {paused ? "Play the animation" : "Pause the animation"}
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------------------------------------
 * Contents: marks the card in view (aria-current="step") and its part.
 * ------------------------------------------------------------------------------------------- */

export type ContentsPart = { id: string; n: string; label: string; cards: { id: string; label: string }[] };

export function Contents({ title, parts }: { title: string; parts: ContentsPart[] }) {
  const [card, setCard] = useState<string | null>(null);
  const partOf = (id: string | null) => parts.find((p) => p.id === id || p.cards.some((c) => c.id === id))?.id ?? null;

  useEffect(() => {
    const ids = parts.flatMap((p) => [p.id, ...p.cards.map((c) => c.id)]);
    let frame = 0;
    /* The current card is the last one whose top has passed 40% of the viewport; above the first part, none. */
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      let cur: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) cur = id;
      }
      setCard(cur);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("hashchange", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("hashchange", onScroll);
    };
  }, [parts]);

  const activePart = partOf(card);
  const isCard = (id: string) => parts.some((p) => p.cards.some((c) => c.id === id));

  return (
    <nav className="nk-toc" aria-label="Contents">
      {/* Above the first part (the cover and the recording), the project itself is where you are. */}
      <a className="nk-toc-proj" href="#top" aria-current={card === null ? "step" : undefined}>
        {title}
      </a>
      <ol>
        {parts.map((p) => (
          <li key={p.id} className="nk-toc-part" data-active={activePart === p.id}>
            <a href={`#${p.id}`} aria-current={card === p.id && !isCard(p.id) ? "step" : undefined}>
              <span className="nk-n">{p.n}</span>
              {p.label}
            </a>
            <ol>
              {p.cards.map((c) => (
                <li key={c.id}>
                  <a href={`#${c.id}`} aria-current={card === c.id ? "step" : undefined}>
                    {c.label}
                  </a>
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ol>
    </nav>
  );
}
