import Image from "next/image";
import type { CSSProperties } from "react";
import type { Check, Media, Metric, Section, Specimen, Step } from "@content";
import { assetExists, imageSize } from "@/lib/assets";
import { CodeBlock } from "@/components/media/CodeBlock";
import { ComparePlate } from "./ComparePlate";
import { DataFlow } from "./DataFlow";
import { ViewToggle } from "./ViewToggle";
import { VideoPlate } from "./VideoPlate";
import { Zoom } from "./Zoom";

/**
 * The block library (playbook §7): every case file is built from these.
 * text · media (plate, recording in a browser frame) · decision pair (Section.layout "pair") · compare · code ·
 * diagram (stepper) · metric strip · steps · gallery (row, phones) · specimens · facts.
 * No captions under evidence (playbook §6): what it proves is in the card's heading or body; labels inside the
 * evidence stay. Images keep their own ratio and are never cropped. One edge per piece of evidence (a hairline),
 * never a mount: where a project wants a surface, the card itself becomes the canvas (`data-canvas`).
 */

const src = (asset: string) => `/assets/${asset}`;
/** Screenshots and photos are served at quality 90, so fine text stays sharp. */
const Q = 90;

function Missing({ asset, need }: { asset: string; need: string }) {
  return (
    <div className="slot-ph" style={{ aspectRatio: "16 / 10" }} role="img" aria-label={`Image to come: ${need}`}>
      <strong aria-hidden="true">public/assets/{asset}</strong>
      <span aria-hidden="true">{need}</span>
    </div>
  );
}

