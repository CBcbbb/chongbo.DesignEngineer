import "server-only";
import type { CuratedSelection } from "@/lib/curated";

/** /for/<name>: the same home-page printer, with one optional set of hand-picked cards. */
export const applications = {
  granola: {
    company: "Granola",
    replacesTopic: "research",
    brand: {
      color: "#5b7000",
      logo: { src: "/applications/granola.svg", width: 148, height: 32 },
    },
    cards: [
      "design-system#three-layers", // 01.3
      "design-system#figma-library", // 02.1
      "design-system#in-code", // 02.2
      "nike-athletes-closet#graphic-system", // 01.1
      "hhcd-data-platform#contrast", // 02.6
    ],
  },
} satisfies Record<string, Omit<CuratedSelection, "id" | "label">>;

export function applicationSelection(name: string): CuratedSelection | null {
  if (!Object.hasOwn(applications, name)) return null;
  const application = applications[name as keyof typeof applications];
  return { ...application, id: `picked-for-${name}`, label: `Picked for ${application.company}` };
}
