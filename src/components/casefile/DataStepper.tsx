"use client";

import { useEffect, useRef, useState } from "react";

type Kind = "people" | "projects" | "methods" | "partners";
type Rec = { id: string; kind: Kind; label: string; col: [number, number]; net: [number, number] };

/* Sample labels only: the diagram shows the method, not the project's data. */
const RECORDS: Rec[] = [
  { id: "pa", kind: "people", label: "Person A", col: [120, 236], net: [168, 140] },
  { id: "pb", kind: "people", label: "Person B", col: [120, 284], net: [178, 336] },
  { id: "j1", kind: "projects", label: "Project 1", col: [306, 236], net: [404, 112] },
  { id: "j2", kind: "projects", label: "Project 2", col: [306, 284], net: [412, 268] },
  { id: "mw", kind: "methods", label: "Workshops", col: [492, 236], net: [632, 168] },
  { id: "mm", kind: "methods", label: "Mapping", col: [492, 284], net: [636, 352] },
  { id: "ox", kind: "partners", label: "Organisation X", col: [678, 236], net: [292, 214] },
  { id: "oy", kind: "partners", label: "Organisation Y", col: [678, 284], net: [404, 412] },
];
const LINKS: [string, string][] = [
  ["pa", "j1"],
  ["pa", "j2"],
  ["pb", "j2"],
  ["j1", "mw"],
  ["j2", "mw"],
  ["j2", "mm"],
  ["j1", "ox"],
  ["pa", "ox"],
  ["j2", "oy"],
  ["pb", "oy"],
];
const COLS: { kind: Kind; label: string; x: number }[] = [
  { kind: "people", label: "People", x: 120 },
  { kind: "projects", label: "Projects", x: 306 },
  { kind: "methods", label: "Methods", x: 492 },
  { kind: "partners", label: "Organisations", x: 678 },
];
const QUESTIONS = ["Who are you?", "What did you work on?", "Which methods did you use?", "Who supported it?"];
const ANSWERS = ["Person A", "Project 1, Project 2", "Workshops", "Organisation X"];
const SHEET = [
  ["Person A", "Project 1, Project 2", "Workshops", "Organisation X"],
  ["Person B", "Project 2", "Mapping, workshop", "Organisation Y"],
  ["person a", "Project 1", "Workshops", "Organisation X"],
];

function Mark({ kind, x, y }: { kind: Kind; x: number; y: number }) {
  const c = `m-${kind}`;
  if (kind === "people") return <circle className={c} cx={x} cy={y} r={5} />;
  if (kind === "partners") return <rect className={c} x={x - 4.5} y={y - 4.5} width={9} height={9} />;
  if (kind === "projects") return <rect className={c} x={x - 4} y={y - 4} width={8} height={8} transform={`rotate(45 ${x} ${y})`} />;
  return <path className={c} d={`M${x} ${y - 5.5} L${x + 5.5} ${y + 4.5} L${x - 5.5} ${y + 4.5} Z`} />;
}

const Arrow = ({ flip }: { flip?: boolean }) => (
  <svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d={flip ? "M10 3.5 5.5 8l4.5 4.5" : "M6 3.5 10.5 8 6 12.5"} />
  </svg>
);

