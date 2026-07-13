import { getGalleryImages } from "@/lib/data";
import { GalleryGrid } from "@/components/site/gallery-grid";

export const revalidate = 60;

export default async function GalleryPage() {
  const rows = await getGalleryImages();
  const images = rows.map((r) => ({
    id: r.id,
    url: r.url,
    name: r.name,
    caption: r.caption,
    alt: r.alt,
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

      {/* Gallery grid */}
      <section className="bg-gray-50 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <GalleryGrid images={images} />
        </div>
      </section>
    </>
  );
}
