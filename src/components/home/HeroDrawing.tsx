import { getImageProps } from "next/image";
import { kota } from "@/lib/format";
import { HeroDrawingMotion } from "./HeroDrawingMotion";

/*
 * The /v2 hero's centrepiece: the same five-level building as the 3D model, as an architect's
 * elevation drawing in SVG and CSS (no WebGL, no three.js). The lines draw themselves, a brass lift
 * rides ±0.00 → +12.40 and switches each floor's lights on as it passes; the +9.60 floor opens onto
 * the real flat for sale. Scrolling separates the floors, the cursor leans the sheet.
 *
 * Desktop only (`desk:`); phones keep the still and first screen they get on `/`. The drawing goes
 * out as one HTML string, so a phone (where it's display: none) never builds or hydrates its few
 * hundred nodes: that cost about 40 ms of blocking time at 4x CPU as JSX.
 */

const S = 34; // drawing units per metre
const G = 596; // ±0.00
const T = 9; // slab thickness
const ROOF = 15.4;
const X0 = 100; // body, left face
const X1 = 430; // body, right face
const PH = 336; // penthouse, right face (the terrace runs on to X1)
const SH0 = 58; // lift shaft
const SH1 = 96;
const CAB = 2.4 * S; // lift cabin height
const LIFT_AT = 0.5; // the lift leaves at
const LIFT_FOR = 2.7; // and reaches the top after
const INK = "#5b3e22";
const KAMEN = "#eee8df";
const BRASS = "#b8915a";
const BRASS_LIGHT = "#d2ad73";

const y = (k: number) => G - k * S;
const r1 = (n: number) => String(Math.round(n * 10) / 10);

type Attrs = Record<string, string | number | undefined>;
const esc = (v: string) => v.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
/** One SVG element as a string; numbers are rounded to 0.1 unit. */
function h(tag: string, attrs: Attrs, ...children: string[]) {
  const a = Object.entries(attrs)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => ` ${k}="${esc(typeof v === "number" ? r1(v) : String(v))}"`)
    .join("");
  // HTML inside foreignObject (the div) can't self-close
  return children.length || tag === "div" ? `<${tag}${a}>${children.join("")}</${tag}>` : `<${tag}${a}/>`;
}
const at = (s: number) => `--d:${s.toFixed(2)}s`;

type Room = { i: number; k: number; top: number; floor: number; left: number; right: number; lit: number };

const pendant = (x: number, top: number) =>
  h("circle", { cx: x, cy: top + 30, r: 34, fill: "url(#dr-lamp)" }) +
  h("line", { x1: x, y1: top, x2: x, y2: top + 22, stroke: INK, "stroke-width": 0.8 }) +
  h("path", { d: `M${r1(x - 7)} ${r1(top + 30)} Q${r1(x)} ${r1(top + 19)} ${r1(x + 7)} ${r1(top + 30)} Z`, fill: INK });

const plant = (x: number, floor: number) =>
  h(
    "g",
    { fill: INK },
    h("path", { d: `M${r1(x - 6)} ${r1(floor)} l2 -12 h8 l2 12 z` }),
    h("ellipse", { cx: x - 5, cy: floor - 22, rx: 4, ry: 10, transform: `rotate(-24 ${r1(x - 5)} ${r1(floor - 22)})` }),
    h("ellipse", { cx: x + 5, cy: floor - 24, rx: 4, ry: 11, transform: `rotate(20 ${r1(x + 5)} ${r1(floor - 24)})` }),
    h("ellipse", { cx: x, cy: floor - 29, rx: 3.5, ry: 11 }),
  );

/** A 1.75 m scale figure, the way an architect draws one. */
function person(x: number, floor: number, flip = false) {
  const t = 1.75 * S;
  const top = floor - t + 13;
  return h(
    "g",
    { fill: INK, transform: flip ? `translate(${r1(2 * x)} 0) scale(-1 1)` : undefined },
    h("circle", { cx: x, cy: floor - t + 5, r: 5 }),
    h("path", { d: `M${r1(x - 7)} ${r1(top)} h14 l2 26 h-4 l-1 ${r1(t - 41)} h-4 l-1 -${r1(t - 47)} l-1 ${r1(t - 47)} h-4 l-1 -${r1(t - 41)} h-4 z` }),
  );
}

