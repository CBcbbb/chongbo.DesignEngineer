import { describe, expect, it } from "vitest";
import { HIDDEN, projects } from "@content";
import { catalogue } from "@/lib/ask/catalogue";
import { fallbackAnswer, understand } from "@/lib/ask/fallback";
import { buildCardIndex } from "@/lib/cards";
import sitemap from "@/app/sitemap";

/** Hidden projects (content/index.ts) stay out of everything: pages, the sitemap, the AI's catalogue, the fallback. */
describe("hidden projects", () => {
  const hidden = [...HIDDEN];
  const BRIEFS = [
    "How did you build this portfolio?",
    "How did you build this site?",
    "Tell me about this website and the printer.",
    "Show me WildEcho, the wildlife sound project.",
  ];

  it("are not in the shown projects, the card index or the AI's catalogue", () => {
    expect(hidden.length).toBeGreaterThan(0);
    for (const slug of hidden) {
      expect(projects.some((p) => p.slug === slug), slug).toBe(false);
      expect(catalogue.some((e) => e.project.slug === slug), slug).toBe(false);
      expect(Object.keys(buildCardIndex()).some((k) => k.startsWith(`${slug}#`)), slug).toBe(false);
    }
  });

  it("are not in the sitemap", () => {
    const urls = sitemap().map((u) => u.url);
    for (const slug of hidden) expect(urls.some((u) => u.endsWith(`/work/${slug}`)), slug).toBe(false);
  });

  it("are never recognised from the words of a brief, and never printed", () => {
    for (const brief of BRIEFS) {
      const named = [...understand(brief, []).named];
      for (const slug of hidden) expect(named, brief).not.toContain(slug);
      for (const s of fallbackAnswer(brief).sheets) expect(hidden, brief).not.toContain(s.project);
    }
  });
});
