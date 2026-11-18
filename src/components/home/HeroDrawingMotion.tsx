"use client";

import { useEffect, useRef } from "react";
import { kota } from "@/lib/format";
import { isPhone, prefersReducedMotion } from "@/lib/motion";

/**
 * The drawing hero's few lines of script, desktop only (the drawing itself runs on CSS from first
 * paint): the ▽ readout follows the lift, scrolling separates the floors and fades the featured card
 * (`--hero-p`, as on `/`), the cursor leans the sheet, and the loops pause off screen. Transforms are
 * written on the few elements that move: a variable inherited by the drawing restyled all its nodes
 * every frame (40 ms a frame at 4x CPU).
 */
export function HeroDrawingMotion() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isPhone()) return;
    const hero = ref.current?.closest<HTMLElement>("[data-hero-dark]");
    const cabin = hero?.querySelector<SVGGElement>("[data-dr-lift]");
    if (!hero || !cabin) return;
    const readout = hero.querySelector<HTMLElement>("[data-hero-kota]");
    const card = hero.querySelector<HTMLElement>("[data-feature-card]");
    const floors = [...hero.querySelectorAll<HTMLElement>("[data-dr-i]")].map((el) => ({ el, i: Number(el.dataset.drI) }));
    const sheet = hero.querySelector<HTMLElement>(".dr-lean");
    const grid = hero.querySelector<HTMLElement>(".dr-lean-back");
    const reduced = prefersReducedMotion();
    let raf = 0;
    let shown = "";
    let dead = false;

    // ▽ readout: read where the lift is from its own CSS animation, so the two can never disagree
    const readLift = () => {
      const t = getComputedStyle(cabin).transform;
      const ty = t && t !== "none" ? new DOMMatrixReadOnly(t).m42 : 0;
      const text = kota(Math.round((-ty / 34) * 100) / 100);
      if (readout && text !== shown) readout.textContent = shown = text;
    };
    const follow = () => {
      if (dead) return;
      readLift();
      raf = requestAnimationFrame(follow);
    };
    const anims = cabin.getAnimations();
    if (anims.length && !reduced) {
      raf = requestAnimationFrame(follow);
      Promise.all(anims.map((a) => a.finished))
        .then(() => {
          cancelAnimationFrame(raf);
          if (!dead) readLift();
        })
        .catch(() => {});
    } else readLift();

    // Scroll: floors apart, card away. One write per frame.
    let queued = false;
    const apply = () => {
      queued = false;
      const r = hero.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)));
      card?.style.setProperty("--hero-p", p.toFixed(3));
      // like the model's exploded section: the top floor most, 34 of the drawing's 640 units a storey
      if (!reduced) floors.forEach(({ el, i }) => (el.style.transform = p ? `translate3d(0, ${(-p * i * 5.3125).toFixed(3)}%, 0)` : ""));
    };
    const onScroll = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(apply);
      }
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Cursor lean, eased by a CSS transition
    let mq = false;
    let mx = 0;
    let my = 0;
    const lean = () => {
      mq = false;
      if (sheet) sheet.style.transform = `translate3d(${(mx * -9).toFixed(2)}px, ${(my * -6).toFixed(2)}px, 0)`;
      if (grid) grid.style.transform = `translate3d(${(mx * 7).toFixed(2)}px, ${(my * 5).toFixed(2)}px, 0)`;
    };
    const onMove = (e: PointerEvent) => {
      mx = (e.clientX / window.innerWidth) * 2 - 1;
      my = (e.clientY / window.innerHeight) * 2 - 1;
      if (!mq) {
        mq = true;
        requestAnimationFrame(lean);
      }
    };
    if (!reduced) window.addEventListener("pointermove", onMove, { passive: true });

    // The sheen and the lamps that switch on and off rest while the hero is off screen
    const io = new IntersectionObserver(([en]) => hero.toggleAttribute("data-dr-off", !en.isIntersecting));
    io.observe(hero);

    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      hero.removeAttribute("data-dr-off");
      card?.style.removeProperty("--hero-p");
    };
  }, []);

  return <span ref={ref} hidden />;
}
