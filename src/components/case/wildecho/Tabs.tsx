"use client";

import { useId, useRef, useState } from "react";

export type Tab = { label: string; panel: React.ReactNode };

/** The pill tabs that switch between the three test rounds on the Wix page (ARIA tabs pattern). */
export function Tabs({ label, tabs }: { label: string; tabs: Tab[] }) {
  const [at, setAt] = useState(0);
  const id = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const move = (i: number) => {
    const n = (i + tabs.length) % tabs.length;
    setAt(n);
    refs.current[n]?.focus();
  };

  return (
    <div className="we-tabs">
      <div
        role="tablist"
        aria-label={label}
        className="we-tablist"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") move(at + 1);
          else if (e.key === "ArrowLeft") move(at - 1);
          else if (e.key === "Home") move(0);
          else if (e.key === "End") move(tabs.length - 1);
          else return;
          e.preventDefault();
        }}
      >
        {tabs.map((t, i) => (
          <button
            key={t.label}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${id}-tab-${i}`}
            aria-selected={i === at}
            aria-controls={`${id}-panel-${i}`}
            tabIndex={i === at ? 0 : -1}
            onClick={() => setAt(i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div
          key={t.label}
          role="tabpanel"
          id={`${id}-panel-${i}`}
          aria-labelledby={`${id}-tab-${i}`}
          hidden={i !== at}
          className="we-panel"
        >
          {t.panel}
        </div>
      ))}
    </div>
  );
}
