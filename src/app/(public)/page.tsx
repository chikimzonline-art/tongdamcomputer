import Link from "next/link";
import {
  ArrowRight,
  Phone,
  Sparkles,
  ShieldCheck,
  Trophy,
  Users,
  LayoutGrid,
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
} from "lucide-react";
import { getSiteContentMap } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Department = {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
};

const DEPARTMENTS: Department[] = [
  {
    title: "Computer Works",
    description: "Sales, servicing & maintenance of desktops, laptops and peripherals.",
    href: "/services/computer-works",
    icon: Computer,
  },
  {
    title: "Mobile Hub",
    description: "Smartphone repairs, accessories, recharges and CSP services.",
    href: "/services/mobile-hub",
    icon: Smartphone,
  },
  {
    title: "Computer Training",
    description: "DCA, ADCA, Tally Prime, Web Development and typing courses.",
    href: "/education/computer-training",
    icon: GraduationCap,
  },
  {
    title: "Tailoring & Fashion Design",
    description: "From hand-stitching basics to advanced boutique management.",
    href: "/education/tailoring",
    icon: Scissors,
  },
  {
    title: "Hotel Management",
    description: "1-year diploma with 100% placement at 5-star hotels pan-India.",
    href: "/education/hotel-management",
    icon: Hotel,
  },
  {
    title: "Restaurant",
    description: "Multi-cuisine dining — appetizers, mains and refreshing drinks.",
    href: "/lifestyle/restaurant",
    icon: Utensils,
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
      {/* ============== HERO ============== */}
      <section
        aria-labelledby="hero-heading"
        className="relative overflow-hidden border-b border-stone-200 bg-[#f6f3ec]"
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

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
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
      </section>

      {/* ============== STATS BAR ============== */}
      <section aria-label="Quick stats" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-12">
          <dl className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="flex flex-col items-center text-center"
                >
                  <span className="mb-3 flex size-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <dd className="text-3xl font-bold text-emerald-700">{stat.value}</dd>
                  <dt className="mt-1 text-sm text-stone-500">{stat.label}</dt>
                </div>
              );
            })}
          </dl>
        </div>
      </section>

      {/* ============== DEPARTMENTS ============== */}
      <section
        id="departments"
        aria-labelledby="departments-heading"
        className="scroll-mt-24 bg-gradient-to-b from-white to-emerald-50/40"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <Badge
              variant="secondary"
              className="mb-3 gap-1 border-emerald-200 bg-emerald-100 text-emerald-700"
            >
              <LayoutGrid className="size-3.5" aria-hidden="true" />
              Our Departments
            </Badge>
            <h2
              id="departments-heading"
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              Six departments, one trusted address
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              From computer training to hotel management, mobile repairs to dining —
              everything you need under the Tongdam roof.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {DEPARTMENTS.map((dept) => {
              const Icon = dept.icon;
              return (
                <Card
                  key={dept.href}
                  className="group relative overflow-hidden border-emerald-100 py-0 transition-all duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/60"
                >
                  <Link
                    href={dept.href}
                    className="flex h-full flex-col p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
                    aria-label={`Open ${dept.title}`}
                  >
                    <span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    <h3 className="text-lg font-semibold text-foreground">{dept.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {dept.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-emerald-700">
                      Learn more
                      <ArrowRight
                        className="size-4 transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </Link>
                </Card>
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
