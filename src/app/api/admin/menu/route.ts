import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function GET() {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = await db.menuItem.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });
  return NextResponse.json({ items });
}

export async function PUT(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { id, name, description, price, category, isVeg, isAvailable, sortOrder } = body;
  if (!id)
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const item = await db.menuItem.update({
    where: { id },
    data: {
      ...(name !== undefined ? { name } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(price !== undefined ? { price } : {}),
      ...(category !== undefined ? { category } : {}),
      ...(isVeg !== undefined ? { isVeg: Boolean(isVeg) } : {}),
      ...(isAvailable !== undefined ? { isAvailable: Boolean(isAvailable) } : {}),
      ...(sortOrder !== undefined ? { sortOrder: Number(sortOrder) } : {}),
    },
  });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, item });
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { name, description, price, category, isVeg, isAvailable } = body;
  if (!name || !price || !category)
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  const item = await db.menuItem.create({
    data: {
      name: String(name),
      description: description || null,
      price: String(price),
      category: String(category),
      isVeg: isVeg !== false,
      isAvailable: isAvailable !== false,
    },
  });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, item });
}
