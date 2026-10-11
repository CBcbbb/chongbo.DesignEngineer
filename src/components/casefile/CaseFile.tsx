import Link from "next/link";
import type { Project, Section } from "@content";
import { pad2 } from "@/lib/printed";
import { projectNumber, SIGNAL_SHORT } from "@/lib/site";
import { CaseMedia, CardTitle, Caption, Keys, Shot, StepsRow } from "./blocks";
import { CaseRail, type RailPart } from "./CaseRail";

const External = () => <span aria-hidden="true">↗</span>;

function Card({ section, n }: { section: Section; n: string }) {
  const layout = section.layout ?? "stack";
  const text = (
    <div className="cf-text">
      <div className="cf-body">
        {section.body.map((p) => (
          <p key={p.slice(0, 40)}>{p}</p>
        ))}
      </div>
      {section.keys && <Keys keys={section.keys} />}
      <ul className="cf-tags" aria-label="Shows">
        {section.signals.map((s) => (
          <li key={s}>{SIGNAL_SHORT[s]}</li>
        ))}
      </ul>
    </div>
  );
  const media = section.media ? (
    <div className="cf-media">
      <CaseMedia media={section.media} index={n} />
    </div>
  ) : null;

  return (
    <section id={section.id} className="cf-card" data-layout={layout} aria-labelledby={`${section.id}-title`}>
      <div className="cf-card-head">
        <span className="cf-num" aria-hidden="true">
          {n}
        </span>
        <h3 id={`${section.id}-title`} className="cf-h3">
          <CardTitle section={section} />
          <a className="cf-anchor" href={`#${section.id}`} aria-label={`Link to “${section.title}”`}>
            #
          </a>
        </h3>
      </div>
      {layout === "pair" && media ? (
        <div className="cf-pair">
          {text}
          {media}
        </div>
      ) : (
        <>
          {text}
          {media}
        </>
      )}
      {section.steps && section.steps.length > 0 && <StepsRow steps={section.steps} />}
    </section>
  );
}

/**
 * The shared case-file template (playbook §7): cover → What this shows → cards in parts → next project.
 * Projects opt in with `template: "case-file"`.
 */
export function CaseFile({ project, next }: { project: Project; next: Project }) {
  const parts = project.parts ?? [{ id: "main", label: "", title: project.title }];
  const numbered = project.sections.map((s, i) => ({ s, n: pad2(i + 1) }));
  const inPart = (id: string) => numbered.filter(({ s }) => (s.part ?? parts[0]!.id) === id);
  const rail: RailPart[] = parts.map((p) => ({
    id: p.id,
    label: p.label,
    title: p.title,
    cards: inPart(p.id).map(({ s, n }) => ({ id: s.id, title: s.title, n })),
  }));
  const live = project.links.find((l) => /live/i.test(l.label));
  const others = project.links.filter((l) => l !== live);
  const titleOf = (id: string) => project.sections.find((s) => s.id === id)?.title ?? id;

  return (
    <div className="cf" data-palette={project.slug === "hhcd-data-platform" ? "hhcd" : project.slug}>
      <article className="cf-sheet" aria-labelledby="case-title">
        <header className="cf-cover">
          <Link href="/work" className="cf-back">
            <span aria-hidden="true">←</span> All work
          </Link>
          <p className="cf-mono cf-cover-meta">
            <span>Case file {projectNumber(project)}</span>
            <span aria-hidden="true">·</span>
            <span className="cf-live">{project.status}</span>
          </p>
          <h1 id="case-title" className="cf-h1">
            {project.title}
          </h1>
          <p className="cf-lede">{project.oneLiner}</p>

          <dl className="cf-facts">
            <div>
              <dt className="cf-mono">Context</dt>
              <dd>{project.context}</dd>
            </div>
            <div>
              <dt className="cf-mono">Role</dt>
              <dd>{project.role}</dd>
            </div>
            {project.outcome && (
              <div>
                <dt className="cf-mono">Outcome</dt>
                <dd>{project.outcome}</dd>
              </div>
            )}
          </dl>

          {(live || others.length > 0) && (
            <p className="cf-actions">
              {live && (
                <a className="cf-btn" href={live.href} target="_blank" rel="noopener">
                  Open the {live.label.toLowerCase()} <External />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
              {others.map((l) => (
                <a key={l.href} className="cf-link" href={l.href} target="_blank" rel="noopener">
                  {l.label} <External />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ))}
            </p>
          )}

          {project.cover.kind === "image" && (
            <figure className="cf-figure cf-cover-figure">
              <Shot asset={project.cover.asset} alt={project.cover.alt} need={project.cover.need} priority sizes="(min-width: 1320px) 1190px, 100vw" />
              <Caption index="00" text={project.cover.caption} />
            </figure>
          )}

          {project.shows && project.shows.length > 0 && (
            <nav className="cf-shows" aria-labelledby="cf-shows-title">
              <h2 id="cf-shows-title" className="cf-mono" style={{ margin: 0 }}>
                What this shows
              </h2>
              <ul>
                {project.shows.map((c) => (
                  <li key={c.section}>
                    <a className="cf-chip" href={`#${c.section}`}>
                      <b aria-hidden="true">{c.capability}</b>
                      {c.label}
                      <span className="sr-only">: {titleOf(c.section)}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </header>

        <div className="cf-grid">
          <CaseRail parts={rail} />
          <div>
            <details className="cf-rail-mobile">
              <summary>
                <span className="cf-mono">Contents · {project.sections.length} parts</span>
              </summary>
              {rail.map((p) => (
                <div key={p.id}>
                  {p.label && (
                    <span className="cf-mono">
                      {p.label} · {p.title}
                    </span>
                  )}
                  <ol>
                    {p.cards.map((c) => (
                      <li key={c.id}>
                        <a href={`#${c.id}`}>
                          <span>{c.n}</span>
                          {c.title}
                        </a>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </details>

            {parts.map((p) => (
              <div key={p.id} className="cf-part-wrap">
                {p.label && (
                  <div className="cf-part" id={`part-${p.id}`}>
                    <div className="cf-part-head">
                      <div>
                        <p className="cf-mono" style={{ margin: 0 }}>
                          {p.label}
                        </p>
                        <h2>{p.title}</h2>
                      </div>
                      {p.intro && <p>{p.intro}</p>}
                    </div>
                  </div>
                )}
                {inPart(p.id).map(({ s, n }) => (
                  <Card key={s.id} section={s} n={n} />
                ))}
              </div>
            ))}

            <nav aria-label="Next case file">
              <Link href={`/work/${next.slug}`} className="cf-next">
                <span className="cf-mono">Next case file · {projectNumber(next)}</span>
                <strong>{next.title}</strong>
                <span>{next.oneLiner}</span>
              </Link>
            </nav>
          </div>
        </div>
      </article>
    </div>
  );
}
