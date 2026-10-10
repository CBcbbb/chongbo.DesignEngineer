"use client";

import { createContext, useId, useState } from "react";

/** True inside the slide that is showing, so animations can pause on the others. */
export const SlideActive = createContext(true);

export type Slide = {
  n: string;
  title?: string;
  text: string;
  media: React.ReactNode;
};

/** The orange gradient carousel used for each challenge's solutions on the Wix page. */
export function Slideshow({ label, slides }: { label: string; slides: Slide[] }) {
  const [at, setAt] = useState(0);
  const id = useId();
  const go = (i: number) => setAt((i + slides.length) % slides.length);

  return (
    <section
      className="nk-show"
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(at + 1);
        if (e.key === "ArrowLeft") go(at - 1);
      }}
    >
      <div className="nk-slides">
        {slides.map((s, i) => (
          <div
            key={s.n}
            id={`${id}-${i}`}
            className="nk-slide"
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
            aria-hidden={i !== at}
            inert={i !== at}
            data-on={i === at || undefined}
          >
            <div className="nk-slide-text">
              <p className="nk-slide-n">{s.n}</p>
              {s.title && <h4 className="nk-slide-title">{s.title}</h4>}
              <p>{s.text}</p>
            </div>
            <div className="nk-slide-media">
              <SlideActive.Provider value={i === at}>{s.media}</SlideActive.Provider>
            </div>
          </div>
        ))}
      </div>
      {slides.length > 1 && (
        <>
          <button type="button" className="nk-arrow nk-arrow-prev" onClick={() => go(at - 1)} aria-label="Previous slide">
            <Chevron />
          </button>
          <button type="button" className="nk-arrow nk-arrow-next" onClick={() => go(at + 1)} aria-label="Next slide">
            <Chevron />
          </button>
          <div className="nk-dots">
            {slides.map((s, i) => (
              <button
                key={s.n}
                type="button"
                aria-label={`Slide ${i + 1}`}
                aria-controls={`${id}-${i}`}
                aria-current={i === at || undefined}
                onClick={() => go(i)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function Chevron() {
  return (
    <svg width="18" height="34" viewBox="0 0 18 34" aria-hidden="true">
      <path d="M17 1 1 17l16 16" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
