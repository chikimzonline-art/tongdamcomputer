import Link from "next/link";
import {
  ArrowRight,
  Phone,
  Sparkles,
  ShieldCheck,
  Quote,
  Star,
  TrendingUp,
  MapPin,
  Mail,
  Check,
} from "lucide-react";
import { getSiteContentMap, getVentures, getAffiliations, getStats, getQuickActions, getEssentialServices, getMilestones } from "@/lib/data";
import { VENTURE_ICONS, VENTURE_ACCENTS, DEFAULT_ACCENT } from "@/lib/venture-config";
import { HOME_ICONS, HOME_ACCENTS } from "@/lib/home-config";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AffiliationCarousel } from "@/components/site/affiliation-carousel";

export default async function HomePage() {
  const content = await getSiteContentMap();
  const ventures = await getVentures();
  const affiliationRows = await getAffiliations();
  const statRows = await getStats();
  const quickActionRows = await getQuickActions();
  const essentialServiceRows = await getEssentialServices();
  const milestones = await getMilestones();
  const affiliations = affiliationRows.map((a) => ({
    id: a.id,
    name: a.name,
    category: a.category,
    description: a.description,
    icon: a.icon,
    accent: a.accent,
  }));
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
            {statRows.map((stat) => {
              const Icon = HOME_ICONS[stat.icon] ?? HOME_ICONS.Briefcase;
              return (
                <div
                  key={stat.id}
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
              {content["home.venturesLabel"] ?? "Our Ventures"}
            </p>
            <h2
              id="ventures-heading"
              className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
            >
              {content["home.venturesHeading"] ?? "A Family of Institutes & Services"}
            </h2>
            <p className="mt-4 text-base text-gray-500">
              {content["home.venturesSubtitle"] ?? "From certified computer training to hotel management, tailoring, mobile repair, and essential citizen services — Tongdam Computers serves the community across multiple disciplines."}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {ventures.map((v) => {
              const Icon = VENTURE_ICONS[v.icon] ?? Computer;
              const accent = VENTURE_ACCENTS[v.accent] ?? DEFAULT_ACCENT;
              const features: string[] = (() => {
                try {
                  const parsed = JSON.parse(v.features);
                  return Array.isArray(parsed) ? parsed : [];
                } catch {
                  return [];
                }
              })();
              return (
                <Link
                  key={v.id}
                  href={v.href}
                  aria-label={`Open ${v.title}`}
                  className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
                >
                  {/* Top accent bar */}
                  <span className={`h-1 w-full ${accent.bar}`} aria-hidden="true" />

                  <div className="flex flex-1 flex-col p-6">
                    {/* Icon + Badge row */}
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <span
                        className={`flex size-12 items-center justify-center rounded-lg ${accent.iconBg} ${accent.iconText}`}
                      >
                        <Icon className="size-6" aria-hidden="true" />
                      </span>
                      <span
                        className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ${accent.badgeBg} ${accent.badgeText}`}
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
                    {features.length > 0 && (
                      <ul className="mt-4 space-y-2">
                        {features.map((f) => (
                          <li
                            key={f}
                            className="flex items-center gap-2 text-sm text-gray-600"
                          >
                            <Check
                              className={`size-4 shrink-0 ${accent.dot}`}
                              aria-hidden="true"
                            />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    )}

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

      {/* ============== ESSENTIAL CITIZEN & DIGITAL SERVICES ============== */}
      <section
        aria-labelledby="essential-heading"
        className="bg-gray-50 py-16 lg:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-wide text-emerald-600">
              {content["home.essentialLabel"] ?? "Computer Works"}
            </p>
            <h2
              id="essential-heading"
              className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl"
            >
              {(() => {
                const heading = content["home.essentialHeading"] ?? "Essential |Citizen & Digital Services";
                const parts = heading.split("|");
                if (parts.length >= 2) {
                  return (
                    <>
                      <span className="text-gray-900">{parts[0]}</span>
                      <span className="text-amber-500">{parts.slice(1).join("|")}</span>
                    </>
                  );
                }
                return <span className="text-gray-900">{heading}</span>;
              })()}
            </h2>
            <p className="mt-4 text-base text-gray-500">
              {content["home.essentialSubtitle"] ?? "Your trusted center for banking services, Aadhaar, PAN, voter ID, birth certificates, DTP & printing — all in one place."}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {essentialServiceRows.map((s) => {
              const Icon = HOME_ICONS[s.icon] ?? HOME_ICONS.Landmark;
              const accent = HOME_ACCENTS[s.accent] ?? HOME_ACCENTS.emerald;
              const services: string[] = (() => {
                try { const p = JSON.parse(s.services); return Array.isArray(p) ? p : []; } catch { return []; }
              })();
              return (
                <div
                  key={s.id}
                  className="flex flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  {/* Icon */}
                  <span
                    className={`mb-4 flex size-12 items-center justify-center rounded-full ${accent.iconBg} ${accent.iconText}`}
                  >
                    <Icon className="size-6" aria-hidden="true" />
                  </span>

                  {/* Title + description */}
                  <h3 className="text-lg font-semibold text-gray-900">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    {s.description}
                  </p>

                  {/* Services list */}
                  <ul className="mt-4 space-y-2">
                    {services.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <span
                          className={`size-1.5 shrink-0 rounded-full ${accent.iconBg}`}
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* "+N more services" link */}
                  {s.extraCount > 0 && (
                    <Link
                      href="/services/computer-works"
                      className={`mt-3 text-sm font-medium hover:underline ${accent.link}`}
                    >
                      +{s.extraCount} more services
                    </Link>
                  )}
                </div>
              );
            })}
          </div>

          {/* View all link */}
          <div className="mt-10 text-center">
            <Link
              href="/services/computer-works"
              className="inline-flex items-center gap-1.5 text-base font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              View all Computer Works services
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
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
              {content["home.quickActionsHeading"] ?? "What would you like to do today?"}
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              {content["home.quickActionsSubtitle"] ?? "Pick a quick action and we'll take you straight to the right desk."}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {quickActionRows.map((action) => {
              const Icon = HOME_ICONS[action.icon] ?? HOME_ICONS.CalendarCheck;
              return (
                <Card
                  key={action.id}
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
                {content["home.storyHeading"] ?? "Built on a customer-first philosophy"}
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
                  {milestones.map((item) => (
                    <li key={item.id} className="relative">
                      <span
                        className="absolute -left-[27px] top-0.5 flex size-4 items-center justify-center rounded-full border-2 border-emerald-600 bg-white"
                        aria-hidden="true"
                      >
                        <span className="size-1.5 rounded-full bg-emerald-600" />
                      </span>
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <span className="text-sm font-bold text-emerald-700">{item.year}</span>
                        <span className="text-sm font-semibold text-foreground">{item.title}</span>
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

      {/* ============== AFFILIATIONS & BRAND PARTNERS ============== */}
      <section
        aria-labelledby="affiliations-heading"
        className="bg-gradient-to-b from-white to-gray-50 py-16 lg:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium uppercase tracking-wide text-emerald-600">
              Trusted &amp; Recognized
            </p>
            <h2
              id="affiliations-heading"
              className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
            >
              Our Affiliations &amp; Brand Partners
            </h2>
            <p className="mt-4 text-base text-gray-500">
              From government-recognized education affiliations to 5-star hotel
              placement partners — our network ensures your certifications and
              skills are valued everywhere.
            </p>
          </div>

          <div className="mt-12">
            <AffiliationCarousel affiliations={affiliations} />
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
                {content["home.ctaHeading"] ?? "Ready to get started? Visit us or call today."}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-emerald-50/90 sm:text-base">
                {content["home.ctaDescription"] ?? "Whether you want to enroll in a course, book a table, or apply for an Aadhaar / PAN — our team is here to help."}
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
