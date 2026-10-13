import { mainProjects, projects, type Project, type Section } from "@content";

/**
 * Absolute base for canonical URLs, Open Graph images and the sitemap. On Vercel, falls back to the
 * project's production domain, so shared links never point at localhost.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")
).replace(/\/+$/, "");

export { SIGNAL_SHORT } from "./printed";

/** Short place labels for the tray tickets (presentation only). */
const TRAY_PLACE: Record<string, string> = {
  "hhcd-data-platform": "RCA",
  "components-for-any-data": "Logistics",
  "design-system": "Logistics",
  "nike-athletes-closet": "Nike app",
  "this-site": "Personal",
  wildecho: "RCA",
};

export function trayMeta(p: Project): string {
  const place = TRAY_PLACE[p.slug];
  return place ?? "";
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
