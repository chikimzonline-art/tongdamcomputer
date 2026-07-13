import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

async function requireAdmin() {
  return await getServerSession(authOptions);
}

/**
 * GET /api/admin/gallery  - list all gallery images
 */
export async function GET() {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = await db.galleryImage.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json({ items });
}

/**
 * PUT /api/admin/gallery  - update a gallery image (caption, alt, active, order)
 */
export async function PUT(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { id, caption, alt, sortOrder, isActive } = body;
  if (!id)
    return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const data: Record<string, unknown> = {};
  if (caption !== undefined) data.caption = String(caption);
  if (alt !== undefined) data.alt = String(alt);
  if (sortOrder !== undefined) data.sortOrder = Number(sortOrder);
  if (isActive !== undefined) data.isActive = Boolean(isActive);

  const item = await db.galleryImage.update({ where: { id: String(id) }, data });
  return NextResponse.json({ ok: true, item });
}

/**
 * DELETE /api/admin/gallery?id=...  - delete a gallery image row from DB.
 * NOTE: the actual file in UploadThing is NOT deleted (no UT API call here)
 * — we remove the reference. Add UT deletion later if needed.
 */
export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id)
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await db.galleryImage.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
