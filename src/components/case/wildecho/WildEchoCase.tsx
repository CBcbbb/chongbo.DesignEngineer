import Image from "next/image";
import Link from "next/link";
import type { Project } from "@content";
import { wixFonts } from "../fonts";
import { SideNav, type SideNavItem } from "../SideNav";
import { Carousel } from "./Carousel";
import { Tabs } from "./Tabs";
import "./wildecho.css";

const A = (file: string) => `/assets/wildecho/${file}`;

const NAV: SideNavItem[] = [
  { href: "#role", label: "Brief & Achievements", parts: ["role"] },
  { href: "#background", label: "Background", parts: ["background"] },
  { href: "#problem", label: "Problem", parts: ["problem"] },
  { href: "#challenges", label: "UX Design Challenges & Strategy", parts: ["challenges", "mission"] },
  { href: "#solutions", label: "Solutions", parts: ["solutions", "blueprint"] },
  { href: "#prototype", label: "Iterative Test & Validation", parts: ["prototype", "iteration"] },
  { href: "#business-model", label: "Business Model", parts: ["business-model"] },
  { href: "#future", label: "Future Prospects", parts: ["future"] },
  { href: "#brand", label: "Brand Extension", parts: ["brand"] },
];

const PROSPECTS: { icon: string; size: [number, number]; title: string; text: string }[] = [
  { icon: "icon-database.png", size: [160, 159], title: "Database", text: "Establish a sound database of wildlife and nature" },
  { icon: "icon-souvenir.png", size: [160, 140], title: "Souvenir", text: "Devices can be designed as souvenirs with local characteristics" },
  { icon: "icon-memory.png", size: [160, 167], title: "Memory", text: "Provide a new way of experience-self and memory-self" },
  { icon: "icon-influence.png", size: [160, 198], title: "Influence", text: "Attract tourists while raising their awareness of respect for nature and wildlife" },
];

/** An image at its intrinsic ratio, full width of its box. `w` is the rendered width on desktop. */
function Pic({ file, alt, size, w, className }: { file: string; alt: string; size: [number, number]; w: number; className?: string }) {
  return (
    <Image
      src={A(file)}
      alt={alt}
      width={size[0]}
      height={size[1]}
      sizes={`(max-width: 1028px) 92vw, ${w}px`}
      className={`we-pic ${className ?? ""}`}
    />
  );
}

