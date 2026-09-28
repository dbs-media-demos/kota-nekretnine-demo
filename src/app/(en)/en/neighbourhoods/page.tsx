import { HoodsIndexView } from "@/views/HoodsIndexView";
import { hoodsPage } from "@/content/pages";
import { buildMetadata } from "@/lib/seo";
import { pageAlternates } from "@/lib/routes";

const L = "en" as const;

export const metadata = buildMetadata({
  locale: L,
  title: hoodsPage.metaTitle[L],
  description: hoodsPage.metaDescription[L],
  alternates: pageAlternates("hoods"),
  eyebrow: hoodsPage.title[L],
  ogImage: "/images/city/tvrdjava-leto.jpg",
});

export default function Page() {
  return <HoodsIndexView locale={L} />;
}
