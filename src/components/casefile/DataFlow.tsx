"use client";

import { useState, type CSSProperties } from "react";

/**
 * The data pipeline, stepped through. The same sample entries move from one stage to the next, so the reader sees
 * the data change shape: the four types (each becomes one question) → one person's answers → a table of rows, one per
 * person, cleaned → split into four typed columns, where repeated entries merge → linked as a network.
 * Sample labels only: it shows the method, not the project's data.
 */
type Kind = "people" | "projects" | "methods" | "partners";
/** A position on the stage: x and y in %, and whether x is the chip's left edge or its centre. */
type At = { x: number; y: number; c?: boolean } | null;

const QUESTIONS: { q: string; kind: Kind; type: string }[] = [
  { q: "Who are you?", kind: "people", type: "People" },
  { q: "What did you work on?", kind: "projects", type: "Projects" },
  { q: "Which methods did you use?", kind: "methods", type: "Methods" },
  { q: "Who supported it?", kind: "partners", type: "Partners" },
];
const QY = [22, 41, 60, 79];

/**
 * Every cell of the survey, as a chip. `at` is its place at each of the five steps (null: not shown). One set of
 * sample answers runs through all five steps, so the data matches from start to finish:
 *   Person A: Project 1, Project 2 · Workshops, Interviews · Partner X
 *   Person B: Project 2 · Mapping, workshop (spelling unified to Workshops) · Partner Y
 *   person a: a repeat of Person A's answers, removed in cleaning.
 */
type Chip = { id: string; kind: Kind; label: string; fixed?: string; dup?: boolean; at: At[] };
const COLS = { people: 12.5, projects: 37.5, methods: 62.5, partners: 87.5 } as const;
/** Survey answers (step 2) and table cells (step 3): the left edge of each chip. */
const ANS = [54, 69.5];
const CELL = { person: 2.5, project: [18, 31], method: [45, 60], partner: 78 } as const;
const ROW = [34, 56, 78];
const NET = {
  pa: { x: 12, y: 30 },
  pb: { x: 12, y: 68 },
  p1: { x: 42, y: 30 },
  p2: { x: 42, y: 68 },
  w: { x: 79, y: 9 },
  i: { x: 79, y: 27 },
  m: { x: 79, y: 45 },
  x: { x: 79, y: 63 },
  y: { x: 79, y: 81 },
};
const col = (k: Kind, row: 0 | 1 | 2) => ({ x: COLS[k], y: [36, 58, 80][row]!, c: true });
const net = (e: keyof typeof NET) => ({ ...NET[e], c: true });
const ans = (x: 0 | 1, q: 0 | 1 | 2 | 3) => ({ x: ANS[x]!, y: QY[q]! });
const cell = (x: number, row: 0 | 1 | 2) => ({ x, y: ROW[row]! });

