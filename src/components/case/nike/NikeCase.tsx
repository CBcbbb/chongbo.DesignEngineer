import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Project, Section } from "@content";
import { ChipIcon, Compare, Contents, GiftBox, Pip, PosterStrip, RecordingPlayer, SeekButton, Switcher, VoiceTeaser, type ContentsPart, type Moment } from "./NikeClient";
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
    cards: [{ id: "outcome", label: "Results" }],
  },
];

/** Moments in the recording, timed from the footage (seconds), in the order they happen. */
const M = {
  opening: { start: 4, end: 9.7, label: "Opening video", part: "Read" },
  lockup: { start: 13.3, end: 15.9, label: "Lock-up on the cover", part: "Read" },
  framing: { start: 20.6, end: 22, label: "Headline framing device", part: "Read" },
  views: { start: 22.8, end: 24.2, label: "Several views, swiped", part: "Read" },
  tag: { start: 24.2, end: 25.6, label: "Product tag", part: "Shop" },
  cards: { start: 25.6, end: 26.4, label: "Product cards", part: "Shop" },
  typing: { start: 26.4, end: 27.6, label: "Headline typed in", part: "Read" },
  like: { start: 27.8, end: 29.7, label: "Like", part: "Return" },
  poster: { start: 40.4, end: 41.5, label: "Poster card", part: "Read" },
  starVoice: { start: 41.5, end: 48.4, label: "Star Voice Q&A", part: "Return" },
  ranking: { start: 48.4, end: 50.4, label: "Star Ranking", part: "Shop" },
} satisfies Record<string, Moment>;
const CHAPTERS: Moment[] = Object.values(M);


/**
 * Star Voice Q&A: the notes from the original presentation, each pinned to the part of the screen it
 * describes (`y`: its height on the screen, from 0 at the top to 1 at the bottom).
 */
const SV_NOTES = [
  {
    y: 0.22,
    side: "r",
    title: "Voice teaser",
    text: "The next influencer previews their topic in a short voice clip, with an animated waveform to catch attention.",
  },
  { y: 0.395, side: "l", title: "Livestream reveal", text: "The top-voted questions are answered live in Nike's livestream." },
  { y: 0.72, side: "r", title: "Vote with likes", text: "Readers upvote each other's questions." },
  { y: 0.895, side: "l", title: "Ask a question", text: "Readers submit questions, shown in an interactive feed." },
] as const;

/** An image placeholder: a box with a cross. */
function X({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <>
      <rect x={x} y={y} width={w} height={h} />
      <path d={`M${x} ${y}L${x + w} ${y + h}M${x + w} ${y}L${x} ${y + h}`} />
    </>
  );
}
/** Lines of text, the last one shorter. */
const lines = (x: number, y: number, w: number, n: number) =>
  Array.from({ length: n }, (_, i) => <path key={i} d={`M${x} ${y + i * 9}h${i === n - 1 ? w * 0.6 : w}`} />);

/**
 * 01.4's decision as wireframes, redrawn from the original slide: before, one long vertical scroll;
 * after, the outfit's views as pages swiped sideways, with the next page showing at the edge.
 */
function FeedWireframes() {
  return (
    <svg
      className="nk-wire"
      viewBox="0 0 1000 620"
      role="img"
      aria-label="Wireframes. Before: one long vertical scroll, with an arrow pointing down. After: an outfit's views set side by side as pages, with an arrow pointing right and the next page showing at the edge."
    >
      {/* before: one long column */}
      <g className="nk-wire-paper">
        <rect x="170" y="30" width="120" height="530" />
        <rect x="430" y="60" width="190" height="120" />
        <rect x="430" y="180" width="190" height="250" />
        <rect x="620" y="190" width="170" height="230" />
        <rect x="790" y="190" width="170" height="230" />
        <rect x="960" y="190" width="60" height="230" />
        <rect x="430" y="430" width="190" height="130" />
      </g>
      <g className="nk-wire-line">
        <X x={170} y={30} w={120} h={110} />
        <rect x="180" y="150" width="100" height="22" />
        {lines(180, 186, 100, 4)}
        <X x={170} y={222} w={120} h={120} />
        {lines(180, 356, 100, 4)}
        <X x={178} y={392} w={104} h={96} />
        {lines(180, 500, 100, 2)}
        <X x={172} y={520} w={36} h={34} />
        <X x={212} y={520} w={36} h={34} />
        <X x={252} y={520} w={36} h={34} />
        {/* after: a header, then the views as pages, the fourth showing at the edge */}
        <rect x="442" y="72" width="166" height="30" />
        {lines(442, 120, 166, 3)}
        <X x={430} y={180} w={190} h={250} />
        <rect x="632" y="202" width="146" height="150" />
        {lines(632, 372, 146, 4)}
        {lines(802, 204, 146, 4)}
        <rect x="802" y="244" width="146" height="160" />
        <X x={440} y={450} w={80} h={66} />
        <X x={530} y={450} w={80} h={66} />
        {lines(440, 530, 170, 2)}
      </g>
      <g className="nk-wire-dot">
        <circle cx="180" cy="40" r="5" />
        <circle cx="444" cy="194" r="7" />
        <circle cx="606" cy="194" r="7" />
      </g>
      <g className="nk-wire-arrow">
        <path d="M230 62V300" />
        <path d="M212 280l18 22 18-22" />
        <path d="M462 305H900" />
        <path d="M878 287l22 18-22 18" />
      </g>
      <text x="230" y="600" className="nk-wire-label">
        Before
      </text>
      <text x="695" y="600" className="nk-wire-label">
        After
      </text>
    </svg>
  );
}

