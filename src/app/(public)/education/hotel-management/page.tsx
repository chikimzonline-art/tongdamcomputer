import Link from "next/link";
import {
  ChevronRight,
  Trophy,
  Briefcase,
  Hotel,
  Ship,
  UtensilsCrossed,
  Calendar,
  Building2,
  ChefHat,
  BedDouble,
  ConciergeBell,
  GraduationCap,
  Clock,
  IndianRupee,
  ArrowRight,
  CheckCircle2,
  Handshake,
  ShieldCheck,
  Award,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getCourses, getSiteContentMap } from "@/lib/data";
import { EnrollForm } from "./enroll-form";

type PlacementStat = {
  title: string;
  description: string;
  icon: React.ElementType;
  badge: string;
};

const PLACEMENT_STATS: PlacementStat[] = [
  {
    title: "100% Placement",
    description:
      "Every eligible graduate is placed in a hospitality role — guaranteed, in writing, at the time of admission.",
    icon: Trophy,
    badge: "100%",
  },
  {
    title: "5-Star Hotel Partners",
    description:
      "Direct hiring tie-ups with leading 5-star hotel chains, resorts, and fine-dining groups across India.",
    icon: Hotel,
    badge: "5★",
  },
  {
    title: "1-Year Diploma",
    description:
      "A focused, intensive 12-month program covering all core hospitality departments — production to front office.",
    icon: Calendar,
    badge: "12 mo",
  },
  {
    title: "Industrial Training Included",
    description:
      "On-the-job training at partner hotels built into the curriculum — real exposure, not just classroom theory.",
    icon: Briefcase,
    badge: "OJT",
  },
];

type SyllabusModule = {
  title: string;
  description: string;
  icon: React.ElementType;
};

const SYLLABUS_MODULES: Record<string, SyllabusModule> = {
  "food production": {
    title: "Food Production",
    description:
      "Fundamentals of Indian, Continental, and Oriental cookery — knife skills, stocks, sauces, and plating techniques. Hands-on in our modern kitchen lab.",
    icon: ChefHat,
  },
  "bakery & confectionery": {
    title: "Bakery & Confectionery",
    description:
      "Breads, pastries, cakes, and desserts — dough handling, fermentation, icing, and presentation for commercial bakery production.",
    icon: UtensilsCrossed,
  },
  "food & beverage service": {
    title: "Food & Beverage Service",
    description:
      "Restaurant service standards — table setup, order taking, fine-dining etiquette, beverage pairing, and banqueting operations.",
    icon: ConciergeBell,
  },
  "front office": {
    title: "Front Office",
    description:
      "Guest handling, reservation systems, check-in/check-out, billing, and customer relationship management at hotel reception.",
    icon: ConciergeBell,
  },
  housekeeping: {
    title: "Housekeeping",
    description:
      "Room upkeep, laundry operations, hygiene standards, and property maintenance — the backbone of guest comfort.",
    icon: BedDouble,
  },
  "communication & soft skills": {
    title: "Communication & Soft Skills",
    description:
      "Spoken English, guest communication, grooming, professional etiquette, and teamwork for the hospitality workplace.",
    icon: Sparkles,
  },
  "industrial training": {
    title: "Industrial Training",
    description:
      "On-the-job internship at a partner hotel — applying all learned skills in a live 5-star environment, with mentor evaluation.",
    icon: Briefcase,
  },
};

const FALLBACK_MODULE: SyllabusModule = {
  title: "Industry Module",
  description:
    "Hands-on training aligned with industry standards and 5-star hotel expectations.",
  icon: Award,
};

type Partner = {
  name: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
};

const PARTNERS: Partner[] = [
  {
    name: "5-Star Hotel Network",
    description: "Leading luxury hotel chains pan-India",
    icon: Hotel,
    gradient: "from-emerald-600 to-teal-700",
  },
  {
    name: "Resort Chains",
    description: "Premium resorts in tourist destinations",
    icon: Building2,
    gradient: "from-amber-500 to-orange-600",
  },
  {
    name: "Cruise Lines",
    description: "International cruise hospitality roles",
    icon: Ship,
    gradient: "from-teal-600 to-cyan-700",
  },
  {
    name: "Fine Dining",
    description: "Standalone fine-dining restaurants",
    icon: UtensilsCrossed,
    gradient: "from-emerald-700 to-emerald-900",
  },
];

type Facility = {
  title: string;
  description: string;
  icon: React.ElementType;
};

