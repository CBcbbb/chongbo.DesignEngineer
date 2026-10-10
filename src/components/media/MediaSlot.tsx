import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import type { Media } from "@content";
import { CodeBlock } from "./CodeBlock";
import { DataContractsDiagram } from "./DataContractsDiagram";
import { TokenLayersDiagram } from "./TokenLayersDiagram";

const ASSET_DIR = path.join(process.cwd(), "public", "assets");

/** Checked at build time: pages are static, so a newly added asset appears on the next build. */
function assetExists(asset: string): boolean {
  try {
    return fs.statSync(path.join(ASSET_DIR, asset)).isFile();
  } catch {
    return false;
  }
}

const ratioCss = (ratio: string) => ratio.replace(":", " / ");

function Caption({ text }: { text?: string }) {
  if (!text) return null;
  return <figcaption className="mt-3 font-mono text-[12.5px] leading-relaxed text-paper-dim">{text}</figcaption>;
}

function Placeholder({ kind, asset, need, ratio, alt }: { kind: string; asset: string; need: string; ratio: string; alt: string }) {
  const portrait = ratio === "9:16";
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

/**
 * `compact` is for printed sheets (about 300px wide): diagrams render for real, images that exist render,
 * and missing images, videos and code samples become a small placeholder.
 */
export function MediaSlot({ media, priority = false, compact = false }: { media: Media; priority?: boolean; compact?: boolean }) {
  if (compact) {
    if (media.kind === "code") return <CompactPlaceholder label="Code sample" alt={media.caption ?? `${media.language} code`} />;
    if ((media.kind === "image" || media.kind === "video") && !assetExists(media.asset))
      return <CompactPlaceholder label={media.kind === "image" ? "Image" : "Video"} alt={media.alt} />;
  }
  switch (media.kind) {
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
                sizes={compact ? "340px" : "(min-width: 900px) 720px, 100vw"}
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
  }
}
