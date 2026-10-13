import { projects, SIGNALS, type Project, type Section, type Signal } from "@content";

export type CatalogueEntry = {
  project: Project;
  section: Section;
  /** Lower-cased searchable text: title and body. */
  text: string;
  titleText: string;
};

export const catalogue: CatalogueEntry[] = projects.flatMap((project) =>
  project.sections.map((section) => ({
    project,
    section,
    titleText: section.title.toLowerCase(),
    text: `${section.title} ${section.body.join(" ")}`.toLowerCase(),
  })),
);

export function findEntry(project: string, section: string): CatalogueEntry | undefined {
  return catalogue.find((e) => e.project.slug === project && e.section.id === section);
}

/** A section's whole body on one line, for the model's catalogue. */
export function fullText(section: Section): string {
  return section.body.join(" ").replace(/\s+/g, " ").trim();
}

/** Catalogue for the model's system prompt: every section with its full text. */
export function catalogueForPrompt(): string {
  const lines: string[] = [];
  for (const p of projects) {
    lines.push(`## project: ${p.slug} — ${p.title} (${p.context}; built with ${p.stack.join(", ")})`);
    for (const s of p.sections) {
      // The whole body, not its first sentence: cards are short, and the model judges fit far better on the full text.
      lines.push(`- section: ${s.id} | kind: ${s.kind} | title: ${s.title} | signals: ${s.signals.join(", ")} | ${fullText(s)}`);
    }
  }
  return lines.join("\n");
}

/** For each signal, every section that carries it (position 1 = the section's main signal). */
export function signalIndexForPrompt(): string {
  return (Object.keys(SIGNALS) as Signal[])
    .map((sig) => {
      const where = catalogue
        .filter((e) => e.section.signals.includes(sig))
        .map((e) => `${e.project.slug}/${e.section.id}@${e.section.signals.indexOf(sig) + 1}`);
      return `- ${sig}: ${where.length ? where.join(", ") : "(no work)"}`;
    })
    .join("\n");
}

export function signalList(): string {
  return (Object.keys(SIGNALS) as Signal[]).map((k) => `${k} (${SIGNALS[k]})`).join("; ");
}
