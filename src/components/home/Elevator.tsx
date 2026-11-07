import Image from "next/image";
import { homeCopy as c } from "@/content/home";
import type { Locale } from "@/lib/i18n";
import { kota } from "@/lib/format";
import { SplitReveal } from "@/components/ui/Reveal";
import { ElevatorScene } from "./ElevatorScene";

/**
 * Signature scene: the page rides an elevator. Text floors scroll past on the
 * left; on the right a sticky shaft swaps rooms with a rising clip, and a big
 * elevation readout counts up ±0.00 → +12.40. Phones get a simple stack.
 */
export function Elevator({ locale }: { locale: Locale }) {
  const floors = c.floors;

  return (
    <ElevatorScene>
      <div className="wrap pt-24 md:pt-36 phone:pt-10">
        <p className="t-label text-accent">▽ {c.elevatorLabel[locale]}</p>
        <SplitReveal id="elevator-title" className="t-h1 mt-5 max-w-[14ch] phone:mt-2">
          {c.elevatorTitle[locale]}
        </SplitReveal>
      </div>

      <div className="wrap grid gap-x-16 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.25fr)] motion-reduce:lg:grid-cols-1 phone:grid-cols-1! phone:pb-6 phone:pt-4">
        <div>
          {floors.map((f, i) => (
            <article
              key={i}
              data-floor
              data-kota={f.kota}
              data-floor-name={f.name[locale]}
              className="relative flex min-h-[70svh] flex-col justify-center border-b border-line py-16 last:border-0 lg:min-h-[100svh] phone:min-h-0! phone:border-0 phone:py-3.5 phone:pl-5"
            >
              {/* Phones: the shaft, a level line that draws itself once per floor */}
              <span data-draw className="shaft absolute bottom-0 left-0 top-0 w-px origin-top bg-accent/45 desk:hidden" aria-hidden="true" />
              <p className="t-label flex items-center gap-3 text-accent">
                <span className="t-mono text-[0.95rem] tracking-normal">{kota(f.kota)}</span>
                <span className="h-px w-8 bg-current" />
                {f.name[locale]}
              </p>
              <h3 className="t-h2 mt-5 max-w-[14ch] phone:mt-1.5 phone:max-w-none">{f.title[locale]}</h3>
              <p className="t-lead mt-6 max-w-[46ch] text-muted phone:mt-1.5">{f.text[locale]}</p>
              <div className="relative mt-10 aspect-[4/3] overflow-hidden lg:hidden motion-reduce:lg:block phone:mt-3 phone:block! phone:aspect-[2/1]">
                <Image src={f.image} alt={f.alt[locale]} fill sizes="92vw" quality={70} className="object-cover" />
                <span className="t-label absolute bottom-3 left-3 rounded-full bg-dunav/70 px-3 py-1.5 text-kamen backdrop-blur-sm">▽ {kota(f.kota)}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="relative hidden lg:block motion-reduce:lg:hidden phone:hidden!">
          <div className="sticky top-0 flex h-[100svh] items-center py-[9svh]">
            <div className="relative h-full w-full">
              {/* shaft */}
              <div data-shaft className="absolute -left-10 bottom-0 top-0 w-px bg-line" aria-hidden="true">
                <span data-marker className="absolute -left-[7px] bottom-0 text-[0.9rem] leading-none text-mesing">
                  ▽
                </span>
              </div>
              <div className="relative h-full w-full overflow-hidden">
                {floors.map((f, i) => (
                  <div key={i} data-layer className="absolute inset-0 overflow-hidden" style={{ zIndex: i }}>
                    <Image src={f.image} alt={f.alt[locale]} fill sizes="55vw" quality={75} className="object-cover" />
                  </div>
                ))}
                <div className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(180deg,rgba(13,29,43,0)_55%,rgba(13,29,43,0.7)_100%)]" />
                <div className="pointer-events-none absolute bottom-6 left-7 right-7 z-30 flex items-end justify-between text-kreda" aria-hidden="true">
                  <span data-readout className="t-mono text-[clamp(3rem,6vw,6.5rem)] leading-none tracking-[-0.04em]">
                    {kota(0)}
                  </span>
                  <span data-name className="t-label mb-3">
                    {floors[0].name[locale]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ElevatorScene>
  );
}
