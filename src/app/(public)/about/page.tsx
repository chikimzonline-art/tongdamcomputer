import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  User,
  MapPin,
  Target,
  Eye,
  Heart,
  ShieldCheck,
  Sprout,
  GraduationCap,
  Sparkles,
  ChevronRight,
  HandHeart,
  Award,
  Building2,
  Quote,
} from "lucide-react";
import { getSiteContentMap } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Milestone = {
  year: string;
  title: string;
  detail: string;
};

const MILESTONES: Milestone[] = [
  {
    year: "2020",
    title: "Founded",
    detail:
      "Founded by Mr. P Soiminthang Zou as an in-house digital-access initiative in Churachandpur, Manipur.",
  },
  {
    year: "2021",
    title: "Public Services Launch",
    detail:
      "Expanded into CSP (UCO Bank) and Aadhaar public services to serve the local community.",
  },
  {
    year: "2022",
    title: "Tongdam Computer Training Center",
    detail:
      "Launched the Tongdam Computer Training Center, affiliated to E-Max India.",
  },
  {
    year: "2023",
    title: "Vocational Expansion",
    detail:
      "Added the Tailoring Training Center and Hotel Management Institute to the campus.",
  },
  {
    year: "2024",
    title: "Multi-Department Hub",
    detail:
      "Now a multi-department hub — Restaurant, Mobile Hub, and 6 departments serving the community.",
  },
];

type Value = {
  title: string;
  description: string;
  icon: React.ElementType;
};

const CORE_VALUES: Value[] = [
  {
    title: "Customer-First Philosophy",
    description:
      "Every decision starts with what serves our community best — not what is easiest for us.",
    icon: HandHeart,
  },
  {
    title: "Integrity & Trust",
    description:
      "Transparent pricing, honest advice, and dependable services that locals can rely on.",
    icon: ShieldCheck,
  },
  {
    title: "Community Upliftment",
    description:
      "We exist to lift Churachandpur — through skills, services, and steady employment.",
    icon: Sprout,
  },
  {
    title: "Excellence in Training",
    description:
      "Top 1 E-Max institute nationwide. Our students don't just enrol — they graduate job-ready.",
    icon: Award,
  },
];

