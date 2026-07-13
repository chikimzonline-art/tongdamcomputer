import Link from "next/link";
import {
  ArrowRight,
  User,
  Target,
  Eye,
  Heart,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  GraduationCap,
  Quote,
} from "lucide-react";
import { getSiteContentMap, getMilestones, getCoreValues } from "@/lib/data";
import { VALUE_ICONS } from "@/lib/value-config";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const revalidate = 300;

export default async function AboutPage() {
  const content = await getSiteContentMap();
  const milestones = await getMilestones();
  const coreValues = await getCoreValues();

  const founder = content["about.founder"] ?? "Mr. P Soiminthang Zou";
  const foundedYear = content["about.foundedYear"] ?? "2020";
  const founderImageUrl = content["about.founderImageUrl"] ?? "";

  // Text content (with fallbacks)
  const heroTitle = content["about.heroTitle"] ?? "About Tongdam Computers";
  const heroSubtitle = content["about.heroSubtitle"] ?? "A local initiative that became a multi-sector anchor.";
  const storyP1 = content["about.storyP1"] ?? "";
  const storyP2 = content["about.storyP2"] ?? "";
  const storyP3 = content["about.storyP3"] ?? "";
  const tagline = content["about.tagline"] ?? `Serving the community with dedication since ${foundedYear}.`;
  const founderQuote = content["about.founderQuote"] ?? "";
  const mission = content["about.mission"] ?? "";
  const vision = content["about.vision"] ?? "";
  const timelineHeading = content["about.timelineHeading"] ?? "Growth timeline";
  const timelineSubtitle = content["about.timelineSubtitle"] ?? "";
  const valuesHeading = content["about.valuesHeading"] ?? "Core values we live by";
  const valuesSubtitle = content["about.valuesSubtitle"] ?? "";
  const ctaTitle = content["about.ctaTitle"] ?? "Want to be part of our journey?";
  const ctaDescription = content["about.ctaDescription"] ?? "";

  const founderInitial = founder.charAt(founder.indexOf(" ") + 1) || "T";

  return (
    <>
      {/* ============== HERO HEADER ============== */}
      <section
        aria-labelledby="about-hero-heading"
        className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-700 text-white"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-amber-400/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-24 size-80 rounded-full bg-teal-300/20 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-xs text-emerald-50/80 sm:text-sm">
              <li><Link href="/" className="rounded transition-colors hover:text-amber-300">Home</Link></li>
              <li aria-hidden="true"><ChevronRight className="size-3.5" /></li>
              <li className="font-medium text-white" aria-current="page">About</li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <Badge
              variant="secondary"
              className="mb-5 gap-1.5 border-emerald-300/30 bg-white/10 px-3 py-1 text-xs font-medium text-emerald-50 backdrop-blur"
            >
              <Sparkles className="size-3.5 text-amber-300" aria-hidden="true" />
              Since {foundedYear} · Churachandpur, Manipur
            </Badge>
            <h1 id="about-hero-heading" className="text-4xl font-bold tracking-tight drop-shadow-sm sm:text-5xl">
              {heroTitle}
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-emerald-50/90 sm:text-lg">
              {heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      {/* ============== OUR STORY ============== */}
      <section aria-labelledby="story-heading" className="bg-gray-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 flex justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-4 py-1.5 text-sm font-medium text-stone-700">
              <Heart className="size-3.5 text-amber-500" aria-hidden="true" />
              Our Story
            </span>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Left: Founder card */}
            <div className="flex flex-col items-center lg:items-start">
              <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
                <div aria-hidden="true" className="absolute -right-10 top-0 h-40 w-40 rotate-12 bg-amber-400/80" />
                <span className="absolute right-3 top-3 z-10 rounded bg-amber-500 px-2 py-0.5 text-xs font-semibold text-white">
                  FOUNDER
                </span>
                <div className="relative flex aspect-square items-center justify-center">
                  {founderImageUrl ? (
                    <img
                      src={founderImageUrl}
                      alt={founder}
                      className="size-full object-cover"
                    />
                  ) : (
                    <span className="flex size-32 items-center justify-center rounded-full bg-white/20 text-5xl font-bold text-white backdrop-blur-sm sm:size-40">
                      {founderInitial}
                    </span>
                  )}
                </div>
              </div>

              <p className="mt-2 flex items-center gap-1.5 text-xs text-stone-500">
                <User className="size-3.5 text-emerald-700" aria-hidden="true" />
                {founder}
              </p>

              <div className="mt-4 w-full max-w-sm rounded-lg bg-emerald-700 p-4 text-white shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-800 text-sm font-bold text-white">
                    {founderInitial}
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-100">Founder &amp; Director</p>
                    <p className="text-lg font-bold text-white">{founder}</p>
                    <p className="text-xs italic text-emerald-100">Established {foundedYear}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Story text */}
            <article>
              <h2 id="story-heading" className="sr-only">Our Story</h2>
              <div className="space-y-4 text-base leading-relaxed text-stone-600">
                {storyP1 && <p>{storyP1}</p>}
                {storyP2 && <p>{storyP2}</p>}
                {storyP3 && <p>{storyP3}</p>}
              </div>
              <div className="mt-6 flex items-center gap-3">
                <span className="h-5 w-0.5 bg-emerald-600" aria-hidden="true" />
                <p className="text-sm italic text-stone-700">{tagline}</p>
              </div>
            </article>
          </div>

          {/* Three cards */}
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <span className="mb-4 flex size-10 items-center justify-center rounded-full bg-amber-50">
                <Quote className="size-5 text-amber-500" aria-hidden="true" />
              </span>
              <h3 className="text-lg font-semibold text-stone-800">Founder&rsquo;s Words</h3>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">&ldquo;{founderQuote}&rdquo;</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-stone-500">— {founder.toUpperCase()}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <span className="mb-4 flex size-10 items-center justify-center rounded-full bg-emerald-50">
                <Target className="size-5 text-emerald-600" aria-hidden="true" />
              </span>
              <h3 className="text-lg font-semibold text-stone-800">Our Mission</h3>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">{mission}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <span className="mb-4 flex size-10 items-center justify-center rounded-full bg-emerald-50">
                <Eye className="size-5 text-emerald-600" aria-hidden="true" />
              </span>
              <h3 className="text-lg font-semibold text-stone-800">Our Vision</h3>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">{vision}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============== GROWTH TIMELINE ============== */}
      <section aria-labelledby="timeline-heading" className="bg-emerald-50/60 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-3 gap-1 border-emerald-200 bg-emerald-100 text-emerald-700">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Our Journey
            </Badge>
            <h2 id="timeline-heading" className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {timelineHeading}
            </h2>
            {timelineSubtitle && <p className="mt-4 text-base text-muted-foreground">{timelineSubtitle}</p>}
          </div>

          <ol className="mx-auto mt-12 max-w-3xl space-y-6">
            {milestones.map((m, i) => {
              const isLast = i === milestones.length - 1;
              return (
                <li key={m.id} className="relative flex gap-4 sm:gap-6">
                  {!isLast && (
                    <span aria-hidden="true" className="absolute left-[18px] top-10 bottom-[-24px] w-px bg-emerald-200 sm:left-[22px]" />
                  )}
                  <span aria-hidden="true" className="relative z-10 mt-1 flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-emerald-600 bg-white sm:size-11">
                    <span className="size-3 rounded-full bg-emerald-600 sm:size-3.5" />
                  </span>
                  <Card className="flex-1 border-emerald-100 bg-white py-0 transition-shadow hover:shadow-md hover:shadow-emerald-100/60">
                    <CardContent className="p-5 sm:p-6">
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge variant="secondary" className="border-amber-200 bg-amber-100 text-amber-700">{m.year}</Badge>
                        <h3 className="text-lg font-semibold text-foreground">{m.title}</h3>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.detail}</p>
                    </CardContent>
                  </Card>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ============== CORE VALUES ============== */}
      <section aria-labelledby="values-heading" className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-3 gap-1 border-emerald-200 bg-emerald-100 text-emerald-700">
              <Heart className="size-3.5" aria-hidden="true" />
              Our Values
            </Badge>
            <h2 id="values-heading" className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {valuesHeading}
            </h2>
            {valuesSubtitle && <p className="mt-4 text-base text-muted-foreground">{valuesSubtitle}</p>}
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((value) => {
              const Icon = VALUE_ICONS[value.icon] ?? Heart;
              return (
                <Card key={value.id} className="group flex flex-col border-emerald-100 bg-white py-0 transition-all duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/60">
                  <CardContent className="flex flex-1 flex-col p-6">
                    <span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    <h3 className="text-base font-semibold text-foreground">{value.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============== CTA BAND ============== */}
      <section aria-labelledby="about-cta-heading" className="bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-700 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-16">
          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row lg:text-left">
            <div className="max-w-2xl text-center lg:text-left">
              <Badge variant="secondary" className="mb-3 gap-1 border-emerald-300/30 bg-white/10 px-3 py-1 text-xs font-medium text-emerald-50 backdrop-blur">
                <GraduationCap className="size-3.5 text-amber-300" aria-hidden="true" />
                Join the Tongdam Family
              </Badge>
              <h2 id="about-cta-heading" className="text-2xl font-bold tracking-tight sm:text-3xl">{ctaTitle}</h2>
              {ctaDescription && <p className="mt-3 text-sm leading-relaxed text-emerald-50/90 sm:text-base">{ctaDescription}</p>}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Button asChild size="lg" className="bg-amber-500 text-emerald-950 shadow-lg shadow-amber-900/20 hover:bg-amber-400">
                <Link href="/contact">Contact Us<ArrowRight className="size-4" aria-hidden="true" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 bg-white/5 text-white backdrop-blur hover:bg-white/15 hover:text-white">
                <Link href="/#departments">Explore Departments<ArrowRight className="size-4" aria-hidden="true" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
