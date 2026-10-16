import { describe, expect, it } from "vitest";
import { applications } from "@content/applications";
import { GET } from "@/app/for/[company]/route";
import { fallbackAnswer } from "@/lib/ask/fallback";
import { AskRequestSchema } from "@/lib/ask/schema";
import { buildCardIndex, cardKey } from "@/lib/cards";
import sitemap from "@/app/sitemap";

const request = (company: string, query = "") => GET(new Request(`https://www.chongboning.com/for/${encodeURIComponent(company)}${query}`), { params: Promise.resolve({ company }) });

describe("application links", () => {
  it("redirects to the configured topics and ref, without forwarding arbitrary input", async () => {
    const response = await request("granola", "?topics=seo-performance&ref=someone-else&brief=private&next=https://example.com");
    expect(response.status).toBe(307);
    expect(response.headers.get("x-robots-tag")).toBe("noindex, follow");
    expect(response.headers.get("cache-control")).toBe("no-store");
    const target = new URL(response.headers.get("location")!, "https://www.chongboning.com");
    expect(target.pathname).toBe("/ask");
    expect([...target.searchParams.keys()]).toEqual(["topics", "ref"]);
    expect(target.searchParams.get("topics")).toBe(applications.granola.topics.join(","));
    expect(target.searchParams.get("ref")).toBe("granola");
  });

  it("keeps self-tests separate, and sends unknown or inherited names home", async () => {
    const test = await request("granola", "?ref=test");
    expect(new URL(test.headers.get("location")!, "https://www.chongboning.com").searchParams.get("ref")).toBe("test");
    for (const name of ["unknown-company", "constructor", "toString", "__proto__"]) {
      expect((await request(name)).headers.get("location")).toBe("/");
    }
  });

  it("prints existing public work for every configured topic, without missing-work warnings", () => {
    const cards = buildCardIndex();
    for (const application of Object.values(applications)) {
      const parsed = AskRequestSchema.parse({ topics: application.topics });
      const result = fallbackAnswer(parsed);
      expect(result.missing).toEqual([]);
      expect(result.sheets.length).toBeGreaterThan(0);
      expect(result.sheets.length).toBeLessThanOrEqual(6);
      for (const sheet of result.sheets) expect(cards[cardKey(sheet.project, sheet.section)]).toBeDefined();
      expect(result.sheets[0]?.project).toBe("nike-athletes-closet");
    }
    expect(sitemap().some(({ url }) => url.includes("/for/"))).toBe(false);
  });
});
