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
  Computer,
  GraduationCap,
  UtensilsCrossed,
  Building,
  ChefHat,
  Scissors,
  Wrench,
} from "lucide-react";
import { getSiteContentMap, getVentures, getAffiliations, getStats, getQuickActions, getEssentialServices, getMilestones, getHeroSlides } from "@/lib/data";
import { VENTURE_ICONS, VENTURE_ACCENTS, DEFAULT_ACCENT } from "@/lib/venture-config";
import { HOME_ICONS, HOME_ACCENTS } from "@/lib/home-config";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AffiliationCarousel } from "@/components/site/affiliation-carousel";
import { HeroSlider } from "@/components/site/hero-slider";

export const revalidate = 60;


export default async function HomePage() {
  const [
    content,
    ventures,
    affiliationRows,
    statRows,
    quickActionRows,
    essentialServiceRows,
    milestones,
    dbHeroSlides,
  ] = await Promise.all([
    getSiteContentMap(),
    getVentures(),
    getAffiliations(),
    getStats(),
    getQuickActions(),
    getEssentialServices(),
    getMilestones(),
    getHeroSlides(),
  ]);
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

  // Default slides — used when the admin has not yet seeded the DB table.
  const defaultSlides = [
    {
      id: "slide-1",
      badge: `Established ${foundedYear} · Community First`,
      badgeIcon: "Sparkles",
      title: heroTitle,
      subtitle: heroSubtitle,
      btn1Text: "Explore Our Ventures",
      btn1Href: "#departments",
      btn2Text: "Contact Us",
      btn2Href: "/contact",
      bgImage: "/institute-hero.png",
      cardTitle: "Our Mission",
      cardIcon: "Quote",
      cardText: "To uplift the local community by providing accessible digital services, quality skill-based training, and genuine customer care — all under one trusted roof.",
      cardFooterTitle: "Founded by",
      cardFooterSubtitle: founder,
      cardBadge: "Govt. Recognised · E-Max India Affiliated",
    },
    {
      id: "slide-2",
      badge: "Govt. Recognized · 100% Placement",
      badgeIcon: "GraduationCap",
      title: "Master In-Demand IT & Coding Skills",
      subtitle: "Join Churachandpur's premier computer training institute. Learn DCA, ADCA, Tally Prime, Python, and Web Development from experienced faculty.",
      btn1Text: "Explore Courses",
      btn1Href: "/education/computer-training",
      btn2Text: "Apply Now",
      btn2Href: "/education/computer-training#enroll",
      bgImage: "/training-hero.png",
      cardTitle: "Vocational Excellence",
      cardIcon: "GraduationCap",
      cardText: "Equipping local youth and professionals with accredited certifications to land job roles and secure financial independence.",
      cardFooterTitle: "Affiliated to",
      cardFooterSubtitle: "E-Max India (Top 1 nationwide)",
      cardBadge: "Official Computer Training & Certification Hub",
    },
    {
      id: "slide-3",
      badge: "Hospitality Industry · 100% Placement",
      badgeIcon: "ChefHat",
      title: "Launch a Global Hospitality Career",
      subtitle: "Gain professional hands-on diplomas in Food Production, F&B Service, and Hotel Operations. Fully-equipped training kitchen & placement network.",
      btn1Text: "Hospitality Program",
      btn1Href: "/education/hotel-management",
      btn2Text: "Enroll Today",
      btn2Href: "/education/hotel-management#enroll",
      bgImage: "/restaurant-hero.png",
      cardTitle: "Global Opportunities",
      cardIcon: "ChefHat",
      cardText: "A complete practical syllabus ensuring you are 100% ready for leading 5-star luxury hotels, resorts, and cruise liners.",
      cardFooterTitle: "Track Record",
      cardFooterSubtitle: "100% Practical & Placement Assist",
      cardBadge: "Simulated Kitchen, Housekeeping, & Bar Training",
    },
    {
      id: "slide-4",
      badge: "Creative Fashion · Accredited Programs",
      badgeIcon: "Scissors",
      title: "Express Your Style & Fashion Creativity",
      subtitle: "Master dressmaking, cutting, and premium embroidery at our dedicated tailoring training school. Complete custom garments from your very first week.",
      btn1Text: "Tailoring Center",
      btn1Href: "/education/tailoring",
      btn2Text: "Get Details",
      btn2Href: "/education/tailoring#courses",
      bgImage: "/training-hero.png",
      cardTitle: "Creative Skillsets",
      cardIcon: "Scissors",
      cardText: "Providing hands-on fashion training with all practice fabrics and sewing machines supplied in class—zero hidden costs.",
      cardFooterTitle: "Outcome Focused",
      cardFooterSubtitle: "Self-Employment & Boutique Ready",
      cardBadge: "Accredited Sewing & Fashion Designing Certificate",
    },
    {
      id: "slide-5",
      badge: "Authorized UCO Bank CSP · Aadhaar Center",
      badgeIcon: "Building",
      title: "Your Hub for Secure Banking & Public Services",
      subtitle: "Skip the long queues. Securely deposit cash, execute transfers, apply for Aadhaar cards, updates, PAN cards, Voter IDs, or print digital documents locally.",
      btn1Text: "Explore Services",
      btn1Href: "/services/computer-works",
      btn2Text: "Contact Desk",
      btn2Href: "/contact",
      bgImage: "/citizen-hero.png",
      cardTitle: "Citizen Digital Services",
      cardIcon: "ShieldCheck",
      cardText: "Bringing critical financial and government services directly to Churachandpur's doorstep with complete security and speed.",
      cardFooterTitle: "Authorized CSP for",
      cardFooterSubtitle: "UCO Bank (Government of India)",
      cardBadge: "Official Aadhaar Enrolment & Updates Station",
    },
    {
      id: "slide-6",
      badge: "Tongdam Restaurant · Fine Dining",
      badgeIcon: "UtensilsCrossed",
      title: "Warm Hospitality & Cozy Fine Dining",
      subtitle: "Dine with family and friends. Savor fresh local delicacies and multi-cuisine favorites prepared by our expert chefs in a premium ambient space.",
      btn1Text: "Dine with Us",
      btn1Href: "/lifestyle/restaurant",
      btn2Text: "Table Bookings",
      btn2Href: "/lifestyle/restaurant#reserve",
      bgImage: "/restaurant-hero.png",
      cardTitle: "Local & Multi-Cuisine",
      cardIcon: "UtensilsCrossed",
      cardText: "From family gatherings to quiet dinners, we guarantee high hygiene standards, rich flavors, and a beautiful dining experience.",
      cardFooterTitle: "Restaurant Hours",
      cardFooterSubtitle: "Open Daily: 9:00 AM - 9:00 PM",
      cardBadge: "Dine-in, Takeaway, and Group Gathering Venue",
    },
    {
      id: "slide-7",
      badge: "Mobile Hub · Expert Repair Center",
      badgeIcon: "Phone",
      title: "Expert Smartphone Repairs & Tech Care",
      subtitle: "Get professional chip-level repairs using high-quality parts for all Android and iOS smartphones. Or join our hands-on mobile hardware repair training.",
      btn1Text: "Mobile Servicing",
      btn1Href: "/services/mobile-hub",
      btn2Text: "Contact Techs",
      btn2Href: "/contact",
      bgImage: "/citizen-hero.png",
      cardTitle: "Tech Solutions",
      cardIcon: "Wrench",
      cardText: "Premium hardware troubleshooting, glass replacements, and software formatting under expert guidance and tools.",
      cardFooterTitle: "Hardware Training",
      cardFooterSubtitle: "Practical Mobile Repairing Course",
      cardBadge: "Certified Phone Diagnostics & Servicing Lab",
    },
  ];

  // Use DB slides if the admin has saved any; otherwise fall back to defaults.
  const heroSlides = dbHeroSlides.length > 0
    ? dbHeroSlides.map((s) => ({ ...s }))
    : defaultSlides;

  return (
    <>
      {/* ============== HERO (contains stats) — header + hero = 100vh on desktop ============== */}
      {/* ============== HERO ============== */}
      <HeroSlider
        slides={heroSlides}
      >
        {/* ============== STATS BAR (inside hero) ============== */}
        <div aria-label="Quick stats" className="relative mx-auto w-full max-w-7xl px-4 pt-8 pb-10 sm:px-6 lg:pt-12 lg:pb-12 z-10">
          <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {statRows.map((stat) => {
              const Icon = HOME_ICONS[stat.icon] ?? HOME_ICONS.Briefcase;
              return (
                <div
                  key={stat.id}
                  className="flex flex-col items-center rounded-xl border border-stone-200 bg-white px-4 py-4 text-center shadow-sm"
                >
                  <span className="mb-2.5 flex size-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <dd className="text-2xl font-bold text-stone-900">{stat.value}</dd>
                  <dt className="mt-1 text-xs text-stone-500">{stat.label}</dt>
                </div>
              );
            })}
          </dl>
        </div>
      </HeroSlider>

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
