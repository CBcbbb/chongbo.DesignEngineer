import "./any-data.css";

/**
 * Cover art for Components for Any Data: field names from different streams (left) meet the two roles of one
 * contract (right). Decorative; it sits in the cover's top-right corner and never under the text.
 */
export function CoverWires() {
  const cat = ["M86 34 C 200 34, 220 62, 296 62", "M80 66 C 196 66, 220 64, 296 64", "M86 98 C 196 98, 220 66, 296 66"];
  const val = ["M96 130 C 200 130, 220 128, 296 128", "M74 162 C 196 162, 220 130, 296 130"];
  const fields: [string, number, number][] = [
    ["town", 80, 38],
    ["site", 74, 70],
    ["City", 80, 102],
    ["parcels", 90, 134],
    ["qty", 68, 166],
  ];
  const roles: [string, number, string][] = [
    ["category", 64, "cat"],
    ["value", 130, "val"],
  ];
  return (
    <div className="ad-wires" aria-hidden="true">
      <svg viewBox="0 0 400 186">
        {[...cat, ...val].map((d) => (
          <path key={d} d={d} />
        ))}
        <g textAnchor="end">
          {fields.map(([t, x, y]) => (
            <text key={t} className="ad-w-f" x={x} y={y}>
              {t}
            </text>
          ))}
        </g>
        {roles.map(([t, y, k]) => (
          <g key={t}>
            <rect className="ad-w-chip" x="296" y={y - 14} width="104" height="28" rx="14" />
            <circle className={`ad-w-${k}`} cx="312" cy={y} r="4" />
            <text className="ad-w-r" x="323" y={y + 4}>
              {t}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
