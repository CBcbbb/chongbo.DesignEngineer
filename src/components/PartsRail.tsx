"use client";

import { useEffect, useState } from "react";
import { pad2 } from "@/lib/printed";

type Part = { id: string; title: string };

/**
 * The case file's parts, numbered in order. The part named in the URL hash (where a printed sheet's
 * "Full project" link lands) is marked current, here and on its card.
 */
export function PartsRail({ parts }: { parts: Part[] }) {
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    const read = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      setCurrent(parts.some((p) => p.id === id) ? id : null);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, [parts]);

  useEffect(() => {
    for (const p of parts) document.getElementById(p.id)?.classList.toggle("is-current", p.id === current);
  }, [current, parts]);

  return (
    <nav className="rail" aria-labelledby="parts-title">
      <h2 id="parts-title">Parts</h2>
      <p>
        {parts.length} parts, in order. Start anywhere.
      </p>
      <ol>
        {parts.map((p, i) => (
          <li key={p.id}>
            <a href={`#${p.id}`} aria-current={p.id === current ? "step" : undefined}>
              <span>{pad2(i + 1)}</span>
              {p.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
