import { getGalleryImages, getGalleryAlbums } from "@/lib/data";
import { GalleryGrid } from "@/components/site/gallery-grid";

export const revalidate = 60;

export default async function GalleryPage() {
  const [rows, albums] = await Promise.all([
    getGalleryImages(),
    getGalleryAlbums(),
  ]);

  // Group images by albumId. null albumId = "Uncategorized"
  const imagesByAlbum: Record<string, typeof rows> = {};
  for (const img of rows) {
    const key = img.albumId ?? "__uncategorized__";
    if (!imagesByAlbum[key]) imagesByAlbum[key] = [];
    imagesByAlbum[key].push(img);
  }

  // Build the ordered list of sections: active albums (sorted) + uncategorized (if any images)
  type AlbumSection = {
    id: string; // album id or "__uncategorized__"
    name: string;
    description: string;
    images: typeof rows;
  };
  const sections: AlbumSection[] = [];

  for (const album of albums) {
    const imgs = imagesByAlbum[album.id] ?? [];
    // Skip albums with no images (hidden)
    if (imgs.length === 0) continue;
    sections.push({
      id: album.id,
      name: album.name,
      description: album.description,
      images: imgs,
    });
  }

  // Uncategorized section (if any images without an album)
  const uncategorized = imagesByAlbum["__uncategorized__"] ?? [];
  if (uncategorized.length > 0) {
    sections.push({
      id: "__uncategorized__",
      name: "Uncategorized",
      description: "",
      images: uncategorized,
    });
  }

  // Flatten all images for the lightbox (across all albums)
  const allImages = rows.map((r) => ({
    id: r.id,
    url: r.url,
    name: r.name,
    caption: r.caption,
    alt: r.alt,
  }));

  // Build section data for the grid component
  const sectionData = sections.map((s) => ({
    id: s.id,
    name: s.name,
    description: s.description,
    images: s.images.map((r) => ({
      id: r.id,
      url: r.url,
      name: r.name,
      caption: r.caption,
      alt: r.alt,
    })),
  }));

  return (
    <>
      {/* Hero header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-700 text-white">
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-16">
          <nav
            aria-label="Breadcrumb"
            className="mb-3 flex items-center gap-1.5 text-xs text-emerald-100/80"
          >
            <a href="/" className="hover:text-amber-300">Home</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="text-white">Gallery</span>
          </nav>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Gallery
          </h1>
          <p className="mt-3 max-w-2xl text-base text-emerald-50/90 sm:text-lg">
            A glimpse of life at Tongdam Computers — events, training sessions,
            campus moments, and our community in action.
          </p>
        </div>
      </section>

      {/* Gallery grid grouped by album */}
      <section className="bg-gray-50 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <GalleryGrid sections={sectionData} allImages={allImages} />
        </div>
      </section>
    </>
  );
}
