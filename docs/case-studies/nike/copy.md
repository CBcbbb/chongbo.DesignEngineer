# Nike Athletes Closet: copy, draft 4

Playbook §8 step 4. Every line traces to the Wix page or `notes.md`. The page shows the final result, written for the reader.

**Story.** The cover sets one idea in three verbs: stories people read, shop and return to. The page then follows those verbs as three parts, in the order a reader meets the feature. Each part opens with the problem it solves; the closing gives the outcome, the role and what I'd do now. Every card still stands alone when printed.

**What this shows (chips):** Brand storytelling · Craft and motion · Design systems

**Lens openers:** `web` → system · `ux` → tags · `engineer` → draw

---

## Cover

# Nike Athletes Closet

Influencer stories in Nike's app, designed to be read, shopped and returned to.

Athletes Closet is a members' feature in Nike's app in China. In each volume, a fashion influencer shares their style and recommends Nike products. From VOL.4, I designed the feature's creative system, every screen and its motion.

Role: UI Designer · Client: Nike · Platform: Nike App, China

---

## Part 01 · Read

### system · One creative system, a new palette every volume

I designed the feature's creative system: logo lock-up, type, colour, framing devices and motion. The framing device anchors each headline, and adds, removes or rearranges details to fit the content. Colour is picked up from each influencer's photos or products, so every volume has its own palette on the same layout.

*One framing device, five configurations.*

### posters · Every influencer gets a poster and the same photographic look

I designed a hero visual and poster card for each influencer, so readers know whose volume they're in. I retouched the key photos with tone correction, blemish removal and a flash-photography look, so every volume shares one visual tone.

*One poster system, a different influencer each volume.*
*Retouched for the flash look: original and final.*

### views · Several views of one outfit, swiped sideways

Where a story shows the same outfit from several angles, I set the images as horizontal pages instead of one long vertical scroll. It saves space, and the next view shows at the edge, so readers can see there's more.

*The next view at the edge is the cue to swipe.*

### components · The same components on every screen kept the build consistent

The earlier screens drifted in size, which made extra work for Nike's engineers. I audited every element, unified sizes, spacing and names, and rebuilt the screens in Figma with Auto Layout, documented for handover. It cut the back-and-forth between design and build.

*One set of sizes, spacing and names across the screens.*

---

## Part 02 · Shop

### tags · Tags on the photos lead from the outfit to the product

Readers engaged with the stories, but product click-through stayed low: nothing in the story pointed to what to buy. I put tappable product tags on the photos, so the outfit leads straight to the product.

*A tag on the photo names the shoe and links to it.*

### product-card · Larger product cards give each item weight in the story

The old product cards were small tiles. I enlarged the product image, so each item reads as part of the content.

*Drag to compare the product card before and after VOL.4.*

### ranking · The ranking leads on to similar outfits

The Star Ranking was a loose, inconsistent list. I rebuilt it as a leaderboard with a clear order, and added "See more" and "View similar outfits" after a like, so a ranking leads into more products.

*A loose list becomes a ranked board with a way onward.*

---

## Part 03 · Return

### draw · A like opens a shoebox

The stories were static, so readers had little reason to act. I tied the like to a prize draw: the button invites a like to win a gift, and a like opens a shoebox as a pair of trainers rises out. I designed and animated it.

*Play the draw that opens after a like.*

### star-voice · A voice preview builds interest in the next influencer

To hold attention between volumes, I designed Star Voice Q&A. The next influencer records a short voice teaser, readers submit questions and vote on others', and the top questions are answered in Nike's livestream. It shipped, and was recommended for wider use in other campaigns.

*Preview, ask, vote, answered live.*

---

## Closing

### outcome · One season became several

The feature shipped in Nike's app. The contract covered one season; after VOL.4, Nike commissioned the following seasons.

**Role.** UI design internship at an advertising agency. I designed the creative system, every screen from VOL.4 on, the motion and the influencer posters, and retouched the photos. Nike's marketing team set the brief; Nike's engineers built it.

### handoff · What I'd do now: build the motion myself

I specified the like in four states: an outline heart, a pill inviting a like to win a gift, a black heart with the count, and hearts floating out. Handed over in Figma, it was built as a plain red heart. I now build motion in code, so what ships matches the design.

*The specified states, beside the version that shipped.*

[Full recording ↗](https://www.youtube.com/shorts/4cFA1T_9m8w)
