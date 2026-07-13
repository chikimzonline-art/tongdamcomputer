import {
  BadgeCheck,
  Landmark,
  Building2,
  Hotel,
  UtensilsCrossed,
  Star,
  Briefcase,
  ShieldCheck,
  Award,
  Handshake,
  type LucideIcon,
} from "lucide-react";

/**
 * Available icon options for affiliation cards.
 * The key is stored in the DB; the value is the lucide component.
 */
export const AFFILIATION_ICONS: Record<string, LucideIcon> = {
  BadgeCheck,
  Landmark,
  Building2,
  Hotel,
  UtensilsCrossed,
  Star,
  Briefcase,
  ShieldCheck,
  Award,
  Handshake,
};

/** Icon key for dropdowns in the admin editor. */
export const AFFILIATION_ICON_OPTIONS = Object.keys(AFFILIATION_ICONS);

/**
 * Available accent gradient themes for affiliation cards.
 * Each maps to a Tailwind gradient class for the icon tile.
 */
export const AFFILIATION_ACCENTS: Record<string, { gradient: string; label: string }> = {
  emerald: { label: "Emerald (Green)", gradient: "from-emerald-500 to-teal-600" },
  amber: { label: "Amber (Orange)", gradient: "from-amber-500 to-amber-700" },
  violet: { label: "Violet (Purple)", gradient: "from-violet-500 to-violet-700" },
  rose: { label: "Rose (Pink)", gradient: "from-rose-500 to-pink-700" },
};

/** Accent keys for dropdowns in the admin editor. */
export const AFFILIATION_ACCENT_OPTIONS = Object.keys(AFFILIATION_ACCENTS);

/** Default accent for fallback. */
export const DEFAULT_AFFILIATION_ACCENT = AFFILIATION_ACCENTS.emerald;
