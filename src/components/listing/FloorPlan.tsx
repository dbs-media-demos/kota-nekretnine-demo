"use client";

import { useRef } from "react";
import { plans, planArea, type PlanKey } from "@/content/plans";
import type { Locale } from "@/lib/i18n";
import { num } from "@/lib/format";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const U = 40; // svg units per metre

/** Measured-looking floor plan. Walls draw themselves, then room areas fade in. */
export function FloorPlan({ plan, area, locale, title }: { plan: PlanKey; area: number; locale: Locale; title: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const def = plans[plan];
  const s = Math.sqrt(area / planArea(plan));
  const rooms = def.rooms.map((r) => ({ ...r, x: r.x * s, y: r.y * s, w: r.w * s, h: r.h * s }));
  const minX = Math.min(...rooms.map((r) => r.x));
  const minY = Math.min(...rooms.map((r) => r.y));
  const maxX = Math.max(...rooms.map((r) => r.x + r.w));
  const maxY = Math.max(...rooms.map((r) => r.y + r.h));
  const indoor = rooms.filter((r) => !r.outdoor);
  const inMinY = Math.min(...indoor.map((r) => r.y));
  const inMaxY = Math.max(...indoor.map((r) => r.y + r.h));
  const inMaxX = Math.max(...indoor.map((r) => r.x + r.w));
  const pad = 70;
  const vb = `${minX * U - pad} ${minY * U - pad} ${(maxX - minX) * U + pad * 2} ${(maxY - minY) * U + pad * 2}`;

  useGSAP(
    () => {
      const svg = ref.current;
      if (!svg || prefersReducedMotion()) return;
      if (svg.getBoundingClientRect().top < window.innerHeight * 0.85) return;
      const walls = svg.querySelectorAll<SVGRectElement>("[data-wall]");
      const labels = svg.querySelectorAll("[data-label]");
      const dims = svg.querySelectorAll("[data-dim]");
      walls.forEach((w) => {
        const len = 2 * (w.width.baseVal.value + w.height.baseVal.value);
        gsap.set(w, { strokeDasharray: len, strokeDashoffset: len });
      });
      gsap.set(labels, { opacity: 0 });
      gsap.set(dims, { opacity: 0 });
      gsap
        .timeline({ scrollTrigger: { trigger: svg, start: "top 80%", once: true } })
        .to(walls, { strokeDashoffset: 0, duration: 1.6, stagger: 0.12, ease: "power2.inOut" })
        .to(dims, { opacity: 1, duration: 0.6 }, "-=0.6")
        .to(labels, { opacity: 1, duration: 0.6, stagger: 0.06 }, "-=0.4");
    },
    { scope: ref },
  );

  const fmt = (m: number) => `${num(m, locale, 2)} m`;

  return (
    <figure>
      <svg ref={ref} viewBox={vb} className="h-auto w-full text-dunav" role="img" aria-label={title}>
        <defs>
          <pattern id="deck" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <path d="M0 0V8" stroke="#b8915a" strokeOpacity="0.5" strokeWidth="1.5" />
          </pattern>
        </defs>
        {rooms.map((r, i) => (
          <g key={i}>
            <rect
              data-wall
              x={r.x * U}
              y={r.y * U}
              width={r.w * U}
              height={r.h * U}
              fill={r.outdoor ? "url(#deck)" : "#f8f5f0"}
              stroke="currentColor"
              strokeWidth={r.outdoor ? 1.5 : 5}
              strokeDasharray={r.outdoor ? "6 6" : undefined}
            />
            <g data-label>
              <text x={(r.x + r.w / 2) * U} y={(r.y + r.h / 2) * U - 4} textAnchor="middle" fontSize={r.w * U < 110 ? 11 : 14} className="font-sans" fill="currentColor">
                {r.label[locale]}
              </text>
              <text x={(r.x + r.w / 2) * U} y={(r.y + r.h / 2) * U + 16} textAnchor="middle" fontSize="12" className="font-mono" fill="#7c5e2f">
                {num(r.w * r.h, locale, 1)} m²
              </text>
            </g>
          </g>
        ))}
        {/* Overall dimensions */}
        <g data-dim stroke="currentColor" strokeWidth="1" fill="currentColor">
          <path d={`M${minX * U} ${minY * U - 36}H${inMaxX * U}M${minX * U} ${minY * U - 44}V${minY * U - 28}M${inMaxX * U} ${minY * U - 44}V${minY * U - 28}`} />
          <text x={((minX + inMaxX) / 2) * U} y={minY * U - 44} textAnchor="middle" fontSize="13" stroke="none" className="font-mono">
            {fmt(inMaxX - minX)}
          </text>
          <path d={`M${minX * U - 36} ${inMinY * U}V${inMaxY * U}M${minX * U - 44} ${inMinY * U}H${minX * U - 28}M${minX * U - 44} ${inMaxY * U}H${minX * U - 28}`} />
          <text
            x={minX * U - 46}
            y={((inMinY + inMaxY) / 2) * U}
            textAnchor="middle"
            fontSize="13"
            stroke="none"
            className="font-mono"
            transform={`rotate(-90 ${minX * U - 46} ${((inMinY + inMaxY) / 2) * U})`}
          >
            {fmt(inMaxY - inMinY)}
          </text>
        </g>
      </svg>
      {def.note && <figcaption className="mt-4 text-sm text-muted">{def.note[locale]}</figcaption>}
    </figure>
  );
}
