import type { Project } from "../schema";

/**
 * Nike Athletes Closet. Copy approved in docs/case-studies/nike/copy.md; every claim traces to the original
 * Wix case study or docs/case-studies/nike/notes.md. The case file layout lives in src/components/case/nike.
 * Section ids are the card ids the printer deep-links to; `graphic-system` is referenced by src/lib/ask.
 */
export const nike: Project = {
  slug: "nike-athletes-closet",
  title: "Nike Athletes Closet",
  oneLiner: "Style stories from fashion influencers, designed to be read, shopped and returned to.",
  context: "Nike App, China · UI design internship at an advertising agency",
  role: "UI Designer",
  outcome: "Launched across China as a section of the Nike App's home screen. On the strength of the first season, Nike renewed the agency's contract for the seasons that followed.",
  client: "Nike China",
  stack: ["Figma", "Photoshop", "Lottie"],
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
        "Three volumes had shipped when I took over at VOL.4. The redesign covered the logo lock-up, typography, colour, framing devices and motion.",
        "The framing device balances consistency with flexibility: it adds, removes or rearranges details to fit each headline.",
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
        "Each influencer gets a hero visual and a poster card in one shared style, which still highlights their own character.",
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
        "To unify the visual tone and highlight the character of each featured influencer, I retouched key campaign images with tone correction, blemish removal, and flash-shooting vibe enhancement. These treatments aligned the visuals with Nike's core brand values of authenticity, energy, and youthfulness.",
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
        "Before, every angle stacked into one long scroll. As pages, the views take less space, and the next one showing at the edge tells readers there's more.",
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
        "The earlier designs had no standardised component system, so sizes were inconsistent and Nike's engineers had extra work. I audited every UI element, unified sizes, spacing and naming, then rebuilt the interfaces in Figma with Auto Layout and reusable components. It reduced the back-and-forth between design and development.",
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
        "Readers engaged with the stories, but product click-through stayed low, because the stories didn't connect to the products. I added tappable product tags to the photos, so readers go from an outfit to its products in one tap.",
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
      title: "Products as part of the story",
      body: [
        "I redesigned the product card layout by enlarging product visuals to increase visibility and emphasise their role in the content flow, making items more noticeable and click-worthy.",
      ],
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
        "The Star Ranking was a loose, inconsistent list. I rebuilt it as a leaderboard with a clear hierarchy, and added two calls to action after a like: \"See more\" and \"View similar outfits\".",
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
        "The stories relied on static text and images, so readers stayed passive and nothing drew them back to the section. I designed a surprise prize draw triggered by a like, with a gift-box animation to reward the action.",
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
      title: "Star Voice Q&A",
      body: [
        "To maintain interest between volumes and build anticipation for the next influencer, I designed Star Voice Q&A: a loop of preview, participation and live response. It shipped, and was recommended for wider use in other campaigns.",
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
      title: "Design that helped win Nike's next seasons",
      body: [
        "As the agency's sole UI designer, I designed the creative system, every screen from VOL.4 on, the motion and the influencer posters, and retouched the photos. Nike's marketing team set the brief; Nike's engineers built it.",
      ],
      // The results of the three parts, in the business's terms (from the original case study).
      steps: [
        {
          title: "Delivery",
          text: "One component system made each volume faster to deliver, and Nike's engineers were more satisfied with the handover.",
        },
        {
          title: "Conversion",
          text: "Product visibility significantly improved, with a clearer click-through path and positive feedback from the client on increased user interest and conversions.",
        },
        {
          title: "Engagement",
          text: "The layered interaction mechanisms significantly boosted user engagement across the board – from liking to question submission to livestream participation, completing a full engagement loop. The client reported higher-than-expected interaction performance.",
        },
      ],
      signals: ["end-to-end", "conversion", "brand-storytelling"],
    },
  ],
  prompts: ["Show me some brand or marketing work.", "Have you shipped something consumer-facing?", "How do you use motion?"],
};
