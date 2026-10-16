import { profile, projects } from "@content";
import { PrintedToOrder } from "@/components/PrintedToOrder";
// Nothing from the case files is rendered here, but printed cards arrive from `printCards` after a print, and their
// client parts and stylesheets have to belong to this page. Importing the module registers them; it ships no cards.
import "@/components/PrintedCard";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { buildCardIndex, shownTopics } from "@/lib/cards";
import { SITE_URL } from "@/lib/site";
import type { CuratedSelection } from "@/lib/curated";

export function HomePage({ selection }: { selection?: CuratedSelection }) {
  const topics = selection
    ? [{ id: selection.id, label: selection.label, signals: [] }, ...shownTopics().filter((topic) => topic.id !== selection.replacesTopic)]
    : shownTopics();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    description: profile.headline,
    url: SITE_URL,
    email: `mailto:${profile.contact.email}`,
    address: { "@type": "PostalAddress", addressLocality: profile.location, addressCountry: "GB" },
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "Royal College of Art" },
      { "@type": "CollegeOrUniversity", name: "Tongji University" },
    ],
    sameAs: [profile.contact.linkedin],
    knowsAbout: ["Design engineering", "Design systems", "Accessibility", "React", "TypeScript", "Data visualisation"],
    workExample: projects.map((p) => ({ "@type": "CreativeWork", name: p.title, url: `${SITE_URL}/work/${p.slug}` })),
  };

  return (
    <div className="wrap">
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <p className="eyebrow">Printed to order</p>
        <h1 id="home-title" className="home-h1">
          What are you looking for?
        </h1>
        <p className="home-intro">
          <b>I&apos;m Chongbo, a design engineer in {profile.location}.</b> Pick what your role needs, or paste the job description,
          and my printer turns out the parts of my work that match.
        </p>
        <PrintedToOrder cards={buildCardIndex()} contactEmail={profile.contact.email} labelledBy="home-title" topics={topics} selection={selection} />
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        // Static, trusted data built from content/.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </div>
  );
}
