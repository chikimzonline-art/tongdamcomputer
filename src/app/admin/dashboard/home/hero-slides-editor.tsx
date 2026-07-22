"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Save, Loader2, Plus, Trash2, ChevronDown, ChevronUp,
  GripVertical, Image as ImageIcon, FolderOpen, RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { UploadButton as UTUploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/uploadthing";
import { ExistingFilePicker } from "@/components/admin/existing-file-picker";

// ===== Types =====
type SlideData = {
  id: string;
  badge: string;
  badgeIcon: string;
  title: string;
  subtitle: string;
  btn1Text: string;
  btn1Href: string;
  btn2Text: string;
  btn2Href: string;
  bgImage: string;
  cardTitle: string;
  cardIcon: string;
  cardText: string;
  cardFooterTitle: string;
  cardFooterSubtitle: string;
  cardBadge: string;
  sortOrder: number;
  isActive: boolean;
};

// Icon options matching the ICON_MAP in hero-slider.tsx
const ICON_OPTIONS = [
  "Sparkles", "ShieldCheck", "Quote", "GraduationCap", "Building",
  "UtensilsCrossed", "ChefHat", "Scissors", "Phone", "BookOpen",
  "Award", "Trophy", "Briefcase", "Package", "Coffee", "Soup", "Wrench",
];

// Default slides to seed into DB (matches the hardcoded fallback in page.tsx)
const DEFAULT_SEED_SLIDES = [
  {
    badge: "Established · Community First",
    badgeIcon: "Sparkles",
    title: "From a Local Startup to a Multi-Department Hub",
    subtitle: "Founded in 2020 by Mr. P Soiminthang Zou, Tongdam Computers delivers elite vocational training, essential public services, and lifestyle amenities — all under one trusted roof.",
    btn1Text: "Explore Our Ventures",
    btn1Href: "#departments",
    btn2Text: "Contact Us",
    btn2Href: "/contact",
    bgImage: "/institute-hero.png",
    cardTitle: "Our Mission",
    cardIcon: "Quote",
    cardText: "To uplift the local community by providing accessible digital services, quality skill-based training, and genuine customer care — all under one trusted roof.",
    cardFooterTitle: "Founded by",
    cardFooterSubtitle: "Mr. P Soiminthang Zou",
    cardBadge: "Govt. Recognised · E-Max India Affiliated",
  },
  {
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

type Props = {
  initialSlides: SlideData[];
};

const BLANK_SLIDE: Omit<SlideData, "id" | "sortOrder" | "isActive"> = {
  badge: "",
  badgeIcon: "Sparkles",
  title: "",
  subtitle: "",
  btn1Text: "",
  btn1Href: "/",
  btn2Text: "",
  btn2Href: "/",
  bgImage: "",
  cardTitle: "",
  cardIcon: "Quote",
  cardText: "",
  cardFooterTitle: "",
  cardFooterSubtitle: "",
  cardBadge: "",
};

export function HeroSlidesEditor({ initialSlides }: Props) {
  const [slides, setSlides] = useState<SlideData[]>(initialSlides);
  const [expanded, setExpanded] = useState<string | null>(
    initialSlides.length === 1 ? initialSlides[0].id : null
  );
  const [drafts, setDrafts] = useState<Record<string, Partial<SlideData>>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [pickerFor, setPickerFor] = useState<string | null>(null); // slide id
  const [newSlide, setNewSlide] = useState<Omit<SlideData, "id" | "sortOrder" | "isActive">>(BLANK_SLIDE);
  const [newPickerOpen, setNewPickerOpen] = useState(false);

  // ---- Draft helpers ----
  function getDraft(id: string): Partial<SlideData> {
    return drafts[id] ?? {};
  }
  function patchDraft(id: string, patch: Partial<SlideData>) {
    setDrafts((p) => ({ ...p, [id]: { ...p[id], ...patch } }));
  }
  function getField<K extends keyof SlideData>(slide: SlideData, id: string, key: K): SlideData[K] {
    const d = getDraft(id);
    return (key in d ? d[key] : slide[key]) as SlideData[K];
  }

  // ---- Save a slide ----
  async function saveSlide(slide: SlideData) {
    const d = getDraft(slide.id);
    if (Object.keys(d).length === 0) {
      toast.info("No changes to save.");
      return;
    }
    setSaving(slide.id);
    try {
      const res = await fetch("/api/admin/hero-slides", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: slide.id, ...d }),
      });
      if (!res.ok) throw new Error("Save failed");
      const { item } = await res.json();
      setSlides((p) => p.map((s) => (s.id === slide.id ? item : s)));
      setDrafts((p) => { const n = { ...p }; delete n[slide.id]; return n; });
      toast.success("Slide saved!");
    } catch {
      toast.error("Failed to save slide.");
    } finally {
      setSaving(null);
    }
  }

  // ---- Toggle active ----
  async function toggleActive(slide: SlideData) {
    const newVal = !slide.isActive;
    try {
      const res = await fetch("/api/admin/hero-slides", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: slide.id, isActive: newVal }),
      });
      if (!res.ok) throw new Error();
      const { item } = await res.json();
      setSlides((p) => p.map((s) => (s.id === slide.id ? item : s)));
      toast.success(newVal ? "Slide activated" : "Slide hidden");
    } catch {
      toast.error("Failed to update visibility");
    }
  }

  // ---- Reorder ----
  async function moveSlide(id: string, dir: "up" | "down") {
    const idx = slides.findIndex((s) => s.id === id);
    if (dir === "up" && idx === 0) return;
    if (dir === "down" && idx === slides.length - 1) return;
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    const reordered = [...slides];
    [reordered[idx], reordered[swapIdx]] = [reordered[swapIdx], reordered[idx]];

    // Optimistic update
    const updated = reordered.map((s, i) => ({ ...s, sortOrder: i + 1 }));
    setSlides(updated);

    // Persist both affected slides
    try {
      await Promise.all([
        fetch("/api/admin/hero-slides", {
          method: "PUT", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: updated[swapIdx].id, sortOrder: updated[swapIdx].sortOrder }),
        }),
        fetch("/api/admin/hero-slides", {
          method: "PUT", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: updated[idx].id, sortOrder: updated[idx].sortOrder }),
        }),
      ]);
      toast.success("Order updated");
    } catch {
      toast.error("Failed to reorder");
    }
  }

  // ---- Delete ----
  async function deleteSlide(id: string) {
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/hero-slides?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setSlides((p) => p.filter((s) => s.id !== id));
      if (expanded === id) setExpanded(null);
      toast.success("Slide deleted");
    } catch {
      toast.error("Failed to delete slide");
    } finally {
      setDeleting(null);
    }
  }

  // ---- Add new slide ----
  async function addSlide() {
    if (!newSlide.title || !newSlide.badge) {
      toast.error("Title and badge are required.");
      return;
    }
    setSaving("__new__");
    try {
      const res = await fetch("/api/admin/hero-slides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newSlide, sortOrder: slides.length + 1 }),
      });
      if (!res.ok) throw new Error();
      const { item } = await res.json();
      setSlides((p) => [...p, item]);
      setNewSlide(BLANK_SLIDE);
      setAdding(false);
      setExpanded(item.id);
      toast.success("Slide added!");
    } catch {
      toast.error("Failed to add slide.");
    } finally {
      setSaving(null);
    }
  }

  // ---- Seed defaults ----
  async function seedDefaults() {
    setSeeding(true);
    try {
      const results: SlideData[] = [];
      for (let i = 0; i < DEFAULT_SEED_SLIDES.length; i++) {
        const s = DEFAULT_SEED_SLIDES[i];
        const res = await fetch("/api/admin/hero-slides", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...s, sortOrder: i + 1 }),
        });
        if (!res.ok) throw new Error();
        const { item } = await res.json();
        results.push(item);
      }
      setSlides(results);
      toast.success("7 default slides added!");
    } catch {
      toast.error("Failed to seed default slides.");
    } finally {
      setSeeding(false);
    }
  }

  return (
    <Card className="border-emerald-100">
      <CardHeader className="border-b border-stone-100 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <span className="flex size-5 items-center justify-center rounded bg-emerald-100 text-xs font-bold text-emerald-700">
              {slides.length}
            </span>
            Hero Slider Slides
          </CardTitle>
          <div className="flex items-center gap-2">
            {slides.length === 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={seedDefaults}
                disabled={seeding}
                className="gap-1.5 border-amber-200 text-amber-700 hover:bg-amber-50"
              >
                {seeding ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="size-3.5" />
                )}
                Restore 7 Defaults
              </Button>
            )}
            <Button
              size="sm"
              onClick={() => { setAdding(true); setExpanded(null); }}
              className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
            >
              <Plus className="size-3.5" /> Add Slide
            </Button>
          </div>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Each slide becomes a full-screen panel in the homepage hero carousel. Only active slides are shown publicly.
        </p>
      </CardHeader>

      <CardContent className="space-y-3 pt-4">
        {/* ---- Empty state ---- */}
        {slides.length === 0 && !adding && (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-stone-300 py-10 text-center">
            <ImageIcon className="size-8 text-stone-300" />
            <p className="text-sm text-muted-foreground">No slides yet.</p>
            <p className="text-xs text-muted-foreground">
              Click <strong>Restore 7 Defaults</strong> to seed the original slides, or <strong>Add Slide</strong> to create a custom one.
            </p>
          </div>
        )}

        {/* ---- Slide list ---- */}
        {slides.map((slide, idx) => {
          const isOpen = expanded === slide.id;
          const d = getDraft(slide.id);
          const isDirty = Object.keys(d).length > 0;

          return (
            <div
              key={slide.id}
              className="rounded-lg border border-stone-200 bg-white shadow-sm"
            >
              {/* Slide header row */}
              <div className="flex items-center gap-2 px-4 py-3">
                <GripVertical className="size-4 shrink-0 text-stone-300" />

                {/* Up / Down */}
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => moveSlide(slide.id, "up")}
                    disabled={idx === 0}
                    className="rounded p-0.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600 disabled:opacity-30"
                    aria-label="Move up"
                  >
                    <ChevronUp className="size-3.5" />
                  </button>
                  <button
                    onClick={() => moveSlide(slide.id, "down")}
                    disabled={idx === slides.length - 1}
                    className="rounded p-0.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600 disabled:opacity-30"
                    aria-label="Move down"
                  >
                    <ChevronDown className="size-3.5" />
                  </button>
                </div>

                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-700">
                    {idx + 1}
                  </span>
                  <p className="truncate text-sm font-medium text-stone-800">
                    {getField(slide, slide.id, "title") || <span className="italic text-stone-400">Untitled</span>}
                  </p>
                  {!slide.isActive && (
                    <Badge variant="outline" className="shrink-0 text-xs text-stone-400">
                      Hidden
                    </Badge>
                  )}
                  {isDirty && (
                    <Badge className="shrink-0 bg-amber-100 text-xs text-amber-700">
                      Unsaved
                    </Badge>
                  )}
                </div>

                {/* Active toggle */}
                <Switch
                  checked={slide.isActive}
                  onCheckedChange={() => toggleActive(slide)}
                  aria-label="Toggle slide visibility"
                />

                {/* Expand toggle */}
                <button
                  onClick={() => setExpanded(isOpen ? null : slide.id)}
                  className="ml-1 rounded p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
                  aria-label={isOpen ? "Collapse" : "Expand"}
                >
                  {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                </button>
              </div>

              {/* Expanded form */}
              {isOpen && (
                <div className="border-t border-stone-100 px-4 pb-4 pt-4 space-y-5">
                  {/* Section: Badge */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Badge Text</Label>
                      <Input
                        value={String(getField(slide, slide.id, "badge"))}
                        onChange={(e) => patchDraft(slide.id, { badge: e.target.value })}
                        placeholder="e.g. Govt. Recognized · 100% Placement"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Badge Icon</Label>
                      <Select
                        value={String(getField(slide, slide.id, "badgeIcon"))}
                        onValueChange={(v) => patchDraft(slide.id, { badgeIcon: v })}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {ICON_OPTIONS.map((icon) => (
                            <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Section: Title & Subtitle */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Title</Label>
                    <Input
                      value={String(getField(slide, slide.id, "title"))}
                      onChange={(e) => patchDraft(slide.id, { title: e.target.value })}
                      placeholder="Main heading of the slide"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Subtitle</Label>
                    <Textarea
                      rows={3}
                      value={String(getField(slide, slide.id, "subtitle"))}
                      onChange={(e) => patchDraft(slide.id, { subtitle: e.target.value })}
                      placeholder="Supporting description text"
                    />
                  </div>

                  {/* Section: Buttons */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Button 1 — Text</Label>
                      <Input
                        value={String(getField(slide, slide.id, "btn1Text"))}
                        onChange={(e) => patchDraft(slide.id, { btn1Text: e.target.value })}
                        placeholder="e.g. Explore Courses"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Button 1 — Link</Label>
                      <Input
                        value={String(getField(slide, slide.id, "btn1Href"))}
                        onChange={(e) => patchDraft(slide.id, { btn1Href: e.target.value })}
                        placeholder="/education/computer-training"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Button 2 — Text</Label>
                      <Input
                        value={String(getField(slide, slide.id, "btn2Text"))}
                        onChange={(e) => patchDraft(slide.id, { btn2Text: e.target.value })}
                        placeholder="e.g. Apply Now"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Button 2 — Link</Label>
                      <Input
                        value={String(getField(slide, slide.id, "btn2Href"))}
                        onChange={(e) => patchDraft(slide.id, { btn2Href: e.target.value })}
                        placeholder="/contact"
                      />
                    </div>
                  </div>

                  {/* Section: Background Image */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Background Image</Label>
                    {getField(slide, slide.id, "bgImage") && (
                      <div className="relative h-28 w-full overflow-hidden rounded-lg border border-stone-200 bg-stone-100">
                        <img
                          src={String(getField(slide, slide.id, "bgImage"))}
                          alt="Slide background preview"
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                    )}
                    {/* Manual URL input */}
                    <Input
                      value={String(getField(slide, slide.id, "bgImage"))}
                      onChange={(e) => patchDraft(slide.id, { bgImage: e.target.value })}
                      placeholder="Paste URL or path e.g. /institute-hero.png"
                    />
                    <div className="flex flex-wrap gap-2">
                      {/* Upload new */}
                      <UTUploadButton<OurFileRouter, "assetUploader">
                        endpoint="assetUploader"
                        onClientUploadComplete={(res) => {
                          if (res && res.length > 0) {
                            patchDraft(slide.id, { bgImage: res[0].url });
                            toast.success("Image uploaded — click Save to apply.");
                          }
                        }}
                        onUploadError={(err) => { toast.error(err.message); }}
                        appearance={{
                          button:
                            "data-[state=ready]:bg-stone-700 data-[state=ready]:text-white data-[state=ready]:hover:bg-stone-800 data-[state=uploading]:bg-stone-600/80 data-[state=uploading]:text-white data-[state=uploading]:cursor-not-allowed data-[state=readying]:bg-stone-400 data-[state=readying]:text-white rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
                          container: "flex items-center",
                          allowedContent: "hidden",
                        }}
                        content={{ button({ ready }) { return ready ? "Upload New Image" : "Preparing…"; } }}
                      />
                      {/* Pick from existing */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-xs"
                        onClick={() => setPickerFor(slide.id)}
                      >
                        <FolderOpen className="size-3.5" />
                        Select from uploads
                      </Button>
                    </div>
                  </div>

                  {/* Section: Card */}
                  <div className="rounded-lg border border-stone-100 bg-stone-50 p-4 space-y-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Info Card (right-side panel)
                    </p>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Card Title</Label>
                        <Input
                          value={String(getField(slide, slide.id, "cardTitle"))}
                          onChange={(e) => patchDraft(slide.id, { cardTitle: e.target.value })}
                          placeholder="e.g. Our Mission"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Card Icon</Label>
                        <Select
                          value={String(getField(slide, slide.id, "cardIcon"))}
                          onValueChange={(v) => patchDraft(slide.id, { cardIcon: v })}
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {ICON_OPTIONS.map((icon) => (
                              <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Card Text</Label>
                      <Textarea
                        rows={3}
                        value={String(getField(slide, slide.id, "cardText"))}
                        onChange={(e) => patchDraft(slide.id, { cardText: e.target.value })}
                        placeholder="Descriptive text shown in the card"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Card Footer — Label</Label>
                        <Input
                          value={String(getField(slide, slide.id, "cardFooterTitle"))}
                          onChange={(e) => patchDraft(slide.id, { cardFooterTitle: e.target.value })}
                          placeholder="e.g. Founded by"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Card Footer — Value</Label>
                        <Input
                          value={String(getField(slide, slide.id, "cardFooterSubtitle"))}
                          onChange={(e) => patchDraft(slide.id, { cardFooterSubtitle: e.target.value })}
                          placeholder="e.g. Mr. P Soiminthang Zou"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Card Badge</Label>
                      <Input
                        value={String(getField(slide, slide.id, "cardBadge"))}
                        onChange={(e) => patchDraft(slide.id, { cardBadge: e.target.value })}
                        placeholder="e.g. Govt. Recognised · E-Max India Affiliated"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-1">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={deleting === slide.id}
                          className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          {deleting === slide.id ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="size-3.5" />
                          )}
                          Delete Slide
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this slide?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently remove &quot;{slide.title}&quot; from the carousel. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteSlide(slide.id)}
                            className="bg-destructive text-white hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <Button
                      size="sm"
                      onClick={() => saveSlide(slide)}
                      disabled={saving === slide.id || !isDirty}
                      className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      {saving === slide.id ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Save className="size-3.5" />
                      )}
                      Save Slide
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* ---- Add new slide form ---- */}
        {adding && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/30 p-4 space-y-4">
            <p className="text-sm font-semibold text-emerald-800">New Slide</p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Badge Text <span className="text-red-500">*</span></Label>
                <Input
                  value={newSlide.badge}
                  onChange={(e) => setNewSlide((p) => ({ ...p, badge: e.target.value }))}
                  placeholder="e.g. New Feature · Coming Soon"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Badge Icon</Label>
                <Select value={newSlide.badgeIcon} onValueChange={(v) => setNewSlide((p) => ({ ...p, badgeIcon: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ICON_OPTIONS.map((icon) => (
                      <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Title <span className="text-red-500">*</span></Label>
              <Input
                value={newSlide.title}
                onChange={(e) => setNewSlide((p) => ({ ...p, title: e.target.value }))}
                placeholder="Main heading"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Subtitle</Label>
              <Textarea rows={2} value={newSlide.subtitle} onChange={(e) => setNewSlide((p) => ({ ...p, subtitle: e.target.value }))} placeholder="Supporting description" />
            </div>

            {/* Background image for new slide */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Background Image</Label>
              {newSlide.bgImage && (
                <div className="relative h-24 w-full overflow-hidden rounded-lg border border-stone-200 bg-stone-100">
                  <img src={newSlide.bgImage} alt="Preview" className="h-full w-full object-cover object-center" />
                </div>
              )}
              <Input
                value={newSlide.bgImage}
                onChange={(e) => setNewSlide((p) => ({ ...p, bgImage: e.target.value }))}
                placeholder="Paste URL or path e.g. /institute-hero.png"
              />
              <div className="flex flex-wrap gap-2">
                <UTUploadButton<OurFileRouter, "assetUploader">
                  endpoint="assetUploader"
                  onClientUploadComplete={(res) => {
                    if (res && res.length > 0) setNewSlide((p) => ({ ...p, bgImage: res[0].url }));
                  }}
                  onUploadError={(err) => { toast.error(err.message); }}
                  appearance={{
                    button:
                      "data-[state=ready]:bg-stone-700 data-[state=ready]:text-white data-[state=ready]:hover:bg-stone-800 data-[state=uploading]:bg-stone-600/80 data-[state=uploading]:text-white data-[state=uploading]:cursor-not-allowed data-[state=readying]:bg-stone-400 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
                    container: "flex items-center",
                    allowedContent: "hidden",
                  }}
                  content={{ button({ ready }) { return ready ? "Upload Image" : "Preparing…"; } }}
                />
                <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => setNewPickerOpen(true)}>
                  <FolderOpen className="size-3.5" /> Select from uploads
                </Button>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-1">
              <Button variant="outline" size="sm" onClick={() => { setAdding(false); setNewSlide(BLANK_SLIDE); }}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={addSlide}
                disabled={saving === "__new__"}
                className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
              >
                {saving === "__new__" ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
                Add Slide
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* ---- Existing file picker (for editing existing slides) ---- */}
      <ExistingFilePicker
        open={pickerFor !== null}
        onClose={() => setPickerFor(null)}
        onSelect={(selected) => {
          if (!selected.length || !pickerFor) return;
          patchDraft(pickerFor, { bgImage: selected[0].url });
          toast.success(`Selected "${selected[0].name}" — click Save to apply.`);
        }}
      />

      {/* ---- Existing file picker (for new slide form) ---- */}
      <ExistingFilePicker
        open={newPickerOpen}
        onClose={() => setNewPickerOpen(false)}
        onSelect={(selected) => {
          if (!selected.length) return;
          setNewSlide((p) => ({ ...p, bgImage: selected[0].url }));
          toast.success(`Selected "${selected[0].name}"`);
        }}
      />
    </Card>
  );
}
