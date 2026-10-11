"use client";

import { useEffect, useState } from "react";

export type ContentsPart = { id: string; n: string; label: string; cards: { id: string; label: string }[] };

/**
 * Contents, the same on every case file: the project, then each part with its cards.
 * Marks the card in view (aria-current="step"; the project itself above the first part) and its part, with one
 * marker at a time. Below 1000px it becomes a strip of parts.
 * The card named in the URL hash (where a printed sheet's "Full project" link lands) is ringed on the page.
 */
export function CaseContents({ title, parts }: { title: string; parts: ContentsPart[] }) {
  const [card, setCard] = useState<string | null>(null);
  const partOf = (id: string | null) => parts.find((p) => p.id === id || p.cards.some((c) => c.id === id))?.id ?? null;

  useEffect(() => {
    const ids = parts.flatMap((p) => [p.id, ...p.cards.map((c) => c.id)]);
    let frame = 0;
    /* The current card is the last one whose top has passed 40% of the viewport; none above the first part. */
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
    const markHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      for (const x of ids) document.getElementById(x)?.classList.toggle("is-current", x === id);
    };
    frame = requestAnimationFrame(update);
    markHash();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("hashchange", onScroll);
    window.addEventListener("hashchange", markHash);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("hashchange", onScroll);
      window.removeEventListener("hashchange", markHash);
    };
  }, [parts]);

  const activePart = partOf(card);
  const isCard = (id: string) => parts.some((p) => p.cards.some((c) => c.id === id));

  return (
    <nav className="cf-toc" aria-label="Contents">
      {/* Above the first part (the cover and the work), the project itself is where you are. */}
      <a className="cf-toc-proj" href="#top" aria-current={card === null ? "step" : undefined}>
        {title}
      </a>
      <ol>
        {parts.map((p) => (
          <li key={p.id} className="cf-toc-part" data-active={activePart === p.id}>
            <a href={`#${p.id}`} aria-current={card === p.id && !isCard(p.id) ? "step" : undefined}>
              <span className="cf-n">{p.n}</span>
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
