import "server-only";
import type { CuratedSelection } from "@/lib/curated";

/** /for/<name>: the same home-page printer, with one optional set of hand-picked cards. */
export const applications = {
  granola: {
    company: "Granola",
    replacesTopic: "research",
    cards: [
      "design-system#three-layers", // 01.3
      "design-system#figma-library", // 02.1
      "design-system#in-code", // 02.2
      "nike-athletes-closet#graphic-system", // 01.1
      "hhcd-data-platform#contrast", // 02.6
    ],
  },
} satisfies Record<string, { company: string; replacesTopic: string; cards: string[] }>;

export function applicationSelection(name: string): CuratedSelection | null {
  if (!Object.hasOwn(applications, name)) return null;
  const application = applications[name as keyof typeof applications];
  return { ...application, id: `picked-for-${name}`, label: `Picked for ${application.company}` };
}
