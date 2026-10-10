import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects, SIGNALS } from "@content";
import { MediaSlot } from "@/components/media/MediaSlot";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { kindLabel, projectNumber, SIGNAL_SHORT, trayMeta } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.oneLiner,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: { type: "article", title: p.title, description: p.oneLiner, url: `/work/${p.slug}` },
    twitter: { card: "summary_large_image", title: p.title, description: p.oneLiner },
  };
}

export default async function CaseFile({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length]!;
  const facts: [string, React.ReactNode][] = [
    ["Role", project.role],
    ["Context", project.context],
    ["Status", project.status],
    ["Stack", project.stack.join(" · ")],
  ];

  return (
    <div className="wrap">
      <SiteHeader current="work" />
      <main id="main" tabIndex={-1} className="pb-20 pt-6 sm:pt-10">
        <div className="case-grid">
          <aside className="case-aside" aria-label="On this page">
            <nav aria-label="Sections">
              <p className="meta mb-3 !text-ink-2">On this page</p>
              <ol className="case-toc">
                {project.sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`}>
                      <span className="meta">{kindLabel(project, s)}</span>
                      <span>{s.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <article className="case-main" aria-labelledby="case-title">
            <header>
              <Link href="/#tray" className="back">
                <span aria-hidden="true">←</span> The tray
              </Link>
              <p className="meta mt-6 !text-ink-2">
                Case file {projectNumber(project)} · {trayMeta(project)}
              </p>
              <h1 id="case-title" className="case-h1">
                {project.title}
              </h1>
              <p className="case-lede">{project.oneLiner}</p>

              <div className="paper-drop mt-7">
              <div className="torn-sm case-facts">
                <dl>
                  {facts.map(([k, v]) => (
                    <div key={k}>
                      <dt className="meta">{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                  {project.links.length > 0 && (
                    <div>
                      <dt className="meta">Links</dt>
                      <dd>
                        <ul className="case-links">
                          {project.links.map((l) => (
                            <li key={l.href}>
                              <a href={l.href} rel="noopener" target="_blank">
                                {l.label}
                                <span className="sr-only"> (opens in a new tab)</span>
                                <span aria-hidden="true"> ↗</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
              </div>
            </header>

            <div className="card card-pad mt-8">
              <MediaSlot media={project.cover} priority />
            </div>

            <div className="mt-8 flex flex-col gap-8">
              {project.sections.map((s) => (
                <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="scroll-mt-6">
                  <div className="card card-pad">
                    <div className="flex items-center justify-between gap-4">
                      <p className="meta m-0">{kindLabel(project, s)}</p>
                      <a className="anchor" href={`#${s.id}`} aria-label={`Link to “${s.title}”`}>
                        #
                      </a>
                    </div>
                    <h2 id={`${s.id}-title`} className="case-h2">
                      {s.title}
                    </h2>
                    <div className="prose-paper">
                      {s.body.map((para) => (
                        <p key={para.slice(0, 32)}>{para}</p>
                      ))}
                    </div>
                    {s.media && (
                      <div className="mt-6">
                        <MediaSlot media={s.media} />
                      </div>
                    )}
                    <ul className="tags mt-6" aria-label="Shows">
                      {s.signals.map((sig) => (
                        <li key={sig} title={SIGNALS[sig]}>
                          {SIGNAL_SHORT[sig]}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              ))}
            </div>

            <nav aria-label="Next case file" className="paper-drop mt-14 max-w-[460px]">
              <Link href={`/work/${next.slug}`} className="mini torn-sm next-file">
                <span className="meta">Next case file</span>
                <span className="flex items-baseline gap-3">
                  <span className="n" aria-hidden="true">
                    {projectNumber(next)}
                  </span>
                  <span className="next-title">{next.title}</span>
                </span>
                <span className="next-one">{next.oneLiner}</span>
                <span className="meta go" aria-hidden="true">
                  Open case file →
                </span>
              </Link>
            </nav>
          </article>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
