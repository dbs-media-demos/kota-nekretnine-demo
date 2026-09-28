import { SellView } from "@/views/SellView";
import { sellPage } from "@/content/pages";
import { buildMetadata } from "@/lib/seo";
import { pageAlternates } from "@/lib/routes";

const L = "en" as const;

export const metadata = buildMetadata({
  locale: L,
  title: sellPage.metaTitle[L],
  description: sellPage.metaDescription[L],
  alternates: pageAlternates("sell"),
  eyebrow: sellPage.label[L],
  ogImage: "/images/listings/l05/01.jpg",
});

export default function Page() {
  return <SellView locale={L} />;
}
