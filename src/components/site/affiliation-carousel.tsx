"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  AFFILIATION_ICONS,
  AFFILIATION_ACCENTS,
  DEFAULT_AFFILIATION_ACCENT,
} from "@/lib/affiliation-config";

export type AffiliationData = {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  accent: string;
};

type Props = {
  affiliations: AffiliationData[];
};

const ITEMS_PER_SLIDE = 4;

export function AffiliationCarousel({ affiliations }: Props) {
  const [index, setIndex] = useState(0);

  const totalSlides = Math.max(1, Math.ceil(affiliations.length / ITEMS_PER_SLIDE));

  function goPrev() {
    setIndex((i) => (i - 1 + totalSlides) % totalSlides);
  }
  function goNext() {
    setIndex((i) => (i + 1) % totalSlides);
  }
  function goTo(i: number) {
    setIndex(i);
  }

  // Build the slides — each slide contains up to ITEMS_PER_SLIDE cards
  const slides: AffiliationData[][] = [];
  for (let i = 0; i < affiliations.length; i += ITEMS_PER_SLIDE) {
    slides.push(affiliations.slice(i, i + ITEMS_PER_SLIDE));
  }

  if (affiliations.length === 0) {
    return (
      <div className="rounded-lg border border-dashed py-12 text-center text-gray-400">
        No affiliations to display yet.
      </div>
    );
  }

  return (
    <div
      aria-roledescription="carousel"
      aria-label="Affiliations and brand partners"
      className="relative"
    >
      {/* Slides viewport */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, slideIdx) => (
            <div
              key={slideIdx}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${slideIdx + 1} of ${totalSlides}`}
              className="min-w-full shrink-0 grow-0 basis-full"
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {slide.map((aff) => {
                  const Icon = AFFILIATION_ICONS[aff.icon] ?? AFFILIATION_ICONS.BadgeCheck;
                  const accentCfg =
                    AFFILIATION_ACCENTS[aff.accent] ?? DEFAULT_AFFILIATION_ACCENT;
                  return (
                    <div
                      key={aff.id}
                      className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                    >
                      {/* Icon */}
                      <div
                        className={cn(
                          "mb-4 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm",
                          accentCfg.gradient
                        )}
                      >
                        <Icon className="size-6" aria-hidden="true" />
                      </div>

                      {/* Category tag */}
                      <span className="mb-1.5 inline-flex w-fit items-center rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-600">
                        {aff.category}
                      </span>

                      {/* Name */}
                      <h3 className="text-base font-bold text-gray-900">
                        {aff.name}
                      </h3>

                      {/* Description */}
                      <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
                        {aff.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={goPrev}
          aria-label="Previous slide"
          className="rounded-full border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-emerald-700"
        >
          <ArrowLeft className="size-4" />
        </Button>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === index
                  ? "w-8 bg-emerald-600"
                  : "w-2 bg-gray-300 hover:bg-gray-400"
              )}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={goNext}
          aria-label="Next slide"
          className="rounded-full border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-emerald-700"
        >
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
