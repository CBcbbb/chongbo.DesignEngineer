import { profile, projects, suggestedQuestions } from "@content";
import { Machine } from "@/components/Machine";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { WelcomeTicket } from "@/components/Ticket";
import { Tray } from "@/components/Tray";
import { buildCardIndex } from "@/lib/cards";
import { SITE_URL } from "@/lib/site";

const TRIES = [
  { label: "Accessibility", q: suggestedQuestions[0] ?? "What matters most to us is accessibility.", project: "HHCD" },
  { label: "Design systems", q: suggestedQuestions[2] ?? "Have you built a design system?", project: "Component Store" },
  { label: "Brand and motion", q: suggestedQuestions[3] ?? "Show me brand or marketing work.", project: "Nike" },
];

const CHIPS = [
  { label: "End-to-end work", q: suggestedQuestions[1] ?? "Show me something you built end to end." },
  { label: "Design and engineering", q: "How do you work between design and engineering?" },
  { label: "AI tools", q: "How do you use AI in your work?" },
];

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
        <section className="stage" aria-labelledby="stage-title">
          <h1 id="stage-title" className="sr-only">
            Ask Chongbo Ning, design engineer, about his work
          </h1>
          <Machine cards={buildCardIndex()} welcome={<WelcomeTicket tries={TRIES} />} chips={CHIPS} />
        </section>
        <Tray />
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
