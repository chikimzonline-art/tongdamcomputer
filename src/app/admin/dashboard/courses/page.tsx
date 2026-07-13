import { db } from "@/lib/db";
import { CoursesEditor, type CourseRow } from "./courses-editor";
import { TrainingSettings } from "./training-settings";

export const dynamic = "force-dynamic";

const INSTITUTE_LABELS: Record<string, string> = {
  "computer-training": "Computer Training",
  tailoring: "Tailoring & Fashion",
  "hotel-management": "Hotel Management",
  "mobile-hub": "Mobile Repairing",
};

const INSTITUTE_ORDER = [
  "computer-training",
  "tailoring",
  "hotel-management",
  "mobile-hub",
];

export default async function CoursesPage() {
  const rows = await db.course.findMany({
    orderBy: [{ institute: "asc" }, { sortOrder: "asc" }],
  });
  const courses: CourseRow[] = rows.map((r) => ({
    id: r.id,
    code: r.code,
    title: r.title,
    institute: r.institute,
    description: r.description,
    duration: r.duration,
    fee: r.fee,
    syllabus: r.syllabus ?? "",
    sortOrder: r.sortOrder,
    isActive: r.isActive,
  }));

  // Fetch education content keys (training badges, placement text)
  const eduRows = await db.siteContent.findMany({ where: { category: "education" } });
  const eduSettings: Record<string, string> = {};
  for (const r of eduRows) eduSettings[r.key] = r.value;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Course Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage courses across all institutes and update training settings.
          Changes go live instantly.
        </p>
      </div>
      <TrainingSettings settings={eduSettings} />
      <CoursesEditor
        courses={courses}
        instituteLabels={INSTITUTE_LABELS}
        instituteOrder={INSTITUTE_ORDER}
      />
    </div>
  );
}
