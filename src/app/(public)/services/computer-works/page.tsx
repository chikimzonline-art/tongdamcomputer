import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  Sparkles,
  Landmark,
  Fingerprint,
  Printer,
  FileText,
  ShieldCheck,
  Zap,
  Wallet,
  MapPin,
  Clock,
  BadgeCheck,
  ClipboardList,
  FileCheck,
  Languages,
  Phone,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSiteContentMap } from "@/lib/data";
import { InquiryForm } from "./inquiry-form";

type Pricing = { item: string; price: string };

type Service = {
  title: string;
  description: string;
  icon: React.ElementType;
  pricing: Pricing[];
  tags: string[];
};

const SERVICES: Service[] = [
  {
    title: "CSP UCO Bank Services",
    description:
      "Authorized Customer Service Point offering account opening, cash transactions, transfers, and social security schemes.",
    icon: Landmark,
    pricing: [
      { item: "Account Opening", price: "Free" },
      { item: "Cash Deposit / Withdrawal", price: "₹0–₹10" },
      { item: "Money Transfer", price: "₹10 onwards" },
      { item: "PMJJBY / PMSBY / APY Enrolment", price: "Nominal" },
    ],
    tags: ["PMJJBY", "PMSBY", "APY", "UCO Bank CSP"],
  },
  {
    title: "Aadhaar & Public Identity Services",
    description:
      "Secure support for PVC smart card printing, biometric/demographic updates, and enrolment assistance.",
    icon: Fingerprint,
    pricing: [
      { item: "Aadhaar PVC Card Printing", price: "₹50" },
      { item: "Biometric Update", price: "₹100" },
      { item: "Demographic Update", price: "₹50" },
      { item: "New Enrolment Assistance", price: "₹50" },
    ],
    tags: ["PVC Smart Card", "Biometric", "Demographic", "Enrolment"],
  },
  {
    title: "DTP & Printing Works",
    description:
      "Professional layout, multilingual typing (English, Hindi, and local dialects), high-speed scanning/Xerox, and express passport photos.",
    icon: Printer,
    pricing: [
      { item: "Black & White Xerox", price: "₹2 / page" },
      { item: "Color Print", price: "₹10 / page" },
      { item: "Passport Photo (8 copies)", price: "₹50" },
      { item: "Lamination", price: "₹10 onwards" },
    ],
    tags: ["Multilingual Typing", "Scanning", "Xerox", "Passport Photos"],
  },
  {
    title: "Financial & Civil Documentation",
    description:
      "New applications, corrections, and retrievals for PAN cards, Voter IDs, and Birth Certificates.",
    icon: FileText,
    pricing: [
      { item: "PAN Card New Application", price: "₹150" },
      { item: "PAN Correction", price: "₹200" },
      { item: "Voter ID Services", price: "₹50" },
      { item: "Birth Certificate Assistance", price: "₹100" },
    ],
    tags: ["PAN Card", "Voter ID", "Birth Certificate", "Corrections"],
  },
];

const WHY_CHOOSE = [
  {
    title: "Authorized & Secure",
    description:
      "Official CSP partner with secure biometric authentication for every transaction.",
    icon: ShieldCheck,
  },
  {
    title: "Fast Turnaround",
    description: "Most services completed same-day, often within minutes.",
    icon: Zap,
  },
  {
    title: "Transparent Pricing",
    description: "Clear, published rates with no hidden charges.",
    icon: Wallet,
  },
  {
    title: "Local & Trusted",
    description:
      "Serving Churachandpur with a reputation built since 2020.",
    icon: MapPin,
  },
];

const PROCESS = [
  {
    step: "01",
    title: "Visit Office",
    description: "Come to our Churachandpur center with your documents.",
    icon: MapPin,
  },
  {
    step: "02",
    title: "Submit Documents",
    description: "Hand over your proofs and tell us what you need.",
    icon: ClipboardList,
  },
  {
    step: "03",
    title: "We Process",
    description:
      "Our team processes your request securely and accurately.",
    icon: FileCheck,
  },
  {
    step: "04",
    title: "Collect Receipt",
    description: "Receive your receipt or printed document on the spot.",
    icon: BadgeCheck,
  },
];

