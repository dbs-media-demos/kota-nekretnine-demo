import { notFound } from "next/navigation";
import { ListingView } from "@/views/ListingView";
import { listings, coverSrc } from "@/content/listings";
import { hoodById } from "@/content/neighbourhoods";
import { buildMetadata } from "@/lib/seo";
import { detailAlternates } from "@/lib/routes";

const L = "en" as const;
const find = (slug: string) => listings.find((l) => l.slug[L] === slug);

export const dynamicParams = false;

export function generateStaticParams() {
  return listings.map((l) => ({ slug: l.slug[L] }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const l = find((await params).slug);
  if (!l) return {};
  return buildMetadata({
    locale: L,
    title: l.title[L],
    description: `${l.summary[L]} ${hoodById(l.hood).name[L]}, Novi Sad.`,
    alternates: detailAlternates("listings", l.slug),
    eyebrow: hoodById(l.hood).name[L],
    ogImage: coverSrc(l),
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const l = find((await params).slug);
  if (!l) notFound();
  return <ListingView listing={l} locale={L} />;
}
