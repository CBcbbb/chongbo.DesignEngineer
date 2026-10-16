import { applicationHref } from "@content/applications";

/** Temporary redirects let the selection change without changing the link in an application. */
export async function GET(request: Request, { params }: { params: Promise<{ company: string }> }) {
  const { company } = await params;
  const test = new URL(request.url).searchParams.get("ref") === "test";
  return new Response(null, {
    status: 307,
    headers: {
      Location: applicationHref(company, test),
      "X-Robots-Tag": "noindex, follow",
      "Cache-Control": "no-store",
    },
  });
}
