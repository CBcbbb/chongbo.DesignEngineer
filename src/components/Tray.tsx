import Link from "next/link";
import { earlierProjects, mainProjects, profile } from "@content";
import { projectNumber, trayMeta } from "@/lib/site";

export function Tray() {
  return (
    <section className="tray" id="tray" aria-labelledby="tray-title">
      <div className="tray-head">
        <h2 id="tray-title">The tray</h2>
        <p>Every project is a short case file. No question needed: open any ticket and read it in about two minutes.</p>
      </div>
      <ul className="grid">
        {mainProjects.map((p) => (
          <li key={p.slug}>
            <Link className="mini torn-sm" href={`/work/${p.slug}`}>
              <span className="meta">{trayMeta(p)}</span>
              <span className="n" aria-hidden="true">
                {projectNumber(p)}
              </span>
              <h3>{p.title}</h3>
              <p>{p.oneLiner}</p>
              <span className="meta go" aria-hidden="true">
                Open case file →
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {earlierProjects.map((p) => (
        <p className="earlier" key={p.slug}>
          <b>Earlier work.</b> <Link href={`/work/${p.slug}`}>{p.title}</Link>, {p.context.split("·")[0]?.trim()}:{" "}
          {lowerFirst(p.oneLiner)} Older service design work lives in the{" "}
          <a href={profile.contact.archive} rel="noopener">
            archive
          </a>
          .
        </p>
      ))}
    </section>
  );
}

function lowerFirst(s: string) {
  return s.charAt(0).toLowerCase() + s.slice(1);
}
