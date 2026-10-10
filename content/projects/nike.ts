import type { Project } from "../schema";

export const nike: Project = {
  slug: "nike-athletes-closet",
  title: "Nike Athletes Closet",
  oneLiner: "A layout system that tied editorial stories to the products in them.",
  context: "Nike · member app feature, 2-month engagement",
  role: "Led the UI/UX redesign of the whole feature",
  status: "Shipped",
  stack: ["Figma", "Auto Layout", "Component library", "Motion"],
  links: [],
  tier: "main",
  tab: "stamp",
  cover: {
    kind: "image",
    asset: "nike/headline-frame.png",
    alt: "The adaptive headline frame wrapping titles of different lengths across several story screens.",
    need: "Your best image of the adaptive headline/text-framing system, ideally three or four screens side by side.",
    ratio: "16:10",
  },
  sections: [
    {
      id: "problem",
      kind: "problem",
      title: "Readers loved the stories but skipped the products",
      body: [
        "Athletes Closet is a members-only feature in the Nike app where fashion influencers share style inspiration and recommend products. It has to bridge branded storytelling, user engagement and e-commerce all at once.",
        "I led the UI/UX redesign of the entire feature, working on systematisation, interaction design, visual consistency and data-informed iteration. Two problems kept coming up: inconsistent components were slowing every release, and readers engaged with the stories but rarely tapped through to the products.",
      ],
      signals: ["conversion", "brand-storytelling"],
    },
    {
      id: "system",
      kind: "decision",
      title: "From one-off screens to a layout system",
      body: [
        "Early designs had no standardised components, so sizing drifted and developers spent time chasing inconsistencies. I audited every UI element and unified sizes, spacing and naming, then rebuilt all interfaces in Figma with Auto Layout and a reusable component system, with documentation for smoother handover.",
        "At the heart of it is a text-framing device used for headlines and chapter headers to anchor the key message. It is responsive to its own context: details are added, removed or rearranged depending on the content, so each season's stories could change without a redesign.",
      ],
      signals: ["reusable-components", "typography", "design-eng-gap", "design-systems"],
      media: {
        kind: "image",
        asset: "nike/graphic-system.png",
        alt: "The component set: logo lock-up, one-line header, key message, simplified text, imagery variants and poster card.",
        caption: "The layout and framing components: logo lock-up, header, key message, text-simplified, imagery and poster card.",
        need: "The component overview image from the old case study (layout/framing components).",
        ratio: "16:10",
      },
    },
    {
      id: "product-card",
      kind: "decision",
      title: "Making the product part of the story",
      body: [
        "Despite high engagement with the editorial content, product click-through stayed low because nothing connected the story to the merchandise. I redesigned the product card, enlarging the product visual to increase visibility and emphasise its role in the content flow, so items became more noticeable and click-worthy.",
        "The change gave the reader a clearer path from reading to shopping without interrupting the story.",
      ],
      signals: ["conversion", "brand-storytelling"],
      media: {
        kind: "image",
        asset: "nike/product-card.png",
        alt: "Before and after: the old small product card and the redesigned card with a larger product image.",
        caption: "Before, on the left — the small card. After, on the right — the product leading the story.",
        need: "The before/after product card comparison (two phone screens).",
        ratio: "16:10",
      },
    },
    {
      id: "delight",
      kind: "evidence",
      title: "Small moments of delight",
      body: [
        "The content relied on static text-and-image formats, so users behaved passively and had little reason to come back. I designed a surprise-style prize draw that opens after a like, using a gift-box visual to give the action an emotional payoff.",
        "Layered interactions like this lifted engagement across the board — from liking to question submission to livestream participation — completing a full engagement loop.",
      ],
      signals: ["motion-interaction", "brand-storytelling"],
    },
    {
      id: "star-voice",
      kind: "decision",
      title: "Star Voice Q&A",
      body: [
        "To hold attention between episodes and build anticipation for the next influencer, I designed a new feature: Star Voice Q&A. In each cycle the upcoming guest records a teaser voice message previewing the next topic, and users are invited to submit questions and upvote others'.",
        "The top-voted questions are answered live during Nike's livestream, forming a full loop of preview, participation and live response. The client recommended it for wider use in other campaigns.",
      ],
      signals: ["prototyping", "motion-interaction", "research", "brand-storytelling"],
      media: {
        kind: "image",
        asset: "nike/star-voice-qa.png",
        alt: "The Star Voice Q&A flow: a teaser voice message, question submission and upvoting, shown across screens.",
        need: "The Star Voice Q&A flow diagram from the old case study.",
        ratio: "16:10",
      },
    },
    {
      id: "retouching",
      kind: "evidence",
      title: "Retouching and mood",
      body: [
        "To unify the visual tone and bring out each influencer's personality, I retouched the key campaign images with tone correction, blemish removal and a flash-shooting vibe. The treatments aligned the visuals with Nike's values of authenticity, energy and youthfulness.",
      ],
      signals: ["brand-storytelling", "typography"],
      media: {
        kind: "image",
        asset: "nike/retouching.png",
        alt: "Two pairs of before/after portraits: the original and the retouched version with corrected tone and a flash-shooting look.",
        caption: "Original and retouched pairs: tone adjustment, blemish removal and a flash-shooting mood.",
        need: "The retouching before/after comparison images.",
        ratio: "16:10",
      },
    },
    {
      id: "outcome",
      kind: "outcome",
      title: "Shipped, and extended",
      body: [
        "The feature shipped in the Nike app. A standardised UI system improved delivery speed and developer satisfaction; interactive features such as likes and the prize draw lifted engagement; and Star Voice Q&A was recommended for wider use in other campaigns.",
        "The client reported higher-than-expected interaction and more interest in the products, and kept the UI collaboration going across two further quarters.",
      ],
      signals: ["end-to-end", "conversion", "design-systems"],
    },
  ],
  prompts: [
    "Show me some brand or marketing work.",
    "Have you shipped something consumer-facing?",
    "How do you use motion?",
  ],
};
