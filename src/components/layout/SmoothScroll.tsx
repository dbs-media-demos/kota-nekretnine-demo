"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import type Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion, isTouch } from "@/lib/gsap";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** Lenis smooth scrolling driven by GSAP's ticker. Off on touch and reduced motion. */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion() || isTouch()) return;
    let lenis: Lenis | null = null;
    let cancelled = false;
    const tick = (time: number) => lenis?.raf(time * 1000);
    // Loaded after hydration: smooth scrolling is an enhancement, not a dependency.
    import("lenis").then(({ default: LenisCtor }) => {
      if (cancelled) return;
      lenis = new LenisCtor({ lerp: 0.1, wheelMultiplier: 1, anchors: { offset: -90 } });
      window.__lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    });
    return () => {
      cancelled = true;
      gsap.ticker.remove(tick);
      lenis?.destroy();
      delete window.__lenis;
    };
  }, []);

  useEffect(() => {
    window.__lenis?.resize();
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
