import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Project, Section } from "@content";
import { Compare, Contents, GiftBox, Pip, RecordingPlayer, RecordingProvider, SeekButton, Switcher, VoiceTeaser, type ContentsPart } from "./NikeClient";
import "./nike.css";

/** Asset path. Every image is served at quality 90 (`Q`), so text in screenshots stays sharp. */
const A = (file: string) => `/assets/nike/${file}`;
const Q = 90;
const RECORDING_URL = "https://www.youtube.com/shorts/4cFA1T_9m8w";

/** Part openers and the cards under each, in reading order. Card ids are the section ids in content/projects/nike.ts. */
const PARTS: ContentsPart[] = [
  {
    id: "part-read",
    n: "01",
    label: "Read",
    cards: [
      { id: "graphic-system", label: "Creative system" },
      { id: "style", label: "Visual style" },
      { id: "retouching", label: "Retouching" },
      { id: "views", label: "Several views of one outfit" },
      { id: "components", label: "Reusable components" },
    ],
  },
  {
    id: "part-shop",
    n: "02",
    label: "Shop",
    cards: [
      { id: "tags", label: "Product tags" },
      { id: "product-card", label: "Product cards" },
      { id: "ranking", label: "Star Ranking" },
    ],
  },
  {
    id: "part-return",
    n: "03",
    label: "Return",
    cards: [
      { id: "draw", label: "Reward for a like" },
      { id: "star-voice", label: "Star Voice Q&A" },
    ],
  },
  {
    id: "part-outcome",
    n: "04",
    label: "Outcome",
    cards: [
      { id: "outcome", label: "One season became several" },
      { id: "handoff", label: "What I'd do now" },
    ],
  },
];

const CHAPTERS = [
  {
    part: "Read",
    items: [
      { t: 13, label: "Logo lock-up" },
      { t: 19, label: "Headline framing device" },
      { t: 22, label: "Several views, swiped" },
    ],
  },
  {
    part: "Shop",
    items: [
      { t: 25, label: "Product tag" },
      { t: 26, label: "Product cards" },
      { t: 48, label: "Star Ranking" },
    ],
  },
  {
    part: "Return",
    items: [
      { t: 28.4, label: "Like" },
      { t: 42, label: "Star Voice Q&A" },
    ],
  },
];

/**
 * Star Voice Q&A: the notes from the original presentation, each pinned to the part of the screen it
 * describes (`y`: its height on the screen, from 0 at the top to 1 at the bottom).
 */
const SV_NOTES = [
  {
    y: 0.22,
    side: "r",
    title: "Voice teaser",
    text: "Each influencer introduces the next volume through a short voice clip, with an animated waveform to catch attention and add realism.",
  },
  { y: 0.395, side: "l", title: "Livestream reveal", text: "Selected top questions are answered live during Nike's 618 livestream." },
  { y: 0.72, side: "r", title: "Vote with likes", text: "Questions can be upvoted by others; the most liked are prioritised for an answer." },
  { y: 0.895, side: "l", title: "Ask a question", text: "Readers submit questions in real time, shown in an interactive feed." },
] as const;

