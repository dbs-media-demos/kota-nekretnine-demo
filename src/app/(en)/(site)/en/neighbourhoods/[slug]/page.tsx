import { notFound } from "next/navigation";
import { HoodView } from "@/views/HoodView";
import { guidedHoods } from "@/content/neighbourhoods";
import { buildMetadata } from "@/lib/seo";
import { detailAlternates } from "@/lib/routes";
import { eur } from "@/lib/format";

const L = "en" as const;
const TITLE = "neighbourhood guide, prices and life";
const find = (slug: string) => guidedHoods.find((h) => h.slug![L] === slug);

export const dynamicParams = false;

export function generateStaticParams() {
  return guidedHoods.map((h) => ({ slug: h.slug![L] }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const h = find((await params).slug);
  if (!h) return {};
  const title = `${h.name[L]}: ${TITLE}`;
  return buildMetadata({
    locale: L,
    title,
    description: `${h.tagline[L]} ${eur(h.pricePerM2, L)}/m². ${h.intro![L].split(". ")[0]}.`,
    alternates: detailAlternates("hoods", h.slug!),
    eyebrow: h.name[L],
    ogImage: h.hero!.src,
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const h = find((await params).slug);
  if (!h) notFound();
  return <HoodView hood={h} locale={L} />;
}
