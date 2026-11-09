"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { kota } from "@/lib/format";
import { after3DGate } from "@/lib/three-gate";
import type { BuildingScene } from "./model3d/BuildingScene";

/**
 * The hero's live 3D model (desktop only). The still rendered from it is already in the server
 * HTML; after load, lib/three-gate decides, and only then is three.js imported. The canvas fades in
 * over the still, which stays underneath as the fallback. Each slab's elevation is real text that
 * follows it on screen.
 */
export function HeroModel({ levels, names, featured }: { levels: number[]; names: string[]; featured: number }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const tags = useRef<(HTMLSpanElement | null)[]>([]);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let scene: BuildingScene | null = null;
    let disposed = false;
    const off: (() => void)[] = [];

    const cancel = after3DGate(async () => {
      const { createBuildingScene } = await import("./model3d/BuildingScene");
      const cv = canvas.current;
      const hero = cv?.closest<HTMLElement>("[data-hero-dark]");
      if (disposed || !cv || !hero) return;
      const readout = hero.querySelector<HTMLElement>("[data-hero-kota]");
      let shown = "";
      try {
        scene = createBuildingScene(cv, {
          levels,
          featured,
          onFirstFrame: () => {
            setLive(true);
            hero.setAttribute("data-live-3d", "");
          },
          onFrame: (labels, lift) => {
            labels.forEach((l, i) => {
              const el = tags.current[i];
              if (!el) return;
              el.style.transform = `translate3d(${l.x.toFixed(1)}px, ${l.y.toFixed(1)}px, 0)`;
              el.style.opacity = String(0.35 + 0.65 * l.on);
              el.toggleAttribute("data-on", l.on > 0.5);
            });
            const text = kota(Math.round(lift * 100) / 100);
            if (readout && text !== shown) readout.textContent = shown = text;
          },
        });
      } catch {
        return; // no WebGL after all: the still stays
      }
      const s = scene;
      if ((window as Window & { __kotaStill?: boolean }).__kotaStill) (window as Window & { __kota3d?: BuildingScene }).__kota3d = s;

      const onScroll = () => {
        const r = hero.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)));
        s.setProgress(p);
        hero.style.setProperty("--hero-p", p.toFixed(3));
      };
      const onMove = (e: PointerEvent) => s.setPointer((e.clientX / window.innerWidth) * 2 - 1, 1 - (e.clientY / window.innerHeight) * 2);
      const onLeave = () => s.setPointer(0, 0);
      const io = new IntersectionObserver(([en]) => s.setVisible(en.isIntersecting));
      const ro = new ResizeObserver(() => s.resize());
      io.observe(hero);
      ro.observe(cv);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      off.push(() => {
        io.disconnect();
        ro.disconnect();
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("pointermove", onMove);
        document.documentElement.removeEventListener("pointerleave", onLeave);
        hero.removeAttribute("data-live-3d");
        hero.style.removeProperty("--hero-p");
      });
    });

    return () => {
      disposed = true;
      cancel();
      off.forEach((f) => f());
      scene?.dispose();
    };
  }, [levels, featured]);

  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
      <canvas ref={canvas} className={clsx("absolute inset-0 h-full w-full transition-opacity duration-1000 ease-out", live ? "opacity-100" : "opacity-0")} />
      <div className={clsx("absolute inset-0 transition-opacity duration-700", live ? "opacity-100" : "opacity-0")}>
        {levels.map((k, i) => (
          <span
            key={k}
            ref={(el) => {
              tags.current[i] = el;
            }}
            className={clsx("absolute left-0 top-0 flex items-center gap-2 whitespace-nowrap [text-shadow:0_1px_10px_rgba(13,29,43,0.95)] will-change-transform", i === featured ? "text-mesing" : "text-kamen")}
          >
            <span className="h-px w-7 bg-current opacity-60" />
            <span className="t-label !tracking-[0.1em]">
              ▽ {kota(k)}
              <span className="opacity-75"> · {names[i]}</span>
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
