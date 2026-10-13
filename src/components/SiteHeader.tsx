import Link from "next/link";
import { profile } from "@content";
import { Pill, WorkPill } from "@/components/nav/Pill";
import { ThemeLamp } from "@/components/nav/ThemeLamp";

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
            <WorkPill current={current === "work"} />
          </li>
          <li>
            <Pill kind="about" href="/about" label="About" current={current === "about"} />
          </li>
          <li>
            <ThemeLamp />
          </li>
        </ul>
      </nav>
    </header>
  );
}