/** What a passer-by sees through each lit floor: furniture as silhouettes, lamps glowing. */
function interior(r: Room) {
  const { top, floor, left, right } = r;
  const w = right - left;
  const x = (f: number) => left + w * f;
  let s = "";
  if (r.i === 0) {
    // lobby: reception, a plant, a visitor
    s = pendant(x(0.3), top) + pendant(x(0.62), top) + h("rect", { x: x(0.48), y: floor - 26, width: 58, height: 26, fill: INK }) + plant(x(0.88), floor) + person(x(0.22), floor);
  } else if (r.i === 1) {
    // living room: sofa, floor lamp, a picture on the back wall
    s =
      h("circle", { cx: x(0.2), cy: floor - 58, r: 36, fill: "url(#dr-lamp)" }) +
      h("path", { d: `M${r1(x(0.2))} ${r1(floor)} v-56 M${r1(x(0.2) - 9)} ${r1(floor - 56)} l4 -10 h10 l4 10 z`, stroke: INK, "stroke-width": 1.2, fill: INK }) +
      h("path", { d: `M${r1(x(0.27))} ${r1(floor)} v-24 h7 v10 h66 v-10 h7 v24 z`, fill: INK }) +
      h("rect", { x: x(0.55), y: top + 22, width: 44, height: 30, fill: "none", stroke: INK, "stroke-width": 1.4 }) +
      h("path", { d: `M${r1(x(0.58))} ${r1(floor - 16)} h36 M${r1(x(0.6))} ${r1(floor - 16)} v16 M${r1(x(0.58) + 32)} ${r1(floor - 16)} v16`, stroke: INK, "stroke-width": 2 }) +
      plant(x(0.9), floor);
  } else if (r.i === 2) {
    // dining: a long table under three pendants, a bookcase
    s =
      pendant(x(0.36), top) +
      pendant(x(0.46), top) +
      pendant(x(0.56), top) +
      h("path", { d: `M${r1(x(0.3))} ${r1(floor - 26)} h${r1(w * 0.32)} M${r1(x(0.32))} ${r1(floor - 26)} v26 M${r1(x(0.6))} ${r1(floor - 26)} v26`, stroke: INK, "stroke-width": 2.4 }) +
      h("path", { d: `M${r1(x(0.27))} ${r1(floor)} v-34 M${r1(x(0.27))} ${r1(floor - 16)} h8 v16 M${r1(x(0.66))} ${r1(floor)} v-34 M${r1(x(0.66))} ${r1(floor - 16)} h-8 v16`, stroke: INK, "stroke-width": 1.8, fill: "none" }) +
      h(
        "g",
        { stroke: INK, "stroke-width": 1.4, fill: "none" },
        h("rect", { x: x(0.8), y: floor - 72, width: 40, height: 72 }),
        h("path", { d: `M${r1(x(0.8))} ${r1(floor - 54)} h40 M${r1(x(0.8))} ${r1(floor - 36)} h40 M${r1(x(0.8))} ${r1(floor - 18)} h40` }),
      ) +
      person(x(0.12), floor, true);
  } else {
    // upper floors: an armchair, a reading lamp, a sculpture on a plinth
    s =
      pendant(x(0.62), top) +
      h("circle", { cx: x(0.18), cy: floor - 52, r: 30, fill: "url(#dr-lamp)" }) +
      h("path", { d: `M${r1(x(0.18))} ${r1(floor)} v-50 q0 -8 10 -8`, stroke: INK, "stroke-width": 1.4, fill: "none" }) +
      h("path", { d: `M${r1(x(0.24))} ${r1(floor)} v-30 q0 -6 6 -6 h4 v20 h26 v16 z`, fill: INK }) +
      h("rect", { x: x(0.78), y: floor - 26, width: 16, height: 26, fill: INK }) +
      h("ellipse", { cx: x(0.78) + 8, cy: floor - 36, rx: 7, ry: 10, fill: INK });
  }
  return h("g", { opacity: 0.5 }, s);
}

/**
 * Each floor is its own full-size SVG on its own GPU layer, so separating them on scroll moves
 * layers and repaints nothing (one SVG with moving groups repainted every frame: 25 ms at 4x CPU).
 */
const layer = (content: string, i?: number) =>
  `<div class="dr-layer"${i === undefined ? "" : ` data-dr-i="${i}"`}>` +
  h("svg", { viewBox: "0 0 640 640", "aria-hidden": "true", focusable: "false" }, content) +
  "</div>";

const draw = (attrs: Attrs, d: number) => h("line", { ...attrs, pathLength: 1, class: "dr-draw", style: at(d) });