/** A card's head: index and claim on the left, the reasoning on the right. */
function Head({ s, idx, seek }: { s: Section; idx: string; seek?: number }) {
  return (
    <div className="nk-head">
      <div>
        <p className="nk-meta">
          <span className="nk-idx">{idx}</span>
        </p>
        <h3 id={`${s.id}-h`}>{s.title}</h3>
      </div>
      <div className="nk-body">
        {s.body.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
        {seek !== undefined && <SeekButton t={seek} />}
      </div>
    </div>
  );
}

/** `side` puts the text beside the evidence on wide screens: for long copy or tall evidence. */
function Card({ s, tone, layout, children }: { s: Section; tone?: "black"; layout?: "side"; children: ReactNode }) {
  return (
    <article
      id={s.id}
      className={`nk-sheet is-card${tone === "black" ? " is-black" : ""}${layout === "side" ? " is-side" : ""}`}
      aria-labelledby={`${s.id}-h`}
    >
      {children}
    </article>
  );
}

function Opener({ part }: { part: ContentsPart }) {
  return (
    <section id={part.id} className="nk-sheet is-orange nk-opener" aria-labelledby={`${part.id}-h`}>
      <span className="nk-num" aria-hidden="true">
        {part.n}
      </span>
      <div>
        <h2 id={`${part.id}-h`}>{part.label}</h2>
        <p className="nk-cards">{part.cards.map((c) => c.label).join(" · ")}</p>
      </div>
    </section>
  );
}

/**
 * The Nike case file. Copy comes from content/projects/nike.ts so printed sheets and the page say the same
 * words; this file decides how each card shows its evidence.
 */
export function NikeCase({ project, next }: { project: Project; next: Project }) {
  const s = Object.fromEntries(project.sections.map((x) => [x.id, x])) as Record<string, Section>;
  const sec = (id: string) => {
    const found = s[id];
    if (!found) throw new Error(`Nike case file: missing section "${id}"`);
    return found;
  };
  const outcome = sec("outcome");

  return (
    <div className="nk" id="top">
      <RecordingProvider>
        <div className="nk-frame">
          <Contents title={project.title} parts={PARTS} />

          <div className="nk-sheets">
            {/* cover */}
            <header className="nk-sheet is-orange nk-cover">
              <p className="nk-client">
                <i aria-hidden="true" />
                {project.client}
              </p>
              <h1 id="case-title">{project.title}</h1>
              <p className="nk-lede">{project.oneLiner}</p>
              <dl className="nk-facts">
                <div>
                  <dt>Role</dt>
                  <dd>{project.role}</dd>
                </div>
                <div>
                  <dt>Outcome</dt>
                  <dd>{project.outcome}</dd>
                </div>
              </dl>
              <p className="nk-chips">
                <span>What this shows</span>
                <a className="nk-chip" href="#graphic-system">
                  Brand storytelling
                </a>
                <a className="nk-chip" href="#draw">
                  Motion and microinteractions
                </a>
                <a className="nk-chip" href="#components">
                  Design systems
                </a>
              </p>
            </header>

            {/* the recording */}
            <section id="recording" className="nk-sheet is-black nk-rec-glow" aria-labelledby="rec-h">
              <RecordingPlayer chapters={CHAPTERS} full={RECORDING_URL} />
            </section>

            {/* 01 Read */}
            <Opener part={PARTS[0]!} />

            <Card s={sec("graphic-system")}>
              <Head s={sec("graphic-system")} idx="01.1" seek={19} />
              <figure className="nk-ev">
                <Switcher
                  options={[
                    {
                      label: "Logo lock-up",
                      layer: "Layout/Framing/Logo-Lockup",
                      image: <Image quality={Q} src={A("gs-logo-lockup.png")} alt="Logo lock-up: the 星推官 Athletes Closet lock-up, VOL number and headline." width={2024} height={436} sizes="(min-width: 761px) 640px, 90vw" />,
                    },
                    {
                      label: "One-line header",
                      layer: "Layout/Header/One-Line",
                      image: <Image quality={Q} src={A("gs-header-one-line.png")} alt="One-line header: subtitle, chapter number and headline." width={1506} height={465} sizes="(min-width: 761px) 640px, 90vw" />,
                    },
                    {
                      label: "Key message",
                      layer: "Layout/Message/Key-Message",
                      image: <Image quality={Q} src={A("gs-key-message.png")} alt="Key message: subtitle above a centred headline." width={1506} height={462} sizes="(min-width: 761px) 640px, 90vw" />,
                    },
                    {
                      label: "Simplified text",
                      layer: "Layout/Message/Text-Simplified",
                      image: <Image quality={Q} src={A("gs-text-simplified.png")} alt="Simplified text: one line of text in a frame." width={1506} height={210} sizes="(min-width: 761px) 640px, 90vw" />,
                    },
                    {
                      label: "Image and text",
                      layer: "Layout/Content/ImageText-Combo",
                      tall: true,
                      image: <Image quality={Q} src={A("gs-image-text-combo.png")} alt="Image and text: a full-height image with the lock-up and body text below." width={1197} height={2358} sizes="(min-width: 761px) 300px, 60vw" />,
                    },
                  ]}
                />
              </figure>
            </Card>

            <Card s={sec("style")}>
              <Head s={sec("style")} idx="01.2" />
              <figure className="nk-ev nk-ev-one">
                <div className="nk-box nk-grain nk-posters">
                  <Image quality={Q}
                    src={A("guest-posters.png")}
                    alt="Six poster cards, one per influencer, in the same layout: photo, name line, headline and QR code."
                    width={1181}
                    height={939}
                    sizes="(min-width: 1180px) 840px, 100vw"
                  />
                </div>
              </figure>
            </Card>

            <Card s={sec("retouching")}>
              <Head s={sec("retouching")} idx="01.3" />
              <figure className="nk-ev nk-ev-one">
                <div className="nk-box nk-field nk-retouch">
                  <div className="nk-cq" style={{ ["--ar" as string]: "0.666" }}>
                    <Compare
                      label="Compare photo 1, original and retouched"
                      labels={["Original", "Retouched"]}
                      ratio="1332 / 2000"
                      under={<Image quality={Q} src={A("retouch-1-after.jpg")} alt="Photo 1, retouched with a flash-photography look." width={1332} height={2000} sizes="(min-width: 761px) 420px, 90vw" />}
                      over={<Image quality={Q} src={A("retouch-1-original.jpg")} alt="Photo 1, the original before retouching." width={1332} height={2000} sizes="(min-width: 761px) 420px, 90vw" />}
                    />
                  </div>
                  <div className="nk-cq" style={{ ["--ar" as string]: "0.666" }}>
                    <Compare
                      label="Compare photo 2, original and retouched"
                      labels={["Original", "Retouched"]}
                      ratio="1332 / 2000"
                      under={<Image quality={Q} src={A("retouch-2-after.jpg")} alt="Photo 2, retouched with a flash-photography look." width={1332} height={2000} sizes="(min-width: 761px) 420px, 90vw" />}
                      over={<Image quality={Q} src={A("retouch-2-original.jpg")} alt="Photo 2, the original before retouching." width={1332} height={2000} sizes="(min-width: 761px) 420px, 90vw" />}
                    />
                  </div>
                </div>
              </figure>
            </Card>

            <Card s={sec("views")} tone="black">
              <Head s={sec("views")} idx="01.4" seek={22} />
              <figure className="nk-ev nk-bleed nk-bleed-end">
                <div className="nk-box nk-solo">
                  <Image quality={Q}
                    src={A("storytelling-feed.png")}
                    alt="Before: one long vertical scroll. After: an outfit's views set as horizontal pages, with the next view showing at the edge."
                    width={1555}
                    height={813}
                    sizes="(min-width: 1180px) 900px, 100vw"
                  />
                </div>
              </figure>
            </Card>

            <Card s={sec("components")}>
              <Head s={sec("components")} idx="01.5" />
              <figure className="nk-ev">
                <div className="nk-box nk-grid nk-comps">
                  {(
                    [
                      ["gs-imagery-primary.png", "Imagery/Primary", 1125, 1794],
                      ["gs-imagery-secondary.png", "Imagery/Secondary", 1125, 1794],
                      ["gs-imagery-tertiary.png", "Imagery/Tertiary", 1125, 1794],
                      ["gs-poster-card.png", "Poster-Card", 1125, 1500],
                    ] as const
                  ).map(([file, name, w, h]) => (
                    <figure key={file}>
                      <Image quality={Q} src={A(file)} alt={`Layout component: ${name.replace("/", ", ").toLowerCase()}.`} width={w} height={h} sizes="240px" />
                      <figcaption>
                        <span>Layout/</span>
                        {name}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </figure>
            </Card>

            {/* 02 Shop */}
            <Opener part={PARTS[1]!} />

            <Card s={sec("tags")} tone="black">
              <Head s={sec("tags")} idx="02.1" seek={25} />
              <figure className="nk-ev nk-ev-one">
                <Pip
                  ratio={2500 / 1306}
                  main={{
                    label: "Final",
                    image: (
                      <Image quality={Q}
                        src={A("product-tags-2.png")}
                        alt="Final: three story pages, with product tags on the photos naming a T-shirt and a pair of trainers."
                        width={2500}
                        height={1306}
                        sizes="(min-width: 1180px) 900px, 100vw"
                      />
                    ),
                  }}
                  inset={{
                    label: "Wireframe",
                    image: (
                      <Image quality={Q}
                        src={A("product-tags-1.png")}
                        alt="Wireframe: the same three pages, with a product tag placed on the photo."
                        width={2500}
                        height={1306}
                        sizes="(min-width: 1180px) 900px, 100vw"
                      />
                    ),
                  }}
                />
              </figure>
            </Card>

            <Card s={sec("product-card")}>
              <Head s={sec("product-card")} idx="02.2" seek={26} />
              <figure className="nk-ev nk-ev-one">
                <div className="nk-box nk-field nk-phones">
                  <div className="nk-pair">
                    <figure>
                      <Image quality={Q} src={A("product-card-before.png")} alt="Before the redesign: products in small tiles under the story photo." width={1821} height={3584} sizes="(min-width: 760px) 420px, 45vw" />
                      <figcaption>
                        <b>Before</b>
                      </figcaption>
                    </figure>
                    <figure className="is-after">
                      <Image quality={Q} src={A("product-card-after.png")} alt="After the redesign: larger product images under the story photo." width={1821} height={3584} sizes="(min-width: 760px) 420px, 45vw" />
                      <figcaption>
                        <b>After</b>
                      </figcaption>
                    </figure>
                  </div>
                </div>
              </figure>
            </Card>

            <Card s={sec("ranking")}>
              <Head s={sec("ranking")} idx="02.3" seek={48} />
              <figure className="nk-ev">
                <div className="nk-box nk-rank">
                  <figure>
                    <Image quality={Q} src={A("ranking-before.png")} alt="Before: three loose tiles." width={1125} height={1167} sizes="(min-width: 761px) 380px, 45vw" />
                    <figcaption>Before</figcaption>
                  </figure>
                  <span className="nk-arrow" aria-hidden="true">
                    →
                  </span>
                  <figure>
                    <Image quality={Q} src={A("ranking-after.png")} alt="After: a ranked top three with calls to action." width={1125} height={1260} sizes="(min-width: 761px) 380px, 45vw" />
                    <figcaption>After</figcaption>
                  </figure>
                </div>
              </figure>
            </Card>

            {/* 03 Return */}
            <Opener part={PARTS[2]!} />

            <Card s={sec("draw")} tone="black">
              <Head s={sec("draw")} idx="03.1" />
              <figure className="nk-ev nk-bleed nk-bleed-end">
                <GiftBox src={A("gift-box.lottie.json")} label="Animation: a shoebox opens and a pair of trainers rises out" />
              </figure>
            </Card>

            <Card s={sec("star-voice")}>
              <Head s={sec("star-voice")} idx="03.2" seek={42} />
              <figure className="nk-ev nk-ev-one">
                <div className="nk-box nk-sv">
                  <div className="nk-sv-phone">
                    <Image
                      quality={Q}
                      src={A("star-voice-screen.jpg")}
                      alt="Star Voice Q&A in the app: the next influencer's voice teaser, questions with their like counts, and a field to ask one."
                      width={1125}
                      height={1833}
                      sizes="(min-width: 761px) 340px, 70vw"
                    />
                    <VoiceTeaser src={A("star-voice-teaser.mp3")} label="the voice teaser (5 seconds)" />
                  </div>
                  <ul className="nk-sv-notes">
                    {SV_NOTES.map((n) => (
                      <li key={n.title} className={n.side === "l" ? "is-l" : "is-r"} style={{ ["--y" as string]: String(n.y) }}>
                        <i aria-hidden="true" />
                        <span>
                          <b>{n.title}</b>
                          {n.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </figure>
            </Card>

            {/* 04 Outcome */}
            <Opener part={PARTS[3]!} />

            <section id="outcome" className="nk-sheet is-card is-black nk-noise nk-outcome" aria-labelledby="outcome-h">
              <div>
                <p className="nk-meta">
                  <span className="nk-idx">04.1</span>
                </p>
                <h3 id="outcome-h" className="nk-big">
                  {outcome.title}
                </h3>
              </div>
              <div className="nk-ogrid">
                <div>
                  <p className="nk-olabel">Context</p>
                  <p>{outcome.body[0]}</p>
                </div>
                <div>
                  <p className="nk-olabel">Team</p>
                  <p>{outcome.body[1]}</p>
                </div>
              </div>
            </section>

            <Card s={sec("handoff")}>
              <Head s={sec("handoff")} idx="04.2" seek={28.4} />
              <div className="nk-ev nk-ev-one">
                <div className="nk-box nk-vs">
                  <figure>
                    <div className="nk-vs-lbl">
                      <b>Specified</b>
                    </div>
                    <div className="nk-vs-img">
                      <Image quality={Q}
                        src={A("like-states.png")}
                        alt="The like specified in Figma: an outline heart, a pill reading 点赞赢好礼 (like to win a gift), then a black heart with the count, and hearts floating out."
                        width={1474}
                        height={962}
                        sizes="(min-width: 1180px) 560px, 100vw"
                      />
                    </div>
                  </figure>
                  <figure className="is-shipped">
                    <div className="nk-vs-lbl">
                      <b>Shipped</b>
                    </div>
                    <div className="nk-vs-img">
                      <Image quality={Q} src={A("like-shipped.jpg")} alt="The shipped like: a plain red heart over the photo." width={828} height={1034} sizes="320px" />
                    </div>
                  </figure>
                </div>
              </div>
            </Card>

            <nav className="nk-next" aria-label="Next case file">
              <span>Next case file</span>
              <Link href={`/work/${next.slug}`}>{next.title}</Link>
            </nav>
          </div>
        </div>
      </RecordingProvider>
    </div>
  );
}
