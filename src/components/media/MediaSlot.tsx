import Image from "next/image";
import type { Media } from "@content";
import { assetExists } from "@/lib/assets";
import { CodeBlock } from "./CodeBlock";
import { DataContractsDiagram } from "./DataContractsDiagram";
import { TokenLayersDiagram } from "./TokenLayersDiagram";

const ratioCss = (ratio: string) => ratio.replace(":", " / ");

function Caption({ text }: { text?: string }) {
  if (!text) return null;
  return <figcaption className="mt-3 font-mono text-[12.5px] leading-relaxed text-paper-dim">{text}</figcaption>;
}

function Placeholder({ kind, asset, need, ratio, alt }: { kind: string; asset: string; need: string; ratio: string; alt: string }) {
  const portrait = ratio === "9:16" || ratio === "3:4";
  return (
    <div
      className={`slot-ph ${portrait ? "mx-auto max-w-[300px]" : ""}`}
      style={{ aspectRatio: ratioCss(ratio) }}
      role="img"
      aria-label={`Placeholder for ${kind}: ${alt}`}
    >
      <span className="absolute left-4 top-4 uppercase tracking-[0.08em]" aria-hidden="true">
        {kind} · {ratio} · to come
      </span>
      <strong aria-hidden="true">public/assets/{asset}</strong>
      <span aria-hidden="true" className="max-w-[60ch]">
        {need}
      </span>
    </div>
  );
}

/** A small labelled placeholder for printed sheets, where the full one would crowd the page. */
function CompactPlaceholder({ label, alt }: { label: string; alt: string }) {
  return (
    <div className="slot-ph" role="img" aria-label={`Placeholder for ${label.toLowerCase()}: ${alt}`}>
      <span aria-hidden="true">[{label.toLowerCase()} to come]</span>
    </div>
  );
}

/** One framed image with an optional label underneath, or a placeholder when the asset is missing. */
function FramedImage({
  asset,
  alt,
  need,
  ratio,
  label,
  sizes,
}: {
  asset: string;
  alt: string;
  need: string;
  ratio: string;
  label?: string;
  sizes: string;
}) {
  const exists = assetExists(asset);
  return (
    <figure className="m-0 flex flex-col">
      {exists ? (
        <div
          className="relative overflow-hidden rounded-[4px] bg-[#f3f3ef] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]"
          style={{ aspectRatio: ratioCss(ratio) }}
        >
          <Image src={`/assets/${asset}`} alt={alt} fill sizes={sizes} className="object-contain" />
        </div>
      ) : (
        <Placeholder kind="Image" asset={asset} need={need} ratio={ratio} alt={alt} />
      )}
      {label && <figcaption className="mt-2 font-mono text-[12px] leading-snug text-paper-dim">{label}</figcaption>}
    </figure>
  );
}

/** A set of images laid out together, mirroring the image blocks in the old case study. */
function GroupSlot({ media }: { media: Extract<Media, { kind: "group" }> }) {
  const columns = media.columns ?? 2;
  const cellRatio = media.ratio ?? "4:3";

  const className =
    media.layout === "grid"
      ? `grid grid-cols-1 gap-4 sm:gap-5 ${columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`
      : media.layout === "row"
        ? "grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5"
        : "flex flex-col gap-5";

  const sizes =
    media.layout === "grid" && columns === 3 ? "(min-width: 900px) 220px, 100vw" : "(min-width: 900px) 330px, 100vw";

  return (
    <figure className="m-0">
      <div className={className}>
        {media.items.map((item) => (
          <FramedImage
            key={item.asset}
            asset={item.asset}
            alt={item.alt}
            need={item.need}
            ratio={item.ratio ?? cellRatio}
            label={item.label}
            sizes={sizes}
          />
        ))}
      </div>
      <Caption text={media.caption} />
    </figure>
  );
}

