import {
  Briefcase,
  Users,
  BookOpen,
  Trophy,
  CalendarCheck,
  IdCard,
  Landmark,
  Fingerprint,
  Printer,
  FileText,
  FileCheck,
  Wrench,
  Computer,
  GraduationCap,
  Scissors,
  Hotel,
  Utensils,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

/**
 * Icon options shared by Stats, Quick Actions, and Essential Services.
 */
export const HOME_ICONS: Record<string, LucideIcon> = {
  Briefcase,
  Users,
  BookOpen,
  Trophy,
  CalendarCheck,
  IdCard,
  Landmark,
  Fingerprint,
  Printer,
  FileText,
  FileCheck,
  Wrench,
  Computer,
  GraduationCap,
  Scissors,
  Hotel,
  Utensils,
  Smartphone,
};

export const HOME_ICON_OPTIONS = Object.keys(HOME_ICONS);

/**
 * Accent color themes for Essential Service cards.
 * Reuses the same structure as the affiliation accents.
 */
export const HOME_ACCENTS: Record<
  string,
  { iconBg: string; iconText: string; dot: string; link: string; label: string }
> = {
  emerald: {
    label: "Emerald (Green)",
    iconBg: "bg-emerald-500",
    iconText: "text-white",
    dot: "text-emerald-500",
    link: "text-emerald-600",
  },
  amber: {
    label: "Amber (Orange)",
    iconBg: "bg-amber-500",
    iconText: "text-white",
    dot: "text-amber-500",
    link: "text-amber-600",
  },
  pink: {
    label: "Pink",
    iconBg: "bg-pink-500",
    iconText: "text-white",
    dot: "text-pink-500",
    link: "text-pink-600",
  },
  violet: {
    label: "Violet (Purple)",
    iconBg: "bg-violet-500",
    iconText: "text-white",
    dot: "text-violet-500",
    link: "text-violet-600",
  },
};

export const HOME_ACCENT_OPTIONS = Object.keys(HOME_ACCENTS);
