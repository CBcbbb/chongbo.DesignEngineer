import { profile } from "@content";

export function SiteFooter() {
  return (
    <footer className="foot">
      <span>
        {profile.name} · {profile.title} · {profile.location} ·{" "}
        <a href={`mailto:${profile.contact.email}`}>{profile.contact.email}</a>
      </span>
      <span className="note">Claude chooses which sections of my case files to print. It never writes them.</span>
    </footer>
  );
}
