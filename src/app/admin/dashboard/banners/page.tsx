import { db } from "@/lib/db";
import { BannerManager, type BannerRow } from "./banner-manager";

export const dynamic = "force-dynamic";

export default async function BannersPage() {
  const rows = await db.alertBanner.findMany({
    orderBy: { createdAt: "desc" },
  });
  const banners: BannerRow[] = rows.map((r) => ({
    id: r.id,
    message: r.message,
    link: r.link ?? "",
    isActive: r.isActive,
    createdAt: r.createdAt.toISOString(),
  }));

  return <BannerManager initialBanners={banners} />;
}
