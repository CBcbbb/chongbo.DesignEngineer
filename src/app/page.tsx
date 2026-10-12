import type { ReactNode } from "react";
import localFont from "next/font/local";
import { profile, projects, suggestedQuestions } from "@content";
import { Projector } from "@/components/projector/Projector";
import { sheetEvidence } from "@/components/SheetEvidence";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { buildCardIndex, cardKey } from "@/lib/cards";
import { slideHasMedia } from "@/lib/projector";
import { SITE_URL } from "@/lib/site";

/**
 * Instrument Serif, for the display-type review (`/?type=serif`). Not preloaded: the browser only fetches it when the
 * serif is switched on.
 */
const serif = localFont({ src: "./fonts/InstrumentSerif-Regular.woff2", variable: "--font-serif", display: "swap", preload: false });

/**
 * Each section's evidence, rendered on the server and handed to the projector: the same block as on its case-file card
 * (and on /ask). Older projects use the compact slot, which leaves out what only works in the full case file.
 */
function slideMedia(): Record<string, ReactNode> {
  const out: Record<string, ReactNode> = {};
  for (const p of projects)
    for (const [i, s] of p.sections.entries())
      if (s.media && (p.template === "case-file" || slideHasMedia(s.media))) out[cardKey(p.slug, s.id)] = sheetEvidence(p, s, i);
  return out;
}

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    description: profile.headline,
    url: SITE_URL,
    email: `mailto:${profile.contact.email}`,
    address: { "@type": "PostalAddress", addressLocality: profile.location, addressCountry: "GB" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "Royal College of Art" },
    sameAs: [profile.contact.linkedin, profile.contact.github],
    knowsAbout: ["Design engineering", "Design systems", "Accessibility", "React", "TypeScript", "Data visualisation"],
    workExample: projects.map((p) => ({ "@type": "CreativeWork", name: p.title, url: `${SITE_URL}/work/${p.slug}` })),
  };

  return (
    <div className={`wrap ${serif.variable}`}>
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <Projector
          cards={buildCardIndex()}
          media={slideMedia()}
          questions={suggestedQuestions}
          name={profile.name}
          location={profile.location}
        />
      </main>
      <SiteFooter note={false} />
      <script
        type="application/ld+json"
        // Static, trusted data built from content/.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </div>
  );
}