/* Small marks drawn after the Wix icons. */
function Stairs() {
  return (
    <svg className="we-ico" width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
      <path d="M0 0h8v8H0zM7 7h8v8H7zM14 14h8v8h-8z" fill="#bada55" />
    </svg>
  );
}
function Ring() {
  return (
    <svg className="we-ico" width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
      <path d="M7 1h8l6 6v8l-6 6H7l-6-6V7z" fill="none" stroke="#2c342a" strokeWidth="5" />
    </svg>
  );
}
function Peak() {
  return (
    <svg className="we-ico" width="24" height="22" viewBox="0 0 24 22" aria-hidden="true">
      <path d="M12 0 24 22h-7l-5-10-5 10H0z" fill="#bada55" />
    </svg>
  );
}
function Moon() {
  return (
    <svg className="we-ico" width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
      <path d="M9 0a11 11 0 1 0 13 13A9 9 0 0 1 9 0z" fill="#bada55" />
    </svg>
  );
}
function Star() {
  return (
    <svg className="we-ico" width="24" height="23" viewBox="0 0 24 23" aria-hidden="true">
      <path d="m12 0 3.7 7.6 8.3 1.2-6 5.8 1.4 8.4L12 19l-7.4 4 1.4-8.4-6-5.8 8.3-1.2z" fill="#2c342a" />
    </svg>
  );
}
function Squares({ className }: { className?: string }) {
  return (
    <span className={`we-squares ${className ?? ""}`} aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

function ChallengeRow({ n, title, challenge, strategy }: { n: string; title: [string, string]; challenge: string; strategy: string }) {
  return (
    <div className="we-chal">
      <h3 className="we-h5 we-olive">
        {n}. {title[0]}
        <br />
        {title[1]}
      </h3>
      <div className="we-pair">
        <div className="we-box we-box-lime">
          <p className="we-box-h">
            <Stairs />
            Challenge:
          </p>
          <p>{challenge}</p>
        </div>
        <div className="we-box we-box-dark">
          <p className="we-box-h">
            <Ring />
            Design Strategy:
          </p>
          <p>{strategy}</p>
        </div>
      </div>
    </div>
  );
}

function TestPanel({
  title,
  objective,
  method,
  media,
  findings,
}: {
  title: string;
  objective: string;
  method: string;
  media: React.ReactNode;
  findings: string[];
}) {
  return (
    <div className="we-test">
      <h3 className="we-h5">{title}</h3>
      <div className="we-pair">
        <div className="we-box we-box-lime">
          <p className="we-box-h">
            <Peak />
            Objective
          </p>
          <p>{objective}</p>
        </div>
        <div className="we-box we-box-lime">
          <p className="we-box-h">
            <Moon />
            Method
          </p>
          <p>{method}</p>
        </div>
      </div>
      <div className="we-test-media">{media}</div>
      <div className="we-box we-box-dark">
        <p className="we-box-h">
          <Star />
          Key Findings
        </p>
        <ul>
          {findings.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * The WildEcho case file, laid out after the original Wix page: forest-green and pale-sage bands, Avenir
 * headings with lime accents, and the project's own diagrams. Section ids match content/projects/wildecho.ts
 * (role, problem, prototype) so printed sheets still deep-link into the right place.
 */
export function WildEchoCase({ project, next }: { project: Project; next: Project }) {
  return (
    <div className={`we ${wixFonts}`}>
      <SideNav items={NAV} className="we-side" />

      <header className="we-hero">
        <Image
          src={A("hero.png")}
          alt="WildEcho: illustrated tourists listening on islands of forest, beside a Costa Rican beach turning into a sound wave. Stampede × Royal College of Art."
          fill
          priority
          sizes="100vw"
          className="we-hero-img"
        />
        <h1 id="case-title" className="sr-only">
          {project.title}
        </h1>
      </header>

      {/* ---------- brief ---------- */}
      <section id="role" className="we-band we-white" aria-labelledby="glimpse-title">
        <div className="we-wrap">
          <p className="we-kicker">WildEcho: Redefining Wildlife Tourism Through Sound</p>
          <h2 id="glimpse-title" className="we-h1 we-upper">
            A glimpse at behind the scene
          </h2>
          <dl className="we-facts">
            <div>
              <dt>My Main Role in the Team</dt>
              <dd>
                UX &amp; Service Designer –<br />
                End-to-End Ownership
              </dd>
            </div>
            <div>
              <dt>Toolkit</dt>
              <dd>
                Figma
                <br />
                Premiere Pro
                <br />
                Canva
              </dd>
            </div>
            <div>
              <dt>More</dt>
              <dd>
                Client: Stampede
                <br />
                Duration: 6 months
              </dd>
            </div>
          </dl>
          <div className="we-briefs">
            <div className="we-brief">
              <h3 className="we-h3">Brief</h3>
              <p className="we-strong">WildEcho: A Sound-Driven Travel Innovation</p>
              <p>
                WildEcho is an innovative service integrating sound technology, wildlife conservation, and responsible
                travel. Using an app and bone conduction headphones, WildEcho enhances auditory perception to complement
                visual exploration, allowing tourists to engage more deeply with their surroundings, capture and share
                their travel memories, and minimise disturbance to wildlife.
              </p>
            </div>
            <div className="we-brief">
              <h3 className="we-h3">Achievements</h3>
              <ul>
                <li>Led experience design strategy to shift tourist behaviour from photography to immersive listening</li>
                <li>Developed and tested sound-based alternatives that reduced ecological disruption during travel</li>
                <li>Prototyped and validated a series of low-intervention, high-impact touchpoints along the travel journey</li>
                <li>
                  Collaborated with guides and local tourism stakeholders to ensure contextual adaptability and commercial
                  viability
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- background ---------- */}
      <section id="background" className="we-band we-sage" aria-labelledby="background-title">
        <div className="we-wrap">
          <h2 id="background-title" className="we-h1">
            Background
          </h2>
          <div className="we-col">
            <div className="we-costa">
              <div className="we-costa-text">
                <h3 className="we-h5 we-rule">Costa Rica’s Ecotourism Landscape</h3>
                <p>
                  Costa Rica is home to over <b>500,000</b> species, representing <b>5%</b> of the world’s biodiversity.
                  With <b>25%</b> of its land designated as national parks and reserves, it has become a global hotspot
                  for ecotourism. However, tourist activities such as feeding, touching, and photographing wildlife often
                  lead to behavioural changes in animals, dependency on human food, and ecological stress.
                </p>
              </div>
              <Pic file="costa-rica-map.png" alt="Map of Costa Rica." size={[651, 616]} w={496} className="we-costa-map" />
              <Squares className="we-costa-sq" />
            </div>

            <h3 className="we-h5 we-rule we-gap">The Hidden Problem of Photography</h3>
            <p>Tourists rely on photography to capture their journeys, but this habit often results in:</p>
            <div className="we-three">
              <Pic
                file="problem-fragmented.png"
                alt="Fragmented experiences: social media pressures create unrealistic expectations, catching ideal memories versus taking perfect pictures. Cites the study “Forget in a Flash”."
                size={[700, 720]}
                w={286}
              />
              <Pic
                file="problem-memories.png"
                alt="Distorted memories: focusing on the camera rather than the moment, memories end up stored in phones instead of the mind."
                size={[700, 720]}
                w={286}
              />
              <Pic
                file="problem-harm.png"
                alt="Ecological harm: temporary blindness, a changed internal clock, disturbed routines and being touched, which can cause death."
                size={[701, 720]}
                w={286}
              />
            </div>
            <div className="we-refs">
              <p>Reference:</p>
              <a href="https://en.wikipedia.org/wiki/Wildlife_of_Costa_Rica" rel="noopener" target="_blank">
                https://en.wikipedia.org/wiki/Wildlife_of_Costa_Rica
              </a>
              <a href="https://www.kew.org/read-and-watch/costa-rica-biodiversity" rel="noopener" target="_blank">
                https://www.kew.org/read-and-watch/costa-rica-biodiversity
              </a>
              <a
                href="https://www.gvi.co.uk/blog/smb-costa-ricas-biodiversity-a-journey-through-its-forests/"
                rel="noopener"
                target="_blank"
              >
                https://www.gvi.co.uk/blog/smb-costa-ricas-biodiversity-a-journey-through-its-forests/
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- problem ---------- */}
      <section id="problem" className="we-band we-forest" aria-labelledby="problem-title">
        <div className="we-wrap">
          <h2 id="problem-title" className="we-h1 we-lime">
            Problem Definition
          </h2>
          <div className="we-col">
            <div className="we-q">
              <h3 className="we-pill">Why Do Tourists Want to Take Photos in Costa Rica?</h3>
              <p>
                Studies show that excessive focus on photography weakens memory formation. In Costa Rica’s outdoor
                adventures, guides often rely on animal sounds to identify species and educate tourists—proving that sound
                is not just part of the environment but a key to understanding and remembering the experience.
              </p>
              <p>
                WildEcho enhances auditory perception, shifting tourists’ attention to nature’s sounds. By replacing visual
                documentation with sound memories, visitors can fully immerse themselves in the journey while minimising
                wildlife disturbance.
              </p>
            </div>
            <div className="we-q we-q-right">
              <h3 className="we-pill">How Can We Reduce Tourists’ Dependence on Photography?</h3>
              <p>
                Many tourists visit Costa Rica hoping to capture unique wildlife photographs as a way to preserve their
                travel memories. However, social media amplifies the idea of “ideal” travel imagery, pushing tourists to
                engage in irresponsible behaviours—such as getting too close to animals, using flash photography, or
                feeding wildlife—in pursuit of the perfect shot. Ironically, people themselves are not the winners of this
                behaviour.
              </p>
              <p>When they fixate on their phone screens, they often miss out on the real essence of the experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- challenges ---------- */}
      <section id="challenges" className="we-band we-sage" aria-labelledby="challenges-title">
        <div className="we-wrap">
          <div className="we-h1-row">
            <h2 id="challenges-title" className="we-h1">
              UX Design Challenges and Strategy
            </h2>
            <Squares />
          </div>
          <div className="we-col">
            <ChallengeRow
              n="1"
              title={["Habit Challenge:", "How to Change Social Media-Driven Photography Habits?"]}
              challenge="Photography is a default behaviour in the social media era, serving both memory and sharing purposes. How can we offer alternatives that maintain social engagement without over-reliance on photos?"
              strategy="Provide shareable alternatives, such as co-created sound travel maps to share personalised audio experiences, making auditory memories socially engaging."
            />
            <ChallengeRow
              n="2"
              title={["Experience Design:", "How to Make Auditory Experiences Compelling?"]}
              challenge="Auditory experiences are less commonly used in tourism. How can we design sound-based interactions that are as engaging and emotionally resonant as visual ones?"
              strategy="Create immersive moments by pairing enhanced directional audio with sensory tools like binoculars, turning listening into a form of discovery and enabling richer, more surprising travel interactions."
            />
            <ChallengeRow
              n="3"
              title={["Behavioural Change:", "How to Validate the Effectiveness of Sound Experiences?"]}
              challenge="How can we assess the influence of auditory experiences on user attention, memory, and behavioural patterns?"
              strategy="Use controlled experiments to track photography frequency, analyse shifts in attention, and refine the experience journey."
            />
          </div>
        </div>
      </section>

      <section id="mission" className="we-forest we-mission" aria-label="Our mission">
        <div className="we-wrap">
          <Pic
            file="mission.png"
            alt="Our mission: to design a service that blazes a new trail alongside the major road of taking photos, slowly influencing people’s choices about how they experience and memorize during their travels."
            size={[2000, 1125]}
            w={980}
          />
        </div>
      </section>

      {/* ---------- solutions ---------- */}
      <section id="solutions" className="we-band we-sage" aria-labelledby="solutions-title">
        <div className="we-wrap">
          <h2 id="solutions-title" className="we-h1 we-olive">
            Solutions
          </h2>
          <div className="we-col">
            <h3 className="we-h5 we-narrow">
              Part 1. Challenging Social Media Culture: Making Sound a New Form of Social Currency
            </h3>
            <ul className="we-sol">
              <li>
                <b>Sound Map</b>
                Tourists can unlock and share location-based audio linked to Costa Rica’s wildlife.
              </li>
              <li>
                <b>Interactive Audio Content</b>
                Convert recorded travel sounds into personalised soundscapes for white noise or travel video background
                audio, enhancing shareability.
              </li>
              <li>
                <b>“Responsible Wildlife Traveller” Badge</b>
                Encourage tourists to promote responsible travel practices through social media.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="we-band we-forest" aria-label="Storyboard and app screens">
        <div className="we-wrap">
          <div className="we-col-wide">
            <Pic
              file="storyboard-ia.png"
              alt="Storyboard and UI wireframes beside the app’s information architecture: Discover, Memories, Community and Profile."
              size={[2000, 1125]}
              w={945}
            />
          </div>
          <Pic
            file="app-screens.jpg"
            alt="The WildEcho app: an encyclopedia page for a sloth with its sound, next to a spread of screens for the sound map, collections, community and profile."
            size={[2000, 1126]}
            w={1028}
            className="we-screens"
          />
        </div>
      </section>

      <section className="we-band we-sage" aria-labelledby="part2-title">
        <div className="we-wrap">
          <div className="we-col">
            <h3 id="part2-title" className="we-h5">
              Part 2. Driving Behavioural Change Through Experience Design
            </h3>
            <p className="we-strong">
              Using the Theory of Change (ToC) framework, we designed an experience that makes responsible tourism not only
              feasible but also appealing.
            </p>
            <Pic
              file="theory-of-change.png"
              alt="Theory of change. Animals: problem, being disturbed and hurt; assumption, use sounds to let tourists listen to animals rather than find them; vision, normal life undisturbed by photo-taking. Tourists: problem, distracted by taking photos; assumptions, directional microphones and headsets to enhance listening, recording devices to feel safe with memories; vision, change memory-self to experience-self."
              size={[2000, 863]}
              w={879}
              className="we-gap-sm"
            />
            <dl className="we-toc">
              <dt>Enhanced Auditory Perception</dt>
              <dd>
                Utilise directional sound technology to allow tourists to hear wildlife from a safe distance, reducing the
                need for close-up photography.
              </dd>
              <dt>Interactive Easter Eggs</dt>
              <dd>Introduce rare or extinct animal sounds to enrich the experience and evoke a sense of conservation awareness.</dd>
              <dt>Stakeholder Collaboration</dt>
              <dd>
                Implement a guide recommendation system to encourage tour guides to share audio content, while visitor
                recordings contribute to wildlife conservation databases.
              </dd>
            </dl>
          </div>
        </div>
      </section>

      <section id="blueprint" className="we-band we-forest" aria-labelledby="blueprint-title">
        <div className="we-wrap">
          <div className="we-col">
            <h3 id="blueprint-title" className="we-h4">
              Service Blueprint
            </h3>
            <Pic
              file="blueprint.png"
              alt="Service blueprint across the narrative, stages, user actions, front stage, backstage and support processes, from before the sound journey to using the app afterwards."
              size={[1542, 600]}
              w={881}
            />
            <Pic
              file="blueprint-stages.png"
              alt="The blueprint split into four stages: before the sound tour, during the sound tour, after the sound tour and using the app."
              size={[1483, 711]}
              w={881}
              className="we-gap-sm"
            />
          </div>
          <div className="we-stake">
            <Pic
              file="stakeholder-map.jpg"
              alt="Stakeholder map with WildEcho at the centre of tourists, guides, travel agencies, suppliers and conservation groups, and the value exchange with manufacturers and guides."
              size={[2400, 1350]}
              w={999}
            />
            <h3 className="we-h4 we-stake-h">
              Stakeholder Map &amp; Value Exchange
              <br />
              With Stakeholders
            </h3>
          </div>
        </div>
      </section>

      {/* ---------- testing ---------- */}
      <section id="prototype" className="we-band we-night" aria-labelledby="testing-title">
        <div className="we-wrap">
          <h2 id="testing-title" className="we-h1 we-lime">
            Iterative Testing &amp; Validation
          </h2>
          <div className="we-col">
            <p>
              To evaluate whether WildEcho effectively reduces photo-taking, enhances sensory immersion, and improves memory
              recall, we used a two-dimensional coordinate system to map and prioritize our hypotheses, and then conducted
              three rounds of user testing across different interaction scenarios and device combinations. We examined user
              perception, behavioural responses, and feedback to refine the experience.
            </p>
            <Pic
              file="hypothesis.png"
              alt="Testable hypotheses mapped from critical to not critical and confident to not confident; the critical, not-confident corner is what we should test."
              size={[2000, 1125]}
              w={945}
              className="we-gap-sm"
            />
            <Tabs
              label="Test rounds"
              tabs={[
                {
                  label: "TEST 1",
                  panel: (
                    <TestPanel
                      title="Exploring the Impact of Sound-Based Experiences"
                      objective="To test whether sound enhances nature-based experiences and influences tourist behaviour."
                      method="4 participants were divided into a photography group and a sound-focused group in a natural setting. Behavioural observations and emotional feedback were collected."
                      media={
                        <Pic
                          file="test1-impact.jpg"
                          alt="The impact of sound-based experiences: each participant’s mood along the route, with the conclusion that ears create more memorable, happier moments than photos."
                          size={[2000, 1126]}
                          w={849}
                        />
                      }
                      findings={[
                        "Auditory experiences led to deeper immersion and richer perception of nature.",
                        "Sound-based memories proved more lasting and emotionally positive.",
                        "The photography group had the least satisfying experience, often frustrated by imperfect shots.",
                      ]}
                    />
                  ),
                },
                {
                  label: "TEST 2",
                  panel: (
                    <TestPanel
                      title="Prototype & User Journey Testing"
                      objective="To evaluate the usability of WildEcho devices and app features, and refine the core sound-tourism experience."
                      method="Participants used bone conduction headphones and recording microphones during tours. Afterwards, they generated personalised AI sound journeys using the app."
                      media={
                        <Pic
                          file="test2-journey.jpg"
                          alt="Persona user journeys for Fiona, Bob and Jason across pre-trip, in-trip and post-trip stages."
                          size={[2000, 1126]}
                          w={849}
                        />
                      }
                      findings={[
                        "Most users preferred listening immersion over constant photo-taking.",
                        "WildEcho content increased users’ curiosity and connection to wildlife.",
                        "Improve discoverability of hidden “sound Easter eggs” (e.g. extinct species).",
                        "Strengthen guide integration to better facilitate sound-focused exploration.",
                      ]}
                    />
                  ),
                },
                {
                  label: "TEST 3",
                  panel: (
                    <TestPanel
                      title="Evaluating the Impact of Device Configurations on Tourist Experience and Photography Behaviour"
                      objective="To determine how different device configurations influence tourists’ photo-taking habits and proximity to wildlife."
                      method="Tested three device options and assessed behaviour and experience via observation and surveys."
                      media={
                        <Carousel
                          single
                          label="Test 3 results"
                          items={[
                            <Pic
                              key="b"
                              file="test3-behaviour.jpg"
                              alt="The tourist experience and photography behaviour test: three device proposals compared on fewer photos and keeping distance from animals."
                              size={[1600, 901]}
                              w={849}
                            />,
                            <Pic
                              key="f"
                              file="test3-feedback.png"
                              alt="Test users’ feedback: key learnings during and after travel, and possible improvements."
                              size={[1600, 901]}
                              w={849}
                            />,
                          ]}
                        />
                      }
                      findings={[
                        "Enhanced sound experiences (via headphones or binoculars) effectively reduce photography and help maintain a respectful distance from animals.",
                        "Sound recording alone is insufficient to alter habits - stronger sensory immersion is required.",
                        "Guides play a crucial role in shaping tourist behaviour, necessitating improved training and storytelling techniques.",
                      ]}
                    />
                  ),
                },
              ]}
            />
          </div>
        </div>
      </section>

      <section id="iteration" className="we-band we-night" aria-labelledby="iteration-title">
        <div className="we-wrap">
          <h2 id="iteration-title" className="we-h1 we-lime">
            Iteration
          </h2>
          <div className="we-col">
            <Pic
              file="v2.jpg"
              alt="WildEcho V2.0: technology iteration combining binocular and bone conduction headset; service iteration training tour guides; app iteration with multi-track audio editing, AI breakpoints and video plus 3D audio recording."
              size={[2000, 1125]}
              w={879}
            />
          </div>
        </div>
      </section>

      {/* ---------- business model ---------- */}
      <section id="business-model" className="we-band we-forest" aria-labelledby="business-title">
        <div className="we-wrap">
          <h2 id="business-title" className="we-h1 we-lime">
            Business Model
          </h2>
          <Pic
            file="business-model.jpg"
            alt="Business model: tourists pay for sound travel and rent or buy devices; WildEcho sells sounds on consignment, sells sound data to research institutions and buyers, and earns from ads for travel attractions and guides."
            size={[2000, 998]}
            w={993}
            className="we-biz"
          />
        </div>
      </section>

      {/* ---------- future ---------- */}
      <section id="future" className="we-band we-sage" aria-labelledby="future-title">
        <div className="we-wrap">
          <h2 id="future-title" className="we-h1 we-black">
            Future Prospects
          </h2>
          <div className="we-col">
            <Pic
              file="prospects-banner.jpg"
              alt="A Costa Rican beach at sunset turning into a sound wave."
              size={[1498, 306]}
              w={881}
            />
            <ul className="we-prospects">
              {PROSPECTS.map((x) => (
                <li key={x.title}>
                  <Image src={A(x.icon)} alt="" width={x.size[0]} height={x.size[1]} className="we-prospect-ico" />
                  <b>{x.title}</b>
                  {x.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- brand extension ---------- */}
      <section id="brand" className="we-band we-forest" aria-labelledby="brand-title">
        <div className="we-wrap">
          <h2 id="brand-title" className="we-h1 we-white-text">
            Brand Extension &amp; Future Collaboration
          </h2>
          <div className="we-col">
            <h3 className="we-h5 we-mint">Exploring Commercial Possibilities with OPPO</h3>
            <p>
              To further explore WildEcho’s potential beyond Costa Rica tourism scenarios, we collaborated with OPPO to
              imagine a product extension that integrates our product concept — combining binocular functions and bone
              conduction audio technology — into a smart wearable device.
            </p>
            <p>
              This device acts as both a sound-enhanced observation tool and a memory-capturing companion, allowing users to
              experience and record nature through immersive, non-intrusive audio interactions.
            </p>
            <Carousel
              label="WildEcho × OPPO concept renders"
              className="we-oppo"
              items={[
                <Image key="1" src={A("oppo-1.jpg")} alt="White WildEcho × OPPO glasses with bone conduction speakers, beside floating app screens." width={1800} height={1220} sizes="589px" />,
                <Image key="2" src={A("oppo-2.jpg")} alt="Close-up of the glasses’ bone conduction arm resting by the ear." width={1800} height={1220} sizes="589px" />,
                <Image key="3" src={A("oppo-3.jpg")} alt="The folding wearable arm shown on its own." width={1800} height={1220} sizes="589px" />,
              ]}
            />
            <div className="we-videos">
              <figure>
                <iframe
                  src="https://www.youtube-nocookie.com/embed/3_incou2j7k"
                  title="WildEcho × OPPO product concept video"
                  loading="lazy"
                  allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                />
                <figcaption>*Product Concept</figcaption>
              </figure>
              <figure>
                <iframe
                  src="https://www.youtube-nocookie.com/embed/CApliaGE6ek"
                  title="WildEcho × OPPO product animation"
                  loading="lazy"
                  allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                />
                <figcaption>*Product Animation</figcaption>
              </figure>
            </div>
            <p>
              This concept shows how WildEcho can evolve from a service experience to a commercial product ecosystem,
              enabling collaborations with brands like OPPO, Sony or DJI. It bridges UX and industrial design, while
              reinforcing our belief that responsible travel can inspire new ways of seeing, hearing and remembering.
            </p>
          </div>
        </div>
      </section>

      <nav className="we-band we-white we-next" aria-label="Next case file">
        <Link href={`/work/${next.slug}`}>
          Next Project<span className="sr-only">: {next.title}</span>
        </Link>
      </nav>
    </div>
  );
}
