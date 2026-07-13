import { getAllAffiliations } from "@/lib/data";
import { AffiliationsEditor } from "./affiliations-editor";

export const dynamic = "force-dynamic";

export default async function AffiliationsPage() {
  const rows = await getAllAffiliations();
  const affiliations = rows.map((a) => ({
    id: a.id,
    name: a.name,
    category: a.category,
    description: a.description,
    icon: a.icon,
    accent: a.accent,
    sortOrder: a.sortOrder,
    isActive: a.isActive,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Affiliations</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage the &ldquo;Our Affiliations &amp; Brand Partners&rdquo; carousel on
        the home page. Add, edit, or delete cards — changes go live instantly.
      </p>
      <div className="mt-6">
        <AffiliationsEditor affiliations={affiliations} />
      </div>
    </div>
  );
}
