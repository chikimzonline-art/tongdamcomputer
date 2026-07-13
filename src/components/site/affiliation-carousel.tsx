"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Award,
  Building2,
  Hotel,
  UtensilsCrossed,
  Briefcase,
  Star,
  BadgeCheck,
  Landmark,
  Sparkles,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Affiliation = {
  name: string;
  category: string;
  description: string;
  icon: React.ElementType;
  accent: string;
};

/**
 * Affiliations & brand partners — covers E-Max India (govt. recognition),
 * the Hotel Management 5-star placement network, and institutional partners.
 */
const AFFILIATIONS: Affiliation[] = [
  {
    name: "E-Max India",
    category: "Education Affiliation",
    description:
      "Govt. of India recognized vocational education body — Tongdam is the Top 1 ranked institute nationwide.",
    icon: BadgeCheck,
    accent: "from-emerald-500 to-teal-600",
  },
  {
    name: "Govt. of India",
    category: "Government Recognition",
    description:
      "All E-Max certifications issued at Tongdam are recognized by the Government of India and valid nationwide.",
    icon: Landmark,
    accent: "from-emerald-600 to-emerald-800",
  },
  {
    name: "UCO Bank CSP",
    category: "Banking Partner",
    description:
      "Authorized Customer Service Point for UCO Bank — delivering banking services to the local community.",
    icon: Building2,
    accent: "from-violet-500 to-violet-700",
  },
  {
    name: "5-Star Hotel Network",
    category: "Hotel Management Placement",
    description:
      "Pan-India placement network across leading 5-star hotels — 100% placement guarantee for HM diploma graduates.",
    icon: Hotel,
    accent: "from-amber-500 to-amber-700",
  },
  {
    name: "Hospitality Partners",
    category: "Industry Collaboration",
    description:
      "Resort chains, cruise lines, and fine-dining restaurants actively recruit from our Hotel Management batches.",
    icon: UtensilsCrossed,
    accent: "from-rose-500 to-pink-700",
  },
  {
    name: "Taj Group",
    category: "Premier Placement Partner",
    description:
      "Our graduates have been placed at Taj properties across India — a testament to our training quality.",
    icon: Star,
    accent: "from-amber-600 to-orange-700",
  },
  {
    name: "ITC Hotels",
    category: "Premier Placement Partner",
    description:
      "ITC Hotels welcomes our trained hotel management students into front office, F&B, and housekeeping roles.",
    icon: Building2,
    accent: "from-emerald-600 to-teal-700",
  },
  {
    name: "Oberoi Group",
    category: "Premier Placement Partner",
    description:
      "The Oberoi Group partners with us to hire skilled hospitality professionals from our diploma program.",
    icon: Briefcase,
    accent: "from-violet-600 to-purple-700",
  },
];

const ITEMS_PER_SLIDE = 4;

export function AffiliationCarousel() {
  const [index, setIndex] = useState(0);

  const totalSlides = Math.ceil(AFFILIATIONS.length / ITEMS_PER_SLIDE);

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
  const slides: Affiliation[][] = [];
  for (let i = 0; i < AFFILIATIONS.length; i += ITEMS_PER_SLIDE) {
    slides.push(AFFILIATIONS.slice(i, i + ITEMS_PER_SLIDE));
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
                  const Icon = aff.icon;
                  return (
                    <div
                      key={aff.name}
                      className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                    >
                      {/* Icon */}
                      <div
                        className={cn(
                          "mb-4 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm",
                          aff.accent
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
