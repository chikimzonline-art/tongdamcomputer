import { db } from "@/lib/db";
import { MenuEditor, type MenuRow } from "./menu-editor";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const rows = await db.menuItem.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });
  const items: MenuRow[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description ?? "",
    price: r.price,
    category: r.category,
    isVeg: r.isVeg,
    isAvailable: r.isAvailable,
    sortOrder: r.sortOrder,
  }));

  return <MenuEditor items={items} />;
}
