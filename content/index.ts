import type { Profile, Project } from "./schema";
import { hhcd } from "./projects/hhcd";
import { componentStore } from "./projects/component-store";
import { nike } from "./projects/nike";
import { thisSite } from "./projects/this-site";
import { wildecho } from "./projects/wildecho";

export * from "./schema";

/** Order is the dealing order on the table. */
export const projects: Project[] = [hhcd, componentStore, nike, thisSite, wildecho];

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
    "I work across design and code: design systems that ship as packages, data-heavy interfaces that stay accessible, and brand work that has to earn a tap.",
    "I'm currently the only designer at a logistics infrastructure company, where I run the design system and build its front-end tools. Before that I built research platforms for the Royal College of Art and Brunel University, and later taught data visualisation to the Helen Hamlyn Centre's summer interns.",
  ],
  education: ["MA Service Design, Royal College of Art, 2024"],
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
