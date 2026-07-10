import Link from "next/link";
import {
  ArrowRight,
  ArrowDown,
  ChevronRight,
  Sparkles,
  Smartphone,
  Wrench,
  Headphones,
  PlugZap,
  Shield,
  BatteryCharging,
  CreditCard,
  Settings,
  Clock,
  Calendar,
  GraduationCap,
  TrendingUp,
  Rocket,
  Wallet,
  CheckCircle2,
  Award,
  MapPin,
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

type RetailCategory = {
  title: string;
  description: string;
  icon: React.ElementType;
};

const RETAIL_CATEGORIES: RetailCategory[] = [
  {
    title: "Smartphones",
    description: "Latest models from Samsung, Xiaomi, Realme, Vivo, Oppo & more.",
    icon: Smartphone,
  },
  {
    title: "Mobile Accessories",
    description: "Earphones, cases, stands, and everyday essentials.",
    icon: Headphones,
  },
  {
    title: "Chargers & Cables",
    description: "Genuine fast chargers, USB-C / Lightning cables, and adapters.",
    icon: PlugZap,
  },
  {
    title: "Screen Guards & Covers",
    description: "Tempered glass and premium back covers, fitted on the spot.",
    icon: Shield,
  },
  {
    title: "Power Banks",
    description: "Reliable power banks from 10,000 mAh to 20,000 mAh.",
    icon: BatteryCharging,
  },
  {
    title: "SIM & Recharge",
    description: "New SIM activation, port-in, and prepaid recharges.",
    icon: CreditCard,
  },
];

type Benefit = {
  title: string;
  description: string;
  icon: React.ElementType;
};

const BENEFITS: Benefit[] = [
  {
    title: "High Demand",
    description:
      "Skilled mobile repair technicians are sought after locally and across India.",
    icon: TrendingUp,
  },
  {
    title: "Low-Investment Startup",
    description:
      "Open your own repair shop with minimal equipment and inventory cost.",
    icon: Rocket,
  },
  {
    title: "Quick Earning",
    description:
      "Begin earning within weeks of completing the course, not after years.",
    icon: Wallet,
  },
  {
    title: "Hands-on Practical",
    description:
      "Real-device practice from day one — not just classroom theory.",
    icon: Wrench,
  },
];

const TOPIC_DESCRIPTIONS: Record<string, string> = {
  "mobile hardware basics":
    "Smartphone components, PCB layout, and basic electronics fundamentals.",
  "soldering & desoldering":
    "Hot-air station and iron techniques for SMD components.",
  "chip-level repair":
    "Diagnosing faults and replacing ICs, connectors, and chips.",
  "software flashing":
    "Flashing firmware, bypassing locks, and resolving boot issues.",
  "battery & display replacement":
    "Safe removal and replacement of batteries, screens, and flex cables.",
};

function topicDescription(topic: string): string {
  return (
    TOPIC_DESCRIPTIONS[topic.trim().toLowerCase()] ??
    "Practical, hands-on training on this module with real devices."
  );
}

function splitSyllabus(syllabus: string | null | undefined): string[] {
  if (!syllabus) return [];
  return syllabus
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default async function MobileHubPage() {
  const [courses, content] = await Promise.all([
    getCourses("mobile-hub"),
    getSiteContentMap(),
  ]);
  const phone = content["contact.phone1"] ?? "";

  return (
    <>
      {/* ============== HERO HEADER ============== */}
      <section
        aria-labelledby="mh-hero-heading"
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
                <span className="text-emerald-50/80">Services</span>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="size-3.5" />
              </li>
              <li className="font-medium text-white" aria-current="page">
                Mobile Hub
              </li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <Badge
              variant="secondary"
              className="mb-5 gap-1.5 border-emerald-300/30 bg-white/10 px-3 py-1 text-xs font-medium text-emerald-50 backdrop-blur"
            >
              <Sparkles className="size-3.5 text-amber-300" aria-hidden="true" />
              Retail &amp; Training under one roof
            </Badge>
            <h1
              id="mh-hero-heading"
              className="text-4xl font-bold tracking-tight drop-shadow-sm sm:text-5xl"
            >
              Mobile Retailing &amp; Training Center
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-emerald-50/90 sm:text-lg">
              Shop the latest smartphones and accessories — or master mobile
              hardware repair with hands-on training.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-amber-500 text-emerald-950 shadow-lg shadow-amber-900/20 hover:bg-amber-400"
              >
                <Link href="#retail">
                  <Smartphone className="size-4" aria-hidden="true" />
                  Browse Retail
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-white/5 text-white backdrop-blur hover:bg-white/15 hover:text-white"
              >
                <Link href="#training">
                  <Wrench className="size-4" aria-hidden="true" />
                  Explore Training
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ============== DUAL-SECTION INTRO ============== */}
      <section
        aria-labelledby="mh-intro-heading"
        className="bg-white py-16 lg:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 id="mh-intro-heading" className="sr-only">
            Mobile Hub — Retail and Training
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="group relative overflow-hidden border-emerald-100 py-0 transition-all duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/60">
              <div
                aria-hidden="true"
                className="absolute -right-12 -top-12 size-40 rounded-full bg-emerald-100/60 blur-2xl transition-transform group-hover:translate-x-2 group-hover:-translate-y-2"
              />
              <CardContent className="relative p-6 sm:p-8">
                <span className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-sm">
                  <Smartphone className="size-7" aria-hidden="true" />
                </span>
                <Badge
                  variant="secondary"
                  className="mb-3 border-emerald-200 bg-emerald-100 text-emerald-700"
                >
                  Retail
                </Badge>
                <h3 className="text-2xl font-bold text-foreground">
                  Shop smartphones &amp; accessories
                </h3>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                  Latest smartphones, accessories, and genuine parts at fair
                  prices — with EMI options and on-the-spot fitting.
                </p>
                <Button
                  asChild
                  variant="link"
                  className="mt-4 h-auto p-0 text-emerald-700 hover:text-emerald-800"
                >
                  <Link href="#retail">
                    Go to retail section
                    <ArrowDown className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-emerald-100 py-0 transition-all duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/60">
              <div
                aria-hidden="true"
                className="absolute -right-12 -top-12 size-40 rounded-full bg-amber-100/60 blur-2xl transition-transform group-hover:translate-x-2 group-hover:-translate-y-2"
              />
              <CardContent className="relative p-6 sm:p-8">
                <span className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-sm">
                  <Wrench className="size-7" aria-hidden="true" />
                </span>
                <Badge
                  variant="secondary"
                  className="mb-3 border-amber-200 bg-amber-100 text-amber-700"
                >
                  Training
                </Badge>
                <h3 className="text-2xl font-bold text-foreground">
                  Master mobile hardware repair
                </h3>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                  Practical mobile hardware repair &amp; servicing course —
                  chip-level diagnostics, soldering, and software flashing.
                </p>
                <Button
                  asChild
                  variant="link"
                  className="mt-4 h-auto p-0 text-amber-700 hover:text-amber-800"
                >
                  <Link href="#training">
                    Go to training section
                    <ArrowDown className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ============== RETAIL SECTION ============== */}
      <section
        id="retail"
        aria-labelledby="mh-retail-heading"
        className="scroll-mt-24 bg-emerald-50/60 py-16 lg:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Badge
              variant="secondary"
              className="mb-3 gap-1 border-emerald-200 bg-emerald-100 text-emerald-700"
            >
              <Smartphone className="size-3.5" aria-hidden="true" />
              Retail
            </Badge>
            <h2
              id="mh-retail-heading"
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              Phones, accessories &amp; more
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Genuine products from trusted brands, backed by friendly local
              support and easy EMI options.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {RETAIL_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Card
                  key={cat.title}
                  className="group flex flex-col border-emerald-100 bg-white py-0 transition-all duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/60"
                >
                  <CardContent className="flex flex-1 flex-col p-6">
                    <span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    <h3 className="text-lg font-semibold text-foreground">
                      {cat.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {cat.description}
                    </p>
                    <p className="mt-4 flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                      <MapPin className="size-3.5" aria-hidden="true" />
                      Visit store for latest stock &amp; pricing
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mx-auto mt-8 max-w-3xl rounded-lg border border-emerald-200 bg-emerald-100/60 p-4 text-center sm:p-5">
            <p className="text-sm text-emerald-900">
              <span className="font-semibold">Brands:</span> Samsung, Xiaomi,
              Realme, Vivo, Oppo &amp; more.{" "}
              <span className="font-semibold">EMI options available.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ============== TRAINING SECTION ============== */}
      <section
        id="training"
        aria-labelledby="mh-training-heading"
        className="scroll-mt-24 bg-white py-16 lg:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Badge
              variant="secondary"
              className="mb-3 gap-1 border-amber-200 bg-amber-100 text-amber-700"
            >
              <Wrench className="size-3.5" aria-hidden="true" />
              Training
            </Badge>
            <h2
              id="mh-training-heading"
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              Mobile Hardware Repair Course
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              A practical, job-ready course that takes you from beginner to
              confident repair technician.
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
                  for the latest schedule and fees.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="mt-12 space-y-8">
              {courses.map((course, idx) => {
                const topics = splitSyllabus(course.syllabus);
                const featured = idx === 0;
                return (
                  <Card
                    key={course.id}
                    className={
                      featured
                        ? "overflow-hidden border-emerald-200 bg-white py-0 shadow-sm"
                        : "overflow-hidden border-emerald-100 bg-white py-0"
                    }
                  >
                    <CardContent className="p-0">
                      <div className="grid grid-cols-1 lg:grid-cols-5">
                        {/* Left: Course header + meta */}
                        <div className="lg:col-span-2">
                          <div className="h-full bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white sm:p-8">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="secondary"
                                className="border-white/20 bg-white/15 text-white backdrop-blur"
                              >
                                <Award className="size-3.5 text-amber-300" aria-hidden="true" />
                                {course.code}
                              </Badge>
                              {featured && (
                                <Badge
                                  variant="secondary"
                                  className="border-amber-300/30 bg-amber-500/90 text-emerald-950"
                                >
                                  Featured
                                </Badge>
                              )}
                            </div>
                            <h3 className="mt-4 text-2xl font-bold tracking-tight">
                              {course.title}
                            </h3>
                            <p className="mt-3 text-sm leading-relaxed text-emerald-50/90">
                              {course.description}
                            </p>

                            <dl className="mt-6 grid grid-cols-2 gap-3">
                              <div className="rounded-lg border border-white/15 bg-white/10 p-3">
                                <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-emerald-50/80">
                                  <Calendar className="size-3.5" aria-hidden="true" />
                                  Duration
                                </dt>
                                <dd className="mt-1 text-lg font-semibold">
                                  {course.duration}
                                </dd>
                              </div>
                              <div className="rounded-lg border border-white/15 bg-white/10 p-3">
                                <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-emerald-50/80">
                                  <Wallet className="size-3.5" aria-hidden="true" />
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
                                Enroll in this course
                              </Link>
                            </Button>
                          </div>
                        </div>

                        {/* Right: Syllabus accordion */}
                        <div className="lg:col-span-3">
                          <div className="p-6 sm:p-8">
                            <h4 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                              <Settings className="size-5 text-emerald-700" aria-hidden="true" />
                              Course syllabus
                            </h4>
                            <p className="mt-1.5 text-sm text-muted-foreground">
                              {topics.length > 0
                                ? `${topics.length} modules · click to expand each topic.`
                                : "Syllabus details coming soon."}
                            </p>

                            {topics.length > 0 ? (
                              <Accordion
                                type="multiple"
                                defaultValue={[topics[0]]}
                                className="mt-5 w-full"
                              >
                                {topics.map((topic) => (
                                  <AccordionItem
                                    key={topic}
                                    value={topic}
                                    className="border-emerald-100"
                                  >
                                    <AccordionTrigger className="text-left text-sm font-medium text-foreground hover:no-underline sm:text-base">
                                      {topic}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                                      {topicDescription(topic)}
                                    </AccordionContent>
                                  </AccordionItem>
                                ))}
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

          {/* Why learn mobile repair? */}
          <div className="mt-16">
            <div className="mx-auto max-w-2xl text-center">
              <Badge
                variant="secondary"
                className="mb-3 gap-1 border-emerald-200 bg-emerald-100 text-emerald-700"
              >
                <TrendingUp className="size-3.5" aria-hidden="true" />
                Why learn mobile repair?
              </Badge>
              <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                A skill that pays for itself
              </h3>
              <p className="mt-3 text-base text-muted-foreground">
                Four reasons this course is one of the smartest investments you
                can make.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {BENEFITS.map((b) => {
                const Icon = b.icon;
                return (
                  <Card
                    key={b.title}
                    className="group flex flex-col border-emerald-100 bg-white py-0 transition-all duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/60"
                  >
                    <CardContent className="flex flex-1 flex-col p-6">
                      <span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700 transition-colors group-hover:bg-amber-500 group-hover:text-white">
                        <Icon className="size-6" aria-hidden="true" />
                      </span>
                      <h4 className="text-base font-semibold text-foreground">
                        {b.title}
                      </h4>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                        {b.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============== ENROLLMENT CTA ============== */}
      <section
        id="enroll"
        aria-labelledby="mh-enroll-heading"
        className="scroll-mt-24 bg-emerald-50/60 py-16 lg:py-20"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
            {/* Left: Heading + info */}
            <div className="lg:col-span-2">
              <Badge
                variant="secondary"
                className="mb-3 gap-1 border-emerald-200 bg-emerald-100 text-emerald-700"
              >
                <GraduationCap className="size-3.5" aria-hidden="true" />
                Enrollment
              </Badge>
              <h2
                id="mh-enroll-heading"
                className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
              >
                Enroll in Mobile Repair Course
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Ready to start? Send us your details and our team will reach
                out with the next batch schedule, fee payment options, and
                documents required.
              </p>

              <ul className="mt-6 space-y-2.5">
                {[
                  "Practical training on real devices",
                  "Small batches for personal attention",
                  "Certificate on completion",
                ].map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2.5 text-sm text-muted-foreground"
                  >
                    <CheckCircle2
                      className="mt-0.5 size-4 shrink-0 text-emerald-600"
                      aria-hidden="true"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              {phone && (
                <a
                  href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                  className="mt-6 flex items-center gap-3 rounded-lg border border-emerald-100 bg-white p-3 transition-colors hover:bg-emerald-50"
                >
                  <span className="flex size-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
                    <Clock className="size-4" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Call to enroll
                    </span>
                    <span className="block text-sm font-semibold text-foreground">
                      {phone}
                    </span>
                  </span>
                </a>
              )}
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-3">
              <Card className="border-emerald-100 bg-white py-0">
                <CardContent className="p-6 sm:p-8">
                  <EnrollForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
