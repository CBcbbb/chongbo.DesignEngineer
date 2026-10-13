export type AssetManifest = Record<string, { width: number; height: number } | null>;
export const ASSET_ROOT: string;
export const MANIFEST_PATH: string;
export function buildManifest(root?: string): AssetManifest;
export function trackedAssets(root?: string): string[] | null;
