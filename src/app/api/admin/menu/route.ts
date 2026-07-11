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
  return NextResponse.json({ ok: true, item });
}
