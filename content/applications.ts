import "server-only";
import type { Signal } from "./schema";

/** /for/<name>: topics are ordered by importance; the name becomes the analytics ref. */
export const applications = {
  // Granola — Design Engineer (Web & Brand): brand first, then reuse, engineering and accessible interaction.
  granola: {
    topics: ["brand-storytelling", "reusable-components", "design-eng-gap", "accessibility", "motion-interaction"],
  },
} satisfies Record<string, { topics: Signal[] }>;

export function applicationHref(name: string, test = false): string {
  if (!Object.hasOwn(applications, name)) return "/";
  const application = applications[name as keyof typeof applications];
  const query = new URLSearchParams({ topics: application.topics.join(","), ref: test ? "test" : name });
  return `/ask?${query}`;
}
