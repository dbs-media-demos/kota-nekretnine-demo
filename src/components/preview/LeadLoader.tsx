import { LOADER_DONE } from "@/lib/loader";

/** The mark's shapes get `pathLength="1"` (so one dash draws each outline) and their place in the stagger. */
function forLoader(svg: string) {
  const at = svg.search(/<g\b[^>]*data-part=["']mark["']/);
  if (at < 0) return svg;
  const word = svg.slice(at + 1).search(/<g\b[^>]*data-part=["']word["']/);
  const end = word >= 0 ? at + 1 + word : svg.lastIndexOf("</svg>");
  let i = 0;
  const mark = svg.slice(at, end).replace(/<(path|circle|rect|line|polyline|polygon|ellipse)\b/g, (_, tag: string) => `<${tag} pathLength="1" data-i="${Math.min(i++, 15)}"`);
  return svg.slice(0, at) + mark + svg.slice(end);
}

/**
 * A personalised preview's first view in this tab: the lead's own logo draws itself on the page's
 * limestone (the mark's outlines, then their fills, the name wiping in over a brass ±0.00 datum
 * line), holds, and the sheet lifts away like the menu closes, onto the dark hero, whose own entrance
 * waits for it (`html[data-loading]` pauses the CSS intros, `whenLoaderDone` holds the 3D lift).
 *
 * All of it is in the server HTML: the inline script runs before the overlay is parsed, so the first
 * paint is the loader, never the homepage. It decides, starts and ends the loader by itself (no
 * hydration needed). The hold counts from when the drawing really starts (a busy page can start it
 * late), capped at 1.9 s after the script, and the exit takes 0.8 s: ~2.3 s in all, never 3 s.
 * Reduced motion: the finished logo for 0.6 s, then a fade. A click, key or scroll skips it, and a
 * reload in the same tab doesn't show it (sessionStorage per token).
 */
export function LeadLoader({ token, svg, note }: { token: string; svg: string; note: string }) {
  const script = `(function(){var d=document.documentElement,k=${JSON.stringify(`lead-loader:${token}`)};try{if(sessionStorage.getItem(k))return;sessionStorage.setItem(k,"1")}catch(e){}
d.setAttribute("data-loading","");var r=matchMedia("(prefers-reduced-motion: reduce)").matches,o=0,ev=["pointerdown","keydown","wheel","touchstart"],h,c;
function go(){if(o)return;o=1;clearTimeout(h);clearTimeout(c);removeEventListener("animationstart",st,true);ev.forEach(function(e){removeEventListener(e,go,true)});d.setAttribute("data-loader-out","");d.removeAttribute("data-loading");dispatchEvent(new Event(${JSON.stringify(LOADER_DONE)}));setTimeout(function(){d.removeAttribute("data-loader-out")},r?500:900)}
function st(e){if(e.animationName!=="ll-rise")return;removeEventListener("animationstart",st,true);clearTimeout(h);h=setTimeout(go,1500)}
if(r)h=setTimeout(go,600);else{addEventListener("animationstart",st,true);h=setTimeout(go,1500);c=setTimeout(go,1900)}
ev.forEach(function(e){addEventListener(e,go,{capture:true,passive:true})})})()`;
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: script }} />
      <div className="lead-loader" aria-hidden="true">
        <div className="lead-loader__in">
          <div className="lead-logo lead-loader__logo" dangerouslySetInnerHTML={{ __html: forLoader(svg) }} />
          <span className="lead-loader__datum" />
          <p className="lead-loader__note t-label">▽ ±0.00 · {note}</p>
        </div>
      </div>
    </>
  );
}
