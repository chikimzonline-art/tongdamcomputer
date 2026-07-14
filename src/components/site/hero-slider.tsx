"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Quote,
  GraduationCap,
  Building,
  UtensilsCrossed,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

interface HeroSliderProps {
  heroTitle: string;
  heroSubtitle: string;
  founder: string;
  foundedYear: string;
  children?: React.ReactNode;
}

export function HeroSlider({
  heroTitle,
  heroSubtitle,
  founder,
  foundedYear,
  children,
}: HeroSliderProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Autoplay functionality (advancing every 6 seconds)
  React.useEffect(() => {
    if (!api) return;

    const intervalId = setInterval(() => {
      api.scrollNext();
    }, 6000);

    return () => clearInterval(intervalId);
  }, [api]);

  const handleDotClick = React.useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  const slides = [
    {
      id: "slide-1",
      badge: `Established ${foundedYear} · Community First`,
      badgeIcon: Sparkles,
      title: heroTitle,
      subtitle: heroSubtitle,
      btn1Text: "Explore Our Ventures",
      btn1Href: "#departments",
      btn2Text: "Contact Us",
      btn2Href: "/contact",
      bgImage: "/institute-hero.png",
      cardTitle: "Our Mission",
      cardIcon: Quote,
      cardText: "To uplift the local community by providing accessible digital services, quality skill-based training, and genuine customer care — all under one trusted roof.",
      cardFooterTitle: "Founded by",
      cardFooterSubtitle: founder,
      cardBadge: "Govt. Recognised · E-Max India Affiliated",
    },
    {
      id: "slide-2",
      badge: "Govt. Recognized · 100% Placement",
      badgeIcon: GraduationCap,
      title: "Shape Your Future with In-Demand Skills",
      subtitle: "Learn DCA, ADCA, Tally Prime, and Web Development at our top-ranked computer institute. Or master fashion and garments at our tailoring training school.",
      btn1Text: "Computer Training",
      btn1Href: "/education/computer-training",
      btn2Text: "Tailoring Center",
      btn2Href: "/education/tailoring",
      bgImage: "/training-hero.png",
      cardTitle: "Vocational Excellence",
      cardIcon: GraduationCap,
      cardText: "Equipping local youth and professionals with accredited certifications to land job roles and secure financial independence.",
      cardFooterTitle: "Affiliated to",
      cardFooterSubtitle: "E-Max India (Top 1 nationwide)",
      cardBadge: "100% Placement Guarantee (Hotel Management)",
    },
    {
      id: "slide-3",
      badge: "Authorized UCO Bank CSP · Aadhaar Center",
      badgeIcon: Building,
      title: "Your Hub for Secure Banking & Public Services",
      subtitle: "Skip the long queues. Securely deposit cash, execute transfers, apply for Aadhaar cards, updates, PAN cards, Voter IDs, or print digital documents locally.",
      btn1Text: "Explore Services",
      btn1Href: "/services/computer-works",
      btn2Text: "Contact Desk",
      btn2Href: "/contact",
      bgImage: "/citizen-hero.png",
      cardTitle: "Citizen Digital Services",
      cardIcon: ShieldCheck,
      cardText: "Bringing critical financial and government services directly to Churachandpur's doorstep with complete security and speed.",
      cardFooterTitle: "Authorized CSP for",
      cardFooterSubtitle: "UCO Bank (Government of India)",
      cardBadge: "Official Aadhaar Enrolment & Updates Station",
    },
    {
      id: "slide-4",
      badge: "Tongdam Restaurant · Mobile Repair Center",
      badgeIcon: UtensilsCrossed,
      title: "Warm Hospitality & Professional Tech Care",
      subtitle: "Enjoy fresh local and multi-cuisine meals at our family restaurant, or get expert chip-level smartphone repairs using genuine replacement parts.",
      btn1Text: "Dine with Us",
      btn1Href: "/lifestyle/restaurant",
      btn2Text: "Mobile Servicing",
      btn2Href: "/services/mobile-hub",
      bgImage: "/restaurant-hero.png",
      cardTitle: "Lifestyle & Tech Solutions",
      cardIcon: Sparkles,
      cardText: "From farm-fresh ingredients on your plate to premium troubleshooting and diagnostics on your phone — quality is our benchmark.",
      cardFooterTitle: "Located at",
      cardFooterSubtitle: "Main Market Road, Churachandpur",
      cardBadge: "Restaurant Dining & Mobile Hardware Training",
    },
  ];

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative w-full border-b border-stone-200 bg-[#f6f3ec] overflow-hidden"
    >
      {/* Background Image of the entire Section */}
      <div className="absolute inset-0 z-0 w-full h-full select-none">
        {slides.map((slide, index) => (
          <img
            key={slide.id}
            src={slide.bgImage}
            alt=""
            className={cn(
              "absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000",
              index === current ? "opacity-100" : "opacity-0"
            )}
          />
        ))}
        {/* Unified overlay that covers the entire section */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#f6f3ec]/85 via-[#f6f3ec]/65 to-[#f6f3ec]/35 md:bg-gradient-to-r md:from-[#f6f3ec] md:via-[#f6f3ec]/60 md:to-[#f6f3ec]/15 z-0" />
      </div>

      <div className="relative z-10 w-full">
        <div className="relative w-full">
          <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
            <CarouselContent className="ml-0">
              {slides.map((slide) => {
                const BadgeIcon = slide.badgeIcon;
                const CardIcon = slide.cardIcon;

                return (
                  <CarouselItem key={slide.id} className="relative pl-0">
                    {/* HERO BODY */}
                    <div className="relative w-full overflow-hidden bg-transparent py-10 md:py-16 lg:py-20 md:flex md:min-h-[520px] lg:min-h-[580px] md:flex-col md:justify-center">

                  {/* Subtle grid pattern */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-0 opacity-35"
                    style={{
                      backgroundImage:
                        "linear-gradient(#e7e5e4 1px, transparent 1px), linear-gradient(90deg, #e7e5e4 1px, transparent 1px)",
                      backgroundSize: "26px 26px",
                      maskImage:
                        "radial-gradient(ellipse at center, rgba(0,0,0,0.7), transparent 75%)",
                      WebkitMaskImage:
                        "radial-gradient(ellipse at center, rgba(0,0,0,0.7), transparent 75%)",
                    }}
                  />

                  {/* Slide Content Container */}
                  <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6">
                    <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-12 md:gap-8 lg:gap-12">
                      
                      {/* Left column: heading + buttons + mini stats */}
                      <div className="md:col-span-7">
                        <Badge
                          variant="secondary"
                          className="mb-4 gap-1.5 border-emerald-200 bg-white px-3 py-1 text-xs font-medium text-emerald-700 shadow-sm"
                        >
                          <BadgeIcon className="size-3.5 text-amber-500" aria-hidden="true" />
                          {slide.badge}
                        </Badge>

                        <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight text-emerald-700 md:text-[2.25rem] lg:text-[3.25rem]">
                          {slide.title}
                        </h1>

                        <p className="mt-4 max-w-xl text-pretty text-sm leading-relaxed text-stone-600 md:text-stone-700 md:text-sm lg:text-lg">
                          {slide.subtitle}
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                          <Button
                            asChild
                            size="lg"
                            className="bg-emerald-700 text-white shadow-sm hover:bg-emerald-800"
                          >
                            <Link href={slide.btn1Href}>
                              {slide.btn1Text}
                              <ArrowRight className="size-4" aria-hidden="true" />
                            </Link>
                          </Button>
                          <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="border-stone-300 bg-white text-stone-700 hover:bg-stone-100 hover:text-stone-900"
                          >
                            <Link href={slide.btn2Href}>{slide.btn2Text}</Link>
                          </Button>
                        </div>
                      </div>

                      {/* Right column: info card */}
                      <div className="mx-auto w-full max-w-md md:col-span-5 md:max-w-none md:mx-0">
                        <div className="relative animate-in fade-in zoom-in-95 duration-500">
                          {/* Floating badge */}
                          {slide.id === "slide-1" && (
                            <div className="absolute -right-2 -top-3 z-10 flex flex-col items-center rounded-xl bg-amber-500 px-3 py-2 text-center shadow-lg sm:-right-4 sm:-top-4">
                              <span className="text-lg font-bold leading-none text-white">100%</span>
                              <span className="text-[10px] font-medium uppercase tracking-wide text-white/90">
                                Placement
                              </span>
                            </div>
                          )}

                          <div className="rounded-2xl bg-emerald-700 p-7 text-white shadow-xl sm:p-8">
                            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-200">
                              {slide.cardTitle}
                            </p>
                            <CardIcon className="mt-4 size-7 text-amber-400" aria-hidden="true" />
                            <p className="mt-3 text-lg font-medium italic leading-relaxed text-emerald-50">
                              &ldquo;{slide.cardText}&rdquo;
                            </p>

                            <div className="mt-6 border-t border-emerald-600 pt-5">
                              <p className="text-xs uppercase tracking-wide text-emerald-200">
                                {slide.cardFooterTitle}
                              </p>
                              <p className="mt-0.5 text-base font-semibold text-white">
                                {slide.cardFooterSubtitle}
                              </p>
                            </div>

                            <div className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-emerald-800/60 px-4 py-2.5 text-center">
                              <ShieldCheck
                                className="size-4 shrink-0 text-amber-400"
                                aria-hidden="true"
                              />
                              <span className="text-xs font-medium leading-tight text-emerald-50">
                                {slide.cardBadge}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>

        {/* Pagination Dots */}
        {count > 1 && (
          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  current === index
                    ? "w-8 bg-emerald-700"
                    : "w-2.5 bg-stone-400/60 hover:bg-stone-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={current === index}
              />
            ))}
          </div>
        )}
      </div>

      {children}
    </div>
  </section>
  );
}
