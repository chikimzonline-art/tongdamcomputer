import { getAllVentures } from "@/lib/data";
import { VenturesEditor } from "./ventures-editor";

export default async function VenturesPage() {
  const ventures = await getAllVentures();
  // Serialize for client component
  const serialized = ventures.map((v) => ({
    id: v.id,
    title: v.title,
    description: v.description,
    href: v.href,
    icon: v.icon,
    badge: v.badge,
    features: (() => {
      try {
        const parsed = JSON.parse(v.features);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    })(),
    accent: v.accent,
    sortOrder: v.sortOrder,
    isActive: v.isActive,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Venture Cards</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Edit the &ldquo;Our Ventures&rdquo; cards shown on the home page. Changes go
        live instantly.
      </p>
      <div className="mt-6">
        <VenturesEditor ventures={serialized} />
      </div>
    </div>
  );
}