/** A screenshot or photo straight on the card, whole and at its own proportions, with a hairline edge. */
export function Shot({
  asset,
  alt,
  need,
  sizes = "(min-width: 1100px) 860px, 100vw",
  priority = false,
}: {
  asset: string;
  alt: string;
  need?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const dim = imageSize(asset);
  if (!dim || !assetExists(asset)) return <Missing asset={asset} need={need ?? alt} />;
  return (
    <div className="cf-plate">
      <div className="cf-plate-shot">
        <Image src={src(asset)} alt={alt} width={dim.width} height={dim.height} sizes={sizes} priority={priority} quality={Q} />
      </div>
    </div>
  );
}

export function Keys({ keys }: { keys: string[] }) {
  return (
    <ul className="cf-keys" aria-label="Keys">
      {keys.map((k, i) => (
        <li key={`${k}${i}`} style={{ display: "contents" }}>
          {k === "+" ? (
            <span className="plus" aria-hidden="true">
              +
            </span>
          ) : (
            <kbd>{k}</kbd>
          )}
        </li>
      ))}
    </ul>
  );
}

const Cross = () => (
  <svg viewBox="0 0 12 12" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M3.2 3.2l5.6 5.6M8.8 3.2 3.2 8.8" />
  </svg>
);

/**
 * Figures grouped by what they measured (e.g. VOICE / the Centre's version), coloured by what they mean: red for a
 * number that looked right but missed something, green for one that can be trusted; each group's checks under it.
 */
function Tally({ items, checks = [] }: { items: Metric[]; checks?: Check[] }) {
  const groups = [...new Set(items.map((m) => m.note ?? ""))];
  return (
    <div className="cf-tally">
      {groups.map((g) => {
        const own = items.filter((m) => (m.note ?? "") === g);
        const tone = own.find((m) => m.tone)?.tone ?? "pass";
        return (
          <section key={g} className="cf-tally-group" data-tone={tone} aria-label={g}>
            <p className="cf-tally-head">
              <span className="cf-tally-dot" aria-hidden="true" />
              {g}
            </p>
            <ul className="cf-tally-figures">
              {own.map((m) => (
                <li key={m.label}>
                  <span className="cf-tally-value">{m.value}</span>
                  <span className="cf-tally-label">{m.label}</span>
                </li>
              ))}
            </ul>
            {checks.some((c) => c.group === g) && (
              <ul className="cf-tally-checks">
                {checks
                  .filter((c) => c.group === g)
                  .map((c) => (
                    <li key={c.text} data-tone={c.tone}>
                      <span className="cf-tally-mark">{c.tone === "pass" ? <Tick /> : <Cross />}</span>
                      {c.text}
                    </li>
                  ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}

function Metrics({ items }: { items: Metric[] }) {
  const typed = items.filter((m) => m.type);
  const parts = typed.length > 1 && typed.every((m) => /^\d+$/.test(m.value));
  const cols = parts ? items.map((m) => (m.type ? `minmax(0, ${m.value}fr)` : "auto")).join(" ") : undefined;
  return (
    <ul className={`cf-metrics${parts ? " is-parts" : ""}`} style={cols ? { gridTemplateColumns: cols } : undefined}>
      {items.map((m) => (
        <li key={m.label} className={parts && !m.type ? "is-total" : m.type ? `is-${m.type}` : undefined}>
          <span className={`cf-metric-value ${m.type ? `cf-type-${m.type}` : ""}`}>{m.value}</span>
          <span className="cf-metric-label">
            {m.type && <span className={`cf-mark cf-mark-${m.type}`} aria-hidden="true" />}
            {m.label}
          </span>
          {m.note && <span className="cf-mono cf-metric-note">{m.note}</span>}
        </li>
      ))}
    </ul>
  );
}

const Tick = () => (
  <svg viewBox="0 0 12 12" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="m2.5 6.2 2.3 2.3 4.7-5" />
  </svg>
);

/** Sample names from the platform, one per type. */
const SAMPLE: Record<Specimen["type"], string> = {
  people: "Hua Dong",
  partners: "Royal College of Art",
  projects: "Design Bugs Out",
  methods: "Co-design",
};

function Specimens({ items }: { items: Specimen[] }) {
  return (
    <div className="cf-specimens" role="table" aria-label="Brand colours and their contrast on white">
      <div className="cf-spec-head" role="row">
        <span role="columnheader">Type</span>
        <span role="columnheader">Map name: bold, large</span>
        <span role="columnheader">Small text</span>
      </div>
      {items.map((s) => (
        <div key={s.type} className="cf-spec-row" role="row">
          <span className="cf-spec-type" role="cell">
            <span className={`cf-mark cf-mark-${s.type}`} aria-hidden="true" />
            {s.label}
          </span>
          <div role="cell">
            <span className="cf-spec-name" style={{ color: s.colour }}>
              {SAMPLE[s.type]}
            </span>
            <div className="cf-ratio">
              {s.colour.toUpperCase()} · {s.ratio.toFixed(2)}:1
              <span className="cf-pass">
                <Tick /> Large text
              </span>
            </div>
          </div>
          <div role="cell">
            {s.text ? (
              <>
                <span className="cf-spec-small" style={{ color: s.text.colour }}>
                  {SAMPLE[s.type]}
                </span>
                <div className="cf-ratio">
                  <span className="cf-spec-fail">{s.ratio.toFixed(2)}:1</span>
                  {s.text.colour.toUpperCase()} · {s.text.ratio.toFixed(2)}:1
                  <span className="cf-pass">
                    <Tick /> AA
                  </span>
                </div>
              </>
            ) : (
              <>
                <span className="cf-spec-small" style={{ color: s.colour }}>
                  {SAMPLE[s.type]}
                </span>
                <div className="cf-ratio">
                  Same colour · {s.ratio.toFixed(2)}:1
                  <span className="cf-pass">
                    <Tick /> AA
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function StepsRow({ steps }: { steps: Step[] }) {
  return (
    <ol className="cf-steps">
      {steps.map((s) => {
        const dim = s.image ? imageSize(s.image.asset) : undefined;
        return (
        <li key={s.text}>
          {s.image && dim && assetExists(s.image.asset) && (
            <div className="cf-step-img">
              <Zoom src={src(s.image.asset)} alt={s.image.alt} width={dim.width} height={dim.height} sizes="(min-width: 760px) 300px, 100vw" />
            </div>
          )}
          {s.label && <p className="cf-mono cf-step-label">{s.label}</p>}
          {s.title && <h4>{s.title}</h4>}
          <p>{s.text}</p>
        </li>
        );
      })}
    </ol>
  );
}

/** Short labelled facts, e.g. the closing card's Context and Team. */
export function Facts({ items }: { items: { label: string; text: string }[] }) {
  return (
    <dl className="cf-notes">
      {items.map((f) => (
        <div key={f.label}>
          <dt>{f.label}</dt>
          <dd>{f.text}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Images side by side at one height, each as wide as its own ratio makes it; the label above each. */
function Row({ items }: { items: { asset: string; alt: string; need?: string; label?: string }[] }) {
  const r = items.map((it) => {
    const d = imageSize(it.asset);
    return d ? d.width / d.height : 4 / 3;
  });
  const sum = r.reduce((a, b) => a + b, 0);
  return (
    <div className="cf-cq">
      <div className="cf-row" style={{ "--sum": sum.toFixed(3), "--gaps": `${(items.length - 1) * 24}px` } as CSSProperties}>
        {items.map((it, i) => (
          <div key={it.asset} className="cf-row-item" style={{ "--r": r[i]!.toFixed(3) } as CSSProperties}>
            <Shot asset={it.asset} alt={it.alt} need={it.need} sizes="(min-width: 1100px) 460px, 100vw" />
            {it.label && <p className="cf-label">{it.label}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Renders one card's evidence with the case-file blocks. `index` keeps form controls unique, e.g. "02.2";
 * `url` is the product's address, shown in browser frames.
 */
export function CaseMedia({
  media,
  index,
  url,
  priority = false,
  bleed = false,
}: {
  media: Media;
  index: string;
  url: string;
  priority?: boolean;
  /** A screenshot that runs the full width of the card at its foot, on the product's white. */
  bleed?: boolean;
}) {
  switch (media.kind) {
    case "image": {
      if (bleed) {
        const dim = imageSize(media.asset);
        if (!dim || !assetExists(media.asset)) return <Missing asset={media.asset} need={media.need} />;
        return (
          <figure className="cf-figure cf-bleed">
            <Image src={src(media.asset)} alt={media.alt} width={dim.width} height={dim.height} sizes="(min-width: 1100px) 860px, 100vw" priority={priority} quality={Q} />
          </figure>
        );
      }
      return (
        <figure className="cf-figure">
          <Shot asset={media.asset} alt={media.alt} need={media.need} priority={priority} />
        </figure>
      );
    }
    case "toggle": {
      const da = imageSize(media.a.asset);
      const db = imageSize(media.b.asset);
      if (!da || !db) return <Missing asset={media.a.asset} need={media.need} />;
      return (
        <ViewToggle
          keys={media.keys}
          a={{ src: src(media.a.asset), width: da.width, height: da.height, alt: media.a.alt, label: media.a.label }}
          b={{ src: src(media.b.asset), width: db.width, height: db.height, alt: media.b.alt, label: media.b.label }}
        />
      );
    }
    case "video": {
      const webm = media.asset.replace(/\.mp4$/, ".webm");
      const poster = media.poster && assetExists(media.poster) ? media.poster : undefined;
      const dim = poster ? imageSize(poster) : undefined;
      return (
        <VideoPlate
          src={src(media.asset)}
          webm={assetExists(webm) ? src(webm) : undefined}
          poster={poster ? src(poster) : undefined}
          label={media.alt}
          url={url}
          ratio={dim ? dim.width / dim.height : 16 / 10}
        />
      );
    }
    case "group": {
      const phones = media.ratio === "9:16";
      return (
        <figure className="cf-figure">
          {phones ? (
            <div className="cf-phones">
              {media.items.map((it) => {
                const dim = imageSize(it.asset);
                return (
                  <div key={it.asset} className="cf-phone">
                    {dim && <Zoom src={src(it.asset)} alt={it.alt} width={dim.width} height={dim.height} sizes="(min-width: 1000px) 300px, 45vw" />}
                    {it.label && <p className="cf-label">{it.label}</p>}
                  </div>
                );
              })}
            </div>
          ) : (
            <Row items={media.items} />
          )}
        </figure>
      );
    }
    case "compare": {
      const da = imageSize(media.a.asset);
      const db = imageSize(media.b.asset);
      if (!da || !db) return <Missing asset={media.a.asset} need={media.need} />;
      return (
        <ComparePlate
          legend={media.label}
          url={url}
          index={index}
          a={{ src: src(media.a.asset), width: da.width, height: da.height, alt: media.a.alt, label: media.a.label }}
          b={{ src: src(media.b.asset), width: db.width, height: db.height, alt: media.b.alt, label: media.b.label }}
          video={
            media.video && assetExists(media.video.asset)
              ? {
                  src: src(media.video.asset),
                  webm: assetExists(media.video.asset.replace(/\.mp4$/, ".webm")) ? src(media.video.asset.replace(/\.mp4$/, ".webm")) : undefined,
                  split: media.video.split,
                }
              : undefined
          }
        />
      );
    }
    case "stepper":
      return <DataFlow steps={media.steps} />;
    case "specimens":
      return (
        <figure className="cf-figure">
          <Specimens items={media.items} />
        </figure>
      );
    case "metrics":
      return (
        <figure className="cf-figure">
          {media.items.some((m) => m.tone) ? <Tally items={media.items} checks={media.checks} /> : <Metrics items={media.items} />}
        </figure>
      );
    case "code":
      return (
        <figure className="cf-figure">
          <CodeBlock code={media.code} language={media.language} />
        </figure>
      );
    case "diagram":
      return null;
  }
}

/** Splits "Accessibility – keyboard navigation" so the series prefix can be set quieter. */
export function CardTitle({ section }: { section: Section }) {
  const m = section.title.match(/^(.+?) – (.+)$/);
  if (!m) return <>{section.title}</>;
  return (
    <>
      <span className="cf-h3-pre">{m[1]} – </span>
      {m[2]}
    </>
  );
}
