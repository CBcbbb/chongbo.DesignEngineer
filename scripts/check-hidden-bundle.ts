import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";
import { HIDDEN } from "../content/index";
import type { Project } from "../content/schema";

type HiddenContent = Pick<Project, "slug" | "title" | "oneLiner" | "sections">;
type Leak = { file: string; project: string; field: string };

/** Check the files that ship to browsers, including source maps when enabled. Missing builds fail closed. */
export function hiddenBundleLeaks(directory: string, hidden: readonly HiddenContent[]): Leak[] {
  const files: string[] = [];
  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(file);
      else if (entry.isFile() && /\.(?:js|mjs|json|map|css|html|txt|svg)$/.test(file)) files.push(file);
    }
  }
  walk(directory);
  if (!files.some((file) => /\.m?js$/.test(file))) throw new Error("No client JavaScript found; run a production build first.");

  const probes = hidden.flatMap((project) => [
    { project: project.slug, field: "title", value: project.title },
    { project: project.slug, field: "oneLiner", value: project.oneLiner },
    ...project.sections.flatMap((section) => section.body.map((value, i) => ({
      project: project.slug, field: `${section.id}.body.${i}`, value,
    }))),
  ]).filter((probe) => probe.value.length > 0);

  const leaks: Leak[] = [];
  for (const file of files.sort()) {
    const source = fs.readFileSync(file, "utf8");
    // Decode string literals too: minification can escape quotes or write text as \uXXXX / \xXX.
    const strings = [source];
    const scanner = ts.createScanner(ts.ScriptTarget.Latest, true, ts.LanguageVariant.Standard, source);
    for (let token = scanner.scan(); token !== ts.SyntaxKind.EndOfFileToken; token = scanner.scan()) {
      if (token === ts.SyntaxKind.StringLiteral || token === ts.SyntaxKind.NoSubstitutionTemplateLiteral) {
        strings.push(scanner.getTokenValue());
      }
    }
    for (const probe of probes) {
      if (strings.some((value) => value.includes(probe.value))) {
        leaks.push({ file: path.relative(directory, file), project: probe.project, field: probe.field });
      }
    }
  }
  return leaks;
}

async function main() {
  const hidden: HiddenContent[] = [];
  const directory = path.resolve("content/projects");
  for (const file of fs.readdirSync(directory).filter((file) => file.endsWith(".ts")).sort()) {
    const exports: Record<string, unknown> = await import(pathToFileURL(path.join(directory, file)).href);
    for (const value of Object.values(exports)) {
      if (value && typeof value === "object" && "slug" in value && typeof value.slug === "string" && HIDDEN.has(value.slug)) {
        hidden.push(value as HiddenContent);
      }
    }
  }
  for (const slug of HIDDEN) {
    if (!hidden.some((project) => project.slug === slug)) throw new Error(`No source content found for hidden project ${slug}.`);
  }
  const leaks = hiddenBundleLeaks(path.resolve(".next/static"), hidden);
  if (leaks.length) {
    throw new Error("Hidden project content found in client files:\n" + leaks.map((leak) =>
      `  ${leak.file}: ${leak.project} (${leak.field})`,
    ).join("\n"));
  }
  console.log(`hidden-bundle: ${hidden.length} hidden projects checked; no titles or body text in client files`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
