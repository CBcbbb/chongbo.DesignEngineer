import { notFound } from "next/navigation";
import { applications, applicationSelection } from "@content/applications";
import { OG_CONTENT_TYPE, OG_SIZE, shareImage } from "@/lib/og";

export const alt = "Work picked for you from Chongbo Ning's design engineering portfolio";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return Object.keys(applications).map((company) => ({ company }));
}

export default async function Image({ params }: { params: Promise<{ company: string }> }) {
  const { company } = await params;
  const selection = applicationSelection(company);
  if (!selection) notFound();
  return shareImage({ headline: { eyebrow: "Printed to order", title: selection.label } });
}
