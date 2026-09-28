import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";

// Brand fonts, read once. URLs relative to this file are traced into the deployment.
const [bodoni, bodoniItalic, hanken, plex] = await Promise.all([
  readFile(new URL("../../../assets/fonts/BodoniModa-96.ttf", import.meta.url)),
  readFile(new URL("../../../assets/fonts/BodoniModa-96-Italic.ttf", import.meta.url)),
  readFile(new URL("../../../assets/fonts/Hanken-400.ttf", import.meta.url)),
  readFile(new URL("../../../assets/fonts/PlexMono-400.ttf", import.meta.url)),
]);

/** Branded 1200×630 share image: /api/og?title=…&eyebrow=…&locale=sr|en&img=/images/… */
export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const title = (searchParams.get("title") ?? "Kota nekretnine").slice(0, 110);
  const eyebrow = (searchParams.get("eyebrow") ?? "Novi Sad").slice(0, 50);
  const sr = searchParams.get("locale") !== "en";
  const img = searchParams.get("img");
  let photo: ArrayBuffer | null = null;
  if (img && /^\/images\/[\w\-/]+\.jpg$/.test(img)) {
    try {
      const res = await fetch(new URL(img, origin));
      if (res.ok) photo = await res.arrayBuffer();
    } catch {}
  }
  const size = title.length > 64 ? 50 : title.length > 38 ? 62 : 76;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", backgroundColor: "#13283b", fontFamily: "Hanken" }}>
        <div style={{ width: photo ? 700 : 1200, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <svg width="56" height="40" viewBox="0 0 40 28">
              <path d="M7 4h22L18 22Z" fill="none" stroke="#eee8df" strokeWidth="1.6" />
              <path d="M7 4h11v18Z" fill="#b8915a" />
              <path d="M0 22h40" stroke="#eee8df" strokeWidth="1.6" />
            </svg>
            <div style={{ display: "flex", fontFamily: "Bodoni", fontSize: 40, letterSpacing: 10, color: "#eee8df" }}>KOTA</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: "Plex", fontSize: 20, letterSpacing: 4, color: "#d2ad73", textTransform: "uppercase" }}>
              <svg width="18" height="14" viewBox="0 0 18 14">
                <path d="M1 1h16L9 13Z" fill="none" stroke="#d2ad73" strokeWidth="1.6" />
                <path d="M1 1h8v12Z" fill="#d2ad73" />
              </svg>
              {eyebrow}
            </div>
            <div style={{ display: "flex", fontFamily: "Bodoni", fontSize: size, lineHeight: 1.02, letterSpacing: -1.5, color: "#f8f5f0" }}>{title}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", color: "rgba(238,232,223,0.72)", fontSize: 22 }}>
            <div style={{ display: "flex", fontFamily: "BodoniItalic", fontSize: 30, color: "#eee8df" }}>
              {sr ? "Dom na pravoj visini." : "A home at the right level."}
            </div>
            <div style={{ display: "flex", fontFamily: "Plex", fontSize: 18 }}>Novi Sad</div>
          </div>
        </div>
        {photo && (
          <div style={{ width: 500, height: "100%", display: "flex", position: "relative" }}>
            {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
            <img src={photo as unknown as string} width={500} height={630} style={{ objectFit: "cover", width: 500, height: 630 }} />
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, backgroundColor: "#b8915a" }} />
          </div>
        )}
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Bodoni", data: bodoni, weight: 400, style: "normal" },
        { name: "BodoniItalic", data: bodoniItalic, weight: 400, style: "normal" },
        { name: "Hanken", data: hanken, weight: 400, style: "normal" },
        { name: "Plex", data: plex, weight: 400, style: "normal" },
      ],
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=31536000, immutable" },
    },
  );
}
