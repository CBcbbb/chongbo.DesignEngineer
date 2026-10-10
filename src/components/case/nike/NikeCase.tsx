import Image from "next/image";
import Link from "next/link";
import type { Project } from "@content";
import { LottiePlayer } from "./LottiePlayer";
import { wixFonts } from "../fonts";
import { SideNav, type SideNavItem } from "../SideNav";
import { Slideshow } from "./Slideshow";
import "./nike.css";

const A = (file: string) => `/assets/nike/${file}`;
const DEMO_URL = "https://www.youtube.com/shorts/4cFA1T_9m8w";

/** A fixed-ratio image box; `w` is the rendered width on desktop, used for `sizes`. */
function Pic({ file, alt, ratio, w, className }: { file: string; alt: string; ratio: string; w: number; className?: string }) {
  return (
    <div className={`nk-pic ${className ?? ""}`} style={{ aspectRatio: ratio.replace(":", " / ") }}>
      <Image src={A(file)} alt={alt} fill sizes={`(max-width: 760px) 90vw, ${w}px`} className="object-contain" />
    </div>
  );
}

function Labelled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <figure className="nk-fig">
      {children}
      <figcaption>{label}</figcaption>
    </figure>
  );
}

const NAV: SideNavItem[] = [
  { href: "#brief", label: "Brief & Contributions", parts: ["brief"] },
  { href: "#challenges", label: "Key Challenges & Solutions", parts: ["challenges", "graphic-system", "imagery", "product-card", "delight", "star-voice"] },
  { href: "#retouching", label: "Retouch & Mood", parts: ["retouching"] },
  { href: "#outcome", label: "Results & Feedback", parts: ["outcome"] },
  { href: "#summary", label: "Project Summary", parts: ["summary"] },
];

function Swoosh() {
  return <Image src={A("swoosh.png")} alt="" width={86} height={31} className="nk-swoosh" aria-hidden="true" />;
}

function BeforeAfter({ before, after }: { before: React.ReactNode; after: React.ReactNode }) {
  return (
    <div className="nk-ba">
      <div className="nk-ba-img">{before}</div>
      <div className="nk-ba-img nk-ba-after">{after}</div>
      <p className="nk-ba-label">Before</p>
      <span className="nk-ba-arrow" aria-hidden="true" />
      <p className="nk-ba-label">After</p>
    </div>
  );
}

/**
 * The Nike case file, laid out after the original Wix page: a full-bleed hero, alternating black and
 * white bands, orange solution cards and gradient carousels. Section ids match content/projects/nike.ts
 * so printed sheets still deep-link into the right place.
 */
