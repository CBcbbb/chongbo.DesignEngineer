import { profile, suggestedQuestions } from "@content";
import { OG_CONTENT_TYPE, OG_SIZE, projectorImage } from "@/lib/og";

export const alt = `${profile.name}, ${profile.title} in ${profile.location}. Ask me anything about my work: put a card in the projector, or write your own, and the work that answers it is projected, one slide per project.`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return projectorImage({
    title: "Ask me anything about my work.",
    line: "Put a card in the projector, and the work that answers it is projected.",
    card: suggestedQuestions[0] ?? "",
  });
}
