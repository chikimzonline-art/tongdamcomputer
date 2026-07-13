import { db } from "@/lib/db";
import { getAllMilestones, getAllCoreValues } from "@/lib/data";
import { AboutEditor } from "./about-editor";

export const dynamic = "force-dynamic";

export default async function AboutAdminPage() {
  // Fetch all about.* content keys
  const rows = await db.siteContent.findMany({
    where: { category: "about" },
  });
  const content: Record<string, string> = {};
  for (const r of rows) content[r.key] = r.value;

  const milestones = await getAllMilestones();
  const coreValues = await getAllCoreValues();

  // Serialize for client
  const milestoneData = milestones.map((m) => ({
    id: m.id,
    year: m.year,
    title: m.title,
    detail: m.detail,
    sortOrder: m.sortOrder,
    isActive: m.isActive,
  }));
  const valueData = coreValues.map((v) => ({
    id: v.id,
    title: v.title,
    description: v.description,
    icon: v.icon,
    sortOrder: v.sortOrder,
    isActive: v.isActive,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">About Page</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Edit all content shown on the public{" "}
        <a href="/about" className="text-emerald-700 underline" target="_blank">
          /about
        </a>{" "}
        page — hero text, story, founder image, mission, vision, timeline, and
        core values. Changes go live instantly.
      </p>
      <div className="mt-6">
        <AboutEditor
          content={content}
          milestones={milestoneData}
          coreValues={valueData}
        />
      </div>
    </div>
  );
}
