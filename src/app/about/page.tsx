import type { Metadata } from "next";
import Link from "next/link";
import { earlierProjects, mainProjects, profile } from "@content";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { projectNumber } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: profile.summary[0],
  alternates: { canonical: "/about" },
  openGraph: { type: "profile", title: `About ${profile.name}`, description: profile.summary[0], url: "/about" },
};

export default function About() {
  const { contact } = profile;
  const elsewhere = [
    { label: "LinkedIn", href: contact.linkedin },
    { label: "GitHub", href: contact.github },
    { label: "Older work (archive)", href: contact.archive },
  ];
  return (
    <div className="wrap">
      <SiteHeader current="about" />
      <main id="main" tabIndex={-1} className="about pb-20 pt-6 sm:pt-12">
        <div className="about-grid">
          <div className="paper-drop about-card-wrap">
            <section className="ticket torn about-card" aria-labelledby="about-title">
              <div className="t-head">
                <span>No. 000 · About</span>
                <span>{profile.location}</span>
              </div>
              <h1 id="about-title" className="about-h1">
                {profile.name}
              </h1>
              <p className="t-label">{profile.title}</p>
              <p className="t-reply mt-5">{profile.headline}</p>
              <hr className="t-rule" />
              <div className="t-label">Write to me</div>
              <p className="about-email">
                <span className="select-all">{contact.email}</span>
              </p>
              <a className="t-link" href={`mailto:${contact.email}`}>
                Send an email
              </a>
              <hr className="t-rule" />
              <div className="t-label">Elsewhere</div>
              <ul className="t-also">
                {elsewhere.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} rel="noopener me" target="_blank">
                      {l.label}
                      <span aria-hidden="true">↗</span>
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="about-text">
            <section aria-labelledby="summary-title">
              <h2 id="summary-title" className="about-h2">
                What I do
              </h2>
              {profile.summary.map((p) => (
                <p key={p.slice(0, 24)} className="about-p">
                  {p}
                </p>
              ))}
            </section>

            <section aria-labelledby="edu-title" className="mt-12">
              <h2 id="edu-title" className="about-h2">
                Education
              </h2>
              <ul className="about-list">
                {profile.education.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="work-title" className="mt-12">
              <h2 id="work-title" className="about-h2">
                Case files
              </h2>
              <ul className="about-list about-work">
                {[...mainProjects, ...earlierProjects].map((p) => (
                  <li key={p.slug}>
                    <Link href={`/work/${p.slug}`}>
                      <span className="meta">{projectNumber(p)}</span>
                      <span>
                        <b>{p.title}</b> <span className="text-ink-2">{p.oneLiner}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
