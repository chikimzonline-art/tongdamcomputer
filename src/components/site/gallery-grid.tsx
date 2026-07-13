"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type GalleryItem = {
  id: string;
  url: string;
  name: string;
  caption: string;
  alt: string;
};

type AlbumSection = {
  id: string;
  name: string;
  description: string;
  images: GalleryItem[];
};

type Props = {
  sections: AlbumSection[];
  allImages: GalleryItem[];
};

export function GalleryGrid({ sections, allImages }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("__all__");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const close = useCallback(() => setOpenIndex(null), []);
  const prev = useCallback(
    () =>
      setOpenIndex((i) =>
        i === null ? i : (i - 1 + allImages.length) % allImages.length
      ),
    [allImages.length]
  );
  const next = useCallback(
    () =>
      setOpenIndex((i) => (i === null ? i : (i + 1) % allImages.length)),
    [allImages.length]
  );

  // Keyboard navigation
  useEffect(() => {
    if (openIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIndex, close, prev, next]);

  // Scroll to a section when filter pill is clicked
  function scrollToSection(id: string) {
    setActiveFilter(id);
    if (id === "__all__") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = sectionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  // Track scroll position to update active filter pill
  useEffect(() => {
    function onScroll() {
      // Find the section closest to the top of the viewport
      let closest = "__all__";
      let closestDist = Infinity;
      for (const section of sections) {
        const el = sectionRefs.current[section.id];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        // Consider a section "active" when its heading is near the top
        const dist = Math.abs(rect.top - 120);
        if (rect.top < window.innerHeight * 0.5 && dist < closestDist) {
          closestDist = dist;
          closest = section.id;
        }
      }
      // If we're near the top, show "All"
      if (window.scrollY < 200) closest = "__all__";
      setActiveFilter(closest);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sections]);

  if (sections.length === 0) {
    return (
      <div className="rounded-xl border border-dashed py-20 text-center text-gray-400">
        No photos in the gallery yet. Check back soon!
      </div>
    );
  }

  // Build a global index map: image id -> index in allImages
  const globalIndexMap: Record<string, number> = {};
  allImages.forEach((img, i) => {
    globalIndexMap[img.id] = i;
  });

  return (
    <>
      {/* Filter pills */}
      {sections.length > 1 && (
        <div className="sticky top-16 z-30 mb-8 flex flex-wrap justify-center gap-2 rounded-lg bg-gray-50/90 p-3 backdrop-blur">
          <button
            onClick={() => scrollToSection("__all__")}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              activeFilter === "__all__"
                ? "bg-emerald-600 text-white"
                : "bg-white text-gray-600 hover:bg-emerald-100 hover:text-emerald-700"
            )}
          >
            All
          </button>
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollToSection(s.id)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                activeFilter === s.id
                  ? "bg-emerald-600 text-white"
                  : "bg-white text-gray-600 hover:bg-emerald-100 hover:text-emerald-700"
              )}
            >
              {s.name}
              <span className="ml-1.5 text-xs opacity-60">({s.images.length})</span>
            </button>
          ))}
        </div>
      )}

      {/* Album sections */}
      <div className="space-y-12">
        {sections.map((section) => (
          <div
            key={section.id}
            ref={(el) => { sectionRefs.current[section.id] = el; }}
            className="scroll-mt-32"
          >
            {/* Album heading */}
            <div className="mb-5">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {section.name}
              </h2>
              {section.description && (
                <p className="mt-1 text-sm text-gray-500">{section.description}</p>
              )}
              <p className="mt-1 text-xs font-medium text-emerald-600">
                {section.images.length} photo{section.images.length === 1 ? "" : "s"}
              </p>
              <div className="mt-3 h-px w-full bg-gradient-to-r from-emerald-200 to-transparent" />
            </div>

            {/* Masonry grid for this album */}
            <div className="columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4 [&>*]:mb-3 sm:[&>*]:mb-4">
              {section.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setOpenIndex(globalIndexMap[img.id] ?? 0)}
                  className="group relative block w-full break-inside-avoid overflow-hidden rounded-lg border border-gray-200 bg-gray-100 transition-all hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
                  aria-label={`Open ${img.caption || img.name}`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt || img.caption || img.name}
                    width={0}
                    height={0}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    style={{ width: "100%", height: "auto" }}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {img.caption && (
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-left text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                      {img.caption}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={close}
        >
          <button
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
          >
            <X className="size-5" />
          </button>

          {allImages.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous image"
              className="absolute left-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
            >
              <ChevronLeft className="size-6" />
            </button>
          )}

          <figure
            className="flex max-h-full max-w-5xl flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={allImages[openIndex].url}
              alt={allImages[openIndex].alt || allImages[openIndex].caption || allImages[openIndex].name}
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "auto", height: "auto", maxHeight: "82vh", maxWidth: "100%" }}
              className="rounded-lg object-contain"
            />
            {allImages[openIndex].caption && (
              <figcaption className="mt-3 text-center text-sm text-white/80">
                {allImages[openIndex].caption}
              </figcaption>
            )}
          </figure>

          {allImages.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Next image"
              className="absolute right-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
            >
              <ChevronRight className="size-6" />
            </button>
          )}

          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-medium text-white/60">
            {openIndex + 1} / {allImages.length}
          </span>
        </div>
      )}
    </>
  );
}