function drawingSvg({ levels, names, featured, photoUrl, href }: { levels: number[]; names: string[]; featured: number; photoUrl: string; href: string }) {
  const topK = levels[levels.length - 1];
  // The lift reaches each level at a time proportional to its height; the floor lights as it does.
  const arrive = (k: number) => LIFT_AT + (LIFT_FOR * k) / topK;
  const rooms: Room[] = levels.map((k, i) => {
    const last = i === levels.length - 1;
    return { i, k, top: y(last ? ROOF : levels[i + 1]) + T, floor: y(k), left: X0 + 4, right: (last ? PH : X1) - 4, lit: Math.max(0.3, arrive(k) - 0.08) };
  });
  const box = (r: Room, extra: Attrs) => h("rect", { x: r.left, y: r.top, width: r.right - r.left, height: r.floor - r.top, ...extra });
  const stop = (offset: number, color: string, opacity?: number) => h("stop", { offset, "stop-color": color, "stop-opacity": opacity });

  const defs = h(
    "defs",
    {},
    h("linearGradient", { id: "dr-night", x1: 0, y1: 0, x2: 0, y2: 1 }, stop(0, "#1d3a55"), stop(1, "#10243a")),
    h("linearGradient", { id: "dr-warm", x1: 0, y1: 0, x2: 0, y2: 1 }, stop(0, "#f6e6c4"), stop(0.45, "#e6c38e"), stop(1, "#a8773f")),
    h("linearGradient", { id: "dr-shade", x1: 0, y1: 0, x2: 0, y2: 1 }, stop(0, "#0d1d2b", 0.55), stop(1, "#0d1d2b", 0)),
    h("radialGradient", { id: "dr-lamp" }, stop(0, "#fff6df", 0.95), stop(0.35, "#ffe7b8", 0.45), stop(1, "#ffe7b8", 0)),
    h("radialGradient", { id: "dr-pool" }, stop(0, "#e9bf7c", 0.4), stop(1, "#e9bf7c", 0)),
    h("radialGradient", { id: "dr-spill" }, stop(0, "#d9a866", 0.22), stop(1, "#d9a866", 0)),
    h("linearGradient", { id: "dr-sheen-g", x1: 0, y1: 0, x2: 1, y2: 0 }, stop(0, "#fff", 0), stop(0.5, "#fff", 0.2), stop(1, "#fff", 0)),
    h("linearGradient", { id: "dr-cabin", x1: 0, y1: 0, x2: 0, y2: 1 }, stop(0, "#f0d29c", 0.95), stop(1, BRASS, 0.75)),
    h("linearGradient", { id: "dr-fade-x", x1: 0, y1: 0, x2: 1, y2: 0 }, stop(0, "#fff", 0), stop(0.25, "#fff"), stop(0.75, "#fff"), stop(1, "#fff", 0)),
    h("mask", { id: "dr-earth-mask" }, h("rect", { x: 0, y: G + 10, width: X1 + 22, height: 40, fill: "url(#dr-fade-x)" })),
    h(
      "pattern",
      { id: "dr-hatch", width: 7, height: 7, patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" },
      h("line", { x1: 0, y1: 0, x2: 0, y2: 7, stroke: KAMEN, "stroke-opacity": 0.22, "stroke-width": 1 }),
    ),
  );

  // Ground: the ±0.00 line, earth hatch, a tree, light pooling at the door
  const ground =
    h("rect", { x: 0, y: G + 10, width: X1 + 22, height: 34, fill: "url(#dr-hatch)", mask: "url(#dr-earth-mask)", class: "dr-in", style: at(0.5) }) +
    draw({ x1: 0, y1: G + 10, x2: X1 + 22, y2: G + 10, stroke: KAMEN, "stroke-opacity": 0.6, "stroke-width": 1.2 }, 0) +
    h("ellipse", { cx: 250, cy: G + 10, rx: 230, ry: 18, fill: "url(#dr-pool)", class: "dr-lit", style: at(rooms[0].lit) }) +
    h(
      "g",
      { class: "dr-in", stroke: KAMEN, "stroke-opacity": 0.45, fill: "none", "stroke-width": 1, style: at(0.9) },
      h("circle", { cx: 26, cy: G - 66, r: 24 }),
      h("circle", { cx: 20, cy: G - 72, r: 13, "stroke-opacity": 0.25 }),
      h("path", { d: `M26 ${G + 10} V${G - 52} M26 ${G - 40} l-9 -12 M26 ${G - 46} l8 -10` }),
    );

  const floors = levels
    .map((k, i) => {
      const r = rooms[i];
      const last = i === levels.length - 1;
      const feat = i === featured;
      const panes = Math.max(3, Math.round((r.right - r.left) / 54));
      const step = (r.right - r.left) / panes;
      const shaftTop = last ? y(ROOF) : y(levels[i + 1]);
      const foot = r.floor + (i === 0 ? 10 : 0);
      const tagColor = feat ? BRASS_LIGHT : KAMEN;

      let s =
        // glass, dark until the lift gets here
        box(r, { fill: "url(#dr-night)", class: "dr-in", style: at(0.25 + i * 0.08) }) +
        // light spilling out into the dusk
        h("ellipse", { cx: (r.left + r.right) / 2, cy: (r.top + r.floor) / 2, rx: (r.right - r.left) * 0.78, ry: (r.floor - r.top) * 0.95, fill: "url(#dr-spill)", class: "dr-lit", style: at(r.lit) }) +
        h(
          "g",
          { class: "dr-lit", style: at(r.lit) },
          feat
            ? h(
                "foreignObject",
                { x: r.left, y: r.top, width: r.right - r.left, height: r.floor - r.top },
                h("div", { xmlns: "http://www.w3.org/1999/xhtml", class: "dr-photo", style: `background-image:url(${photoUrl})` }),
              )
            : box(r, { fill: "url(#dr-warm)", opacity: [0.95, 0.82, 0.9, 0.86, 0.94][i % 5] }) + interior(r),
        );
      // a lamp switched off and on again later: someone lives here
      if (!feat && i > 0)
        s += h("rect", { x: r.left + step * (i % 2 ? panes - 2 : 1), y: r.top, width: step, height: r.floor - r.top, fill: "#13283b", class: "dr-life", style: `animation-delay:${5 + i * 3.3}s` });
      // shade under the slab above, mullions, the faces
      s +=
        h("rect", { x: r.left, y: r.top, width: r.right - r.left, height: 12, fill: "url(#dr-shade)" }) +
        h(
          "g",
          { stroke: KAMEN, "stroke-opacity": feat ? 0.55 : 0.32, "stroke-width": 1 },
          Array.from({ length: panes - 1 }, (_, p) => draw({ x1: r.left + step * (p + 1), y1: r.top, x2: r.left + step * (p + 1), y2: r.floor }, 0.2 + i * 0.1 + p * 0.04)).join(""),
          draw({ x1: r.left, y1: r.floor - 40, x2: r.right, y2: r.floor - 40, "stroke-opacity": 0.14 }, 0.5 + i * 0.1),
        ) +
        h(
          "g",
          { stroke: KAMEN, "stroke-opacity": 0.85, "stroke-width": 1.4 },
          draw({ x1: X0, y1: r.floor, x2: X0, y2: r.top - T }, 0.1 + i * 0.12),
          draw({ x1: r.right + 4, y1: r.floor, x2: r.right + 4, y2: r.top - T }, 0.1 + i * 0.12),
        ) +
        // floor slab; the flat for sale has a brass fascia
        h("rect", { x: X0 - 8, y: r.floor, width: X1 - X0 + 16, height: i === 0 ? 10 : T, fill: feat ? BRASS : KAMEN, "fill-opacity": feat ? 1 : 0.88, class: "dr-in", style: at(0.2 + i * 0.12) });
      if (last)
        // roof, and the terrace with its glass rail and a tree in a planter
        s +=
          h("rect", { x: X0 - 8, y: y(ROOF), width: PH - X0 + 16, height: T, fill: KAMEN, "fill-opacity": 0.88, class: "dr-in", style: at(0.75) }) +
          h(
            "g",
            { class: "dr-in", style: at(0.85) },
            h("rect", { x: PH + 4, y: r.floor - 30, width: X1 + 8 - PH - 4, height: 30, fill: KAMEN, "fill-opacity": 0.07, stroke: KAMEN, "stroke-opacity": 0.45, "stroke-width": 1 }),
            h("rect", { x: X1 - 34, y: r.floor - 16, width: 26, height: 16, fill: KAMEN, "fill-opacity": 0.5 }),
            h(
              "g",
              { stroke: KAMEN, "stroke-opacity": 0.55, fill: "none", "stroke-width": 1 },
              h("circle", { cx: X1 - 21, cy: r.floor - 52, r: 22 }),
              h("circle", { cx: X1 - 27, cy: r.floor - 58, r: 11, "stroke-opacity": 0.3 }),
              h("path", { d: `M${X1 - 21} ${r1(r.floor - 16)} V${r1(r.floor - 40)} l-7 -9 M${X1 - 21} ${r1(r.floor - 34)} l7 -8` }),
            ),
          );
      // one storey of the lift shaft
      s += h(
        "g",
        { stroke: BRASS, "stroke-opacity": 0.7, "stroke-width": 1.2 },
        h("rect", { x: SH0, y: shaftTop, width: SH1 - SH0, height: foot - shaftTop, fill: BRASS, "fill-opacity": 0.06, stroke: "none", class: "dr-in", style: at(0.4) }),
        draw({ x1: SH0, y1: foot, x2: SH0, y2: shaftTop }, 0.15 + i * 0.1),
        draw({ x1: SH1, y1: foot, x2: SH1, y2: shaftTop }, 0.15 + i * 0.1),
        draw({ x1: SH0, y1: r.floor, x2: SH1, y2: r.floor, "stroke-opacity": 0.45 }, 0.3 + i * 0.1),
        last ? draw({ x1: SH0 - 3, y1: shaftTop, x2: SH1 + 3, y2: shaftTop }, 0.7) : "",
      );
      // its elevation, as on the 3D model
      s += h(
        "g",
        { class: "dr-in", style: at(Math.max(0.6, r.lit)) },
        h("line", { x1: X1 + 14, y1: r.floor, x2: X1 + 30, y2: r.floor, stroke: tagColor, "stroke-opacity": 0.7 }),
        h("path", { d: `M${X1 + 36} ${r1(r.floor - 7)} h12 l-6 9 z`, fill: "none", stroke: tagColor, "stroke-width": 1.1 }),
        h("text", { x: X1 + 54, y: r.floor + 1, class: "dr-tag", fill: tagColor, "fill-opacity": feat ? 1 : 0.8 }, esc(`${kota(k)} · ${names[i]}`.toUpperCase())),
      );

      // a light passing over the glass now and then
      s +=
        h("clipPath", { id: `dr-glass-${i}` }, box(r, {})) +
        h("g", { "clip-path": `url(#dr-glass-${i})` }, h("rect", { x: 0, y: 0, width: 220, height: 640, fill: "url(#dr-sheen-g)", class: "dr-sheen" }));

      // The flat for sale is a link to its listing, like the card beside it
      return layer(feat ? h("a", { href, tabindex: -1, class: "dr-feat" }, s) : s, i);
    })
    .join("");

  // the lift cabin, riding with the top floor once it's up
  const cabin = layer(
    h(
      "g",
      { class: "dr-lift", "data-dr-lift": "" },
      h("rect", { x: SH0 + 3, y: G - CAB, width: SH1 - SH0 - 6, height: CAB, fill: "url(#dr-cabin)", stroke: BRASS_LIGHT, "stroke-width": 1.2 }),
      h("circle", { cx: (SH0 + SH1) / 2, cy: G - CAB + 10, r: 22, fill: "url(#dr-lamp)" }),
    ),
    levels.length - 1,
  );

  const lift = levels.map((k) => `${((k / topK) * 100).toFixed(2)}%{transform:translateY(${r1(-k * S)}px)}`).join("");
  // the ground layer holds the shared gradients; it's never display: none on a desktop, so the others can use them
  return `<style>@keyframes dr-lift{0%{transform:translateY(0)}${lift}}</style>` + layer(defs + ground) + floors + cabin;
}

export function HeroDrawing({
  levels,
  names,
  featured,
  photo,
  href,
}: {
  levels: number[];
  names: string[];
  featured: number;
  /** a photo of the featured flat (public path), seen through its floor's glass */
  photo: string;
  href: string;
}) {
  const {
    props: { src: photoUrl },
  } = getImageProps({ src: photo, alt: "", width: 320, height: 213, quality: 75 });

  return (
    <>
      {/* The sheet behind: dusk light at the foot of the building and a drawing grid */}
      <div data-dr-sky className="dr-sky pointer-events-none absolute inset-0 hidden desk:block" aria-hidden="true">
        <div className="dr-grid dr-lean-back absolute -inset-6" />
      </div>
      <div
        data-dr
        className="dr pointer-events-none absolute bottom-[14rem] right-[var(--gutter)] hidden aspect-square desk:block"
        style={{ height: "min(calc(100% - var(--header-h) - 15rem), 44vw)" }}
      >
        <div className="dr-lean relative h-full w-full" dangerouslySetInnerHTML={{ __html: drawingSvg({ levels, names, featured, photoUrl, href }) }} />
        <HeroDrawingMotion />
      </div>
    </>
  );
}
