import { getAllGalleryImages } from "@/lib/data";
import { GalleryEditor } from "./gallery-editor";

export const dynamic = "force-dynamic";

export default async function GalleryAdminPage() {
  const rows = await getAllGalleryImages();
  const images = rows.map((r) => ({
    id: r.id,
    url: r.url,
    name: r.name,
    caption: r.caption,
    alt: r.alt,
    sortOrder: r.sortOrder,
    isActive: r.isActive,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Gallery</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Upload and manage photos shown on the public{" "}
        <a href="/gallery" className="text-emerald-700 underline" target="_blank">
          /gallery
        </a>{" "}
        page. Max 2MB per image. New uploads appear instantly.
      </p>
      <div className="mt-6">
        <GalleryEditor images={images} />
      </div>
    </div>
  );
}
