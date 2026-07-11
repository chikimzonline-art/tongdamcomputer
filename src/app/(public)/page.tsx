import Link from "next/link";
import {
  ArrowRight,
  Phone,
  Sparkles,
  ShieldCheck,
  Trophy,
  Users,
  Computer,
  Smartphone,
  GraduationCap,
  Scissors,
  Hotel,
  Utensils,
  CalendarCheck,
  BookOpen,
  IdCard,
  Quote,
  Star,
  TrendingUp,
  MapPin,
  Mail,
  Briefcase,
  Check,
  Wrench,
} from "lucide-react";
import { getSiteContentMap } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Venture = {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  badge: string;
  features: string[];
  /** Tailwind classes for accent color (bar/icon/badge-bg/badge-text/feature-dot) */
  accent: {
    bar: string;
    iconBg: string;
    iconText: string;
    badgeBg: string;
    badgeText: string;
    dot: string;
  };
};

const VENTURES: Venture[] = [
  {
    title: "Computer Works",
    description:
      "Your trusted center for banking services, Aadhaar, PAN, voter ID, birth certificates, DTP & printing — all in one place.",
    href: "/services/computer-works",
    icon: Computer,
    badge: "Authorized CSP • UCO Bank",
    features: [
      "UCO Bank CSP (Authorized)",
      "Aadhaar Enrolment & Updates",
      "PAN Card Services",
    ],
    accent: {
      bar: "bg-emerald-500",
      iconBg: "bg-emerald-50",
      iconText: "text-emerald-600",
      badgeBg: "bg-emerald-50",
      badgeText: "text-emerald-700",
      dot: "text-emerald-500",
    },
  },
  {
    title: "Tongdam Computer Training Center",
    description:
      "Top 1 Institute under E-Max India all over India — providing certified computer education with placement support.",
    href: "/education/computer-training",
    icon: GraduationCap,
    badge: "Top 1 in India • E-Max India",
    features: [
      "Govt. Recognized Certifications",
      "Top 1 Ranked Institute",
      "Experienced Faculty",
    ],
    accent: {
      bar: "bg-emerald-500",
      iconBg: "bg-emerald-50",
      iconText: "text-emerald-600",
      badgeBg: "bg-emerald-50",
      badgeText: "text-emerald-700",
      dot: "text-emerald-500",
    },
  },
  {
    title: "Tongdam Tailoring Training Center",
    description:
      "Professional tailoring training programs designed to empower individuals with a lifelong, income-generating skill.",
    href: "/education/tailoring",
    icon: Scissors,
    badge: "Skill Development Program",
    features: [
      "Basic to Advanced Tailoring",
      "Pattern Making & Design",
      "Professional Machine Training",
    ],
    accent: {
      bar: "bg-pink-500",
      iconBg: "bg-pink-50",
      iconText: "text-pink-600",
      badgeBg: "bg-pink-50",
      badgeText: "text-pink-700",
      dot: "text-pink-500",
    },
  },
  {
    title: "Tongdam Institute of Hotel Management",
    description:
      "One-year diploma program with guaranteed 100% placement across 5-star hotels all over India.",
    href: "/education/hotel-management",
    icon: Hotel,
    badge: "100% Placement • 5-Star Hotels",
    features: [
      "1-Year Diploma Program",
      "Front Office Training",
      "Housekeeping & F&B Service",
    ],
    accent: {
      bar: "bg-amber-500",
      iconBg: "bg-amber-50",
      iconText: "text-amber-600",
      badgeBg: "bg-amber-50",
      badgeText: "text-amber-700",
      dot: "text-amber-500",
    },
  },
  {
    title: "Tongdam Restaurant",
    description:
      "A warm, welcoming dining destination serving delicious local and multi-cuisine dishes made with fresh ingredients.",
    href: "/lifestyle/restaurant",
    icon: Utensils,
    badge: "Fresh • Local • Welcoming",
    features: [
      "Local & Multi-Cuisine Menu",
      "Fresh Ingredients Daily",
      "Family-Friendly Atmosphere",
    ],
    accent: {
      bar: "bg-amber-500",
      iconBg: "bg-amber-50",
      iconText: "text-amber-600",
      badgeBg: "bg-amber-50",
      badgeText: "text-amber-700",
      dot: "text-amber-500",
    },
  },
  {
    title: "Tongdam Mobile Repairing Center",
    description:
      "A service center cum training institute for mobile phone repair — learn a high-demand skill or get your device fixed.",
    href: "/services/mobile-hub",
    icon: Wrench,
    badge: "Repair + Training Center",
    features: [
      "All-Brand Mobile Repair",
      "Chip-Level Repair Training",
      "Genuine Parts Used",
    ],
    accent: {
      bar: "bg-violet-500",
      iconBg: "bg-violet-50",
      iconText: "text-violet-600",
      badgeBg: "bg-violet-50",
      badgeText: "text-violet-700",
      dot: "text-violet-500",
    },
  },
];

