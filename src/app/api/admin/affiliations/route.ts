import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

async function requireAdmin() {
  return await getServerSession(authOptions);
}

/**
 * GET /api/admin/affiliations  - list all affiliations
 */
export async function GET() {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = await db.affiliation.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ items });
}

/**
 * POST /api/admin/affiliations  - create a new affiliation
 */
export async function POST(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { name, category, description, icon, accent, sortOrder, isActive } = body;
  if (!name || !category)
    return NextResponse.json(
      { error: "Missing required fields (name, category)" },
      { status: 400 }
    );

  let finalSortOrder = typeof sortOrder === "number" ? sortOrder : 0;
  if (sortOrder === undefined) {
    const count = await db.affiliation.count();
    finalSortOrder = count + 1;
  }

  const item = await db.affiliation.create({
    data: {
      name: String(name),
      category: String(category),
      description: String(description || ""),
      icon: String(icon || "BadgeCheck"),
      accent: String(accent || "emerald"),
      sortOrder: finalSortOrder,
      isActive: isActive !== false,
    },
  });
  return NextResponse.json({ ok: true, item });
}

/**
 * PUT /api/admin/affiliations  - update an existing affiliation
 */
export async function PUT(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { id, name, category, description, icon, accent, sortOrder, isActive } = body;
  if (!id)
    return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const data: Record<string, unknown> = {};
  if (name !== undefined) data.name = String(name);
  if (category !== undefined) data.category = String(category);
  if (description !== undefined) data.description = String(description);
  if (icon !== undefined) data.icon = String(icon);
  if (accent !== undefined) data.accent = String(accent);
  if (sortOrder !== undefined) data.sortOrder = Number(sortOrder);
  if (isActive !== undefined) data.isActive = Boolean(isActive);

  const item = await db.affiliation.update({ where: { id: String(id) }, data });
  return NextResponse.json({ ok: true, item });
}

/**
 * DELETE /api/admin/affiliations?id=...  - delete an affiliation
 */
export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id)
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await db.affiliation.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
