import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * GET /api/admin/content  - list all site content
 * PUT /api/admin/content  - upsert a content key
 */
async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) return null;
  return session;
}

export async function GET() {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = await db.siteContent.findMany({ orderBy: { category: "asc" } });
  return NextResponse.json({ items });
}

export async function PUT(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { key, value, category } = await req.json();
  if (!key || value === undefined)
    return NextResponse.json({ error: "Missing key/value" }, { status: 400 });
  const item = await db.siteContent.upsert({
    where: { key },
    update: { value },
    create: { key, value, category: category || "general" },
  });
  return NextResponse.json({ ok: true, item });
}
