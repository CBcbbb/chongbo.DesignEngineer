import { profile } from "@content";

/** `note`: the line saying what the AI does. The home page says it beside the projector instead. */
export function SiteFooter({ note = true }: { note?: boolean }) {
  return (
    <footer className="foot">
      <span>
        {profile.name} · {profile.title} · {profile.location} ·{" "}
        <a href={`mailto:${profile.contact.email}`}>{profile.contact.email}</a>
      </span>
      {note && <span className="note">Claude chooses which sections of my case files to show. It never writes them.</span>}
    </footer>
  );
}