/** A diagram the reader steps through: from a survey that starts from people to four linked types of equal weight. */
export function DataStepper({ steps, caption, index }: { steps: string[]; caption?: string; index: string }) {
  const [step, setStep] = useState(0);
  // On phones the diagram keeps its size and scrolls inside its frame, so the frame must take focus.
  const [scrolls, setScrolls] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 599px)");
    const read = () => {
      setScrolls(mq.matches);
      // Start centred, where most of each step sits.
      const el = stage.current;
      if (mq.matches && el) el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
    };
    read();
    mq.addEventListener("change", read);
    return () => mq.removeEventListener("change", read);
  }, []);
  const on = (n: number | number[]) => ((Array.isArray(n) ? n : [n]).includes(step) ? 1 : 0);
  const pos = (r: Rec) => (step >= 4 ? r.net : r.col);
  const byId = new Map(RECORDS.map((r) => [r.id, r]));

  return (
    <figure className="cf-figure">
      <div className="cf-stepper">
        <ol className="cf-stepper-list" aria-label="Steps">
          {steps.map((s, i) => (
            <li key={s}>
              <button type="button" aria-current={i === step ? "step" : undefined} onClick={() => setStep(i)}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {s}
              </button>
            </li>
          ))}
        </ol>
        <div
          ref={stage}
          className="cf-stepper-stage"
          {...(scrolls ? { tabIndex: 0, role: "region", "aria-label": "Diagram, scrolls sideways" } : {})}
        >
          <svg className="dp" viewBox="0 0 800 500" aria-hidden="true" focusable="false">
            {/* 1 and 2: the survey */}
            <g className="g" style={{ opacity: on([0, 1]) }}>
              <text className="t-mono" x={220} y={96}>
                {step === 0 ? "What the platform needs to know" : "One person's answers"}
              </text>
              {QUESTIONS.map((q, i) => {
                const y = 120 + i * 66;
                return (
                  <g key={q}>
                    <text className="t-dim" x={220} y={y + 14} fontSize={13}>
                      {q}
                    </text>
                    <rect className={step === 0 ? "box-dash" : "box"} x={220} y={y + 24} width={360} height={30} rx={7} />
                    <text x={234} y={y + 44} fontSize={14} style={{ opacity: on(1), transition: "opacity .5s" }}>
                      {ANSWERS[i]}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* 3: the spreadsheet, cleaned */}
            <g className="g" style={{ opacity: on(2) }}>
              <text className="t-mono" x={60} y={110}>
                First round of answers, one row per person
              </text>
              {["Person", "Projects", "Methods", "Supported by"].map((h, i) => (
                <text key={h} className="t-mono" x={60 + [0, 150, 340, 520][i]!} y={150}>
                  {h}
                </text>
              ))}
              <line className="rule" x1={60} x2={740} y1={162} y2={162} />
              <rect className="fix" x={392} y={226} width={128} height={30} rx={5} />
              {SHEET.map((row, r) => (
                <g key={r}>
                  {row.map((cell, c) => (
                    <text key={c} x={60 + [0, 150, 340, 520][c]!} y={196 + r * 46} fontSize={14} className={r === 2 ? "t-dim" : undefined}>
                      {r === 1 && c === 2 ? "Mapping, Workshops" : cell}
                    </text>
                  ))}
                  <line className="rule" x1={60} x2={740} y1={210 + r * 46} y2={210 + r * 46} />
                </g>
              ))}
              <line className="strike" x1={54} x2={640} y1={283} y2={283} />
              <text className="t-mono" x={60} y={350}>
                Duplicate removed · spelling unified
              </text>
            </g>

            {/* 4 and 5: four types, then linked */}
            <g className="g" style={{ opacity: on(3) }}>
              {COLS.map((c) => (
                <g key={c.kind}>
                  <Mark kind={c.kind} x={c.x - 60} y={182} />
                  <text className="t-mono" x={c.x - 48} y={186}>
                    {c.label}
                  </text>
                </g>
              ))}
            </g>
            <g className="g" style={{ opacity: on(4) }}>
              {LINKS.map(([s, t]) => {
                const a = byId.get(s)!.net;
                const b = byId.get(t)!.net;
                return <line key={s + t} className="link" x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />;
              })}
              <text className="t-mono" x={40} y={48}>
                Four types, equal weight
              </text>
            </g>
            {RECORDS.map((r) => {
              const [x, y] = pos(r);
              return (
                <g key={r.id} className="rec" style={{ transform: `translate(${x}px, ${y}px)`, opacity: step >= 3 ? 1 : 0 }}>
                  <rect className="box" x={-72} y={-16} width={144} height={32} rx={16} />
                  <Mark kind={r.kind} x={-54} y={0} />
                  <text x={-42} y={5} fontSize={13.5}>
                    {r.label}
                  </text>
                </g>
              );
            })}
          </svg>
          <span className="cf-stepper-note">Sample labels{scrolls ? " · scroll ⟷" : ""}</span>
          <div className="cf-stepper-nav">
            <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} aria-label="Previous step">
              <Arrow flip />
            </button>
            <button type="button" onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1} aria-label="Next step">
              <Arrow />
            </button>
          </div>
          <p className="sr-only" aria-live="polite">
            Step {step + 1} of {steps.length}: {steps[step]}
          </p>
        </div>
      </div>
      {caption && (
        <figcaption className="cf-caption">
          <b>{index}</b>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
