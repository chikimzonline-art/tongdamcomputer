"use client";

import { useState, useCallback, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type GalleryItem = {
  id: string;
  url: string;
  name: string;
  caption: string;
  alt: string;
};

type Props = {
  images: GalleryItem[];
};

export function GalleryGrid({ images }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const prev = useCallback(
    () =>
      setOpenIndex((i) =>
        i === null ? i : (i - 1 + images.length) % images.length
      ),
    [images.length]
  );
  const next = useCallback(
    () =>
      setOpenIndex((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length]
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

  if (images.length === 0) {
    return (
      <div className="rounded-xl border border-dashed py-20 text-center text-gray-400">
        No photos in the gallery yet. Check back soon!
      </div>
    );
  }

  return (
    <>
      {/* Masonry layout using CSS columns — images keep their natural aspect ratios */}
      <div className="columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4 [&>*]:mb-3 sm:[&>*]:mb-4">
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setOpenIndex(i)}
            className="group relative block w-full break-inside-avoid overflow-hidden rounded-lg border border-gray-200 bg-gray-100 transition-all hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
            aria-label={`Open ${img.caption || img.name}`}
          >
            <img
              src={img.url}
              alt={img.alt || img.caption || img.name}
              loading="lazy"
              className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {img.caption && (
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-left text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                {img.caption}
              </span>
            )}
          </button>
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
          {/* Close */}
          <button
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
          >
            <X className="size-5" />
          </button>

          {/* Previous */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous image"
              className="absolute left-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
            >
              <ChevronLeft className="size-6" />
            </button>
          )}

          {/* Image */}
          <figure
            className="flex max-h-full max-w-5xl flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            { }
            <img
              src={images[openIndex].url}
              alt={images[openIndex].alt || images[openIndex].caption || images[openIndex].name}
              className="max-h-[82vh] max-w-full rounded-lg object-contain"
            />
            {images[openIndex].caption && (
              <figcaption className="mt-3 text-center text-sm text-white/80">
                {images[openIndex].caption}
              </figcaption>
            )}
          </figure>

          {/* Next */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next image"
              className="absolute right-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
            >
              <ChevronRight className="size-6" />
            </button>
          )}

          {/* Counter */}
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-medium text-white/60">
            {openIndex + 1} / {images.length}
          </span>
        </div>
      )}
    </>
  );
}