/**
 * `compact` is for printed sheets (about 300px wide): diagrams and images that exist render; evidence that doesn't
 * fit a sheet (code, image groups, steppers, specimens, project modules) is left off; only a genuinely missing image
 * or video shows a small placeholder.
 */
export function MediaSlot({ media, priority = false, compact = false }: { media: Media; priority?: boolean; compact?: boolean }) {
  if (compact) {
    // A code sample or a project's interactive module doesn't fit a printed sheet: the sheet prints without evidence
    // (the full case file has it), never a "to come" box that reads as unfinished work.
    if (media.kind === "code" || media.kind === "module") return null;
    if (media.kind === "group") return null;
    if ((media.kind === "image" || media.kind === "video") && !assetExists(media.asset))
      return <CompactPlaceholder label={media.kind === "image" ? "Image" : "Video"} alt={media.alt} />;
  }
  switch (media.kind) {
    case "group":
      return <GroupSlot media={media} />;
    case "diagram":
      return (
        <figure className="m-0">
          {media.diagram === "data-contracts" ? <DataContractsDiagram /> : <TokenLayersDiagram />}
          <Caption text={media.caption} />
        </figure>
      );
    case "code":
      return (
        <figure className="m-0">
          <CodeBlock code={media.code} language={media.language} />
          <Caption text={media.caption} />
        </figure>
      );
    case "image": {
      const exists = assetExists(media.asset);
      return (
        <figure className="m-0">
          {exists ? (
            <div
              className="relative overflow-hidden rounded-[4px] bg-[#f3f3ef] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]"
              style={{ aspectRatio: ratioCss(media.ratio) }}
            >
              <Image
                src={`/assets/${media.asset}`}
                alt={media.alt}
                fill
                priority={priority}
                sizes={compact ? "(min-width: 900px) 820px, 100vw" : "(min-width: 900px) 720px, 100vw"}
                className="object-cover"
              />
            </div>
          ) : (
            <Placeholder kind="Image" asset={media.asset} need={media.need} ratio={media.ratio} alt={media.alt} />
          )}
          <Caption text={media.caption} />
        </figure>
      );
    }
    case "video": {
      const exists = assetExists(media.asset);
      const poster = media.poster && assetExists(media.poster) ? `/assets/${media.poster}` : undefined;
      const portrait = media.ratio === "9:16";
      return (
        <figure className="m-0">
          {exists ? (
            <video
              className={`block w-full rounded-[4px] bg-black ${portrait ? "mx-auto max-w-[320px]" : ""}`}
              style={{ aspectRatio: ratioCss(media.ratio) }}
              controls
              muted
              playsInline
              preload="metadata"
              poster={poster}
              aria-label={media.alt}
            >
              <source src={`/assets/${media.asset}`} type="video/mp4" />
            </video>
          ) : (
            <Placeholder kind="Video" asset={media.asset} need={media.need} ratio={media.ratio} alt={media.alt} />
          )}
          <Caption text={media.caption ?? (exists ? media.alt : undefined)} />
        </figure>
      );
    }
    // Case-file blocks. On a printed sheet they reduce to their first image, or to a small label.
    case "compare":
    case "toggle":
      return (
        <MediaSlot
          media={{ kind: "image", asset: media.a.asset, alt: media.a.alt, need: media.need, ratio: "16:10", caption: media.caption }}
          compact={compact}
          priority={priority}
        />
      );
    // A diagram that steps through states, or colour specimens, don't fit a printed sheet: the sheet prints
    // without evidence rather than a "to come" box that reads as unfinished work.
    case "stepper":
    case "specimens":
    case "module":
    case "deck":
      return null;
    case "metrics":
      return (
        <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 font-mono text-[12px] text-paper-dim">
          {media.items.map((m) => (
            <li key={m.label}>
              <b className="block font-sans text-[22px] font-semibold text-paper-ink">{m.value}</b>
              {m.label}
            </li>
          ))}
        </ul>
      );
  }
}
