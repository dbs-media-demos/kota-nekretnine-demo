"use client";

import { useRef } from "react";
import Image from "next/image";
import type { Img } from "@/content/neighbourhoods";
import type { Locale } from "@/lib/i18n";
import { gsap, useGSAP } from "@/lib/gsap";

/** Three columns of photos drifting at different speeds as you scroll. */
export function ParallaxGallery({ images, locale }: { images: Img[]; locale: Locale }) {
  const root = useRef<HTMLDivElement>(null);
  const cols: Img[][] = [[], [], []];
  images.forEach((img, i) => cols[i % 3].push(img));

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const speeds = [-60, 90, -30];
        gsap.utils.toArray<HTMLElement>("[data-col]", root.current).forEach((col, i) => {
          gsap.fromTo(col, { y: -speeds[i] }, { y: speeds[i], ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
      {cols.map((col, c) => (
        <div key={c} data-col className={c === 1 ? "grid gap-3 md:mt-24 md:gap-5" : "grid gap-3 md:gap-5"}>
          {col.map((img) => (
            <figure key={img.src} className={img.portrait ? "relative aspect-[3/4] overflow-hidden" : "relative aspect-[4/3] overflow-hidden"}>
              <Image src={img.src} alt={img.alt[locale]} fill sizes="(min-width: 768px) 31vw, 48vw" quality={65} className="object-cover" />
            </figure>
          ))}
        </div>
      ))}
    </div>
  );
}
