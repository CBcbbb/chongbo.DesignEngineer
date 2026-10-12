import { getProject, projects } from "@content";
import { OG_CONTENT_TYPE, OG_SIZE, ticketImage } from "@/lib/og";
import { projectNumber } from "@/lib/site";

export const alt = "Case file from Chongbo Ning's portfolio";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug) ?? projects[0]!;
  return ticketImage({
    head: "Case file · Chongbo Ning",
    right: "",
    big: projectNumber(p),
    title: p.title,
    line: p.oneLiner,
  });
}
