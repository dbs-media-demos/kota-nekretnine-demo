import { HomeView } from "@/views/HomeView";
import { homeCopy } from "@/content/home";
import { buildMetadata } from "@/lib/seo";
import { pageAlternates } from "@/lib/routes";

const L = "en" as const;

export const metadata = buildMetadata({
  locale: L,
  title: homeCopy.metaTitle[L],
  description: homeCopy.metaDescription[L],
  alternates: pageAlternates("home"),
  absoluteTitle: true,
  eyebrow: "Novi Sad",
  ogImage: "/images/city/hero-stari-grad-sunset.jpg",
});

export default function Page() {
  return <HomeView locale={L} />;
}
