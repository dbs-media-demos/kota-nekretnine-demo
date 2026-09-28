"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  gsap.defaults({ ease: "expo.out", duration: 1.1 });
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isTouch = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: none), (pointer: coarse)").matches;

export { gsap, ScrollTrigger, useGSAP };

/** SplitText is only needed below the fold; load it on demand. */
export async function loadSplitText() {
  const { SplitText } = await import("gsap/SplitText");
  gsap.registerPlugin(SplitText);
  return SplitText;
}
