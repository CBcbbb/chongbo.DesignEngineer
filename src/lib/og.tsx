import fs from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const fontDir = path.join(process.cwd(), "node_modules/geist/dist/fonts");
async function fonts() {
  const [regular, semibold, bold, mono] = await Promise.all([
    fs.readFile(path.join(fontDir, "geist-sans/Geist-Medium.ttf")),
    fs.readFile(path.join(fontDir, "geist-sans/Geist-SemiBold.ttf")),
    fs.readFile(path.join(fontDir, "geist-sans/Geist-Bold.ttf")),
    fs.readFile(path.join(fontDir, "geist-mono/GeistMono-Medium.ttf")),
  ]);
  return [
    { name: "Geist", data: regular, weight: 500 as const, style: "normal" as const },
    { name: "Geist", data: semibold, weight: 600 as const, style: "normal" as const },
    { name: "Geist", data: bold, weight: 700 as const, style: "normal" as const },
    { name: "Geist Mono", data: mono, weight: 500 as const, style: "normal" as const },
  ];
}

/** Zig-zag torn edge as an SVG strip (Satori has no CSS masks). */
function TornEdge({ width }: { width: number }) {
  const tooth = 16;
  const n = Math.ceil(width / tooth);
  let d = `M0 0 H${width} V2`;
  for (let i = n; i > 0; i--) d += ` L${(i - 0.5) * tooth} 12 L${(i - 1) * tooth} 2`;
  d += " Z";
  return (
    <svg width={width} height={14} viewBox={`0 0 ${width} 14`} style={{ display: "flex" }}>
      <path d={d} fill="#FBFBF8" />
    </svg>
  );
}

type Ticket = { head: string; right: string; big: string; small?: string; title: string; line: string };

export async function ticketImage({ head, right, big, small, title, line }: Ticket) {
  const paperW = 760;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "radial-gradient(120% 90% at 50% 10%, #F7F7F4 0%, #ECECE8 65%)",
          fontFamily: "Geist",
          color: "#1A1A18",
        }}
      >
        {/* machine */}
        <div
          style={{
            marginTop: 0,
            width: 920,
            height: 92,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: 14,
            borderRadius: "0 0 26px 26px",
            background: "linear-gradient(180deg, #D63A2A 0%, #A92B1C 100%)",
            boxShadow: "0 30px 50px -20px rgba(110,25,15,0.55)",
          }}
        >
          <div style={{ width: 840, height: 14, borderRadius: 8, background: "#2A0E09", display: "flex" }} />
        </div>
        {/* ticket */}
        <div style={{ display: "flex", flexDirection: "column", width: paperW, marginTop: -6 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              background: "#FBFBF8",
              padding: "34px 44px 30px",
              backgroundImage: "linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0) 30px)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontFamily: "Geist Mono",
                fontSize: 18,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                color: "#5C5C57",
              }}
            >
              <span>{head}</span>
              <span
                style={{
                  color: "#C2311F",
                  border: "2px solid #C2311F",
                  padding: "4px 10px",
                  borderRadius: 4,
                  transform: "rotate(-4deg)",
                  letterSpacing: 3,
                }}
              >
                {right}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginTop: 14 }}>
              <span style={{ fontSize: 104, fontWeight: 700, letterSpacing: -5, lineHeight: 1 }}>{big}</span>
              {small && (
                <span style={{ fontFamily: "Geist Mono", fontSize: 20, letterSpacing: 1.5, textTransform: "uppercase", color: "#5C5C57" }}>
                  {small}
                </span>
              )}
            </div>
            <div style={{ display: "flex", fontSize: 46, fontWeight: 600, letterSpacing: -1.5, lineHeight: 1.1, marginTop: 14 }}>{title}</div>
            <div style={{ display: "flex", fontSize: 26, fontWeight: 500, lineHeight: 1.35, color: "#33332F", marginTop: 12 }}>{line}</div>
          </div>
          <TornEdge width={paperW} />
        </div>
        <div
          style={{
            marginTop: "auto",
            marginBottom: 34,
            width: 1056,
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "Geist Mono",
            fontSize: 18,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            color: "#5C5C57",
          }}
        >
          <span>Chongbo Ning · Design Engineer · London</span>
          <span>Ask, and a ticket prints</span>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: await fonts() },
  );
}

/** The home card: the headline beside the projector, a card standing in its magazine. */
export async function projectorImage({ title, line, card }: { title: string; line: string; card: string }) {
  const png = await fs.readFile(path.join(process.cwd(), "src/lib/og-projector.png"));
  const src = `data:image/png;base64,${png.toString("base64")}`;
  const w = 640;
  const h = Math.round((w * 390) / 760);
  const k = w / 1488; // the photograph's scale (public/projector/machine.webp is 1488 wide)
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 64px 0 76px",
          background: "radial-gradient(90% 80% at 30% 20%, #F8F5EF 0%, #EFEAE1 75%)",
          fontFamily: "Geist",
          color: "#1C1B19",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", width: 440 }}>
          <div style={{ display: "flex", fontSize: 62, fontWeight: 600, letterSpacing: -2.6, lineHeight: 1 }}>{title}</div>
          <div style={{ display: "flex", marginTop: 26, fontSize: 24, lineHeight: 1.4, color: "#5B5853" }}>{line}</div>
          <div style={{ display: "flex", marginTop: 40, fontFamily: "Geist Mono", fontSize: 15, letterSpacing: 1.2, color: "#5B5853" }}>
            CHONGBO NING · DESIGN ENGINEER · LONDON
          </div>
        </div>
        <div style={{ display: "flex", position: "relative", width: w, height: h, marginTop: 40 }}>
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
          <img src={src} width={w} height={h} style={{ position: "absolute", left: 0, top: 0 }} />
          {/* the card's question, printed on the part that stands out of the magazine */}
          <div
            style={{
              position: "absolute",
              left: 0.2124 * 1488 * k + 12,
              top: (231 - 105) * k + 9,
              width: 0.2655 * 1488 * k - 30,
              display: "flex",
              fontSize: 11.5,
              fontWeight: 500,
              color: "#1C1B19",
            }}
          >
            {card}
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: await fonts() },
  );
}
