import { db } from "@/lib/db";
import { CoursesEditor, type CourseRow } from "./courses-editor";

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

  return (
    <CoursesEditor
      courses={courses}
      instituteLabels={INSTITUTE_LABELS}
      instituteOrder={INSTITUTE_ORDER}
    />
  );
}
