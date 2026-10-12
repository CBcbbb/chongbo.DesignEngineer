"use client";

// the project's styles and the invented customers' faces, wherever its evidence is shown (case file or printed sheet)
import "@fontsource-variable/archivo";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/ibm-plex-sans";
import "@fontsource-variable/inter";
import "./design-system.css";

import { useEffect, useRef } from "react";

/*
 * 01.1: three products from one company that share one blue and one logo, and nothing else. Each is drawn at
 * 560 × 360 and scaled to its card: a light workspace (Geist), a light network map (IBM Plex Sans), a dark builder
 * (Inter). Every name and value is invented.
 */

const PI = {
  folder: "M3 7h6l2 2h10v10H3z",
  route: "M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM8 17h6a4 4 0 0 0 0-8h-2",
  file: "M7 3h7l5 5v13H7zM14 3v5h5",
  pin: "M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  chart: "M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-3",
  plus: "M12 5v14M5 12h14",
  ship: "M3 15l2 5h14l2-5-9-3zM12 3v9M8 7h8",
  truck: "M3 6h11v10H3zM14 10h4l3 3v3h-7zM7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
  db: "M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6",
  merge: "M6 3v6a6 6 0 0 0 6 6h6M15 12l3 3-3 3M6 21v-6",
  chev: "M6 9l6 6 6-6",
} as const;
type IconName = keyof typeof PI;

export function Pi({ n, className = "" }: { n: IconName; className?: string }) {
  return (
    <svg className={`pi ${className}`} viewBox="0 0 24 24" aria-hidden="true">
      <path d={PI[n]} />
    </svg>
  );
}

