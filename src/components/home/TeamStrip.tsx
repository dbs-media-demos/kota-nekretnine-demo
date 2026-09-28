import Image from "next/image";
import Link from "next/link";
import { agents } from "@/content/agents";
import type { Locale } from "@/lib/i18n";
import { Reveal } from "@/components/ui/Reveal";

export function TeamStrip({ locale, label, title, allLabel, allHref }: { locale: Locale; label: string; title: string; allLabel: string; allHref: string }) {
  return (
    <section className="theme-light py-24 md:py-36" data-header="light" aria-labelledby="team-title">
      <div className="wrap">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="t-label text-accent">▽ {label}</p>
            <h2 id="team-title" className="t-h1 mt-5 max-w-[16ch]">
              {title}
            </h2>
          </div>
          <Link href={allHref} className="link-u t-label w-fit py-2">
            {allLabel} →
          </Link>
        </div>
        <Reveal as="ul" stagger={0.08} className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-5">
          {agents.map((a, i) => (
            <li key={a.id} className={i % 2 ? "md:mt-16" : undefined}>
              <Link href={allHref} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden bg-surface-2">
                  <Image
                    src={a.image}
                    alt={a.name}
                    fill
                    sizes="(min-width: 768px) 19vw, 46vw"
                    quality={70}
                    className="object-cover grayscale-[35%] transition-[transform,filter] duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:grayscale-0"
                    style={{ objectPosition: a.focus }}
                  />
                </div>
                <p className="mt-4 font-serif text-[1.3rem] leading-tight">{a.name}</p>
                <p className="t-label mt-1.5 text-muted">{a.role[locale]}</p>
              </Link>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
