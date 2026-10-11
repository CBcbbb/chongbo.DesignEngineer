"use client";

import { useEffect, useState } from "react";

export type RailPart = { id: string; label: string; title: string; cards: { id: string; title: string; n: string }[] };

/**
 * The case file's parts and cards, in order. The card named in the URL hash (where a printed sheet's
 * "Full project" link lands) is marked current, here and on its card; the card being read is marked as you scroll.
 */
export function CaseRail({ parts }: { parts: RailPart[] }) {
  const [current, setCurrent] = useState<string | null>(null);
  const [reading, setReading] = useState<string | null>(null);
  const ids = parts.flatMap((p) => p.cards.map((c) => c.id));

  useEffect(() => {
    const read = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      setCurrent(ids.includes(id) ? id : null);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
    // ids is derived from props and stable for a page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    for (const id of ids) document.getElementById(id)?.classList.toggle("is-current", id === current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const seen = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) seen.set(e.target.id, e.isIntersecting);
        const first = ids.find((id) => seen.get(id));
        if (first) setReading(first);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <nav className="cf-rail" aria-labelledby="cf-parts-title">
      <h2 id="cf-parts-title" className="cf-mono">
        Contents
      </h2>
      {parts.map((part) => (
        <div key={part.id} className="cf-rail-part">
          <p>
            <span className="cf-mono">{part.label}</span>
            {part.title}
          </p>
          <ol>
            {part.cards.map((c) => (
              <li key={c.id}>
                <a
                  href={`#${c.id}`}
                  aria-current={c.id === current ? "step" : undefined}
                  className={c.id === reading ? "is-reading" : undefined}
                >
                  <span>{c.n}</span>
                  {c.title}
                </a>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </nav>
  );
}
