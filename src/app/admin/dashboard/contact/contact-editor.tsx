"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Save, Loader2, MapPin, Phone, Mail, Clock, Navigation } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type Props = {
  content: Record<string, string>;
};

const FIELDS: {
  key: string;
  label: string;
  type: "input" | "textarea";
  rows?: number;
  placeholder?: string;
  hint?: string;
}[] = [
  { key: "contact.heroTitle", label: "Hero Title", type: "input", placeholder: "Contact Us" },
  { key: "contact.heroSubtitle", label: "Hero Subtitle", type: "textarea", rows: 2, placeholder: "Visit our office, call, or send us a query…" },
  { key: "contact.phone1", label: "Primary Phone", type: "input", placeholder: "+91 98765 43210" },
  { key: "contact.phone2", label: "Secondary Phone", type: "input", placeholder: "+91 91234 56789" },
  { key: "contact.email", label: "Email", type: "input", placeholder: "info@tongdamcomputers.com" },
  { key: "contact.address", label: "Address", type: "textarea", rows: 2, placeholder: "Tongdam Computers, Main Market Road, Churachandpur, Manipur 795128, India" },
  { key: "contact.workingHours", label: "Working Hours", type: "input", placeholder: "Mon – Sat · 9:00 AM – 6:00 PM" },
  { key: "contact.workingHoursHint", label: "Working Hours Hint", type: "input", placeholder: "Closed on Sundays & public holidays" },
  { key: "contact.infoHeading", label: "Info Section — Heading", type: "input", placeholder: "Get in touch" },
  { key: "contact.infoSubtitle", label: "Info Section — Subtitle", type: "textarea", rows: 2, placeholder: "Call, email, or simply walk in…" },
  { key: "contact.mapHeading", label: "Map Section — Heading", type: "input", placeholder: "On the map" },
  { key: "contact.mapSubtitle", label: "Map Section — Subtitle", type: "textarea", rows: 2, placeholder: "We are located in the heart of Churachandpur, Manipur." },
  {
    key: "contact.mapEmbedUrl",
    label: "Google Maps Embed URL",
    type: "input",
    placeholder: "https://www.google.com/maps?q=Churachandpur,Manipur,India&output=embed",
    hint: "To get a custom embed URL: go to Google Maps → search your location → click 'Share' → 'Embed a map' → copy the src URL. Or use the format: https://www.google.com/maps?q=YOUR_ADDRESS&output=embed",
  },
];

export function ContactEditor({ content: initialContent }: Props) {
  const [content, setContent] = useState<Record<string, string>>(initialContent);
  const [dirtyKeys, setDirtyKeys] = useState<Set<string>>(new Set());
  const [savingKey, setSavingKey] = useState<string | null>(null);

  function updateContent(key: string, value: string) {
    setContent((p) => ({ ...p, [key]: value }));
    setDirtyKeys((p) => new Set(p).add(key));
  }

  async function saveContent(key: string) {
    setSavingKey(key);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: content[key] ?? "", category: "contact" }),
      });
      if (!res.ok) throw new Error();
      setDirtyKeys((p) => {
        const n = new Set(p);
        n.delete(key);
        return n;
      });
      toast.success("Saved");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSavingKey(null);
    }
  }

  async function saveAll() {
    const keys = Array.from(dirtyKeys);
    if (keys.length === 0) {
      toast.info("Nothing to save");
      return;
    }
    setSavingKey("all");
    try {
      await Promise.all(
        keys.map((key) =>
          fetch("/api/admin/content", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key, value: content[key] ?? "", category: "contact" }),
          })
        )
      );
      setDirtyKeys(new Set());
      toast.success(`Saved ${keys.length} field${keys.length === 1 ? "" : "s"}`);
    } catch {
      toast.error("Failed to save some fields");
    } finally {
      setSavingKey(null);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Contact Information</CardTitle>
            <div className="flex items-center gap-2">
              {dirtyKeys.size > 0 && (
                <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-500/30">
                  {dirtyKeys.size} unsaved
                </span>
              )}
              <Button
                size="sm"
                onClick={saveAll}
                disabled={dirtyKeys.size === 0 || savingKey === "all"}
                className="gap-1.5 bg-emerald-600 hover:bg-emerald-700"
              >
                {savingKey === "all" ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
                Save All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {FIELDS.map((field) => (
            <div key={field.key}>
              <Label className="text-xs">{field.label}</Label>
              <div className="mt-1 flex gap-2">
                {field.type === "input" ? (
                  <Input
                    value={content[field.key] ?? ""}
                    onChange={(e) => updateContent(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="flex-1"
                  />
                ) : (
                  <Textarea
                    value={content[field.key] ?? ""}
                    onChange={(e) => updateContent(field.key, e.target.value)}
                    rows={field.rows ?? 3}
                    placeholder={field.placeholder}
                    className="flex-1"
                  />
                )}
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!dirtyKeys.has(field.key) || savingKey === field.key}
                  onClick={() => saveContent(field.key)}
                  className="shrink-0"
                >
                  {savingKey === field.key ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
                </Button>
              </div>
              {field.hint && (
                <p className="mt-1 text-xs text-muted-foreground">{field.hint}</p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Live preview of the map */}
      {content["contact.mapEmbedUrl"] && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Navigation className="size-4 text-emerald-600" />
              Map Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-gray-200">
              <iframe
                title="Map preview"
                src={content["contact.mapEmbedUrl"]}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 size-full border-0"
                allowFullScreen
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