const STATS = [
  { label: "Business Ventures", value: "6+", icon: Briefcase },
  { label: "Students Trained", value: "1000+", icon: Users },
  { label: "Courses Offered", value: "17+", icon: BookOpen },
  { label: "Rank in India (E-Max)", value: "Top 1", icon: Trophy },
];

const QUICK_ACTIONS = [
  {
    title: "Book a Table",
    description: "Reserve your spot at our multi-cuisine restaurant for lunch or dinner.",
    href: "/lifestyle/restaurant",
    icon: CalendarCheck,
    cta: "View menu & book",
  },
  {
    title: "Enroll in a Course",
    description: "Admissions open for DCA, ADCA, Tally, Web Dev, Tailoring & Hotel Management.",
    href: "/education/computer-training",
    icon: BookOpen,
    cta: "Explore courses",
  },
  {
    title: "Apply for Aadhaar / PAN",
    description: "Walk-in Aadhaar enrolment, PAN card application and CSP banking services.",
    href: "/services/computer-works",
    icon: IdCard,
    cta: "Service details",
  },
];

const TIMELINE = [
  { year: "2020", label: "Founded", detail: "In-house startup in Churachandpur, Manipur" },
  { year: "2021", label: "Computer Training", detail: "Affiliated to E-Max India; first DCA batch" },
  { year: "2022", label: "Public Services", detail: "Aadhaar / PAN / CSP banking added" },
  { year: "2023", label: "Lifestyle Hub", detail: "Restaurant & tailoring launched" },
  { year: "2024", label: "Top 1 Institute", detail: "Ranked #1 E-Max institute nationwide" },
];

