import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  return await getServerSession(authOptions);
}

export async function GET() {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = await db.course.findMany({
    orderBy: [{ institute: "asc" }, { sortOrder: "asc" }],
  });
  return NextResponse.json({ items });
}

export async function PUT(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { id, title, description, duration, fee, syllabus, isActive, sortOrder, code, institute } = body;
  if (!id)
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const item = await db.course.update({
    where: { id },
    data: {
      ...(title !== undefined ? { title } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(duration !== undefined ? { duration } : {}),
      ...(fee !== undefined ? { fee } : {}),
      ...(syllabus !== undefined ? { syllabus } : {}),
      ...(isActive !== undefined ? { isActive: Boolean(isActive) } : {}),
      ...(sortOrder !== undefined ? { sortOrder: Number(sortOrder) } : {}),
      ...(code !== undefined ? { code } : {}),
      ...(institute !== undefined ? { institute } : {}),
    },
  });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, item });
}

/**
 * POST /api/admin/courses  - create a new course
 */
export async function POST(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { title, code, institute, description, duration, fee, syllabus, sortOrder, isActive } = body;
  if (!title || !code || !institute)
    return NextResponse.json(
      { error: "Missing required fields (title, code, institute)" },
      { status: 400 }
    );

  // Ensure the code is unique — if it exists, append a suffix
  let finalCode = String(code);
  const existing = await db.course.findUnique({ where: { code: finalCode } });
  if (existing) {
    finalCode = `${finalCode}-${Date.now().toString(36).slice(-4)}`;
  }

  // Determine sort order: if not provided, place at end of this institute
  let finalSortOrder = typeof sortOrder === "number" ? sortOrder : 0;
  if (sortOrder === undefined) {
    const count = await db.course.count({ where: { institute: String(institute) } });
    finalSortOrder = count + 1;
  }

  const item = await db.course.create({
    data: {
      title: String(title),
      code: finalCode,
      institute: String(institute),
      description: String(description || ""),
      duration: String(duration || ""),
      fee: String(fee || ""),
      syllabus: syllabus ? String(syllabus) : null,
      sortOrder: finalSortOrder,
      isActive: isActive !== false,
    },
  });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, item });
}

/**
 * DELETE /api/admin/courses?id=...  - delete a course
 */
export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id)
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await db.course.delete({ where: { id } });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}

