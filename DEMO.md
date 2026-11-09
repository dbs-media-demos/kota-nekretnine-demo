# Kota nekretnine (Scale by Noon demo)

- Niche: Real estate agency         (matches www.scalebynoon.com industry id: real-estate)
- Market / city: RS – Novi Sad
- Languages: sr (Latin, at /) + en (at /en), localized slugs + hreflang
- Live URL: https://kota-nekretnine-demo.vercel.app
- Repo: https://github.com/dbs-media-demos/kota-nekretnine-demo (public, branch main)
- Folder: DBS Media Portfolio/Demo Websites/real-estate
- Stack: Next.js 16.3.6, React 19.2.8, Tailwind v4, GSAP 3 (ScrollTrigger, SplitText, Flip), Lenis, three.js r187 (desktop hero only)
- Palette: #F8F5F0 Kreda, #EEE8DF Kamen, #D8CEBF Peščar, #B8915A Mesing (#7C5E2F brass text), #2E5470 Reka, #13283B Dunav
  Fonts: Source Serif 4 (display serif: static opsz-60 / weight-500 cut + italic, self-hosted, subset to Latin + Serbian Latin, ~23 KB each),
  Hanken Grotesk, IBM Plex Mono. Source Serif 4 replaced Bodoni Moda on 2026-10-07 because Bodoni's hairlines were too thin.
- Pages: 66 statically generated pages (33 per language) + 404, sitemap, robots, manifest, dynamic OG images.
  Početna/Home, Nekretnine/Listings (+17 listing pages), Kraj po kraj/Neighbourhoods (+6 guides), Procena/Valuation,
  Prodajte sa nama/Sell with us, O nama/About, Utisci/Reviews, Česta pitanja/FAQ, Kontakt/Contact, Privatnost/Privacy
- Signature features:
  - 3D hero (desktop): an architect's model of a five-level building on a walnut model board, cut open at the front. A brass glass lift rides
    ±0.00 → +12.40 in the first seconds and switches each floor's lights on; the +9.60 floor (brass fascia, warmest light) is the featured
    listing in the card beside it (l08, 3rd floor = 3 × 3.20). Scrolling separates the floors into an exploded section, each slab carrying
    its elevation as real text; the cursor leans the camera
  - "Elevator" home scene: a sticky shaft swaps rooms with rising clip reveals while the ▽ elevation readout counts ±0.00 → +12.40
  - Listings search: sale/rent, type, neighbourhood, EUR range slider, m², rooms (0.5–4.0), terasa/parking/lift/uknjiženo;
    URL-synced filters, GSAP Flip result transitions, grid/list/map views with a hand-drawn SVG map of Novi Sad whose ▽ pins sync with hovered cards
  - Listing pages: card → gallery ViewTransition morph, full-screen swipe/keyboard lightbox, self-drawing floor plan with dimension lines,
    neighbourhood panel with walk times, EUR mortgage calculator with animated monthly payment, "Zakaži razgledanje" day/slot booking
  - Neighbourhood guides: scroll stories with parallax chapters, "life here" counters, drifting three-column gallery, zoomed map + listings
  - "Koliko vredi vaš stan?" five-step valuation funnel with a live animated estimate range, city scale and adjustment breakdown
  - Brand system: architect's level mark ▽ as logo, pins, cursor, menu numbering and section labels; kota-numbered full-screen menu
- Lighthouse (mobile, home, live): P 85 / A 100 / BP 100 / SEO 100*
  (*69 on the live demo only because it is deliberately noindexed; 100 with NEXT_PUBLIC_NOINDEX=false.)
  Other mobile pages: listings 88, listing detail 86, neighbourhood guide 86. Desktop home: 100 / 100 / 100. CLS 0.

## Phone pass (7 Nov 2026)
- Below 768 px or on touch (the `phone:` CSS variant, `lib/phone.ts`): own hero crop and first screen (service + town, agent, rating, call button with the number, search), bar Call + Text, order listings → experience + reviews → team → how we work → map/guides → valuation → contact (footer). Order is CSS only, desktop DOM is unchanged.
- GSAP and Lenis load only off phones (`lib/motion.ts`: `useDeskMotion`, `loadGsap`). Phones get `layout/PhoneMotion` (one fade-and-rise per section, self-drawing level lines). Links don't prefetch on phones (`ui/SiteLink`).
- Fonts on phones: `public/fonts/` only (Source Serif 500 + a Hanken subset, 40 KB); labels use the sans and accents stay upright. Desktop keeps Plex Mono and the italic.
- Map/price data lives in `content/hood-geo.ts`, so neighbourhood guide copy stays off the client.
- Load on phones: Chrome forces one layout as parsing ends, so what's off the first screen comes in on short timers (`.phone-later`, `--later-at`, `--later-h` in `globals.css`), initial load only. Below 768 px the hero's copy does too, top to bottom, so that first layout has no text (the first line set costs about 40 ms) and is under 50 ms at 4x CPU. Hold with `display: none` on children and `min-height` on the box: `content-visibility` reports a false CLS when it ends, and `!important` utilities beat animations. No Intl while hydrating on phones (the first call costs about 50 ms): `eur()` groups digits itself, counters get `text` from the server.

