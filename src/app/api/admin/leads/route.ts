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
  const items = await db.lead.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ items });
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, status, isRead } = await req.json();
  if (!id)
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const item = await db.lead.update({
    where: { id },
    data: {
      ...(status !== undefined ? { status } : {}),
      ...(isRead !== undefined ? { isRead: Boolean(isRead) } : {}),
    },
  });
  return NextResponse.json({ ok: true, item });
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id)
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await db.lead.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
