"use client";

import { useRef, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { hoods, landmarks, river, bridges, type HoodId } from "@/content/neighbourhoods";
import type { Locale } from "@/lib/i18n";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

export type MapPin = { id: string; at: [number, number]; label: string; href?: string };

type Props = {
  locale: Locale;
  pins?: MapPin[];
  activePin?: string | null;
  onPinHover?: (id: string | null) => void;
  activeHood?: HoodId | null;
  onHoodHover?: (id: HoodId | null) => void;
  hoodHref?: (id: HoodId) => string | undefined;
  showLandmarks?: boolean;
  className?: string;
  title: string;
  /** Crop the viewBox, e.g. to zoom into one neighbourhood. */
  viewBox?: string;
  animate?: boolean;
};

/** Hand-drawn, architectural-style map of Novi Sad. */
export function NoviSadMap({
  locale,
  pins = [],
  activePin,
  onPinHover,
  activeHood,
  onHoodHover,
  hoodHref,
  showLandmarks = true,
  className,
  title,
  viewBox = "0 60 1000 640",
  animate = true,
}: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const router = useRouter();
  const go = (href: string) => (e: MouseEvent) => {
    e.preventDefault();
    router.push(href);
  };

  useGSAP(
    () => {
      const svg = ref.current;
      if (!svg || !animate || prefersReducedMotion()) return;
      if (svg.getBoundingClientRect().top < window.innerHeight * 0.9) return;
      const riverEl = svg.querySelector<SVGPathElement>("[data-river]");
      const shapes = svg.querySelectorAll("[data-hood]");
      const pinEls = svg.querySelectorAll("[data-pin]");
      const len = riverEl?.getTotalLength() ?? 0;
      const tl = gsap.timeline({ scrollTrigger: { trigger: svg, start: "top 80%", once: true } });
      if (riverEl) tl.fromTo(riverEl, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 2, ease: "power2.inOut" });
      tl.fromTo(shapes, { opacity: 0 }, { opacity: 1, duration: 0.8, stagger: 0.06 }, 0.4);
      tl.fromTo(pinEls, { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.04, ease: "back.out(2)" }, 1);
    },
    { scope: ref, dependencies: [animate] },
  );

  return (
    <svg ref={ref} viewBox={viewBox} className={clsx("block h-auto w-full select-none", className)} role="img" aria-label={title}>
      <title>{title}</title>
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="currentColor" strokeOpacity="0.06" strokeWidth="1" />
        </pattern>
        <pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0V7" stroke="#b8915a" strokeOpacity="0.45" strokeWidth="1.2" />
        </pattern>
      </defs>

      <rect x="-20" y="0" width="1040" height="720" fill="url(#grid)" />

      {/* Fruška Gora contours on the south bank */}
      <g fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1">
        <path d="M-20 690 C 150 660, 300 700, 460 670 S 760 700, 1020 640" />
        <path d="M-20 712 C 180 680, 330 720, 520 690 S 800 720, 1020 670" />
        <path d="M560 660 C 640 630, 760 650, 900 590 S 980 560, 1020 560" />
      </g>

      {/* Neighbourhoods */}
      <g>
        {hoods.map((h) => {
          const active = activeHood === h.id;
          const href = hoodHref?.(h.id);
          const shape = (
            <path
              data-hood
              d={h.shape}
              fill={active ? "url(#hatch)" : "transparent"}
              stroke="currentColor"
              strokeOpacity={active ? 0.9 : 0.42}
              strokeWidth={active ? 1.6 : 1}
              strokeDasharray={active ? undefined : "4 5"}
              className="transition-[stroke-opacity] duration-500"
              onPointerEnter={() => onHoodHover?.(h.id)}
              onPointerLeave={() => onHoodHover?.(null)}
            />
          );
          return (
            <g key={h.id}>
              {href ? (
                <a href={href} aria-label={h.name[locale]} onClick={go(href)}>
                  {shape}
                </a>
              ) : (
                shape
              )}
              <text
                x={h.center[0]}
                y={h.center[1]}
                textAnchor="middle"
                className="pointer-events-none font-mono uppercase"
                fontSize="17"
                letterSpacing="2.5"
                fill="currentColor"
                fillOpacity={active ? 1 : 0.7}
              >
                {h.name[locale]}
              </text>
            </g>
          );
        })}
      </g>

      {/* Danube */}
      <path d={river} fill="none" stroke="#2e5470" strokeOpacity="0.16" strokeWidth="58" strokeLinecap="round" />
      <path data-river d={river} fill="none" stroke="#2e5470" strokeOpacity="0.55" strokeWidth="1.5" />
      <text className="font-serif italic" fontSize="28" fill="#2e5470" fillOpacity="0.8">
        <textPath href="#river-label" startOffset="12%">
          Dunav
        </textPath>
      </text>
      <path id="river-label" d="M-20 596 C 120 602, 260 594, 360 562" fill="none" />

      {/* Bridges */}
      <g stroke="currentColor" strokeWidth="3" strokeOpacity="0.55" strokeLinecap="round">
        {bridges.map((b) => (
          <path key={b.d} d={b.d}>
            <title>{b.name[locale]}</title>
          </path>
        ))}
      </g>

      {/* Landmarks */}
      {showLandmarks && (
        <g>
          {landmarks.map((l) => (
            <g key={l.id} transform={`translate(${l.at[0]} ${l.at[1]})`}>
              <rect x="-4" y="-4" width="8" height="8" fill="#b8915a" transform="rotate(45)" />
              <text x="10" y="5" fontSize="14" className="font-sans" fill="currentColor" fillOpacity="0.8">
                {l.name[locale]}
              </text>
            </g>
          ))}
        </g>
      )}

      {/* Listing pins: the kota mark ▽ */}
      <g>
        {pins.map((p) => {
          const active = activePin === p.id;
          const pin = (
            <g
              data-pin
              transform={`translate(${p.at[0]} ${p.at[1]})`}
              onPointerEnter={() => onPinHover?.(p.id)}
              onPointerLeave={() => onPinHover?.(null)}
              className="cursor-pointer"
            >
              <g
                style={{ transform: active ? "scale(1.5)" : "scale(1)", transformBox: "fill-box", transformOrigin: "50% 100%" }}
                className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              >
                <path d="M-11 -22h22L0 0Z" fill={active ? "#13283b" : "#eee8df"} stroke="#13283b" strokeWidth="1.5" />
                <path d="M-11 -22h11V0Z" fill={active ? "#b8915a" : "#13283b"} />
              </g>
              {active && (
                <g transform="translate(0 -46)">
                  <rect x={-p.label.length * 4 - 12} y="-14" width={p.label.length * 8 + 24} height="26" rx="13" fill="#13283b" />
                  <text textAnchor="middle" y="4" fontSize="13" className="font-mono" fill="#eee8df">
                    {p.label}
                  </text>
                </g>
              )}
            </g>
          );
          return p.href ? (
            <a key={p.id} href={p.href} aria-label={p.label} onClick={go(p.href)}>
              {pin}
            </a>
          ) : (
            <g key={p.id}>{pin}</g>
          );
        })}
      </g>

      {/* North arrow + scale bar */}
      <g transform="translate(940 110)" fill="currentColor" fillOpacity="0.7">
        <path d="M0 -26 L8 4 L0 -2 L-8 4Z" />
        <text y="22" textAnchor="middle" fontSize="12" className="font-mono">
          N
        </text>
      </g>
      <g transform="translate(60 670)" stroke="currentColor" strokeOpacity="0.7" fill="currentColor" fillOpacity="0.7">
        <path d="M0 0H67M0 -5V5M67 -5V5M33 -3V3" strokeWidth="1.2" fill="none" />
        <text x="80" y="4" fontSize="11" stroke="none" className="font-mono">
          500 m
        </text>
      </g>
    </svg>
  );
}
