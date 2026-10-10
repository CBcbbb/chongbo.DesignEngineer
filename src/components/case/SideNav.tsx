"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export type SideNavItem = {
  href: string;
  label: string;
  /** Section ids that count as this entry, so a deep link to any of them marks it current. */
  parts: string[];
};

/**
 * The floating section list from the old Wix pages. Like the parts rail on other case files, the entry
 * holding the part named in the URL hash (where a printed sheet's "Full project" link lands) is current.
 */
export function SideNav({ items, className }: { items: SideNavItem[]; className: string }) {
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    const read = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      setCurrent(items.find((n) => n.parts.includes(id))?.href ?? null);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, [items]);

  return (
    <nav className={className} aria-label="On this page">
      <ul>
        <li>
          <Link href="/" data-home>
            Back Home
          </Link>
        </li>
        {items.map((n) => (
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
