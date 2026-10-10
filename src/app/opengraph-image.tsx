import { profile } from "@content";
import { OG_CONTENT_TYPE, OG_SIZE, ticketImage } from "@/lib/og";

export const alt = `${profile.name}, ${profile.title} in ${profile.location}: ask a question and a ticket prints the work that answers it.`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ticketImage({
    head: "No. 000 · Ask Chongbo",
    right: "Design engineer",
    big: "Hi.",
    title: `${profile.name}, ${profile.location}`,
    line: profile.headline,
  });
}
