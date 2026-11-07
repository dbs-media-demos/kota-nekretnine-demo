"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import type Lenis from "lenis";
import { isPhone, isTouch, loadGsap, prefersReducedMotion } from "@/lib/motion";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** Lenis smooth scrolling driven by GSAP's ticker. Desktop only: off on phones, touch and reduced motion. */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion() || isPhone() || isTouch()) return;
    let lenis: Lenis | null = null;
    let cancelled = false;
    let stop = () => {};
    // Loaded after hydration: smooth scrolling is an enhancement, not a dependency.
    Promise.all([loadGsap(), import("lenis")]).then(([{ gsap, ScrollTrigger }, { default: LenisCtor }]) => {
      if (cancelled) return;
      const tick = (time: number) => lenis?.raf(time * 1000);
      lenis = new LenisCtor({ lerp: 0.1, wheelMultiplier: 1, anchors: { offset: -90 } });
      window.__lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      stop = () => gsap.ticker.remove(tick);
    });
    return () => {
      cancelled = true;
      stop();
      lenis?.destroy();
      delete window.__lenis;
    };
  }, []);

  useEffect(() => {
    if (isPhone()) return;
    window.__lenis?.resize();
    const id = window.setTimeout(() => loadGsap().then(({ ScrollTrigger }) => ScrollTrigger.refresh()), 400);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
