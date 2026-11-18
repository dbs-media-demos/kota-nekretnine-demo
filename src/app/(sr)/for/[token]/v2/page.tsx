import { notFound } from "next/navigation";
import { HomeView } from "@/views/HomeView";
import { previewBiz } from "@/lib/preview";

/** /for/<token>/v2: the same personalised preview with the no-3D hero (see /v2). Same title and robots as /for/<token>. */
export { generateMetadata } from "../page";

// Always the CRM's current data: an edit there shows on the next reload
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ token: string }> };

export default async function PreviewPageV2({ params }: Props) {
  const found = await previewBiz((await params).token);
  if (!found) notFound();
  return <HomeView locale="sr" biz={{ ...found, lang: "sr" }} hero="drawing" />;
}
