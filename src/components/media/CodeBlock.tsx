import type { ReactNode } from "react";

/** Tiny, dependency-free highlighting: comments and custom properties are enough for these snippets. */
function highlight(line: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\/\*.*?\*\/|\/\/.*$)|(--[a-z0-9-]+)/gi;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(line))) {
    if (m.index > last) out.push(line.slice(last, m.index));
    out.push(
      <span key={i++} className={m[1] ? "c" : "p"}>
        {m[0]}
      </span>,
    );
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

export function CodeBlock({ code, language }: { code: string; language: string }) {
  const lines = code.split("\n");
  return (
    <pre className="code" tabIndex={0} aria-label={`${language.toUpperCase()} code`}>
      <code>
        {lines.map((line, i) => (
          <span key={i}>
            {highlight(line)}
            {i < lines.length - 1 ? "\n" : null}
          </span>
        ))}
      </code>
    </pre>
  );
}
