import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import clsx from "clsx";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { kota as fmtKota } from "@/lib/format";

const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

type Props = {
  crumbs: Crumb[];
  label: string;
  title: ReactNode;
  lead?: ReactNode;
  kota?: number;
  image?: { src: string; alt: string; position?: string };
  children?: ReactNode;
  titleClass?: string;
};

/**
 * Inner-page hero. With an image it runs full-bleed on dark; without, it's a
 * big limestone title block. CSS-only intro so the heading paints immediately.
 */
export function PageHero({ crumbs, label, title, lead, kota, image, children, titleClass }: Props) {
  if (image) {
    return (
      <section data-header="dark" className="theme-dark relative flex min-h-[86svh] items-end overflow-hidden">
        <div className="anim-mask absolute inset-0" style={d(0)}>
          <Image src={image.src} alt={image.alt} fill preload quality={75} sizes="100vw" className="object-cover" style={{ objectPosition: image.position ?? "50% 50%" }} />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,29,43,0.55)_0%,rgba(13,29,43,0.1)_35%,rgba(13,29,43,0.85)_100%)]" />
        <div className="wrap relative pb-12 pt-[calc(var(--header-h)+3rem)] md:pb-16">
          <Breadcrumbs items={crumbs} className="anim-fade mb-10 text-kamen/85" />
          <p className="anim-fade t-label text-mesing" style={d(0.15)}>
            ▽ {kota !== undefined ? `${fmtKota(kota)} · ` : ""}
            {label}
          </p>
          <h1 className={clsx("anim-heading t-h1 mt-5 max-w-[16ch] text-kreda", titleClass)} style={d(0.1)}>
            {title}
          </h1>
          {lead && (
            <div className="t-lead mt-6 max-w-[52ch] text-kamen/90">
              {lead}
            </div>
          )}
          {children}
        </div>
      </section>
    );
  }
  return (
    <section data-header="light" className="theme-light relative pt-[calc(var(--header-h)+2.5rem)]">
      <div className="wrap pb-12 md:pb-20">
        <Breadcrumbs items={crumbs} className="anim-fade mb-12 text-muted" />
        <div className="flex items-center gap-4">
          <p className="anim-fade t-label text-accent" style={d(0.15)}>
            ▽ {kota !== undefined ? `${fmtKota(kota)} · ` : ""}
            {label}
          </p>
          <span className="anim-draw-x h-px flex-1 bg-line" style={d(0.3)} />
        </div>
        <h1 className={clsx("anim-heading t-display mt-6 max-w-[14ch]", titleClass)} style={d(0.1)}>
          {title}
        </h1>
        {lead && (
          <div className="t-lead mt-8 max-w-[56ch] text-muted">
            {lead}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
