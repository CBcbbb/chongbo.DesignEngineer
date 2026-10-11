import type { Project } from "../schema";

/**
 * Nike Athletes Closet. Copy approved in docs/case-studies/nike/copy.md; every claim traces to the original
 * Wix case study or docs/case-studies/nike/notes.md. The case file layout lives in src/components/case/nike.
 * Section ids are the card ids the printer deep-links to; `graphic-system` is referenced by src/lib/ask.
 */
export const nike: Project = {
  slug: "nike-athletes-closet",
  title: "Nike Athletes Closet",
  oneLiner: "Influencer stories in Nike's app, designed to be read, shopped and returned to.",
  context: "Nike App, China · UI design internship at an advertising agency",
  role: "UI Designer",
  status: "Shipped",
  stack: ["Figma", "Lottie"],
  links: [{ label: "Screen recording of the feature", href: "https://www.youtube.com/shorts/4cFA1T_9m8w" }],
  tier: "main",
  tab: "stamp",
  cover: {
    kind: "image",
    asset: "nike/print/cover.jpg",
    alt: "The Athletes Closet prize draw: a Nike shoebox opens and a pair of trainers rises out of it.",
    need: "The strongest single image of the Athletes Closet feature.",
    ratio: "16:10",
  },
  sections: [
    {
      id: "graphic-system",
      kind: "decision",
      title: "Redesigning the creative system first",
      body: [
        "Three volumes had shipped by the time I took over at VOL.4, so I began by redesigning the creative system, from the logo lock-up and typography to colour, framing devices and motion. I set the layouts up as reusable page templates, so every later volume is built from the same parts.",
        "The framing device balances consistency with flexibility: it adds, removes or rearranges details to fit each headline, and colour is picked up from each influencer's photos or products.",
      ],
      signals: ["brand-storytelling", "design-systems", "reusable-components", "typography"],
      media: {
        kind: "image",
        asset: "nike/print/graphic-system.jpg",
        alt: "Five configurations of the text framing device, from the logo lock-up to image and text.",
        need: "The framing device configurations.",
        ratio: "16:10",
      },
    },
    {
      id: "style",
      kind: "evidence",
      title: "A unified visual style",
      body: [
        "Each influencer gets a hero visual and a poster card in the same style, so readers know whose volume they're in.",
      ],
      signals: ["brand-storytelling", "typography"],
      media: {
        kind: "image",
        asset: "nike/print/style.jpg",
        alt: "Six poster cards, one per influencer, in the same layout.",
        need: "The influencer poster cards.",
        ratio: "4:3",
      },
    },
    {
      id: "retouching",
      kind: "evidence",
      title: "Retouched to one tone",
      body: [
        "I retouched the key photos with tone correction, blemish removal and a flash-photography look, so every volume shares one tone.",
      ],
      signals: ["brand-storytelling"],
      media: {
        kind: "image",
        asset: "nike/print/retouching.jpg",
        alt: "Two photos, each shown as the original and retouched with a flash-photography look.",
        need: "The retouching pairs.",
        ratio: "16:10",
      },
    },
    {
      id: "views",
      kind: "decision",
      title: "Several views of one outfit, swiped sideways",
      body: [
        "Where a story shows the same outfit from several angles, I set the images as horizontal pages instead of one long vertical scroll. It saves space, and the next view shows at the edge, so readers can see there's more.",
      ],
      signals: ["motion-interaction", "brand-storytelling"],
      media: {
        kind: "image",
        asset: "nike/print/views.jpg",
        alt: "Before: one long vertical scroll. After: an outfit's views set as horizontal pages, with the next view at the edge.",
        need: "The storytelling feed before and after.",
        ratio: "16:10",
      },
    },
    {
      id: "components",
      kind: "decision",
      title: "Reusable components, built for handover",
      body: [
        "The earlier screens drifted in size, which made extra work for Nike's engineers. I audited every element, unified sizes, spacing and names, and rebuilt the screens in Figma as reusable components with Auto Layout, documented for handover. It cut the back-and-forth between design and engineering.",
      ],
      signals: ["reusable-components", "design-systems", "design-eng-gap"],
      media: {
        kind: "image",
        asset: "nike/print/components.jpg",
        alt: "Imagery layouts and the poster card, built from one set of sizes, spacing and names.",
        need: "The layout components.",
        ratio: "16:10",
      },
    },
    {
      id: "tags",
      kind: "decision",
      title: "Shop the look, straight from the photo",
      body: [
        "Readers engaged with the stories, but product click-through stayed low, because the stories didn't connect to the products. I added tappable product tags to the photos, so an outfit leads straight to what's in it.",
      ],
      signals: ["conversion", "brand-storytelling"],
      media: {
        kind: "image",
        asset: "nike/print/tags.jpg",
        alt: "Three story pages with product tags on the photos naming a T-shirt and a pair of trainers.",
        need: "Product tags on the story photos.",
        ratio: "16:10",
      },
    },
    {
      id: "product-card",
      kind: "decision",
      title: "Larger product cards",
      body: ["The old product cards were small tiles. I enlarged the product image, so each item reads as part of the content."],
      signals: ["conversion", "brand-storytelling"],
      media: {
        kind: "image",
        asset: "nike/print/product-card.jpg",
        alt: "The product card before VOL.4, with small tiles, beside the version with larger product images.",
        need: "The product card before and after.",
        ratio: "4:3",
      },
    },
    {
      id: "ranking",
      kind: "decision",
      title: "A ranking that leads to similar outfits",
      body: [
        "The Star Ranking was a loose, inconsistent list. I rebuilt it as a leaderboard with a clear hierarchy, and added two calls to action after a like, \"See more\" and \"View similar outfits\", so a ranking leads into more products.",
      ],
      signals: ["conversion", "brand-storytelling"],
      media: {
        kind: "image",
        asset: "nike/print/ranking.jpg",
        alt: "The Star Ranking before, as three loose tiles, and after, as a ranked top three.",
        need: "The Star Ranking before and after.",
        ratio: "16:10",
      },
    },
    {
      id: "draw",
      kind: "decision",
      title: "A reward for every like",
      body: [
        "The stories were static, so readers had little reason to act. I added a reward mechanism: a like enters a prize draw, which opens as a shoebox with a pair of trainers rising out. I designed the microinteraction and animated it.",
      ],
      signals: ["motion-interaction", "brand-storytelling", "prototyping"],
      media: {
        kind: "image",
        asset: "nike/print/draw.jpg",
        alt: "The last frame of the prize-draw animation: a Nike shoebox open, with a pair of trainers above it.",
        need: "The prize-draw animation.",
        ratio: "16:10",
      },
    },
    {
      id: "star-voice",
      kind: "decision",
      title: "Star Voice Q&A: ask now, answered live",
      body: [
        "I designed Star Voice Q&A to hold attention between volumes. The next influencer records a short voice teaser, readers submit questions and vote on others', and the top questions are answered in Nike's livestream. It shipped, and was recommended for wider use in other campaigns.",
      ],
      signals: ["brand-storytelling", "motion-interaction", "prototyping"],
      media: {
        kind: "image",
        asset: "nike/print/star-voice.jpg",
        alt: "Star Voice Q&A: a voice teaser from the next influencer, voted questions and a field to ask one.",
        need: "The Star Voice Q&A screen.",
        ratio: "1:1",
      },
    },
    {
      id: "outcome",
      kind: "outcome",
      title: "One season became several",
      body: [
        "The feature shipped in Nike's app. The contract covered one season; after VOL.4, Nike commissioned the following seasons.",
        "UI design internship at an advertising agency. I designed the creative system, every screen from VOL.4 on, the motion and the influencer posters, and retouched the photos. Nike's marketing team set the brief; Nike's engineers built it.",
      ],
      signals: ["end-to-end", "brand-storytelling"],
    },
    {
      id: "handoff",
      kind: "retrospective",
      title: "What I'd do now: take motion from idea to production myself",
      body: [
        "I specified the like in four states: an outline heart, a pill inviting a like to win a gift, a black heart with the count, and hearts floating out. Handed over in Figma, it was built as a plain red heart. I now build motion in code myself and take responsibility for the quality of what ships.",
      ],
      signals: ["design-eng-gap", "motion-interaction", "judgement"],
      media: {
        kind: "image",
        asset: "nike/print/handoff.jpg",
        alt: "The like as specified in four states, beside the plain red heart that shipped.",
        need: "The like as specified and as shipped.",
        ratio: "16:10",
      },
    },
  ],
  prompts: ["Show me some brand or marketing work.", "Have you shipped something consumer-facing?", "How do you use motion?"],
};
