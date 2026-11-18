/**
 * The lead's logo loader on a personalised preview (components/preview/LeadLoader). While it shows,
 * `<html>` carries `data-loading`; when it starts to leave, the attribute goes and `loader:done` fires
 * on window. The CSS entrances above the fold are paused by globals.css meanwhile; script-driven
 * intros (the 3D lift) wait with this. Without a loader (the concept site, a reload, no logo) `cb` runs at once.
 */
export const LOADER_DONE = "loader:done";

export function whenLoaderDone(cb: () => void): () => void {
  if (typeof document === "undefined" || !document.documentElement.hasAttribute("data-loading")) {
    cb();
    return () => {};
  }
  const on = () => cb();
  window.addEventListener(LOADER_DONE, on, { once: true });
  return () => window.removeEventListener(LOADER_DONE, on);
}
