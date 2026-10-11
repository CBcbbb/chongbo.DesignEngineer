"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

/* ---------------------------------------------------------------------------------------------
 * The recording: one shared player. Any card can jump to a moment with <SeekButton t={25} />.
 * ------------------------------------------------------------------------------------------- */

type Recording = { seek: (t: number) => void; register: (v: HTMLVideoElement | null) => void };
const RecordingCtx = createContext<Recording>({ seek: () => {}, register: () => {} });

export function RecordingProvider({ children }: { children: ReactNode }) {
  const video = useRef<HTMLVideoElement | null>(null);
  const register = useCallback((v: HTMLVideoElement | null) => {
    video.current = v;
  }, []);
  const seek = useCallback((t: number) => {
    const v = video.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("recording")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    const go = () => {
      v.currentTime = t;
      void v.play().catch(() => {});
    };
    if (v.readyState >= 1) go();
    else {
      v.addEventListener("loadedmetadata", go, { once: true });
      v.load();
    }
  }, []);
  return <RecordingCtx.Provider value={{ seek, register }}>{children}</RecordingCtx.Provider>;
}

export type Chapter = { t: number; label: string };

/** A speaker; `off` adds the mute stroke. */
function Speaker({ off = false }: { off?: boolean }) {
  return (
    <svg className="nk-spk" viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" focusable="false">
      <path d="M3 7.5h3l4.5-3.5v12L6 12.5H3z" fill="currentColor" />
      {off ? (
        <path d="M13.5 7.5l4 5m0-5l-4 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      ) : (
        <path d="M13.5 7a4 4 0 0 1 0 6m2-8.5a7 7 0 0 1 0 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      )}
    </svg>
  );
}

/** Pauses every other video and audio element on the page, so only one thing plays at a time. */
function pauseOthers(self: HTMLMediaElement) {
  document.querySelectorAll<HTMLMediaElement>("video, audio").forEach((m) => {
    if (m !== self && !m.paused) m.pause();
  });
}

export function RecordingPlayer({ chapters, full }: { chapters: { part: string; items: Chapter[] }[]; full: string }) {
  const { register, seek } = useContext(RecordingCtx);
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState<number | null>(null);
  const [muted, setMuted] = useState(false);
  const times = chapters.flatMap((c) => c.items.map((i) => i.t)).sort((a, b) => a - b);

  useEffect(() => {
    register(ref.current);
    return () => register(null);
  }, [register]);
  useEffect(() => {
    if (ref.current) ref.current.muted = muted;
  }, [muted]);

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
          onPlay={(e) => {
            pauseOthers(e.currentTarget);
            setPlaying(true);
          }}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onTimeUpdate={(e) => {
            const v = e.currentTarget;
            if (v.duration) setProgress(v.currentTime / v.duration);
            let cur: number | null = null;
            for (const s of times) if (v.currentTime >= s - 0.05) cur = s;
            setCurrent(cur);
          }}
        />
        <button
          type="button"
          className="nk-tog"
          aria-label={playing ? "Pause recording" : "Play recording"}
          onClick={() => {
            const v = ref.current;
            if (!v) return;
            if (v.paused) void v.play().catch(() => {});
            else v.pause();
          }}
        >
          {playing ? (
            <span className="nk-bars" aria-hidden="true">
              <i />
              <i />
            </span>
          ) : (
            <span className="nk-tri" aria-hidden="true" />
          )}
        </button>
        <button type="button" className="nk-snd" aria-label="Sound" aria-pressed={!muted} onClick={() => setMuted((m) => !m)}>
          <Speaker off={muted} />
        </button>
      </div>
      <div className="nk-rec-side">
        <h2 id="rec-h">Screen recording</h2>
        <a className="nk-outlink" href={full} target="_blank" rel="noopener">
          Full quality on YouTube<span className="sr-only"> (opens in a new tab)</span> <span aria-hidden="true">↗</span>
        </a>
        <div className="nk-prog" aria-hidden="true">
          <i style={{ width: `${progress * 100}%` }} />
        </div>
        <div className="nk-chapters">
          {chapters.map((c) => (
            <section key={c.part} aria-label={`${c.part} chapters`}>
              <h3>{c.part}</h3>
              <ol>
                {c.items.map((i) => (
                  <li key={i.t}>
                    <button type="button" aria-current={current === i.t ? "true" : undefined} onClick={() => seek(i.t)}>
                      <span className="nk-t">{`0:${String(Math.floor(i.t)).padStart(2, "0")}`}</span>
                      {i.label}
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

export function SeekButton({ t }: { t: number }) {
  const { seek } = useContext(RecordingCtx);
  const label = `0:${String(Math.floor(t)).padStart(2, "0")}`;
  return (
    <button type="button" className="nk-seek" onClick={() => seek(t)}>
      <span className="nk-tri" aria-hidden="true" />
      See it at {label}
      <span className="sr-only"> in the recording</span>
    </button>
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
 * Voice teaser: a Listen button pinned to the waveform on the Star Voice screen. It plays the
 * influencer's teaser (cut from the recording) and sweeps the waveform as it plays.
 * ------------------------------------------------------------------------------------------- */

export function VoiceTeaser({ src, label }: { src: string; label: string }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  return (
    <>
      <span className={`nk-vt-wave${playing ? " is-playing" : ""}`} aria-hidden="true">
        <i style={{ transform: `scaleX(${progress})` }} />
      </span>
      <button
        type="button"
        className={`nk-vt${playing ? " is-playing" : ""}`}
        aria-label={playing ? `Pause ${label}` : `Play ${label}`}
        onClick={() => {
          const a = audio.current;
          if (!a) return;
          if (a.paused) {
            if (a.ended) a.currentTime = 0;
            void a.play().catch(() => {});
          } else a.pause();
        }}
      >
        <Speaker />
        <span aria-hidden="true">{playing ? "Playing" : "Listen"}</span>
      </button>
      <audio
        ref={audio}
        src={src}
        preload="none"
        onPlay={(e) => {
          pauseOthers(e.currentTarget);
          setPlaying(true);
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
 * Picture in picture: the shipped screens large, the wireframe as a labelled inset pinned to the
 * canvas's top-right corner and overhanging it. Pressing the inset swaps which one is large.
 * ------------------------------------------------------------------------------------------- */

type PipState = { label: string; image: ReactNode };

export function Pip({ main, inset, ratio }: { main: PipState; inset: PipState; /** width / height of both images */ ratio: number }) {
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
            <span className="nk-pip-thumb" aria-hidden="true">
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
 * The shoebox: a Lottie that plays once when it comes into view, and again on Replay.
 * ------------------------------------------------------------------------------------------- */

export function GiftBox({ src, label }: { src: string; label: string }) {
  const box = useRef<HTMLDivElement>(null);
  const anim = useRef<import("lottie-web").AnimationItem | null>(null);
  const loading = useRef<Promise<import("lottie-web").AnimationItem> | null>(null);
  const [played, setPlayed] = useState(false);
  const [ready, setReady] = useState(false);

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
      a.addEventListener("complete", () => setPlayed(true));
      await new Promise<void>((res) => a.addEventListener("DOMLoaded", () => res()));
      anim.current = a;
      setReady(true);
      return a;
    })();
    return loading.current;
  }, [src]);

  /* Loads just before it scrolls into view and plays once when most of it is visible.
     With reduced motion it rests on the last frame until someone presses Play. */
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let started = false;
    const preload = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        preload.disconnect();
        void load().then((a) => {
          if (!started) a.goToAndStop(reduce ? a.totalFrames - 1 : 0, true);
        });
      },
      { rootMargin: "300px" },
    );
    const autoplay = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || reduce) return;
        autoplay.disconnect();
        started = true;
        void load().then((a) => a.goToAndPlay(0, true));
      },
      { threshold: 0.6 },
    );
    preload.observe(el);
    autoplay.observe(el);
    return () => {
      preload.disconnect();
      autoplay.disconnect();
      anim.current?.destroy();
      anim.current = null;
      loading.current = null;
    };
  }, [load]);

  return (
    <div className="nk-stage nk-box">
      <div className={`nk-lottie${ready ? " is-ready" : ""}`}>
        <div ref={box} className="nk-lottie-box" role="img" aria-label={label} />
      </div>
      <div className="nk-stage-ctl">
        <button
          type="button"
          className="nk-btn"
          onClick={() => void load().then((a) => a.goToAndPlay(0, true))}
        >
          <span className="nk-tri" aria-hidden="true" />
          {played ? "Replay" : "Play"}
        </button>
      </div>
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
