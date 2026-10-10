# Nike Athletes Closet: copy, draft 5

Playbook §8 step 4. Every line traces to the Wix page or `notes.md`. The page shows the final result, written for the reader.

**Story.** The cover sets one idea in three verbs: stories people read, shop and return to. The page then follows those verbs as three parts, in the order a reader meets the feature. Each part opens with the problem it solves; the closing gives the outcome, the role and what I'd do now. Every card still stands alone when printed.

**Heading rhythm.** Plain statements carry most of the page; a few headings use livelier language where the idea earns it (views, shop the look, Star Voice, outcome). Never two hooks in a row.

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

### system · Redesigning the creative system first

Three volumes had shipped by the time I took over at VOL.4, so I began by redesigning the creative system: logo lock-up, type, colour, framing devices and motion. Every later volume is built from the same parts. The framing device adds, removes or rearranges details to fit each headline, and colour is picked up from each influencer's photos or products.

*One framing device, five configurations.*

### style · A unified visual style and tone

Each influencer gets a hero visual and a poster card in the same style, so readers know whose volume they're in. I retouched the key photos with tone correction, blemish removal and a flash-photography look, so every volume shares one tone.

*One poster system, a different influencer each volume.*
*Retouched for the flash look: original and final.*

### views · Several views of one outfit, swiped sideways

Where a story shows the same outfit from several angles, I set the images as horizontal pages instead of one long vertical scroll. It saves space, and the next view shows at the edge, so readers can see there's more.

*The next view at the edge is the cue to swipe.*

### components · Consistent components across every screen

The earlier screens drifted in size, which made extra work for Nike's engineers. I audited every element, unified sizes, spacing and names, and rebuilt the screens in Figma with Auto Layout, documented for handover. It cut the back-and-forth between design and build.

*One set of sizes, spacing and names across the screens.*

---

## Part 02 · Shop

### tags · Shop the look, straight from the photo

Readers engaged with the stories, but product click-through stayed low, because the stories didn't connect to the products. I added tappable product tags to the photos, so an outfit leads straight to what's in it.

*A tag on the photo names the shoe and links to it.*

### product-card · Larger product cards

The old product cards were small tiles. I enlarged the product image, so each item reads as part of the content.

*Drag to compare the product card before and after VOL.4.*

### ranking · A ranking that leads to similar outfits

The Star Ranking was a loose, inconsistent list. I rebuilt it as a leaderboard with a clear order, and added "See more" and "View similar outfits" after a like, so a ranking leads into more products.

*A loose list becomes a ranked board with a way onward.*

---

## Part 03 · Return

### draw · A reward for every like

The stories were static, so readers had little reason to act. I added a reward mechanism: a like enters a prize draw, which opens as a shoebox with a pair of trainers rising out. I designed and animated it.

*Play: a like enters the prize draw.*

### star-voice · Star Voice Q&A: ask now, answered live

I designed Star Voice Q&A to hold attention between volumes. The next influencer records a short voice teaser, readers submit questions and vote on others', and the top questions are answered in Nike's livestream. It shipped, and was recommended for wider use in other campaigns.

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
