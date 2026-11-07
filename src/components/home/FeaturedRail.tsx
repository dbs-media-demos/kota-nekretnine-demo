"use client";

import { Children, useRef, type ReactNode } from "react";
import Link from "@/components/ui/SiteLink";
import { useDeskMotion } from "@/lib/motion";

type Props = { label: string; title: string; allLabel: string; allHref: string; children: ReactNode };

/** Horizontal gallery that scrolls sideways while the section is pinned (desktop); swipeable on phones with the next photo half showing. */
export function FeaturedRail({ label, title, allLabel, allHref, children }: Props) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useDeskMotion(
    ({ gsap }) => {
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
    <section ref={root} className="theme-light relative overflow-hidden lg:h-[100svh] phone:h-auto! phone:py-9" data-header="light" aria-labelledby="featured-title">
      <div
        ref={track}
        data-rail
        className="no-scrollbar flex h-full snap-x snap-mandatory items-center gap-6 overflow-x-auto px-[var(--gutter)] py-24 lg:snap-none lg:gap-[4vw] lg:overflow-visible lg:py-0 motion-reduce:lg:snap-x motion-reduce:lg:overflow-x-auto phone:grid! phone:h-auto! phone:snap-x! phone:auto-cols-[var(--rail-w)] phone:grid-flow-col phone:grid-rows-[auto_auto] phone:items-start phone:gap-x-2.5! phone:gap-y-4 phone:overflow-x-auto! phone:py-0! phone:[scroll-padding-inline:var(--gutter)]"
      >
        {/* Phones: stays put above the photos while they swipe */}
        <div className="w-[82vw] shrink-0 snap-start sm:w-[50vw] lg:w-[34vw] phone:sticky phone:left-0 phone:w-[calc(100vw-2*var(--gutter))]! phone:snap-none" style={{ gridColumn: `1 / span ${Children.count(children) + 1}` }}>
          <p className="t-label text-accent">▽ {label}</p>
          <h2 id="featured-title" className="t-h1 mt-5 phone:mt-2">
            {title}
          </h2>
          <Link href={allHref} className="link-u t-label mt-10 inline-block py-2 phone:mt-1">
            {allLabel} →
          </Link>
        </div>
        {children}
        <Link
          href={allHref}
          className="group flex aspect-[4/5] w-[70vw] shrink-0 snap-start flex-col justify-between border border-line p-8 transition-colors duration-500 hover:bg-dunav hover:text-kamen sm:w-[40vw] lg:w-[22vw] phone:row-start-2 phone:aspect-[3/4] phone:w-auto! phone:p-5"
        >
          <span className="t-label">▽ +∞</span>
          <span className="t-h3">{allLabel}</span>
          <span className="text-4xl transition-transform duration-500 group-hover:translate-x-3">→</span>
        </Link>
        <span className="w-[var(--gutter)] shrink-0 lg:w-[2vw] phone:hidden" aria-hidden="true" />
      </div>
    </section>
  );
}
