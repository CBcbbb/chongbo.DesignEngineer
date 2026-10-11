import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { SIGNALS, type Project, type Section } from "@content";
import { Compare, Contents, GiftBox, Pip, RecordingPlayer, RecordingProvider, SeekButton, Switcher, type ContentsPart } from "./NikeClient";
import "./nike.css";

const A = (file: string) => `/assets/nike/${file}`;
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

/** A card's head: index, kind and the claim on the left; the reasoning and tags on the right. */
function Head({ s, idx, kind, seek }: { s: Section; idx: string; kind: string; seek?: number }) {
  return (
    <div className="nk-head">
      <div>
        <p className="nk-meta">
          <span className="nk-idx">{idx}</span>
          <span className="nk-kind">{kind}</span>
        </p>
        <h3 id={`${s.id}-h`}>{s.title}</h3>
        <ul className="nk-tags" aria-label="Shows">
          {s.signals.slice(0, 2).map((sig) => (
            <li key={sig}>{SIGNALS[sig]}</li>
          ))}
        </ul>
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
                Nike App, China
              </p>
              <h1 id="case-title">{project.title}</h1>
              <p className="nk-lede">{project.oneLiner}</p>
              <div className="nk-intro">
                <p>
                  Athletes Closet is a members&apos; feature in Nike&apos;s app in China. In each volume, a fashion influencer shares
                  their style and recommends Nike products. From VOL.4, I designed the feature&apos;s creative system, every screen and
                  its motion.
                </p>
                <dl className="nk-facts">
                  <div>
                    <dt>Role</dt>
                    <dd>{project.role}</dd>
                  </div>
                  <div>
                    <dt>Client</dt>
                    <dd>Nike</dd>
                  </div>
                  <div>
                    <dt>Platform</dt>
                    <dd>Nike App, China</dd>
                  </div>
                </dl>
              </div>
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
              <RecordingPlayer chapters={CHAPTERS} />
            </section>

            {/* 01 Read */}
            <Opener part={PARTS[0]!} />

            <Card s={sec("graphic-system")} layout="side">
              <Head s={sec("graphic-system")} idx="01.1" kind="Design system" seek={19} />
              <figure className="nk-ev">
                <Switcher
                  options={[
                    {
                      label: "Logo lock-up",
                      layer: "Layout/Framing/Logo-Lockup",
                      image: <Image src={A("gs-logo-lockup.png")} alt="Logo lock-up: the 星推官 Athletes Closet lock-up, VOL number and headline." width={506} height={109} />,
                    },
                    {
                      label: "One-line header",
                      layer: "Layout/Header/One-Line",
                      image: <Image src={A("gs-header-one-line.png")} alt="One-line header: subtitle, chapter number and headline." width={502} height={155} />,
                    },
                    {
                      label: "Key message",
                      layer: "Layout/Message/Key-Message",
                      image: <Image src={A("gs-key-message.png")} alt="Key message: subtitle above a centred headline." width={502} height={154} />,
                    },
                    {
                      label: "Simplified text",
                      layer: "Layout/Message/Text-Simplified",
                      image: <Image src={A("gs-text-simplified.png")} alt="Simplified text: one line of text in a frame." width={502} height={70} />,
                    },
                    {
                      label: "Image and text",
                      layer: "Layout/Content/ImageText-Combo",
                      tall: true,
                      image: <Image src={A("gs-image-text-combo.png")} alt="Image and text: a full-height image with the lock-up and body text below." width={399} height={786} />,
                    },
                  ]}
                />
              </figure>
            </Card>

            <Card s={sec("style")}>
              <Head s={sec("style")} idx="01.2" kind="Visual style" />
              <figure className="nk-ev nk-ev-one">
                <div className="nk-box nk-grain nk-posters">
                  <Image
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
              <Head s={sec("retouching")} idx="01.3" kind="Before and after" />
              <figure className="nk-ev nk-ev-one">
                <div className="nk-box nk-field nk-retouch">
                  <div className="nk-cq" style={{ ["--ar" as string]: "0.666" }}>
                    <Compare
                      label="Compare photo 1, original and retouched"
                      labels={["Original", "Retouched"]}
                      ratio="333 / 500"
                      under={<Image src={A("retouch-1-after.png")} alt="Photo 1, retouched with a flash-photography look." width={333} height={500} />}
                      over={<Image src={A("retouch-1-original.png")} alt="Photo 1, the original before retouching." width={334} height={500} />}
                    />
                  </div>
                  <div className="nk-cq" style={{ ["--ar" as string]: "0.666" }}>
                    <Compare
                      label="Compare photo 2, original and retouched"
                      labels={["Original", "Retouched"]}
                      ratio="333 / 500"
                      under={<Image src={A("retouch-2-after.png")} alt="Photo 2, retouched with a flash-photography look." width={334} height={500} />}
                      over={<Image src={A("retouch-2-original.png")} alt="Photo 2, the original before retouching." width={334} height={500} />}
                    />
                  </div>
                </div>
              </figure>
            </Card>

            <Card s={sec("views")} tone="black">
              <Head s={sec("views")} idx="01.4" kind="Interaction" seek={22} />
              <figure className="nk-ev nk-bleed nk-bleed-end">
                <div className="nk-box nk-solo">
                  <Image
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
              <Head s={sec("components")} idx="01.5" kind="Design system" />
              <figure className="nk-ev">
                <div className="nk-box nk-grid nk-comps">
                  {(
                    [
                      ["gs-imagery-primary.png", "Imagery/Primary", 782],
                      ["gs-imagery-secondary.png", "Imagery/Secondary", 782],
                      ["gs-imagery-tertiary.png", "Imagery/Tertiary", 782],
                      ["gs-poster-card.png", "Poster-Card", 935],
                    ] as const
                  ).map(([file, name, w]) => (
                    <figure key={file}>
                      <Image src={A(file)} alt={`Layout component: ${name.replace("/", ", ").toLowerCase()}.`} width={w} height={1246} sizes="200px" />
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
              <Head s={sec("tags")} idx="02.1" kind="Story" seek={25} />
              <figure className="nk-ev nk-bleed nk-bleed-end">
                <Pip
                  main={{
                    label: "Final",
                    image: (
                      <Image
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
                      <Image
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
              <Head s={sec("product-card")} idx="02.2" kind="Before and after" seek={26} />
              <figure className="nk-ev">
                <div className="nk-box nk-field">
                  <div className="nk-pair">
                    <figure>
                      <Image src={A("product-card-before.png")} alt="Before the redesign: products in small tiles under the story photo." width={1821} height={3584} sizes="(min-width: 760px) 304px, 45vw" />
                      <figcaption>
                        <b>Before</b>
                      </figcaption>
                    </figure>
                    <figure className="is-after">
                      <Image src={A("product-card-after.png")} alt="After the redesign: larger product images under the story photo." width={1821} height={3584} sizes="(min-width: 760px) 304px, 45vw" />
                      <figcaption>
                        <b>After</b>
                      </figcaption>
                    </figure>
                  </div>
                </div>
              </figure>
            </Card>

            <Card s={sec("ranking")}>
              <Head s={sec("ranking")} idx="02.3" kind="Before and after" seek={48} />
              <figure className="nk-ev">
                <div className="nk-box nk-rank">
                  <figure>
                    <Image src={A("ranking-before.png")} alt="Before: three loose tiles." width={375} height={389} />
                    <figcaption>Before</figcaption>
                  </figure>
                  <span className="nk-arrow" aria-hidden="true">
                    →
                  </span>
                  <figure>
                    <Image src={A("ranking-after.png")} alt="After: a ranked top three with calls to action." width={375} height={420} />
                    <figcaption>After</figcaption>
                  </figure>
                </div>
              </figure>
            </Card>

            {/* 03 Return */}
            <Opener part={PARTS[2]!} />

            <Card s={sec("draw")} tone="black">
              <Head s={sec("draw")} idx="03.1" kind="Motion" />
              <figure className="nk-ev nk-bleed nk-bleed-end">
                <GiftBox src={A("gift-box.lottie.json")} label="Animation: a shoebox opens and a pair of trainers rises out" />
              </figure>
            </Card>

            <Card s={sec("star-voice")}>
              <Head s={sec("star-voice")} idx="03.2" kind="Story" seek={42} />
              <figure className="nk-ev">
                <div className="nk-box nk-sv">
                  <div className="nk-sv-screen nk-grain">
                    <Image
                      src={A("star-voice-crop.jpg")}
                      alt="Star Voice Q&A: a voice teaser from the next influencer, voted questions and a field to ask one."
                      width={2957}
                      height={3396}
                      sizes="(min-width: 760px) 420px, 90vw"
                    />
                  </div>
                  <div>
                    <ol className="nk-loop" aria-label="The Star Voice loop">
                      {["Preview", "Ask", "Vote", "Answered live"].map((step, i) => (
                        <li key={step}>
                          <span className="nk-n">{i + 1}</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </figure>
            </Card>

            {/* 04 Outcome */}
            <Opener part={PARTS[3]!} />

            <section id="outcome" className="nk-sheet is-card is-black nk-noise nk-outcome" aria-labelledby="outcome-h">
              <div>
                <p className="nk-meta">
                  <span className="nk-idx">04.1</span>
                  <span className="nk-kind">Outcome</span>
                </p>
                <h3 id="outcome-h" className="nk-big">
                  {outcome.title}
                </h3>
              </div>
              <div className="nk-outcome-foot">
                <div className="nk-ogrid">
                  <div>
                    <p className="nk-olabel">Outcome</p>
                    <p>{outcome.body[0]}</p>
                  </div>
                  <div>
                    <p className="nk-olabel">Role</p>
                    <p>{outcome.body[1]}</p>
                  </div>
                </div>
                <a className="nk-outlink" href={RECORDING_URL} target="_blank" rel="noopener">
                  Full recording on YouTube<span className="sr-only"> (opens in a new tab)</span> <span aria-hidden="true">↗</span>
                </a>
              </div>
            </section>

            <Card s={sec("handoff")}>
              <Head s={sec("handoff")} idx="04.2" kind="Reflection" seek={28.4} />
              <div className="nk-ev nk-ev-one">
                <div className="nk-box nk-vs">
                  <figure>
                    <div className="nk-vs-lbl">
                      <b>Specified</b>
                      <span>Figma</span>
                    </div>
                    <div className="nk-vs-img">
                      <Image
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
                      <span>App</span>
                    </div>
                    <div className="nk-vs-img">
                      <Image src={A("like-shipped.jpg")} alt="The shipped like: a plain red heart over the photo." width={828} height={1034} sizes="320px" />
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
