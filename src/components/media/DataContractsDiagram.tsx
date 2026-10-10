/**
 * Three layers joined by two data contracts, drawn in HTML so it reads as a list for screen readers
 * and reflows on small screens. Generic names only: no employer, product or customer details.
 */
export function DataContractsDiagram() {
  return (
    <div className="dg" role="group" aria-label="Diagram: three layers joined by two data contracts">
      <ol className="dg-flow">
        <li className="dg-layer">
          <span className="dg-k">Layer 1</span>
          <p className="dg-t">Live data streams</p>
          <ul className="dg-items">
            <li>
              <span className="dg-src">Stream A</span>
              <code>eta_ts: 1718208300</code>
            </li>
            <li>
              <span className="dg-src">Stream B</span>
              <code>arrivalTime: &quot;14:05&quot;</code>
            </li>
            <li>
              <span className="dg-src">Stream C</span>
              <code>qty: &quot;12&quot;, site: &quot;North&quot;</code>
            </li>
          </ul>
        </li>
        <li className="dg-contract">
          <span className="dg-arrow" aria-hidden="true" />
          <span className="dg-c-label">
            <b>Contract 1</b>
            <span>normalise</span>
          </span>
        </li>
        <li className="dg-layer">
          <span className="dg-k">Layer 2</span>
          <p className="dg-t">Fields in a shared format</p>
          <ul className="dg-items">
            <li>
              <span className="dg-type">date</span>
              <code>arrival</code>
            </li>
            <li>
              <span className="dg-type">number</span>
              <code>quantity</code>
            </li>
            <li>
              <span className="dg-type">name</span>
              <code>site</code>
            </li>
          </ul>
        </li>
        <li className="dg-contract">
          <span className="dg-arrow" aria-hidden="true" />
          <span className="dg-c-label">
            <b>Contract 2</b>
            <span>declare and map</span>
          </span>
        </li>
        <li className="dg-layer">
          <span className="dg-k">Layer 3</span>
          <p className="dg-t">Components</p>
          <ul className="dg-items">
            <li>
              <span className="dg-src">Timeline</span>
              <span className="dg-needs">needs: date</span>
              <svg className="dg-viz" viewBox="0 0 120 20" aria-hidden="true">
                <line x1="4" y1="10" x2="116" y2="10" />
                <circle cx="18" cy="10" r="3.5" />
                <circle cx="58" cy="10" r="3.5" />
                <circle cx="96" cy="10" r="3.5" />
              </svg>
            </li>
            <li>
              <span className="dg-src">Pie chart</span>
              <span className="dg-needs">needs: name, number</span>
              <svg className="dg-viz" viewBox="0 0 120 28" aria-hidden="true">
                <circle cx="14" cy="14" r="11" className="dg-pie-bg" />
                <path d="M14 14 L14 3 A11 11 0 0 1 24.5 17.4 Z" className="dg-pie" />
              </svg>
            </li>
          </ul>
        </li>
      </ol>
    </div>
  );
}
