# Prompt: VoiceOver test of the Helen Hamlyn Centre Data Platform

Paste everything below the line into a new conversation that is linked to my Mac.

---

I'm Chongbo Ning, a Design Engineer in London. I'd like you to run a real screen-reader test of a platform I designed and built: VoiceOver with Safari, on my Mac, using computer use.

- **Live site:** https://helen-hamlyn-centre-for-design-data.vercel.app/
- **Code (read-only):** `CBcbbb/Helen-Hamlyn-Centre-for-Design-Data-Platform`. Don't change it, and don't open pull requests. Another conversation owns it.
- **Why:** my portfolio says "screen-reader testing is next". I want to replace that with what VoiceOver actually does, good or bad.
- **Language:** British English. If I write in Chinese, first give me the natural British English version of what I said, then answer.

## How to work

1. Read the `computer-use` skill first. Ask for access to Safari and VoiceOver Utility / System Settings only.
2. Turn on VoiceOver (Cmd+F5) and the **caption panel**, so you can read what it says from the screen. Use Safari only. Don't change any other system setting, and turn VoiceOver off when you finish.
3. Do every step below with the keyboard only. Record VoiceOver's exact words, as shown in the caption panel.
4. Don't fix anything. Only observe and report.

## What to test

| # | Page | Action | What should happen |
|---|---|---|---|
| 1 | `/` (first visit) | Load the page, read from the top (VO+A) | Skip link, header, navigation, an `h1`, search, filters, the map region are all announced with names |
| 2 | `/` | The first-visit guide | Each card is reachable and readable. It never steals focus. "Skip the guide" works |
| 3 | `/` | Tab into the map, then arrow keys | One tab stop. Each entry reads as "name, type, n connections" |
| 4 | `/` | Enter on an entry, then Escape | Focus goes to the details heading, then back to the entry |
| 5 | `/` | Follow a connection in the details, then go back along the path | The path reads as navigation, with the current step announced |
| 6 | `/` | Switch "Constellation" / "By type" | Two radio buttons. The change is announced |
| 7 | `/` | Cmd+K, type "design" | The result count is announced, once typing stops |
| 8 | `/` | Toggle a type filter | The change is announced |
| 9 | `/table` | Table navigation (VO+arrows, VO+Shift+Cmd+T for headers) | Caption, column headers and row headers are read. Sorting is announced |
| 10 | `/projects/design-bugs-out` | Headings rotor (VO+U) | Headings are in order. Connections are ordinary links |
| 11 | `/` | Keyboard shortcuts dialog (`?`) | Focus moves into the dialog. Escape closes it and returns focus |

## What to give me

A short report, `voiceover-report.md`, sent to me as a file:

- **Setup:** macOS, Safari and VoiceOver versions, and the date.
- **Results:** one row per step, with pass / issue / fail, VoiceOver's exact words, and the problem if there is one.
- **The issues worth fixing,** most serious first, each with a one-line suggested fix. Don't implement anything.
- **One sentence for my portfolio** that says honestly what was tested and what was found. For example: "Tested with VoiceOver in Safari: map entries, the guide, the table and the details panel all read correctly." Only write it if it's true.
