"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, isTouch, prefersReducedMotion } from "@/lib/gsap";

/**
 * Desktop cursor: a small level mark (▽) that trails the pointer. Over
 * elements with [data-cursor="label"] it opens into a brass disc with the label.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (isTouch() || prefersReducedMotion()) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- enable only after we know the pointer is fine
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");
    return () => document.documentElement.classList.remove("has-cursor");
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });
    let shown = false;
    const move = (e: PointerEvent) => {
      if (!shown) {
        gsap.set(el, { x: e.clientX, y: e.clientY });
        gsap.to(el, { opacity: 1, duration: 0.3 });
        shown = true;
      }
      xTo(e.clientX);
      yTo(e.clientY);
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor]");
      setLabel(target?.dataset.cursor ?? null);
    };
    const leave = () => {
      gsap.to(el, { opacity: 0, duration: 0.3 });
      shown = false;
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={ref} className="pointer-events-none fixed left-0 top-0 z-[400] opacity-0" aria-hidden="true">
      <div
        className="-translate-x-1/2 -translate-y-1/2 transition-[width,height,background-color,border-radius] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          width: label ? 104 : 18,
          height: label ? 104 : 14,
          borderRadius: label ? 999 : 0,
          backgroundColor: label ? "var(--mesing)" : "transparent",
        }}
      >
        {label ? (
          <span className="t-label flex h-full w-full items-center justify-center !text-[0.62rem] text-dunav">{label}</span>
        ) : (
          <svg viewBox="0 0 18 14" className="h-full w-full text-dunav mix-blend-difference" style={{ color: "#fff" }}>
            <path d="M1 1h16L9 13Z" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <path d="M1 1h8v12Z" fill="currentColor" />
          </svg>
        )}
      </div>
    </div>
  );
}
