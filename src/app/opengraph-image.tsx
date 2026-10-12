import { profile } from "@content";
import { OG_CONTENT_TYPE, OG_SIZE, printerImage } from "@/lib/og";

export const alt = `${profile.name}, ${profile.title} in ${profile.location}. What are you hiring for? Tell a printer what the role needs and it prints the parts of the work that answer it.`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return printerImage({ eyebrow: "Printed to order", title: "What are you hiring for?" });
}
