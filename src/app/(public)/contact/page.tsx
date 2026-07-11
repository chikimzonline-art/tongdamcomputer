import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  ChevronRight,
  MessageSquare,
  Navigation,
} from "lucide-react";
import { getSiteContentMap } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContactForm } from "./contact-form";

type ContactCard = {
  label: string;
  value: string;
  href?: string;
  icon: React.ElementType;
  hint?: string;
};

export default async function ContactPage() {
  const content = await getSiteContentMap();
  const phone1 = content["contact.phone1"] ?? "+91 98765 43210";
  const phone2 = content["contact.phone2"] ?? "+91 91234 56789";
  const email = content["contact.email"] ?? "info@tongdamcomputers.com";
  const address =
    content["contact.address"] ??
    "Tongdam Computers, Main Market Road, Churachandpur, Manipur 795128, India";

  const mapSrc =
    "https://www.google.com/maps?q=Churachandpur,Manipur,India&output=embed";

  const contactCards: ContactCard[] = [
    {
      label: "Phone",
      value: phone1,
      href: `tel:${phone1.replace(/\s+/g, "")}`,
      icon: Phone,
      hint: `Alt: ${phone2}`,
    },
    {
      label: "Secondary Phone",
      value: phone2,
      href: `tel:${phone2.replace(/\s+/g, "")}`,
      icon: Phone,
    },
    {
      label: "Email",
      value: email,
      href: `mailto:${email}`,
      icon: Mail,
      hint: "We reply within 24 hours",
    },
    {
      label: "Address",
      value: address,
      icon: MapPin,
      hint: "Churachandpur, Manipur",
    },
    {
      label: "Working Hours",
      value: "Mon – Sat · 9:00 AM – 6:00 PM",
      icon: Clock,
      hint: "Closed on Sundays & public holidays",
    },
  ];

  return (
    <>
      {/* ============== HERO HEADER ============== */}
      <section
        aria-labelledby="contact-hero-heading"
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
                Contact
              </li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <Badge
              variant="secondary"
              className="mb-5 gap-1.5 border-emerald-300/30 bg-white/10 px-3 py-1 text-xs font-medium text-emerald-50 backdrop-blur"
            >
              <Sparkles className="size-3.5 text-amber-300" aria-hidden="true" />
              We&apos;re here to help
            </Badge>
            <h1
              id="contact-hero-heading"
              className="text-4xl font-bold tracking-tight drop-shadow-sm sm:text-5xl"
            >
              Contact Us
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-emerald-50/90 sm:text-lg">
              Visit our office, call, or send us a query — we&apos;re here to help.
            </p>
          </div>
        </div>
      </section>

      {/* ============== CONTACT INFO + MAP ============== */}
      <section
        aria-labelledby="contact-info-heading"
        className="bg-white py-16 lg:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Left: contact cards */}
            <div>
              <Badge
                variant="secondary"
                className="mb-3 gap-1 border-emerald-200 bg-emerald-100 text-emerald-700"
              >
                <Phone className="size-3.5" aria-hidden="true" />
                Reach Us
              </Badge>
              <h2
                id="contact-info-heading"
                className="text-3xl font-bold tracking-tight text-foreground"
              >
                Get in touch
              </h2>
              <p className="mt-3 text-base text-muted-foreground">
                Call, email, or simply walk in — our team is ready to assist
                with admissions, services, and queries.
              </p>

              <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {contactCards.map((card) => {
                  const Icon = card.icon;
                  const inner = (
                    <Card
                      className={`group h-full border-emerald-100 py-0 transition-all duration-200 ${
                        card.href
                          ? "hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-100/60"
                          : ""
                      }`}
                    >
                      <CardContent className="flex h-full items-start gap-3 p-5">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                          <Icon className="size-5" aria-hidden="true" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            {card.label}
                          </p>
                          <p className="mt-0.5 break-words text-sm font-semibold text-foreground">
                            {card.value}
                          </p>
                          {card.hint && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              {card.hint}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );

                  return (
                    <li key={card.label}>
                      {card.href ? (
                        <a
                          href={card.href}
                          className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 rounded-xl"
                          aria-label={`${card.label}: ${card.value}`}
                        >
                          {inner}
                        </a>
                      ) : (
                        inner
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Right: map */}
            <div>
              <Badge
                variant="secondary"
                className="mb-3 gap-1 border-emerald-200 bg-emerald-100 text-emerald-700"
              >
                <Navigation className="size-3.5" aria-hidden="true" />
                Find Us
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                On the map
              </h2>
              <p className="mt-3 text-base text-muted-foreground">
                We&apos;re located in the heart of Churachandpur, Manipur.
              </p>

              <Card className="mt-8 overflow-hidden border-emerald-100 py-0">
                <CardContent className="p-0">
                  <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]">
                    <iframe
                      title="Tongdam Computers location"
                      src={mapSrc}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="absolute inset-0 size-full border-0"
                      allowFullScreen
                    />
                  </div>
                  <div className="flex items-start gap-2 border-t border-emerald-100 bg-emerald-50/40 p-4 text-xs text-muted-foreground">
                    <MapPin
                      className="mt-0.5 size-4 shrink-0 text-emerald-700"
                      aria-hidden="true"
                    />
                    <span>{address}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ============== QUERY FORM ============== */}
      <section
        aria-labelledby="query-form-heading"
        className="bg-emerald-50/60 py-16 lg:py-20"
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center">
            <Badge
              variant="secondary"
              className="mb-3 gap-1 border-emerald-200 bg-emerald-100 text-emerald-700"
            >
              <MessageSquare className="size-3.5" aria-hidden="true" />
              Send a Query
            </Badge>
            <h2
              id="query-form-heading"
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              Send Us a Query
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Have a question about admissions, courses, services, or
              reservations? Fill out the form below and we&apos;ll get back to you
              shortly.
            </p>
          </div>

          <Card className="mt-10 border-emerald-100 py-0">
            <CardContent className="p-6 sm:p-8">
              <ContactForm />
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
