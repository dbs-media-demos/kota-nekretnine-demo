"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * Second photo shown on card hover. It mounts only after the card is first
 * hovered (pointer devices), so it never competes with the page's first load.
 */
export function HoverPhoto({ src, sizes }: { src: string; sizes: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const card = ref.current?.closest("article");
    if (!card || window.matchMedia("(hover: none)").matches) return;
    const arm = () => setArmed(true);
    card.addEventListener("pointerenter", arm, { once: true });
    card.addEventListener("focusin", arm, { once: true });
    return () => {
      card.removeEventListener("pointerenter", arm);
      card.removeEventListener("focusin", arm);
    };
  }, []);

  return (
    <span ref={ref} className="absolute inset-0" aria-hidden="true">
      {armed && (
        <Image src={src} alt="" fill sizes={sizes} quality={60} className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
      )}
    </span>
  );
}
