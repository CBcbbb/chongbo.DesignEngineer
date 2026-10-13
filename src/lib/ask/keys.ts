import type { Signal } from "@content/schema";

/**
 * Synonyms per signal. A term matches at the start of a word ("access" matches "accessible").
 * A trailing "!" means whole word only ("ai!" does not match "aim").
 */
export const KEYS: Record<Signal, string[]> = {
  accessibility: ["access", "a11y", "wcag", "screen reader", "screenreader", "keyboard", "inclusiv", "contrast", "disab", "assistive", "aria!", "blind", "low vision", "colour blind", "color blind"],
  "design-systems": ["design system", "token", "component librar", "figma", "consisten", "style guide", "styleguide", "theming", "theme", "variables"],
  "cross-platform": ["platform", "multiple product", "product line", "several product", "many product", "scale", "scaling", "cross platform", "multi brand", "ios!", "android", "web and mobile"],
  "design-eng-gap": ["engineer", "handoff", "hand off", "developer", "dev!", "devs!", "front end", "frontend", "code", "coding", "bridge", "gap", "react", "typescript", "tailwind", "css!", "html!", "implement", "between design"],
  "end-to-end": ["end to end", "ship", "from scratch", "solo", "alone", "own!", "ownership", "deliver", "launch", "zero to one", "idea to", "whole thing", "full stack", "fullstack"],
  // Not "website": a marketing website is a brand ask, and SEO only when they say so.
  "seo-performance": ["seo!", "performance", "fast", "search engine", "lighthouse", "speed", "web vitals", "metadata", "static", "discoverab"],
  "publishing-workflow": ["cms!", "publish", "content", "template", "workflow", "editor", "admin"],
  "reusable-components": ["reusab", "reuse", "component", "modular", "pattern librar", "building block"],
  "brand-storytelling": ["brand", "marketing", "story", "stories", "storytell", "landing", "campaign", "editorial", "narrative", "consumer", "website", "web site", "web!"],
  conversion: ["conversion", "convert", "growth", "ab test", "a b test", "split test", "experiment", "click", "tap through", "sales", "revenue", "funnel", "engagement"],
  "motion-interaction": ["motion", "animat", "interaction", "micro", "delight", "polish", "detail", "feel", "transition", "craft", "playful", "tactile"],
  typography: ["typograph", "type!", "typeface", "font", "layout", "visual design", "hierarchy", "grid", "colour", "color"],
  "data-architecture": ["api!", "apis", "back end", "backend", "server", "schema", "data contract", "data layer", "data model", "architecture", "full stack", "fullstack", "endpoint", "integration"],
  data: ["data", "visualis", "visualiz", "chart", "graph", "dashboard", "d3!", "network", "table", "spreadsheet", "messy"],
  prototyping: ["prototyp", "explor", "invent", "new interaction", "test idea", "early", "concept", "sketch", "iterat"],
  "ai-tools": ["ai!", "llm", "claude", "gpt", "chatgpt", "model", "cursor", "agent", "copilot", "machine learning", "artificial intelligence", "vibe"],
  research: ["research", "user!", "users", "usability", "testing", "interview", "insight", "observ", "student", "people", "empath"],
  judgement: ["decision", "trade off", "tradeoff", "why!", "approach", "think", "judgement", "judgment", "process", "prioriti", "choose", "choice", "opinion", "hard part"],
};

/** A term as a pattern on the visitor's own words, for marking what the printer recognised (PrintedToOrder). */
export function markPattern(): RegExp {
  const terms = [...new Set(Object.values(KEYS).flat())].sort((a, b) => b.length - a.length);
  const parts = terms.map((t) => {
    const whole = t.endsWith("!");
    const body = (whole ? t.slice(0, -1) : t)
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      .replace(/ /g, "[\\s-]+");
    return whole ? `${body}\\b` : `${body}[a-z]*`;
  });
  return new RegExp(`\\b(?:${parts.join("|")})`, "gi");
}
