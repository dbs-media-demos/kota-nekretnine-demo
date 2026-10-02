import { AboutView } from "@/views/AboutView";
import { aboutPage } from "@/content/pages-more";
import { buildMetadata } from "@/lib/seo";
import { pageAlternates } from "@/lib/routes";

const L = "sr" as const;

export const metadata = buildMetadata({
  locale: L,
  title: aboutPage.metaTitle[L],
  description: aboutPage.metaDescription[L],
  alternates: pageAlternates("about"),
  eyebrow: aboutPage.label[L],
  ogImage: "/images/city/zmaj-jovina.jpg",
});

export default function Page() {
  return <AboutView locale={L} />;
}
