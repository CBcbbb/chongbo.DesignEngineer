/**
 * Cover art for a network project: the map's own four marks, gathered in the cover's top-right corner, running off
 * the sheet and fading before the title. Illustrative (30 marks in the platform's proportions of projects,
 * methods, people and partners), not a chart of the data. Decorative, so it is hidden from assistive technology.
 * Generated so that no mark sits where the client line or the title fall, at any size.
 */
type Kind = "j" | "m" | "p" | "o";
const W = 520;
const H = 240;
const NODES: [number, number, Kind][] = [[368.3,58.3,"o"],[512.9,208.5,"p"],[536.2,154.5,"j"],[359.0,165.6,"m"],[469.3,129.1,"j"],[486.6,-8.5,"j"],[539.4,60.5,"j"],[371.9,-11.8,"p"],[515.1,111.8,"j"],[422.5,41.8,"m"],[430.0,-14.2,"m"],[457.6,42.1,"m"],[309.5,38.5,"o"],[506.7,20.6,"o"],[398.5,114.9,"j"],[263.2,39.1,"o"],[173.3,12.4,"j"],[330.9,62.1,"p"],[279.7,0.8,"j"],[493.8,150.4,"o"],[167.1,50.3,"j"],[323.7,8.4,"o"],[447.4,105.0,"p"],[418.5,80.6,"m"],[287.7,228.5,"p"],[488.0,76.9,"m"],[343.0,119.3,"j"],[531.3,-10.9,"m"],[209.0,28.5,"p"],[427.6,131.7,"j"]];
const LINKS: [number, number][] = [[0,9],[0,17],[0,23],[1,2],[1,19],[2,19],[3,14],[3,24],[3,26],[4,19],[4,22],[5,10],[5,11],[5,13],[5,27],[6,13],[6,25],[7,10],[7,21],[8,19],[8,25],[9,22],[11,13],[12,17],[12,18],[13,27],[14,22],[14,23],[15,16],[15,18],[15,20],[15,28],[16,28],[17,26],[18,21],[20,28],[22,23],[22,25],[22,29],[23,29],[24,26]];

function Mark({ x, y, k }: { x: number; y: number; k: Kind }) {
  if (k === "p") return <circle className="nm-people" cx={x} cy={y} r={6.4} />;
  if (k === "o") return <rect className="nm-partners" x={x - 5.6} y={y - 5.6} width={11.2} height={11.2} />;
  if (k === "j") return <rect className="nm-projects" x={x - 5.2} y={y - 5.2} width={10.4} height={10.4} transform={`rotate(45 ${x} ${y})`} />;
  return <path className="nm-methods" d={`M${x} ${y - 7}L${x + 7} ${y + 5.4}H${x - 7}Z`} />;
}

export function CoverNetwork() {
  return (
    <div className="cf-cover-net" aria-hidden="true">
      <div className="cf-cover-net-art">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMaxYMin meet" focusable="false">
          <g className="nl">
            {LINKS.map(([a, b]) => (
              <line key={`${a}-${b}`} x1={NODES[a]![0]} y1={NODES[a]![1]} x2={NODES[b]![0]} y2={NODES[b]![1]} />
            ))}
          </g>
          {NODES.map(([x, y, k], i) => (
            <Mark key={i} x={x} y={y} k={k} />
          ))}
        </svg>
      </div>
    </div>
  );
}
