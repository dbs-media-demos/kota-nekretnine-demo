import { HomeView } from "@/views/HomeView";
import { homeCopy } from "@/content/home";
import { buildMetadata } from "@/lib/seo";
import { pageAlternates } from "@/lib/routes";

const L = "en" as const;

/** The homepage without 3D (slow laptops, or a lead who'd rather not): only the hero differs from `/`. */
export const metadata = {
  ...buildMetadata({
    locale: L,
    title: homeCopy.metaTitle[L],
    description: homeCopy.metaDescription[L],
    alternates: pageAlternates("home"),
    absoluteTitle: true,
    eyebrow: "Novi Sad",
    ogImage: "/images/city/hero-stari-grad-sunset.jpg",
  }),
  // canonical stays `/en`; this is a second take on the same page
  robots: { index: false, follow: true },
};

export default function Page() {
  return <HomeView locale={L} hero="drawing" />;
}
