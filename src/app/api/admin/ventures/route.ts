import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * GET /api/admin/ventures  - list all ventures
 */
export async function GET() {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = await db.venture.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ items });
}

/**
 * POST /api/admin/ventures  - create a new venture
 */
export async function POST(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { title, description, href, icon, badge, features, accent, sortOrder, isActive } = body;
  if (!title || !href)
    return NextResponse.json({ error: "Missing required fields (title, href)" }, { status: 400 });

  // Serialize features array to JSON string
  const featuresStr = Array.isArray(features)
    ? JSON.stringify(features.filter((f: unknown) => typeof f === "string" && f.trim()))
    : "[]";

  const item = await db.venture.create({
    data: {
      title: String(title),
      description: String(description || ""),
      href: String(href),
      icon: String(icon || "Computer"),
      badge: String(badge || ""),
      features: featuresStr,
      accent: String(accent || "emerald"),
      sortOrder: typeof sortOrder === "number" ? sortOrder : 0,
      isActive: isActive !== false,
    },
  });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, item });
}

/**
 * PUT /api/admin/ventures  - update an existing venture
 * Body: { id, title?, description?, href?, icon?, badge?, features?, accent?, sortOrder?, isActive? }
 */
export async function PUT(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { id, title, description, href, icon, badge, features, accent, sortOrder, isActive } = body;
  if (!id)
    return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const data: Record<string, unknown> = {};
  if (title !== undefined) data.title = String(title);
  if (description !== undefined) data.description = String(description);
  if (href !== undefined) data.href = String(href);
  if (icon !== undefined) data.icon = String(icon);
  if (badge !== undefined) data.badge = String(badge);
  if (accent !== undefined) data.accent = String(accent);
  if (sortOrder !== undefined) data.sortOrder = Number(sortOrder);
  if (isActive !== undefined) data.isActive = Boolean(isActive);
  if (features !== undefined) {
    data.features = Array.isArray(features)
      ? JSON.stringify(features.filter((f: unknown) => typeof f === "string" && f.trim()))
      : "[]";
  }

  const item = await db.venture.update({ where: { id: String(id) }, data });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, item });
}

/**
 * DELETE /api/admin/ventures?id=...  - delete a venture
 */
export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id)
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await db.venture.delete({ where: { id } });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
