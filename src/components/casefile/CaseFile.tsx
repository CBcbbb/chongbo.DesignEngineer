import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Project, Section } from "@content";
import { pad2 } from "@/lib/printed";
import { projectNumber } from "@/lib/site";
import { imageSize } from "@/lib/assets";
import { CaseMedia, CardTitle, Facts, Keys, StepsRow } from "./blocks";
import { CaseContents, type ContentsPart } from "./CaseContents";
import { BrowserFrame } from "./Frame";
import { CapabilityIcon, OutArrow } from "./icons";

/** Interactive evidence and phone screens sit on the project's mount. */
function mountOf(section: Section): "field" | undefined {
  const m = section.media;
  if (!m) return undefined;
  if (m.kind === "compare") return "field";
  if (m.kind === "group" && m.ratio === "9:16") return "field";
  return undefined;
}

/**
 * How the evidence sits in a card of fixed height (playbook §7, "one card, one screen"): pictures, recordings and
 * diagrams `fill` the space under the text and scale to it; tables, figures and steps keep their own height and sit
 * at the foot.
 */
function fitOf(section: Section): "fill" | "foot" {
  const k = section.media?.kind;
  if (!k) return "foot";
  return k === "metrics" || k === "specimens" || k === "code" ? "foot" : "fill";
}

/**
 * One card = one sheet: the index above the claim on the left, the reasoning on the right, the evidence underneath
 * at full width (or beside the text, for `layout: "pair"`, where the screen is wide and tall enough).
 */
function Card({ section, idx, url }: { section: Section; idx: string; url: string }) {
  const dark = section.surface === "dark";
  const side = section.layout === "pair";
  const hasEvidence = !!section.media || !!section.steps?.length;
  const cls = ["cf-sheet", "is-card", dark && "is-dark", side && "is-side", !hasEvidence && "is-text"].filter(Boolean).join(" ");
  return (
    <section id={section.id} className={cls} data-mount={mountOf(section)} aria-labelledby={`${section.id}-title`}>
      <div className="cf-head">
        <div>
          <p className="cf-meta">
            <span className="cf-idx">{idx}</span>
          </p>
          <h3 id={`${section.id}-title`} className="cf-h3">
            <CardTitle section={section} />
          </h3>
        </div>
        <div className="cf-body">
          {section.bodyStyle !== "list" &&
            section.body.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          {section.keys && <Keys keys={section.keys} />}
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
      {section.facts && <Facts items={section.facts} />}
      {hasEvidence && (
        <div className="cf-evidence" data-fit={fitOf(section)}>
          {section.media && <CaseMedia media={section.media} index={idx} url={url} />}
          {section.steps && section.steps.length > 0 && <StepsRow steps={section.steps} />}
        </div>
      )}
    </section>
  );
}

/**
 * The shared case-file template (playbook §7), in the same system as the Nike case file:
 * contents on the left; on the right a stack of sheets: a compact cover, the work itself, then each part's opener
 * and one sheet per card, then the next case file. Projects opt in with `template: "case-file"`.
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
  const cover = project.cover.kind === "image" ? project.cover : null;
  const coverSize = cover ? imageSize(cover.asset) : undefined;
  const url = project.work?.url ?? (live ? new URL(live.href).host : "");
  const ground = project.openers === "ground";

  return (
    <div className="cf" data-palette={project.slug === "hhcd-data-platform" ? "hhcd" : project.slug}>
      <div className="cf-frame">
        <CaseContents title={project.title} parts={contents} />

        <article className="cf-sheets" aria-labelledby="case-title">
          <header id="top" className="cf-sheet is-field cf-cover">
            <p className="cf-client">
              {project.legend && (
                <span className="cf-marks" aria-hidden="true">
                  {project.legend.map((l) => (
                    <span key={l.type} className={`cf-mark cf-mark-${l.type}`} />
                  ))}
                </span>
              )}
              <span>{project.client ?? project.context}</span>
            </p>
            <div className="cf-title-row">
              <h1 id="case-title" className="cf-h1">
                {project.title}
              </h1>
              {live && (
                <a className="cf-btn" href={live.href} target="_blank" rel="noopener">
                  Open the {live.label.toLowerCase()}
                  <OutArrow />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
            </div>
            <p className="cf-lede">{project.oneLiner}</p>
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
            {((project.shows && project.shows.length > 0) || others.length > 0) && (
              <div className="cf-cover-foot">
                {/* capability labels, not links: a capability usually spans several cards (playbook §7) */}
                {project.shows && project.shows.length > 0 && (
                  <div className="cf-shows">
                    <p id="cf-shows-title">What this shows</p>
                    <ul aria-labelledby="cf-shows-title">
                      {project.shows.map((c) => (
                        <li key={c.label}>
                          <CapabilityIcon capability={c.capability} />
                          {c.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {others.length > 0 && (
                  <p className="cf-actions">
                    {others.map((l) => (
                      <a key={l.href} className="cf-link" href={l.href} target="_blank" rel="noopener">
                        {l.label}
                        <OutArrow />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    ))}
                  </p>
                )}
              </div>
            )}
          </header>

          {project.work && cover && coverSize && (
            <section className="cf-sheet is-field cf-work" aria-labelledby="cf-work-title">
              <div className="cf-work-head">
                <h2 id="cf-work-title">{project.work.title}</h2>
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
              <div className="cf-plate">
                <BrowserFrame url={project.work.url} ratio={coverSize.width / coverSize.height}>
                  <Image
                    src={`/assets/${cover.asset}`}
                    alt={cover.alt}
                    width={coverSize.width}
                    height={coverSize.height}
                    quality={90}
                    sizes="(min-width: 1180px) 860px, 100vw"
                    priority
                  />
                </BrowserFrame>
              </div>
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
                  <Card key={s.id} section={s} idx={`${n}.${ci + 1}`} url={url} />
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
