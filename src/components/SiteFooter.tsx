import { profile } from "@content";
import { CopyEmail, FooterNote } from "./shell/FooterParts";

/**
 * Two things only (docs/case-studies/ux-proposals.md, 05): the note about AI, because the printer is on the site,
 * and the email, because case pages rely on the footer for contact. Name, role and city are in the header; LinkedIn
 * is on About.
 */
export function SiteFooter() {
  const { email } = profile.contact;
  return (
    <footer className="foot">
      <FooterNote lead="AI fetches the work." claim="I made it." />
      <span className="ft-mail">
        <a href={`mailto:${email}`}>{email}</a>
        <CopyEmail email={email} />
      </span>
    </footer>
  );
}
