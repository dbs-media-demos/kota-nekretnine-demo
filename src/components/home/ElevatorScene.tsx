"use client";

import { useRef, type ReactNode } from "react";
import { kota } from "@/lib/format";
import { useDeskMotion } from "@/lib/motion";

/** Desktop motion of the elevator scene: rising clip reveals and the elevation readout. Reads each floor from its data attributes. */
export function ElevatorScene({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null);

  useDeskMotion(
    ({ gsap, ScrollTrigger }) => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const el = root.current!;
        const articles = gsap.utils.toArray<HTMLElement>("[data-floor]", el);
        const layers = gsap.utils.toArray<HTMLElement>("[data-layer]", el);
        const readout = el.querySelector<HTMLElement>("[data-readout]");
        const name = el.querySelector<HTMLElement>("[data-name]");
        const marker = el.querySelector<HTMLElement>("[data-marker]");
        const shaft = el.querySelector<HTMLElement>("[data-shaft]");

        gsap.set(layers.slice(1), { clipPath: "inset(100% 0% 0% 0%)" });

        layers.forEach((layer, i) => {
          if (i === 0) return;
          const prevImg = layers[i - 1].querySelector("img");
          gsap
            .timeline({ scrollTrigger: { trigger: articles[i], start: "top 90%", end: "top 30%", scrub: 0.7 } })
            .fromTo(layer, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none" }, 0)
            .fromTo(layer.querySelector("img"), { scale: 1.25 }, { scale: 1, ease: "none" }, 0)
            .fromTo(prevImg, { scale: 1 }, { scale: 1.12, ease: "none" }, 0);
        });

        // The readout counts to each floor's exact elevation as its text arrives.
        const state = { v: 0 };
        const goTo = (i: number) => {
          gsap.to(state, {
            v: Number(articles[i].dataset.kota),
            duration: 1.1,
            ease: "power3.inOut",
            overwrite: true,
            onUpdate: () => {
              if (readout) readout.textContent = kota(Math.round(state.v * 100) / 100);
            },
          });
          if (name) name.textContent = articles[i].dataset.floorName ?? "";
          if (marker && shaft) gsap.to(marker, { y: -(i / (articles.length - 1)) * (shaft.clientHeight - 16), duration: 1.1, ease: "power3.inOut", overwrite: true });
        };
        articles.forEach((a, i) =>
          ScrollTrigger.create({
            trigger: a,
            start: "top 55%",
            end: "bottom 55%",
            onEnter: () => goTo(i),
            onEnterBack: () => goTo(i),
          }),
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} data-tr-gate className="theme-dark relative" data-header="dark" aria-labelledby="elevator-title">
      {children}
    </section>
  );
}
