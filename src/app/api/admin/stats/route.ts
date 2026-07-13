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
  const items = await db.stat.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { label, value, icon, sortOrder, isActive } = await req.json();
  if (!label || !value)
    return NextResponse.json({ error: "Missing label/value" }, { status: 400 });
  let sort = typeof sortOrder === "number" ? sortOrder : 0;
  if (sortOrder === undefined) sort = (await db.stat.count()) + 1;
  const item = await db.stat.create({
    data: { label: String(label), value: String(value), icon: String(icon || "Briefcase"), sortOrder: sort, isActive: isActive !== false },
  });
  return NextResponse.json({ ok: true, item });
}

export async function PUT(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, label, value, icon, sortOrder, isActive } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const data: Record<string, unknown> = {};
  if (label !== undefined) data.label = String(label);
  if (value !== undefined) data.value = String(value);
  if (icon !== undefined) data.icon = String(icon);
  if (sortOrder !== undefined) data.sortOrder = Number(sortOrder);
  if (isActive !== undefined) data.isActive = Boolean(isActive);
  const item = await db.stat.update({ where: { id: String(id) }, data });
  return NextResponse.json({ ok: true, item });
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await db.stat.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
