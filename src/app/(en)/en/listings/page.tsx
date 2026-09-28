import { ListingsView } from "@/views/ListingsView";
import { listingsPage } from "@/content/pages";
import { buildMetadata } from "@/lib/seo";
import { pageAlternates } from "@/lib/routes";

const L = "en" as const;

export const metadata = buildMetadata({
  locale: L,
  title: listingsPage.metaTitle[L],
  description: listingsPage.metaDescription[L],
  alternates: pageAlternates("listings"),
  eyebrow: listingsPage.label[L],
  ogImage: "/images/listings/l01/01.jpg",
});

export default function Page() {
  return <ListingsView locale={L} />;
}
