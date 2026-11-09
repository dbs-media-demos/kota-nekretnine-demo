/**
 * The hero centrepiece: an architect's presentation model of a five-level Novi Sad building on a
 * model board, cut open at the front. A brass lift rises ±0.00 → +12.40 as the page settles and
 * lights each floor it passes; scrolling separates the floors into an exploded section, each slab
 * carrying its own elevation. Built from primitives only (no model files), rendered on demand.
 *
 * Desktop only: imported dynamically behind lib/three-gate, never from a static import.
 */
import {
  ACESFilmicToneMapping,
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
  Color,
  CylinderGeometry,
  DirectionalLight,
  Group,
  HemisphereLight,
  Material,
  Mesh,
  MeshStandardMaterial,
  PCFShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  PointLight,
  SRGBColorSpace,
  Scene,
  ShadowMaterial,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

export type LabelPos = { x: number; y: number; on: number };

export type BuildingScene = {
  setProgress(p: number): void;
  setPointer(x: number, y: number): void;
  setVisible(v: boolean): void;
  resize(): void;
  dispose(): void;
  /** Renders one frame at a given size and state and returns it as a data URL (stills for phones and the fallback). */
  snapshot(o: { width: number; height: number; intro: number; explode?: number; shift?: number; zoom?: number; lift?: number; turn?: number }): string;
};

type Opts = {
  /** Elevation of each level in metres, ground first: ±0.00 … +12.40 */
  levels: number[];
  /** The level of the featured listing: brass fascia, the warmest light */
  featured?: number;
  /** Fraction of the canvas width the model sits right of centre */
  shift?: number;
  onFirstFrame?: () => void;
  /** Screen positions of each level's elevation label, and the lift's elevation */
  onFrame?: (labels: LabelPos[], liftKota: number) => void;
};

/* ───────────────────────── palette (Kota tokens, as materials) ───────────────────────── */

const BG = new Color("#13283b");
const mat = {
  plaster: new MeshStandardMaterial({ color: "#efe9df", roughness: 0.82 }),
  slab: new MeshStandardMaterial({ color: "#e2d9cb", roughness: 0.78 }),
  oak: new MeshStandardMaterial({ color: "#d6c09f", roughness: 0.62 }),
  teak: new MeshStandardMaterial({ color: "#9c7650", roughness: 0.7 }),
  frame: new MeshStandardMaterial({ color: "#26323d", roughness: 0.45, metalness: 0.35 }),
  brass: new MeshStandardMaterial({ color: "#c09a62", roughness: 0.3, metalness: 1 }),
  soft: new MeshStandardMaterial({ color: "#f6f2ec", roughness: 0.95 }),
  textile: new MeshStandardMaterial({ color: "#9b8b79", roughness: 1 }),
  seam: new MeshStandardMaterial({ color: "#a98f6d", roughness: 0.7 }),
  boardTop: new MeshStandardMaterial({ color: "#d9cfbf", roughness: 0.92 }),
  paving: new MeshStandardMaterial({ color: "#e6ddcf", roughness: 0.9 }),
  street: new MeshStandardMaterial({ color: "#bfb3a1", roughness: 0.95 }),
  walnut: new MeshStandardMaterial({ color: "#4a3626", roughness: 0.55 }),
  tree: new MeshStandardMaterial({ color: "#f1ece4", roughness: 0.96 }),
  floor: new ShadowMaterial({ color: "#050d16", opacity: 0.5 }),
  railing: new MeshStandardMaterial({ color: "#9fb4c4", roughness: 0.05, metalness: 0.2, transparent: true, opacity: 0.22, depthWrite: false }),
};

/** Window glass per level, so each floor's windows can glow when its lights come on. */
const glassFor = () =>
  new MeshStandardMaterial({
    color: "#22394d",
    roughness: 0.06,
    metalness: 0.4,
    transparent: true,
    opacity: 0.58,
    depthWrite: false,
    emissive: new Color("#ffcf96"),
    emissiveIntensity: 0,
    envMapIntensity: 1.6,
  });

/* ───────────────────────── geometry helpers ───────────────────────── */

type Bucket = Map<Material, BufferGeometry[]>;

/** An axis-aligned block from two corners. Rounded edges catch the light like a cut model. */
function blk(b: Bucket, m: Material, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, round = 0) {
  const w = Math.abs(x1 - x0);
  const h = Math.abs(y1 - y0);
  const d = Math.abs(z1 - z0);
  if (w < 1e-3 || h < 1e-3 || d < 1e-3) return;
  let g: BufferGeometry = round > 0 ? new RoundedBoxGeometry(w, h, d, 2, Math.min(round, w / 2.1, h / 2.1, d / 2.1)) : new BoxGeometry(w, h, d);
  if (g.index) g = g.toNonIndexed();
  g.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
  const list = b.get(m) ?? [];
  list.push(g);
  b.set(m, list);
}

function flush(b: Bucket, parent: Group, shadows = true) {
  for (const [m, list] of b) {
    const merged = mergeGeometries(list, false);
    list.forEach((g) => g.dispose());
    if (!merged) continue;
    const mesh = new Mesh(merged, m);
    const see = (m as MeshStandardMaterial).transparent;
    mesh.castShadow = shadows && !see;
    mesh.receiveShadow = !see;
    if (see) mesh.renderOrder = 2;
    parent.add(mesh);
  }
  b.clear();
}

/**
 * A wall with a run of windows: piers, sills, heads and glass. `along` is the axis the wall runs on;
 * `at` the wall's centre line on the other axis.
 */
function facade(
  b: Bucket,
  along: "x" | "z",
  at: number,
  from: number,
  to: number,
  h: number,
  o: { bay: number; pier: number; sill: number; head: number; t?: number; wall?: Material; glass: Material },
) {
  const t = o.t ?? 0.24;
  const wall = o.wall ?? mat.plaster;
  const put = (m: Material, a0: number, a1: number, y0: number, y1: number, depth = t) =>
    along === "x" ? blk(b, m, a0, y0, at - depth / 2, a1, y1, at + depth / 2) : blk(b, m, at - depth / 2, y0, a0, at + depth / 2, y1, a1);
  const n = Math.max(1, Math.round((to - from) / o.bay));
  const bay = (to - from) / n;
  for (let i = 0; i < n; i++) {
    const a = from + i * bay;
    put(wall, a, a + o.pier, 0, h);
    const w0 = a + o.pier;
    const w1 = a + bay;
    if (o.sill > 0) put(wall, w0, w1, 0, o.sill);
    if (o.head > 0) put(wall, w0, w1, h - o.head, h);
    put(o.glass, w0, w1, o.sill, h - o.head, 0.04);
    // a slim frame line at the transom
    put(mat.frame, w0, w1, h - o.head - 0.05, h - o.head, 0.07);
  }
  put(wall, to - o.pier, to, 0, h);
}

/** A model tree: a foam ball on a stem, as architects make them. */
function tree(b: Bucket, x: number, z: number, r: number, y = 0) {
  const stem = new CylinderGeometry(0.07, 0.09, r * 1.3, 8).toNonIndexed();
  stem.translate(x, y + r * 0.65, z);
  const crown = new SphereGeometry(r, 24, 16).toNonIndexed();
  crown.translate(x, y + r * 1.3 + r * 0.8, z);
  for (const g of [stem, crown]) {
    g.deleteAttribute("uv");
    const list = b.get(mat.tree) ?? [];
    list.push(g);
    b.set(mat.tree, list);
  }
}

/** A pendant lamp: a dark cord and a bulb that lights with its floor. */
function pendant(b: Bucket, bulb: Material, x: number, z: number, ceiling: number, drop = 0.9) {
  blk(b, mat.frame, x - 0.012, ceiling - drop, z - 0.012, x + 0.012, ceiling, z + 0.012);
  const g = new SphereGeometry(0.15, 16, 10).toNonIndexed();
  g.deleteAttribute("uv");
  g.translate(x, ceiling - drop - 0.1, z);
  const list = b.get(bulb) ?? [];
  list.push(g);
  b.set(bulb, list);
}

/* ───────────────────────── the building ───────────────────────── */

const W0 = -9;
const W1 = 9;
const D0 = -6;
const D1 = 6;
const SLAB = 0.3;
const BALC = 1.5;

/** One flat, furnished in the model's white with oak and a few dark pieces; `m` mirrors it left/right. */
function flat(b: Bucket, cx: number, m: 1 | -1) {
  const X = (v: number) => cx + v * m;
  const box = (mm: Material, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, r = 0.03) =>
    blk(b, mm, Math.min(X(x0), X(x1)), y0, z0, Math.max(X(x0), X(x1)), y1, z1, r);
  // rooms: a wall between the living room and the back rooms (two doors), and one between kitchen and bedroom
  box(mat.plaster, -3.3, 0, -1.3, -0.7, 2.6, -1.16, 0);
  box(mat.plaster, 0.3, 0, -1.3, 1.9, 2.6, -1.16, 0);
  box(mat.plaster, 2.7, 0, -1.3, 3.3, 2.6, -1.16, 0);
  box(mat.plaster, 0.9, 0, D0 + 0.12, 1.04, 2.6, -1.3, 0);
  // kitchen: oak run and tall units on the back wall, a dark island
  box(mat.oak, -3.3, 0, -5.8, 0.8, 0.92, -5.15);
  box(mat.oak, -3.3, 0, -5.8, -2.3, 2.3, -5.15);
  box(mat.frame, -2.0, 0, -4.1, -0.3, 0.94, -3.45);
  for (const v of [-1.7, -1.15, -0.6]) box(mat.soft, v - 0.17, 0, -3.25, v + 0.17, 0.72, -2.95);
  // bedroom: bed with a throw, headboard, nightstand
  box(mat.oak, 1.3, 0, -5.82, 3.2, 1.05, -5.66);
  box(mat.soft, 1.4, 0, -5.66, 3.1, 0.48, -3.5);
  box(mat.textile, 1.4, 0.48, -4.4, 3.1, 0.54, -3.5);
  box(mat.oak, 3.15, 0, -5.6, 3.3, 0.5, -5.1, 0.02);
  // living: rug, L-sofa, coffee table, armchair, shelves, dining table, lamp, plant
  box(mat.textile, -2.4, 0.02, 0.5, 2.0, 0.04, 4.3, 0.01);
  box(mat.soft, -2.0, 0, 0.6, 1.4, 0.44, 1.5);
  box(mat.soft, -2.0, 0, 0.45, 1.4, 0.86, 0.75);
  box(mat.soft, 0.6, 0, 1.5, 1.4, 0.44, 3.1);
  box(mat.oak, -1.1, 0, 2.2, 0.1, 0.36, 3.1);
  box(mat.soft, -2.5, 0, 3.3, -1.6, 0.44, 4.2);
  box(mat.oak, 1.95, 0, -1.16, 2.65, 2.0, -0.8, 0.01);
  for (const y of [0.5, 1.0, 1.5]) box(mat.walnut, 1.98, y, -1.12, 2.62, y + 0.25, -0.84, 0.01);
  box(mat.oak, 2.2, 0.72, 1.0, 3.2, 0.78, 3.0);
  for (const z of [1.25, 2.35]) {
    box(mat.soft, 1.75, 0, z, 2.1, 0.8, z + 0.38, 0.02);
    box(mat.soft, 3.3, 0, z, 3.65, 0.8, z + 0.38, 0.02);
  }
  box(mat.frame, -2.95, 0, 0.62, -2.88, 1.55, 0.69, 0);
  box(mat.soft, -3.1, 1.5, 0.47, -2.72, 1.66, 0.85, 0.05);
  box(mat.walnut, 2.9, 0, 4.4, 3.35, 0.45, 4.85, 0.03);
  tree(b, X(3.12), 4.62, 0.36, 0.45);
}

/** The stair core: a white block at the back of each floor. */
function core(b: Bucket, h: number) {
  blk(b, mat.plaster, -2.2, 0, D0 + 0.12, 0.6, h, -3.0);
}

/* The glass lift on the right façade: the car is what the elevations count. */
const T0 = W1 + 0.05;
const T1 = W1 + 2.15;
const TZ = 1.1;

function tower(b: Bucket, bottom: number, h: number, glass: Material, cap: boolean) {
  blk(b, glass, T1 - 0.02, bottom, -TZ, T1 + 0.02, h, TZ);
  blk(b, glass, T0, bottom, -TZ - 0.02, T1, h, -TZ + 0.02);
  blk(b, glass, T0, bottom, TZ - 0.02, T1, h, TZ + 0.02);
  for (const z of [-TZ, TZ]) blk(b, mat.brass, T1 - 0.06, bottom, z - 0.06, T1 + 0.06, h, z + 0.06);
  // a brass band where each floor meets the shaft
  blk(b, mat.brass, T0, -SLAB, -TZ - 0.04, T1 + 0.04, -SLAB + 0.12, TZ + 0.04);
  if (cap) blk(b, mat.plaster, T0 - 0.05, h, -TZ - 0.25, T1 + 0.25, h + 0.32, TZ + 0.25, 0.04);
}

type Level = { group: Group; light: PointLight; glass: MeshStandardMaterial; warm: MeshStandardMaterial; bulb: MeshStandardMaterial; kota: number; anchor: Vector3 };

function buildLevel(kota: number, h: number, top: boolean, ground: boolean, featured: boolean): Level {
  const g = new Group();
  const b: Bucket = new Map();
  const glass = glassFor();
  // the floor finish of this level warms up when its lights come on
  const warm = mat.oak.clone();
  warm.emissive = new Color("#ffb877");
  warm.emissiveIntensity = 0;
  const bulb = new MeshStandardMaterial({ color: "#f3e6d2", emissive: new Color("#ffd09a"), emissiveIntensity: 0, roughness: 0.4 });

  if (!top) {
    // slab (with the balcony run at the front above the ground floor)
    const front = ground ? D1 : D1 + BALC;
    blk(b, mat.slab, W0, ground ? -0.45 : -SLAB, D0, W1, 0, front, 0.05);
    blk(b, warm, W0 + 0.25, 0, D0 + 0.25, W1 - 0.25, 0.02, D1 - 0.05);
    for (let x = -1.9; x < W1 - 0.4; x += 0.62) blk(b, mat.seam, x, 0.02, D0 + 0.3, x + 0.025, 0.024, D1 - 0.1);
    const wh = h - SLAB;
    for (const [x, z] of [
      [8.3, 2.0],
      [5.1, 2.6],
      [4.0, -3.8],
      [-3.1, 2.2],
      [-6.3, 2.6],
    ])
      pendant(b, bulb, x, z, wh);

    // back and side façades with windows
    facade(b, "x", D0 + 0.12, W0, W1, wh, { bay: 3, pier: 0.7, sill: 0.85, head: 0.45, glass });
    facade(b, "z", W1 - 0.12, D0, D1, wh, { bay: 3, pier: 0.75, sill: ground ? 0.1 : 0.85, head: 0.45, glass });
    facade(b, "z", W0 + 0.12, D0, D1, wh, { bay: 3, pier: 0.75, sill: 0.85, head: 0.45, glass });

    // The cut: the left flat keeps its glass front, the right one is open like a section model
    facade(b, "x", D1 - 0.08, W0, -2.2, wh, { bay: 1.7, pier: 0.07, sill: 0.04, head: 0.2, t: 0.1, wall: mat.frame, glass });
    blk(b, mat.plaster, -2.35, 0, D1 - 0.3, -2.05, wh, D1); // where the cut begins

    if (!ground) {
      // balcony rail: glass with a brass handrail
      blk(b, mat.railing, W0, 0, D1 + BALC - 0.06, W1, 1.0, D1 + BALC - 0.02);
      blk(b, mat.brass, W0, 1.0, D1 + BALC - 0.07, W1, 1.05, D1 + BALC - 0.01);
      // the featured flat: a brass fascia along its balcony slab
      if (featured) {
        blk(b, mat.brass, W0 - 0.02, -SLAB + 0.04, D1 + BALC, W1 + 0.02, -0.04, D1 + BALC + 0.03);
        blk(b, mat.brass, W1, -SLAB + 0.04, D0 - 0.02, W1 + 0.03, -0.04, D1 + BALC + 0.02);
      }
      for (const x of [W0, W1]) {
        blk(b, mat.railing, x - 0.02, 0, D1, x + 0.02, 1.0, D1 + BALC);
        blk(b, mat.brass, x - 0.03, 1.0, D1, x + 0.03, 1.05, D1 + BALC);
      }
    } else {
      // entrance canopy and steps
      blk(b, mat.slab, -1.6, -0.3, D1, 1.6, -0.15, D1 + 1.2);
      blk(b, mat.slab, -1.6, -0.45, D1 + 1.2, 1.6, -0.3, D1 + 1.6);
    }

    flat(b, 5.6, 1);
    flat(b, -5.8, -1);
    core(b, wh);
    tower(b, ground ? -0.45 : -SLAB, wh, glass, false);
  } else {
    // Penthouse: a set-back glass pavilion on the roof, with a terrace
    blk(b, mat.slab, W0, -SLAB, D0, W1, 0, D1, 0.05);
    blk(b, mat.teak, W0 + 0.2, 0, D0 + 0.2, W1 - 0.2, 0.03, D1 - 0.2);
    for (let x = W0 + 0.6; x < W1 - 0.3; x += 0.45) blk(b, mat.walnut, x, 0.03, D0 + 0.2, x + 0.03, 0.035, D1 - 0.2);
    const P0 = -7;
    const P1 = 4.6;
    const PZ = 1.6;
    const wh = h - SLAB;
    blk(b, warm, P0, 0.03, D0 + 0.1, P1, 0.05, PZ);
    for (const [x, z] of [
      [-3.6, -0.6],
      [-0.6, -3.6],
      [2.4, -1.2],
    ])
      pendant(b, bulb, x, z, wh, 0.8);
    facade(b, "x", D0 + 0.12, P0, P1, wh, { bay: 2.9, pier: 0.7, sill: 0.85, head: 0.4, glass });
    facade(b, "z", P0 + 0.12, D0, PZ, wh, { bay: 2.5, pier: 0.7, sill: 0.85, head: 0.4, glass });
    facade(b, "x", PZ, P0, P1, wh, { bay: 1.9, pier: 0.07, sill: 0.04, head: 0.16, t: 0.1, wall: mat.frame, glass });
    facade(b, "z", P1, D0, PZ, wh, { bay: 1.9, pier: 0.07, sill: 0.04, head: 0.16, t: 0.1, wall: mat.frame, glass });
    // roof with a deep overhang, a brass fascia: the listing on show
    blk(b, mat.plaster, P0 - 0.5, wh, D0 - 0.3, P1 + 0.9, wh + 0.32, PZ + 1.1, 0.05);
    blk(b, mat.brass, P0 - 0.5, wh + 0.08, PZ + 1.1, P1 + 0.9, wh + 0.24, PZ + 1.14);
    blk(b, mat.brass, P1 + 0.9, wh + 0.08, D0 - 0.3, P1 + 0.94, wh + 0.24, PZ + 1.14);
    // inside
    blk(b, mat.soft, -5.2, 0.05, -1.0, -2.0, 0.47, -0.1, 0.03);
    blk(b, mat.soft, -5.2, 0.05, -1.2, -2.0, 0.88, -0.95, 0.03);
    blk(b, mat.oak, -1.2, 0.8, -4.2, 0.9 - 1.2, 0.86, -3.0, 0.02);
    blk(b, mat.soft, 2.6, 0.05, -5.8, 4.4, 0.92, -5.2, 0.03);
    core(b, wh);
    tower(b, -SLAB, wh + 1.2, glass, true);
    // terrace: rail, loungers, planters with model trees
    blk(b, mat.railing, W0, 0, D1 - 0.06, W1, 1.0, D1 - 0.02);
    blk(b, mat.brass, W0, 1.0, D1 - 0.07, W1, 1.05, D1 - 0.01);
    blk(b, mat.railing, W1 - 0.06, 0, D0, W1 - 0.02, 1.0, D1);
    blk(b, mat.brass, W1 - 0.07, 1.0, D0, W1 - 0.01, 1.05, D1);
    blk(b, mat.railing, W0 + 0.02, 0, PZ, W0 + 0.06, 1.0, D1);
    blk(b, mat.brass, W0 + 0.01, 1.0, PZ, W0 + 0.07, 1.05, D1);
    for (const x of [1.2, 2.6]) {
      blk(b, mat.soft, x, 0.05, 3.1, x + 0.8, 0.3, 5.0, 0.04);
      blk(b, mat.soft, x, 0.05, 3.1, x + 0.8, 0.62, 3.5, 0.04);
    }
    blk(b, mat.oak, -1.0, 0.05, 3.4, 0.2, 0.5, 4.6, 0.04);
    for (const [x, z] of [
      [7.6, -4.6],
      [7.6, 4.6],
      [-7.6, 4.6],
    ]) {
      blk(b, mat.walnut, x - 0.6, 0.03, z - 0.6, x + 0.6, 0.6, z + 0.6, 0.04);
      tree(b, x, z, 0.55, 0.6);
    }
  }

  flush(b, g);

  const light = new PointLight("#ffd6ab", 0, 13, 1.7);
  light.position.set(top ? -1.2 : 4.6, h - SLAB - 0.55, top ? -2 : 1.8);
  g.add(light);

  g.position.y = kota;
  // where the elevation label hangs: the building's back-right corner, its right-most point on screen
  const anchor = new Vector3(W1, 0, D0);
  return { group: g, light, glass, warm, bulb, kota, anchor };
}

function buildSite(): Group {
  const site = new Group();
  const b: Bucket = new Map();
  // the model board: walnut base, stone top
  blk(b, mat.walnut, -14.2, -1.45, -10.7, 14.2, -0.55, 12.7, 0.06);
  blk(b, mat.boardTop, -14.05, -0.55, -10.55, 14.05, -0.45, 12.55, 0.02);
  // forecourt, street, a path
  blk(b, mat.paving, -9.5, -0.45, 6, 9.5, -0.43, 9.2);
  blk(b, mat.street, -14.05, -0.46, 9.9, 14.05, -0.44, 12.55);
  for (let x = -13.4; x < 13.6; x += 2.2) blk(b, mat.paving, x, -0.44, 11.18, x + 1.1, -0.43, 11.28);
  blk(b, mat.paving, -9.5, -0.45, -6.5, -8.9, -0.43, 6);
  // trees, kept off the right-hand side where the elevations hang
  for (const [x, z, r] of [
    [-11.6, 7.6, 1.15],
    [-11.4, 1.6, 0.95],
    [-12.0, -4.6, 1.25],
    [-11.8, -9.2, 0.85],
    [-4.6, -9.0, 1.15],
    [4.8, -8.9, 1.0],
    [-6.4, 9.5, 0.7],
    [6.4, 9.5, 0.7],
    [12.4, 8.6, 0.85],
  ])
    tree(b, x, z, r, -0.45);
  flush(b, site);
  return site;
}

/** The brass plaque on the board's front edge, engraved with the mark. */
function plaque(): Mesh {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 160;
  const x = c.getContext("2d")!;
  x.fillStyle = "#b8915a";
  x.fillRect(0, 0, c.width, c.height);
  x.fillStyle = "#5e4320";
  x.font = "500 64px 'IBM Plex Mono', ui-monospace, monospace";
  x.textBaseline = "middle";
  x.textAlign = "center";
  x.fillText("▽ KOTA · ±0.00 · NOVI SAD", c.width / 2, c.height / 2 + 4);
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 8;
  const m = new MeshStandardMaterial({ map: tex, metalness: 0.85, roughness: 0.35 });
  const mesh = new Mesh(new PlaneGeometry(7.2, 1.125), m);
  mesh.position.set(6.2, -1.0, 12.72);
  return mesh;
}

/* ───────────────────────── scene ───────────────────────── */

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (v: number) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const LIFT_START = 0.45;
const LIFT_TIME = 2.9;
const INTRO_END = LIFT_START + LIFT_TIME + 0.9;
const GAP = 3.3;
/** Scroll (as a share of the hero's height) by which the floors are fully apart */
const APART_AT = 0.55;
/** Share of the scroll the model is held back by, so it stays on screen while it opens */
const HOLD = 0.6;

export function createBuildingScene(canvas: HTMLCanvasElement, o: Opts): BuildingScene {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance", preserveDrawingBuffer: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.92;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;
  renderer.setClearColor(BG, 1);

  const scene = new Scene();
  scene.background = BG;

  const pmrem = new PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0.24;

  // Low evening sun from the west (left), cool sky fill: warm lit faces, blue shade.
  const sun = new DirectionalLight("#ffd1a0", 3.6);
  sun.position.set(-38, 26, -16);
  sun.target.position.set(0, 4, 0);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -26;
  sun.shadow.camera.right = 26;
  sun.shadow.camera.top = 30;
  sun.shadow.camera.bottom = -22;
  sun.shadow.camera.near = 5;
  sun.shadow.camera.far = 120;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.03;
  sun.shadow.radius = 5;
  scene.add(sun, sun.target);
  scene.add(new HemisphereLight("#a7bdd2", "#3a3028", 0.62));

  const floor = new Mesh(new PlaneGeometry(400, 400), mat.floor);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.45;
  floor.receiveShadow = true;
  scene.add(floor);

  const site = buildSite();
  site.add(plaque());
  scene.add(site);

  const ks = o.levels;
  const levels = ks.map((k, i) => {
    const top = i === ks.length - 1;
    const h = top ? 3.0 : ks[i + 1] - k;
    return buildLevel(k, h, top, i === 0, i === o.featured);
  });
  levels.forEach((l) => scene.add(l.group));

  // The lift car: brass frame, lit from inside, riding the glass tower
  const car = new Group();
  {
    const b: Bucket = new Map();
    const x0 = T0 + 0.2;
    const x1 = T1 - 0.2;
    const z = TZ - 0.22;
    blk(b, mat.brass, x0, 0.02, -z, x1, 0.12, z, 0.02);
    blk(b, mat.brass, x0, 2.3, -z, x1, 2.42, z, 0.02);
    blk(b, mat.brass, x0, 0.02, -z, x0 + 0.08, 2.42, z);
    for (const zz of [-z, z]) blk(b, mat.brass, x1 - 0.06, 0.02, zz - 0.06, x1, 2.42, zz + 0.06);
    // the lit back wall of the car: a warm square climbing the façade
    blk(b, new MeshStandardMaterial({ color: "#ffe6c4", emissive: new Color("#ffc685"), emissiveIntensity: 1.3, roughness: 0.6 }), x0 + 0.08, 0.12, -z + 0.05, x0 + 0.12, 2.3, z - 0.05);
    flush(b, car);
    const glow = new PointLight("#ffcf9a", 9, 6, 1.6);
    glow.position.set((x0 + x1) / 2, 1.9, 0);
    car.add(glow);
  }
  scene.add(car);

  const camera = new PerspectiveCamera(20, 1, 20, 600);

  /* state */
  let width = 1;
  let height = 1;
  let shift = o.shift ?? 0.19;
  let progress = 0;
  let explode = 0;
  const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
  let visible = true;
  let raf = 0;
  let last = 0;
  let t0 = -1;
  let first = true;
  let introT = 0;
  const labels: LabelPos[] = levels.map(() => ({ x: 0, y: 0, on: 0 }));
  const v = new Vector3();

  const placeCamera = (ex: number, px: number, py: number, zoom = 1, lift = 0, turn = 0) => {
    const az = ((33 + 9 * ex + px * 6 + turn) * Math.PI) / 180;
    const pol = ((66.5 - 5 * ex - py * 2.5) * Math.PI) / 180;
    const r = (128 + 44 * ex) * zoom;
    const tx = 1.2;
    const ty = 6.4 + 7.4 * ex + lift;
    camera.position.set(tx + r * Math.sin(pol) * Math.sin(az), ty + r * Math.cos(pol), r * Math.sin(pol) * Math.cos(az));
    camera.lookAt(tx, ty, 0);
  };

  const applyView = (w: number, h: number, sh: number, drop = 0) => {
    camera.aspect = w / h;
    // Wide screens: the model sits right of the copy; narrower ones pull it back towards the centre
    const s = w / h > 1.25 ? sh : sh * 0.5;
    camera.setViewOffset(w, h, -w * s, -drop, w, h);
  };

  /** Lift elevation and each floor's light for a moment in the intro. */
  const pose = (it: number, ex: number) => {
    const lt = easeInOut(clamp01((it - LIFT_START) / LIFT_TIME));
    const liftKota = lt * ks[ks.length - 1];
    levels.forEach((l, i) => {
      const dy = i * GAP * ex;
      l.group.position.y = l.kota + dy;
      const on = i === 0 ? smooth((it - 0.15) / 0.5) : smooth((liftKota - (l.kota - 1.1)) / 1.1);
      const peak = i === o.featured ? 2 : i === levels.length - 1 ? 1.2 : 1;
      l.light.intensity = on * 14 * peak;
      l.glass.emissiveIntensity = on * 0.42 * peak;
      l.warm.emissiveIntensity = on * 0.16 * peak;
      l.bulb.emissiveIntensity = on * 3.2;
      labels[i].on = on;
    });
    // the car rides with the floors it is between
    const seg = Math.min(ks.length - 2, Math.max(0, ks.findIndex((k, i) => i < ks.length - 1 && liftKota < ks[i + 1])));
    const segT = clamp01((liftKota - ks[seg]) / (ks[seg + 1] - ks[seg]));
    car.position.y = liftKota + (seg + segT) * GAP * ex;
    return liftKota;
  };

  const render = () => {
    const liftKota = pose(introT, explode);
    applyView(width, height, shift, progress * height * HOLD);
    placeCamera(explode, ptr.x, ptr.y);
    renderer.render(scene, camera);
    if (o.onFrame) {
      levels.forEach((l, i) => {
        v.copy(l.anchor).add(l.group.position);
        v.project(camera);
        labels[i].x = ((v.x + 1) / 2) * width;
        labels[i].y = ((1 - v.y) / 2) * height;
      });
      o.onFrame(labels, liftKota);
    }
  };

  const tick = (now: number) => {
    raf = 0;
    if (t0 < 0) t0 = now;
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 1 / 60);
    last = now;
    introT = (now - t0) / 1000;
    const k = 1 - Math.exp(-dt * 5.5);
    explode += (smooth(progress / APART_AT) - explode) * k;
    const kp = 1 - Math.exp(-dt * 3.2);
    ptr.x += (ptr.tx - ptr.x) * kp;
    ptr.y += (ptr.ty - ptr.y) * kp;
    render();
    if (first) {
      first = false;
      o.onFirstFrame?.();
    }
    const settled = introT > INTRO_END && Math.abs(smooth(progress / APART_AT) - explode) < 1e-4 && Math.abs(ptr.tx - ptr.x) < 1e-4 && Math.abs(ptr.ty - ptr.y) < 1e-4;
    if (!settled) wake();
    else last = 0;
  };

  const wake = () => {
    if (!raf && visible) raf = requestAnimationFrame(tick);
  };

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    width = Math.max(1, Math.round(r.width));
    height = Math.max(1, Math.round(r.height));
    renderer.setSize(width, height, false);
    applyView(width, height, shift);
    wake();
  };

  resize();
  wake();

  return {
    setProgress(p) {
      progress = clamp01(p);
      wake();
    },
    setPointer(x, y) {
      ptr.tx = Math.max(-1, Math.min(1, x));
      ptr.ty = Math.max(-1, Math.min(1, y));
      wake();
    },
    setVisible(vis) {
      visible = vis;
      if (vis) {
        last = 0;
        wake();
      } else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    },
    resize,
    snapshot({ width: w, height: h, intro, explode: ex = 0, shift: sh = shift, zoom = 1, lift = 0, turn = 0 }) {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      renderer.setPixelRatio(1);
      renderer.setSize(w, h, false);
      applyView(w, h, sh);
      pose(intro, ex);
      placeCamera(ex, 0, 0, zoom, lift, turn);
      renderer.render(scene, camera);
      const url = canvas.toDataURL("image/png");
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      shift = o.shift ?? 0.19;
      resize();
      return url;
    },
    dispose() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      scene.traverse((obj) => {
        if (obj instanceof Mesh) {
          obj.geometry.dispose();
          const m = obj.material as MeshStandardMaterial;
          m.map?.dispose();
          m.dispose();
        }
      });
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
