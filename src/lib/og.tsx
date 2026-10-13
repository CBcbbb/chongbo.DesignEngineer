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

const asset = async (name: string) =>
  `data:image/png;base64,${(await fs.readFile(path.join(process.cwd(), "src/lib/og-assets", name))).toString("base64")}`;

type Share = {
  /** The home card: the eyebrow and the question over the machine. */
  headline?: { eyebrow: string; title: string };
  /** Case files and About: a sheet rising out of the top slot. */
  sheet?: { kicker: string; title: string; line: string };
};

/**
 * The share image: the studio photograph, the printer at the foot with my name on its display, and either the home
 * question or a sheet rising from its slot. Composed from the site's own type, so it stays sharp and every case file
 * gets one automatically. Satori draws it: flex layout, absolute positions, no masks.
 */
export async function shareImage({ headline, sheet }: Share) {
  const [studio, printer] = await Promise.all([asset("studio.png"), asset("printer.png")]);
  const mw = 912;
  const mh = 274;
  const ml = (1200 - mw) / 2;
  const mt = 630 + 18 - mh;
  const muted = "#5B5853";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", fontFamily: "Geist", color: "#1C1B19", background: "#E9E7E2" }}>
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img src={studio} width={1200} height={630} style={{ position: "absolute", left: 0, top: 0 }} />
        <div style={{ position: "absolute", left: 36, top: 30, display: "flex", fontFamily: "Geist Mono", fontSize: 18, letterSpacing: 2.5, color: muted }}>
          CHONGBO NING · DESIGN ENGINEER · LONDON
        </div>
        {headline && (
          <div style={{ position: "absolute", left: 0, right: 0, top: 92, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ display: "flex", fontFamily: "Geist Mono", fontSize: 20, letterSpacing: 5, color: muted }}>{headline.eyebrow.toUpperCase()}</div>
            <div style={{ display: "flex", marginTop: 12, fontSize: 72, fontWeight: 600, letterSpacing: -3 }}>{headline.title}</div>
          </div>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img src={printer} width={mw} height={mh} style={{ position: "absolute", left: ml, top: mt }} />
        <div
          style={{
            position: "absolute",
            left: ml + mw * 0.0655 + 18,
            top: mt + mh * 0.311,
            height: mh * 0.244,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            fontFamily: "Geist Mono",
            fontSize: 18,
            letterSpacing: 2,
            color: "#B9F5D2",
          }}
        >
          <span style={{ display: "flex", textShadow: "0 0 6px rgba(110,235,170,0.6)" }}>CHONGBO NING</span>
          <span style={{ display: "flex", marginTop: 4, color: "rgba(185,245,210,0.7)" }}>DESIGN ENGINEER</span>
        </div>
        {sheet && (
          <div
            style={{
              position: "absolute",
              left: ml + mw * 0.107,
              width: mw * 0.786,
              top: 96,
              height: mt + mh * 0.076 - 96,
              display: "flex",
              flexDirection: "column",
              padding: "30px 36px",
              background: "#FBFAF7",
              boxShadow: "0 14px 30px -18px rgba(0,0,0,0.35)",
            }}
          >
            <div style={{ display: "flex", fontFamily: "Geist Mono", fontSize: 18, letterSpacing: 2.5, color: "#5E5B55" }}>{sheet.kicker.toUpperCase()}</div>
            <div style={{ display: "flex", marginTop: 14, fontSize: 50, fontWeight: 600, letterSpacing: -1.8, lineHeight: 1.04 }}>{sheet.title}</div>
            <div style={{ display: "flex", marginTop: 12, fontSize: 24, fontWeight: 500, lineHeight: 1.35, color: "#38352F" }}>{sheet.line}</div>
          </div>
        )}
      </div>
    ),
    { ...OG_SIZE, fonts: await fonts() },
  );
}
