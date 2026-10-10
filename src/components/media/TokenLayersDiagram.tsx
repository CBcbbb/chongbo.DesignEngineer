/** A design system in layers: shared tokens, per-app overrides, per-customer themes. */
export function TokenLayersDiagram() {
  return (
    <div className="dg" role="group" aria-label="Diagram: design tokens in three layers">
      <ol className="tl">
        <li className="tl-layer">
          <span className="dg-k">Layer 1 · shared</span>
          <p className="dg-t">Shared token package</p>
          <p className="tl-d">Colour scales with fixed roles, type, spacing and radii, shipped as one package.</p>
          <div className="tl-swatches" aria-hidden="true">
            {["#f1f6ee", "#cfe3c4", "#7fb069", "#4f8a3a", "#2f5a22"].map((c) => (
              <i key={c} style={{ background: c }} />
            ))}
            <span className="tl-sep" />
            {["#fdf1ec", "#f6c9b8", "#e0603d", "#b5432a", "#7a2a19"].map((c) => (
              <i key={c} style={{ background: c }} />
            ))}
          </div>
        </li>
        <li className="tl-layer">
          <span className="dg-k">Layer 2 · per app</span>
          <p className="dg-t">Per-app overrides</p>
          <p className="tl-d">Each product line imports the package and retunes only what it needs.</p>
          <div className="tl-apps" aria-hidden="true">
            <span>App 1 · density</span>
            <span>App 2 · accent</span>
            <span>App 3 · type scale</span>
          </div>
        </li>
        <li className="tl-layer">
          <span className="dg-k">Layer 3 · per customer</span>
          <p className="dg-t">Per-customer themes</p>
          <p className="tl-d">Customers re-skin their platform with their own colours, fonts and button shapes.</p>
          <div className="tl-btns" aria-hidden="true">
            <span style={{ background: "#1a1a18", borderRadius: 999 }}>Book</span>
            <span style={{ background: "#2f5a22", borderRadius: 4, fontFamily: "var(--mono)" }}>Book</span>
            <span style={{ background: "#b5432a", borderRadius: 10, fontStyle: "italic" }}>Book</span>
          </div>
        </li>
      </ol>
    </div>
  );
}
