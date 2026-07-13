import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function GET() {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = await db.quickAction.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { title, description, href, cta, icon, sortOrder, isActive } = await req.json();
  if (!title || !href)
    return NextResponse.json({ error: "Missing title/href" }, { status: 400 });
  let sort = typeof sortOrder === "number" ? sortOrder : 0;
  if (sortOrder === undefined) sort = (await db.quickAction.count()) + 1;
  const item = await db.quickAction.create({
    data: { title: String(title), description: String(description || ""), href: String(href), cta: String(cta || ""), icon: String(icon || "CalendarCheck"), sortOrder: sort, isActive: isActive !== false },
  });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, item });
}

export async function PUT(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, title, description, href, cta, icon, sortOrder, isActive } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const data: Record<string, unknown> = {};
  if (title !== undefined) data.title = String(title);
  if (description !== undefined) data.description = String(description);
  if (href !== undefined) data.href = String(href);
  if (cta !== undefined) data.cta = String(cta);
  if (icon !== undefined) data.icon = String(icon);
  if (sortOrder !== undefined) data.sortOrder = Number(sortOrder);
  if (isActive !== undefined) data.isActive = Boolean(isActive);
  const item = await db.quickAction.update({ where: { id: String(id) }, data });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, item });
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await db.quickAction.delete({ where: { id } });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
