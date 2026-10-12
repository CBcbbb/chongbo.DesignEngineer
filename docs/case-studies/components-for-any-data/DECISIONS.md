# Components for Any Data: decisions for Chongbo

Things built on a best guess, or still open. Each says what was done and what to decide.

1. **Status shown on the home tray and the share image: "In use".** The schema's options are Live / In use / Shipped / Concept. The store and its components are in the product; the data connection isn't launched yet. "In use" is the closest true value. Decide: keep, or add a status such as "In development" (would state progress, which the copy avoids).
2. **"74" streams (03.1).** Kept, as you asked. It's the dev organisation's count from the backend proposal.
3. **"Front end and server" (cover role line).** If the server side isn't finished when someone asks, say so in an interview.
4. **Old address.** `/work/component-store` now returns 404. Any link already sent out (CV, applications) breaks. A redirect would keep the product's name in a URL that resolves. Decide: add a redirect in `next.config.ts` (shared file), or leave it.
5. **ECharts named (02.1, and in the project's stack).** You approved naming it. The stack also lists React, TypeScript and Tailwind; it's only shown by the AI catalogue, not on the page.
6. **Design system:** no longer mentioned on this page (the closing role card became a Takeaway). It gets its own project (`PROMPT-design-system.md`).
7. **Printer routing.** "Have you built a design system?" now prints another project first; the test checks only that the sheet shows design systems. A question about back-end work is still reported as missing by the fallback (`src/lib/ask/fallback.ts`), though this project now shows front end to server: see SHARED-CHANGES.
8. **Hover-only values.** Exact chart values show on hover and in a table for screen readers; a sighted keyboard user sees the axis, the largest value and (donut, treemap) the labels. A "Show as table" switch would close that gap.
9. **Not tested here:** VoiceOver with Safari (playbook §8 step 7). The automated checks (axe, every text contrast pair, keyboard walk of the demo) pass.
10. **Site-wide, not this project:** there is no favicon (`/favicon.ico` returns 404 on every page).

## 12 October 2026

- **AI tools (01.3).** Chongbo: "I used Claude Code and Cursor to write the front end and the server." One sentence on the pipeline card, which covers both, and the `ai-tools` signal. The home page's "AI tools" card is offered again.
