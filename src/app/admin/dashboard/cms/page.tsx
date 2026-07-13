import { db } from "@/lib/db";
import { ContentEditor, type ContentItem } from "./content-editor";

export const dynamic = "force-dynamic";

const CATEGORY_LABELS: Record<string, string> = {
  home: "Home Page",
  contact: "Contact Details",
  education: "Education & Training",
  general: "General",
};

const CATEGORY_ORDER = ["home", "contact", "education", "general"];

export default async function CmsPage() {
  // Exclude the "about" category — it has its own dedicated editor at
  // /admin/dashboard/about. Also exclude "assets" (managed at
  // /admin/dashboard/assets).
  const rows = await db.siteContent.findMany({
    where: {
      category: { notIn: ["about", "assets"] },
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
