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

/**
 * The six capabilities the site has to prove (playbook §2). Cards are tagged with them,
 * and a lens decides which cards a project opens with and prints.
 */
export const CAPABILITIES = {
  A: "Web and brand storytelling",
  B: "Idea to production",
  C: "Systems and reuse",
  D: "Craft and interaction",
  E: "Accessible, fast, findable",
  F: "AI interaction",
} as const;
export type Capability = keyof typeof CAPABILITIES;

/** Fixed reading orders (playbook §3). A lens never changes the words, only what opens and what prints. */
export const LENSES = { ux: "UX and product design", engineer: "Design Engineer", web: "Design Engineer, Web and Brand" } as const;
export type Lens = keyof typeof LENSES;
/** `lead`: the project opens here on that lens. `in`: printed on that lens. */
export type LensRole = "lead" | "in";

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
  /** Case-file blocks (template "case-file"). */
  | {
      /** Two screenshots of one frame and a recording of the move between them. The reader switches. */
      kind: "compare";
      label: string;
      a: CompareSide;
      b: CompareSide;
      /** A recording of a → b, then b → a. `split` is the second at which b → a starts. */
      video?: { asset: string; split: number };
      caption?: string;
      need: string;
    }
  | {
      /** A step-by-step diagram the reader moves through. */
      kind: "stepper";
      diagram: "data-pipeline";
      steps: string[];
      caption?: string;
    }
  | {
      /** Colour specimens: each brand colour as it is used, with its contrast ratio. */
      kind: "specimens";
      items: Specimen[];
      caption?: string;
    }
  | {
      /** Big numbers with a short label each. */
      kind: "metrics";
      items: Metric[];
      caption?: string;
    }
  | { kind: "diagram"; diagram: "data-contracts" | "token-layers"; caption?: string }
  | {
      /** An ordered set of images shown together, mirroring the blocks in the old case study. */
      kind: "group";
      layout: "row" | "grid" | "stack";
      items: GroupItem[];
      caption?: string;
      /** Column count for layout "grid". Defaults to 2. */
      columns?: 2 | 3;
      /** Cell aspect ratio for grid rows; defaults to "4:3". */
      ratio?: "16:10" | "4:3" | "1:1" | "9:16" | "3:4";
    };

/** One image inside a group, with an optional short label shown under it. */
export type GroupItem = {
  asset: string;
  alt: string;
  label?: string;
  need: string;
  ratio?: "16:10" | "4:3" | "1:1" | "9:16" | "3:4";
};

export type CompareSide = { asset: string; alt: string; label: string };

/** The four entity types of a network map, shared by specimens and metrics. */
export type EntityType = "people" | "partners" | "projects" | "methods";

export type Specimen = {
  type: EntityType;
  label: string;
  /** The brand colour, used for bold large names and marks. */
  colour: string;
  ratio: number;
  /** The text-safe variant for small text, when the brand colour fails 4.5:1. */
  text?: { colour: string; ratio: number };
};

export type Metric = { value: string; label: string; note?: string; type?: EntityType };

/**
 * A numbered step. Older case files use `text` only. Case-file steps can carry a title, a label
 * (e.g. "Wall 1") and an image.
 */
export type Step = {
  text: string;
  title?: string;
  label?: string;
  image?: { asset: string; alt: string };
};
export type Section = {
  id: string;
  kind: SectionKind;
  title: string;
  /** Short paragraphs. Two to four sentences each, at most two paragraphs. */
  body: string[];
  signals: Signal[];
  media?: Media;
  /** Numbered solutions or contributions, rendered under the body. */
  steps?: Step[];
  /** Small label above the title, e.g. "Challenge 2" or "Feature focus". */
  eyebrow?: string;
  /** Case-file template: which part of the story the card belongs to (an id in `Project.parts`). */
  part?: string;
  /** Capabilities this card proves (playbook §2), strongest first. */
  capabilities?: Capability[];
  /** Lens roles for this card (playbook §3). */
  lenses?: Partial<Record<Lens, LensRole>>;
  /** Case-file template: text above the media (`stack`), or text beside it (`pair`, media on the right). */
  layout?: "stack" | "pair";
  /** Keys shown as keycaps under the body, e.g. ["Tab", "←", "→"]. */
  keys?: string[];
};

export type ProjectLink = { label: string; href: string };

export type CasePart = { id: string; label: string; title: string; intro?: string };

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
  /**
   * The template that renders the case file. "case-file" is the shared template and block library
   * (playbook §7). Projects without it keep their current page.
   */
  template?: "case-file";
  /** Case-file template: the parts the story is told in, in order. */
  parts?: CasePart[];
  /** Case-file template: one line on the result, shown on the cover. */
  outcome?: string;
  /** Case-file template: "What this shows", two or three capability chips that jump to their cards. */
  shows?: { capability: Capability; label: string; section: string }[];
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

