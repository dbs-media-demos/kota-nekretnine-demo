"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { kota } from "@/lib/format";

type Card = { title: string; text: string; image: string };

/** Sticky cards that stack like floors; the ones underneath settle back as the next arrives. */
export function StackCards({ cards }: { cards: Card[] }) {
  const root = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-card]", root.current);
        items.forEach((card, i) => {
          if (i === items.length - 1) return;
          gsap.to(card.firstElementChild, {
            scale: 0.92,
            opacity: 0.5,
            ease: "none",
            scrollTrigger: { trigger: items[i + 1], start: "top bottom", end: "top 25%", scrub: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <ol ref={root} className="grid gap-6 md:gap-0">
      {cards.map((card, i) => (
        <li key={card.title} data-card className="md:sticky md:h-[76svh]" style={{ top: `calc(var(--header-h) + ${1 + i * 1.4}rem)` }}>
          <div className="grid h-full origin-top overflow-hidden border border-line bg-kreda md:grid-cols-2">
            <div className="flex flex-col justify-between gap-8 p-7 md:p-12">
              <div>
                <p className="t-label flex items-center gap-3 text-accent">
                  <span className="t-mono">{kota(i * 3.2)}</span>
                  <span className="h-px w-8 bg-current" /> 0{i + 1} / 0{cards.length}
                </p>
                <h3 className="t-h2 mt-6">{card.title}</h3>
                <p className="t-lead mt-5 max-w-[42ch] text-muted">{card.text}</p>
              </div>
              <p className="t-mono hidden text-[clamp(4rem,8vw,8rem)] leading-none tracking-[-0.05em] text-dunav/10 md:block" aria-hidden="true">
                0{i + 1}
              </p>
            </div>
            <div className="relative aspect-[4/3] md:aspect-auto">
              <Image src={card.image} alt="" fill sizes="(min-width: 768px) 45vw, 92vw" quality={65} className="object-cover" />
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
