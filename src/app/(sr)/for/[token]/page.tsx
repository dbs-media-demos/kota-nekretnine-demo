import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomeView } from "@/views/HomeView";
import { previewBiz } from "@/lib/preview";

// Always the CRM's current data: an edit there shows on the next reload
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ token: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const biz = await previewBiz((await params).token);
  const robots = { index: false, follow: false, googleBot: { index: false, follow: false } };
  if (!biz) return { title: "Preview not found", robots };
  const title = `${biz.name} | Nekretnine, ${biz.area}`;
  const description = `Stanovi i kuće — ${biz.area}. Izmerene kvadrature, provereni papiri, besplatna procena. Pozovite ${biz.phoneDisplay || "nas"}.`;
  return {
    title: { absolute: title },
    description,
    robots,
    alternates: { canonical: null, languages: {} },
    openGraph: { type: "website", siteName: biz.name, title, description, images: [] },
    twitter: { card: "summary", title, description },
  };
}

export default async function PreviewPage({ params }: Props) {
  const found = await previewBiz((await params).token);
  if (!found) notFound();
  return <HomeView locale="sr" biz={{ ...found, lang: "sr" }} />;
}
