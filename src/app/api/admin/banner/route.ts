import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function GET() {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = await db.alertBanner.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { message, link } = await req.json();
  if (!message)
    return NextResponse.json({ error: "Missing message" }, { status: 400 });
  const item = await db.alertBanner.create({
    data: { message: String(message), link: link || null, isActive: true },
  });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, item });
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, isActive } = await req.json();
  if (!id)
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const item = await db.alertBanner.update({
    where: { id },
    data: { isActive: Boolean(isActive) },
  });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, item });
}
