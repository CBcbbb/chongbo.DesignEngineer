/**
 * Content model for the portfolio.
 *
 * Every project is a "case file": an ordered set of section cards.
 * The browse view and project pages show the cards in order; the AI
 * entry picks individual cards by their signals. Content is written
 * once here and used by both.
 */

/** Capabilities a recruiter might ask about, mapped to the two Granola JDs. */
export const SIGNALS = {
  "end-to-end": "End-to-end delivery",
  "design-systems": "Design systems",
  "cross-platform": "Consistency across platforms",
  "design-eng-gap": "Closing design–engineering gaps",
  accessibility: "Accessibility",
  "seo-performance": "SEO and performance",
  "publishing-workflow": "Publishing workflows",
  "reusable-components": "Reusable components",
  "brand-storytelling": "Brand and storytelling",
  conversion: "Conversion",
  "motion-interaction": "Motion and interaction",
  typography: "Typography and layout",
  data: "Data and visualisation",
  prototyping: "Prototyping new interactions",
  "ai-tools": "Working with AI tools",
  research: "Research and testing",
  judgement: "Judgement and trade-offs",
} as const;

export type Signal = keyof typeof SIGNALS;

export type SectionKind =
  | "problem"
  | "role"
  | "decision"
  | "evidence"
  | "outcome"
  | "retrospective";

/**
 * A media slot. `asset` names the file the owner still needs to supply;
 * until it exists, the site renders a labelled placeholder using `need`.
 */
export type Media =
  | {
      kind: "image";
      asset: string;
      alt: string;
      caption?: string;
      need: string;
      ratio: "16:10" | "4:3" | "1:1" | "9:16";
    }
  | {
      kind: "video";
      asset: string;
      poster?: string;
      alt: string;
      caption?: string;
      need: string;
      ratio: "16:10" | "9:16";
    }
  | { kind: "code"; language: "css" | "ts" | "tsx"; code: string; caption?: string }
  | { kind: "diagram"; diagram: "data-contracts" | "token-layers"; caption?: string };

export type Section = {
  id: string;
  kind: SectionKind;
  title: string;
  /** Short paragraphs. Two to four sentences each, at most two paragraphs. */
  body: string[];
  signals: Signal[];
  media?: Media;
};

export type ProjectLink = { label: string; href: string };

export type Project = {
  slug: string;
  title: string;
  /** One sentence, shown on the card face. */
  oneLiner: string;
  /** Where and when, e.g. "Helen Hamlyn Centre for Design · 2025". */
  context: string;
  role: string;
  status: "Live" | "In use" | "Shipped" | "Concept";
  stack: string[];
  links: ProjectLink[];
  /** Main cards are dealt on the table; earlier work sits in the archive drawer. */
  tier: "main" | "earlier";
  /** Card tab colour. Token name from the design system. */
  tab: "stamp" | "ink" | "moss" | "slate";
  cover: Media;
  sections: Section[];
  /** Questions the ask box suggests when this card is on the table. */
  prompts: string[];
};

export type Profile = {
  name: string;
  title: string;
  location: string;
  headline: string;
  summary: string[];
  education: string[];
  contact: { email: string; linkedin: string; github: string; archive: string };
};
