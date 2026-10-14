import "server-only";

import type { Profile, Project } from "./schema";
import { hhcd } from "./projects/hhcd";
import { anyData } from "./projects/components-for-any-data";
import { designSystem } from "./projects/design-system";
import { nike } from "./projects/nike";
import { thisSite } from "./projects/this-site";
import { wildecho } from "./projects/wildecho";

export * from "./schema";

/**
 * Hidden for now (Chongbo, 12 Oct 2026: no time to rework them before they go out). A hidden project is left out of
 * everything: the work list, its page (404), the printer, the sitemap. Remove a slug to bring the project back.
 */
export const HIDDEN = new Set(["this-site", "wildecho"]);

/** Order is the dealing order on the table. */
export const projects: Project[] = [hhcd, anyData, designSystem, nike, thisSite, wildecho].filter((p) => !HIDDEN.has(p.slug));

export const mainProjects = projects.filter((p) => p.tier === "main");
export const earlierProjects = projects.filter((p) => p.tier === "earlier");

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export const profile: Profile = {
  name: "Chongbo Ning",
  title: "Design Engineer",
  location: "London",
  headline: "I design interfaces and build them, from the data model to the last detail of motion.",
  summary: [
    "My work spans design systems that ship as code packages, data-heavy interfaces that stay accessible, and brand work that has to earn a tap.",
    "At Tigris Systems I own design end to end: I run the design system and build front-end tools. Before that I built research platforms for Brunel University and the Royal College of Art, and taught data visualisation to the Helen Hamlyn Centre's summer interns.",
  ],
  education: ["MA Service Design, Royal College of Art, 2024", "BEng Civil Engineering, Tongji University, 2023"],
  contact: {
    email: "ningchongbo2000@gmail.com",
    linkedin: "https://www.linkedin.com/in/chongbo-ning",
    github: "https://github.com/CBcbbb",
    archive: "https://ningchongbo.wixsite.com/homepage",
  },
};

/** Suggested questions for the ask box, written as a recruiter would ask. */
export const suggestedQuestions = [
  "What matters most to us is accessibility.",
  "Show me something you built end to end.",
  "Have you built a design system?",
  "Show me brand or marketing work.",
];
