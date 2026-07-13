"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  Cpu,
  ChevronDown,
  Computer,
  Smartphone,
  GraduationCap,
  Scissors,
  Hotel,
  Utensils,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavLeaf = { label: string; href: string; description?: string; icon: React.ElementType };
type NavGroup = { label: string; items: NavLeaf[] };

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Services",
    items: [
      {
        label: "Computer Works",
        href: "/services/computer-works",
        description: "Sales, repair & maintenance of computers and peripherals",
        icon: Computer,
      },
      {
        label: "Mobile Hub",
        href: "/services/mobile-hub",
        description: "Mobile repairs, accessories & recharge services",
        icon: Smartphone,
      },
    ],
  },
  {
    label: "Education",
    items: [
      {
        label: "Computer Training",
        href: "/education/computer-training",
        description: "DCA, ADCA, Tally Prime, Web Development",
        icon: GraduationCap,
      },
      {
        label: "Tailoring & Fashion Design",
        href: "/education/tailoring",
        description: "Basic certificate to advanced fashion diploma",
        icon: Scissors,
      },
      {
        label: "Hotel Management",
        href: "/education/hotel-management",
        description: "1-year diploma with 100% placement guarantee",
        icon: Hotel,
      },
    ],
  },
  {
    label: "Lifestyle",
    items: [
      {
        label: "Restaurant",
        href: "/lifestyle/restaurant",
        description: "Multi-cuisine dining in Churachandpur",
        icon: Utensils,
      },
    ],
  },
];

const DIRECT_LINKS: { label: string; href: string }[] = [
  { label: "About Us", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader({ logoUrl = "" }: { logoUrl?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Logo markup: use uploaded image if set, otherwise the default Cpu icon tile.
  const LogoMark = (
    <>
      {logoUrl ? (
         
        <Image
          src={logoUrl}
          alt="Tongdam Computers logo"
          height={36}
          width={140}
          className="h-9 w-auto max-w-[140px] object-contain"
          priority
          unoptimized
        />
      ) : (
        <span className="flex size-9 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
          <Cpu className="size-5" aria-hidden="true" />
        </span>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-100 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
          aria-label="Tongdam Computers — Home"
        >
          {LogoMark}
          <span className="flex flex-col leading-tight">
            <span className="text-base font-bold tracking-tight text-foreground">
              Tongdam Computers
            </span>
            <span className="hidden text-[11px] font-medium text-emerald-700 sm:block">
              Training · Services · Lifestyle
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV_GROUPS.map((group) => (
            <DropdownMenu key={group.label}>
              <DropdownMenuTrigger asChild>
                <button
                  className="inline-flex h-9 items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-emerald-50 hover:text-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 data-[state=open]:bg-emerald-50 data-[state=open]:text-emerald-700"
                  aria-haspopup="menu"
                >
                  {group.label}
                  <ChevronDown
                    className="size-3.5 transition-transform data-[state=open]:rotate-180"
                    aria-hidden="true"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                className="w-72 p-2"
                sideOffset={6}
              >
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link
                        href={item.href}
                        className="flex items-start gap-3 rounded-md px-2 py-2 focus:bg-emerald-50"
                      >
                        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-emerald-700">
                          <Icon className="size-4" aria-hidden="true" />
                        </span>
                        <span className="flex flex-col gap-0.5">
                          <span className="text-sm font-medium text-foreground">
                            {item.label}
                          </span>
                          {item.description && (
                            <span className="text-xs text-muted-foreground">
                              {item.description}
                            </span>
                          )}
                        </span>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}

          {DIRECT_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex h-9 items-center rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-emerald-50 hover:text-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right-side actions */}
        <div className="flex items-center gap-2">
          <Button
            asChild
            className="hidden bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 sm:inline-flex"
          >
            <Link href="/education/computer-training">
              Enroll Now
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>

          {/* Mobile menu trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="size-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[88vw] max-w-sm overflow-y-auto p-0"
            >
              <SheetTitle className="sr-only">Tongdam Computers navigation</SheetTitle>
              <div className="flex items-center gap-2.5 border-b border-emerald-100 px-5 py-4">
                {LogoMark}
                <span className="flex flex-col leading-tight">
                  <span className="text-base font-bold text-foreground">
                    Tongdam Computers
                  </span>
                  <span className="text-[11px] font-medium text-emerald-700">
                    Training · Services · Lifestyle
                  </span>
                </span>
              </div>

              <nav className="flex flex-col px-3 py-4" aria-label="Mobile">
                {NAV_GROUPS.map((group) => (
                  <div key={group.label} className="mb-3">
                    <p className="px-2 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {group.label}
                    </p>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <SheetClose asChild key={item.href}>
                          <Link
                            href={item.href}
                            className="flex items-center gap-3 rounded-md px-2 py-2.5 text-sm font-medium text-foreground/90 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                          >
                            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-emerald-700">
                              <Icon className="size-4" aria-hidden="true" />
                            </span>
                            {item.label}
                          </Link>
                        </SheetClose>
                      );
                    })}
                  </div>
                ))}

                <div className="mb-3">
                  <p className="px-2 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    More
                  </p>
                  {DIRECT_LINKS.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className="block rounded-md px-2 py-2.5 text-sm font-medium text-foreground/90 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </div>

                <div className="mt-2 px-2">
                  <SheetClose asChild>
                    <Button
                      asChild
                      className={cn(
                        "w-full justify-center bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
                      )}
                    >
                      <Link href="/education/computer-training">
                        Enroll Now
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  </SheetClose>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
