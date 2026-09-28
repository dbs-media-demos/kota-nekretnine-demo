"use client";

import { useRef } from "react";
import Image from "next/image";
import { homeCopy as c } from "@/content/home";
import type { Locale } from "@/lib/i18n";
import { kota } from "@/lib/format";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { SplitReveal } from "@/components/ui/Reveal";

/**
 * Signature scene: the page rides an elevator. Text floors scroll past on the
 * left; on the right a sticky shaft swaps rooms with a rising clip, and a big
 * elevation readout counts up ±0.00 → +12.40. Phones get a simple stack.
 */
export function Elevator({ locale }: { locale: Locale }) {
  const root = useRef<HTMLElement>(null);
  const floors = c.floors;

  useGSAP(
    () => {
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
            v: floors[i].kota,
            duration: 1.1,
            ease: "power3.inOut",
            overwrite: true,
            onUpdate: () => {
              if (readout) readout.textContent = kota(Math.round(state.v * 100) / 100);
            },
          });
          if (name) name.textContent = floors[i].name[locale];
          if (marker && shaft) gsap.to(marker, { y: -(i / (floors.length - 1)) * (shaft.clientHeight - 16), duration: 1.1, ease: "power3.inOut", overwrite: true });
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
    <section ref={root} className="theme-dark relative" data-header="dark" aria-labelledby="elevator-title">
      <div className="wrap pt-24 md:pt-36">
        <p className="t-label text-accent">▽ {c.elevatorLabel[locale]}</p>
        <SplitReveal id="elevator-title" className="t-h1 mt-5 max-w-[14ch]">
          {c.elevatorTitle[locale]}
        </SplitReveal>
      </div>

      <div className="wrap grid gap-x-16 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.25fr)] motion-reduce:lg:grid-cols-1">
        <div>
          {floors.map((f, i) => (
            <article key={i} data-floor className="flex min-h-[70svh] flex-col justify-center border-b border-line py-16 last:border-0 lg:min-h-[100svh]">
              <p className="t-label flex items-center gap-3 text-accent">
                <span className="t-mono text-[0.95rem] tracking-normal">{kota(f.kota)}</span>
                <span className="h-px w-8 bg-current" />
                {f.name[locale]}
              </p>
              <h3 className="t-h2 mt-5 max-w-[14ch]">{f.title[locale]}</h3>
              <p className="t-lead mt-6 max-w-[46ch] text-muted">{f.text[locale]}</p>
              <div className="relative mt-10 aspect-[4/3] overflow-hidden lg:hidden motion-reduce:lg:block">
                <Image src={f.image} alt={f.alt[locale]} fill sizes="92vw" quality={70} className="object-cover" />
                <span className="t-label absolute bottom-3 left-3 rounded-full bg-dunav/70 px-3 py-1.5 text-kamen backdrop-blur-sm">▽ {kota(f.kota)}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="relative hidden lg:block motion-reduce:lg:hidden">
          <div className="sticky top-0 flex h-[100svh] items-center py-[9svh]">
            <div className="relative h-full w-full">
              {/* shaft */}
              <div data-shaft className="absolute -left-10 bottom-0 top-0 w-px bg-line" aria-hidden="true">
                <span data-marker className="absolute -left-[7px] bottom-0 text-[0.9rem] leading-none text-mesing">
                  ▽
                </span>
              </div>
              <div className="relative h-full w-full overflow-hidden">
                {floors.map((f, i) => (
                  <div key={i} data-layer className="absolute inset-0 overflow-hidden" style={{ zIndex: i }}>
                    <Image src={f.image} alt={f.alt[locale]} fill sizes="55vw" quality={75} className="object-cover" />
                  </div>
                ))}
                <div className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(180deg,rgba(13,29,43,0)_55%,rgba(13,29,43,0.7)_100%)]" />
                <div className="pointer-events-none absolute bottom-6 left-7 right-7 z-30 flex items-end justify-between text-kreda" aria-hidden="true">
                  <span data-readout className="t-mono text-[clamp(3rem,6vw,6.5rem)] leading-none tracking-[-0.04em]">
                    {kota(0)}
                  </span>
                  <span data-name className="t-label mb-3">
                    {floors[0].name[locale]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