const HERO_BADGES = [
  { label: "Authorized CSP", icon: Landmark },
  { label: "Aadhaar Enabled", icon: Fingerprint },
  { label: "Multilingual Support", icon: Languages },
];

export const revalidate = 300;

export default async function ComputerWorksPage() {
  const content = await getSiteContentMap();
  const phone = content["contact.phone1"] ?? "";

  return (
    <>
      {/* ============== HERO HEADER ============== */}
      <section
        aria-labelledby="cw-hero-heading"
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
                Computer Works
              </li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <Badge
              variant="secondary"
              className="mb-5 gap-1.5 border-emerald-300/30 bg-white/10 px-3 py-1 text-xs font-medium text-emerald-50 backdrop-blur"
            >
              <Sparkles className="size-3.5 text-amber-300" aria-hidden="true" />
              One-stop digital service center
            </Badge>
            <h1
              id="cw-hero-heading"
              className="text-4xl font-bold tracking-tight drop-shadow-sm sm:text-5xl"
            >
              Computer Works
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-emerald-50/90 sm:text-lg">
              Essential public services, documentation, and printing — your
              trusted one-stop digital service center.
            </p>

            {/* Badge row */}
            <ul className="mt-7 flex flex-wrap gap-2.5">
              {HERO_BADGES.map((b) => {
                const Icon = b.icon;
                return (
                  <li key={b.label}>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur sm:text-sm">
                      <Icon className="size-3.5 text-amber-300" aria-hidden="true" />
                      {b.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* ============== SERVICES GRID ============== */}
      <section
        aria-labelledby="cw-services-heading"
        className="bg-white py-16 lg:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Badge
              variant="secondary"
              className="mb-3 gap-1 border-emerald-200 bg-emerald-100 text-emerald-700"
            >
              <FileText className="size-3.5" aria-hidden="true" />
              Our Services
            </Badge>
            <h2
              id="cw-services-heading"
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              What we offer
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Four core service categories covering banking, identity,
              printing, and civil documentation — all under one roof.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {SERVICES.map((service) => {
              const Icon = service.icon;
              return (
                <Card
                  key={service.title}
                  className="group flex flex-col border-emerald-100 bg-white py-0 transition-all duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/60"
                >
                  <CardContent className="flex flex-1 flex-col p-6 sm:p-7">
                    <div className="flex items-start gap-4">
                      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-sm transition-transform group-hover:scale-105 sm:size-14">
                        <Icon className="size-6 sm:size-7" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-xl font-semibold text-foreground">
                          {service.title}
                        </h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                          {service.description}
                        </p>
                      </div>
                    </div>

                    {/* Pricing mini-list */}
                    <div className="mt-6 rounded-lg border border-emerald-100 bg-emerald-50/50 p-4">
                      <h4 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                        <Wallet className="size-3.5" aria-hidden="true" />
                        Pricing
                      </h4>
                      <ul className="space-y-2">
                        {service.pricing.map((p) => (
                          <li
                            key={p.item}
                            className="flex items-baseline justify-between gap-3 text-sm"
                          >
                            <span className="text-muted-foreground">
                              {p.item}
                            </span>
                            <span className="shrink-0 font-semibold text-foreground">
                              {p.price}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tags */}
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {service.tags.map((tag) => (
                        <li key={tag}>
                          <Badge
                            variant="outline"
                            className="border-amber-200 bg-amber-50 text-amber-700"
                          >
                            {tag}
                          </Badge>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <div className="mt-6 flex-1">
                      <Button
                        asChild
                        variant="outline"
                        className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                      >
                        <Link href="#inquiry">
                          Get this service
                          <ArrowRight className="size-4" aria-hidden="true" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============== WHY CHOOSE US ============== */}
      <section
        aria-labelledby="cw-why-heading"
        className="bg-emerald-50/60 py-16 lg:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Badge
              variant="secondary"
              className="mb-3 gap-1 border-emerald-200 bg-emerald-100 text-emerald-700"
            >
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              Why Choose Us
            </Badge>
            <h2
              id="cw-why-heading"
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              Trusted by the community
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              We combine official authorization with fast, friendly, local
              service.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_CHOOSE.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.title}
                  className="group flex flex-col border-emerald-100 bg-white py-0 transition-all duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/60"
                >
                  <CardContent className="flex flex-1 flex-col p-6">
                    <span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    <h3 className="text-base font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============== PROCESS STEPS ============== */}
      <section
        aria-labelledby="cw-process-heading"
        className="bg-white py-16 lg:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Badge
              variant="secondary"
              className="mb-3 gap-1 border-emerald-200 bg-emerald-100 text-emerald-700"
            >
              <ClipboardList className="size-3.5" aria-hidden="true" />
              How It Works
            </Badge>
            <h2
              id="cw-process-heading"
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              A simple 4-step process
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              From walk-in to receipt — straightforward and stress-free.
            </p>
          </div>

          <ol className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((p, i) => {
              const Icon = p.icon;
              return (
                <li key={p.step} className="relative">
                  {/* Connector arrow (desktop) */}
                  {i < PROCESS.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-3 top-12 hidden z-10 text-emerald-300 lg:block"
                    >
                      <ArrowRight className="size-6" />
                    </span>
                  )}
                  <Card className="h-full border-emerald-100 bg-white py-0 transition-shadow hover:shadow-md hover:shadow-emerald-100/60">
                    <CardContent className="flex h-full flex-col items-start gap-3 p-6">
                      <div className="flex w-full items-center justify-between">
                        <span className="flex size-12 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
                          <Icon className="size-6" aria-hidden="true" />
                        </span>
                        <span className="text-3xl font-bold tracking-tight text-emerald-100">
                          {p.step}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {p.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {p.description}
                      </p>
                    </CardContent>
                  </Card>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ============== INQUIRY CTA ============== */}
      <section
        id="inquiry"
        aria-labelledby="cw-inquiry-heading"
        className="scroll-mt-24 bg-emerald-50/60 py-16 lg:py-20"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
            {/* Left: Heading + contact */}
            <div className="lg:col-span-2">
              <Badge
                variant="secondary"
                className="mb-3 gap-1 border-emerald-200 bg-emerald-100 text-emerald-700"
              >
                <MessageSquare className="size-3.5" aria-hidden="true" />
                Need a service?
              </Badge>
              <h2
                id="cw-inquiry-heading"
                className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
              >
                Need a service not listed? Send us a query.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Fill out the quick form and our team will get back to you with
                what to bring, how long it takes, and the exact cost.
              </p>

              <div className="mt-6 space-y-3">
                {phone && (
                  <a
                    href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                    className="flex items-center gap-3 rounded-lg border border-emerald-100 bg-white p-3 transition-colors hover:bg-emerald-50"
                  >
                    <span className="flex size-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
                      <Phone className="size-4" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Call us
                      </span>
                      <span className="block text-sm font-semibold text-foreground">
                        {phone}
                      </span>
                    </span>
                  </a>
                )}
                <div className="flex items-center gap-3 rounded-lg border border-emerald-100 bg-white p-3">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
                    <Clock className="size-4" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Working Hours
                    </span>
                    <span className="block text-sm font-semibold text-foreground">
                      Mon–Sat · 9:00 AM – 6:00 PM
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-3">
              <Card className="border-emerald-100 bg-white py-0">
                <CardContent className="p-6 sm:p-8">
                  <InquiryForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
