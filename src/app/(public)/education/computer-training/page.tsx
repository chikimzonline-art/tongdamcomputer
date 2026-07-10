import Link from "next/link";
import {
  ChevronRight,
  Trophy,
  Award,
  BadgeCheck,
  GraduationCap,
  BookOpen,
  Users,
  Briefcase,
  Clock,
  IndianRupee,
  ArrowRight,
  Settings,
  ScrollText,
  CheckCircle2,
  ShieldCheck,
  Building2,
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
import { EnrollForm, type CourseOption } from "./enroll-form";

type Highlight = {
  title: string;
  description: string;
  icon: React.ElementType;
};

const WHY_TOP1: Highlight[] = [
  {
    title: "Govt. Recognized Certification",
    description:
      "Every diploma is affiliated to E-Max India and recognized by the Government of India — your certificate is valid nationwide.",
    icon: ShieldCheck,
  },
  {
    title: "Industry-Relevant Syllabus",
    description:
      "Curriculum updated yearly to match industry needs — MS Office, Tally Prime with GST, web development, and accounting software.",
    icon: BookOpen,
  },
  {
    title: "Experienced Faculty",
    description:
      "Instructors with years of vocational IT teaching experience, offering personal mentorship in small batches.",
    icon: Users,
  },
  {
    title: "Placement Assistance",
    description:
      "Dedicated placement support, resume building, and referrals to local businesses, retail outlets, and offices.",
    icon: Briefcase,
  },
];

type CertificationItem = {
  title: string;
  description: string;
};

const CERTIFICATION_ITEMS: CertificationItem[] = [
  {
    title: "Verified E-Max India Certificate",
    description:
      "On successful completion, students receive a verifiable certificate issued under the E-Max India affiliation.",
  },
  {
    title: "Government of India Recognition",
    description:
      "Certifications are recognized by the Govt. of India, opening doors to public and private sector opportunities.",
  },
  {
    title: "Skill Transcript & Project Portfolio",
    description:
      "Students leave with a documented skill transcript and a portfolio of practical projects built during the course.",
  },
  {
    title: "Top 1 Nationwide Ranking",
    description:
      "Tongdam is the Top 1 Institute under E-Max India nationwide — a credential that adds real weight to your CV.",
  },
];

function splitSyllabus(syllabus: string | null | undefined): string[] {
  if (!syllabus) return [];
  return syllabus
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default async function ComputerTrainingPage() {
  const [courses, content] = await Promise.all([
    getCourses("computer-training"),
    getSiteContentMap(),
  ]);
  const emaxBadge = content["training.emaxBadge"] ?? "";
  const topRank = content["training.topRank"] ?? "";

  // Serialize courses for the client enroll form.
  const courseOptions: CourseOption[] = courses.map((c) => ({
    code: c.code,
    title: c.title,
  }));

  return (
    <>
      {/* ============== HERO HEADER ============== */}
      <section
        aria-labelledby="ct-hero-heading"
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
                Computer Training
              </li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            {/* Affiliation badge */}
            {emaxBadge && (
              <Badge
                variant="secondary"
                className="mb-4 gap-1.5 border-amber-300/30 bg-amber-500/95 px-3 py-1.5 text-xs font-semibold text-emerald-950 shadow-sm sm:text-sm"
              >
                <BadgeCheck className="size-4" aria-hidden="true" />
                {emaxBadge}
              </Badge>
            )}

            {/* Top 1 banner — extra prominent */}
            {topRank && (
              <div className="mb-5 inline-flex items-center gap-3 rounded-xl border border-amber-300/40 bg-amber-500/95 px-4 py-2.5 text-emerald-950 shadow-md shadow-amber-900/20">
                <Trophy
                  className="size-6 shrink-0 text-emerald-900"
                  aria-hidden="true"
                />
                <span className="text-sm font-bold leading-tight sm:text-base">
                  {topRank}
                </span>
              </div>
            )}

            <h1
              id="ct-hero-heading"
              className="text-4xl font-bold tracking-tight drop-shadow-sm sm:text-5xl"
            >
              Tongdam Computer Training Center
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-emerald-50/90 sm:text-lg">
              Elite vocational IT training — from computer fundamentals to
              web development. Recognized, certified, and trusted.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-amber-500 text-emerald-950 shadow-lg shadow-amber-900/20 hover:bg-amber-400"
              >
                <Link href="#enroll">
                  <GraduationCap className="size-4" aria-hidden="true" />
                  Enroll Now
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-white/5 text-white backdrop-blur hover:bg-white/15 hover:text-white"
              >
                <Link href="#courses">
                  <BookOpen className="size-4" aria-hidden="true" />
                  Browse Courses
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ============== WHY TOP 1 ============== */}
      <section
        aria-labelledby="ct-why-heading"
        className="bg-white py-16 lg:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Badge
              variant="secondary"
              className="mb-3 gap-1 border-amber-200 bg-amber-100 text-amber-700"
            >
              <Trophy className="size-3.5" aria-hidden="true" />
              Why Top 1?
            </Badge>
            <h2
              id="ct-why-heading"
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              What makes us the Top 1 Institute
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Recognized nationwide under E-Max India for excellence in
              vocational IT education — here&apos;s what sets our students
              apart.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_TOP1.map((h) => {
              const Icon = h.icon;
              return (
                <Card
                  key={h.title}
                  className="group flex flex-col border-emerald-100 bg-white py-0 transition-all duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/60"
                >
                  <CardContent className="flex flex-1 flex-col p-6">
                    <span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    <h3 className="text-base font-semibold text-foreground">
                      {h.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {h.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============== COURSES LIST ============== */}
      <section
        id="courses"
        aria-labelledby="ct-courses-heading"
        className="scroll-mt-24 bg-emerald-50/60 py-16 lg:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Badge
              variant="secondary"
              className="mb-3 gap-1 border-emerald-200 bg-emerald-100 text-emerald-700"
            >
              <BookOpen className="size-3.5" aria-hidden="true" />
              Courses
            </Badge>
            <h2
              id="ct-courses-heading"
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              Diplomas &amp; certificate courses
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              From a 3-month Tally Prime intensive to a 12-month Advanced
              Diploma — pick the path that fits your career goals.
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
            <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {courses.map((course) => {
                const topics = splitSyllabus(course.syllabus);
                return (
                  <Card
                    key={course.id}
                    className="flex flex-col overflow-hidden border-emerald-100 bg-white py-0 transition-all duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/60"
                  >
                    <CardContent className="flex flex-1 flex-col p-6">
                      <div className="flex items-start justify-between gap-3">
                        <Badge
                          variant="secondary"
                          className="gap-1 border-amber-200 bg-amber-100 text-amber-700"
                        >
                          <Award className="size-3.5" aria-hidden="true" />
                          {course.code}
                        </Badge>
                      </div>

                      <h3 className="mt-3 text-xl font-semibold text-foreground">
                        {course.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {course.description}
                      </p>

                      <dl className="mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-lg border border-emerald-100 bg-emerald-50/60 p-3">
                          <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-emerald-700">
                            <Clock className="size-3.5" aria-hidden="true" />
                            Duration
                          </dt>
                          <dd className="mt-1 text-base font-semibold text-foreground">
                            {course.duration}
                          </dd>
                        </div>
                        <div className="rounded-lg border border-emerald-100 bg-emerald-50/60 p-3">
                          <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-emerald-700">
                            <IndianRupee
                              className="size-3.5"
                              aria-hidden="true"
                            />
                            Course Fee
                          </dt>
                          <dd className="mt-1 text-base font-semibold text-foreground">
                            {course.fee}
                          </dd>
                        </div>
                      </dl>

                      {/* Syllabus accordion */}
                      {topics.length > 0 && (
                        <div className="mt-4">
                          <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                            <Settings
                              className="size-4 text-emerald-700"
                              aria-hidden="true"
                            />
                            Syllabus
                          </h4>
                          <Accordion
                            type="single"
                            collapsible
                            className="mt-2 w-full"
                          >
                            <AccordionItem
                              value={`syllabus-${course.code}`}
                              className="border-emerald-100"
                            >
                              <AccordionTrigger className="text-left text-sm font-medium text-foreground hover:no-underline">
                                View {topics.length} modules
                              </AccordionTrigger>
                              <AccordionContent>
                                <ul className="flex flex-wrap gap-2">
                                  {topics.map((topic) => (
                                    <li
                                      key={topic}
                                      className="rounded-md border border-emerald-100 bg-emerald-50/70 px-2.5 py-1 text-xs font-medium text-emerald-800"
                                    >
                                      {topic}
                                    </li>
                                  ))}
                                </ul>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>
                      )}

                      <div className="mt-5 flex flex-1 items-end">
                        <Button
                          asChild
                          className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                          <Link href="#enroll">
                            <GraduationCap
                              className="size-4"
                              aria-hidden="true"
                            />
                            Enroll
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ============== CERTIFICATION & AFFILIATION ============== */}
      <section
        aria-labelledby="ct-cert-heading"
        className="bg-white py-16 lg:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
            {/* Left: Affiliation card */}
            <div className="lg:col-span-2">
              <Card className="h-full overflow-hidden border-emerald-100 bg-gradient-to-br from-emerald-50 to-white py-0">
                <CardContent className="flex h-full flex-col p-6 sm:p-8">
                  <span className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-sm">
                    <Award className="size-7" aria-hidden="true" />
                  </span>
                  <Badge
                    variant="secondary"
                    className="mb-3 w-fit gap-1 border-amber-200 bg-amber-100 text-amber-700"
                  >
                    <BadgeCheck className="size-3.5" aria-hidden="true" />
                    Affiliation
                  </Badge>
                  <h2
                    id="ct-cert-heading"
                    className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
                  >
                    E-Max India Affiliation
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {emaxBadge ||
                      "Affiliated to E-Max India | Recognized by Govt. of India"}
                    . Tongdam Computer Training Center operates as a
                    recognized training partner of E-Max India — a national
                    skill development body authorized to issue
                    government-recognized IT certifications.
                  </p>

                  {/* E-Max logo placeholder */}
                  <div className="mt-6 flex items-center gap-4 rounded-xl border-2 border-dashed border-emerald-200 bg-white p-4">
                    <span className="flex size-14 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
                      <BadgeCheck className="size-7" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        E-Max India
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Authorized Training Partner
                      </p>
                    </div>
                  </div>

                  {topRank && (
                    <div className="mt-4 flex items-center gap-3 rounded-lg bg-amber-50 p-3 text-amber-800">
                      <Trophy className="size-5 shrink-0" aria-hidden="true" />
                      <p className="text-xs font-medium leading-snug">
                        {topRank}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right: What students get on completion */}
            <div className="lg:col-span-3">
              <Badge
                variant="secondary"
                className="mb-3 gap-1 border-emerald-200 bg-emerald-100 text-emerald-700"
              >
                <ScrollText className="size-3.5" aria-hidden="true" />
                On Completion
              </Badge>
              <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                What students walk away with
              </h3>
              <p className="mt-3 text-base text-muted-foreground">
                Every graduate leaves with more than just a certificate —
                they leave job-ready, with a portfolio and nationwide
                recognition.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {CERTIFICATION_ITEMS.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-emerald-100 bg-white p-5 transition-colors hover:border-emerald-300 hover:bg-emerald-50/40"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2
                        className="mt-0.5 size-5 shrink-0 text-emerald-600"
                        aria-hidden="true"
                      />
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">
                          {item.title}
                        </h4>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3 rounded-lg border border-emerald-100 bg-emerald-50/60 p-4">
                <Building2
                  className="size-5 shrink-0 text-emerald-700"
                  aria-hidden="true"
                />
                <p className="text-sm text-emerald-900">
                  <span className="font-semibold">Trusted by:</span> local
                  businesses, government offices, retail outlets, and
                  accounting firms across Churachandpur.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== ENROLLMENT FORM ============== */}
      <section
        id="enroll"
        aria-labelledby="ct-enroll-heading"
        className="scroll-mt-24 bg-emerald-50/60 py-16 lg:py-20"
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
                    <GraduationCap className="size-3.5" aria-hidden="true" />
                    Enroll Now
                  </Badge>
                  <h2
                    id="ct-enroll-heading"
                    className="text-3xl font-bold tracking-tight"
                  >
                    Enroll Now
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-emerald-50/90">
                    Reserve your seat for the next batch. Share your
                    details and our team will get back to you with batch
                    schedule, fee payment options, and document requirements.
                  </p>

                  <ul className="mt-6 space-y-2.5">
                    {[
                      "Small batches for personal attention",
                      "Flexible morning / evening batches",
                      "Government-recognized certificate on completion",
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
                  <EnrollForm courses={courseOptions} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ============== CTA STRIP ============== */}
      <section
        aria-labelledby="ct-cta-heading"
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
                  id="ct-cta-heading"
                  className="text-2xl font-bold tracking-tight sm:text-3xl"
                >
                  Ready to start your IT career?
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-emerald-50/90">
                  Join the Top 1 Institute under E-Max India. Admissions
                  open for the 2024–25 batch.
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
                    Enroll Now
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/40 bg-white/5 text-white backdrop-blur hover:bg-white/15 hover:text-white"
                >
                  <Link href="/contact">
                    Talk to an Advisor
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
