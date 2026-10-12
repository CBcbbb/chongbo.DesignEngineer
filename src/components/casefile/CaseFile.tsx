import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Project, Section } from "@content";
import { pad2 } from "@/lib/printed";
import { projectNumber } from "@/lib/site";
import { imageSize } from "@/lib/assets";
import { CaseMedia, CardTitle, Facts, Keys, StepsRow } from "./blocks";
import { CaseContents, type ContentsPart } from "./CaseContents";
import { CoverNetwork } from "./CoverNetwork";
import { CaseModule } from "./modules";
import { CoverWires } from "@/components/case/any-data";
import { BrowserFrame } from "./Frame";
import { CapabilityIcon, OutArrow, WhoIcon } from "./icons";

/**
 * The canvas (a dot field that is the card itself, not a box) sits under the live product's windows and phone
 * screens; everything else sits on plain paper or runs to the card's edges.
 */
function canvasOf(section: Section): "" | undefined {
  const m = section.media;
  if (!m || section.steps?.length || (section.layout && section.layout !== "stack")) return undefined;
  return m.kind === "compare" || m.kind === "video" || m.kind === "module" || (m.kind === "group" && m.ratio === "9:16") ? "" : undefined;
}

/**
 * How tall a card is (playbook §7). `screen`: the evidence needs the whole screen (the product's windows, recordings,
 * phones), so the card is one screen tall and the evidence scales into it. `auto`: the card is as tall as its
 * content, never padded out, so a short card stays short.
 */
function sizeOf(section: Section): "screen" | "auto" {
  const m = section.media;
  if (!m || section.steps?.length || section.layout === "pair") return "auto";
  if (m.kind === "video" || m.kind === "compare") return "screen";
  if (m.kind === "group" && m.ratio === "9:16") return "screen";
  return "auto";
}

/**
 * How the evidence sits in a card one screen tall: pictures, recordings and diagrams `fill` the space under the text
 * and scale to it; tables, figures and steps keep their own height and sit at the foot.
 */
function fitOf(section: Section): "fill" | "foot" {
  const k = section.media?.kind;
  if (!k) return "foot";
  if (section.steps?.length) return "fill";
  return k === "metrics" || k === "specimens" || k === "code" ? "foot" : "fill";
}

/**
 * One card = one sheet: the index above the claim on the left, the reasoning on the right, the evidence underneath
 * at full width (or beside the text, for `layout: "pair"`, where the screen is wide and tall enough).
 */
export function Card({ section, idx, url, titleId, as: H = "h3" }: { section: Section; idx: string; url: string; titleId?: string; as?: "h2" | "h3" }) {
  const dark = section.surface === "dark";
  const side = section.layout === "pair";
  const hasEvidence = !!section.media || !!section.steps?.length;
  const cls = ["cf-sheet", "is-card", dark && "is-dark", side && "is-side", !hasEvidence && "is-text"].filter(Boolean).join(" ");
  return (
    <section id={titleId ? undefined : section.id} className={cls} data-canvas={canvasOf(section)} data-size={sizeOf(section)} data-layout={section.layout ?? "stack"} aria-labelledby={titleId ?? `${section.id}-title`}>
      <div className="cf-head">
        <div>
          <p className="cf-meta">
            <span className="cf-idx">{idx}</span>
          </p>
          <H id={titleId ?? `${section.id}-title`} className="cf-h3">
            <CardTitle section={section} />
          </H>
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
        <div className="cf-evidence" data-fit={fitOf(section)} data-split={section.media && section.steps?.length ? (section.media.kind === "deck" ? "deck" : "") : undefined}>
          {section.media && <CaseMedia media={section.media} index={idx} url={url} bleed={!section.steps?.length} />}
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
/** The palette a project's cards use (case-palettes.css). */
export const paletteOf = (project: Project) => (project.slug === "hhcd-data-platform" ? "hhcd" : project.slug);

/** The index printed on a card, "02.3": its part, then its place in it. Same numbering as the case file. */
export function cardIndexOf(project: Project, section: Section): string {
  const parts = project.parts ?? [{ id: "main", label: "", title: project.title }];
  const partId = section.part ?? parts[0]!.id;
  const pi = Math.max(0, parts.findIndex((p) => p.id === partId));
  const ci = project.sections.filter((s) => (s.part ?? parts[0]!.id) === partId).findIndex((s) => s.id === section.id);
  return `${pad2(pi + 1)}.${ci + 1}`;
}

/** The address shown in a card's browser frames: the live product's, or the host of the live link. */
export function workUrlOf(project: Project): string {
  const live = project.links.find((l) => /live/i.test(l.label));
  return project.work?.url ?? (live ? new URL(live.href).host : "");
}

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
          <header id="top" className={`cf-sheet is-field cf-cover${project.coverArt ? ` has-art-${project.coverArt}` : ""}`}>
            {/* who and what: the client and the title, with the cover art (if any) in the corner above them */}
            <div className="cf-cover-top">
              {project.coverArt === "network" && <CoverNetwork />}
              {project.coverArt === "wires" && <CoverWires />}
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
              <h1 id="case-title" className="cf-h1">
                {project.title}
              </h1>
            </div>
            {/* the line under the title, with the live link at its right (under it on tablets and phones) */}
            <div className="cf-cover-line">
              <p className="cf-lede">{project.oneLiner}</p>
              {(live || others.length > 0) && (
                <p className="cf-cover-act">
                  {live && (
                    <a className="cf-btn" href={live.href} target="_blank" rel="noopener">
                      Open the {live.label.toLowerCase()}
                      <OutArrow />
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  )}
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
            <dl className={`cf-facts${project.roleSplit ? " has-split" : ""}`}>
              <div>
                <dt>Role</dt>
                <dd>
                  {project.roleSplit ? (
                    <>
                      <span className="cf-role-title">{project.role}</span>
                      <ul className="cf-role-split">
                        {project.roleSplit.map((r) => (
                          <li key={r.what}>
                            <WhoIcon who={r.with} />
                            <span>
                              {r.what} <span className="cf-role-note">{r.note}</span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    project.role
                  )}
                </dd>
              </div>
              {project.outcome && (
                <div>
                  <dt>Outcome</dt>
                  <dd>{project.outcome}</dd>
                </div>
              )}
            </dl>
            {project.shows && project.shows.length > 0 && (
              <div className="cf-cover-foot">
                {/* capability labels, not links: a capability usually spans several cards (playbook §7) */}
                <div className="cf-shows">
                  <p id="cf-shows-title">What this shows</p>
                  <ul aria-labelledby="cf-shows-title">
                    {project.shows.map((c) => (
                      <li key={c.label}>
                        <CapabilityIcon capability={c.capability} icon={c.icon} />
                        {c.label}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </header>

          {project.work?.module && (
            <section className="cf-sheet is-field cf-work" data-canvas="" aria-labelledby="cf-work-title">
              <div className="cf-work-head">
                <h2 id="cf-work-title">{project.work.title}</h2>
              </div>
              <div className="cf-plate">
                <CaseModule name={project.work.module} />
              </div>
            </section>
          )}

          {project.work && !project.work.module && project.work.url && cover && coverSize && (
            <section className="cf-sheet is-field cf-work" data-canvas="" aria-labelledby="cf-work-title">
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
