import Link from "next/link";
import {
  ChevronRight,
  Sparkles,
  Scissors,
  Shirt,
  PenTool,
  Award,
  BookOpen,
  Clock,
  IndianRupee,
  Settings,
  GraduationCap,
  HandHeart,
  Package,
  Wrench,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  Heart,
  Layers,
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
import { getCourses } from "@/lib/data";
import { SyllabusDownloadButton } from "./syllabus-download";

type KeyFact = {
  title: string;
  description: string;
  icon: React.ElementType;
};

const KEY_FACTS: KeyFact[] = [
  {
    title: "Certified Courses",
    description:
      "Government-recognized certification on successful completion of every tailoring program.",
    icon: Award,
  },
  {
    title: "Hands-on Training",
    description:
      "Practical, project-based learning — every student completes real garments from day one.",
    icon: Wrench,
  },
  {
    title: "Material Provided",
    description:
      "Practice fabric, threads, and tools supplied in class — no hidden material costs.",
    icon: Package,
  },
  {
    title: "Job-Ready Skills",
    description:
      "Graduates leave ready to work in a boutique, take custom orders, or launch their own label.",
    icon: Briefcase,
  },
];

type GalleryTile = {
  label: string;
  caption: string;
  icon: React.ElementType;
  gradient: string;
};

const GALLERY_TILES: GalleryTile[] = [
  {
    label: "Blouse Design",
    caption: "Custom-fit blouse stitching & embroidery",
    icon: Shirt,
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    label: "Frock",
    caption: "Girls' frock design & construction",
    icon: Sparkles,
    gradient: "from-amber-500 to-orange-600",
  },
  {
    label: "Embroidery Work",
    caption: "Hand & machine embroidery patterns",
    icon: PenTool,
    gradient: "from-rose-500 to-pink-600",
  },
  {
    label: "Pattern Drafting",
    caption: "Paper patterns & block-making",
    icon: Layers,
    gradient: "from-emerald-600 to-emerald-800",
  },
  {
    label: "Kurti & Top",
    caption: "Modern kurti and ladies' top designs",
    icon: Shirt,
    gradient: "from-teal-500 to-cyan-700",
  },
  {
    label: " alterations & Repair",
    caption: "Resizing, hemming & fine finishing",
    icon: Scissors,
    gradient: "from-amber-600 to-amber-800",
  },
  {
    label: "Bridal Wear",
    caption: "Traditional bridal blouse & lehenga",
    icon: Heart,
    gradient: "from-rose-600 to-red-700",
  },
  {
    label: "Boutique Setup",
    caption: "Final-year boutique management project",
    icon: Briefcase,
    gradient: "from-emerald-700 to-teal-800",
  },
];

function splitSyllabus(syllabus: string | null | undefined): string[] {
  if (!syllabus) return [];
  return syllabus
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default async function TailoringPage() {
  const courses = await getCourses("tailoring");

  return (
    <>
      {/* ============== HERO HEADER ============== */}
      <section
        aria-labelledby="tl-hero-heading"
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
                Tailoring
              </li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <Badge
              variant="secondary"
              className="mb-5 gap-1.5 border-amber-300/30 bg-amber-500/95 px-3 py-1 text-xs font-semibold text-emerald-950 shadow-sm sm:text-sm"
            >
              <HandHeart className="size-3.5" aria-hidden="true" />
              Hands-on Practical Training
            </Badge>
            <h1
              id="tl-hero-heading"
              className="text-4xl font-bold tracking-tight drop-shadow-sm sm:text-5xl"
            >
              Tongdam Tailoring Training Center
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-emerald-50/90 sm:text-lg">
              Fashion design and tailoring courses — from hand stitches to
              boutique management.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-amber-500 text-emerald-950 shadow-lg shadow-amber-900/20 hover:bg-amber-400"
              >
                <Link href="#courses">
                  <Scissors className="size-4" aria-hidden="true" />
                  Explore Courses
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-white/5 text-white backdrop-blur hover:bg-white/15 hover:text-white"
              >
                <Link href="#gallery">
                  <Sparkles className="size-4" aria-hidden="true" />
                  View Student Work
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ============== OVERVIEW ============== */}
      <section
        aria-labelledby="tl-overview-heading"
        className="bg-white py-16 lg:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Left: intro text */}
            <div>
              <Badge
                variant="secondary"
                className="mb-3 gap-1 border-emerald-200 bg-emerald-100 text-emerald-700"
              >
                <Scissors className="size-3.5" aria-hidden="true" />
                About the Center
              </Badge>
              <h2
                id="tl-overview-heading"
                className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
              >
                Stitch your future, one seam at a time
              </h2>
              <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground">
                <p>
                  The Tongdam Tailoring Training Center is a hands-on
                  vocational institute dedicated to fashion design and
                  garment construction. From absolute beginners taking
                  their first stitch to advanced learners mastering
                  pattern drafting and boutique management, our courses
                  meet every skill level.
                </p>
                <p>
                  Our curriculum blends traditional Indian tailoring
                  techniques with modern fashion design principles.
                  Students work on real projects — blouses, frocks,
                  embroidery pieces, kurtis, and bridal wear — building a
                  portfolio they can show employers or use to start their
                  own boutique.
                </p>
                <p>
                  Taught by experienced instructors in small batches, with
                  all practice material provided in class. Whether
                  you&apos;re aiming for a job at a local boutique, custom
                  home-order work, or launching your own fashion label —
                  Tongdam gives you the foundation.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild className="bg-emerald-600 text-white hover:bg-emerald-700">
                  <Link href="#courses">
                    View Courses
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800">
                  <Link href="/contact?subject=Tailoring+Enrollment">
                    Enquire Now
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right: key facts card */}
            <Card className="overflow-hidden border-emerald-100 bg-gradient-to-br from-emerald-50 to-white py-0">
              <CardContent className="p-6 sm:p-8">
                <span className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-sm">
                  <Sparkles className="size-7" aria-hidden="true" />
                </span>
                <h3 className="text-xl font-semibold text-foreground">
                  Why train with us
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Four reasons students choose Tongdam Tailoring Center.
                </p>

                <ul className="mt-6 space-y-4">
                  {KEY_FACTS.map((fact) => {
                    const Icon = fact.icon;
                    return (
                      <li key={fact.title} className="flex items-start gap-4">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-100">
                          <Icon className="size-5" aria-hidden="true" />
                        </span>
                        <div>
                          <h4 className="text-sm font-semibold text-foreground">
                            {fact.title}
                          </h4>
                          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                            {fact.description}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ============== COURSES ============== */}
      <section
        id="courses"
        aria-labelledby="tl-courses-heading"
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
              id="tl-courses-heading"
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              Tailoring &amp; fashion design programs
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              From a 3-month beginner certificate to a 9-month advanced
              diploma in fashion design and boutique management.
            </p>
          </div>

          {courses.length === 0 ? (
            <Card className="mt-12 border-emerald-100 py-0">
              <CardContent className="p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Course details are being updated. Please{" "}
                  <Link
                    href="/contact?subject=Tailoring+Enrollment"
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
                          variant="outline"
                          className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                        >
                          <Link href="/contact?subject=Tailoring+Enrollment">
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

      {/* ============== STUDENT GALLERY ============== */}
      <section
        id="gallery"
        aria-labelledby="tl-gallery-heading"
        className="scroll-mt-24 bg-white py-16 lg:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Badge
              variant="secondary"
              className="mb-3 gap-1 border-amber-200 bg-amber-100 text-amber-700"
            >
              <Sparkles className="size-3.5" aria-hidden="true" />
              Student Work
            </Badge>
            <h2
              id="tl-gallery-heading"
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              Student Work &amp; Gallery
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              A glimpse of the projects our students complete during their
              training — from basic blouses to advanced bridal wear.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {GALLERY_TILES.map((tile) => {
              const Icon = tile.icon;
              return (
                <article
                  key={tile.label}
                  className={`group relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br ${tile.gradient} p-4 text-white shadow-sm ring-1 ring-black/5 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg`}
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-white/10 blur-2xl transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                  <div className="relative flex h-full flex-col justify-between">
                    <span className="flex size-12 items-center justify-center rounded-lg bg-white/20 backdrop-blur">
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold leading-tight sm:text-base">
                        {tile.label}
                      </h3>
                      <p className="mt-1 text-xs text-white/85">
                        {tile.caption}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            Representative projects. Actual student work is showcased
            during on-campus visits.
          </p>
        </div>
      </section>

      {/* ============== SYLLABUS DOWNLOAD ============== */}
      <section
        aria-labelledby="tl-syllabus-heading"
        className="bg-emerald-50/60 py-16 lg:py-20"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Card className="overflow-hidden border-emerald-100 bg-white py-0">
            <CardContent className="grid grid-cols-1 gap-6 p-6 sm:p-8 lg:grid-cols-3 lg:items-center">
              <div className="lg:col-span-2">
                <Badge
                  variant="secondary"
                  className="mb-3 gap-1 border-amber-200 bg-amber-100 text-amber-700"
                >
                  <Settings className="size-3.5" aria-hidden="true" />
                  Detailed Syllabus
                </Badge>
                <h2
                  id="tl-syllabus-heading"
                  className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
                >
                  Want the complete syllabus?
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Drop your details and we&apos;ll email you the full
                  module-by-module syllabus for both the Basic Certificate
                  and Advanced Diploma — including weekly lesson plans,
                  materials list, and project milestones.
                </p>

                <ul className="mt-4 space-y-2">
                  {[
                    "Module-by-module weekly breakdown",
                    "Required materials & tools list",
                    "Project milestones & evaluation criteria",
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
              </div>

              <div className="flex flex-col items-start gap-3 lg:items-end">
                <SyllabusDownloadButton />
                <p className="text-xs text-muted-foreground">
                  Prefer to talk?{" "}
                  <Link
                    href="/contact?subject=Tailoring+Enrollment"
                    className="font-medium text-emerald-700 underline-offset-4 hover:underline"
                  >
                    Reach us directly
                  </Link>
                  .
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ============== CTA ============== */}
      <section
        aria-labelledby="tl-cta-heading"
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
                  id="tl-cta-heading"
                  className="text-2xl font-bold tracking-tight sm:text-3xl"
                >
                  Start your tailoring journey today
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-emerald-50/90">
                  New batches start every month. Reserve your seat and
                  take the first stitch toward a creative, income-generating
                  skill.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="bg-amber-500 text-emerald-950 shadow-md hover:bg-amber-400"
                >
                  <Link href="/contact?subject=Tailoring+Enrollment">
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
                    Talk to an Instructor
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
