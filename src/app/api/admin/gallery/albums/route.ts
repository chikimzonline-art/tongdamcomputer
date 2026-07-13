import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { db } from "@/lib/db";

/**
 * GET /api/admin/gallery/albums  - list all albums
 */
export async function GET() {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = await db.galleryAlbum.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ items });
}

/**
 * POST /api/admin/gallery/albums  - create a new album
 */
export async function POST(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { name, description, sortOrder, isActive } = await req.json();
  if (!name)
    return NextResponse.json({ error: "Missing name" }, { status: 400 });
  let sort = typeof sortOrder === "number" ? sortOrder : 0;
  if (sortOrder === undefined) sort = (await db.galleryAlbum.count()) + 1;
  const item = await db.galleryAlbum.create({
    data: {
      name: String(name),
      description: String(description || ""),
      sortOrder: sort,
      isActive: isActive !== false,
    },
  });
  return NextResponse.json({ ok: true, item });
}

/**
 * PUT /api/admin/gallery/albums  - update an album
 */
export async function PUT(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, name, description, sortOrder, isActive } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const data: Record<string, unknown> = {};
  if (name !== undefined) data.name = String(name);
  if (description !== undefined) data.description = String(description);
  if (sortOrder !== undefined) data.sortOrder = Number(sortOrder);
  if (isActive !== undefined) data.isActive = Boolean(isActive);
  const item = await db.galleryAlbum.update({ where: { id: String(id) }, data });
  return NextResponse.json({ ok: true, item });
}

/**
 * DELETE /api/admin/gallery/albums?id=...  - delete an album
 * Images in the album are NOT deleted — their albumId is set to null
 * (they move to "Uncategorized").
 */
export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  // Unlink images from this album before deleting
  await db.galleryImage.updateMany({
    where: { albumId: id },
    data: { albumId: null },
  });
  await db.galleryAlbum.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
