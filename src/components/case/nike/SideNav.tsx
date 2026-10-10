"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const NAV = [
  { href: "#brief", label: "Brief & Contributions", parts: ["brief"] },
  { href: "#challenges", label: "Key Challenges & Solutions", parts: ["challenges", "graphic-system", "imagery", "product-card", "delight", "star-voice"] },
  { href: "#retouching", label: "Retouch & Mood", parts: ["retouching"] },
  { href: "#outcome", label: "Results & Feedback", parts: ["outcome"] },
  { href: "#summary", label: "Project Summary", parts: ["summary"] },
];

/**
 * The floating section list from the Wix page. Like the parts rail on other case files, the entry
 * holding the part named in the URL hash (where a printed sheet's "Full project" link lands) is current.
 */
export function SideNav() {
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    const read = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      setCurrent(NAV.find((n) => n.parts.includes(id))?.href ?? null);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  return (
    <nav className="nk-side" aria-label="On this page">
      <ul>
        <li>
          <Link href="/" className="nk-side-home">
            Back Home
          </Link>
        </li>
        {NAV.map((n) => (
          <li key={n.href}>
            <a href={n.href} aria-current={n.href === current ? "step" : undefined}>
              {n.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
