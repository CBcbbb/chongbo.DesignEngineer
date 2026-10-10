import { profile } from "@content";
import { OG_CONTENT_TYPE, OG_SIZE, printerImage } from "@/lib/og";

export const alt = `${profile.name}, ${profile.title} in ${profile.location}. What skills are you looking for? Choose skills or describe the role, and a printer prints the projects that show them.`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return printerImage({ eyebrow: "Printed to order", title: "What skills are you looking for?" });
}
