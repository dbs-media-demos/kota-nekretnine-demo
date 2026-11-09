"use client";

/**
 * The only door to three.js. Nothing imports a 3D module statically: callers run `after3DGate`
 * in an effect, and the `import()` happens inside its callback, so phones, tablets, reduced
 * motion and Save-Data never download a byte of it.
 *
 * A scene that can't hold its frame rate (see `frameWatch`) is remembered for the visit, and every
 * scene after it stays a still.
 */
export const DESKTOP_3D_QUERY = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";

const SLOW_KEY = "kota:3d";

function slowThisVisit() {
  try {
    return sessionStorage.getItem(SLOW_KEY) === "still";
  } catch {
    return false;
  }
}

/** This computer can't run the 3D smoothly: stills for the rest of the visit. */
export function markSlow3D() {
  try {
    sessionStorage.setItem(SLOW_KEY, "still");
  } catch {}
}

export function can3D() {
  if (typeof window === "undefined") return false;
  if (!window.matchMedia(DESKTOP_3D_QUERY).matches) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (conn?.saveData) return false;
  if (slowThisVisit()) return false;
  return typeof WebGL2RenderingContext !== "undefined";
}

/**
 * After the page has loaded and the browser is idle, call `yes` on a big screen with a mouse, so a
 * scene builds and compiles while its still is showing, whether it's the hero or further down.
 * Returns a cancel function.
 */
export function after3DGate(yes: () => void) {
  let cancelled = false;
  let idle = 0;
  const run = () => {
    if (!cancelled && can3D()) yes();
  };
  const onLoad = () => {
    if (typeof window.requestIdleCallback === "function") idle = window.requestIdleCallback(run, { timeout: 600 });
    else idle = window.setTimeout(run, 120);
  };
  if (document.readyState === "complete") onLoad();
  else window.addEventListener("load", onLoad, { once: true });
  return () => {
    cancelled = true;
    window.removeEventListener("load", onLoad);
    if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idle);
    window.clearTimeout(idle);
  };
}

/**
 * Building a scene happens in slices between frames (a floor of a model, say). One that takes
 * longer than this on average is a long task, a hitch in itself, and says the processor is too slow
 * for the live scene's frames too (about 3x slower than a current desktop).
 */
const MAX_SLICE_MS = 50;
/** The first 2 s of a scene's frames on screen decide whether it stays. */
const WATCH_MS = 2000;
/** Below this on average, it goes back to the still. */
const MIN_FPS = 45;
/** Any single frame longer than this (after the first few) is a visible hitch. */
const MAX_GAP_MS = 100;
/**
 * Main-thread time the scene's own frame may take on average while it plays untouched. Scrolling
 * costs it several times more (the floors part, the labels move, the page scrolls), and above this
 * the scrolled frames stop fitting a 60 Hz display, whatever the fps looks like at rest.
 */
const MAX_WORK_MS = 3;
const WARMUP_FRAMES = 3;

/**
 * Decides whether a scene stays live on this computer, and remembers a no for the visit.
 * - `slice(ms)` after each slice of the build: true means stop building and keep the still.
 * - `frame(gap, work)` after each frame once it's on screen: `gap` is the time since the previous
 *   frame (0 when the loop has just started or resumed), `work` the scene's own time for the frame.
 *   Calls `onSlow` once if the first 2 s run slow.
 */
export function perfWatch(onSlow: () => void) {
  let built = 0;
  let slices = 0;
  let seen = 0;
  let time = 0;
  let work = 0;
  let n = 0;
  let done = false;
  const fail = () => {
    done = true;
    markSlow3D();
    onSlow();
  };
  return {
    slice(ms: number) {
      built += ms;
      slices++;
      if (slices < 2 || built / slices <= MAX_SLICE_MS) return false;
      markSlow3D();
      return true;
    },
    frame(gap: number, ms: number) {
      if (done || ++seen <= WARMUP_FRAMES || gap <= 0) return;
      if (gap > MAX_GAP_MS) return fail();
      time += gap;
      work += ms;
      n++;
      if (time < WATCH_MS) return;
      done = true;
      if ((n * 1000) / time < MIN_FPS || work / n > MAX_WORK_MS) fail();
    },
  };
}
