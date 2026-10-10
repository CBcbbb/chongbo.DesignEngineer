import type { ReactNode } from "react";
import { profile, projects } from "@content";
import { MediaSlot } from "@/components/media/MediaSlot";
import { PrintedToOrder } from "@/components/PrintedToOrder";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { buildCardIndex, cardKey } from "@/lib/cards";
import { SITE_URL } from "@/lib/site";

/** Each section's media, rendered on the server and handed to the deck. */
function sheetMedia(): Record<string, ReactNode> {
  const out: Record<string, ReactNode> = {};
  for (const p of projects) for (const s of p.sections) if (s.media) out[cardKey(p.slug, s.id)] = <MediaSlot media={s.media} compact />;
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
    <div className="wrap">
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <p className="eyebrow">Printed to order</p>
        <h1 id="home-title" className="home-h1">
          What skills are you looking for?
        </h1>
        <PrintedToOrder cards={buildCardIndex()} media={sheetMedia()} labelledBy="home-title" />
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
