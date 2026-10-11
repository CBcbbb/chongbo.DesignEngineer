# This site (the shell): decisions for Chongbo

Open points from the shell work of 11 October 2026 (`shell/micro-interactions`). Each is live as described; say the word and it changes.

1. **The PRINT label on phones.** At 390px the engraved word is about 6px tall: present, not readable. The button is large and the lamp turns green, so I left it. Alternative: hide the label under 700px, or show a one-line hint under the printer on phones.
2. **The paper's hint once a card is picked**: "Add a line about the role, or press the red button." It is instructional text, which the copy rules prefer to avoid, but it replaces a cycling example that looked like it would be sent. Alternative wording: "Anything to add?" (shorter, but doesn't point at the button).
3. **Provenance line wording.** Model: "Chosen by Claude from my case files, one section per project. The words are mine." Fallback: "Matched by keyword from my case files, one section per project." It exposes which path answered, in plain words, without naming internals. If you'd rather keep that private, drop the first clause of each.
4. **Footer**: "Claude chooses which sections of my case files to print. It never writes them." Replaces the "keyword matching as a fallback" line. Confirm you want the fallback unmentioned in the footer (it is still stated on a result).
5. **Kraft as the shell's colour** (`--kraft` #d9c59e, same in both themes). Used only for the capsule links. If you'd prefer the pills to follow the theme in dark mode, the token needs a dark value and two more contrast pairs.
6. **Hammer strength.** Letters move ±1.4px and ±6° per strike, ×2.2 on every fifth strike, up to six strikes per hover. Lighter than the reference and than the Nike version you found too much. Tell me if it should be lighter still, or if the fifth-strike "hard" knock should go.
7. **Eyes follow the pointer within 220px of the About pill**, not only when hovered, so they come alive as the pointer approaches. Could be hover-only.
8. **On a case file the Work pill becomes "All work" with the drawn line.** It is the shell's only back link. The HHCD and Nike templates have no back link of their own; if they add one, it should use `<Pill kind="back">` so the behaviour matches (noted in `SHARED-CHANGES.md`).
9. **The "Or browse all work" pill** keeps the "Or": it answers the printer, not the nav. Could be "Browse all work".
10. **Profile summary** (`content/index.ts`): "brand work that has to earn a tap" is the one phrase in the shell that is more clever than clear. Suggested: "and brand work measured by what people tap". Not changed, as content files are yours.
11. **Not done, worth a prototype:** sheets feeding out of the tray before the deck fans; a "Printed for: …" chip row above long decks; a `missing` line that offers the nearest work.
12. **Local builds in this sandbox** stub `src/components/case/fonts.ts` because Google Fonts is unreachable; the stub was never committed. WildEcho still loads Open Sans and Nunito Sans from Google at build time, so any offline build fails there until WildEcho moves to Geist (playbook §7 retires the Wix fonts once a project is rebuilt).
