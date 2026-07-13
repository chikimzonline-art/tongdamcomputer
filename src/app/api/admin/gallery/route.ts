import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

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
 * PUT /api/admin/gallery  - update a gallery image (caption, alt, active, order, albumId)
 */
export async function PUT(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { id, caption, alt, sortOrder, isActive, albumId } = body;
  if (!id)
    return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const data: Record<string, unknown> = {};
  if (caption !== undefined) data.caption = String(caption);
  if (alt !== undefined) data.alt = String(alt);
  if (sortOrder !== undefined) data.sortOrder = Number(sortOrder);
  if (isActive !== undefined) data.isActive = Boolean(isActive);
  // albumId can be null (move to Uncategorized) or a string (move to album)
  if (albumId !== undefined) data.albumId = albumId === "" ? null : String(albumId);

  const item = await db.galleryImage.update({ where: { id: String(id) }, data });
  revalidatePath("/", "layout");
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

  const image = await db.galleryImage.findUnique({ where: { id } });
  if (image?.key) {
    try {
      await utapi.deleteFiles(image.key);
    } catch (e) {
      console.error("Failed to delete file from UploadThing:", e);
    }
  }

  await db.galleryImage.delete({ where: { id } });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}

/**
 * POST /api/admin/gallery  - create a new gallery image record from an existing file
 */
export async function POST(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { url, key, name, albumId } = body;
  if (!url || !key || !name)
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

  const count = await db.galleryImage.count({
    where: albumId ? { albumId } : { albumId: null },
  });

  const item = await db.galleryImage.create({
    data: {
      url: String(url),
      key: String(key),
      name: String(name),
      width: 0,
      height: 0,
      albumId: albumId ? String(albumId) : null,
      sortOrder: count + 1,
      isActive: true,
    },
  });

  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, item });
}
