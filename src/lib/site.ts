import { mainProjects, projects, type Project, type Section, type Signal } from "@content";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");

/** Short labels for stamps and chips. The long names live in content SIGNALS. */
export const SIGNAL_SHORT: Record<Signal | "start-here", string> = {
  "end-to-end": "End to end",
  "design-systems": "Design systems",
  "cross-platform": "Cross-platform",
  "design-eng-gap": "Design–engineering",
  accessibility: "Accessibility",
  "seo-performance": "SEO and performance",
  "publishing-workflow": "Publishing",
  "reusable-components": "Reusable components",
  "brand-storytelling": "Brand",
  conversion: "Conversion",
  "motion-interaction": "Motion",
  typography: "Typography",
  data: "Data",
  prototyping: "Prototyping",
  "ai-tools": "AI tools",
  research: "Research",
  judgement: "Judgement",
  "start-here": "Start here",
};

/** Short place labels for the tray tickets (presentation only). */
const TRAY_PLACE: Record<string, string> = {
  "hhcd-data-platform": "RCA",
  "component-store": "Logistics",
  "nike-athletes-closet": "Nike app",
  "this-site": "Personal",
  wildecho: "RCA",
};

export function trayMeta(p: Project): string {
  const place = TRAY_PLACE[p.slug];
  return place ? `${p.status} · ${place}` : p.status;
}

/** "01".."04" for main work, "E1".. for earlier work. */
export function projectNumber(p: Project): string {
  const i = mainProjects.indexOf(p);
  if (i >= 0) return String(i + 1).padStart(2, "0");
  const earlier = projects.filter((x) => x.tier === "earlier");
  return `E${earlier.indexOf(p) + 1}`;
}

export function kindLabel(project: Project, section: Section): string {
  switch (section.kind) {
    case "problem":
      return "The problem";
    case "decision": {
      const n = project.sections.filter((s) => s.kind === "decision").indexOf(section) + 1;
      return `Decision ${String(n).padStart(2, "0")}`;
    }
    case "evidence":
      return "Evidence";
    case "outcome":
      return "Outcome";
    case "role":
      return section.id === "origin" ? "Where it came from" : "My part";
    case "retrospective":
      return "Looking back";
  }
}

export function caseHref(slug: string, section?: string): string {
  return section ? `/work/${slug}#${section}` : `/work/${slug}`;
}

export function askHref(q: string): string {
  return `/ask?q=${encodeURIComponent(q)}`;
}
