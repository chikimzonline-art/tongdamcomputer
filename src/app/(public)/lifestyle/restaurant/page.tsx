import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  Sparkles,
  Utensils,
  Soup,
  Coffee,
  Cake,
  Clock,
  MapPin,
  Phone,
  ChefHat,
  Leaf,
  Drumstick,
  Info,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { getMenuGrouped, getSiteContentMap } from "@/lib/data";
import { ReservationForm } from "./reservation-form";

/** A single menu row styled like a printed menu with a dotted leader. */
function MenuRow({
  name,
  description,
  price,
  isVeg,
}: {
  name: string;
  description?: string;
  price: string;
  isVeg: boolean;
}) {
  return (
    <article className="py-3.5">
      <div className="flex items-baseline gap-2.5">
        {/* Veg / Non-veg indicator */}
        <span
          aria-label={isVeg ? "Vegetarian" : "Non-vegetarian"}
          title={isVeg ? "Vegetarian" : "Non-vegetarian"}
          className={cn(
            "mt-[5px] inline-block size-2.5 shrink-0 rounded-sm border",
            isVeg
              ? "border-emerald-600 bg-emerald-500"
              : "border-rose-600 bg-rose-500",
          )}
        />
        <h3 className="text-base font-semibold text-foreground sm:text-lg">
          {name}
        </h3>
        {/* Dotted leader */}
        <span
          aria-hidden="true"
          className="mx-1 -translate-y-1 flex-1 border-b-2 border-dotted border-muted-foreground/30"
        />
        <span className="shrink-0 text-base font-bold text-emerald-700 sm:text-lg">
          {price}
        </span>
      </div>
      {description ? (
        <p className="mt-1 pl-[22px] text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </article>
  );
}

const HERO_ICONS = [
  { icon: Utensils, label: "Meals" },
  { icon: Soup, label: "Soups" },
  { icon: Coffee, label: "Beverages" },
  { icon: Cake, label: "Desserts" },
];

const QUICK_INFO = [
  {
    icon: Clock,
    title: "Opening Hours",
    value: "Mon–Sun, 8:00 AM – 10:00 PM",
  },
  {
    icon: MapPin,
    title: "Location",
    value: "Inside Tongdam Complex",
  },
  {
    icon: Phone,
    title: "Reservations",
    value: "Call to book a table",
  },
  {
    icon: Sparkles,
    title: "Daily Specials",
    value: "Ask staff for today's special",
  },
];

/**
 * Pick three "Today's Specials" from the menu. Preference order:
 * 1. A curated list of well-known dish names (if present in DB).
 * 2. Fallback: first three Mains items.
 * 3. Final fallback: first three items overall.
 */
function pickSpecials(
  grouped: Record<string, Array<{ name: string; description?: string; price: string; isVeg: boolean }>>,
) {
  const all = Object.values(grouped).flat();
  if (all.length === 0) return [];

  const preferredNames = [
    "Chicken Curry",
    "Paneer Butter Masala",
    "Fish Curry",
  ];

  const picks: typeof all = [];
  for (const name of preferredNames) {
    const found = all.find(
      (i) => i.name.toLowerCase() === name.toLowerCase(),
    );
    if (found && picks.length < 3) picks.push(found);
  }

  if (picks.length < 3) {
    const mains = grouped["Mains"] ?? [];
    const source = mains.length > 0 ? mains : all;
    for (const item of source) {
      if (picks.find((p) => p.name === item.name)) continue;
      if (picks.length >= 3) break;
      picks.push(item);
    }
  }

  return picks.slice(0, 3).map((item) => ({
    name: item.name,
    description: item.description ?? "",
    price: item.price,
    isVeg: item.isVeg,
  }));
}

export default async function RestaurantPage() {
  const [grouped, content] = await Promise.all([
    getMenuGrouped(),
    getSiteContentMap(),
  ]);
  const phone = content["contact.phone1"] ?? "";

  const categories = Object.keys(grouped);
  const specials = pickSpecials(grouped);

  return (
    <>
      {/* ============== HERO HEADER ============== */}
      <section
        aria-labelledby="rest-hero-heading"
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
                <span className="text-emerald-50/80">Lifestyle</span>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="size-3.5" />
              </li>
              <li className="font-medium text-white" aria-current="page">
                Restaurant
              </li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <Badge
              variant="secondary"
              className="mb-5 gap-1.5 border-emerald-300/30 bg-white/10 px-3 py-1 text-xs font-medium text-emerald-50 backdrop-blur"
            >
              <Utensils className="size-3.5 text-amber-300" aria-hidden="true" />
              Tongdam Lifestyle · Dining
            </Badge>
            <h1
              id="rest-hero-heading"
              className="text-4xl font-bold tracking-tight drop-shadow-sm sm:text-5xl"
            >
              Tongdam Restaurant
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-emerald-50/90 sm:text-lg">
              Fresh, flavorful, and affordable — from quick bites to full
              thalis. Dine in or reserve your table.
            </p>

            {/* Hero badges */}
            <ul className="mt-7 flex flex-wrap gap-2.5">
              {[
                "Pure Veg & Non-Veg",
                "Hygienic Kitchen",
                "Affordable Pricing",
              ].map((label) => (
                <li key={label}>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur sm:text-sm">
                    <Sparkles
                      className="size-3.5 text-amber-300"
                      aria-hidden="true"
                    />
                    {label}
                  </span>
                </li>
              ))}
            </ul>

            {/* Decorative food icon row */}
            <ul className="mt-8 flex flex-wrap items-center gap-3">
              {HERO_ICONS.map((it) => {
                const Icon = it.icon;
                return (
                  <li
                    key={it.label}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-emerald-50/90 backdrop-blur sm:text-sm"
                  >
                    <Icon className="size-4 text-amber-300" aria-hidden="true" />
                    <span>{it.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* ============== QUICK INFO BAR ============== */}
      <section
        aria-label="Restaurant quick info"
        className="border-b border-emerald-100 bg-white"
      >
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK_INFO.map((info) => {
              const Icon = info.icon;
              const isPhone = info.icon === Phone;
              const content = (
                <>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {info.title}
                    </span>
                    <span className="block truncate text-sm font-semibold text-foreground">
                      {info.value}
                    </span>
                  </span>
                </>
              );
              return (
                <li key={info.title}>
                  {isPhone && phone ? (
                    <a
                      href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                      className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 transition-colors hover:bg-emerald-50"
                    >
                      {content}
                    </a>
                  ) : (
                    <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
                      {content}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ============== DIGITAL MENU ============== */}
      <section
        id="menu"
        aria-labelledby="rest-menu-heading"
        className="scroll-mt-24 bg-emerald-50/60 py-16 lg:py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Badge
              variant="secondary"
              className="mb-3 gap-1 border-emerald-200 bg-emerald-100 text-emerald-700"
            >
              <Utensils className="size-3.5" aria-hidden="true" />
              Digital Menu
            </Badge>
            <h2
              id="rest-menu-heading"
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              Explore our menu
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Browse by category — tap a tab to switch. Veg items are marked
              green, non-veg in rose.
            </p>
          </div>

          {categories.length === 0 ? (
            <Card className="mt-10 border-emerald-100 bg-white py-0">
              <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Soup className="size-6" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-semibold text-foreground">
                  Our menu is being refreshed
                </h3>
                <p className="max-w-md text-sm text-muted-foreground">
                  No menu items are available right now. Please check back
                  soon or call us to hear today&apos;s offerings.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Tabs
              defaultValue={categories[0]}
              className="mt-10 w-full"
            >
              <TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-emerald-100/70 p-1.5">
                {categories.map((cat) => (
                  <TabsTrigger
                    key={cat}
                    value={cat}
                    className="group rounded-md px-4 py-1.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm"
                  >
                    {cat}
                    <span className="ml-1.5 rounded-full bg-emerald-200/70 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800 group-data-[state=active]:bg-emerald-100 group-data-[state=active]:text-emerald-700">
                      {grouped[cat].length}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((cat) => {
                const items = grouped[cat];
                return (
                  <TabsContent
                    key={cat}
                    value={cat}
                    className="mt-6"
                  >
                    {items.length === 0 ? (
                      <Card className="border-emerald-100 bg-white py-0">
                        <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
                          <span className="flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                            <Soup className="size-6" aria-hidden="true" />
                          </span>
                          <h3 className="text-lg font-semibold text-foreground">
                            No items in this category yet
                          </h3>
                          <p className="max-w-md text-sm text-muted-foreground">
                            We&apos;re adding new dishes to {cat}. Please
                            check back soon.
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card className="border-emerald-100 bg-white py-0">
                        <CardContent className="p-6 sm:p-8">
                          <div className="mb-4 flex items-center justify-between border-b border-emerald-100 pb-3">
                            <h3 className="flex items-center gap-2 text-xl font-semibold text-foreground">
                              <ChefHat
                                className="size-5 text-emerald-600"
                                aria-hidden="true"
                              />
                              {cat}
                            </h3>
                            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                              {items.length}{" "}
                              {items.length === 1 ? "dish" : "dishes"}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 gap-x-10 divide-y divide-emerald-50 lg:grid-cols-2 lg:divide-y-0">
                            {items.map((item) => (
                              <MenuRow
                                key={item.id}
                                name={item.name}
                                description={item.description ?? ""}
                                price={item.price}
                                isVeg={item.isVeg}
                              />
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                );
              })}
            </Tabs>
          )}

          {/* Menu note */}
          <p className="mt-6 flex items-start gap-2 text-xs text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden="true" />
            <span>
              Prices are inclusive of all taxes. Menu items are updated
              regularly — please confirm availability at the counter.
            </span>
          </p>
        </div>
      </section>

      {/* ============== TODAY'S SPECIALS ============== */}
      {specials.length > 0 ? (
        <section
          aria-labelledby="rest-specials-heading"
          className="bg-white py-16 lg:py-20"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <Badge
                variant="secondary"
                className="mb-3 gap-1 border-amber-200 bg-amber-100 text-amber-700"
              >
                <Sparkles className="size-3.5" aria-hidden="true" />
                Chef&apos;s Recommendation
              </Badge>
              <h2
                id="rest-specials-heading"
                className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
              >
                Today&apos;s Specials
              </h2>
              <p className="mt-4 text-base text-muted-foreground">
                A handpicked selection our chef recommends you try today.
              </p>
            </div>

            <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {specials.map((item, idx) => (
                <li key={item.name}>
                  <Card className="group flex h-full flex-col overflow-hidden border-amber-200 bg-gradient-to-br from-amber-50 to-white py-0 transition-all duration-200 hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-100/70">
                    <CardContent className="flex flex-1 flex-col p-6">
                      <div className="mb-4 flex items-center justify-between">
                        <span className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-sm">
                          {item.isVeg ? (
                            <Leaf className="size-6" aria-hidden="true" />
                          ) : (
                            <Drumstick className="size-6" aria-hidden="true" />
                          )}
                        </span>
                        <Badge
                          variant="outline"
                          className="border-amber-300 bg-white text-amber-700"
                        >
                          Special #{idx + 1}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {item.name}
                        </h3>
                        <span
                          aria-label={item.isVeg ? "Vegetarian" : "Non-vegetarian"}
                          title={item.isVeg ? "Vegetarian" : "Non-vegetarian"}
                          className={cn(
                            "inline-block size-2.5 rounded-sm border",
                            item.isVeg
                              ? "border-emerald-600 bg-emerald-500"
                              : "border-rose-600 bg-rose-500",
                          )}
                        />
                      </div>
                      {item.description ? (
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      ) : null}
                      <div className="mt-5 flex items-center justify-between border-t border-amber-100 pt-4">
                        <span className="text-xs font-medium uppercase tracking-wide text-amber-700">
                          Today only
                        </span>
                        <span className="text-lg font-bold text-emerald-700">
                          {item.price}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* ============== RESERVATION ============== */}
      <section
        id="reserve"
        aria-labelledby="rest-reserve-heading"
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
                <Utensils className="size-3.5" aria-hidden="true" />
                Reserve a Table
              </Badge>
              <h2
                id="rest-reserve-heading"
                className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
              >
                Book your seat at Tongdam Restaurant
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Planning a meal with family or friends? Send us a quick
                reservation request and we&apos;ll hold a table for you.
                Walk-ins are always welcome too.
              </p>

              <div className="mt-6 space-y-3">
                {phone ? (
                  <a
                    href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                    className="flex items-center gap-3 rounded-lg border border-emerald-100 bg-white p-3 transition-colors hover:bg-emerald-50"
                  >
                    <span className="flex size-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
                      <Phone className="size-4" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Call to reserve
                      </span>
                      <span className="block text-sm font-semibold text-foreground">
                        {phone}
                      </span>
                    </span>
                  </a>
                ) : null}
                <div className="flex items-center gap-3 rounded-lg border border-emerald-100 bg-white p-3">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
                    <Clock className="size-4" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Open daily
                    </span>
                    <span className="block text-sm font-semibold text-foreground">
                      8:00 AM – 10:00 PM
                    </span>
                  </span>
                </div>
              </div>

              <Button
                asChild
                variant="outline"
                className="mt-6 w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 sm:w-auto"
              >
                <Link href="#menu">
                  View the menu
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-3">
              <Card className="border-emerald-100 bg-white py-0">
                <CardContent className="p-6 sm:p-8">
                  <ReservationForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
