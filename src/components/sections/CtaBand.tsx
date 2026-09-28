import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { SplitReveal } from "@/components/ui/Reveal";

type Props = {
  label: string;
  title: string;
  text: string;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
  image?: { src: string; alt: string };
};

/** Closing call to action used at the end of inner pages. */
export function CtaBand({ label, title, text, primary, secondary, image }: Props) {
  return (
    <section className="theme-dark relative overflow-hidden" data-header="dark">
      {image && (
        <div className="absolute inset-0">
          <Image src={image.src} alt={image.alt} fill sizes="100vw" quality={60} className="object-cover opacity-35" />
        </div>
      )}
      <div className="wrap relative grid gap-10 py-24 md:grid-cols-[1.3fr_1fr] md:items-end md:py-32">
        <div>
          <p className="t-label text-accent">▽ {label}</p>
          <SplitReveal className="t-h1 mt-5 max-w-[15ch]">{title}</SplitReveal>
        </div>
        <div>
          <p className="t-lead text-kamen/85">{text}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={primary.href} variant="brass">
              {primary.label}
            </Button>
            {secondary && (
              <Button href={secondary.href} variant="outline">
                {secondary.label}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
