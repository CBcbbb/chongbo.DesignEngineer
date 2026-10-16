import { HomeLink } from "@/components/nav/HomeLink";
import { profile } from "@content";
import { Pill, WorkPill } from "@/components/nav/Pill";
import { ThemeLamp } from "@/components/nav/ThemeLamp";

export function SiteHeader({ current }: { current?: "work" | "about" }) {
  return (
    <header className="bar">
      <HomeLink className="who">
        <b>{profile.name}</b>
        <span>
          {profile.title}, {profile.location}
        </span>
      </HomeLink>
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
