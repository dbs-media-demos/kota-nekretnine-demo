"use client";

import { useRef } from "react";
import Link from "next/link";
import { ListingCard } from "@/components/listings/ListingCard";
import type { Listing } from "@/content/listings";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/i18n/dictionary";
import { gsap, useGSAP } from "@/lib/gsap";

type Props = { locale: Locale; dict: Dictionary; items: Listing[]; label: string; title: string; allLabel: string; allHref: string };

/** Horizontal gallery that scrolls sideways while the section is pinned (desktop); swipeable on phones. */
export function FeaturedRail({ locale, dict, items, label, title, allLabel, allHref }: Props) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
        // Cards tilt slightly with the scroll velocity.
        gsap.utils.toArray<HTMLElement>("[data-card]", el).forEach((card, i) => {
          gsap.fromTo(
            card,
            { y: i % 2 ? 60 : 0 },
            { y: i % 2 ? -20 : 40, ease: "none", scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "right left", scrub: true } },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="theme-light relative overflow-hidden lg:h-[100svh]" data-header="light" aria-labelledby="featured-title">
      <div
        ref={track}
        className="no-scrollbar flex h-full snap-x snap-mandatory items-center gap-6 overflow-x-auto px-[var(--gutter)] py-24 lg:snap-none lg:gap-[4vw] lg:overflow-visible lg:py-0 motion-reduce:lg:snap-x motion-reduce:lg:overflow-x-auto"
      >
        <div className="w-[82vw] shrink-0 snap-start sm:w-[50vw] lg:w-[34vw]">
          <p className="t-label text-accent">▽ {label}</p>
          <h2 id="featured-title" className="t-h1 mt-5">
            {title}
          </h2>
          <Link href={allHref} className="link-u t-label mt-10 inline-block py-2">
            {allLabel} →
          </Link>
        </div>
        {items.map((l, i) => (
          <div key={l.id} data-card className="w-[78vw] shrink-0 snap-start sm:w-[44vw] lg:w-[24vw]">
            <ListingCard listing={l} locale={locale} dict={dict} sizes="(min-width: 1024px) 24vw, 78vw" priority={false} morph={i < 6} />
          </div>
        ))}
        <Link
          href={allHref}
          className="group flex aspect-[4/5] w-[70vw] shrink-0 snap-start flex-col justify-between border border-line p-8 transition-colors duration-500 hover:bg-dunav hover:text-kamen sm:w-[40vw] lg:w-[22vw]"
        >
          <span className="t-label">▽ +∞</span>
          <span className="t-h3">{allLabel}</span>
          <span className="text-4xl transition-transform duration-500 group-hover:translate-x-3">→</span>
        </Link>
        <span className="w-[var(--gutter)] shrink-0 lg:w-[2vw]" aria-hidden="true" />
      </div>
    </section>
  );
}