## 3D pass (9 Nov 2026)
- Why a building cutaway: the brand is the elevation mark, and a sectioned presentation model is what buyers see in a developer's sales
  office, so the 3D says "real estate, measured" at a glance. The second 3D idea from the audit (an extruded price map) was left out on
  purpose: the SVG map is already interactive, linked and fast, and one 3D idea per page reads stronger.
- `components/home/model3d/BuildingScene.ts`: built from primitives only (no model files, no licences), merged per material, PCF soft
  shadows from a low evening sun, RoomEnvironment reflections for brass and glass. Renders on demand and stops off screen.
- `components/home/HeroModel.tsx` + `lib/three-gate.ts`: three.js is imported only after load, inside the gate (≥1024 px, hover + fine
  pointer, no reduced motion, no Save-Data, WebGL2). The canvas fades in over a still rendered from the same scene, which stays as the
  fallback. Phones, tablets and reduced motion download zero bytes of three.js (checked on the production build).
- Stills: `public/images/3d/hero-model.jpg` (desktop/fallback, first frame, 2400×1200) and `hero-model-phone.jpg` (lights on, floors
  slightly apart, 1260×875). To re-render after changing the scene: set `window.__kotaStill = true` before load, then call
  `window.__kota3d.snapshot({ width, height, intro, explode, shift, zoom, lift })`; the phone still used
  `{ width: 1260, height: 875, intro: 9, explode: 0.25, shift: 0.2, zoom: 0.72, lift: 2.8 }`, the desktop one `{ width: 2400, height: 1200, intro: 0 }`.
- Phone, production build, 4x CPU + slow 4G at 375 px: first-load JS 163 KB compressed, three.js 0 bytes, LCP 0.9 s, TBT 99 ms, CLS 0,
  everything ≈ 460 KB. Same at 320 and 430 px, on /en and on a /for/ preview.

## Smooth 3D pass (9 Nov 2026)
- The hero scene no longer builds in one go when it starts. `createBuildingScene` is async: it builds in idle slices (environment,
  site, one floor each) behind the still, compiles every shader with `compileAsync` (the PMREM generator's own blur/GGX filters
  too, via a dry run in `warmEnvironment`), and draws hidden frames (one part of the model per slice, then one with shadows).
  The canvas fades in and the lift's intro starts only then (`start()`).
- `lib/three-gate.ts` `perfWatch`: a build slice averaging over 50 ms (a slow processor) stops the build and keeps the still;
  once on screen, the first 2 s must hold ≥ 45 fps, no frame over 100 ms and ≤ 3 ms of scene work per frame, or the canvas
  fades back to the still and the renderer is freed. Either way `sessionStorage["kota:3d"] = "still"` keeps stills for the visit.
  `failIfMajorPerformanceCaveat` plus a software-renderer check keep the still without a real GPU. Pixel ratio capped at 1.5;
  the loop runs only while the hero is on screen and the tab is visible.
- Measured on the production build, 1600×900, RTX 5070: at 1x the scene appears ≈ 0.8 s after load (≈ 1.1 s from navigation,
  same on /en and /for/) with no long task from the 3D (was one of 578 ms) and its first 2 s at full rate. At 4x CPU the build
  check keeps the still and scrolling stays at 180–217 fps, no frame over 25 ms (with the scene live it was 34 fps, frames to
  146 ms). Forcing 6x at the moment the scene appears: it faded back to the still 2.0 s later.

## Portfolio copy
EN title: Kota — boutique real estate in Novi Sad
EN one-liner (≤ 120 chars): A bilingual agency site where every home is measured: map search, floor plans, valuations and viewing booking.
EN summary (2–3 sentences): A concept site for a boutique Novi Sad agency, built around the architect's elevation mark (▽). Buyers search 17 listings on a hand-drawn city map, open photo-rich pages with measured floor plans, a mortgage calculator and one-tap viewing booking, while sellers get an instant valuation funnel. Serbian and English, fully animated, and still fast on a phone.
SR title: Kota — butik agencija za nekretnine u Novom Sadu
SR one-liner: Dvojezični sajt agencije gde je svaki stan izmeren: pretraga na mapi, osnove, procena i zakazivanje razgledanja.
SR summary: Koncept sajt za butik agenciju iz Novog Sada, izgrađen oko arhitektonske oznake kote (▽). Kupci pretražuju 17 nekretnina na ručno crtanoj mapi grada i otvaraju stranice sa fotografijama, izmerenom osnovom, kalkulatorom kredita i zakazivanjem razgledanja, a prodavci dobijaju procenu vrednosti u pet koraka. Na srpskom i engleskom, pun animacija, a i dalje brz na telefonu.

## Screenshots
handoff/desktop-home.png, handoff/desktop-feature.png (listings map view, card ↔ pin sync), handoff/mobile-home.png, handoff/scroll.mp4

## Notes
- Fictional business: phone +381 21 000 0000, registry "RPN 000 (demo)", address Ulica Modene 3. Forms validate and show success states but send nothing.
- Photos: Unsplash (licence + credits in public/images/SOURCES.md). Listing series are real room-by-room sets where possible.
- Dev: `npm run dev` (port 4180), `npm run build && npm start` (port 4180).
