import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { profile } from "@content";
import { applications, applicationSelection } from "@content/applications";
import { HomePage } from "@/components/HomePage";

export async function generateMetadata({ params }: { params: Promise<{ company: string }> }): Promise<Metadata> {
  const { company } = await params;
  const selection = applicationSelection(company);
  if (!selection) redirect("/");
  const title = `${selection.label} · ${profile.name}`;
  const description = `Work picked for ${selection.company}, from ${profile.name}'s design engineering portfolio. Choose a skill or describe a role to explore more.`;
  const url = `/for/${company}`;
  return {
    title: { absolute: title },
    description,
    robots: { index: false, follow: true },
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website", locale: "en_GB", siteName: profile.name },
    twitter: { card: "summary_large_image", title, description },
  };
}

export function generateStaticParams() {
  return Object.keys(applications).map((company) => ({ company }));
}

export default async function ApplicationPage({ params }: { params: Promise<{ company: string }> }) {
  const { company } = await params;
  const selection = applicationSelection(company);
  if (!selection) redirect("/");
  return <HomePage selection={selection} />;
}
