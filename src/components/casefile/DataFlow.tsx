import type { CSSProperties } from "react";

/**
 * The data pipeline as one diagram, readable at a glance (no stepping): on the left, a survey row with a person at its
 * centre; on the right, the same kind of entries as four linked types of equal weight. The numbered steps sit under
 * it, and the diagram carries their numbers where each happens. Sample labels only: it shows the method, not the data.
 */
type Kind = "people" | "projects" | "methods" | "partners";
type Node = { id: string; kind: Kind; label: string; x: number; y: number; centre?: boolean };

/** One survey row: everything hangs off the person. */
const ROW: Node[] = [
  { id: "a", kind: "people", label: "Person A", x: 50, y: 50, centre: true },
  { id: "p1", kind: "projects", label: "Project 1", x: 23, y: 16 },
  { id: "p2", kind: "projects", label: "Project 2", x: 77, y: 16 },
  { id: "w", kind: "methods", label: "Workshops", x: 23, y: 84 },
  { id: "x", kind: "partners", label: "Partner X", x: 77, y: 84 },
];

/** The map: every entry once, the same size, linked through the projects. */
const MAP: Node[] = [
  { id: "a", kind: "people", label: "Person A", x: 18, y: 30 },
  { id: "b", kind: "people", label: "Person B", x: 18, y: 70 },
  { id: "p1", kind: "projects", label: "Project 1", x: 50, y: 30 },
  { id: "p2", kind: "projects", label: "Project 2", x: 50, y: 70 },
  { id: "w", kind: "methods", label: "Workshops", x: 81, y: 9 },
  { id: "x", kind: "partners", label: "Partner X", x: 81, y: 36 },
  { id: "m", kind: "methods", label: "Mapping", x: 81, y: 64 },
  { id: "y", kind: "partners", label: "Partner Y", x: 81, y: 91 },
];
const MAP_LINKS: [string, string][] = [
  ["a", "p1"],
  ["a", "p2"],
  ["b", "p2"],
  ["p1", "w"],
  ["p1", "x"],
  ["p2", "w"],
  ["p2", "m"],
  ["p2", "y"],
];

function Graph({ nodes, links, label }: { nodes: Node[]; links: [string, string][]; label: string }) {
  const at = (id: string) => nodes.find((n) => n.id === id)!;
  return (
    <div className="cf-flow-graph" data-graph={label}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        {links.map(([s, t]) => {
          const a = at(s);
          const b = at(t);
          return <line key={s + t} x1={a.x} y1={a.y} x2={b.x} y2={b.y} vectorEffect="non-scaling-stroke" />;
        })}
      </svg>
      {nodes.map((n) => (
        <span
          key={n.id}
          className={`cf-flow-node${n.centre ? " is-centre" : ""}`}
          style={{ left: `${n.x}%`, top: `${n.y}%` } as CSSProperties}
        >
          <span className={`cf-mark cf-mark-${n.kind}`} />
          {n.label}
        </span>
      ))}
    </div>
  );
}

export function DataFlow({ steps }: { steps: string[] }) {
  const row: [string, string][] = ROW.filter((n) => !n.centre).map((n) => ["a", n.id]);
  return (
    <figure className="cf-figure cf-flow">
      <p className="sr-only">
        Diagram. In the survey, each row has a person at its centre: Person A, with Project 1, Project 2, Workshops and
        Partner X. In the map, the same kinds of entry become four types of equal weight, people, projects, methods and
        partners, linked through the projects. Sample labels.
      </p>
      {/* a 3 × 2 grid: the two titles over the two graphs, the arrow between the graphs */}
      <div className="cf-flow-diagram" aria-hidden="true">
        <p className="cf-flow-title">
          <span className="cf-flow-n">01–03</span>
          One survey row per person
        </p>
        <span />
        <p className="cf-flow-title">
          <span className="cf-flow-n">05</span>
          Four types, linked
        </p>
        <Graph nodes={ROW} links={row} label="row" />
        <div className="cf-flow-arrow">
          <span className="cf-flow-n">04</span>
          <svg viewBox="0 0 64 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 8h58M53 2.5 60 8l-7 5.5" />
          </svg>
        </div>
        <Graph nodes={MAP} links={MAP_LINKS} label="map" />
      </div>
      <ol className="cf-flow-steps">
        {steps.map((s, i) => (
          <li key={s}>
            <span className="cf-flow-n">{String(i + 1).padStart(2, "0")}</span>
            {s}
          </li>
        ))}
      </ol>
      <p className="cf-flow-note">Sample labels</p>
    </figure>
  );
}
