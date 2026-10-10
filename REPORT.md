# Report for Chongbo

What was built, what passed, what's left, and what to do with the developer this afternoon.

## What was built

The real site in Next.js, faithful to the approved ticket printer prototype.

- **Home (`/`):** the red ticket printer with the question box built in, the welcome ticket, suggestion chips and "The tray" of torn-edge project tickets. While it thinks, the LED blinks and a lip of paper inches at the slot. The answer then prints bottom edge first, in steps, like a thermal printer. The ticket shows the "Matched · topic" stamp, the reply, the best card from the case file, "Also answers this", "Open the case file" and "You asked". "Tear off and ask again" drops the ticket off the page.
- **Answers (`/ask?q=…`):** the same ticket rendered on the server. The home form uses it when JavaScript is off, and it gives a shareable link. Search engines don't index it.
- **Case files (`/work/<slug>`):** HHCD, Component Store, Nike, This site and WildEcho. A header card (role, context, status, stack, links), the cover, every section as a paper card with an anchor, label, media and topic chips, then a next-project ticket. Wide screens get a sticky "On this page" list.
- **About (`/about`):** profile, education, email as selectable text plus a mailto link, LinkedIn, GitHub and the archive.
- **Diagrams:** "data contracts" and "token layers", built in HTML so they work with screen readers and reflow on phones. No employer, product, customer or Redis is named.
- **Media slots:** each missing image or video shows a labelled placeholder. The checklist is in `docs/ASSETS.md`.
- **SEO:** per-page titles and descriptions, canonical URLs, Open Graph and Twitter cards, ticket-style share images, `sitemap.xml`, `robots.txt`, and Person structured data on the home page.
- **Ask API:** with a key, Claude Haiku chooses cards from your content. Without one, a keyword matcher answers, so the site works either way. Per-IP rate limit, 300-character limit, daily cap on model calls, and question text is never logged.

All copy comes from `content/`. The "This site" case file has been updated to describe the ticket printer, and its cover now uses a screenshot of the real site.

## Quality gates (all passing)

| Gate | Result |
|---|---|
| lint | pass, 0 warnings |
| typecheck | pass (strict) |
| unit tests | 34 pass |
| build | pass |
| contrast | 44/44 colour pairs pass WCAG AA, light and dark |
| Playwright + axe at 1440 and 390 | 50/50 pass |

Zero accessibility violations on every page, including after asking. Also checked: keyboard-only asking, the form with JavaScript off, the rate-limit ticket, reduced motion, no sideways scroll at 320px, and 44px tap targets. Screenshots are in `docs/screenshots/`.

## Craft changes from the prototype

- "Ask Chongbo" and "Ready" sit on small engraved plates in the darker red, because white on the bright top failed contrast.
- Focus rings stay visible on paper in dark mode.
- Chips and "Try asking" rows are real links without JavaScript, and print in place with it.
- The stamp thumps on and tray tickets lift. Reduced motion turns this off.

## Not done yet

- **Real media.** See `docs/ASSETS.md`. Start with the HHCD table view, the Nike recording and the HHCD cover.
- **Model path not tested live.** There was no key. It follows the current SDK docs, and a test runs the real SDK against a fake network.
- **Rate limit is per server instance.** Fine to start; the README shows how to move it to Upstash Redis.
- **No manual screen reader or Safari pass.**

## Decisions for you

1. **Source link:** add it in `content/projects/this-site.ts` once the repo is public.
2. **HHCD rebuild link:** add the rebuild's URL to `content/projects/hhcd.ts` once it's deployed.
3. **Domain:** the free `vercel.app` address or your own domain. Set `NEXT_PUBLIC_SITE_URL` to match.

## Checklist for this afternoon

1. **Create an API key** in the Claude Console (console.anthropic.com): add a small prepaid balance, set a monthly spend limit, create the key and copy it once.
2. **Import the repo in Vercel:** Add New → Project → `CBcbbb/chongbo.DesignEngineer`. Keep the Next.js defaults.
3. **Set environment variables:** `ANTHROPIC_API_KEY` and `NEXT_PUBLIC_SITE_URL`. `ASK_RATE_LIMIT` and `ASK_DAILY_CAP` are optional.
4. **Deploy, then check:**
   - Ask "What matters most to us is accessibility". In DevTools → Network → `ask`, the response should say `"source": "model"`. If it says `fallback`, check the key and the Vercel function logs.
   - Ask something odd: you should still get a polite reply and three cards.
   - Open a case file and the about page.
   - Paste the URL into a chat to see the preview image.
5. **Test on your phone:** ask, tear off, open a tray ticket, try landscape, then turn on Reduce Motion and try again.
6. **Optional:** add Upstash Redis from the Vercel Marketplace and follow the README's rate-limiter steps.
7. **Afterwards:** add the three priority assets and commit; Vercel redeploys automatically.
