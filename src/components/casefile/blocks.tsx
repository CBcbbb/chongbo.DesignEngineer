import Image from "next/image";
import type { Media, Metric, Section, Specimen, Step } from "@content";
import { assetExists, imageSize } from "@/lib/assets";
import { CodeBlock } from "@/components/media/CodeBlock";
import { ComparePlate } from "./ComparePlate";
import { DataStepper } from "./DataStepper";
import { VideoPlate } from "./VideoPlate";

/**
 * The block library (playbook §7): every case file is built from these.
 * text · media (plate, video) · decision pair (Section.layout "pair") · compare · code · diagram (stepper) ·
 * metric strip · steps · gallery (row, phones) · specimens.
 */

const src = (asset: string) => `/assets/${asset}`;

export function Caption({ index, text }: { index: string; text?: string }) {
  if (!text) return null;
  return (
    <figcaption className="cf-caption">
      <b>{index}</b>
      {text}
    </figcaption>
  );
}

function Missing({ asset, need }: { asset: string; need: string }) {
  return (
    <div className="slot-ph" style={{ aspectRatio: "16 / 10" }} role="img" aria-label={`Image to come: ${need}`}>
      <strong aria-hidden="true">public/assets/{asset}</strong>
      <span aria-hidden="true">{need}</span>
    </div>
  );
}

/** A screenshot or photo on the project's field, at its own proportions. */
export function Shot({
  asset,
  alt,
  need,
  sizes = "(min-width: 1100px) 840px, 100vw",
  priority = false,
  crop = false,
}: {
  asset: string;
  alt: string;
  need?: string;
  sizes?: string;
  priority?: boolean;
  /** Crop to 16:10 so plates in a row line up. */
  crop?: boolean;
}) {
  const dim = imageSize(asset);
  if (!dim || !assetExists(asset)) return <Missing asset={asset} need={need ?? alt} />;
  return (
    <div className="cf-plate" data-crop={crop || undefined}>
      <div className="cf-plate-shot">
        <Image src={src(asset)} alt={alt} width={dim.width} height={dim.height} sizes={sizes} priority={priority} />
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

function Metrics({ items }: { items: Metric[] }) {
  return (
    <ul className="cf-metrics">
      {items.map((m) => (
        <li key={m.label}>
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
      {steps.map((s) => (
        <li key={s.text}>
          {s.image && assetExists(s.image.asset) && (
            <div className="cf-step-img">
              <Image src={src(s.image.asset)} alt={s.image.alt} fill sizes="(min-width: 760px) 280px, 100vw" />
            </div>
          )}
          {s.label && <p className="cf-mono cf-step-label">{s.label}</p>}
          {s.title && <h4>{s.title}</h4>}
          <p>{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

/** Renders one card's media with the case-file blocks. `index` numbers the figure, e.g. "03". */
export function CaseMedia({ media, index, priority = false }: { media: Media; index: string; priority?: boolean }) {
  switch (media.kind) {
    case "image":
      return (
        <figure className="cf-figure">
          <Shot asset={media.asset} alt={media.alt} need={media.need} priority={priority} />
          <Caption index={index} text={media.caption} />
        </figure>
      );
    case "video":
      return (
        <VideoPlate
          src={src(media.asset)}
          webm={assetExists(media.asset.replace(/\.mp4$/, ".webm")) ? src(media.asset.replace(/\.mp4$/, ".webm")) : undefined}
          poster={media.poster && assetExists(media.poster) ? src(media.poster) : undefined}
          label={media.alt}
          caption={media.caption}
          index={index}
        />
      );
    case "group": {
      const phones = media.ratio === "9:16";
      return (
        <figure className="cf-figure">
          {phones ? (
            <div className="cf-phones">
              {media.items.map((it) => (
                <div key={it.asset} className="cf-phone">
                  <div className="cf-phone-screen">
                    <Image src={src(it.asset)} alt={it.alt} fill sizes="(min-width: 1000px) 220px, 45vw" />
                  </div>
                  {it.label && <p className="cf-label">{it.label}</p>}
                </div>
              ))}
            </div>
          ) : (
            <div className="cf-row">
              {media.items.map((it) => (
                <div key={it.asset}>
                  <Shot asset={it.asset} alt={it.alt} need={it.need} sizes="(min-width: 1100px) 420px, 100vw" crop />
                  {it.label && <p className="cf-label">{it.label}</p>}
                </div>
              ))}
            </div>
          )}
          <Caption index={index} text={media.caption} />
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
          index={index}
          caption={media.caption}
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
      return <DataStepper steps={media.steps} caption={media.caption} index={index} />;
    case "specimens":
      return (
        <figure className="cf-figure">
          <Specimens items={media.items} />
          <Caption index={index} text={media.caption} />
        </figure>
      );
    case "metrics":
      return (
        <figure className="cf-figure">
          <Metrics items={media.items} />
          <Caption index={index} text={media.caption} />
        </figure>
      );
    case "code":
      return (
        <figure className="cf-figure">
          <CodeBlock code={media.code} language={media.language} />
          <Caption index={index} text={media.caption} />
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