export default async function AboutPage() {
  const content = await getSiteContentMap();
  const founder = content["about.founder"] ?? "Mr. P Soiminthang Zou";
  const foundedYear = content["about.foundedYear"] ?? "2020";
  const story =
    content["about.story"] ??
    "Tongdam Computers began as a modest in-house initiative with a singular mission: to uplift the local community by providing robust digital access.";

  return (
    <>
      {/* ============== HERO HEADER ============== */}
      <section
        aria-labelledby="about-hero-heading"
        className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-700 text-white"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage:
              "radial-gradient(ellipse at top right, rgba(0,0,0,0.9), transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at top right, rgba(0,0,0,0.9), transparent 70%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-amber-400/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-24 size-80 rounded-full bg-teal-300/20 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-xs text-emerald-50/80 sm:text-sm">
              <li>
                <Link
                  href="/"
                  className="rounded transition-colors hover:text-amber-300"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="size-3.5" />
              </li>
              <li className="font-medium text-white" aria-current="page">
                About
              </li>
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
            <h1
              id="about-hero-heading"
              className="text-4xl font-bold tracking-tight drop-shadow-sm sm:text-5xl"
            >
              About Tongdam Computers
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-emerald-50/90 sm:text-lg">
              A local initiative that became a multi-sector anchor.
            </p>
          </div>
        </div>
      </section>

      {/* ============== OUR STORY ============== */}
      <section
        aria-labelledby="story-heading"
        className="bg-gray-50 py-16 lg:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Pill badge */}
          <div className="mb-8 flex justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-4 py-1.5 text-sm font-medium text-stone-700">
              <Heart className="size-3.5 text-amber-500" aria-hidden="true" />
              Our Story
            </span>
          </div>

          {/* Two-column: founder (left) + story text (right) */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Left: Founder card */}
            <div className="flex flex-col items-center lg:items-start">
              {/* Founder image area with teal/orange background */}
              <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
                {/* Orange diagonal accent */}
                <div
                  aria-hidden="true"
                  className="absolute -right-10 top-0 h-40 w-40 rotate-12 bg-amber-400/80"
                />
                {/* FOUNDER badge */}
                <span className="absolute right-3 top-3 z-10 rounded bg-amber-500 px-2 py-0.5 text-xs font-semibold text-white">
                  FOUNDER
                </span>
                {/* Placeholder avatar (circular) */}
                <div className="relative flex aspect-square items-center justify-center">
                  <span className="flex size-32 items-center justify-center rounded-full bg-white/20 text-5xl font-bold text-white backdrop-blur-sm sm:size-40">
                    {founder.charAt(founder.indexOf(" ") + 1) || "T"}
                  </span>
                </div>
              </div>

              {/* Caption below image */}
              <p className="mt-2 flex items-center gap-1.5 text-xs text-stone-500">
                <User className="size-3.5 text-emerald-700" aria-hidden="true" />
                {founder}
              </p>

              {/* Founder info bar */}
              <div className="mt-4 w-full max-w-sm rounded-lg bg-emerald-700 p-4 text-white shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-800 text-sm font-bold text-white">
                    {founder.charAt(founder.indexOf(" ") + 1) || "T"}
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-100">
                      Founder &amp; Director
                    </p>
                    <p className="text-lg font-bold text-white">{founder}</p>
                    <p className="text-xs italic text-emerald-100">
                      Established {foundedYear}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Story text */}
            <article>
              <h2
                id="story-heading"
                className="sr-only"
              >
                Our Story
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-stone-600">
                <p>
                  Tongdam Computers was founded in the year {foundedYear} by{" "}
                  {founder} with a singular vision — to uplift the local
                  community by providing proper digital access and quality
                  skill-based education. What began as a small in-house venture
                  has grown steadily over the years into a multi-faceted
                  organization serving the community across several disciplines.
                </p>
                <p>
                  From its very first day, Tongdam Computers has embraced a
                  customer-first approach. Helping the community is not just our
                  mission — it is the very foundation upon which every decision
                  is made. We believe that when you equip people with the right
                  skills and bring essential digital and financial services to
                  their doorstep, you transform not just individuals but entire
                  neighborhoods.
                </p>
                <p>
                  Today, Tongdam Computers operates multiple institutes and
                  service centers, each dedicated to a specific area of
                  empowerment — from computer education and hotel management to
                  tailoring, mobile repairing, and essential citizen services.
                  Every venture under the Tongdam umbrella shares the same
                  commitment: quality training, genuine service, and a deep
                  sense of responsibility toward the community we serve.
                </p>
              </div>

              {/* Tagline with vertical line */}
              <div className="mt-6 flex items-center gap-3">
                <span
                  className="h-5 w-0.5 bg-emerald-600"
                  aria-hidden="true"
                />
                <p className="text-sm italic text-stone-700">
                  Serving the community with dedication since {foundedYear}.
                </p>
              </div>
            </article>
          </div>

          {/* Three cards: Founder's Words, Mission, Vision */}
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Founder's Words */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <span className="mb-4 flex size-10 items-center justify-center rounded-full bg-amber-50">
                <Quote className="size-5 text-amber-500" aria-hidden="true" />
              </span>
              <h3 className="text-lg font-semibold text-stone-800">
                Founder&rsquo;s Words
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">
                &ldquo;We started with a simple belief — that digital access and
                quality skills can transform lives. Today, that belief drives
                every venture under the Tongdam umbrella.&rdquo;
              </p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-stone-500">
                — {founder.toUpperCase()}
              </p>
            </div>

            {/* Our Mission */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <span className="mb-4 flex size-10 items-center justify-center rounded-full bg-emerald-50">
                <Target className="size-5 text-emerald-600" aria-hidden="true" />
              </span>
              <h3 className="text-lg font-semibold text-stone-800">
                Our Mission
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">
                To uplift the local community by providing accessible digital
                services, quality skill-based training, and genuine
                customer-first support — ensuring that no one is left behind in
                the journey toward progress.
              </p>
            </div>

            {/* Our Vision */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <span className="mb-4 flex size-10 items-center justify-center rounded-full bg-emerald-50">
                <Eye className="size-5 text-emerald-600" aria-hidden="true" />
              </span>
              <h3 className="text-lg font-semibold text-stone-800">
                Our Vision
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">
                To be the most trusted and impactful community empowerment hub
                in the region, where every individual has the opportunity to
                learn, grow, and build a better livelihood through digital
                access and skill development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============== GROWTH TIMELINE ============== */}
      <section
        aria-labelledby="timeline-heading"
        className="bg-emerald-50/60 py-16 lg:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Badge
              variant="secondary"
              className="mb-3 gap-1 border-emerald-200 bg-emerald-100 text-emerald-700"
            >
              <Sparkles className="size-3.5" aria-hidden="true" />
              Our Journey
            </Badge>
            <h2
              id="timeline-heading"
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              Growth timeline
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Five years, five milestones — each one adding more value to the
              community we serve.
            </p>
          </div>

          <ol className="mx-auto mt-12 max-w-3xl space-y-6">
            {MILESTONES.map((m, i) => {
              const isLast = i === MILESTONES.length - 1;
              return (
                <li key={m.year} className="relative flex gap-4 sm:gap-6">
                  {/* Vertical line */}
                  {!isLast && (
                    <span
                      aria-hidden="true"
                      className="absolute left-[18px] top-10 bottom-[-24px] w-px bg-emerald-200 sm:left-[22px]"
                    />
                  )}
                  {/* Dot */}
                  <span
                    aria-hidden="true"
                    className="relative z-10 mt-1 flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-emerald-600 bg-white sm:size-11"
                  >
                    <span className="size-3 rounded-full bg-emerald-600 sm:size-3.5" />
                  </span>

                  {/* Card */}
                  <Card className="flex-1 border-emerald-100 bg-white py-0 transition-shadow hover:shadow-md hover:shadow-emerald-100/60">
                    <CardContent className="p-5 sm:p-6">
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge
                          variant="secondary"
                          className="border-amber-200 bg-amber-100 text-amber-700"
                        >
                          {m.year}
                        </Badge>
                        <h3 className="text-lg font-semibold text-foreground">
                          {m.title}
                        </h3>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {m.detail}
                      </p>
                    </CardContent>
                  </Card>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ============== MISSION & VISION ============== */}
      <section
        aria-labelledby="mission-vision-heading"
        className="bg-white py-16 lg:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Badge
              variant="secondary"
              className="mb-3 gap-1 border-emerald-200 bg-emerald-100 text-emerald-700"
            >
              <Target className="size-3.5" aria-hidden="true" />
              What Drives Us
            </Badge>
            <h2
              id="mission-vision-heading"
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              Mission &amp; Vision
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              The principles that guide every decision at Tongdam Computers.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Mission */}
            <Card className="group relative overflow-hidden border-emerald-100 py-0 transition-shadow hover:shadow-lg hover:shadow-emerald-100/60">
              <div
                aria-hidden="true"
                className="absolute -right-12 -top-12 size-40 rounded-full bg-emerald-100/60 blur-2xl transition-transform group-hover:translate-x-2 group-hover:-translate-y-2"
              />
              <CardContent className="relative p-6 sm:p-8">
                <span className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-sm">
                  <Target className="size-7" aria-hidden="true" />
                </span>
                <h3 className="text-xl font-semibold text-foreground">
                  Our Mission
                </h3>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                  To uplift the local community by providing robust digital
                  access, elite vocational training, and essential public
                  services under one trusted roof.
                </p>
              </CardContent>
            </Card>

            {/* Vision */}
            <Card className="group relative overflow-hidden border-emerald-100 py-0 transition-shadow hover:shadow-lg hover:shadow-emerald-100/60">
              <div
                aria-hidden="true"
                className="absolute -right-12 -top-12 size-40 rounded-full bg-amber-100/60 blur-2xl transition-transform group-hover:translate-x-2 group-hover:-translate-y-2"
              />
              <CardContent className="relative p-6 sm:p-8">
                <span className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-sm">
                  <Eye className="size-7" aria-hidden="true" />
                </span>
                <h3 className="text-xl font-semibold text-foreground">
                  Our Vision
                </h3>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                  To be the most trusted multi-sector anchor in the region —
                  empowering every household with skills, services, and
                  opportunity.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ============== CORE VALUES ============== */}
      <section
        aria-labelledby="values-heading"
        className="bg-emerald-50/60 py-16 lg:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Badge
              variant="secondary"
              className="mb-3 gap-1 border-emerald-200 bg-emerald-100 text-emerald-700"
            >
              <Heart className="size-3.5" aria-hidden="true" />
              Our Values
            </Badge>
            <h2
              id="values-heading"
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              Core values we live by
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              The non-negotiables that shape how we work, train, and serve.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CORE_VALUES.map((value) => {
              const Icon = value.icon;
              return (
                <Card
                  key={value.title}
                  className="group flex flex-col border-emerald-100 bg-white py-0 transition-all duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/60"
                >
                  <CardContent className="flex flex-1 flex-col p-6">
                    <span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    <h3 className="text-base font-semibold text-foreground">
                      {value.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============== CTA BAND ============== */}
      <section
        aria-labelledby="about-cta-heading"
        className="bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-700 text-white"
      >
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-16">
          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row lg:text-left">
            <div className="max-w-2xl text-center lg:text-left">
              <Badge
                variant="secondary"
                className="mb-3 gap-1 border-emerald-300/30 bg-white/10 px-3 py-1 text-xs font-medium text-emerald-50 backdrop-blur"
              >
                <GraduationCap className="size-3.5 text-amber-300" aria-hidden="true" />
                Join the Tongdam Family
              </Badge>
              <h2
                id="about-cta-heading"
                className="text-2xl font-bold tracking-tight sm:text-3xl"
              >
                Want to be part of our journey?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-emerald-50/90 sm:text-base">
                Whether you want to enroll in a course, apply for a public
                service, or simply visit our campus — we&apos;d love to hear from
                you.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-amber-500 text-emerald-950 shadow-lg shadow-amber-900/20 hover:bg-amber-400"
              >
                <Link href="/contact">
                  Contact Us
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-white/5 text-white backdrop-blur hover:bg-white/15 hover:text-white"
              >
                <Link href="/#departments">
                  Explore Departments
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
