"use client";

import { useCallback, useEffect, useRef, useState, ViewTransition } from "react";
import Image from "next/image";
import clsx from "clsx";
import type { Listing } from "@/content/listings";
import { photoSrc } from "@/content/listings";
import type { Locale } from "@/lib/i18n";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

type Props = { listing: Listing; locale: Locale; labels: { all: string; close: string; prev: string; next: string; photo: string } };

/**
 * Mosaic of the first photos (the cover morphs in from the listing card) and a
 * full-screen lightbox with swipe, drag, keyboard and a thumbnail strip.
 */
export function Gallery({ listing: l, locale, labels }: Props) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const total = l.photos.length;
  const stage = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const drag = useRef<{ x: number; dx: number; active: boolean }>({ x: 0, dx: 0, active: false });

  const show = useCallback(
    (next: number, dir: number) => {
      const n = (next + total) % total;
      setIndex(n);
      const el = stage.current;
      if (el && !prefersReducedMotion()) gsap.fromTo(el, { xPercent: dir * 6, opacity: 0.4 }, { xPercent: 0, opacity: 1, duration: 0.7, ease: "expo.out" });
    },
    [total],
  );

  const openAt = (i: number, from: HTMLElement) => {
    opener.current = from;
    setIndex(i);
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    window.__lenis?.stop();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") show(index + 1, 1);
      if (e.key === "ArrowLeft") show(index - 1, -1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.__lenis?.start();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, index, show]);

  useEffect(() => {
    if (open) document.getElementById("lb-close")?.focus();
    else opener.current?.focus();
  }, [open]);

  const onDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, dx: 0, active: true };
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current.active || !stage.current) return;
    drag.current.dx = e.clientX - drag.current.x;
    gsap.set(stage.current, { x: drag.current.dx * 0.6 });
  };
  const onUp = () => {
    if (!drag.current.active || !stage.current) return;
    const dx = drag.current.dx;
    drag.current.active = false;
    gsap.to(stage.current, { x: 0, duration: 0.5, ease: "expo.out" });
    if (Math.abs(dx) > 60) show(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  };

  const tiles = [1, 2, 3, 4];

  return (
    <>
      <div className="grid gap-2 md:h-[78svh] md:grid-cols-[1.6fr_1fr_1fr] md:grid-rows-2">
        <button
          type="button"
          onClick={(e) => openAt(0, e.currentTarget)}
          className="group relative aspect-[4/3] overflow-hidden md:row-span-2 md:aspect-auto"
          data-cursor={labels.all.split(" ")[0]}
          aria-label={`${labels.photo} 1 / ${total}: ${l.photos[0][locale]}`}
        >
          <ViewTransition name={`photo-${l.id}`} share="morph" default="none">
            <div className="absolute inset-0">
              <Image src={photoSrc(l, 0)} alt={l.photos[0][locale]} fill preload quality={75} sizes="(min-width: 768px) 58vw, 100vw" className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]" />
            </div>
          </ViewTransition>
        </button>
        {tiles.map((i) =>
          i < total ? (
            <button
              key={i}
              type="button"
              onClick={(e) => openAt(i, e.currentTarget)}
              className="anim-fade group relative hidden overflow-hidden md:block"
              style={{ ["--d" as string]: `${0.2 + i * 0.08}s` }}
              aria-label={`${labels.photo} ${i + 1} / ${total}: ${l.photos[i][locale]}`}
            >
              <Image src={photoSrc(l, i)} alt={l.photos[i][locale]} fill quality={65} sizes="21vw" className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
              {i === 4 && total > 5 && (
                <span className="absolute inset-0 grid place-items-center bg-dunav/55 text-kamen">
                  <span className="t-label">+{total - 5}</span>
                </span>
              )}
            </button>
          ) : null,
        )}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <button type="button" onClick={(e) => openAt(0, e.currentTarget)} className="link-u t-label py-2">
          ▦ {labels.all} ({total})
        </button>
        <span className="t-label text-muted md:hidden">1 / {total}</span>
      </div>

      {/* Lightbox */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={l.title[locale]}
        className={clsx(
          "theme-dark fixed inset-0 z-[500] flex flex-col transition-[opacity,visibility] duration-500",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <div className="wrap flex h-16 shrink-0 items-center justify-between">
          <p className="t-mono text-sm" aria-live="polite">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            <span className="ml-4 hidden text-muted sm:inline">{l.photos[index][locale]}</span>
          </p>
          <button id="lb-close" type="button" onClick={() => setOpen(false)} className="grid h-11 w-11 place-items-center rounded-full border border-line text-xl hover:bg-kamen hover:text-dunav" aria-label={labels.close} tabIndex={open ? 0 : -1}>
            ×
          </button>
        </div>
        <div
          className="relative flex-1 touch-pan-y select-none overflow-hidden"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onPointerLeave={onUp}
        >
          <div ref={stage} className="absolute inset-0">
            {open && (
              <Image key={index} src={photoSrc(l, index)} alt={l.photos[index][locale]} fill quality={85} sizes="100vw" className="pointer-events-none object-contain" draggable={false} />
            )}
          </div>
          <button type="button" onClick={() => show(index - 1, -1)} className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-dunav/60 text-xl backdrop-blur hover:bg-mesing hover:text-dunav" aria-label={labels.prev} tabIndex={open ? 0 : -1}>
            ←
          </button>
          <button type="button" onClick={() => show(index + 1, 1)} className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-dunav/60 text-xl backdrop-blur hover:bg-mesing hover:text-dunav" aria-label={labels.next} tabIndex={open ? 0 : -1}>
            →
          </button>
        </div>
        <div className="no-scrollbar flex shrink-0 gap-2 overflow-x-auto px-[var(--gutter)] py-4">
          {open &&
            l.photos.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => show(i, i > index ? 1 : -1)}
                className={clsx("relative h-16 w-24 shrink-0 overflow-hidden transition-opacity", i === index ? "opacity-100 outline outline-2 outline-mesing" : "opacity-45 hover:opacity-80")}
                aria-label={`${labels.photo} ${i + 1}: ${p[locale]}`}
                aria-current={i === index}
              >
                <Image src={photoSrc(l, i)} alt="" fill sizes="96px" quality={50} className="object-cover" />
              </button>
            ))}
        </div>
      </div>
    </>
  );
}
