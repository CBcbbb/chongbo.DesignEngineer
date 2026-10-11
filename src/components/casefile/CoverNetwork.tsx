/**
 * Cover art for a network project: the map's own four marks, spilling from the cover's top-right corner and
 * fading towards the text. Illustrative (48 marks in the platform's proportions of projects, methods, people and
 * partners), not a chart of the data. Decorative, so it is hidden from assistive technology.
 */
type Kind = "j" | "m" | "p" | "o";
const W = 640;
const H = 460;
const NODES: [number, number, Kind][] = [[604.1,154.2,"o"],[652.2,-1.8,"p"],[632.3,210.0,"j"],[593.1,67.5,"j"],[554.3,117.1,"j"],[617.2,261.2,"o"],[515.9,45.1,"j"],[619.2,350.1,"j"],[644.9,104.0,"p"],[490.2,19.1,"p"],[579.4,-5.3,"o"],[557.9,299.2,"o"],[551.7,167.3,"m"],[529.1,-1.6,"j"],[413.9,2.3,"j"],[420.6,55.8,"m"],[401.3,339.0,"m"],[628.3,41.9,"j"],[559.7,336.8,"o"],[519.3,141.3,"m"],[653.3,310.7,"m"],[478.3,298.7,"o"],[468.1,94.6,"p"],[641.0,152.3,"p"],[199.2,293.4,"m"],[482.6,148.1,"j"],[156.6,288.4,"p"],[518.5,338.4,"m"],[383.3,282.6,"p"],[581.7,198.1,"j"],[466.4,345.9,"o"],[531.5,79.8,"m"],[658.3,345.5,"m"],[554.0,49.8,"j"],[371.0,81.0,"j"],[315.7,282.4,"j"],[248.7,37.8,"p"],[445.6,21.6,"o"],[232.2,7.6,"p"],[478.9,53.3,"m"],[421.7,117.3,"j"],[346.5,52.5,"p"],[658.1,233.3,"j"],[174.9,77.2,"j"],[439.1,296.8,"o"],[268.3,346.4,"m"],[657.3,64.2,"j"],[449.9,169.0,"m"]];
const LINKS: [number, number][] = [[0,23],[0,29],[1,17],[1,46],[2,5],[2,23],[3,8],[3,31],[4,12],[4,19],[4,31],[5,20],[5,32],[5,42],[6,9],[6,31],[6,39],[7,11],[7,18],[7,20],[7,32],[8,17],[8,46],[9,13],[9,39],[10,13],[10,33],[11,27],[12,29],[14,15],[14,37],[15,34],[15,37],[15,41],[16,21],[16,28],[16,30],[16,44],[18,27],[19,25],[20,42],[21,27],[22,39],[22,40],[24,26],[24,35],[25,47],[26,45],[27,30],[28,35],[28,44],[31,33],[34,36],[34,38],[34,41],[35,45],[36,43],[38,43],[40,47]];
/** A short trail through the corner, drawn in ink, like the platform's path of opened entries. */
const PATH = [17,8,3,31,4,19];
/** Where the trail arrives: the top of the live link, which sits in the network like an entry point (desktop). */
const ARRIVAL: [number, number] = [468, 196];

function Mark({ x, y, k }: { x: number; y: number; k: Kind }) {
  if (k === "p") return <circle className="nm-people" cx={x} cy={y} r={6.4} />;
  if (k === "o") return <rect className="nm-partners" x={x - 5.6} y={y - 5.6} width={11.2} height={11.2} />;
  if (k === "j") return <rect className="nm-projects" x={x - 5.2} y={y - 5.2} width={10.4} height={10.4} transform={`rotate(45 ${x} ${y})`} />;
  return <path className="nm-methods" d={`M${x} ${y - 7}L${x + 7} ${y + 5.4}H${x - 7}Z`} />;
}

export function CoverNetwork() {
  const trail = PATH.slice(1).map((n, i) => [PATH[i]!, n] as const);
  return (
    <div className="cf-cover-net" aria-hidden="true">
      <div className="cf-cover-net-art">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMaxYMin meet" focusable="false">
        <g className="nl">
          {LINKS.map(([a, b]) => (
            <line key={`${a}-${b}`} x1={NODES[a]![0]} y1={NODES[a]![1]} x2={NODES[b]![0]} y2={NODES[b]![1]} />
          ))}
        </g>
        <g className="np">
          {trail.map(([a, b]) => (
            <line key={`${a}-${b}`} x1={NODES[a]![0]} y1={NODES[a]![1]} x2={NODES[b]![0]} y2={NODES[b]![1]} />
          ))}
          <line x1={NODES[PATH[PATH.length - 1]!]![0]} y1={NODES[PATH[PATH.length - 1]!]![1]} x2={ARRIVAL[0]} y2={ARRIVAL[1]} />
        </g>
        {NODES.map(([x, y, k], i) => (
          <Mark key={i} x={x} y={y} k={k} />
        ))}
      </svg>
      </div>
    </div>
  );
}
