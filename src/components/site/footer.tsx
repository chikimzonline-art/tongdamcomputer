import Link from "next/link";
import {
  Cpu,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Computer,
  Smartphone,
  GraduationCap,
  Scissors,
  Hotel,
  Utensils,
  ArrowUpRight,
  Lock,
} from "lucide-react";
import { getSiteContentMap } from "@/lib/data";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Computer Training", href: "/education/computer-training" },
  { label: "Restaurant", href: "/lifestyle/restaurant" },
];

const DEPARTMENTS = [
  { label: "Computer Works", href: "/services/computer-works", icon: Computer },
  { label: "Mobile Hub", href: "/services/mobile-hub", icon: Smartphone },
  { label: "Computer Training", href: "/education/computer-training", icon: GraduationCap },
  { label: "Tailoring & Fashion", href: "/education/tailoring", icon: Scissors },
  { label: "Hotel Management", href: "/education/hotel-management", icon: Hotel },
  { label: "Restaurant", href: "/lifestyle/restaurant", icon: Utensils },
];

/**
 * Multi-column site footer. Server component — pulls contact
 * info + E-Max affiliation text from the CMS-backed content map.
 * The footer naturally sits at the bottom of the viewport on short
 * pages because the (public) layout uses `flex flex-col` with a
 * `flex-1` main element above the footer.
 */
export async function SiteFooter() {
  const content = await getSiteContentMap();
  const logoUrl = content["site.logoUrl"] ?? "";
  const phone1 = content["contact.phone1"] ?? "";
  const phone2 = content["contact.phone2"] ?? "";
  const email = content["contact.email"] ?? "";
  const address = content["contact.address"] ?? "";
  const emaxBadge =
    content["training.emaxBadge"] ??
    "Affiliated to E-Max India | Recognized by Govt. of India";
  const foundedYear = content["about.foundedYear"] ?? "2020";
  const founder = content["about.founder"] ?? "Mr. P Soiminthang Zou";

  return (
    <footer className="mt-auto bg-emerald-950 text-emerald-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5" aria-label="Tongdam Computers — Home">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Tongdam Computers logo"
                  className="h-9 w-auto max-w-[140px] object-contain bg-white/10 p-1 rounded"
                />
              ) : (
                <span className="flex size-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
                  <Cpu className="size-5" aria-hidden="true" />
                </span>
              )}
              <span className="text-base font-bold tracking-tight">Tongdam Computers</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-emerald-100/80">
              A multi-department hub delivering elite vocational training, essential
              public services, and lifestyle amenities — all under one trusted roof
              in Churachandpur, Manipur.
            </p>
            <div className="mt-4 inline-flex items-start gap-2 rounded-md border border-emerald-700/60 bg-emerald-900/60 px-3 py-2">
              <ShieldCheck
                className="mt-0.5 size-4 shrink-0 text-amber-400"
                aria-hidden="true"
              />
              <span className="text-xs font-medium leading-snug text-emerald-50/90">
                {emaxBadge}
              </span>
            </div>
            <Link
              href="/admin/login"
              className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-emerald-700/60 bg-emerald-900/40 px-3 py-1.5 text-xs font-medium text-emerald-100/80 transition-colors hover:border-amber-400/60 hover:bg-emerald-800/60 hover:text-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60"
              aria-label="Admin login — staff access"
            >
              <Lock className="size-3.5" aria-hidden="true" />
              Admin Login
            </Link>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer quick links">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-emerald-200">
              Quick Links
            </h2>
            <ul className="mt-4 space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-1 text-sm text-emerald-100/80 transition-colors hover:text-amber-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-emerald-200">
              Reach Us
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-emerald-100/85">
              {address && (
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-amber-400" aria-hidden="true" />
                  <span className="leading-relaxed">{address}</span>
                </li>
              )}
              {phone1 && (
                <li className="flex items-center gap-2.5">
                  <Phone className="size-4 shrink-0 text-amber-400" aria-hidden="true" />
                  <a href={`tel:${phone1.replace(/\s+/g, "")}`} className="hover:text-amber-300">
                    {phone1}
                  </a>
                </li>
              )}
              {phone2 && (
                <li className="flex items-center gap-2.5">
                  <Phone className="size-4 shrink-0 text-amber-400" aria-hidden="true" />
                  <a href={`tel:${phone2.replace(/\s+/g, "")}`} className="hover:text-amber-300">
                    {phone2}
                  </a>
                </li>
              )}
              {email && (
                <li className="flex items-center gap-2.5">
                  <Mail className="size-4 shrink-0 text-amber-400" aria-hidden="true" />
                  <a href={`mailto:${email}`} className="hover:text-amber-300">
                    {email}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Departments */}
          <nav aria-label="Departments">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-emerald-200">
              Departments
            </h2>
            <ul className="mt-4 space-y-2.5">
              {DEPARTMENTS.map((d) => {
                const Icon = d.icon;
                return (
                  <li key={d.href}>
                    <Link
                      href={d.href}
                      className="group inline-flex items-center gap-2 text-sm text-emerald-100/80 transition-colors hover:text-amber-300"
                    >
                      <Icon
                        className="size-4 shrink-0 text-emerald-400 transition-colors group-hover:text-amber-300"
                        aria-hidden="true"
                      />
                      {d.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-3 border-t border-emerald-900/80 pt-6 text-xs text-emerald-200/70 sm:flex-row sm:items-center sm:justify-between">
          <p className="leading-relaxed">
            © {foundedYear === "2020" ? "2020" : "2024"} Tongdam Computers. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            <span>An E-Max India certified enterprise</span>
            <ArrowUpRight className="size-3 text-amber-400/80" aria-hidden="true" />
          </p>
        </div>
      </div>
    </footer>
  );
}