const CHIPS: Chip[] = [
  // Person A
  { id: "a-pa", kind: "people", label: "Person A", at: [null, ans(0, 0), cell(CELL.person, 0), col("people", 0), net("pa")] },
  { id: "a-p1", kind: "projects", label: "Project 1", at: [null, ans(0, 1), cell(CELL.project[0], 0), col("projects", 0), net("p1")] },
  { id: "a-p2", kind: "projects", label: "Project 2", at: [null, ans(1, 1), cell(CELL.project[1], 0), col("projects", 1), net("p2")] },
  { id: "a-w", kind: "methods", label: "Workshops", at: [null, ans(0, 2), cell(CELL.method[0], 0), col("methods", 0), net("w")] },
  { id: "a-i", kind: "methods", label: "Interviews", at: [null, ans(1, 2), cell(CELL.method[1], 0), col("methods", 1), net("i")] },
  { id: "a-x", kind: "partners", label: "Partner X", at: [null, ans(0, 3), cell(CELL.partner, 0), col("partners", 0), net("x")] },
  // Person B: Project 2 and Workshops merge with Person A's in step 4
  { id: "b-pb", kind: "people", label: "Person B", at: [null, null, cell(CELL.person, 1), col("people", 1), net("pb")] },
  { id: "b-p2", kind: "projects", label: "Project 2", at: [null, null, cell(CELL.project[0], 1), col("projects", 1), net("p2")] },
  { id: "b-m", kind: "methods", label: "Mapping", at: [null, null, cell(CELL.method[0], 1), col("methods", 2), net("m")] },
  { id: "b-w", kind: "methods", label: "workshop", fixed: "Workshops", at: [null, null, cell(CELL.method[1], 1), col("methods", 0), net("w")] },
  { id: "b-y", kind: "partners", label: "Partner Y", at: [null, null, cell(CELL.partner, 1), col("partners", 1), net("y")] },
  // a repeat of Person A's answers, struck out in step 3
  { id: "d-pa", kind: "people", label: "person a", dup: true, at: [null, null, cell(CELL.person, 2), null, null] },
  { id: "d-p1", kind: "projects", label: "Project 1", dup: true, at: [null, null, cell(CELL.project[0], 2), null, null] },
  { id: "d-p2", kind: "projects", label: "Project 2", dup: true, at: [null, null, cell(CELL.project[1], 2), null, null] },
  { id: "d-w", kind: "methods", label: "Workshops", dup: true, at: [null, null, cell(CELL.method[0], 2), null, null] },
  { id: "d-i", kind: "methods", label: "Interviews", dup: true, at: [null, null, cell(CELL.method[1], 2), null, null] },
  { id: "d-x", kind: "partners", label: "Partner X", dup: true, at: [null, null, cell(CELL.partner, 2), null, null] },
];
/** Linked through the projects: each person to their projects; each project to the methods and partners its people gave. */
const LINKS: [keyof typeof NET, keyof typeof NET][] = [
  ["pa", "p1"],
  ["pa", "p2"],
  ["pb", "p2"],
  ["p1", "w"],
  ["p1", "i"],
  ["p1", "x"],
  ["p2", "w"],
  ["p2", "i"],
  ["p2", "m"],
  ["p2", "x"],
  ["p2", "y"],
];
const TABLE_HEAD = [
  { label: "Person", x: CELL.person },
  { label: "Projects", x: CELL.project[0] },
  { label: "Methods", x: CELL.method[0] },
  { label: "Supported by", x: CELL.partner },
];
/** What the reader is looking at, at each step (shown under the stage, and read out). */
const NOTES = [
  "Each type becomes one question",
  "One person's answers",
  "One row per person · duplicate removed · spelling unified",
  "Split by type · repeated entries merge into one",
  "Linked through the projects · every entry the same weight",
];
const DESCRIBE = [
  "The four types, each turned into a question: people, who are you; projects, what did you work on; methods, which methods did you use; partners, who supported it.",
  "Person A's answers: Project 1 and Project 2; Workshops and Interviews; Partner X.",
  "A table with one row per person: Person A, and Person B with Project 2; Mapping and workshop; Partner Y. A repeat of Person A's row is struck out, and Person B's 'workshop' becomes 'Workshops'.",
  "Four columns: people, projects, methods and partners. Project 2 and Workshops, given by both people, become one entry each; methods are Workshops, Interviews and Mapping.",
  "The entries as a network: people link to projects, and projects to methods and partners.",
];

const Arrow = ({ flip }: { flip?: boolean }) => (
  <svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d={flip ? "M10 3.5 5.5 8l4.5 4.5" : "M6 3.5 10.5 8 6 12.5"} />
  </svg>
);

