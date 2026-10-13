import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "@content";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { projectNumber, trayMeta } from "@/lib/site";

export const metadata: Metadata = {
  title: "Work",
  description: "Every case file: design systems, accessible data tools, brand work and this site.",
  alternates: { canonical: "/work" },
};

export default function WorkIndex() {
  return (
    <div className="wrap">
      <SiteHeader current="work" />
      <main id="main" tabIndex={-1} className="pb-20">
        <p className="eyebrow">Case files</p>
        <h1 className="home-h1">All work</h1>
        <ul className="work-list">
          {projects.map((p) => (
            <li key={p.slug}>
              <Link className="work-card" href={`/work/${p.slug}`}>
                <span className="s-top">
                  <span>{projectNumber(p)}</span>
                  <span>{trayMeta(p)}</span>
                </span>
                <h2>{p.title}</h2>
                <p>{p.oneLiner}</p>
                <span className="go" aria-hidden="true">
                  See the whole project →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <SiteFooter />
    </div>
  );
}
