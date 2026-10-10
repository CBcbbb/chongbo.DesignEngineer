import { profile } from "@content";

export function SiteFooter() {
  return (
    <footer className="foot">
      <span>
        {profile.name} · {profile.title} · {profile.location} ·{" "}
        <a href={`mailto:${profile.contact.email}`}>{profile.contact.email}</a>
      </span>
      <span className="note">Answers are chosen from my case files by Claude, with keyword matching as a fallback.</span>
    </footer>
  );
}
