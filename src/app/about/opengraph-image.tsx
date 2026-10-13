import { profile } from "@content";
import { OG_CONTENT_TYPE, OG_SIZE, shareImage } from "@/lib/og";

export const alt = `About ${profile.name}, ${profile.title}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return shareImage({ sheet: { kicker: "No. 000 · About", title: `${profile.name}, ${profile.title}`, line: profile.headline } });
}
