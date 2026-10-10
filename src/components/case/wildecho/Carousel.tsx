"use client";

import { useRef } from "react";

/**
 * A scroll-snap strip with arrow buttons, standing in for the Wix galleries. `single` shows one item at
 * a time; otherwise items keep their own width and the next one peeks in at the edge.
 */
export function Carousel({
  label,
  items,
  single = false,
  className,
}: {
  label: string;
  items: React.ReactNode[];
  single?: boolean;
  className?: string;
}) {
  const track = useRef<HTMLDivElement>(null);

  const go = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const step = (el.firstElementChild as HTMLElement | null)?.offsetWidth ?? el.clientWidth;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
    const atStart = el.scrollLeft <= 2;
    // Wrap around at either end, as the Wix galleries loop.
    if (dir === 1 && atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
    else if (dir === -1 && atStart) el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
    else el.scrollBy({ left: dir * (step + 12), behavior: "smooth" });
  };

  return (
    <section className={`we-car ${single ? "we-car-single" : ""} ${className ?? ""}`} aria-roledescription="carousel" aria-label={label}>
      <div ref={track} className="we-car-track" tabIndex={0} aria-label={`${label}, scrollable`}>
        {items.map((item, i) => (
          <div key={i} className="we-car-item" role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${items.length}`}>
            {item}
          </div>
        ))}
      </div>
      <button type="button" className="we-car-btn we-car-prev" onClick={() => go(-1)} aria-label="Previous image">
        <Chevron />
      </button>
      <button type="button" className="we-car-btn we-car-next" onClick={() => go(1)} aria-label="Next image">
        <Chevron />
      </button>
    </section>
  );
}

function Chevron() {
  return (
    <svg width="10" height="18" viewBox="0 0 10 18" aria-hidden="true">
      <path d="M9 1 1 9l8 8" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