export function NikeCase({ project, next }: { project: Project; next: Project }) {
  return (
    <div className={`nk ${wixFonts}`}>
      <SideNav items={NAV} className="nk-side" />

      <header className="nk-hero">
        <Image
          src={A("hero.jpg")}
          alt="Nike App Athlete Closet, UI/UX. The feature shown on a phone over a grainy gradient."
          fill
          priority
          sizes="100vw"
          className="nk-hero-img"
        />
        <h1 id="case-title" className="sr-only">
          {project.title}
        </h1>
        <div className="nk-hero-cta">
          <p>
            Feature Demonstration
            <br />– Live App Recording
          </p>
          <a href={DEMO_URL} className="nk-pill" target="_blank" rel="noopener">
            Watch it!<span className="sr-only"> (opens YouTube in a new tab)</span>
          </a>
        </div>
      </header>

      {/* ---------- brief ---------- */}
      <section id="brief" className="nk-band nk-white" aria-labelledby="glimpse-title">
        <div className="nk-wrap">
          <h2 id="glimpse-title" className="nk-h1">
            A glimpse at behind the scene
          </h2>
          <div className="nk-col">
            <dl className="nk-facts">
              <div>
                <dt>What I Did</dt>
                <dd>UI/UX Design</dd>
              </div>
              <div>
                <dt>What I Used</dt>
                <dd>Figma</dd>
              </div>
              <div>
                <dt>More</dt>
                <dd>
                  Client: Nike
                  <br />
                  Duration: 2 months
                </dd>
              </div>
            </dl>
            <div className="nk-card">
              <h3 className="nk-card-h">Brief</h3>
              <p>
                Nike launched a member-exclusive feature in its app, ATHLETES CLOSET, where fashion influencers share
                their style inspiration and recommend Nike products. This module bridges branded storytelling, user
                engagement, and e-commerce. I led the UI/UX redesign of the entire feature, focusing on
                systematisation, interaction design, visual consistency, and data-informed iteration to enhance both
                the user experience and commercial performance.
              </p>
            </div>
            <div className="nk-card">
              <h3 className="nk-card-h">My Contributions</h3>
              <ul>
                <li>Reconstructed the UI layout and component system to build a scalable and efficient design foundation</li>
                <li>Designed core interaction features, including like animation, prize draw and voice Q&amp;A</li>
                <li>Created the Star Voice Q&amp;A module to increase user engagement and live-stream interaction</li>
                <li>Applied user behaviour insights to guide iterative improvements</li>
                <li>Retouched key images to align visual tone, enhance personality expression, and support brand storytelling</li>
                <li>Collaborated closely with product managers and developers to ensure smooth implementation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- challenge 1 ---------- */}
      <section id="challenges" className="nk-band nk-black" aria-labelledby="challenges-title">
        <div className="nk-wrap">
          <div className="nk-h1-row">
            <h2 id="challenges-title" className="nk-h1">
              Key challenges &amp; solutions
            </h2>
            <Swoosh />
          </div>
          <div id="graphic-system" className="nk-col">
            <h3 className="nk-orange">Challenge 1</h3>
            <p className="nk-sub">Inconsistent Components Slowed Down Development</p>
            <p className="nk-p">
              Early designs lacked a standardised component system, resulting in inconsistent sizing and extra
              developer workload.
            </p>

            <h3 className="nk-orange nk-gap">Solutions</h3>
            <ol className="nk-cards">
              <li>
                <span>01</span>Audited all UI elements and unified sizes, spacing and naming conventions
              </li>
              <li>
                <span>02</span>Rebuilt all interfaces in Figma using Auto Layout and a reusable component system
              </li>
              <li>
                <span>03</span>Delivered detailed documentation for smoother handover
              </li>
            </ol>

            <h4 className="nk-h4">Graphic System</h4>
            <p className="nk-h6">Layout/ Framing/ Text</p>
            <ul className="nk-list">
              <li>The text framing device is used for headline or chapter header to anchor key text message.</li>
              <li>
                This device is responsive to its context - details are either added/subtracted or rearranged according
                to the content.
              </li>
            </ul>

            <div className="nk-framing">
              <div className="nk-framing-stack">
                <Labelled label="Layout/Framing/Logo-Lockup">
                  <Pic file="gs-logo-lockup.png" alt="Logo lock-up frame." ratio="506:109" w={260} />
                </Labelled>
                <Labelled label="Layout/Header/One-Line">
                  <Pic file="gs-header-one-line.png" alt="One-line header frame." ratio="502:155" w={260} />
                </Labelled>
                <Labelled label="Layout/Message/Key-Message">
                  <Pic file="gs-key-message.png" alt="Key message frame." ratio="502:154" w={260} />
                </Labelled>
                <Labelled label="Layout/Message/Text-Simplified">
                  <Pic file="gs-text-simplified.png" alt="Simplified text frame." ratio="502:70" w={260} />
                </Labelled>
              </div>
              <Labelled label="Layout/Content/ImageText-Combo">
                <Pic file="gs-image-text-combo.png" alt="Image and text combo layout." ratio="399:786" w={172} />
              </Labelled>
            </div>

            <p id="imagery" className="nk-h6 nk-gap-sm">
              Image Layout With Coloured Background
            </p>
            <div className="nk-imagery">
              <Labelled label="Layout/Imagery/Primary">
                <Pic file="gs-imagery-primary.png" alt="Primary imagery layout." ratio="782:1246" w={190} />
              </Labelled>
              <Labelled label="Layout/Imagery/Secondary">
                <Pic file="gs-imagery-secondary.png" alt="Secondary imagery layout." ratio="782:1246" w={190} />
              </Labelled>
              <Labelled label="Layout/Imagery/Tertiary">
                <Pic file="gs-imagery-tertiary.png" alt="Tertiary imagery layout." ratio="782:1246" w={190} />
              </Labelled>
              <Labelled label="Layout/Poster-Card">
                <Pic file="gs-poster-card.png" alt="Poster card layout." ratio="935:1246" w={228} />
              </Labelled>
            </div>

            <h3 className="nk-orange nk-gap">Result</h3>
            <p className="nk-p">Improved delivery efficiency and reduced back-and-forth between design and development teams.</p>
          </div>
        </div>
      </section>

      {/* ---------- challenge 2 ---------- */}
      <section id="product-card" className="nk-band nk-white" aria-labelledby="c2-title">
        <div className="nk-wrap">
          <div className="nk-col">
            <h3 id="c2-title" className="nk-orange">
              Challenge 2
            </h3>
            <p className="nk-sub">Low Conversion Rate from Content to Product</p>
            <p className="nk-p">
              Despite high engagement rate with editorial content, product click-through remained low due to a lack of
              direct connection between stories and merchandise.
            </p>
            <h3 className="nk-orange nk-gap-sm">Solutions</h3>
            <Slideshow
              label="Challenge 2 solutions"
              slides={[
                {
                  n: "01",
                  text: "Redesigned the product card layout by enlarging product visuals to increase visibility and emphasise their role in the content flow, making items more noticeable and click-worthy",
                  media: (
                    <BeforeAfter
                      before={<Pic file="product-card-before.png" alt="Product card before: small product tiles." ratio="1821:3584" w={204} />}
                      after={<Pic file="product-card-after.png" alt="Product card after: larger product visuals." ratio="1821:3584" w={204} />}
                    />
                  ),
                },
                {
                  n: "02",
                  text: "Enhanced the animation of the “like-to-draw” feature to strengthen the behavioural-reward loop and motivate user interaction.",
                  media: (
                    <LottiePlayer
                      src={A("like-to-draw.lottie.json")}
                      label="Animation: liking a story opens the prize draw."
                      ratio="376:579"
                      className="nk-lottie-tall"
                    />
                  ),
                },
                {
                  n: "03",
                  text: "Embedded tappable product tags directly into the storytelling visuals to create a “see-to-shop” experience, enabling instant product discovery within the narrative context.",
                  media: (
                    <Image
                      src={A("product-tags.gif")}
                      alt="Story screens with tappable product tags on the photos."
                      width={2500}
                      height={1306}
                      unoptimized
                      className="nk-gif"
                    />
                  ),
                },
              ]}
            />
            <h3 className="nk-orange nk-gap">Result</h3>
            <p className="nk-p">
              Product visibility significantly improved, with a clearer click-through path and positive feedback from
              the client on increased user interest and conversions.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- challenge 3 ---------- */}
      <section id="delight" className="nk-band nk-black" aria-labelledby="c3-title">
        <div className="nk-wrap">
          <div className="nk-col">
            <h3 id="c3-title" className="nk-orange">
              Challenge 3
            </h3>
            <p className="nk-sub">Lack of Interactive Mechanisms, Low User Engagement Rate</p>
            <p className="nk-p">
              The content primarily relied on static text-and-image formats, resulting in passive user behaviour. There
              was a lack of interactive mechanisms to encourage engagement or build long-term attachment to the section.
            </p>
            <h3 className="nk-orange nk-gap-sm">Solutions</h3>
            <Slideshow
              label="Challenge 3 solutions"
              slides={[
                {
                  n: "01",
                  text: "Designed a surprise-style prize draw animation triggered after liking, using a “gift box” visual effect to provide emotional reinforcement for the action.",
                  media: (
                    <LottiePlayer
                      src={A("gift-box.lottie.json")}
                      label="Animation: a Nike shoebox opens and a pair of trainers rises out."
                      ratio="1920:1080"
                      className="nk-lottie-wide"
                    />
                  ),
                },
                {
                  n: "02",
                  title: "Redesigned the Star Ranking module",
                  text: "Transformed a loosely structured, visually inconsistent list into a well-organised, interaction-driven leaderboard with clear hierarchy and cohesive visual style. Added CTA buttons like “See More” and “View Similar Outfits” to encourage deeper content and product exploration following a like.",
                  media: (
                    <BeforeAfter
                      before={<Pic file="ranking-before.png" alt="Star ranking before: three loose tiles." ratio="375:389" w={200} className="nk-pic-card" />}
                      after={<Pic file="ranking-after.png" alt="Star ranking after: an ordered top-three leaderboard." ratio="375:420" w={200} className="nk-pic-card" />}
                    />
                  ),
                },
                {
                  n: "03",
                  title: "Redesigned the Storytelling Feed",
                  text: "Transformed a vertical long-scroll layout into a horizontal swipe format, simulating a page-flipping rhythm to help users better focus on individual content blocks and improve overall mobile reading experience.",
                  media: (
                    <BeforeAfter
                      before={<Pic file="feed-before.png" alt="Wireframe: the old feed as one long vertical scroll." ratio="160:1098" w={56} className="nk-pic-card nk-feed-before" />}
                      after={<Pic file="feed-after.png" alt="Wireframe: the new feed as horizontally swiped pages." ratio="900:993" w={240} className="nk-pic-card" />}
                    />
                  ),
                },
                {
                  n: "04",
                  text: "Created custom hero visuals and poster cards for each featured guest, strengthening the connection between user behaviour and content identity, and enhancing user recognition and retention.",
                  media: <Pic file="guest-posters.png" alt="Six poster cards, one for each featured guest." ratio="1181:939" w={448} />,
                },
              ]}
            />
            <h3 className="nk-orange nk-gap">Result</h3>
            <p className="nk-p">
              The layered interaction mechanisms significantly boosted user engagement across the board - from liking to
              question submission to livestream participation, completing a full engagement loop. The client reported
              higher-than-expected interaction performance and expressed interest in extending this model to other Nike
              content modules.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- feature focus ---------- */}
      <section id="star-voice" className="nk-band nk-white" aria-labelledby="focus-title">
        <div className="nk-wrap">
          <h2 id="focus-title" className="nk-h1">
            Feature focus
          </h2>
          <div className="nk-col">
            <h3 className="nk-orange">Star Voice Q&amp;A</h3>
            <p className="nk-p">
              To maintain audience interest between episodes and build anticipation for the next influencer, I designed
              a new feature — Star Voice Q&amp;A. In each cycle, the upcoming guest records a teaser voice message to
              preview the next topic. Users are invited to submit questions and upvote others’. Top-voted questions are
              then selected and answered during Nike’s livestream, forming a full loop of preview → participation → live
              response.
            </p>
            <Pic
              file="star-voice-qa.png"
              alt="Star Voice Q&A screen annotated: voice teaser, vote with likes, ask a question, livestream reveal."
              ratio="7212:3396"
              w={880}
              className="nk-voice"
            />
            <Pic file="star-voice-qa-mobile.png" alt="Star Voice Q&A for a second guest." ratio="1500:2444" w={225} className="nk-voice-phone" />
          </div>
        </div>
      </section>

      {/* ---------- retouching ---------- */}
      <section id="retouching" className="nk-band nk-black" aria-labelledby="retouch-title">
        <div className="nk-wrap">
          <div className="nk-h1-row">
            <h2 id="retouch-title" className="nk-h1">
              Retouching &amp; mood enhancement
            </h2>
            <Swoosh />
          </div>
          <div className="nk-col">
            <p className="nk-p">
              To unify the visual tone and highlight the character of each featured influencer, I retouched key campaign
              images with tone correction, blemish removal, and flash-shooting vibe enhancement. These treatments aligned
              the visuals with Nike’s core brand values of authenticity, energy, and youthfulness.
            </p>
            <h3 className="nk-orange nk-gap-sm">Retouching</h3>
            <p className="nk-sub nk-sub-sm">
              Tone Adjustment, Blemish Removal, Highlighting
              <br />
              The Vibe Of Flash Shooting
            </p>
            <div className="nk-retouch">
              {[
                ["retouch-1-original.png", "Original", "Influencer seated on a bed, original photo."],
                ["retouch-1-after.png", "Retouched", "Same photo, retouched with flash-style tone."],
                ["retouch-2-original.png", "Original", "Close-up of trainers on a sofa, original photo."],
                ["retouch-2-after.png", "Retouched", "Same close-up, retouched."],
              ].map(([file, label, alt]) => (
                <Labelled key={file} label={label!}>
                  <Pic file={file!} alt={alt!} ratio="2:3" w={215} className="nk-pic-fill" />
                </Labelled>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- results + summary ---------- */}
      <section id="outcome" className="nk-band nk-white" aria-labelledby="results-title">
        <div className="nk-wrap">
          <h2 id="results-title" className="nk-h1">
            Results &amp; feedback (qualitative)
          </h2>
          <div className="nk-col">
            <div className="nk-card nk-card-tight">
              <ul>
                <li>Standardised UI system improved delivery speed and developer satisfaction</li>
                <li>Interactive features such as likes and prize draw boosted engagement</li>
                <li>Star Voice Q&amp;A received positive feedback and was recommended for wider use in other campaigns</li>
                <li>Client satisfaction led to continuation of UI collaboration across two further quarters</li>
              </ul>
            </div>
          </div>

          <h2 id="summary" className="nk-h1 nk-gap-lg">
            Project summary
          </h2>
          <div className="nk-col">
            <div className="nk-card">
              <p>
                By establishing a robust component system, designing interaction-driven modules, and applying user
                behaviour insights, I helped elevate the ATHLETES CLOSET experience to align with both brand storytelling
                and commercial goals. This project sharpened my ability to design across the full UX cycle and
                strengthened my understanding of how brand, users and business objectives can be harmoniously aligned.
              </p>
            </div>
          </div>
        </div>
      </section>

      <nav className="nk-band nk-black nk-next" aria-label="Next case file">
        <Link href={`/work/${next.slug}`}>
          Next Project<span className="sr-only">: {next.title}</span>
        </Link>
      </nav>
    </div>
  );
}
