# Kota nekretnine (Scale by Noon demo)

- Niche: Real estate agency         (matches www.scalebynoon.com industry id: real-estate)
- Market / city: RS – Novi Sad
- Languages: sr (Latin, at /) + en (at /en), localized slugs + hreflang
- Live URL: https://kota-nekretnine-demo.vercel.app
- Repo: https://github.com/dbs-media-demos/kota-nekretnine-demo (public, branch main)
- Folder: DBS Media Portfolio/Demo Websites/real-estate
- Stack: Next.js 16.3.6, React 19.2.8, Tailwind v4, GSAP 3 (ScrollTrigger, SplitText, Flip), Lenis
- Palette: #F8F5F0 Kreda, #EEE8DF Kamen, #D8CEBF Peščar, #B8915A Mesing (#7C5E2F brass text), #2E5470 Reka, #13283B Dunav
  Fonts: Source Serif 4 (display serif: static opsz-60 / weight-500 cut + italic, self-hosted, subset to Latin + Serbian Latin, ~23 KB each),
  Hanken Grotesk, IBM Plex Mono. Source Serif 4 replaced Bodoni Moda on 2026-10-07 because Bodoni's hairlines were too thin.
- Pages: 66 statically generated pages (33 per language) + 404, sitemap, robots, manifest, dynamic OG images.
  Početna/Home, Nekretnine/Listings (+17 listing pages), Kraj po kraj/Neighbourhoods (+6 guides), Procena/Valuation,
  Prodajte sa nama/Sell with us, O nama/About, Utisci/Reviews, Česta pitanja/FAQ, Kontakt/Contact, Privatnost/Privacy
- Signature features:
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