export default async function HomePage() {
  const content = await getSiteContentMap();
  const heroTitle = content["hero.title"] ?? "From a Local Startup to a Multi-Department Hub";
  const heroSubtitle =
    content["hero.subtitle"] ??
    "Founded in 2020 by Mr. P Soiminthang Zou, Tongdam Computers delivers elite vocational training, essential public services, and lifestyle amenities — all under one trusted roof.";
  const story = content["about.story"] ?? "";
  const foundedYear = content["about.foundedYear"] ?? "2020";
  const founder = content["about.founder"] ?? "Mr. P Soiminthang Zou";
  const phone1 = content["contact.phone1"] ?? "";
  const email = content["contact.email"] ?? "";
  const address = content["contact.address"] ?? "";
  const emaxBadge =
    content["training.emaxBadge"] ?? "Affiliated to E-Max India | Recognized by Govt. of India";
  const topRank = content["training.topRank"] ?? "Top 1 Institute under E-Max India nationwide";

  return (
    <>
      {/* ============== HERO (contains stats) — header + hero = 100vh on desktop ============== */}
      <section
        aria-labelledby="hero-heading"
        className="relative overflow-hidden border-b border-stone-200 bg-[#f6f3ec] lg:flex lg:min-h-[calc(100svh-4rem)] lg:flex-col lg:justify-center"
      >
        {/* Subtle grid pattern */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60"
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

        <div className="relative mx-auto max-w-7xl px-4 pt-12 pb-6 sm:px-6 lg:pt-8 lg:pb-4">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Left column: heading + buttons + mini stats */}
            <div className="lg:col-span-7">
              <Badge
                variant="secondary"
                className="mb-5 gap-1.5 border-emerald-200 bg-white px-3 py-1 text-xs font-medium text-emerald-700 shadow-sm"
              >
                <Sparkles className="size-3.5 text-amber-500" aria-hidden="true" />
                Established {foundedYear} · Community First
              </Badge>

              <h1
                id="hero-heading"
                className="text-balance text-4xl font-bold leading-tight tracking-tight text-emerald-700 sm:text-5xl lg:text-[3.25rem]"
              >
                {heroTitle}
              </h1>

              <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-stone-600 sm:text-lg">
                {heroSubtitle}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-emerald-700 text-white shadow-sm hover:bg-emerald-800"
                >
                  <a href="#departments">
                    Explore Our Ventures
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-stone-300 bg-white text-stone-700 hover:bg-stone-100 hover:text-stone-900"
                >
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>

              {/* Inline mini-stats */}
              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-stone-200 pt-6 sm:max-w-md">
                <div>
                  <p className="text-2xl font-bold text-emerald-700">Top 1</p>
                  <p className="text-xs text-stone-500">In India (E-Max)</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-700">6+</p>
                  <p className="text-xs text-stone-500">Ventures</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-700">100%</p>
                  <p className="text-xs text-stone-500">Placement (HM)</p>
                </div>
              </div>
            </div>

            {/* Right column: mission card */}
            <div className="lg:col-span-5">
              <div className="relative">
                {/* Floating top-right placement badge */}
                <div className="absolute -right-2 -top-3 z-10 flex flex-col items-center rounded-xl bg-amber-500 px-3 py-2 text-center shadow-lg sm:-right-4 sm:-top-4">
                  <span className="text-lg font-bold leading-none text-white">100%</span>
                  <span className="text-[10px] font-medium uppercase tracking-wide text-white/90">
                    Placement
                  </span>
                </div>

                <div className="rounded-2xl bg-emerald-700 p-7 text-white shadow-xl sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-200">
                    Our Mission
                  </p>
                  <Quote className="mt-4 size-7 text-amber-400" aria-hidden="true" />
                  <p className="mt-3 text-lg font-medium italic leading-relaxed text-emerald-50">
                    &ldquo;To uplift the local community by providing accessible digital
                    services, quality skill-based training, and genuine customer care —
                    all under one trusted roof.&rdquo;
                  </p>

                  <div className="mt-6 border-t border-emerald-600 pt-5">
                    <p className="text-xs uppercase tracking-wide text-emerald-200">
                      Founded by
                    </p>
                    <p className="mt-0.5 text-base font-semibold text-white">{founder}</p>
                    <p className="text-sm text-emerald-200">Established {foundedYear}</p>
                  </div>

                  <div className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-emerald-800/60 px-4 py-2.5 text-center">
                    <ShieldCheck
                      className="size-4 shrink-0 text-amber-400"
                      aria-hidden="true"
                    />
                    <span className="text-xs font-medium leading-tight text-emerald-50">
                      Govt. Recognised
                      <br />
                      E-Max India Affiliated
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============== STATS BAR (inside hero) ============== */}
        <div aria-label="Quick stats" className="relative mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:pb-10">
          <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="flex flex-col items-center rounded-xl border border-stone-200 bg-white px-4 py-6 text-center shadow-sm"
                >
                  <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <dd className="text-3xl font-bold text-stone-900">{stat.value}</dd>
                  <dt className="mt-1.5 text-sm text-stone-500">{stat.label}</dt>
                </div>
              );
            })}
          </dl>
        </div>
      </section>

      {/* ============== OUR VENTURES ============== */}
      <section
        id="departments"
        aria-labelledby="ventures-heading"
        className="scroll-mt-24 bg-gray-50"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
              Our Ventures
            </p>
            <h2
              id="ventures-heading"
              className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
            >
              A Family of Institutes &amp; Services
            </h2>
            <p className="mt-4 text-base text-gray-500">
              From certified computer training to hotel management, tailoring, mobile
              repair, and essential citizen services — Tongdam Computers serves the
              community across multiple disciplines.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {VENTURES.map((v) => {
              const Icon = v.icon;
              return (
                <Link
                  key={v.href}
                  href={v.href}
                  aria-label={`Open ${v.title}`}
                  className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
                >
                  {/* Top accent bar */}
                  <span className={`h-1 w-full ${v.accent.bar}`} aria-hidden="true" />

                  <div className="flex flex-1 flex-col p-6">
                    {/* Icon + Badge row */}
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <span
                        className={`flex size-12 items-center justify-center rounded-lg ${v.accent.iconBg} ${v.accent.iconText}`}
                      >
                        <Icon className="size-6" aria-hidden="true" />
                      </span>
                      <span
                        className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ${v.accent.badgeBg} ${v.accent.badgeText}`}
                      >
                        {v.badge}
                      </span>
                    </div>

                    {/* Title + description */}
                    <h3 className="text-lg font-bold text-gray-900">{v.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-500">
                      {v.description}
                    </p>

                    {/* Features list */}
                    <ul className="mt-4 space-y-2">
                      {v.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-center gap-2 text-sm text-gray-600"
                        >
                          <Check
                            className={`size-4 shrink-0 ${v.accent.dot}`}
                            aria-hidden="true"
                          />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Footer */}
                    <div className="mt-6 flex items-center justify-end border-t border-gray-100 pt-4">
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-gray-900 transition-colors group-hover:text-emerald-700">
                        Learn More
                        <ArrowRight
                          className="size-4 transition-transform group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============== QUICK ACTIONS ============== */}
      <section
        aria-labelledby="quick-actions-heading"
        className="bg-emerald-50/60 py-16 lg:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2
              id="quick-actions-heading"
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              What would you like to do today?
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Pick a quick action and we&apos;ll take you straight to the right desk.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <Card
                  key={action.href}
                  className="group relative flex flex-col overflow-hidden border-emerald-100 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
                >
                  <div className="absolute right-0 top-0 size-24 -translate-y-10 translate-x-10 rounded-full bg-emerald-100/60 blur-2xl transition-transform group-hover:translate-x-6 group-hover:-translate-y-6" />
                  <CardContent className="relative flex flex-1 flex-col p-6">
                    <span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-sm">
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    <h3 className="text-lg font-semibold text-foreground">{action.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {action.description}
                    </p>
                    <Button
                      asChild
                      variant="outline"
                      className="mt-5 w-full justify-between border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                    >
                      <Link href={action.href}>
                        {action.cta}
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============== STORY SNIPPET ============== */}
      <section
        aria-labelledby="story-heading"
        className="bg-white py-16 lg:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            {/* Left: story */}
            <article>
              <Badge
                variant="secondary"
                className="mb-3 gap-1 border-emerald-200 bg-emerald-100 text-emerald-700"
              >
                <Quote className="size-3.5" aria-hidden="true" />
                Our Story
              </Badge>
              <h2
                id="story-heading"
                className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
              >
                Built on a customer-first philosophy
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                {story}
              </p>
              <div className="mt-6 flex items-center gap-3 rounded-lg border border-emerald-100 bg-emerald-50/50 p-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                  TZ
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{founder}</p>
                  <p className="text-xs text-muted-foreground">Founder · Tongdam Computers</p>
                </div>
              </div>
              <Button
                asChild
                className="mt-6 bg-emerald-600 text-white hover:bg-emerald-700"
              >
                <Link href="/about">
                  Read our story
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </article>

            {/* Right: timeline card */}
            <Card className="border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50/40 py-0">
              <CardContent className="p-6 sm:p-8">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="size-5 text-emerald-700" aria-hidden="true" />
                    <h3 className="text-base font-semibold text-foreground">
                      Growth timeline
                    </h3>
                  </div>
                  <Badge
                    variant="secondary"
                    className="gap-1 border-amber-200 bg-amber-100 text-amber-700"
                  >
                    <Star className="size-3 fill-amber-500 text-amber-500" aria-hidden="true" />
                    Top 1 E-Max India
                  </Badge>
                </div>

                <ol className="relative space-y-5 border-l-2 border-emerald-200 pl-5">
                  {TIMELINE.map((item) => (
                    <li key={item.year} className="relative">
                      <span
                        className="absolute -left-[27px] top-0.5 flex size-4 items-center justify-center rounded-full border-2 border-emerald-600 bg-white"
                        aria-hidden="true"
                      >
                        <span className="size-1.5 rounded-full bg-emerald-600" />
                      </span>
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <span className="text-sm font-bold text-emerald-700">{item.year}</span>
                        <span className="text-sm font-semibold text-foreground">{item.label}</span>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{item.detail}</p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ============== CTA BAND ============== */}
      <section
        aria-labelledby="cta-heading"
        className="bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-700 text-white"
      >
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-16">
          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row lg:text-left">
            <div className="max-w-2xl text-center lg:text-left">
              <h2
                id="cta-heading"
                className="text-2xl font-bold tracking-tight sm:text-3xl"
              >
                Ready to get started? Visit us or call today.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-emerald-50/90 sm:text-base">
                Whether you want to enroll in a course, book a table, or apply for an
                Aadhaar / PAN — our team is here to help.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              {phone1 && (
                <Button
                  asChild
                  size="lg"
                  className="bg-amber-500 text-emerald-950 shadow-lg shadow-amber-900/20 hover:bg-amber-400"
                >
                  <a href={`tel:${phone1.replace(/\s+/g, "")}`}>
                    <Phone className="size-4" aria-hidden="true" />
                    {phone1}
                  </a>
                </Button>
              )}
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-white/5 text-white backdrop-blur hover:bg-white/15 hover:text-white"
              >
                <Link href="/contact">
                  Contact &amp; directions
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick contact strip */}
          {(email || address) && (
            <div className="mt-10 grid grid-cols-1 gap-4 border-t border-white/15 pt-6 text-sm text-emerald-50/85 sm:grid-cols-2">
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 hover:text-amber-300"
                >
                  <Mail className="size-4 text-amber-300" aria-hidden="true" />
                  {email}
                </a>
              )}
              {address && (
                <p className="inline-flex items-start gap-2">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-amber-300" aria-hidden="true" />
                  {address}
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
