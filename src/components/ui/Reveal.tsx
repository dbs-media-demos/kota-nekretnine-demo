"use client";

import { useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import clsx from "clsx";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion, loadSplitText } from "@/lib/gsap";

/*
 * Scroll-driven reveals.
 *
 * Content is visible in the HTML. `immediate` variants (top of the page) use
 * CSS keyframes so they paint without waiting for hydration (LCP). Everything
 * else is hidden with opacity only while it is still below the fold.
 */

const belowFold = (el: Element) => el.getBoundingClientRect().top > window.innerHeight * 0.92;
const delayStyle = (d: number) => ({ "--d": `${d}s` }) as CSSProperties;

type SplitProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  immediate?: boolean;
  stagger?: number;
  id?: string;
};

/** Headline that rises line by line out of a mask. */
export function SplitReveal({ children, as: Tag = "h2", className, delay = 0, immediate, stagger = 0.09, id }: SplitProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || immediate || prefersReducedMotion() || !belowFold(el)) return;
      gsap.set(el, { opacity: 0 });
      let split: { revert: () => void } | null = null;
      let cancelled = false;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          io.disconnect();
          loadSplitText().then((SplitText) => {
            if (cancelled) return;
            split = SplitText.create(el, {
              type: "lines",
              mask: "lines",
              autoSplit: true,
              onSplit(self) {
                gsap.set(el, { opacity: 1 });
                return gsap.from(self.lines, { yPercent: 115, duration: 1.3, stagger, delay, ease: "expo.out" });
              },
            });
          });
        },
        { rootMargin: "0px 0px -8% 0px" },
      );
      io.observe(el);
      return () => {
        cancelled = true;
        io.disconnect();
        split?.revert();
      };
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={clsx(immediate && "anim-heading", className)} style={immediate ? delayStyle(delay) : undefined}>
      {children}
    </Tag>
  );
}

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  y?: number;
  stagger?: number;
  immediate?: boolean;
  id?: string;
};

/** Fade + rise when scrolled into view. */
export function Reveal({ children, as: Tag = "div", className, delay = 0, y = 36, stagger, immediate, id }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || immediate || prefersReducedMotion() || !belowFold(el)) return;
      const targets = stagger ? Array.from(el.children) : [el];
      gsap.set(targets, { opacity: 0, y });
      ScrollTrigger.create({
        trigger: el,
        start: "top 92%",
        once: true,
        onEnter: () =>
          gsap.to(targets, { opacity: 1, y: 0, duration: 1.2, delay, stagger: stagger ?? 0, ease: "expo.out", clearProps: "transform" }),
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={clsx(immediate && "anim-fade", className)} style={immediate ? delayStyle(delay) : undefined}>
      {children}
    </Tag>
  );
}

/** Paragraph whose words brighten one by one as you scroll through it. */
export function ScrubWords({ text, className, as: Tag = "p" }: { text: string; className?: string; as?: ElementType }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const words = el.querySelectorAll<HTMLElement>("[data-w]");
      gsap.fromTo(
        words,
        // Starts around 3:1 contrast (large display text) so it stays readable before scrolling.
        { opacity: 0.55 },
        { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 50%", scrub: 0.6 } },
      );
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} data-w>
          {w}{" "}
        </span>
      ))}
    </Tag>
  );
}

/** Image frame that unmasks on enter and drifts with scroll. The first child is the moving layer. */
export function Parallax({
  children,
  className,
  amount = 12,
  reveal = true,
  style,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
  reveal?: boolean;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      const inner = el?.firstElementChild as HTMLElement | null;
      if (!el || !inner || prefersReducedMotion()) return;
      gsap.set(inner, { scale: 1 + amount / 100 });
      gsap.fromTo(
        inner,
        { yPercent: -amount / 2 },
        { yPercent: amount / 2, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
      );
      if (reveal && belowFold(el)) {
        gsap.fromTo(
          el,
          { clipPath: "inset(14% 10% 14% 10%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 90%", once: true } },
        );
      }
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={clsx("relative overflow-hidden", className)} style={style}>
      {children}
    </div>
  );
}

/** Architectural dimension line that draws itself: |←—— label ——→| */
export function DimLine({ label, className, vertical }: { label: string; className?: string; vertical?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion() || !belowFold(el)) return;
      const lines = el.querySelectorAll("[data-l]");
      const text = el.querySelector("[data-t]");
      gsap.set(lines, { scaleX: vertical ? 1 : 0, scaleY: vertical ? 0 : 1 });
      gsap.set(text, { opacity: 0 });
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () => {
          gsap.to(lines, { scaleX: 1, scaleY: 1, duration: 1.4, ease: "expo.out" });
          gsap.to(text, { opacity: 1, duration: 0.8, delay: 0.5 });
        },
      });
    },
    { scope: ref },
  );

  if (vertical) {
    return (
      <div ref={ref} className={clsx("flex h-full flex-col items-center gap-2 text-current", className)} aria-hidden="true">
        <span className="h-2 w-px bg-current" />
        <span data-l className="w-px flex-1 origin-bottom bg-current opacity-50" />
        <span data-t className="t-label [writing-mode:vertical-rl]">
          {label}
        </span>
        <span data-l className="w-px flex-1 origin-top bg-current opacity-50" />
        <span className="h-2 w-px bg-current" />
      </div>
    );
  }
  return (
    <div ref={ref} className={clsx("flex items-center gap-2 text-current", className)} aria-hidden="true">
      <span className="h-2.5 w-px bg-current" />
      <span data-l className="h-px flex-1 origin-right bg-current opacity-50" />
      <span data-t className="t-label whitespace-nowrap">
        {label}
      </span>
      <span data-l className="h-px flex-1 origin-left bg-current opacity-50" />
      <span className="h-2.5 w-px bg-current" />
    </div>
  );
}

/** Number that counts up when it scrolls into view. */
export function Counter({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
  locale = "sr",
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  locale?: "sr" | "en";
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const fmt = (v: number) =>
    new Intl.NumberFormat(locale === "sr" ? "sr-Latn-RS" : "en-GB", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(v);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion() || !belowFold(el)) return;
      const obj = { v: 0 };
      el.textContent = prefix + fmt(0) + suffix;
      ScrollTrigger.create({
        trigger: el,
        start: "top 92%",
        once: true,
        onEnter: () =>
          gsap.to(obj, {
            v: value,
            duration: 2,
            ease: "power3.out",
            onUpdate: () => {
              el.textContent = prefix + fmt(obj.v) + suffix;
            },
          }),
      });
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={className}>
      {prefix + fmt(value) + suffix}
    </span>
  );
}

export { ScrollTrigger };
