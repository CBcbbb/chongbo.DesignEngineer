import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "@content";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { PlayOnView } from "@/components/shell/PlayOnView";
import { ProjectCover } from "@/components/shell/ProjectCover";
import { projectNumber, trayMeta } from "@/lib/site";

export const metadata: Metadata = {
  title: "Work",
  description: "Every case file: design systems, accessible data tools and brand work.",
  alternates: { canonical: "/work" },
};

/**
 * Two by two (docs/case-studies/ux-proposals.md, 02): each card is its project's cover from the set, its number and
 * place, title, one line, and the role and period at the foot, aligned across a row. The whole card is the link; on
 * hover the card lifts and the cover's drawing moves (once in view on touch screens).
 */
export default function WorkIndex() {
  return (
    <div className="wrap">
      <SiteHeader current="work" />
      <main id="main" tabIndex={-1} className="pb-20">
        <p className="eyebrow">Case files</p>
        <h1 className="home-h1">All work</h1>
        <ul className="work-list">
          {projects.map((p) => {
            const place = trayMeta(p);
            return (
              <li key={p.slug}>
                <Link className="work-card" href={`/work/${p.slug}`} data-play-host="">
                  <ProjectCover slug={p.slug} className="work-cv" />
                  <div className="work-tx">
                    <span className="work-meta">
                      {projectNumber(p)}
                      {place && ` · ${place}`}
                    </span>
                    <h2>{p.title}</h2>
                    <span className="work-one">{p.oneLiner}</span>
                    <span className="work-role">
                      <span>{p.role}</span>
                      {p.period && <span className="work-period">{p.period}</span>}
                    </span>
                  </div>
                  <PlayOnView />
                </Link>
              </li>
            );
          })}
        </ul>
      </main>
      <SiteFooter />
    </div>
  );
}
