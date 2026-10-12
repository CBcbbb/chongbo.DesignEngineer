import Link from "next/link";
import { profile } from "@content";
import { NavLink } from "@/components/nav/NavLink";

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
            <NavLink kind="work" href="/work" label="Work" current={current === "work"} />
          </li>
          <li>
            <NavLink kind="about" href="/about" label="About" current={current === "about"} />
          </li>
        </ul>
      </nav>
    </header>
  );
}