/** 01.2: the six influencer poster cards, one file each. */
const POSTER_W = 990;
const POSTER_H = 1320; // Figma exports at 3x
const POSTERS = [
  { file: "poster-1.jpg", alt: "Max, a wild explorer, standing on a sofa in her room." },
  { file: "poster-2.jpg", alt: "Kyoka, a culture crosser, in sunglasses and a cap." },
  { file: "poster-3.jpg", alt: "Emma, a hip-hop dancer, mid-move under a neon sign." },
  { file: "poster-4.jpg", alt: "Emma, a drummer, on a flight case with drumsticks." },
  { file: "poster-5.jpg", alt: "Zhou Yuxiang, a popping dancer, by a window." },
  { file: "poster-6.jpg", alt: "Emma, a happy little monster, in a pink T-shirt." },
];

/** A card's head: index and claim on the left, the reasoning on the right. */
type HeadProps = { s: Section; idx: string; clip?: Moment };
function HeadEl({ s, idx, clip, pre }: HeadProps & { pre: string }) {
  return (
    <div className="nk-head">
      <div>
        <p className="nk-meta">
          <span className="nk-idx">{idx}</span>
        </p>
        <h3 id={`${pre}${s.id}-h`}>{s.title}</h3>
      </div>
      <div className="nk-body">
        {s.body.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
        {clip && <SeekButton moment={clip} />}
      </div>
    </div>
  );
}

/** `side` puts the text beside the evidence on wide screens: for long copy or tall evidence. */
type CardProps = { s: Section; tone?: "black"; layout?: "side"; children: ReactNode };
function CardEl({ s, tone, layout, children, pre }: CardProps & { pre: string }) {
  return (
    <article
      id={`${pre}${s.id}`}
      data-card={s.id}
      className={`nk-sheet is-card${tone === "black" ? " is-black" : ""}${layout === "side" ? " is-side" : ""}`}
      aria-labelledby={`${pre}${s.id}-h`}
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
 * Every Nike card, keyed by section id, as the case file shows it. The printed sheets on the home page and /ask
 * use these same elements, so a printed card is the case-file card itself. `pre` keeps ids unique where cards
 * are printed; `data-card` is never prefixed.
 */
export function nikeCards(project: Project, pre = ""): Record<string, ReactNode> {
  const s = Object.fromEntries(project.sections.map((x) => [x.id, x])) as Record<string, Section>;
  const sec = (id: string) => {
    const found = s[id];
    if (!found) throw new Error(`Nike case file: missing section "${id}"`);
    return found;
  };
  const outcome = sec("outcome");
  const Card = (props: CardProps) => <CardEl pre={pre} {...props} />;
  const Head = (props: HeadProps) => <HeadEl pre={pre} {...props} />;
  return {
    "graphic-system": (
    <Card s={sec("graphic-system")}>
      <Head s={sec("graphic-system")} idx="01.1" clip={M.framing} />
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
    ),
    "style": (
    <Card s={sec("style")}>
      <Head s={sec("style")} idx="01.2" clip={M.poster} />
      <figure className="nk-ev nk-ev-one">
        <div className="nk-box nk-grain nk-posters">
          <PosterStrip label="Six poster cards, one per influencer">
            {POSTERS.map((p, i) => (
              <Image
                key={p.file}
                quality={Q}
                src={A(p.file)}
                alt={`Poster card ${i + 1} of 6: ${p.alt}`}
                width={POSTER_W}
                height={POSTER_H}
                sizes="(min-width: 761px) 300px, 70vw"
              />
            ))}
          </PosterStrip>
        </div>
      </figure>
    </Card>
    ),
    "retouching": (
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
    ),
    "views": (
    <Card s={sec("views")} tone="black">
      <Head s={sec("views")} idx="01.4" clip={M.views} />
      <figure className="nk-ev nk-ev-one">
        {/* The decision is structural, so the wireframes lead; the app screens are one press away. */}
        <Pip
          ratio={1000 / 620}
          insetRatio={1555 / 813}
          main={{ label: "Wireframes", image: <FeedWireframes /> }}
          inset={{
            label: "App screens",
            image: (
              <Image
                quality={Q}
                src={A("storytelling-feed.png")}
                alt="In the app. Before: one long vertical scroll. After: an outfit's views set as horizontal pages, with the next view showing at the edge."
                width={1555}
                height={813}
                sizes="(min-width: 1180px) 900px, 100vw"
              />
            ),
          }}
        />
      </figure>
    </Card>
    ),
    "components": (
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
    ),
    "tags": (
    <Card s={sec("tags")} tone="black">
      <Head s={sec("tags")} idx="02.1" clip={M.tag} />
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
    ),
    "product-card": (
    <Card s={sec("product-card")}>
      <Head s={sec("product-card")} idx="02.2" clip={M.cards} />
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
    ),
    "ranking": (
    <Card s={sec("ranking")}>
      <Head s={sec("ranking")} idx="02.3" clip={M.ranking} />
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
    ),
    "draw": (
    <Card s={sec("draw")} tone="black">
      <Head s={sec("draw")} idx="03.1" />
      <figure className="nk-ev nk-bleed nk-bleed-end">
        <GiftBox src={A("gift-box.lottie.json")} label="Animation: a shoebox opens and a pair of trainers rises out" />
      </figure>
    </Card>
    ),
    "star-voice": (
    <Card s={sec("star-voice")}>
      <Head s={sec("star-voice")} idx="03.2" clip={M.starVoice} />
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
            <VoiceTeaser src={A("star-voice-teaser.mp3")} label="the voice teaser" seconds={5} />
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
    ),
    "outcome": (
    <section id={`${pre}outcome`} data-card="outcome" className="nk-sheet is-card is-black nk-noise nk-outcome" aria-labelledby={`${pre}outcome-h`}>
      <div>
        <p className="nk-meta">
          <span className="nk-idx">04.1</span>
        </p>
        <h3 id={`${pre}outcome-h`} className="nk-big">
          {outcome.title}
        </h3>
      </div>
      <div className="nk-ofoot">
        <ul className="nk-ogrid">
          {(outcome.steps ?? []).map((r) => (
            <li key={r.title}>
              <p className="nk-olabel">{r.title}</p>
              <p>{r.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
    ),
  };
}

/**
 * The Nike case file. Copy comes from content/projects/nike.ts so printed sheets and the page say the same
 * words; this file decides how each card shows its evidence.
 */
export function NikeCase({ project, next }: { project: Project; next: Project }) {
  const cards = nikeCards(project);

  return (
    <div className="nk" id="top">
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
              {/* What this shows: labels, not links; a capability usually spans several cards. */}
              <div className="nk-chips">
                <p>What this shows</p>
                <ul>
                  <li>
                    <ChipIcon kind="swoosh" />
                    Brand storytelling
                  </li>
                  <li>
                    <ChipIcon kind="heart" />
                    Motion and microinteractions
                  </li>
                  <li>
                    <ChipIcon kind="grid" />
                    Design systems
                  </li>
                </ul>
              </div>
            </header>

            {/* the recording */}
            <section id="recording" className="nk-sheet is-black nk-rec-glow" aria-labelledby="rec-h">
              <RecordingPlayer chapters={CHAPTERS} full={RECORDING_URL} />
            </section>

            {/* 01 Read */}
            <Opener part={PARTS[0]!} />

            {cards["graphic-system"]}

            {cards["style"]}

            {cards["retouching"]}

            {cards["views"]}

            {cards["components"]}

            {/* 02 Shop */}
            <Opener part={PARTS[1]!} />

            {cards["tags"]}

            {cards["product-card"]}

            {cards["ranking"]}

            {/* 03 Return */}
            <Opener part={PARTS[2]!} />

            {cards["draw"]}

            {cards["star-voice"]}

            {/* 04 Outcome */}
            <Opener part={PARTS[3]!} />

            {cards["outcome"]}


            <nav className="nk-next" aria-label="Next case file">
              <span>Next case file</span>
              <Link href={`/work/${next.slug}`}>{next.title}</Link>
            </nav>
          </div>
        </div>
    </div>
  );
}
