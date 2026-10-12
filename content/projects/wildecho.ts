import type { Project } from "../schema";

export const wildecho: Project = {
  slug: "wildecho",
  title: "WildEcho",
  oneLiner: "What if wildlife tourists listened instead of photographing?",
  context: "Royal College of Art × Stampede · 6-month team project",
  role: "Problem framing and research structure, in a team",
  stack: ["Figma", "Premiere Pro", "Canva", "Physical prototyping", "User testing"],
  links: [],
  tier: "earlier",
  tab: "ink",
  cover: {
    kind: "image",
    asset: "wildecho/cover.jpg",
    alt: "The WildEcho logo and wordmark over a Costa Rican beach, with illustrated tourists listening on islands of forest.",
    need: "The WildEcho key visual.",
    ratio: "16:10",
  },
  sections: [
    {
      id: "problem",
      kind: "problem",
      title: "The camera gets in the way",
      body: [
        "Wildlife photography pushes tourists closer to animals and often makes them remember less (Soares and Storm, “Forget in a Flash”, on the photo-taking-impairment effect). Guides already use sound to identify and explain species.",
      ],
      signals: ["research"],
    },
    {
      id: "prototype",
      kind: "decision",
      title: "Prototyping a new kind of attention",
      body: [
        "We prototyped listening tours with bone-conduction headphones, recording microphones and an app concept that turns a day's recordings into a personal sound journey.",
        "Over three rounds of testing, starting with four participants split into a photography group and a listening group, listeners felt more immersed and remembered more. Guides proved essential, so the next iteration built them in.",
      ],
      signals: ["prototyping", "research", "judgement"],
    },
    {
      id: "role",
      kind: "role",
      title: "My part",
      body: [
        "In a close-knit RCA team [team size], I framed the problem, organised the research into a clear line of thinking and connected it to the concept.",
      ],
      signals: ["research"],
    },
  ],
  prompts: ["How do you do user research?", "How do you test ideas early?"],
};
