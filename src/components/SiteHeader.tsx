import Link from "next/link";
import { profile } from "@content";

export function SiteHeader({ current }: { current?: "work" | "about" }) {
  return (
    <header className="bar">
      <Link className="who" href="/">
        <b>{profile.name}</b>
        <span>
          {profile.title}, {profile.location}
        </span>
      </Link>
      <nav aria-label="Main">
        <ul>
          <li>
            <Link href="/#tray" aria-current={current === "work" ? "page" : undefined}>
              Work
            </Link>
          </li>
          <li>
            <Link href="/about" aria-current={current === "about" ? "page" : undefined}>
              About
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
