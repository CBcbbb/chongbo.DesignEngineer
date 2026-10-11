import manifest from "@/generated/asset-manifest.json";

/**
 * Asset lookups come from a manifest generated at build time (scripts/asset-manifest.mjs), not from fs.
 * Reading public/ with fs makes Vercel bundle the whole asset folder into every server function.
 */
const assets = manifest as Record<string, { width: number; height: number } | null>;

export function assetExists(asset: string): boolean {
  return Object.hasOwn(assets, asset);
}

/**
 * Intrinsic size of a PNG or JPEG in public/assets, so screenshots render at their own proportions inside a plate
 * instead of being cropped. Returns null when the file is missing or is not a PNG/JPEG.
 */
export function imageSize(asset: string): { width: number; height: number } | null {
  return assets[asset] ?? null;
}
