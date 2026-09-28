import { ReviewsView } from "@/views/ReviewsView";
import { reviewsPage } from "@/content/pages-more";
import { buildMetadata } from "@/lib/seo";
import { pageAlternates } from "@/lib/routes";

const L = "en" as const;

export const metadata = buildMetadata({
  locale: L,
  title: reviewsPage.metaTitle[L],
  description: reviewsPage.metaDescription[L],
  alternates: pageAlternates("reviews"),
  eyebrow: reviewsPage.label[L],
  ogImage: "/images/life/kafic-terasa.jpg",
});

export default function Page() {
  return <ReviewsView locale={L} />;
}
