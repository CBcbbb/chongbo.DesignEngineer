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

/** First sentence of the first paragraph, trimmed for the prompt. */
export function excerpt(section: Section, max = 150): string {
  const first = section.body[0] ?? "";
  const sentence = first.match(/^.+?[.!?](\s|$)/)?.[0]?.trim() ?? first;
  return sentence.length > max ? `${sentence.slice(0, max - 1).trimEnd()}…` : sentence;
}

/** Compact catalogue for the model's system prompt. */
export function catalogueForPrompt(): string {
  const lines: string[] = [];
  for (const p of projects) {
    lines.push(`## project: ${p.slug} — ${p.title} (${p.status}; ${p.context})`);
    for (const s of p.sections) {
      lines.push(`- section: ${s.id} | kind: ${s.kind} | title: ${s.title} | signals: ${s.signals.join(", ")} | ${excerpt(s)}`);
    }
  }
  return lines.join("\n");
}

export function signalList(): string {
  return (Object.keys(SIGNALS) as Signal[]).map((k) => `${k} (${SIGNALS[k]})`).join("; ");
}
