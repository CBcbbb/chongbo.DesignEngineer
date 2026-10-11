# Components for Any Data: decisions for Chongbo

Things built on a best guess, or still open. Each says what was done and what to decide.

1. **Status shown on the home tray and the share image: "In use".** The schema's options are Live / In use / Shipped / Concept. The store and its components are in the product; the data connection isn't launched yet. "In use" is the closest true value. Decide: keep, or add a status such as "In development" (would state progress, which the copy avoids).
2. **"74" streams (03.1).** Kept, as you asked. It's the dev organisation's count from the backend proposal.
3. **"built them, front end and server" (04.1).** Past tense. If the server side isn't finished when someone reads it, say so in an interview, or change the line to present tense.
4. **Old address.** `/work/component-store` now returns 404. Any link already sent out (CV, applications) breaks. A redirect would keep the product's name in a URL that resolves. Decide: add a redirect in `next.config.ts` (shared file), or leave it.
5. **ECharts named (02.1, and in the project's stack).** You approved naming it. The stack also lists React, TypeScript and Tailwind; it's only shown by the AI catalogue, not on the page.
6. **The design-system line (04.1)** says "the design system I built". Its own project doesn't exist yet (`PROMPT-design-system.md`). Once it does, the line can link to it.
7. **Printer routing.** "Have you built a design system?" still prints this project first (`one-per-dataset` leads with the design-systems signal, the role card mentions it). Move that signal to the design-system project when it exists.
8. **Hover-only values.** Exact chart values show on hover and in a table for screen readers; a sighted keyboard user sees the axis, the largest value and (donut, treemap) the labels. A "Show as table" switch would close that gap.
9. **Not tested here:** VoiceOver with Safari (playbook §8 step 7). The automated checks (axe, every text contrast pair, keyboard walk of the demo) pass.
10. **Site-wide, not this project:** there is no favicon (`/favicon.ico` returns 404 on every page).
