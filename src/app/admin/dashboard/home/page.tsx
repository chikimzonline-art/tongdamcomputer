import { db } from "@/lib/db";
import { getAllStats, getAllQuickActions, getAllEssentialServices } from "@/lib/data";
import { HomeEditor } from "./home-editor";

export const dynamic = "force-dynamic";

export default async function HomeAdminPage() {
  const rows = await db.siteContent.findMany({ where: { category: "home" } });
  const content: Record<string, string> = {};
  for (const r of rows) content[r.key] = r.value;

  const stats = await getAllStats();
  const quickActions = await getAllQuickActions();
  const essentialServices = await getAllEssentialServices();

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Home Page</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Edit all content shown on the homepage — hero text, stats, section
        headings, quick actions, and essential services. Changes go live
        instantly.
      </p>
      <div className="mt-6">
        <HomeEditor
          content={content}
          stats={stats.map((s) => ({ id: s.id, label: s.label, value: s.value, icon: s.icon, sortOrder: s.sortOrder, isActive: s.isActive }))}
          quickActions={quickActions.map((q) => ({ id: q.id, title: q.title, description: q.description, href: q.href, cta: q.cta, icon: q.icon, sortOrder: q.sortOrder, isActive: q.isActive }))}
          essentialServices={essentialServices.map((e) => ({
            id: e.id,
            title: e.title,
            description: e.description,
            icon: e.icon,
            services: (() => { try { const p = JSON.parse(e.services); return Array.isArray(p) ? p : []; } catch { return []; } })(),
            extraCount: e.extraCount,
            accent: e.accent,
            sortOrder: e.sortOrder,
            isActive: e.isActive,
          }))}
        />
      </div>
    </div>
  );
}
