import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

async function requireAdmin() {
  return await getServerSession(authOptions);
}

function serializeServices(services: unknown): string {
  if (Array.isArray(services)) {
    return JSON.stringify(services.filter((f) => typeof f === "string" && f.trim()));
  }
  return "[]";
}

export async function GET() {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = await db.essentialService.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { title, description, icon, services, extraCount, accent, sortOrder, isActive } = await req.json();
  if (!title)
    return NextResponse.json({ error: "Missing title" }, { status: 400 });
  let sort = typeof sortOrder === "number" ? sortOrder : 0;
  if (sortOrder === undefined) sort = (await db.essentialService.count()) + 1;
  const item = await db.essentialService.create({
    data: { title: String(title), description: String(description || ""), icon: String(icon || "Landmark"), services: serializeServices(services), extraCount: Number(extraCount || 0), accent: String(accent || "emerald"), sortOrder: sort, isActive: isActive !== false },
  });
  return NextResponse.json({ ok: true, item });
}

export async function PUT(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, title, description, icon, services, extraCount, accent, sortOrder, isActive } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const data: Record<string, unknown> = {};
  if (title !== undefined) data.title = String(title);
  if (description !== undefined) data.description = String(description);
  if (icon !== undefined) data.icon = String(icon);
  if (services !== undefined) data.services = serializeServices(services);
  if (extraCount !== undefined) data.extraCount = Number(extraCount);
  if (accent !== undefined) data.accent = String(accent);
  if (sortOrder !== undefined) data.sortOrder = Number(sortOrder);
  if (isActive !== undefined) data.isActive = Boolean(isActive);
  const item = await db.essentialService.update({ where: { id: String(id) }, data });
  return NextResponse.json({ ok: true, item });
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await db.essentialService.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
