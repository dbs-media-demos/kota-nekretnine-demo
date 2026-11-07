"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isPhone, prefersReducedMotion } from "@/lib/motion";

/**
 * All the scroll motion a phone gets, with no animation library: each section's content fades and
 * rises once, and the architect's dimension lines draw themselves once. Only what starts below the
 * fold is touched, so the first screen never fades in.
 */
export function PhoneMotion() {
  const pathname = usePathname();

  useEffect(() => {
    if (!isPhone() || prefersReducedMotion()) return;
    const below = (el: Element) => el.getBoundingClientRect().top > window.innerHeight;
    const rises = Array.from(document.querySelectorAll("main section > *, footer > *")).filter(below);
    const draws = Array.from(document.querySelectorAll("[data-draw]")).filter(below);
    const timers = new Set<number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const { isIntersecting, target } of entries) {
          if (!isIntersecting) continue;
          io.unobserve(target);
          const rising = target.classList.contains("rise");
          target.classList.replace(rising ? "rise" : "undrawn", rising ? "rise-in" : "drawn");
          // Back to plain layout once done: nothing stays promoted while scrolling.
          const id = window.setTimeout(() => {
            target.classList.remove("rise-in", "drawn");
            timers.delete(id);
          }, 1100);
          timers.add(id);
        }
      },
      { rootMargin: "0px 0px -6% 0px" },
    );
    rises.forEach((el) => {
      el.classList.add("rise");
      io.observe(el);
    });
    draws.forEach((el) => {
      el.classList.add("undrawn");
      io.observe(el);
    });
    return () => {
      io.disconnect();
      timers.forEach((id) => window.clearTimeout(id));
      [...rises, ...draws].forEach((el) => el.classList.remove("rise", "rise-in", "undrawn", "drawn"));
    };
  }, [pathname]);

  return null;
}
