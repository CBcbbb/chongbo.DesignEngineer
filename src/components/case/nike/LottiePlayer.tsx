"use client";

import { useContext, useEffect, useRef } from "react";
import { SlideActive } from "./Slideshow";

/**
 * Plays a Lottie file from /public once it scrolls into view. The player and the JSON load lazily, so
 * they cost nothing until the slide is seen. With reduced motion it shows a single still frame.
 */
export function LottiePlayer({
  src,
  label,
  ratio,
  className,
}: {
  src: string;
  label: string;
  ratio: string;
  className?: string;
}) {
  const active = useContext(SlideActive);
  const box = useRef<HTMLDivElement>(null);
  const anim = useRef<import("lottie-web").AnimationItem | null>(null);
  const isActive = useRef(active);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let cancelled = false;
    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry?.isIntersecting || anim.current) return;
        io.disconnect();
        const [{ default: lottie }, data] = await Promise.all([
          import("lottie-web/build/player/lottie_light"),
          fetch(src).then((r) => r.json()),
        ]);
        if (cancelled) return;
        const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        anim.current = lottie.loadAnimation({
          container: el,
          renderer: "svg",
          loop: !still,
          autoplay: false,
          animationData: data,
          rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
        });
        if (still) anim.current.goToAndStop(anim.current.totalFrames - 1, true);
        else if (isActive.current) anim.current.play();
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
      anim.current?.destroy();
      anim.current = null;
    };
  }, [src]);

  useEffect(() => {
    isActive.current = active;
    const a = anim.current;
    if (!a || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (active) a.goToAndPlay(0, true);
    else a.pause();
  }, [active]);

  return <div ref={box} className={className} role="img" aria-label={label} style={{ aspectRatio: ratio.replace(":", " / ") }} />;
}