export function DataFlow({ steps }: { steps: string[] }) {
  const [step, setStep] = useState(0);
  const go = (i: number) => setStep(Math.max(0, Math.min(steps.length - 1, i)));
  const typed = step >= 3;
  return (
    <figure className="cf-figure cf-pipe">
      <ol className="cf-pipe-tabs">
        {steps.map((s, i) => (
          <li key={s}>
            <button
              type="button"
              onClick={() => go(i)}
              aria-current={i === step ? "step" : undefined}
              data-done={i < step || undefined}
              aria-label={`Step ${i + 1}: ${s}`}
            >
              <span className="cf-pipe-n">{String(i + 1).padStart(2, "0")}</span>
              {s.split(" ")[0]}
            </button>
          </li>
        ))}
      </ol>
      <div className="cf-pipe-caption">
        <p className="cf-pipe-text" aria-live="polite">
          <span className="sr-only">
            Step {step + 1} of {steps.length}:{" "}
          </span>
          {steps[step]}
          <span className="sr-only"> {DESCRIBE[step]}</span>
        </p>
        <span className="cf-pipe-nav">
          <button type="button" onClick={() => go(step - 1)} disabled={step === 0} aria-label="Previous step">
            <Arrow flip />
          </button>
          <button type="button" className="is-next" onClick={() => go(step + 1)} disabled={step === steps.length - 1} aria-label="Next step">
            <span aria-hidden="true">Next</span>
            <Arrow />
          </button>
        </span>
      </div>
      <div className="cf-pipe-stage" data-step={step} aria-hidden="true">
        {/* what this step shows, as the figure's label above the picture */}
        <p className="cf-pipe-meta">
          <span className="cf-pipe-note">{NOTES[step]}</span>
          <span className="cf-pipe-sample">Sample labels</span>
        </p>
        <div className="cf-pipe-scroller">
        <div className="cf-pipe-canvas">
        <svg className="cf-pipe-links" viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
          {LINKS.map(([s, t]) => (
            <line key={s + t} x1={NET[s].x} y1={NET[s].y} x2={NET[t].x} y2={NET[t].y} vectorEffect="non-scaling-stroke" />
          ))}
        </svg>
        {/* step 1: the type comes first and becomes a question; from step 2 the question moves left to take answers */}
        {QUESTIONS.map((q, i) => (
          <span key={q.kind} className="cf-pipe-type" data-hidden={step !== 0} style={{ top: `${QY[i]}%` } as CSSProperties}>
            <span className="cf-pipe-type-name">
              <span className={`cf-mark cf-mark-${q.kind}`} />
              {q.type}
            </span>
            <span className="cf-pipe-to">→</span>
          </span>
        ))}
        {QUESTIONS.map((q, i) => (
          <span
            key={q.q}
            className="cf-pipe-q"
            data-hidden={step > 1}
            style={{ top: `${QY[i]}%`, left: step === 0 ? "23%" : "4%" } as CSSProperties}
          >
            {q.q}
          </span>
        ))}
        {TABLE_HEAD.map((h) => (
          <span key={h.label} className="cf-pipe-head" data-hidden={step !== 2} style={{ left: `${h.x}%`, top: "13%" } as CSSProperties}>
            {h.label}
          </span>
        ))}
        <span className="cf-pipe-strike" data-hidden={step !== 2} />
        {QUESTIONS.map((q) => (
          <span key={q.kind} className="cf-pipe-head is-col" data-hidden={step !== 3} style={{ left: `${COLS[q.kind]}%`, top: "15%" } as CSSProperties}>
            <span className={`cf-mark cf-mark-${q.kind}`} />
            {q.type}
          </span>
        ))}
        {CHIPS.map((c) => {
          const here = c.at[step];
          const last = [...c.at.slice(0, step + 1)].reverse().find(Boolean) ?? c.at.find(Boolean)!;
          const at = here ?? last!;
          return (
            <span
              key={c.id}
              className="cf-pipe-chip"
              data-hidden={!here}
              data-centre={at.c || undefined}
              data-dup={c.dup || undefined}
              data-fix={(c.fixed && step === 2) || undefined}
              data-typed={typed || undefined}
              style={{ left: `${at.x}%`, top: `${at.y}%` } as CSSProperties}
            >
              <span className={`cf-mark cf-mark-${c.kind}`} />
              {c.fixed && step >= 3 ? c.fixed : c.label}
            </span>
          );
        })}
        </div>
        </div>
      </div>
      <p className="cf-pipe-scroll" aria-hidden="true">
        Scroll ⟷
      </p>
    </figure>
  );
}
