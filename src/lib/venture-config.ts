import {
  Computer,
  GraduationCap,
  Scissors,
  Hotel,
  Utensils,
  Wrench,
  Smartphone,
  Briefcase,
  type LucideIcon,
} from "lucide-react";

/**
 * Available icon options for venture cards.
 * The key is stored in the DB; the value is the lucide component.
 */
export const VENTURE_ICONS: Record<string, LucideIcon> = {
  Computer,
  GraduationCap,
  Scissors,
  Hotel,
  Utensils,
  Wrench,
  Smartphone,
  Briefcase,
};

/** Icon keys for dropdowns in the admin editor. */
export const VENTURE_ICON_OPTIONS = Object.keys(VENTURE_ICONS);

/**
 * Available accent color themes for venture cards.
 * Each maps to the Tailwind classes needed for the bar, icon bg/text,
 * badge bg/text, and feature checkmark dot.
 */
export const VENTURE_ACCENTS: Record<
  string,
  { bar: string; iconBg: string; iconText: string; badgeBg: string; badgeText: string; dot: string; label: string }
> = {
  emerald: {
    label: "Emerald (Green)",
    bar: "bg-emerald-500",
    iconBg: "bg-emerald-50",
    iconText: "text-emerald-600",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-700",
    dot: "text-emerald-500",
  },
  pink: {
    label: "Pink",
    bar: "bg-pink-500",
    iconBg: "bg-pink-50",
    iconText: "text-pink-600",
    badgeBg: "bg-pink-50",
    badgeText: "text-pink-700",
    dot: "text-pink-500",
  },
  amber: {
    label: "Amber (Orange)",
    bar: "bg-amber-500",
    iconBg: "bg-amber-50",
    iconText: "text-amber-600",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-700",
    dot: "text-amber-500",
  },
  violet: {
    label: "Violet (Purple)",
    bar: "bg-violet-500",
    iconBg: "bg-violet-50",
    iconText: "text-violet-600",
    badgeBg: "bg-violet-50",
    badgeText: "text-violet-700",
    dot: "text-violet-500",
  },
};

/** Accent keys for dropdowns in the admin editor. */
export const VENTURE_ACCENT_OPTIONS = Object.keys(VENTURE_ACCENTS);

/** Default accent for fallback. */
export const DEFAULT_ACCENT = VENTURE_ACCENTS.emerald;
