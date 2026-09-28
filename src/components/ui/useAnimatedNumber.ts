"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/** Tweens a displayed number towards `target` whenever it changes. */
export function useAnimatedNumber(target: number, duration = 0.8) {
  const [value, setValue] = useState(target);
  const obj = useRef({ v: target });

  useEffect(() => {
    if (prefersReducedMotion()) {
      obj.current.v = target;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- jump straight to the value
      setValue(target);
      return;
    }
    const tween = gsap.to(obj.current, {
      v: target,
      duration,
      ease: "power3.out",
      onUpdate: () => setValue(Math.round(obj.current.v)),
    });
    return () => {
      tween.kill();
    };
  }, [target, duration]);

  return value;
}
