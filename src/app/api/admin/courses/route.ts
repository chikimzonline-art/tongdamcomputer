import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

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
  const { id, title, description, duration, fee, syllabus, isActive, sortOrder } = body;
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
    },
  });
  return NextResponse.json({ ok: true, item });
}
