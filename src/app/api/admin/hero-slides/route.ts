import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function GET() {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = await db.heroSlide.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    badge, badgeIcon, title, subtitle,
    btn1Text, btn1Href, btn2Text, btn2Href,
    bgImage, cardTitle, cardIcon, cardText,
    cardFooterTitle, cardFooterSubtitle, cardBadge,
    sortOrder, isActive,
  } = body;

  if (!title || !badge)
    return NextResponse.json({ error: "title and badge are required" }, { status: 400 });

  const count = await db.heroSlide.count();
  const item = await db.heroSlide.create({
    data: {
      badge: String(badge),
      badgeIcon: String(badgeIcon ?? "Sparkles"),
      title: String(title),
      subtitle: String(subtitle ?? ""),
      btn1Text: String(btn1Text ?? ""),
      btn1Href: String(btn1Href ?? "/"),
      btn2Text: String(btn2Text ?? ""),
      btn2Href: String(btn2Href ?? "/"),
      bgImage: String(bgImage ?? ""),
      cardTitle: String(cardTitle ?? ""),
      cardIcon: String(cardIcon ?? "Quote"),
      cardText: String(cardText ?? ""),
      cardFooterTitle: String(cardFooterTitle ?? ""),
      cardFooterSubtitle: String(cardFooterSubtitle ?? ""),
      cardBadge: String(cardBadge ?? ""),
      sortOrder: typeof sortOrder === "number" ? sortOrder : count + 1,
      isActive: isActive !== false,
    },
  });

  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, item });
}

export async function PUT(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, ...fields } = body;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const stringFields = [
    "badge", "badgeIcon", "title", "subtitle",
    "btn1Text", "btn1Href", "btn2Text", "btn2Href",
    "bgImage", "cardTitle", "cardIcon", "cardText",
    "cardFooterTitle", "cardFooterSubtitle", "cardBadge",
  ];

  const data: Record<string, unknown> = {};
  for (const key of stringFields) {
    if (fields[key] !== undefined) data[key] = String(fields[key]);
  }
  if (fields.sortOrder !== undefined) data.sortOrder = Number(fields.sortOrder);
  if (fields.isActive !== undefined) data.isActive = Boolean(fields.isActive);

  const item = await db.heroSlide.update({ where: { id: String(id) }, data });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, item });
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await db.heroSlide.delete({ where: { id } });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
