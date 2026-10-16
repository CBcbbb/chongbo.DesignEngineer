import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { applications, applicationSelection } from "@content/applications";
import { HomePage } from "@/components/HomePage";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  alternates: { canonical: "/" },
};

export function generateStaticParams() {
  return Object.keys(applications).map((company) => ({ company }));
}

export default async function ApplicationPage({ params }: { params: Promise<{ company: string }> }) {
  const { company } = await params;
  const selection = applicationSelection(company);
  if (!selection) redirect("/");
  return <HomePage selection={selection} />;
}
