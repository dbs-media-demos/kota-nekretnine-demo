"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/** Tweens a displayed number towards `target` whenever it changes (power3.out, without GSAP so phones can use it). */
export function useAnimatedNumber(target: number, duration = 0.8) {
  const [value, setValue] = useState(target);
  const current = useRef(target);

  useEffect(() => {
    if (prefersReducedMotion()) {
      current.current = target;
      setValue(target);
      return;
    }
    const from = current.current;
    const start = performance.now();
    let raf = requestAnimationFrame(function step(now) {
      const t = Math.min(1, (now - start) / (duration * 1000));
      current.current = from + (target - from) * (1 - Math.pow(1 - t, 4));
      setValue(Math.round(current.current));
      if (t < 1) raf = requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}