/** One company, one mark: every product carries the same logo; only the name after it changes. */
function Mark() {
  return (
    <svg className="pf-mark" viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="24" rx="6" fill="#3453d3" />
      <path d="M7.5 7l5 5-5 5M12.5 7l5 5-5 5" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** 1 · light workspace: a quiet sidebar, one page title, four record cards; pill buttons, 18px cards. */
function Manifest() {
  const card = (ic: IconName, tag: string, t: string, m: string) => (
    <div className="p1-card" key={t}>
      <div className="p1-ch">
        <i className="p1-ic">
          <Pi n={ic} />
        </i>
        <span className="p1-tag">{tag}</span>
      </div>
      <b>{t}</b>
      <small>{m}</small>
    </div>
  );
  const nav: [IconName, string][] = [
    ["folder", "Shipments"],
    ["route", "Routes"],
    ["file", "Contracts"],
    ["pin", "Depots"],
    ["chart", "Reports"],
  ];
  return (
    <div className="pf pf-1">
      <aside className="p1-side">
        <div className="p1-logo">
          <Mark />
          Manifest
        </div>
        <nav>
          {nav.map(([ic, t], i) => (
            <span key={t} className={i === 0 ? "is-on" : undefined}>
              <Pi n={ic} />
              {t}
            </span>
          ))}
        </nav>
        <div className="p1-me">
          <i>OT</i>Ops team
        </div>
      </aside>
      <div className="p1-main">
        <header>
          <h5>Shipments</h5>
          <span className="p1-btn">
            <Pi n="plus" />
            New shipment
          </span>
        </header>
        <div className="p1-tools">
          <span className="p1-seg">
            <b>All</b>
            <span>Starred</span>
          </span>
          <small>48 shipments</small>
        </div>
        <div className="p1-grid">
          {card("ship", "Sea freight", "Harbour import 2201", "12 containers · north depot")}
          {card("truck", "Road", "Depot transfer", "Overnight · 26 pallets")}
          {card("ship", "Sea freight", "Reefer export 0418", "Chilled · Thursday sailing")}
          {card("truck", "Road", "Last-mile batch 77", "60 drops · 2 vans")}
        </div>
      </div>
    </div>
  );
}

/** 2 · light network map: a tree on the left, a few nodes on a dot grid, one floating control. */
function Compass() {
  const curve = (x1: number, y1: number, x2: number, y2: number, on: boolean, k: string) => {
    const m = (x1 + x2) / 2;
    return <path key={k} className={on ? "is-on" : undefined} d={`M${x1} ${y1} C${m} ${y1} ${m} ${y2} ${x2} ${y2}`} />;
  };
  const R: [number, number] = [24, 150];
  const Hs: [number, number][] = [
    [176, 62],
    [176, 150],
    [176, 238],
  ];
  const Ls: [number, number][] = [
    [300, 118],
    [300, 182],
  ];
  return (
    <div className="pf pf-2">
      <aside className="p2-tree">
        <div className="p2-logo">
          <Mark />
          <b>Compass</b>
        </div>
        <div className="p2-search">
          <Pi n="search" />
          Search
        </div>
        <div className="p2-sel">Network</div>
        <ul>
          <li className="h">
            <Pi n="chev" />
            Inbound
          </li>
          <li>Harbour</li>
          <li>Customs</li>
          <li className="h">
            <Pi n="chev" />
            Outbound
          </li>
          <li className="is-on">Inland hubs</li>
          <li>Last mile</li>
        </ul>
      </aside>
      <div className="p2-canvas">
        <svg className="p2-lines" viewBox="0 0 400 360" aria-hidden="true">
          {Hs.map(([x, y], i) => curve(R[0] + 104, R[1], x, y, i === 1, `h${i}`))}
          {Ls.map(([x, y], i) => curve(Hs[1]![0] + 96, Hs[1]![1], x, y, true, `l${i}`))}
        </svg>
        <div className="p2-node is-root" style={{ left: R[0], top: R[1] - 22 }}>
          <small>12 lanes</small>
          <b>North network</b>
        </div>
        {Hs.map(([x, y], i) => (
          <div key={i} className={`p2-node${i === 1 ? " is-hl" : ""}`} style={{ left: x, top: y - 20 }}>
            <small>Hub</small>
            <b>{["Harbour", "Inland", "Last mile"][i]}</b>
          </div>
        ))}
        {Ls.map(([x, y], i) => (
          <div key={i} className="p2-leaf" style={{ left: x, top: y - 15 }}>
            <em />
            {["Depot A", "Depot B"][i]}
          </div>
        ))}
        <div className="p2-ctrl">
          <small>Layout</small>
          <span className="p2-seg">
            <i className="is-on">Tree</i>
            <i>Radial</i>
          </span>
        </div>
        <div className="p2-zoom">
          <i>–</i>
          <span>80%</span>
          <i>+</i>
        </div>
      </div>
    </div>
  );
}

/** 3 · dark builder: segmented tabs, one status line, four blocks on a dark line grid. Square corners, mono caps. */
function Beacon() {
  const blk = (x: number, y: number, ic: IconName, t: string, kind: string, k: string, body: string) => (
    <div key={t} className="p3-blk" style={{ left: x, top: y }}>
      <div className="p3-bh">
        <i className={`k-${k}`}>
          <Pi n={ic} />
        </i>
        <b>{t}</b>
        <em />
      </div>
      <span className={`p3-kind k-${k}`}>{kind}</span>
      <p>{body}</p>
      <u className="l" />
      <u className="r" />
    </div>
  );
  return (
    <div className="pf pf-3">
      <header className="p3-top">
        <span className="p3-logo">
          <Mark />
          Beacon
        </span>
        <nav>
          <b>Builder</b>
          <span>Sources</span>
          <span>Jobs</span>
        </nav>
        <span className="p3-av">VP</span>
      </header>
      <div className="p3-bar">
        <span className="p3-dd">
          Nightly rate sync <Pi n="chev" />
        </span>
        <span className="p3-st is-g">
          <em />
          Deployed
        </span>
        <span className="p3-sp" />
        <span className="p3-btn">Test</span>
        <span className="p3-btn is-blue">Save</span>
      </div>
      <div className="p3-canvas">
        <svg className="p3-wire" viewBox="0 0 560 270" aria-hidden="true">
          <path d="M164 145 C187 145 187 90 210 90" />
          <path d="M164 145 C187 145 187 200 210 200" />
          <path d="M350 90 C373 90 373 145 396 145" />
          <path d="M350 200 C373 200 373 145 396 145" />
        </svg>
        {blk(24, 100, "clock", "Schedule", "Trigger", "a", "Every 5 minutes")}
        {blk(210, 45, "db", "New rates", "Cache", "r", "Read the latest")}
        {blk(210, 155, "db", "Old rates", "Cache", "r", "Read the last run")}
        {blk(396, 100, "merge", "Merge", "Join", "p", "When both arrive")}
      </div>
    </div>
  );
}

/** A product drawn at 560 px wide, scaled to the width it is given. */
function Fit({ n, children }: { n: 1 | 2 | 3; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => el.style.setProperty("--k", String(el.clientWidth / 560));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className="pfw" data-pf={n} aria-hidden="true">
      {children}
    </div>
  );
}

export function Products() {
  return (
    <div
      className="ds-fan"
      role="img"
      aria-label="Three products that share one blue and one logo, and nothing else: a light workspace with a sidebar and cards, a light network map, and a dark builder"
    >
      <figure className="ds-fan-card is-1">
        <span className="ds-tag">First product</span>
        <Fit n={1}>
          <Manifest />
        </Fit>
      </figure>
      <figure className="ds-fan-card is-2">
        <span className="ds-tag">Second product</span>
        <Fit n={2}>
          <Compass />
        </Fit>
      </figure>
      <figure className="ds-fan-card is-3">
        <span className="ds-tag">Third product</span>
        <Fit n={3}>
          <Beacon />
        </Fit>
      </figure>
    </div>
  );
}

/** 01.2: one screen, three clients. The layout is shared; colour, typeface and button shape are theirs. */
export function Clients() {
  const clients: [string, string][] = [
    ["courier", "Courier"],
    ["grocer", "Grocer"],
    ["bank", "Bank"],
  ];
  return (
    <div
      className="ds-fan is-clients"
      role="img"
      aria-label="The same screen for three clients: the same layout and components, each in the client's colour, typeface and button shape"
    >
      {clients.map(([id, name], i) => (
        <figure key={id} className={`ds-fan-card is-${i + 1}`}>
          <span className="ds-tag">{name}</span>
          <div className={`mp mp-1 cl-${id}`} aria-hidden="true">
            <div className="mp-bar">
              <i className="mp-logo" />
              <b>Deliveries</b>
              <span>Today</span>
            </div>
            <div className="mp-main">
              <div className="mp-top">
                <h4>Today&apos;s runs</h4>
                <span className="mp-btn">New run</span>
              </div>
              <ul className="mp-list">
                {[
                  ["Run 4821", "On time"],
                  ["Run 4822", "Delayed"],
                  ["Run 4823", "On time"],
                  ["Run 4824", "On time"],
                ].map(([r, s]) => (
                  <li key={r}>
                    <span>{r}</span>
                    <span className={`mp-badge${s === "Delayed" ? " is-warn" : ""}`}>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </figure>
      ))}
    </div>
  );
}
