# Shared changes

Proposed changes to shared files (playbook §9), written by the project conversations that don't own them. Chongbo carries them across.

| Date | From | File | Change | Why | Status |
|---|---|---|---|---|---|
| 2026-10-10 | Nike | `docs/case-studies/PLAYBOOK.md` §5 | Add: "Write the final result for the reader. Nothing from our working discussions (what I nearly dropped, what I'd have liked), no emotional or defensive wording (\"only\", \"just\", \"looks awful\"). Honest limits are stated as facts." | Chongbo's review of Nike draft 1: the cover read like interview notes, not a portfolio. | Proposed |
| 2026-10-10 | Nike | `src/app/tokens.css` | Add reading-surface tokens for dark mode (case files follow the theme; `--paper` stays for photographed objects). Values used in `docs/design/case-nike.html`: page `#161513`, ink `#ecebe7`, body `#c9c6bf`, dim `#9b978f`, rule `#2e2c29`, studio `#0f0e0d`. | Playbook §7 makes dark first-class for case files; the shared tokens only define dark for the studio, not the paper surface. | Proposed |
| 2026-10-10 | Nike | block library | New block **chaptered video**: a phone-framed recording with chapter buttons grouped by part, a progress line, and a `seek` link any card can carry ("See it at 0:25") that scrolls to the player and jumps to that moment. Muted, no autoplay, poster at rest. | Nike's signature module; any project with a shipped-product recording can use it. | Proposed |
| 2026-10-10 | Nike | block library | New block **swap**: one image with a two-state toggle (e.g. Wireframe / Final), cross-fading in place. | Shows a decision's before and after where a slider doesn't fit (different layouts). | Proposed |
| 2026-10-10 | Nike | block library | **media** block: support Lottie with a Play button and a reduced-motion end frame (lottie-web from cdnjs). | Nike's shoebox animation; playbook §6 asks for Lottie, not GIF. | Proposed |
