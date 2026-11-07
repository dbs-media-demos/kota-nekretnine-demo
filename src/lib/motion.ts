"use client";

import { useEffect, type DependencyList, type RefObject } from "react";
import { PHONE_MEDIA } from "./phone";

export type GsapKit = typeof import("./gsap");

export const prefersReducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isTouch = () => typeof window !== "undefined" && window.matchMedia("(hover: none), (pointer: coarse)").matches;

export const isPhone = () => typeof window !== "undefined" && window.matchMedia(PHONE_MEDIA).matches;

let kit: Promise<GsapKit> | null = null;

/** GSAP as a separate download: phones never fetch it. */
export const loadGsap = () => (kit ??= import("./gsap"));

/**
 * useGSAP for the desktop scenes: same context and cleanup, but it does nothing on a phone and
 * GSAP arrives after hydration. Callbacks share one promise, so scenes still set up in effect order.
 */
export function useDeskMotion(setup: (kit: GsapKit) => void | (() => void), { scope, dependencies = [] }: { scope?: RefObject<Element | null>; dependencies?: DependencyList } = {}) {
  useEffect(() => {
    if (isPhone()) return;
    let dead = false;
    let ctx: { revert: () => void } | undefined;
    loadGsap().then((g) => {
      if (!dead) ctx = g.gsap.context(() => setup(g), scope?.current ?? undefined);
    });
    return () => {
      dead = true;
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- same contract as useGSAP: only `dependencies` re-run it
  }, dependencies);
}
