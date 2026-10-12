import { profile } from "@content";

export function SiteFooter() {
  return (
    <footer className="foot">
      <span>
        {profile.name} · {profile.title} · {profile.location} ·{" "}
        <a href={`mailto:${profile.contact.email}`}>{profile.contact.email}</a>
      </span>
      <span className="note">AI helps you find the parts of my case files that match your question. Every word in them is mine.</span>
    </footer>
  );
}
