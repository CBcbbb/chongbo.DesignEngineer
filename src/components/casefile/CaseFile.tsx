import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Project, Section } from "@content";
import { pad2 } from "@/lib/printed";
import { projectNumber, SIGNAL_SHORT } from "@/lib/site";
import { imageSize } from "@/lib/assets";
import { CaseMedia, CardTitle, Keys, StepsRow } from "./blocks";
import { CaseContents, type ContentsPart } from "./CaseContents";

const External = () => <span aria-hidden="true">↗</span>;

/** Interactive evidence and phone screens sit on the project's colour field. */
function mountOf(section: Section): "field" | undefined {
  const m = section.media;
  if (!m) return undefined;
  if (m.kind === "compare") return "field";
  if (m.kind === "group" && m.ratio === "9:16") return "field";
  return undefined;
}

/** One card = one sheet: index and claim on the left, the reasoning on the right, evidence underneath. */
function Card({ section, idx }: { section: Section; idx: string }) {
  const dark = section.surface === "dark";
  const bleed = dark && section.media?.kind === "video";
  return (
    <section
      id={section.id}
      className={`cf-sheet${dark ? " is-dark" : ""}`}
      data-mount={mountOf(section)}
      aria-labelledby={`${section.id}-title`}
    >
      <div className="cf-head">
        <div>
          <p className="cf-meta">
            <span className="cf-idx">{idx}</span>
            {section.eyebrow && <span className="cf-kind">{section.eyebrow}</span>}
          </p>
          <h3 id={`${section.id}-title`} className="cf-h3">
            <CardTitle section={section} />
            <a className="cf-anchor" href={`#${section.id}`} aria-label={`Link to “${section.title}”`}>
              #
            </a>
          </h3>
        </div>
        <div className="cf-body">
          {section.bodyStyle !== "list" &&
            section.body.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          {section.keys && <Keys keys={section.keys} />}
          <ul className="cf-tags" aria-label="Shows">
            {section.signals.slice(0, 2).map((s) => (
              <li key={s}>{SIGNAL_SHORT[s]}</li>
            ))}
          </ul>
        </div>
      </div>
      {section.bodyStyle === "list" && (
        <ol className="cf-points">
          {section.body.map((p, i) => (
            <li key={p.slice(0, 40)}>
              <span className="cf-points-n" aria-hidden="true">
                {pad2(i + 1)}
              </span>
              <span>{p}</span>
            </li>
          ))}
        </ol>
      )}
      {section.media && (
        <div className={`cf-evidence${bleed ? " cf-bleed" : ""}`}>
          <CaseMedia media={section.media} index={idx} />
        </div>
      )}
      {section.steps && section.steps.length > 0 && <StepsRow steps={section.steps} />}
    </section>
  );
}

/**
 * The shared case-file template (playbook §7), in the same system as the Nike case file:
 * contents on the left; on the right a stack of sheets — cover, the work, then each part's opener and cards.
 * Projects opt in with `template: "case-file"`.
 */
export function CaseFile({ project, next }: { project: Project; next: Project }) {
  const parts = project.parts ?? [{ id: "main", label: "", title: project.title }];
  const inPart = (id: string) => project.sections.filter((s) => (s.part ?? parts[0]!.id) === id);
  const contents: ContentsPart[] = parts.map((p, i) => ({
    id: p.id,
    n: pad2(i + 1),
    label: p.title,
    cards: inPart(p.id).map((s) => ({ id: s.id, label: s.nav ?? s.title })),
  }));
  const live = project.links.find((l) => /live/i.test(l.label));
  const others = project.links.filter((l) => l !== live);
  const titleOf = (id: string) => project.sections.find((s) => s.id === id)?.title ?? id;
  const cover = project.cover.kind === "image" ? project.cover : null;
  const coverSize = cover ? imageSize(cover.asset) : undefined;
  const art = project.coverArt;
  const artSize = art ? imageSize(art.asset) : undefined;
  const ground = project.openers === "ground";

  return (
    <div className="cf" data-palette={project.slug === "hhcd-data-platform" ? "hhcd" : project.slug}>
      <div className="cf-frame">
        <CaseContents title={project.title} parts={contents} />

        <article className="cf-sheets" aria-labelledby="case-title">
          <header id="top" className={`cf-sheet is-field cf-cover${art ? " has-art" : ""}`}>
            <p className="cf-client">
              {project.legend && (
                <span className="cf-marks" aria-hidden="true">
                  {project.legend.map((l) => (
                    <span key={l.type} className={`cf-mark cf-mark-${l.type}`} />
                  ))}
                </span>
              )}
              <span>
                {project.client ?? project.context} · {project.status}
              </span>
            </p>
            <h1 id="case-title" className="cf-h1">
              {project.title}
            </h1>
            <p className="cf-lede">{project.oneLiner}</p>
            <div className="cf-intro">
              <p>{project.context}</p>
              <dl className="cf-facts">
                <div>
                  <dt>Role</dt>
                  <dd>{project.role}</dd>
                </div>
                {project.outcome && (
                  <div>
                    <dt>Outcome</dt>
                    <dd>{project.outcome}</dd>
                  </div>
                )}
              </dl>
            </div>
            <div className="cf-cover-foot">
              {project.shows && project.shows.length > 0 && (
                <nav aria-labelledby="cf-shows-title">
                  <ul className="cf-chips">
                    <li id="cf-shows-title" className="cf-chips-label">
                      What this shows
                    </li>
                    {project.shows.map((c) => (
                      <li key={c.section}>
                        <a className="cf-chip" href={`#${c.section}`}>
                          {c.label}
                          <span className="sr-only">: {titleOf(c.section)}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
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
            </div>
            {art && artSize && (
              <figure className="cf-cover-art">
                <Image
                  src={`/assets/${art.asset}`}
                  alt={art.alt}
                  width={artSize.width}
                  height={artSize.height}
                  sizes="(min-width: 1180px) 960px, 100vw"
                  priority
                />
              </figure>
            )}
          </header>

          {!art && cover && coverSize && (
            <section className="cf-sheet is-dark cf-show" aria-labelledby="cf-show-title">
              <div className="cf-show-head">
                <div>
                  <p className="cf-kind">The work</p>
                  <h2 id="cf-show-title">The map today</h2>
                  {cover.caption && <p>{cover.caption}</p>}
                </div>
                {project.legend && (
                  <ul className="cf-legend" aria-label="Key">
                    {project.legend.map((l) => (
                      <li key={l.type}>
                        <span className={`cf-mark cf-mark-${l.type}`} aria-hidden="true" />
                        {l.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <figure className="cf-shot-end">
                <Image
                  src={`/assets/${cover.asset}`}
                  alt={cover.alt}
                  width={coverSize.width}
                  height={coverSize.height}
                  sizes="(min-width: 1180px) 860px, 100vw"
                  priority
                />
              </figure>
            </section>
          )}

          {parts.map((p, pi) => {
            const cards = inPart(p.id);
            const n = pad2(pi + 1);
            return (
              <Fragment key={p.id}>
                {p.label && (
                  <section
                    id={p.id}
                    className={ground ? "cf-opener is-ground" : "cf-sheet is-field cf-opener"}
                    aria-labelledby={`${p.id}-h`}
                  >
                    <span className="cf-num" aria-hidden="true">
                      {n}
                    </span>
                    <div>
                      <h2 id={`${p.id}-h`}>
                        <span className="sr-only">{p.label}: </span>
                        {p.title}
                      </h2>
                      <p className="cf-cards">{cards.map((s) => s.nav ?? s.title).join(" · ")}</p>
                    </div>
                    {ground && project.legend && (
                      <span className="cf-opener-marks" aria-hidden="true">
                        {project.legend.map((l) => (
                          <span key={l.type} className={`cf-mark cf-mark-${l.type}`} />
                        ))}
                      </span>
                    )}
                  </section>
                )}
                {cards.map((s, ci) => (
                  <Card key={s.id} section={s} idx={`${n}.${ci + 1}`} />
                ))}
              </Fragment>
            );
          })}

          <nav aria-label="Next case file">
            <Link href={`/work/${next.slug}`} className="cf-sheet cf-next">
              <span className="cf-kind">Next case file · {projectNumber(next)}</span>
              <strong>{next.title}</strong>
              <span>{next.oneLiner}</span>
            </Link>
          </nav>
        </article>
      </div>
    </div>
  );
}
