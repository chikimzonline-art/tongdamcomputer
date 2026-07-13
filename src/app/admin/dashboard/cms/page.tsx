import { db } from "@/lib/db";
import { ContentEditor, type ContentItem } from "./content-editor";

export const dynamic = "force-dynamic";

const CATEGORY_LABELS: Record<string, string> = {
  contact: "Contact Details",
  education: "Education & Training",
  general: "General",
};

const CATEGORY_ORDER = ["contact", "education", "general"];

export default async function CmsPage() {
  // Exclude categories that have their own dedicated editors:
  // - "home" → /admin/dashboard/home
  // - "about" → /admin/dashboard/about
  // - "assets" → /admin/dashboard/assets
  const rows = await db.siteContent.findMany({
    where: {
      category: { notIn: ["home", "about", "assets"] },
    },
    orderBy: [{ category: "asc" }, { key: "asc" }],
  });
  const items: ContentItem[] = rows.map((r) => ({
    id: r.id,
    key: r.key,
    value: r.value,
    category: r.category,
  }));

  return <ContentEditor items={items} categoryLabels={CATEGORY_LABELS} categoryOrder={CATEGORY_ORDER} />;
}