const FACILITIES: Facility[] = [
  {
    title: "Modern Kitchen",
    description:
      "Fully-equipped commercial training kitchen with industrial ranges, ovens, and prep stations for production and bakery classes.",
    icon: ChefHat,
  },
  {
    title: "Training Restaurant",
    description:
      "On-campus mock restaurant where students practice F&B service, table setup, and guest handling in real scenarios.",
    icon: ConciergeBell,
  },
  {
    title: "Housekeeping Lab",
    description:
      "A model guest-room setup for hands-on housekeeping, bed-making, laundry, and hygiene training.",
    icon: BedDouble,
  },
  {
    title: "Front Office Simulation",
    description:
      "Reception desk simulator with hotel-management software to practice reservations, check-ins, and billing.",
    icon: ConciergeBell,
  },
];

function splitSyllabus(syllabus: string | null | undefined): string[] {
  if (!syllabus) return [];
  return syllabus
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function moduleFor(topic: string): SyllabusModule {
  return (
    SYLLABUS_MODULES[topic.trim().toLowerCase()] ?? {
      ...FALLBACK_MODULE,
      title: topic,
    }
  );
}

export const revalidate = 300;

export default async function HotelManagementPage() {
  const [courses, content] = await Promise.all([
    getCourses("hotel-management"),
    getSiteContentMap(),
  ]);
  const placement = content["hotel.placement"] ?? "";

  return (
    <>
      {/* ============== HERO HEADER ============== */}
      <section
        aria-labelledby="hm-hero-heading"
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
            <ol className="flex flex-wrap items-center gap-1.5 text-xs text-emerald-50/80 sm:text-sm">
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
              <li>
                <span className="text-emerald-50/80">Education</span>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="size-3.5" />
              </li>
              <li className="font-medium text-white" aria-current="page">
                Hotel Management
              </li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            {/* Very prominent placement banner */}
            {placement && (
              <div className="mb-6 inline-flex items-center gap-3 rounded-xl border border-amber-300/40 bg-amber-500/95 px-4 py-3 text-emerald-950 shadow-lg shadow-amber-900/20 sm:px-5 sm:py-4">
                <Trophy
                  className="size-7 shrink-0 text-emerald-900 sm:size-8"
                  aria-hidden="true"
                />
                <span className="text-sm font-bold leading-tight sm:text-base">
                  {placement}
                </span>
              </div>
            )}

            <h1
              id="hm-hero-heading"
              className="text-4xl font-bold tracking-tight drop-shadow-sm sm:text-5xl"
            >
              Tongdam Institute of Hotel Management
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-emerald-50/90 sm:text-lg">
              Train for a global hospitality career with guaranteed
              placement at 5-star hotels across India.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-amber-500 text-emerald-950 shadow-lg shadow-amber-900/20 hover:bg-amber-400"
              >
                <Link href="#enroll">
                  <GraduationCap className="size-4" aria-hidden="true" />
                  Apply Now
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-white/5 text-white backdrop-blur hover:bg-white/15 hover:text-white"
              >
                <Link href="#course">
                  <Briefcase className="size-4" aria-hidden="true" />
                  View Course Breakdown
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ============== 100% PLACEMENT HIGHLIGHT ============== */}
      <section
        aria-labelledby="hm-placement-heading"
        className="bg-white py-16 lg:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Badge
              variant="secondary"
              className="mb-3 gap-1 border-amber-200 bg-amber-100 text-amber-700"
            >
              <Trophy className="size-3.5" aria-hidden="true" />
              Placement Guarantee
            </Badge>
            <h2
              id="hm-placement-heading"
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              100% Placement, Guaranteed
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              We don&apos;t just train you — we place you. Our 1-Year
              Diploma in Hotel Management comes with a written placement
              guarantee at 5-star hotels pan-India.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PLACEMENT_STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={stat.title}
                  className="group relative flex flex-col overflow-hidden border-emerald-100 bg-white py-0 transition-all duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/60"
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-amber-100/50 blur-2xl transition-transform group-hover:translate-x-2 group-hover:-translate-y-2"
                  />
                  <CardContent className="relative flex flex-1 flex-col p-6">
                    <div className="flex items-start justify-between gap-2">
                      <span className="flex size-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                        <Icon className="size-6" aria-hidden="true" />
                      </span>
                      <Badge
                        variant="secondary"
                        className="border-amber-200 bg-amber-100 text-amber-700"
                      >
                        {stat.badge}
                      </Badge>
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-foreground">
                      {stat.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mx-auto mt-8 max-w-3xl rounded-lg border border-emerald-200 bg-emerald-50/70 p-4 text-center sm:p-5">
            <p className="flex items-center justify-center gap-2 text-sm text-emerald-900">
              <ShieldCheck className="size-4 shrink-0" aria-hidden="true" />
              <span>
                <span className="font-semibold">Written guarantee</span> at
                the time of admission — eligible graduates are placed, or
                we extend free placement support until they are.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* ============== COURSE BREAKDOWN ============== */}
      <section
        id="course"
        aria-labelledby="hm-course-heading"
        className="scroll-mt-24 bg-emerald-50/60 py-16 lg:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Badge
              variant="secondary"
              className="mb-3 gap-1 border-emerald-200 bg-emerald-100 text-emerald-700"
            >
              <GraduationCap className="size-3.5" aria-hidden="true" />
              Course Breakdown
            </Badge>
            <h2
              id="hm-course-heading"
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              Diploma in Hotel Management (1-Year)
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              A structured 12-month program covering every core
              hospitality department, with on-the-job industrial training
              built in.
            </p>
          </div>

          {courses.length === 0 ? (
            <Card className="mt-12 border-emerald-100 py-0">
              <CardContent className="p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Course details are being updated. Please{" "}
                  <Link
                    href="#enroll"
                    className="font-medium text-emerald-700 underline-offset-4 hover:underline"
                  >
                    contact us
                  </Link>{" "}
                  for the latest admission schedule and fees.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="mt-12 space-y-6">
              {courses.map((course) => {
                const topics = splitSyllabus(course.syllabus);
                return (
                  <Card
                    key={course.id}
                    className="overflow-hidden border-emerald-200 bg-white py-0 shadow-sm"
                  >
                    <CardContent className="p-0">
                      <div className="grid grid-cols-1 lg:grid-cols-5">
                        {/* Left: Course header */}
                        <div className="lg:col-span-2">
                          <div className="h-full bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white sm:p-8">
                            <Badge
                              variant="secondary"
                              className="gap-1 border-white/20 bg-white/15 text-white backdrop-blur"
                            >
                              <Award
                                className="size-3.5 text-amber-300"
                                aria-hidden="true"
                              />
                              {course.code}
                            </Badge>
                            <h3 className="mt-4 text-2xl font-bold tracking-tight">
                              {course.title}
                            </h3>
                            <p className="mt-3 text-sm leading-relaxed text-emerald-50/90">
                              {course.description}
                            </p>

                            <dl className="mt-6 grid grid-cols-2 gap-3">
                              <div className="rounded-lg border border-white/15 bg-white/10 p-3">
                                <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-emerald-50/80">
                                  <Clock className="size-3.5" aria-hidden="true" />
                                  Duration
                                </dt>
                                <dd className="mt-1 text-lg font-semibold">
                                  {course.duration}
                                </dd>
                              </div>
                              <div className="rounded-lg border border-white/15 bg-white/10 p-3">
                                <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-emerald-50/80">
                                  <IndianRupee className="size-3.5" aria-hidden="true" />
                                  Course Fee
                                </dt>
                                <dd className="mt-1 text-lg font-semibold">
                                  {course.fee}
                                </dd>
                              </div>
                            </dl>

                            <Button
                              asChild
                              className="mt-6 w-full bg-amber-500 text-emerald-950 hover:bg-amber-400"
                            >
                              <Link href="#enroll">
                                <GraduationCap className="size-4" aria-hidden="true" />
                                Apply for this Diploma
                              </Link>
                            </Button>
                          </div>
                        </div>

                        {/* Right: Structured syllabus */}
                        <div className="lg:col-span-3">
                          <div className="p-6 sm:p-8">
                            <h4 className="text-lg font-semibold text-foreground">
                              Structured syllabus breakdown
                            </h4>
                            <p className="mt-1.5 text-sm text-muted-foreground">
                              {topics.length > 0
                                ? `${topics.length} core modules — click to expand each.`
                                : "Syllabus details coming soon."}
                            </p>

                            {topics.length > 0 ? (
                              <Accordion
                                type="multiple"
                                defaultValue={[topics[0]]}
                                className="mt-5 w-full"
                              >
                                {topics.map((topic) => {
                                  const mod = moduleFor(topic);
                                  const Icon = mod.icon;
                                  return (
                                    <AccordionItem
                                      key={topic}
                                      value={topic}
                                      className="border-emerald-100"
                                    >
                                      <AccordionTrigger className="text-left text-sm font-medium text-foreground hover:no-underline sm:text-base">
                                        <span className="flex items-center gap-3">
                                          <span className="flex size-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                                            <Icon className="size-4" aria-hidden="true" />
                                          </span>
                                          {mod.title}
                                        </span>
                                      </AccordionTrigger>
                                      <AccordionContent className="pl-12 text-sm leading-relaxed text-muted-foreground">
                                        {mod.description}
                                      </AccordionContent>
                                    </AccordionItem>
                                  );
                                })}
                              </Accordion>
                            ) : (
                              <p className="mt-5 text-sm text-muted-foreground">
                                Please contact us for the detailed syllabus.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ============== INDUSTRY PARTNERSHIPS ============== */}
      <section
        aria-labelledby="hm-partners-heading"
        className="bg-white py-16 lg:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Badge
              variant="secondary"
              className="mb-3 gap-1 border-emerald-200 bg-emerald-100 text-emerald-700"
            >
              <Handshake className="size-3.5" aria-hidden="true" />
              Industry Partnerships
            </Badge>
            <h2
              id="hm-partners-heading"
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              Our Hospitality Partners
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Pan-India placement network across leading 5-star properties
              — from metropolitan luxury hotels to international cruise
              lines.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PARTNERS.map((p) => {
              const Icon = p.icon;
              return (
                <Card
                  key={p.name}
                  className="group relative flex flex-col overflow-hidden border-emerald-100 bg-white py-0 transition-all duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/60"
                >
                  <CardContent className="flex flex-1 flex-col p-6">
                    <span
                      className={`mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br ${p.gradient} text-white shadow-sm`}
                    >
                      <Icon className="size-7" aria-hidden="true" />
                    </span>
                    <h3 className="text-base font-semibold text-foreground">
                      {p.name}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {p.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mx-auto mt-8 max-w-3xl rounded-lg border border-emerald-200 bg-emerald-50/70 p-4 text-center sm:p-5">
            <p className="flex items-center justify-center gap-2 text-sm text-emerald-900">
              <Building2 className="size-4 shrink-0" aria-hidden="true" />
              <span>
                <span className="font-semibold">Pan-India network</span> —
                placements in metros, tourist hubs, and resort destinations
                nationwide.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* ============== TRAINING FACILITIES ============== */}
      <section
        aria-labelledby="hm-facilities-heading"
        className="bg-emerald-50/60 py-16 lg:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Badge
              variant="secondary"
              className="mb-3 gap-1 border-amber-200 bg-amber-100 text-amber-700"
            >
              <Building2 className="size-3.5" aria-hidden="true" />
              On-Campus Facilities
            </Badge>
            <h2
              id="hm-facilities-heading"
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              Training facilities
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Learn on industry-standard equipment across our dedicated
              hospitality training labs — not just in classrooms.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FACILITIES.map((f) => {
              const Icon = f.icon;
              return (
                <Card
                  key={f.title}
                  className="group flex flex-col border-emerald-100 bg-white py-0 transition-all duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/60"
                >
                  <CardContent className="flex flex-1 flex-col p-6">
                    <span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    <h3 className="text-base font-semibold text-foreground">
                      {f.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {f.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============== ENROLLMENT FORM ============== */}
      <section
        id="enroll"
        aria-labelledby="hm-enroll-heading"
        className="scroll-mt-24 bg-white py-16 lg:py-20"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Card className="overflow-hidden border-emerald-100 bg-white py-0">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-5">
                {/* Left: Heading */}
                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white sm:p-8 lg:col-span-2">
                  <Badge
                    variant="secondary"
                    className="mb-3 gap-1 border-white/20 bg-white/15 text-white backdrop-blur"
                  >
                    <Trophy className="size-3.5 text-amber-300" aria-hidden="true" />
                    Admissions Open
                  </Badge>
                  <h2
                    id="hm-enroll-heading"
                    className="text-3xl font-bold tracking-tight"
                  >
                    Apply for Hotel Management Diploma
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-emerald-50/90">
                    Reserve your seat for the next batch. Share your
                    details and our admissions team will get back to you
                    with the application process, fees, and document
                    checklist.
                  </p>

                  <ul className="mt-6 space-y-2.5">
                    {[
                      "1-Year Diploma with 100% placement guarantee",
                      "Industrial training at 5-star partner hotels",
                      "Limited seats — early applicants get priority",
                    ].map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2.5 text-sm text-emerald-50/90"
                      >
                        <CheckCircle2
                          className="mt-0.5 size-4 shrink-0 text-amber-300"
                          aria-hidden="true"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right: Form */}
                <div className="p-6 sm:p-8 lg:col-span-3">
                  <EnrollForm />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ============== CTA STRIP ============== */}
      <section
        aria-labelledby="hm-cta-heading"
        className="bg-white pb-16 lg:pb-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 p-8 text-white shadow-lg sm:p-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-amber-400/20 blur-3xl"
            />
            <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2
                  id="hm-cta-heading"
                  className="text-2xl font-bold tracking-tight sm:text-3xl"
                >
                  Step into a global hospitality career
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-emerald-50/90">
                  1-Year Diploma. 100% placement. 5-star hotels pan-India.
                  Your hospitality career starts here.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="bg-amber-500 text-emerald-950 shadow-md hover:bg-amber-400"
                >
                  <Link href="#enroll">
                    <GraduationCap className="size-4" aria-hidden="true" />
                    Apply Now
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/40 bg-white/5 text-white backdrop-blur hover:bg-white/15 hover:text-white"
                >
                  <Link href="/contact">
                    Talk to Admissions
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
