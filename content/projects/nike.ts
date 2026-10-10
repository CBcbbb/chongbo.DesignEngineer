import type { Project } from "../schema";

export const nike: Project = {
  slug: "nike-athletes-closet",
  title: "Nike Athletes Closet",
  oneLiner: "A layout system that tied editorial stories to the products in them.",
  context: "Advertising agency, for Nike · internship",
  role: "Only UI designer on the agency team",
  status: "Shipped",
  stack: ["Figma", "Auto Layout", "Component library"],
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
        "Athletes Closet is a members' feature in the Nike app where athletes and stylists share looks and recommend products. Readers engaged with the stories, but few tapped through to the products [engagement and tap-through figures].",
        "Inconsistent components were also slowing every release.",
      ],
      signals: ["conversion", "brand-storytelling"],
    },
    {
      id: "system",
      kind: "decision",
      title: "From one-off screens to a layout system",
      body: [
        "I audited every element, unified sizes, spacing and naming, and rebuilt the feature as reusable components with documentation for developers.",
        "At its heart is a headline frame I designed to adapt to its content, so each season's stories could change without a redesign.",
      ],
      signals: ["reusable-components", "typography", "design-eng-gap", "design-systems"],
      media: {
        kind: "image",
        asset: "nike/components.png",
        alt: "The component set: logo lock-up, one-line header, key message, image-text combination and poster card.",
        need: "The component overview image from the old case study (layout/framing components).",
        ratio: "16:10",
      },
    },
    {
      id: "product-card",
      kind: "decision",
      title: "Making the product part of the story",
      body: [
        "I redesigned the product card so the item a story mentions is large, clear and obviously tappable. [Change in product taps after launch, if known]",
      ],
      signals: ["conversion", "brand-storytelling"],
      media: {
        kind: "image",
        asset: "nike/product-card.png",
        alt: "Before and after: the old small product card and the redesigned card with a larger product image.",
        need: "The before/after product card comparison (two phone screens).",
        ratio: "4:3",
      },
    },
    {
      id: "delight",
      kind: "evidence",
      title: "Small moments of delight",
      body: [
        "Static stories gave readers little reason to return, so I added interactions with a pay-off, such as a gift-box prize draw that opens after a like.",
      ],
      signals: ["motion-interaction", "brand-storytelling"],
      media: {
        kind: "video",
        asset: "nike/app-recording.mp4",
        poster: "nike/app-recording-poster.jpg",
        alt: "Screen recording of the feature in the Nike app: scrolling a story, liking it and opening the prize draw.",
        need: "Your full screen recording of the live app (MP4, portrait). A 20–40 second cut is ideal; keep the full one too.",
        ratio: "9:16",
      },
    },
    {
      id: "outcome",
      kind: "outcome",
      title: "Shipped, and extended",
      body: [
        "The feature shipped in the Nike app in [month and year]. Developers spent less time going back and forth, the client reported more interest in the products, and the agency kept the UI work for two more quarters.",
      ],
      signals: ["end-to-end", "conversion"],
    },
  ],
  prompts: [
    "Show me some brand or marketing work.",
    "Have you shipped something consumer-facing?",
    "How do you use motion?",
  ],
};
