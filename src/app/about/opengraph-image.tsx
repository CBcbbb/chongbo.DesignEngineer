import { profile } from "@content";
import { OG_CONTENT_TYPE, OG_SIZE, ticketImage } from "@/lib/og";

export const alt = `About ${profile.name}, ${profile.title}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ticketImage({
    head: "No. 000 · About",
    right: profile.location,
    big: "About",
    title: `${profile.name}, ${profile.title}`,
    line: profile.headline,
  });
}
