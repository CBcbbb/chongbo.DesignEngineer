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
const HIDDEN = new Set(["this-site", "wildecho"]);

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
    "I studied civil engineering at Tongji University before moving into design. Engineering taught me to understand what a system has to carry before deciding how it should look, and I still work that way: the data and its edge cases first, the surface last.",
    "I take my work from Figma to production myself, so the details that matter survive the handover from design to code.",
    "Many of my skills were learnt mid-project, because the work needed them. I intend to keep learning that way for the rest of my career.",
  ],
  education: ["MA Service Design, Royal College of Art, 2024", "BEng Civil Engineering, Tongji University"],
  contact: {
    email: "ningchongbo2000@gmail.com",
    linkedin: "https://www.linkedin.com/in/chongbo-ning",
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
