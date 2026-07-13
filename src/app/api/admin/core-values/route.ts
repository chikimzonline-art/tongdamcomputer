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
  const items = await db.coreValue.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { title, description, icon, sortOrder, isActive } = body;
  if (!title) return NextResponse.json({ error: "Missing required field (title)" }, { status: 400 });
  let finalSort = typeof sortOrder === "number" ? sortOrder : 0;
  if (sortOrder === undefined) {
    const count = await db.coreValue.count();
    finalSort = count + 1;
  }
  const item = await db.coreValue.create({
    data: { title: String(title), description: String(description || ""), icon: String(icon || "Heart"), sortOrder: finalSort, isActive: isActive !== false },
  });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, item });
}

export async function PUT(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { id, title, description, icon, sortOrder, isActive } = body;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const data: Record<string, unknown> = {};
  if (title !== undefined) data.title = String(title);
  if (description !== undefined) data.description = String(description);
  if (icon !== undefined) data.icon = String(icon);
  if (sortOrder !== undefined) data.sortOrder = Number(sortOrder);
  if (isActive !== undefined) data.isActive = Boolean(isActive);
  const item = await db.coreValue.update({ where: { id: String(id) }, data });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, item });
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await db.coreValue.delete({ where: { id } });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
