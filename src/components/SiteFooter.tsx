import { profile } from "@content";
import { FooterNote } from "./shell/FooterParts";

/**
 * Two things only (docs/case-studies/ux-proposals.md, 05): the note about AI, because the printer is on the site,
 * and a way to write to me, because case pages rely on the footer for contact: "Say hello" and a paper plane, one
 * mailto link (the address shows as its tooltip). Name, role and city are in the header;
 * LinkedIn is on About. The address lives in one place, `profile.contact.email` (content/index.ts).
 */
export function SiteFooter() {
  const { email } = profile.contact;
  return (
    <footer className="foot">
      <FooterNote lead="AI fetches the work." claim="I made it." />
      <span className="ft-mail">
        <span>
          Want the human?{" "}
          <a href={`mailto:${email}`} title={email}>
            <span className="ft-hello">Say hello</span>.
            <svg className="ft-plane" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M3.2 10.6C9 8.2 15 5.8 20.8 3.4c-1.9 5.6-4 11.2-6.2 16.8-1.2-2.8-2.4-5.6-3.7-8.3-2.5-.4-5.1-.8-7.7-1.3z" />
              <path d="M10.9 11.9c3.3-2.8 6.6-5.6 9.9-8.5" />
            </svg>
          </a>
        </span>
      </span>
    </footer>
  );
}
