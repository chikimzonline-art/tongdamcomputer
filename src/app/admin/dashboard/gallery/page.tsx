import { getAllGalleryImages, getAllGalleryAlbums } from "@/lib/data";
import { GalleryEditor } from "./gallery-editor";

export const dynamic = "force-dynamic";

export default async function GalleryAdminPage() {
  const [rows, albumRows] = await Promise.all([
    getAllGalleryImages(),
    getAllGalleryAlbums(),
  ]);
  const images = rows.map((r) => ({
    id: r.id,
    url: r.url,
    name: r.name,
    caption: r.caption,
    alt: r.alt,
    albumId: r.albumId,
    sortOrder: r.sortOrder,
    isActive: r.isActive,
    createdAt: r.createdAt.toISOString(),
  }));
  const albums = albumRows.map((a) => ({
    id: a.id,
    name: a.name,
    description: a.description,
    sortOrder: a.sortOrder,
    isActive: a.isActive,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Gallery</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage albums and photos shown on the public{" "}
        <a href="/gallery" className="text-emerald-700 underline" target="_blank">
          /gallery
        </a>{" "}
        page. Max 2MB per image. New uploads appear instantly.
      </p>
      <div className="mt-6">
        <GalleryEditor images={images} albums={albums} />
      </div>
    </div>
  );
}
